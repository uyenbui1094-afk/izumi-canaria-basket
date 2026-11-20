import React, { useMemo, useRef, useState } from 'react';
import { AlertTriangle, ArrowDownToLine, Calculator, Check, ChevronDown, FileSpreadsheet, MapPin, Minus, Plus, Search, Upload, ZoomIn, ZoomOut } from 'lucide-react';
import * as XLSX from 'xlsx';
import { calculatePrice, formatVND } from './lib/pricing.js';
import { VERIFIED_POSITIONS } from './data/verifiedPositions.js';
import './crm.css';

const STORAGE_KEY = 'izumi-la4-basket-v1';
const ZONES = ['Zone 1.1', 'Zone 1.2', 'Zone 1.3', 'Zone 2.2', 'Zone 3.2'];
const TYPES = ['Nhà phố vườn', 'Biệt thự song lập'];
const PTTT_BY_ZONE = { 'Zone 1.1': ['PTTT 1', 'PTTT 2', 'PTTT 3'], 'Zone 1.2': [], 'Zone 1.3': [], 'Zone 2.2': [], 'Zone 3.2': [] };
const DISCOUNT_OPTIONS = [
  { id: 'earlyBird', label: 'Early Bird', rate: null },
  { id: 'event', label: 'Ưu đãi sự kiện', rate: null },
  { id: 'club', label: 'Nam Long Club', rate: null },
  { id: 'interior', label: 'Gói nội thất', rate: 0.12, note: '12% — không quy đổi tiền mặt' },
];
const BANK_OPTIONS = [{ id: 'accept', label: 'Nhận bảo lãnh', rate: 0 }, { id: 'decline', label: 'Từ chối bảo lãnh', rate: 0.005 }];
const INITIAL_UNITS = [];
const money = (value) => formatVND(value);
const titleCase = (s) => String(s ?? '').trim();
const normalize = (s) => String(s ?? '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/đ/g, 'd').replace(/[^a-z0-9]/g, '');

function loadUnits() {
  try { const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null'); return Array.isArray(saved) ? saved : INITIAL_UNITS; }
  catch { return INITIAL_UNITS; }
}
function pick(row, aliases) {
  const keys = Object.keys(row);
  for (const alias of aliases) {
    const found = keys.find((key) => normalize(key) === normalize(alias));
    if (found != null && row[found] != null && row[found] !== '') return row[found];
  }
  return '';
}
function numeric(value) {
  if (typeof value === 'number') return value;
  const parsed = Number(String(value ?? '').replace(/[^\d,.-]/g, '').replace(/\.(?=\d{3}(?:\D|$))/g, '').replace(',', '.'));
  return Number.isFinite(parsed) ? parsed : 0;
}
function parseWorkbook(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Không đọc được file.'));
    reader.onload = () => {
      try {
        let rows;
        if (/\.csv$/i.test(file.name)) {
          const text = new TextDecoder('utf-8').decode(reader.result);
          rows = XLSX.utils.sheet_to_json(XLSX.read(text, { type: 'string' }).Sheets[XLSX.read(text, { type: 'string' }).SheetNames[0]], { defval: '' });
        } else {
          const workbook = XLSX.read(reader.result, { type: 'array', cellDates: true });
          const sheet = workbook.Sheets[workbook.SheetNames[0]];
          rows = XLSX.utils.sheet_to_json(sheet, { defval: '' });
        }
        const parsed = rows.map((row) => {
          const code = titleCase(pick(row, ['Mã sản phẩm', 'Mã căn', 'Mã lô', 'Mã sản phẩm / mã căn', 'Product code', 'Code'])).toUpperCase();
          if (!code) return null;
          const price = numeric(pick(row, ['Giá bán dự kiến', 'Giá niêm yết', 'Giá niêm yết gốc', 'Giá trước chiết khấu', 'Đơn giá', 'Price']));
          const rawType = titleCase(pick(row, ['Loại sản phẩm', 'Loại hình', 'Loại căn', 'Product type']));
          return {
            code,
            zone: titleCase(pick(row, ['Zone', 'Phân khu'])) || '',
            block: titleCase(pick(row, ['Dãy', 'Block', 'Cụm'])),
            lotNumber: titleCase(pick(row, ['Số lô', 'Số căn', 'Lot number'])),
            type: rawType,
            layoutCode: titleCase(pick(row, ['Mã layout', 'Layout code'])),
            dimensions: titleCase(pick(row, ['Kích thước', 'Kích thước tiêu chuẩn'])),
            landArea: numeric(pick(row, ['Diện tích đất', 'DT đất', 'Diện tích đất (m2)', 'Land area'])) || null,
            buildArea: numeric(pick(row, ['Diện tích xây dựng', 'DT xây dựng', 'Diện tích xây dựng (m2)', 'Build area'])) || null,
            handover: titleCase(pick(row, ['Bàn giao', 'Thời điểm bàn giao', 'Handover'])),
            listPrice: price,
            raw: row,
          };
        }).filter(Boolean);
        if (!parsed.length) throw new Error('Không tìm thấy dòng dữ liệu có mã sản phẩm.');
        resolve(parsed);
      } catch (error) { reject(error); }
    };
    reader.readAsArrayBuffer(file);
  });
}
function diffUnits(current, incoming) {
  const oldMap = new Map(current.map((unit) => [unit.code, unit]));
  const newMap = new Map();
  const duplicates = [];
  for (const unit of incoming) {
    if (newMap.has(unit.code)) duplicates.push(unit.code);
    else newMap.set(unit.code, unit);
  }
  const added = [...newMap.values()].filter((unit) => !oldMap.has(unit.code));
  const removed = current.filter((unit) => !newMap.has(unit.code));
  const changed = [...newMap.values()].filter((unit) => {
    const old = oldMap.get(unit.code);
    return old && JSON.stringify({ ...old, raw: undefined }) !== JSON.stringify({ ...unit, raw: undefined });
  });
  const merged = [...newMap.values()].map((unit) => ({ ...oldMap.get(unit.code), ...unit }));
  return { added, removed, changed, duplicates, merged };
}

export default function App() {
  const [units, setUnits] = useState(loadUnits);
  const [selectedCode, setSelectedCode] = useState('');
  const [query, setQuery] = useState('');
  const [zone, setZone] = useState('ALL');
  const [type, setType] = useState('ALL');
  const [preview, setPreview] = useState(null);
  const [message, setMessage] = useState('');
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [drag, setDrag] = useState(null);
  const [pttt, setPttt] = useState('');
  const [selectedPolicies, setSelectedPolicies] = useState({});
  const [bankChoice, setBankChoice] = useState('accept');
  const [calculation, setCalculation] = useState(null);
  const fileRef = useRef(null);
  const stageRef = useRef(null);

  const selectedUnit = units.find((unit) => unit.code === selectedCode) || null;
  const filtered = useMemo(() => units.filter((unit) => {
    const text = `${unit.code} ${unit.zone} ${unit.type}`.toLowerCase();
    return text.includes(query.trim().toLowerCase()) && (zone === 'ALL' || unit.zone === zone) && (type === 'ALL' || unit.type === type);
  }), [units, query, zone, type]);
  const statusCounts = useMemo(() => ({ total: units.length, located: units.filter((unit) => VERIFIED_POSITIONS[unit.code]).length, unresolved: units.filter((unit) => !VERIFIED_POSITIONS[unit.code]).length }), [units]);
  const eligiblePttt = selectedUnit ? (PTTT_BY_ZONE[selectedUnit.zone] || []) : [];
  const selectedDiscounts = [
    ...(pttt === 'PTTT 2' ? [{ id: 'pttt2', label: 'Chiết khấu PTTT 2', rate: 0.12, note: 'Không quy đổi tiền mặt' }] : []),
    ...DISCOUNT_OPTIONS.filter((option) => selectedPolicies[option.id] && option.rate != null),
    { id: 'bank', label: BANK_OPTIONS.find((option) => option.id === bankChoice)?.label || 'Bảo lãnh ngân hàng', rate: bankChoice === 'decline' ? 0.005 : 0 },
  ];

  const persist = (next) => { setUnits(next); localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); };
  const selectUnit = (unit) => { setSelectedCode(unit.code); setPttt(''); setSelectedPolicies({}); setBankChoice('accept'); setCalculation(null); };
  const onFile = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    try { setPreview({ ...diffUnits(units, await parseWorkbook(file)), fileName: file.name }); setMessage(''); }
    catch (error) { setMessage(error.message || 'Không thể đọc file. Kiểm tra định dạng và tiêu đề cột.'); }
    event.target.value = '';
  };
  const applyImport = () => {
    if (!preview || preview.duplicates.length) return;
    persist(preview.merged);
    setSelectedCode((current) => preview.merged.some((unit) => unit.code === current) ? current : preview.merged[0]?.code || '');
    setMessage(`Đã cập nhật ${preview.merged.length} mã hàng từ ${preview.fileName}.`);
    setPreview(null);
  };
  const calculate = () => {
    if (!selectedUnit?.listPrice || !pttt) return;
    const result = calculatePrice(selectedUnit.listPrice, selectedDiscounts);
    setCalculation({ ...result, pttt, policies: selectedDiscounts });
  };
  const zoomBy = (amount) => setZoom((value) => Math.min(3, Math.max(0.7, Number((value + amount).toFixed(2)))));
  const beginDrag = (event) => { if (event.button !== 0) return; setDrag({ x: event.clientX - pan.x, y: event.clientY - pan.y }); };
  const moveDrag = (event) => { if (drag) setPan({ x: event.clientX - drag.x, y: event.clientY - drag.y }); };
  const endDrag = () => setDrag(null);
  const onWheel = (event) => { event.preventDefault(); zoomBy(event.deltaY < 0 ? 0.1 : -0.1); };

  return <div className="crm-shell">
    <header className="topbar">
      <div className="brand"><div className="brand-mark">IZ</div><div><div className="eyebrow">DT HOME • IZUMI CITY</div><h1>Canaria <span>LA4</span></h1></div></div>
      <div className="top-actions"><span className="live-dot"/> CRM nội bộ · Rổ hàng & tính giá
        <button className="button primary" onClick={() => fileRef.current?.click()}><Upload size={16}/> Cập nhật Excel</button>
        <input ref={fileRef} hidden type="file" accept=".xlsx,.xls,.csv" onChange={onFile}/>
      </div>
    </header>
    <main className="workspace">
      <div className="page-heading"><div><p className="eyebrow">MẶT BẰNG TỔNG THỂ</p><h2>Tra lô & tính giá bán</h2><p>Chọn sản phẩm trong rổ để xem thông tin và mô phỏng chính sách.</p></div><div className="summary-pills"><span>{statusCounts.total} mã trong rổ</span><span className="green">{statusCounts.located} vị trí đã xác nhận</span><span className="orange">{statusCounts.unresolved} cần đối chiếu</span></div></div>
      {message && <div className="notice success"><Check size={16}/>{message}<button onClick={() => setMessage('')}>Đóng</button></div>}
      <div className="main-grid">
        <section className="map-card card">
          <div className="section-head"><div><h3>Mặt bằng Canaria • LA4</h3><p>Giữ nguyên hệ tọa độ gốc 4961 × 3508 px</p></div><div className="map-controls"><button title="Thu nhỏ" onClick={() => zoomBy(-0.15)}><ZoomOut size={16}/></button><span>{Math.round(zoom * 100)}%</span><button title="Phóng to" onClick={() => zoomBy(0.15)}><ZoomIn size={16}/></button><button title="Đặt lại" onClick={() => {setZoom(1); setPan({x:0,y:0});}}>↺</button></div></div>
          <div className="map-stage" ref={stageRef} onPointerDown={beginDrag} onPointerMove={moveDrag} onPointerUp={endDrag} onPointerLeave={endDrag} onWheel={onWheel} style={{ cursor: drag ? 'grabbing' : 'grab' }}>
            <div className="map-canvas" style={{ transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})` }}>
              <img src="/MB_CANARIA_INTERACTIVE_461_LO.svg" alt="Mặt bằng tổng thể phân khu Izumi Canaria LA4" draggable="false" onError={(event) => { event.currentTarget.src = '/MB_CANARIA_VECTOR_LAYER_4961x3508.png'; }}/>
              {Object.entries(VERIFIED_POSITIONS).map(([code, position]) => units.some((unit) => unit.code === code) && <button key={code} className={`map-pin ${selectedCode === code ? 'selected' : ''}`} title={`${code} · vị trí đã xác nhận`} style={{ left: `${position.x / 4961 * 100}%`, top: `${position.y / 3508 * 100}%` }} onPointerDown={(event) => event.stopPropagation()} onClick={() => { const unit = units.find((item) => item.code === code); if (unit) selectUnit(unit); }}><MapPin size={16}/><span>{code}</span></button>)}
            </div>
          </div>
          <div className="map-legend"><span><i className="legend-dot confirmed"/> Có trong rổ & vị trí đã xác nhận</span><span><i className="legend-dot unresolved"/> Có trong rổ nhưng chưa xác nhận vị trí (không tô trên bản đồ)</span></div>
        </section>
        <aside className="detail-column">
          <section className="card search-card"><label className="search-box"><Search size={17}/><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Tìm mã căn, ví dụ LA4-T116.18"/></label><div className="filters"><select value={zone} onChange={(e) => setZone(e.target.value)}><option value="ALL">Tất cả Zone</option>{ZONES.map((item) => <option key={item}>{item}</option>)}</select><select value={type} onChange={(e) => setType(e.target.value)}><option value="ALL">Tất cả loại sản phẩm</option>{TYPES.map((item) => <option key={item}>{item}</option>)}</select></div><div className="unit-list">{filtered.slice(0, 100).map((unit) => <button key={unit.code} className={`unit-row ${selectedCode === unit.code ? 'active' : ''}`} onClick={() => selectUnit(unit)}><span><b>{unit.code}</b><small>{unit.zone || 'Chưa có Zone'} · {unit.type || 'Chưa có loại'}</small></span><span className="unit-price">{unit.listPrice ? `${(unit.listPrice / 1e9).toFixed(2)} tỷ` : 'Thiếu giá'}<small>{VERIFIED_POSITIONS[unit.code] ? 'Đã định vị' : 'Chưa định vị'}</small></span></button>)}{filtered.length === 0 && <div className="empty">Chưa có mã phù hợp. Hãy tải file Excel rổ hàng.</div>}{filtered.length > 100 && <div className="empty">Hiển thị 100 mã đầu tiên — nhập mã để lọc nhanh.</div>}</div></section>
          <section className="card details-card"><div className="section-head"><div><p className="eyebrow">CHI TIẾT SẢN PHẨM</p><h3>{selectedUnit?.code || 'Chưa chọn lô'}</h3></div>{selectedUnit && <span className={`status-tag ${VERIFIED_POSITIONS[selectedUnit.code] ? 'verified' : 'pending'}`}>{VERIFIED_POSITIONS[selectedUnit.code] ? 'Đã xác nhận vị trí' : 'Chưa xác nhận vị trí'}</span>}</div>
            {selectedUnit ? <><div className="detail-grid">{[['Zone',selectedUnit.zone],['Dãy / Block',selectedUnit.block],['Số lô',selectedUnit.lotNumber],['Loại sản phẩm',selectedUnit.type],['Mã layout',selectedUnit.layoutCode],['Kích thước',selectedUnit.dimensions],['Diện tích đất',selectedUnit.landArea ? `${selectedUnit.landArea} m²` : '—'],['Diện tích xây dựng',selectedUnit.buildArea ? `${selectedUnit.buildArea} m²` : '—'],['Bàn giao',selectedUnit.handover],['Giá niêm yết gốc',selectedUnit.listPrice ? money(selectedUnit.listPrice) : 'Thiếu dữ liệu']].map(([label,value]) => <div key={label}><small>{label}</small><b>{value || '—'}</b></div>)}</div><div className="policy-block"><div className="section-head compact"><h4>Phương thức thanh toán</h4><span className="muted">{selectedUnit.zone || 'Chưa rõ Zone'}</span></div>{eligiblePttt.length ? <div className="choice-row">{eligiblePttt.map((item) => <button key={item} className={`choice ${pttt === item ? 'chosen' : ''}`} onClick={() => {setPttt(item); setCalculation(null);}}>{item}</button>)}</div> : <div className="notice warning"><AlertTriangle size={16}/>Chưa cấu hình PTTT hợp lệ cho Zone này. Không tính giá cho đến khi đối chiếu chính sách.</div>}</div><div className="policy-block"><h4>Chính sách & ưu đãi</h4><div className="policy-list">{DISCOUNT_OPTIONS.map((item) => <label key={item.id} className={`policy-option ${item.rate == null ? 'unconfigured' : ''}`}><input type="checkbox" disabled={item.rate == null} checked={Boolean(selectedPolicies[item.id])} onChange={(event) => {setSelectedPolicies((old) => ({...old, [item.id]: event.target.checked})); setCalculation(null);}}/><span><b>{item.label}</b><small>{item.note || 'Mức chiết khấu cần xác nhận từ bảng chính sách Excel.'}</small></span>{item.rate != null && <em>{(item.rate * 100).toLocaleString('vi-VN')}%</em>}</label>)}</div></div><div className="policy-block"><h4>Bảo lãnh ngân hàng</h4><div className="bank-options">{BANK_OPTIONS.map((item) => <label key={item.id} className={bankChoice === item.id ? 'bank-selected' : ''}><input type="radio" name="bank" value={item.id} checked={bankChoice === item.id} onChange={() => {setBankChoice(item.id); setCalculation(null);}}/><span>{item.label}</span><b>{item.rate ? `-${(item.rate*100).toLocaleString('vi-VN')}%` : '0%'}</b></label>)}</div></div><button className="button calculate" disabled={!selectedUnit.listPrice || !pttt} onClick={calculate}><Calculator size={17}/> Tính giá</button>{calculation && <div className="result-card"><div className="result-title">Giá dự kiến sau chiết khấu</div><strong>{money(calculation.finalPrice)}</strong>{calculation.lines.map((line) => <div className="price-line" key={line.id}><span>{line.label} ({(line.rate*100).toLocaleString('vi-VN')}%)</span><b>−{money(line.discount)}</b></div>)}<p className="mandatory-note">Giá đã bao gồm VAT, chưa bao gồm Phí bảo trì (PBT).</p><p className="muted tiny">Kết quả cần đối chiếu bảng chính sách/Excel trước khi sử dụng chính thức.</p></div>}</> : <div className="empty detail-empty"><FileSpreadsheet size={22}/>Tải Excel rổ hàng để bắt đầu tra cứu lô.</div>}
          </section>
        </aside>
      </div>
      <section className="import-footnote"><AlertTriangle size={16}/><span>Chỉ tô/đánh dấu trên bản đồ các mã vừa có trong rổ vừa có tọa độ đã xác nhận. Mã chưa xác nhận được giữ trong danh sách đối chiếu, không suy đoán vị trí hay tình trạng bán.</span></section>
    </main>
    {preview && <div className="modal-backdrop"><div className="diff-modal"><div className="section-head"><div><p className="eyebrow">XEM TRƯỚC THAY ĐỔI</p><h3>{preview.fileName}</h3></div><button className="icon-button" onClick={() => setPreview(null)}>×</button></div><div className="diff-summary"><span className="green">+ {preview.added.length} mới</span><span className="red">− {preview.removed.length} bị gỡ</span><span className="orange">↻ {preview.changed.length} thay đổi</span><span>⚠ {preview.duplicates.length} mã trùng</span></div><div className="diff-content">{preview.duplicates.length > 0 && <div className="notice warning"><AlertTriangle size={16}/>Mã trùng: {preview.duplicates.join(', ')}. Vui lòng sửa file trước khi áp dụng.</div>}<DiffList title="Mã mới thêm" rows={preview.added.map((unit) => `${unit.code} · ${money(unit.listPrice)}`)} empty="Không có mã mới."/><DiffList title="Mã không còn trong file mới" rows={preview.removed.map((unit) => unit.code)} empty="Không có mã bị gỡ."/><DiffList title="Thông tin/giá thay đổi" rows={preview.changed.map((unit) => `${unit.code} · ${money(unit.listPrice)}`)} empty="Không có thay đổi."/><DiffList title="Chưa gắn vị trí đã xác nhận" rows={preview.merged.filter((unit) => !VERIFIED_POSITIONS[unit.code]).map((unit) => unit.code)} empty="Tất cả mã đều đã xác nhận vị trí."/></div><div className="modal-actions"><button className="button secondary" onClick={() => setPreview(null)}>Hủy</button><button className="button primary" disabled={preview.duplicates.length > 0} onClick={applyImport}><ArrowDownToLine size={16}/> Xác nhận cập nhật</button></div></div></div>}
  </div>;
}
function DiffList({title, rows, empty}) { return <section className="diff-list"><h4>{title} <small>{rows.length}</small></h4>{rows.length ? rows.slice(0, 80).map((row, index) => <div key={`${row}-${index}`}>{row}</div>) : <p>{empty}</p>}{rows.length > 80 && <p>… và {rows.length - 80} mã khác</p>}</section>; }

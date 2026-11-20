import React, { useEffect, useMemo, useRef, useState } from 'react';
import { AlertTriangle, Check, ChevronDown, FileSpreadsheet, MapPin, Minus, Plus, Search, Upload, ZoomIn, ZoomOut } from 'lucide-react';
import './crm.css';

const MAP_URL = 'https://raw.githubusercontent.com/uyenbui1094-afk/izumi-canaria-basket/main/MB_CANARIA_INTERACTIVE_461_LO.svg';
const FALLBACK_MAP_URL = 'https://raw.githubusercontent.com/uyenbui1094-afk/izumi-canaria-basket/main/MB_CANARIA_VECTOR_LAYER_4961x3508.png';
const BASKET_URL = 'https://raw.githubusercontent.com/uyenbui1094-afk/izumi-canaria-basket/main/Ro_hang_LA4_theo_zone_v6.xlsx';
const STORE_KEY = 'izumi-la4-crm-basket-v1';
const WIDTH = 4961;
const HEIGHT = 3508;
const CONFIRMED = { 'LA4-T116.18': { x: 1269, y: 1286, layout: 'TH4 02a' } };
const ZONES = ['Zone 1.1', 'Zone 1.2', 'Zone 1.3', 'Zone 2.2', 'Zone 3.2'];
const TYPES = ['Nhà phố vườn', 'Biệt thự song lập'];
const PTTT = { 'Zone 1.1': ['PTTT 1', 'PTTT 2', 'PTTT 3'] };
const PROMOS = [
  { id: 'earlyBird', name: 'Early Bird', rate: null },
  { id: 'event', name: 'Ưu đãi sự kiện', rate: null },
  { id: 'club', name: 'Nam Long Club', rate: null },
  { id: 'interior', name: 'Gói nội thất', rate: 0.12, note: 'Không quy đổi tiền mặt' },
];
const BANK = { accept: { name: 'Nhận bảo lãnh', rate: 0 }, decline: { name: 'Từ chối bảo lãnh', rate: 0.005 } };
const fmt = (v) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 }).format(Number(v) || 0);
const norm = (v) => String(v ?? '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd').toLowerCase().replace(/[^a-z0-9]/g, '');
const ALIASES = {
  code: ['Mã sản phẩm', 'Mã căn', 'Mã lô', 'Mã sản phẩm / mã căn', 'Product code', 'Code'],
  zone: ['Zone', 'Khu', 'Phân khu'], block: ['Dãy', 'Block', 'Cụm'], lot: ['Số lô', 'Số căn', 'Lot number'],
  type: ['Loại sản phẩm', 'Loại hình', 'Loại căn', 'Product type'], layout: ['Mã layout', 'Layout code'],
  dimension: ['Kích thước', 'Kích thước tiêu chuẩn'], land: ['Diện tích đất', 'DT đất', 'Diện tích đất (m2)', 'Land area'],
  build: ['Diện tích xây dựng', 'DT xây dựng', 'Diện tích xây dựng (m2)', 'Build area'],
  handover: ['Bàn giao', 'Thời điểm bàn giao', 'Handover'],
  price: ['Giá bán dự kiến', 'Giá niêm yết', 'Giá niêm yết gốc', 'Giá trước chiết khấu', 'Đơn giá', 'Price'],
};
function get(row, aliases) { const key = Object.keys(row).find((k) => aliases.some((a) => norm(a) === norm(k))); return key ? row[key] : ''; }
function numeric(v) { if (typeof v === 'number') return v; const s = String(v ?? '').trim().replace(/\s/g, '').replace(/\.(?=\d{3}(?:\D|$))/g, '').replace(',', '.').replace(/[^\d.-]/g, ''); const n = Number(s); return Number.isFinite(n) ? n : 0; }
async function parseExcel(file) {
  const XLSX = await import(/* @vite-ignore */ 'https://cdn.jsdelivr.net/npm/xlsx@0.18.5/+esm');
  const data = await file.arrayBuffer();
  const wb = XLSX.read(data, { type: 'array', cellDates: true });
  for (const sheetName of wb.SheetNames) {
    const sheet = wb.Sheets[sheetName];
    const matrix = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: '' });
    const headerIndex = matrix.findIndex((row) => row.some((cell) => ALIASES.code.some((a) => norm(a) === norm(cell))));
    if (headerIndex < 0) continue;
    const headers = matrix[headerIndex].map((cell) => String(cell ?? '').trim());
    const records = XLSX.utils.sheet_to_json(sheet, { range: headerIndex, defval: '' });
    const rows = records.map((r) => {
      const code = String(get(r, ALIASES.code) || '').trim().toUpperCase();
      if (!code) return null;
      return { code, zone: String(get(r, ALIASES.zone) || '').trim(), block: String(get(r, ALIASES.block) || '').trim(), lot: String(get(r, ALIASES.lot) || '').trim(), type: String(get(r, ALIASES.type) || '').trim(), layout: String(get(r, ALIASES.layout) || '').trim(), dimension: String(get(r, ALIASES.dimension) || '').trim(), land: numeric(get(r, ALIASES.land)) || null, build: numeric(get(r, ALIASES.build)) || null, handover: String(get(r, ALIASES.handover) || '').trim(), price: numeric(get(r, ALIASES.price)), raw: r };
    }).filter(Boolean);
    if (rows.length) return rows;
  }
  throw new Error('Không tìm thấy bảng có cột Mã sản phẩm/Mã căn trong file.');
}
function diffRows(oldRows, nextRows) {
  const old = new Map(oldRows.map((x) => [x.code, x])); const next = new Map(); const duplicates = [];
  nextRows.forEach((x) => next.has(x.code) ? duplicates.push(x.code) : next.set(x.code, x));
  const added = [...next.values()].filter((x) => !old.has(x.code));
  const removed = oldRows.filter((x) => !next.has(x.code));
  const changed = [...next.values()].filter((x) => old.has(x.code) && JSON.stringify({ ...old.get(x.code), raw: undefined }) !== JSON.stringify({ ...x, raw: undefined }));
  const merged = [...next.values()].map((x) => ({ ...old.get(x.code), ...x }));
  return { added, removed, changed, merged, duplicates };
}
function priceResult(base, discounts) {
  let value = Number(base) || 0;
  const lines = discounts.map((d) => { const before = value; value *= (1 - d.rate); return { ...d, amount: Math.floor((before - value + 500) / 1000) * 1000 }; });
  return { final: Math.floor((value + 500) / 1000) * 1000, lines };
}
function loadSaved() { try { const x = JSON.parse(localStorage.getItem(STORE_KEY) || 'null'); return Array.isArray(x) ? x : []; } catch { return []; } }

export default function App() {
  const [rows, setRows] = useState(loadSaved);
  const [query, setQuery] = useState(''); const [zone, setZone] = useState('ALL'); const [type, setType] = useState('ALL');
  const [selected, setSelected] = useState(''); const [payment, setPayment] = useState(''); const [promos, setPromos] = useState({}); const [bank, setBank] = useState('accept');
  const [result, setResult] = useState(null); const [diff, setDiff] = useState(null); const [notice, setNotice] = useState(''); const [error, setError] = useState('');
  const [zoom, setZoom] = useState(1); const [offset, setOffset] = useState({ x: 0, y: 0 }); const [drag, setDrag] = useState(null); const fileRef = useRef(null);
  const unit = rows.find((r) => r.code === selected) || null;
  const filtered = useMemo(() => rows.filter((r) => `${r.code} ${r.zone} ${r.type}`.toLowerCase().includes(query.trim().toLowerCase()) && (zone === 'ALL' || r.zone === zone) && (type === 'ALL' || r.type === type)), [rows, query, zone, type]);
  useEffect(() => {
    if (rows.length) return;
    let cancelled = false;
    fetch(BASKET_URL).then((r) => { if (!r.ok) throw new Error('Không tải được rổ hàng mẫu.'); return r.arrayBuffer(); })
      .then(async (buffer) => { const file = new File([buffer], 'Ro_hang_LA4_theo_zone_v6.xlsx'); const parsed = await parseExcel(file); if (!cancelled) { setRows(parsed); localStorage.setItem(STORE_KEY, JSON.stringify(parsed)); setSelected(parsed[0]?.code || ''); } })
      .catch(() => { if (!cancelled) setNotice('Chưa nạp được rổ hàng tự động. Dùng nút “Tải Excel” để chọn file rổ hàng trên thiết bị.'); });
    return () => { cancelled = true; };
  }, []);
  const save = (next) => { setRows(next); localStorage.setItem(STORE_KEY, JSON.stringify(next)); };
  const choose = (code) => { setSelected(code); setPayment(''); setPromos({}); setBank('accept'); setResult(null); };
  const importFile = async (e) => { const file = e.target.files?.[0]; if (!file) return; setError(''); try { const incoming = await parseExcel(file); setDiff({ ...diffRows(rows, incoming), filename: file.name }); } catch (ex) { setError(ex.message || 'Không đọc được file Excel.'); } e.target.value = ''; };
  const applyDiff = () => { if (!diff || diff.duplicates.length) return; save(diff.merged); setSelected((s) => diff.merged.some((r) => r.code === s) ? s : (diff.merged[0]?.code || '')); setDiff(null); setNotice(`Đã cập nhật rổ hàng từ ${diff.filename}. Tọa độ đã xác nhận được giữ nguyên.`); };
  const discounts = unit ? [...(payment === 'PTTT 2' ? [{ id: 'pttt2', name: 'Chiết khấu PTTT 2', rate: 0.12, note: 'Không quy đổi tiền mặt' }] : []), ...PROMOS.filter((p) => p.rate != null && promos[p.id]).map((p) => ({ id: p.id, name: p.name, rate: p.rate, note: p.note })), { id: 'bank', name: BANK[bank].name, rate: BANK[bank].rate }] : [];
  const calculate = () => { if (unit?.price && payment) setResult({ ...priceResult(unit.price, discounts), payment }); };
  const zoomBy = (n) => setZoom((z) => Math.min(3, Math.max(.6, Number((z + n).toFixed(2)))));
  const pointerDown = (e) => { if (e.target.closest('.lot-pin')) return; setDrag({ x: e.clientX - offset.x, y: e.clientY - offset.y }); e.currentTarget.setPointerCapture(e.pointerId); };
  const pointerMove = (e) => { if (drag) setOffset({ x: e.clientX - drag.x, y: e.clientY - drag.y }); };

  return <div className="app-shell">
    <header className="topbar"><div className="brand"><div className="logo">IZ</div><div><small>DT HOME · IZUMI CITY</small><h1>Canaria <span>LA4</span></h1></div></div><div className="top-right"><span className="online"/> Rổ hàng · Mặt bằng · Tính giá <button className="btn btn-dark" onClick={() => fileRef.current?.click()}><Upload size={15}/>Tải Excel rổ hàng</button><input ref={fileRef} type="file" accept=".xlsx,.xls,.csv" hidden onChange={importFile}/></div></header>
    <main className="content"><div className="heading"><div><small className="kicker">CRM NỘI BỘ · ĐƠN VỊ PHÂN PHỐI DT HOME</small><h2>Tra lô & tính giá bán</h2><p>Chọn đúng lô trên mặt bằng, chọn phương thức thanh toán và chính sách.</p></div><div className="counts"><b>{rows.length}</b> mã trong rổ <i/> <b>{rows.filter((r) => CONFIRMED[r.code]).length}</b> vị trí đã xác nhận</div></div>
      {notice && <div className="notice"><Check size={16}/>{notice}<button onClick={() => setNotice('')}>Đóng</button></div>}{error && <div className="notice error"><AlertTriangle size={16}/>{error}<button onClick={() => setError('')}>Đóng</button></div>}
      <div className="layout"><section className="map-card"><div className="card-head"><div><h3>Mặt bằng tổng thể · LA4</h3><p>Ảnh gốc 4961 × 3508 px · kéo để di chuyển, cuộn để zoom</p></div><div className="zoom"><button onClick={() => zoomBy(-.15)} title="Thu nhỏ"><Minus size={15}/></button><span>{Math.round(zoom * 100)}%</span><button onClick={() => zoomBy(.15)} title="Phóng to"><Plus size={15}/></button><button onClick={() => {setZoom(1);setOffset({x:0,y:0});}}>↺</button></div></div><div className="map-window" onPointerDown={pointerDown} onPointerMove={pointerMove} onPointerUp={() => setDrag(null)} onPointerCancel={() => setDrag(null)} onWheel={(e) => {e.preventDefault();zoomBy(e.deltaY < 0 ? .1 : -.1);}} style={{ cursor: drag ? 'grabbing' : 'grab' }}><div className="map-image" style={{transform:`translate(${offset.x}px,${offset.y}px) scale(${zoom})`}}><img src={MAP_URL} alt="Mặt bằng gốc Izumi Canaria LA4" onError={(e) => { if (!e.currentTarget.dataset.fallback) {e.currentTarget.dataset.fallback='1';e.currentTarget.src=FALLBACK_MAP_URL;} }}/>{Object.entries(CONFIRMED).map(([code,p]) => rows.some((r) => r.code === code) && <button className={`lot-pin ${selected === code ? 'is-selected' : ''}`} key={code} style={{left:`${p.x / WIDTH * 100}%`,top:`${p.y / HEIGHT * 100}%`}} onPointerDown={(e)=>e.stopPropagation()} onClick={()=>choose(code)} title={`${code} · vị trí đã xác nhận`}><MapPin size={17}/><span>{code}</span></button>)}</div></div><div className="legend"><span><i className="dot gold"/>Có trong rổ + đã xác nhận vị trí</span><span><i className="dot gray"/>Chưa xác nhận: không đánh dấu trên bản đồ</span></div></section>
        <aside className="side"><section className="card inventory"><label className="search"><Search size={16}/><input value={query} onChange={(e)=>setQuery(e.target.value)} placeholder="Tìm mã sản phẩm…"/></label><div className="filters"><select value={zone} onChange={(e)=>setZone(e.target.value)}><option value="ALL">Tất cả Zone</option>{ZONES.map((z)=><option key={z}>{z}</option>)}</select><select value={type} onChange={(e)=>setType(e.target.value)}><option value="ALL">Tất cả loại sản phẩm</option>{TYPES.map((t)=><option key={t}>{t}</option>)}</select></div><div className="unit-list">{filtered.map((r)=><button key={r.code} className={`unit ${selected===r.code?'active':''}`} onClick={()=>choose(r.code)}><span><b>{r.code}</b><small>{r.zone || 'Chưa rõ Zone'} · {r.type || 'Chưa rõ loại'}</small></span><span className="unit-right">{r.price?`${(r.price/1e9).toFixed(2)} tỷ`:'Chưa có giá'}<small>{CONFIRMED[r.code]?'Đã định vị':'Chờ đối chiếu'}</small></span></button>)}{!filtered.length && <div className="empty">{rows.length?'Không có kết quả.':'Đang nạp file rổ hàng…'}</div>}</div></section>
          <section className="card detail"><div className="card-head"><div><small className="kicker">THÔNG TIN LÔ</small><h3>{unit?.code || 'Chọn một mã căn'}</h3></div>{unit && <span className={`tag ${CONFIRMED[unit.code]?'confirmed':'pending'}`}>{CONFIRMED[unit.code]?'Đã xác nhận':'Chưa xác nhận vị trí'}</span>}</div>{unit ? <><div className="facts">{[['Zone',unit.zone],['Dãy / Block',unit.block],['Số lô',unit.lot],['Loại sản phẩm',unit.type],['Mã layout',unit.layout || CONFIRMED[unit.code]?.layout],['Kích thước',unit.dimension],['Diện tích đất',unit.land?`${unit.land} m²`:null],['Diện tích xây dựng',unit.build?`${unit.build} m²`:null],['Thời điểm bàn giao',unit.handover],['Giá niêm yết gốc',unit.price?fmt(unit.price):null]].map(([k,v])=><div key={k}><small>{k}</small><b>{v || '—'}</b></div>)}</div><div className="policy"><div className="subhead"><h4>Phương thức thanh toán</h4><small>{unit.zone || 'Chưa xác định Zone'}</small></div>{(PTTT[unit.zone] || []).length ? <div className="choices">{PTTT[unit.zone].map((p)=><button key={p} className={payment===p?'chosen':''} onClick={()=>{setPayment(p);setResult(null);}}>{p}</button>)}</div> : <div className="warning"><AlertTriangle size={15}/>Chưa có cấu hình PTTT đã xác nhận cho Zone này.</div>}</div><div className="policy"><h4>Ưu đãi</h4><div className="options">{PROMOS.map((p)=><label key={p.id} className={!p.rate?'locked':''}><input type="checkbox" disabled={!p.rate} checked={Boolean(promos[p.id])} onChange={(e)=>{setPromos({...promos,[p.id]:e.target.checked});setResult(null);}}/><span><b>{p.name}</b><small>{p.rate ? `${p.rate*100}% · ${p.note}`:'Mức CK chưa có trong chính sách — cần xác nhận'}</small></span></label>)}</div></div><div className="policy"><h4>Bảo lãnh ngân hàng</h4><div className="options bank">{Object.entries(BANK).map(([id,b])=><label key={id}><input type="radio" name="bank" checked={bank===id} onChange={()=>{setBank(id);setResult(null);}}/><span><b>{b.name}</b></span><strong>{b.rate?`−${b.rate*100}%`:'0%'}</strong></label>)}</div></div><button className="btn btn-calc" disabled={!unit.price || !payment} onClick={calculate}>Tính giá</button>{result && <div className="result"><small>GIÁ DỰ KIẾN SAU CHIẾT KHẤU</small><strong>{fmt(result.final)}</strong><div className="result-rows">{result.lines.map((l)=><div key={l.id}><span>{l.name} ({l.rate*100}%)</span><b>−{fmt(l.amount)}</b></div>)}</div><p>Giá đã bao gồm VAT, chưa bao gồm Phí bảo trì (PBT).</p><small className="caution">Cần đối chiếu công thức chính sách Excel chính thức trước khi báo giá.</small></div>}</> : <div className="empty">Tải file Excel để bắt đầu tra cứu.</div>}</section>
        </aside></div><div className="footer-note"><AlertTriangle size={16}/><span>Chỉ đánh dấu vị trí đã xác nhận. Mã chưa có tọa độ chính xác sẽ không được tô sáng; không suy luận tình trạng bán từ màu nền.</span></div>
    </main>
    {diff && <div className="overlay"><section className="modal"><div className="card-head"><div><small className="kicker">XEM TRƯỚC THAY ĐỔI</small><h3>{diff.filename}</h3></div><button className="close" onClick={()=>setDiff(null)}>×</button></div><div className="diff-counts"><span>+ {diff.added.length} mới</span><span>− {diff.removed.length} bị gỡ</span><span>↻ {diff.changed.length} thay đổi</span><span>⚠ {diff.duplicates.length} mã trùng</span></div>{diff.duplicates.length>0&&<div className="warning"><AlertTriangle size={15}/>Mã trùng: {diff.duplicates.join(', ')}. Sửa file trước khi cập nhật.</div>}<div className="diff-grid"><Diff title="Mã mới" rows={diff.added.map(x=>x.code)}/><Diff title="Mã bị gỡ" rows={diff.removed.map(x=>x.code)}/><Diff title="Giá/thông tin thay đổi" rows={diff.changed.map(x=>x.code)}/><Diff title="Chưa xác nhận vị trí" rows={diff.merged.filter(x=>!CONFIRMED[x.code]).map(x=>x.code)}/></div><div className="modal-actions"><button className="btn btn-light" onClick={()=>setDiff(null)}>Hủy</button><button className="btn btn-dark" disabled={diff.duplicates.length>0} onClick={applyDiff}>Xác nhận cập nhật</button></div></section></div>}
  </div>;
}
function Diff({title,rows}) { return <div className="diff-box"><b>{title} ({rows.length})</b>{rows.length?rows.slice(0,100).map((x,i)=><small key={`${x}-${i}`}>{x}</small>):<small>Không có</small>}</div>; }

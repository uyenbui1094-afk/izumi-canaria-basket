import React, { useState, useMemo } from 'react';
import {
  Search,
  ExternalLink,
  CheckCircle2,
  Clock,
  Lock,
  AlertCircle,
  Download,
  Upload,
  Plus,
  History,
  Calculator,
  Filter,
  RotateCcw,
  Building2,
  FileSpreadsheet,
  FolderOpen,
  ShieldCheck
} from 'lucide-react';

const SOURCE_LINKS = {
  basket: {
    label: 'Giỏ hàng Izumi City',
    url: 'https://docs.google.com/spreadsheets/d/1Ijd9KiL9pNoGyy7DDUw7hsOypPXu5cZR/edit?gid=1192953461#gid=1192953461'
  },
  businessInfo: {
    label: 'Thông tin kinh doanh',
    url: 'https://drive.google.com/drive/folders/1fxRs89VRuFbKrPXe-wDZt6CFFevasL8S'
  },
  iso: {
    label: 'Tài liệu ISO',
    url: 'https://drive.google.com/drive/folders/1rNRIE0XWTiGiQYGnPD7HMenmPNxfNlfX?usp=sharing'
  }
};

const INITIAL_UNITS = [
  { code: 'LA4-SD02.02', zone: 'Zone 1.1', type: 'Biệt thự song lập', landArea: 234.0, buildArea: 244.81, handover: '12/2026', basePrice: 19435976000, status: 'Trống', salesName: '', note: '', updatedAt: '20/11/2026 08:30' },
  { code: 'LA4-SD06.03', zone: 'Zone 1.1', type: 'Biệt thự song lập', landArea: 278.15, buildArea: 277.51, handover: '12/2026', basePrice: 25083300000, status: 'Trống', salesName: '', note: '', updatedAt: '20/11/2026 08:30' },
  { code: 'LA4-T116.18', zone: 'Zone 1.1', type: 'Nhà phố vườn', landArea: 114.0, buildArea: 156.82, handover: '12/2026', basePrice: 8554635000, status: 'Giữ chỗ', salesName: 'Phương Uyên', note: 'Khách xem thực địa sáng nay', updatedAt: '20/11/2026 09:15' },
  { code: 'LA4-T117.05', zone: 'Zone 1.1', type: 'Nhà phố vườn', landArea: 114.0, buildArea: 156.82, handover: '12/2026', basePrice: 8554635000, status: 'Trống', salesName: '', note: '', updatedAt: '20/11/2026 08:30' },
  { code: 'LA4-T202.05', zone: 'Zone 1.1', type: 'Nhà phố vườn', landArea: 136.5, buildArea: 186.14, handover: '12/2026', basePrice: 12516101000, status: 'Đã cọc', salesName: 'DTH1 - Minh', note: 'Đã chuyển cọc đủ', updatedAt: '20/11/2026 10:05' },
  { code: 'LA4-T202.20', zone: 'Zone 1.1', type: 'Nhà phố vườn', landArea: 143.5, buildArea: 141.52, handover: '12/2026', basePrice: 9997204000, status: 'Trống', salesName: '', note: '', updatedAt: '20/11/2026 08:30' },
  { code: 'LA4-T301.06', zone: 'Zone 1.1', type: 'Nhà phố vườn', landArea: 164.0, buildArea: 189.83, handover: '12/2026', basePrice: 11813046000, status: 'Trống', salesName: '', note: '', updatedAt: '20/11/2026 08:30' },
  { code: 'LA4-T301.10', zone: 'Zone 1.1', type: 'Nhà phố vườn', landArea: 164.0, buildArea: 189.83, handover: '12/2026', basePrice: 11813046000, status: 'Trống', salesName: '', note: '', updatedAt: '20/11/2026 08:30' },
  { code: 'LA4-SD04.06', zone: 'Zone 1.2', type: 'Biệt thự song lập', landArea: 246.0, buildArea: 244.81, handover: '10/2029', basePrice: 16399620000, status: 'Trống', salesName: '', note: '', updatedAt: '20/11/2026 08:30' },
  { code: 'LA4-SD04.10', zone: 'Zone 1.2', type: 'Biệt thự song lập', landArea: 246.0, buildArea: 244.81, handover: '10/2029', basePrice: 17683027000, status: 'Trống', salesName: '', note: '', updatedAt: '20/11/2026 08:30' },
  { code: 'LA4-T302.04', zone: 'Zone 1.2', type: 'Nhà phố vườn', landArea: 164.0, buildArea: 188.85, handover: '10/2029', basePrice: 11799522000, status: 'Trống', salesName: '', note: '', updatedAt: '20/11/2026 08:30' },
  { code: 'LA4-SD03.11', zone: 'Zone 1.3', type: 'Biệt thự song lập', landArea: 246.0, buildArea: 244.81, handover: '12/2026', basePrice: 17041323000, status: 'Trống', salesName: '', note: '', updatedAt: '20/11/2026 08:30' },
  { code: 'LA4-SD03.12', zone: 'Zone 1.3', type: 'Biệt thự song lập', landArea: 246.0, buildArea: 244.81, handover: '12/2026', basePrice: 16399620000, status: 'Trống', salesName: '', note: '', updatedAt: '20/11/2026 08:30' },
  { code: 'LA4-SD03.20', zone: 'Zone 1.3', type: 'Biệt thự song lập', landArea: 243.75, buildArea: 261.61, handover: '12/2026', basePrice: 17162753000, status: 'Trống', salesName: '', note: '', updatedAt: '20/11/2026 08:30' },
  { code: 'LA4-T114.03', zone: 'Zone 2.2', type: 'Nhà phố vườn', landArea: 114.0, buildArea: 152.79, handover: '10/2029', basePrice: 9194533000, status: 'Trống', salesName: '', note: 'Đã kiểm tra vị trí chuẩn Zone 2.2', updatedAt: '20/11/2026 08:30' },
  { code: 'LA4-T114.09', zone: 'Zone 2.2', type: 'Nhà phố vườn', landArea: 114.0, buildArea: 151.64, handover: '10/2029', basePrice: 9177365000, status: 'Trống', salesName: '', note: '', updatedAt: '20/11/2026 08:30' },
  { code: 'LA4-T114.12', zone: 'Zone 2.2', type: 'Nhà phố vườn', landArea: 114.0, buildArea: 152.79, handover: '10/2029', basePrice: 9194533000, status: 'Trống', salesName: '', note: '', updatedAt: '20/11/2026 08:30' },
  { code: 'LA4-T114.19', zone: 'Zone 2.2', type: 'Nhà phố vườn', landArea: 114.0, buildArea: 151.64, handover: '10/2029', basePrice: 9177365000, status: 'Trống', salesName: '', note: '', updatedAt: '20/11/2026 08:30' },
  { code: 'LA4-T118.09', zone: 'Zone 2.2', type: 'Nhà phố vườn', landArea: 114.0, buildArea: 152.85, handover: '10/2029', basePrice: 9195428000, status: 'Trống', salesName: '', note: '', updatedAt: '20/11/2026 08:30' },
  { code: 'LA4-T118.14', zone: 'Zone 2.2', type: 'Nhà phố vườn', landArea: 114.0, buildArea: 156.76, handover: '10/2029', basePrice: 9253800000, status: 'Trống', salesName: '', note: '', updatedAt: '20/11/2026 08:30' },
  { code: 'LA4-T119.02', zone: 'Zone 2.2', type: 'Nhà phố vườn', landArea: 114.0, buildArea: 151.64, handover: '10/2029', basePrice: 9177365000, status: 'Trống', salesName: '', note: '', updatedAt: '20/11/2026 08:30' },
  { code: 'LA4-T119.15', zone: 'Zone 2.2', type: 'Nhà phố vườn', landArea: 114.0, buildArea: 156.8, handover: '10/2029', basePrice: 9254398000, status: 'Trống', salesName: '', note: '', updatedAt: '20/11/2026 08:30' },
  { code: 'LA4-SD07.02', zone: 'Zone 3.2', type: 'Biệt thự song lập', landArea: 248.93, buildArea: 277.51, handover: '10/2029', basePrice: 27274821000, status: 'Trống', salesName: '', note: '', updatedAt: '20/11/2026 08:30' },
  { code: 'LA4-SD08.01', zone: 'Zone 3.2', type: 'Biệt thự song lập', landArea: 321.87, buildArea: 277.51, handover: '10/2029', basePrice: 34214698000, status: 'Trống', salesName: '', note: '', updatedAt: '20/11/2026 08:30' },
  { code: 'LA4-SD08.06', zone: 'Zone 3.2', type: 'Biệt thự song lập', landArea: 266.2, buildArea: 277.51, handover: '10/2029', basePrice: 28850657000, status: 'Trống', salesName: '', note: '', updatedAt: '20/11/2026 08:30' },
  { code: 'LA4-T113.08', zone: 'Zone 2.2', type: 'Nhà phố vườn', landArea: 114.0, buildArea: 156.76, handover: '10/2029', basePrice: 9253801000, status: 'Đã rút', salesName: 'PKD CĐT', note: 'Mã căn đã rút khỏi giỏ hiện hành', updatedAt: '20/11/2026 08:00' }
];

const STATUS_STYLES = {
  'Trống': 'bg-emerald-50 text-emerald-700 border-emerald-200',
  'Giữ chỗ': 'bg-amber-50 text-amber-700 border-amber-200',
  'Đã cọc': 'bg-rose-50 text-rose-700 border-rose-200',
  'Đã rút': 'bg-slate-100 text-slate-500 border-slate-200'
};

const formatVND = (val) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 }).format(Math.round(val || 0));

const nowLabel = () => {
  const d = new Date();
  const pad = (n) => String(n).padStart(2, '0');
  return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

export default function IzumiCanariaBasket() {
  const [units, setUnits] = useState(INITIAL_UNITS);
  const [searchQuery, setSearchQuery] = useState('');
  const [zoneFilter, setZoneFilter] = useState('ALL');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedCode, setSelectedCode] = useState('LA4-SD02.02');

  const [applyInteriorDiscount, setApplyInteriorDiscount] = useState(true);
  const [extraPromoRate, setExtraPromoRate] = useState(0);

  const [editorCode, setEditorCode] = useState('LA4-SD02.02');
  const [editorStatus, setEditorStatus] = useState('Trống');
  const [editorSales, setEditorSales] = useState('');
  const [editorNote, setEditorNote] = useState('');

  const [newCode, setNewCode] = useState('');
  const [newZone, setNewZone] = useState('Zone 2.2');
  const [newType, setNewType] = useState('Nhà phố vườn');
  const [newLandArea, setNewLandArea] = useState('114');
  const [newPrice, setNewPrice] = useState('9200000000');

  const [logs, setLogs] = useState([
    { time: '20/11/2026 08:30', actor: 'Hệ thống', detail: 'Nạp giỏ hàng cập nhật Izumi Canaria & Izumi City (đã loại trừ LA4-T113.08 khỏi giỏ mở bán).' }
  ]);

  const zones = useMemo(() => ['ALL', ...Array.from(new Set(units.map((u) => u.zone)))], [units]);
  const types = useMemo(() => ['ALL', ...Array.from(new Set(units.map((u) => u.type)))], [units]);

  const filteredUnits = useMemo(() => {
    return units.filter((u) => {
      const matchSearch = u.code.toLowerCase().includes(searchQuery.trim().toLowerCase()) ||
        (u.salesName && u.salesName.toLowerCase().includes(searchQuery.trim().toLowerCase()));
      const matchZone = zoneFilter === 'ALL' || u.zone === zoneFilter;
      const matchType = typeFilter === 'ALL' || u.type === typeFilter;
      const matchStatus = statusFilter === 'ALL' || u.status === statusFilter;
      return matchSearch && matchZone && matchType && matchStatus;
    });
  }, [units, searchQuery, zoneFilter, typeFilter, statusFilter]);

  const stats = useMemo(() => {
    const active = units.filter((u) => u.status !== 'Đã rút');
    return {
      totalActive: active.length,
      available: active.filter((u) => u.status === 'Trống').length,
      reserved: active.filter((u) => u.status === 'Giữ chỗ').length,
      deposited: active.filter((u) => u.status === 'Đã cọc').length,
      withdrawn: units.filter((u) => u.status === 'Đã rút').length
    };
  }, [units]);

  const selectedUnit = useMemo(() => {
    return units.find((u) => u.code === selectedCode) || units[0];
  }, [units, selectedCode]);

  const priceBreakdown = useMemo(() => {
    const base = selectedUnit ? selectedUnit.basePrice : 0;
    const pttt2Discount = base * 0.12;
    const afterPttt2 = base - pttt2Discount;
    const interiorRate = applyInteriorDiscount ? 0.12 : 0;
    const interiorDiscount = afterPttt2 * interiorRate;
    const afterInterior = afterPttt2 - interiorDiscount;
    const extraDiscount = afterInterior * (Number(extraPromoRate || 0) / 100);
    const estimatedNet = Math.max(0, afterInterior - extraDiscount);
    return {
      base,
      pttt2Discount,
      interiorDiscount,
      extraDiscount,
      estimatedNet
    };
  }, [selectedUnit, applyInteriorDiscount, extraPromoRate]);

  const handleSelectUnit = (unit) => {
    setSelectedCode(unit.code);
    setEditorCode(unit.code);
    setEditorStatus(unit.status);
    setEditorSales(unit.salesName || '');
    setEditorNote(unit.note || '');
  };

  const handleSaveStatus = (e) => {
    e.preventDefault();
    const ts = nowLabel();
    setUnits((prev) =>
      prev.map((u) =>
        u.code === editorCode
          ? { ...u, status: editorStatus, salesName: editorSales.trim(), note: editorNote.trim(), updatedAt: ts }
          : u
      )
    );
    setLogs((prev) => [
      {
        time: ts,
        actor: editorSales.trim() || 'Tư vấn viên',
        detail: `Cập nhật mã ${editorCode} -> "${editorStatus}"${editorNote.trim() ? ` (${editorNote.trim()})` : ''}.`
      },
      ...prev
    ]);
  };

  const handleAddUnit = (e) => {
    e.preventDefault();
    const cleanCode = newCode.trim().toUpperCase();
    const priceNum = Number(newPrice);
    const landNum = Number(newLandArea);
    if (!cleanCode || Number.isNaN(priceNum) || priceNum <= 0) return;
    if (units.some((u) => u.code === cleanCode)) return;

    const ts = nowLabel();
    const created = {
      code: cleanCode,
      zone: newZone,
      type: newType,
      landArea: Number.isNaN(landNum) ? 114 : landNum,
      buildArea: 155.0,
      handover: '10/2029',
      basePrice: priceNum,
      status: 'Trống',
      salesName: '',
      note: 'Thêm mới trên bảng giỏ hàng',
      updatedAt: ts
    };
    setUnits((prev) => [created, ...prev]);
    setSelectedCode(cleanCode);
    setNewCode('');
    setLogs((prev) => [{ time: ts, actor: 'Quản trị giỏ hàng', detail: `Thêm mới căn ${cleanCode} (${newZone}).` }, ...prev]);
  };

  const handleExportCSV = () => {
    const headers = ['MaCan', 'Zone', 'LoaiSanPham', 'DienTichDat_m2', 'BanGiao', 'GiaTruocCK_VND', 'TrangThai', 'SalePhuTrach', 'GhiChu', 'CapNhatLuc'];
    const rows = units.map((u) =>
      [u.code, u.zone, u.type, u.landArea, u.handover, u.basePrice, u.status, u.salesName, u.note, u.updatedAt]
        .map((cell) => `"${String(cell ?? '').replace(/"/g, '""')}"`)
        .join(',')
    );
    const csvContent = '\uFEFF' + [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'gio-hang-izumi-canaria.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportJSON = () => {
    const blob = new Blob([JSON.stringify({ exportedAt: nowLabel(), units, logs }, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'gio-hang-izumi-canaria.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportJSON = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result));
        if (Array.isArray(parsed.units)) {
          setUnits(parsed.units);
          if (Array.isArray(parsed.logs)) setLogs(parsed.logs);
          setLogs((prev) => [{ time: nowLabel(), actor: 'Nhập dữ liệu', detail: `Đã nạp file ${file.name}.` }, ...prev]);
        }
      } catch (_) {
        // Bỏ qua file không hợp lệ
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 pb-12">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-700">
              <Building2 className="w-4 h-4" />
              Izumi City • Phân khu Canaria
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 mt-0.5">
              Bảng Theo Dõi & Cập Nhật Giỏ Hàng Realtime
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <a
              href={SOURCE_LINKS.basket.url}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              {SOURCE_LINKS.basket.label}
              <ExternalLink className="w-3 h-3" />
            </a>
            <a
              href={SOURCE_LINKS.businessInfo.url}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200 hover:bg-slate-200"
            >
              <FolderOpen className="w-3.5 h-3.5" />
              {SOURCE_LINKS.businessInfo.label}
              <ExternalLink className="w-3 h-3" />
            </a>
            <a
              href={SOURCE_LINKS.iso.url}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200 hover:bg-slate-200"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              {SOURCE_LINKS.iso.label}
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 mt-6 space-y-6">
        <div className="bg-amber-50/90 border border-amber-200 rounded-xl p-3.5 text-xs sm:text-sm text-amber-950 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <div>
              <strong>Lưu ý áp dụng & nguồn đối chiếu:</strong> Các chính sách/ưu đãi áp dụng theo điều kiện, đối tượng và thời gian quy định của từng chương trình; quy tắc <strong>PTTT2 chiết khấu 12% bắt buộc, không quy đổi tiền mặt</strong>. Khi chốt cọc chính thức, luôn đối chiếu lại với file Giỏ hàng Izumi City & tài liệu PKD CĐT.
            </div>
          </div>
        </div>

        <section className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          <div className="bg-white rounded-xl border border-slate-200 p-4">
            <div className="text-xs text-slate-500">Đang mở bán</div>
            <div className="text-2xl font-bold text-slate-900 mt-1">{stats.totalActive}</div>
          </div>
          <div className="bg-white rounded-xl border border-emerald-200 p-4">
            <div className="text-xs text-emerald-700 font-medium">Còn trống</div>
            <div className="text-2xl font-bold text-emerald-700 mt-1">{stats.available}</div>
          </div>
          <div className="bg-white rounded-xl border border-amber-200 p-4">
            <div className="text-xs text-amber-700 font-medium">Đang giữ chỗ</div>
            <div className="text-2xl font-bold text-amber-700 mt-1">{stats.reserved}</div>
          </div>
          <div className="bg-white rounded-xl border border-rose-200 p-4">
            <div className="text-xs text-rose-700 font-medium">Đã cọc</div>
            <div className="text-2xl font-bold text-rose-700 mt-1">{stats.deposited}</div>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-4 col-span-2 sm:col-span-1">
            <div className="text-xs text-slate-500">Đã rút giỏ</div>
            <div className="text-2xl font-bold text-slate-500 mt-1">{stats.withdrawn}</div>
          </div>
        </section>

        <section className="bg-white rounded-xl border border-slate-200 p-4 space-y-3">
          <div className="flex flex-col md:flex-row gap-3 justify-between">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm theo mã căn (VD: LA4-T114.03, LA4-SD02.02) hoặc tên sale..."
                className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={handleExportCSV}
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg border border-slate-300 bg-white hover:bg-slate-50"
              >
                <Download className="w-3.5 h-3.5" />
                Xuất CSV
              </button>
              <button
                type="button"
                onClick={handleExportJSON}
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg border border-slate-300 bg-white hover:bg-slate-50"
              >
                <Download className="w-3.5 h-3.5" />
                Xuất JSON
              </button>
              <label className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg border border-slate-300 bg-white hover:bg-slate-50 cursor-pointer">
                <Upload className="w-3.5 h-3.5" />
                Nhập JSON
                <input type="file" accept="application/json" onChange={handleImportJSON} className="hidden" />
              </label>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
            <span className="inline-flex items-center gap-1 text-slate-500 font-medium mr-1">
              <Filter className="w-3.5 h-3.5" /> Lọc:
            </span>
            <select
              value={zoneFilter}
              onChange={(e) => setZoneFilter(e.target.value)}
              className="px-2.5 py-1.5 border border-slate-300 rounded-lg bg-white"
            >
              {zones.map((z) => (
                <option key={z} value={z}>{z === 'ALL' ? 'Tất cả Zone' : z}</option>
              ))}
            </select>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-2.5 py-1.5 border border-slate-300 rounded-lg bg-white"
            >
              {types.map((t) => (
                <option key={t} value={t}>{t === 'ALL' ? 'Tất cả loại sản phẩm' : t}</option>
              ))}
            </select>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-2.5 py-1.5 border border-slate-300 rounded-lg bg-white"
            >
              <option value="ALL">Tất cả trạng thái</option>
              <option value="Trống">Trống</option>
              <option value="Giữ chỗ">Giữ chỗ</option>
              <option value="Đã cọc">Đã cọc</option>
              <option value="Đã rút">Đã rút</option>
            </select>
            {(searchQuery || zoneFilter !== 'ALL' || typeFilter !== 'ALL' || statusFilter !== 'ALL') && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setZoneFilter('ALL');
                  setTypeFilter('ALL');
                  setStatusFilter('ALL');
                }}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 text-slate-600 hover:text-slate-900"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Xóa bộ lọc
              </button>
            )}
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <section className="lg:col-span-7 bg-white rounded-xl border border-slate-200 overflow-hidden">
            <div className="px-4 py-3 border-b border-slate-200 flex items-center justify-between">
              <h2 className="font-semibold text-slate-900 text-sm">
                Danh sách căn ({filteredUnits.length} kết quả)
              </h2>
              <span className="text-xs text-slate-500">Bấm vào từng căn để xem giá & cập nhật</span>
            </div>

            <div className="overflow-x-auto max-h-[540px]">
              <table className="w-full text-left border-collapse text-xs sm:text-sm">
                <thead className="bg-slate-50 text-slate-600 sticky top-0 border-b border-slate-200">
                  <tr>
                    <th className="py-2.5 px-3 font-semibold">Mã căn</th>
                    <th className="py-2.5 px-3 font-semibold">Zone</th>
                    <th className="py-2.5 px-3 font-semibold">Loại / DT đất</th>
                    <th className="py-2.5 px-3 font-semibold text-right">Giá tham chiếu</th>
                    <th className="py-2.5 px-3 font-semibold">Trạng thái</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredUnits.map((unit) => {
                    const isSelected = unit.code === selectedUnit?.code;
                    return (
                      <tr
                        key={unit.code}
                        onClick={() => handleSelectUnit(unit)}
                        className={`cursor-pointer transition-colors ${
                          isSelected ? 'bg-amber-50/80' : 'hover:bg-slate-50'
                        }`}
                      >
                        <td className="py-2.5 px-3 font-semibold text-slate-900 whitespace-nowrap">
                          {unit.code}
                          {unit.salesName && (
                            <div className="text-[11px] font-normal text-slate-500">{unit.salesName}</div>
                          )}
                        </td>
                        <td className="py-2.5 px-3 whitespace-nowrap text-slate-700">{unit.zone}</td>
                        <td className="py-2.5 px-3 text-slate-700">
                          <div>{unit.type}</div>
                          <div className="text-xs text-slate-500">{unit.landArea} m² • BG {unit.handover}</div>
                        </td>
                        <td className="py-2.5 px-3 text-right font-medium text-slate-900 whitespace-nowrap">
                          {formatVND(unit.basePrice)}
                        </td>
                        <td className="py-2.5 px-3 whitespace-nowrap">
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ${STATUS_STYLES[unit.status] || STATUS_STYLES['Trống']}`}>
                            {unit.status === 'Trống' && <CheckCircle2 className="w-3 h-3" />}
                            {unit.status === 'Giữ chỗ' && <Clock className="w-3 h-3" />}
                            {(unit.status === 'Đã cọc' || unit.status === 'Đã rút') && <Lock className="w-3 h-3" />}
                            {unit.status}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                  {filteredUnits.length === 0 && (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-slate-500 text-sm">
                        Không tìm thấy căn phù hợp với bộ lọc hiện tại.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>

          <div className="lg:col-span-5 space-y-6">
            <form onSubmit={handleSaveStatus} className="bg-white rounded-xl border border-slate-200 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="font-semibold text-slate-900 text-sm">Cập nhật trạng thái căn</h2>
                <span className="text-xs text-slate-500">Cập nhật: {selectedUnit?.updatedAt}</span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs sm:text-sm">
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Mã căn</label>
                  <select
                    value={editorCode}
                    onChange={(e) => {
                      const code = e.target.value;
                      setEditorCode(code);
                      const found = units.find((u) => u.code === code);
                      if (found) handleSelectUnit(found);
                    }}
                    className="w-full px-2.5 py-2 border border-slate-300 rounded-lg bg-white"
                  >
                    {units.map((u) => (
                      <option key={u.code} value={u.code}>{u.code} ({u.zone})</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Trạng thái mới</label>
                  <select
                    value={editorStatus}
                    onChange={(e) => setEditorStatus(e.target.value)}
                    className="w-full px-2.5 py-2 border border-slate-300 rounded-lg bg-white"
                  >
                    <option value="Trống">Trống</option>
                    <option value="Giữ chỗ">Giữ chỗ</option>
                    <option value="Đã cọc">Đã cọc</option>
                    <option value="Đã rút">Đã rút</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Tư vấn viên / Cohort (VD: DTH1 - Uyên)</label>
                <input
                  type="text"
                  value={editorSales}
                  onChange={(e) => setEditorSales(e.target.value)}
                  placeholder="Nhập tên tư vấn viên hoặc sàn..."
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Ghi chú giữ chỗ / chuyển cọc</label>
                <input
                  type="text"
                  value={editorNote}
                  onChange={(e) => setEditorNote(e.target.value)}
                  placeholder="VD: Thời hạn giữ căn, thông tin khách..."
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 px-4 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold transition-colors"
              >
                Lưu trạng thái căn
              </button>
            </form>

            <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="font-semibold text-slate-900 text-sm flex items-center gap-1.5">
                  <Calculator className="w-4 h-4 text-amber-700" />
                  Ước tính giá theo chính sách ({selectedUnit?.code})
                </h2>
                <span className="text-xs font-medium text-slate-500">{selectedUnit?.zone}</span>
              </div>

              <div className="space-y-2 text-xs sm:text-sm bg-slate-50 rounded-lg p-3 border border-slate-200/80">
                <div className="flex justify-between">
                  <span className="text-slate-600">Giá tham chiếu (gồm VAT, chưa PBT):</span>
                  <span className="font-semibold text-slate-900">{formatVND(priceBreakdown.base)}</span>
                </div>
                <div className="flex justify-between text-emerald-700">
                  <span>CK PTTT2 (12% bắt buộc, không quy đổi tiền mặt):</span>
                  <span>-{formatVND(priceBreakdown.pttt2Discount)}</span>
                </div>

                <label className="flex items-center justify-between pt-1 border-t border-slate-200 cursor-pointer">
                  <span className="flex items-center gap-2 text-slate-700">
                    <input
                      type="checkbox"
                      checked={applyInteriorDiscount}
                      onChange={(e) => setApplyInteriorDiscount(e.target.checked)}
                      className="rounded border-slate-300 text-amber-700 focus:ring-amber-600"
                    />
                    Chiết khấu gói nội thất (12% sau PTTT2, không quy đổi tiền mặt)
                  </span>
                  <span className="text-emerald-700 font-medium">-{formatVND(priceBreakdown.interiorDiscount)}</span>
                </label>

                <div className="flex items-center justify-between gap-2 pt-1">
                  <span className="text-slate-600">Ưu đãi bổ sung theo điều kiện (%):</span>
                  <input
                    type="number"
                    min="0"
                    max="25"
                    step="0.5"
                    value={extraPromoRate}
                    onChange={(e) => setExtraPromoRate(e.target.value)}
                    className="w-20 px-2 py-1 text-right border border-slate-300 rounded bg-white text-xs"
                  />
                </div>

                <div className="flex justify-between pt-2 border-t border-slate-300 text-sm sm:text-base font-bold text-slate-900">
                  <span>Giá ước tính sau chiết khấu:</span>
                  <span className="text-amber-800">{formatVND(priceBreakdown.estimatedNet)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <form onSubmit={handleAddUnit} className="lg:col-span-5 bg-white rounded-xl border border-slate-200 p-4 space-y-3">
            <h2 className="font-semibold text-slate-900 text-sm flex items-center gap-1.5">
              <Plus className="w-4 h-4 text-amber-700" />
              Thêm nhanh mã căn vào giỏ
            </h2>
            <div className="grid grid-cols-2 gap-3 text-xs sm:text-sm">
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Mã căn</label>
                <input
                  type="text"
                  value={newCode}
                  onChange={(e) => setNewCode(e.target.value)}
                  placeholder="VD: LA4-T115.02"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Zone</label>
                <input
                  type="text"
                  value={newZone}
                  onChange={(e) => setNewZone(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Loại sản phẩm</label>
                <input
                  type="text"
                  value={newType}
                  onChange={(e) => setNewType(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">DT đất (m²)</label>
                <input
                  type="number"
                  step="0.01"
                  value={newLandArea}
                  onChange={(e) => setNewLandArea(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Giá tham chiếu (VNĐ)</label>
              <input
                type="number"
                step="1000000"
                value={newPrice}
                onChange={(e) => setNewPrice(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg"
              />
            </div>
            <button
              type="submit"
              className="w-full py-2 px-4 rounded-lg bg-amber-700 hover:bg-amber-800 text-white text-sm font-semibold transition-colors"
            >
              + Thêm căn vào danh sách
            </button>
          </form>

          <section className="lg:col-span-7 bg-white rounded-xl border border-slate-200 p-4 space-y-3">
            <h2 className="font-semibold text-slate-900 text-sm flex items-center gap-1.5">
              <History className="w-4 h-4 text-slate-600" />
              Nhật ký cập nhật giỏ hàng
            </h2>
            <div className="divide-y divide-slate-100 max-h-60 overflow-y-auto text-xs sm:text-sm">
              {logs.map((item, idx) => (
                <div key={idx} className="py-2 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <div>
                    <span className="font-semibold text-slate-800">{item.actor}: </span>
                    <span className="text-slate-700">{item.detail}</span>
                  </div>
                  <span className="text-xs text-slate-400 shrink-0">{item.time}</span>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

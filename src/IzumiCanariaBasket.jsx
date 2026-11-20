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
  ShieldCheck,
  LayoutDashboard,
  Users,
  Sparkles,
  Copy,
  Check,
  PhoneCall,
  MapPin
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

const INITIAL_LEADS = [
  { id: 'L-101', name: 'Anh Hoàng Minh', phone: '0903 xxx 412', interest: 'LA4-SD02.02 (Zone 1.1)', stage: 'Đặt lịch tham quan', owner: 'Phương Uyên', note: 'Ưu tiên bàn giao 12/2026, quan tâm PTTT2' },
  { id: 'L-102', name: 'Chị Ngọc Lan', phone: '0918 xxx 889', interest: 'LA4-T114.03 (Zone 2.2)', stage: 'Đang giữ chỗ / tư vấn', owner: 'DTH1 - Uyên', note: 'Đã gửi bảng ước tính CK PTTT2 + gói nội thất' },
  { id: 'L-103', name: 'Anh Quốc Bảo', phone: '0989 xxx 205', interest: 'LA4-SD08.01 (Zone 3.2)', stage: 'Khách mới', owner: 'DTH2', note: 'Tìm biệt thự sân rộng, kết nối Vành Đai 3' }
];

const STATUS_STYLES = {
  'Trống': 'bg-emerald-50 text-emerald-700 border-emerald-200/90',
  'Giữ chỗ': 'bg-amber-50 text-amber-800 border-amber-200/90',
  'Đã cọc': 'bg-rose-50 text-rose-700 border-rose-200/90',
  'Đã rút': 'bg-slate-100 text-slate-500 border-slate-200'
};

const formatVND = (val) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 }).format(Math.round(val || 0));

const formatBillion = (val) => `${((val || 0) / 1e9).toFixed(2)} tỷ`;

const nowLabel = () => {
  const d = new Date();
  const pad = (n) => String(n).padStart(2, '0');
  return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

export default function IzumiCanariaBasket() {
  const [activeTab, setActiveTab] = useState('basket');
  const [units, setUnits] = useState(INITIAL_UNITS);
  const [leads, setLeads] = useState(INITIAL_LEADS);
  const [searchQuery, setSearchQuery] = useState('');
  const [zoneFilter, setZoneFilter] = useState('ALL');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedCode, setSelectedCode] = useState('LA4-SD02.02');
  const [copiedQuote, setCopiedQuote] = useState(false);

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

  const [leadName, setLeadName] = useState('');
  const [leadPhone, setLeadPhone] = useState('');
  const [leadStage, setLeadStage] = useState('Khách mới');
  const [leadNote, setLeadNote] = useState('');

  const [logs, setLogs] = useState([
    { time: '20/11/2026 08:30', actor: 'Hệ thống', detail: 'Nạp giỏ hàng Izumi Canaria & Izumi City (đã loại trừ LA4-T113.08 khỏi giỏ mở bán).' }
  ]);

  const zones = useMemo(() => ['ALL', ...Array.from(new Set(units.map((u) => u.zone)))], [units]);
  const types = useMemo(() => ['ALL', ...Array.from(new Set(units.map((u) => u.type)))], [units]);

  const filteredUnits = useMemo(() => {
    return units.filter((u) => {
      const matchSearch =
        u.code.toLowerCase().includes(searchQuery.trim().toLowerCase()) ||
        (u.salesName && u.salesName.toLowerCase().includes(searchQuery.trim().toLowerCase())) ||
        u.zone.toLowerCase().includes(searchQuery.trim().toLowerCase());
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
        detail: `Cập nhật mã ${editorCode} → "${editorStatus}"${editorNote.trim() ? ` (${editorNote.trim()})` : ''}.`
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
      note: 'Thêm mới trên CRM giỏ hàng',
      updatedAt: ts
    };
    setUnits((prev) => [created, ...prev]);
    setSelectedCode(cleanCode);
    setNewCode('');
    setLogs((prev) => [{ time: ts, actor: 'Quản trị giỏ hàng', detail: `Thêm mới căn ${cleanCode} (${newZone}).` }, ...prev]);
  };

  const handleAddLead = (e) => {
    e.preventDefault();
    if (!leadName.trim()) return;
    const createdLead = {
      id: `L-${100 + leads.length + 1}`,
      name: leadName.trim(),
      phone: leadPhone.trim() || 'Chưa cập nhật',
      interest: `${selectedUnit?.code || 'LA4-SD02.02'} (${selectedUnit?.zone || 'Zone 1.1'})`,
      stage: leadStage,
      owner: editorSales.trim() || 'Phương Uyên',
      note: leadNote.trim() || 'Khách quan tâm giỏ hàng Izumi Canaria'
    };
    setLeads((prev) => [createdLead, ...prev]);
    setLeadName('');
    setLeadPhone('');
    setLeadNote('');
    setLogs((prev) => [
      { time: nowLabel(), actor: createdLead.owner, detail: `Tạo hồ sơ khách ${createdLead.name} (${createdLead.interest}).` },
      ...prev
    ]);
  };

  const handleCopyQuote = () => {
    if (!selectedUnit) return;
    const text = [
      `IZUMI CANARIA - ${selectedUnit.code} (${selectedUnit.zone})`,
      `Loại: ${selectedUnit.type} | DT đất: ${selectedUnit.landArea} m² | Bàn giao: ${selectedUnit.handover}`,
      `Giá tham chiếu (gồm VAT, chưa PBT): ${formatVND(priceBreakdown.base)}`,
      `CK PTTT2 (12% bắt buộc, không quy đổi tiền mặt): -${formatVND(priceBreakdown.pttt2Discount)}`,
      applyInteriorDiscount ? `CK gói nội thất (12% sau PTTT2): -${formatVND(priceBreakdown.interiorDiscount)}` : null,
      Number(extraPromoRate) > 0 ? `Ưu đãi bổ sung (${extraPromoRate}%): -${formatVND(priceBreakdown.extraDiscount)}` : null,
      `Giá ước tính sau chiết khấu: ${formatVND(priceBreakdown.estimatedNet)}`
    ]
      .filter(Boolean)
      .join('\n');
    navigator.clipboard?.writeText(text);
    setCopiedQuote(true);
    setTimeout(() => setCopiedQuote(false), 1800);
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
    const blob = new Blob([JSON.stringify({ exportedAt: nowLabel(), units, leads, logs }, null, 2)], { type: 'application/json' });
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
          if (Array.isArray(parsed.leads)) setLeads(parsed.leads);
          if (Array.isArray(parsed.logs)) setLogs(parsed.logs);
          setLogs((prev) => [{ time: nowLabel(), actor: 'Nhập dữ liệu', detail: `Đã nạp file ${file.name}.` }, ...prev]);
        }
      } catch (_) {}
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <div className="min-h-screen bg-[#F4F6F9] text-slate-800 flex flex-col lg:flex-row">
      {/* Sidebar CRM bên trái */}
      <aside className="w-full lg:w-64 bg-[#0F172A] text-slate-300 flex-shrink-0 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-slate-800">
        <div>
          <div className="px-5 py-5 border-b border-slate-800/90 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/15 border border-amber-400/30 flex items-center justify-center text-amber-400">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-widest text-amber-400">Izumi CRM</div>
              <div className="text-sm font-bold text-white leading-tight">Canaria • Izumi City</div>
            </div>
          </div>

          <div className="px-3 py-4 space-y-1">
            <div className="px-2.5 pb-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
              Không gian làm việc
            </div>
            <button
              type="button"
              onClick={() => setActiveTab('basket')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition ${
                activeTab === 'basket'
                  ? 'bg-amber-500 text-slate-950 font-semibold shadow-sm'
                  : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
              }`}
            >
              <span className="flex items-center gap-2.5">
                <LayoutDashboard className="w-4 h-4" />
                Giỏ hàng & Tính giá
              </span>
              <span className={`text-xs px-2 py-0.5 rounded-full ${activeTab === 'basket' ? 'bg-slate-950/15 text-slate-950' : 'bg-slate-800 text-slate-300'}`}>
                {stats.totalActive}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('leads')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition ${
                activeTab === 'leads'
                  ? 'bg-amber-500 text-slate-950 font-semibold shadow-sm'
                  : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
              }`}
            >
              <span className="flex items-center gap-2.5">
                <Users className="w-4 h-4" />
                Khách & Giữ chỗ
              </span>
              <span className={`text-xs px-2 py-0.5 rounded-full ${activeTab === 'leads' ? 'bg-slate-950/15 text-slate-950' : 'bg-slate-800 text-slate-300'}`}>
                {leads.length}
              </span>
            </button>
          </div>

          <div className="px-3 py-2 space-y-1.5 border-t border-slate-800/80 pt-4">
            <div className="px-2.5 pb-1 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
              Tài liệu & Đối chiếu
            </div>
            <a
              href={SOURCE_LINKS.basket.url}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-slate-300 hover:bg-slate-800/80 hover:text-white transition"
            >
              <span className="flex items-center gap-2">
                <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
                {SOURCE_LINKS.basket.label}
              </span>
              <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
            </a>
            <a
              href={SOURCE_LINKS.businessInfo.url}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-slate-300 hover:bg-slate-800/80 hover:text-white transition"
            >
              <span className="flex items-center gap-2">
                <FolderOpen className="w-4 h-4 text-amber-400" />
                {SOURCE_LINKS.businessInfo.label}
              </span>
              <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
            </a>
            <a
              href={SOURCE_LINKS.iso.url}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-slate-300 hover:bg-slate-800/80 hover:text-white transition"
            >
              <span className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-sky-400" />
                {SOURCE_LINKS.iso.label}
              </span>
              <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
            </a>
          </div>
        </div>

        <div className="p-4 m-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-400 space-y-1">
          <div className="font-semibold text-slate-200 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            Quy tắc chiết khấu PTTT2
          </div>
          <p className="leading-relaxed">
            Chiết khấu 12% bắt buộc, không quy đổi tiền mặt. Vui lòng đối chiếu bảng giỏ hàng gốc & PKD CĐT trước khi chốt cọc.
          </p>
        </div>
      </aside>

      {/* Vùng nội dung chính bên phải */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Top bar */}
        <header className="bg-white/95 backdrop-blur border-b border-slate-200/80 sticky top-0 z-20">
          <div className="max-w-[1440px] mx-auto px-4 sm:px-6 py-3.5 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <span className="inline-flex items-center gap-1 font-medium text-amber-800 bg-amber-50 border border-amber-200/80 px-2 py-0.5 rounded-full">
                  <MapPin className="w-3 h-3" /> Đồng Nai
                </span>
                <span>•</span>
                <span>Cập nhật trạng thái & báo giá nhanh cho Sales</span>
              </div>
              <h1 className="text-lg sm:text-xl font-bold text-slate-900 mt-0.5">
                {activeTab === 'basket' ? 'Bảng Điều Hành Giỏ Hàng & Ước Tính Giá' : 'Theo Dõi Khách Hàng & Giữ Chỗ'}
              </h1>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={handleExportCSV}
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 shadow-2xs transition"
              >
                <Download className="w-3.5 h-3.5 text-slate-500" />
                Xuất CSV
              </button>
              <button
                type="button"
                onClick={handleExportJSON}
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 shadow-2xs transition"
              >
                <Download className="w-3.5 h-3.5 text-slate-500" />
                Xuất JSON
              </button>
              <label className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 shadow-2xs cursor-pointer transition">
                <Upload className="w-3.5 h-3.5 text-slate-500" />
                Nhập JSON
                <input type="file" accept="application/json" onChange={handleImportJSON} className="hidden" />
              </label>
            </div>
          </div>
        </header>

        <main className="max-w-[1440px] w-full mx-auto px-4 sm:px-6 py-6 space-y-6">
          {/* Thông báo lưu ý */}
          <div className="bg-white border border-amber-200/90 rounded-2xl p-3.5 flex items-start gap-3 shadow-2xs">
            <div className="w-8 h-8 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700 shrink-0">
              <AlertCircle className="w-4 h-4" />
            </div>
            <div className="text-xs sm:text-sm text-slate-700 leading-relaxed">
              <span className="font-semibold text-slate-900">Lưu ý áp dụng chính sách:</span> Các chương trình/ưu đãi áp dụng theo điều kiện, đối tượng và thời điểm từng đợt; quy tắc <strong className="text-slate-900">PTTT2 chiết khấu 12% bắt buộc, không quy đổi tiền mặt</strong>. Luôn đối chiếu giỏ hàng gốc & văn bản PKD CĐT trước khi xác nhận cọc.
            </div>
          </div>

          {/* 5 thẻ KPI phong cách CRM */}
          <section className="grid grid-cols-2 sm:grid-cols-5 gap-3.5">
            <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-2xs">
              <div className="text-xs font-medium text-slate-500">Đang mở bán</div>
              <div className="text-2xl font-bold text-slate-900 mt-1.5">{stats.totalActive} <span className="text-xs font-normal text-slate-400">căn</span></div>
            </div>
            <div className="bg-white rounded-2xl border border-emerald-200/80 p-4 shadow-2xs">
              <div className="text-xs font-semibold text-emerald-700">Còn trống</div>
              <div className="text-2xl font-bold text-emerald-700 mt-1.5">{stats.available} <span className="text-xs font-normal text-emerald-600/80">căn</span></div>
            </div>
            <div className="bg-white rounded-2xl border border-amber-200/80 p-4 shadow-2xs">
              <div className="text-xs font-semibold text-amber-800">Đang giữ chỗ</div>
              <div className="text-2xl font-bold text-amber-800 mt-1.5">{stats.reserved} <span className="text-xs font-normal text-amber-700/80">căn</span></div>
            </div>
            <div className="bg-white rounded-2xl border border-rose-200/80 p-4 shadow-2xs">
              <div className="text-xs font-semibold text-rose-700">Đã cọc</div>
              <div className="text-2xl font-bold text-rose-700 mt-1.5">{stats.deposited} <span className="text-xs font-normal text-rose-600/80">căn</span></div>
            </div>
            <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-2xs col-span-2 sm:col-span-1">
              <div className="text-xs font-medium text-slate-500">Đã rút giỏ</div>
              <div className="text-2xl font-bold text-slate-500 mt-1.5">{stats.withdrawn} <span className="text-xs font-normal text-slate-400">căn</span></div>
            </div>
          </section>

          {activeTab === 'basket' ? (
            <>
              {/* Thanh tìm kiếm & bộ lọc */}
              <section className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-2xs space-y-3">
                <div className="flex flex-col lg:flex-row lg:items-center gap-3">
                  <div className="relative flex-1">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Tìm mã căn (VD: LA4-SD02.02, LA4-T114.03), Zone hoặc tên sale..."
                      className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50/70 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500 transition"
                    />
                  </div>

                  <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm">
                    <span className="inline-flex items-center gap-1 text-slate-500 font-medium mr-0.5">
                      <Filter className="w-3.5 h-3.5" /> Lọc:
                    </span>
                    <select
                      value={zoneFilter}
                      onChange={(e) => setZoneFilter(e.target.value)}
                      className="px-3 py-2 border border-slate-200 rounded-xl bg-white text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-amber-500/30"
                    >
                      {zones.map((z) => (
                        <option key={z} value={z}>{z === 'ALL' ? 'Tất cả Zone' : z}</option>
                      ))}
                    </select>
                    <select
                      value={typeFilter}
                      onChange={(e) => setTypeFilter(e.target.value)}
                      className="px-3 py-2 border border-slate-200 rounded-xl bg-white text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-amber-500/30"
                    >
                      {types.map((t) => (
                        <option key={t} value={t}>{t === 'ALL' ? 'Tất cả loại hình' : t}</option>
                      ))}
                    </select>
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="px-3 py-2 border border-slate-200 rounded-xl bg-white text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-amber-500/30"
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
                        className="inline-flex items-center gap-1 px-3 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 rounded-xl transition"
                      >
                        <RotateCcw className="w-3.5 h-3.5" /> Xóa lọc
                      </button>
                    )}
                  </div>
                </div>
              </section>

              {/* Grid chính: Bảng giỏ hàng + Panel chi tiết / tính giá */}
              <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
                <section className="xl:col-span-7 bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
                  <div className="px-5 py-3.5 border-b border-slate-200/80 flex items-center justify-between bg-white">
                    <div>
                      <h2 className="font-bold text-slate-900 text-sm sm:text-base">
                        Danh sách căn mở bán & theo dõi ({filteredUnits.length})
                      </h2>
                      <p className="text-xs text-slate-500">Chọn một dòng để cập nhật trạng thái và tính báo giá nhanh</p>
                    </div>
                  </div>

                  <div className="overflow-x-auto max-h-[580px]">
                    <table className="w-full text-left border-collapse text-xs sm:text-sm">
                      <thead className="bg-slate-50/90 text-slate-500 sticky top-0 border-b border-slate-200/80 text-[11px] uppercase tracking-wider">
                        <tr>
                          <th className="py-3 px-4 font-semibold">Mã căn</th>
                          <th className="py-3 px-3 font-semibold">Zone</th>
                          <th className="py-3 px-3 font-semibold">Loại / DT đất</th>
                          <th className="py-3 px-3 font-semibold text-right">Giá tham chiếu</th>
                          <th className="py-3 px-4 font-semibold">Trạng thái</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {filteredUnits.map((unit) => {
                          const isSelected = unit.code === selectedUnit?.code;
                          return (
                            <tr
                              key={unit.code}
                              onClick={() => handleSelectUnit(unit)}
                              className={`cursor-pointer transition ${
                                isSelected
                                  ? 'bg-amber-50/80 ring-1 ring-inset ring-amber-200'
                                  : 'hover:bg-slate-50/90'
                              }`}
                            >
                              <td className="py-3 px-4 font-bold text-slate-900 whitespace-nowrap">
                                <div className="flex items-center gap-2">
                                  <span>{unit.code}</span>
                                </div>
                                {unit.salesName && (
                                  <div className="text-[11px] font-medium text-amber-800 mt-0.5">{unit.salesName}</div>
                                )}
                              </td>
                              <td className="py-3 px-3 whitespace-nowrap">
                                <span className="px-2 py-1 rounded-lg bg-slate-100 text-slate-700 font-medium text-xs">
                                  {unit.zone}
                                </span>
                              </td>
                              <td className="py-3 px-3 text-slate-700">
                                <div className="font-medium text-slate-800">{unit.type}</div>
                                <div className="text-xs text-slate-500">{unit.landArea} m² • BG {unit.handover}</div>
                              </td>
                              <td className="py-3 px-3 text-right whitespace-nowrap">
                                <div className="font-bold text-slate-900">{formatBillion(unit.basePrice)}</div>
                                <div className="text-[11px] text-slate-400">{formatVND(unit.basePrice)}</div>
                              </td>
                              <td className="py-3 px-4 whitespace-nowrap">
                                <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border ${STATUS_STYLES[unit.status] || STATUS_STYLES['Trống']}`}>
                                  {unit.status === 'Trống' && <CheckCircle2 className="w-3.5 h-3.5" />}
                                  {unit.status === 'Giữ chỗ' && <Clock className="w-3.5 h-3.5" />}
                                  {(unit.status === 'Đã cọc' || unit.status === 'Đã rút') && <Lock className="w-3.5 h-3.5" />}
                                  {unit.status}
                                </span>
                              </td>
                            </tr>
                          );
                        })}
                        {filteredUnits.length === 0 && (
                          <tr>
                            <td colSpan={5} className="py-10 text-center text-slate-500 text-sm">
                              Không tìm thấy căn nào khớp điều kiện lọc hiện tại.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </section>

                {/* Cột phải: Máy tính chiết khấu + Cập nhật trạng thái */}
                <div className="xl:col-span-5 space-y-6">
                  {/* Card báo giá & chiết khấu */}
                  <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs space-y-4">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="text-xs font-semibold uppercase tracking-wider text-amber-700">Bảng tính chiết khấu</div>
                        <h2 className="font-bold text-slate-900 text-base flex items-center gap-1.5 mt-0.5">
                          <Calculator className="w-4 h-4 text-amber-700" />
                          {selectedUnit?.code} • {selectedUnit?.zone}
                        </h2>
                      </div>
                      <button
                        type="button"
                        onClick={handleCopyQuote}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
                      >
                        {copiedQuote ? <Check className="w-3.5 h-3.5 text-emerald-700" /> : <Copy className="w-3.5 h-3.5" />}
                        {copiedQuote ? 'Đã chép' : 'Chép báo giá'}
                      </button>
                    </div>

                    <div className="space-y-2.5 text-xs sm:text-sm bg-[#F8FAFC] rounded-xl p-4 border border-slate-200/70">
                      <div className="flex justify-between items-center">
                        <span className="text-slate-600">Giá tham chiếu (gồm VAT, chưa PBT):</span>
                        <span className="font-bold text-slate-900">{formatVND(priceBreakdown.base)}</span>
                      </div>
                      <div className="flex justify-between items-center text-emerald-700 font-medium">
                        <span>CK PTTT2 (12% bắt buộc, không quy đổi):</span>
                        <span>-{formatVND(priceBreakdown.pttt2Discount)}</span>
                      </div>

                      <label className="flex items-center justify-between gap-2 pt-2 border-t border-slate-200/80 cursor-pointer">
                        <span className="flex items-center gap-2 text-slate-700 font-medium">
                          <input
                            type="checkbox"
                            checked={applyInteriorDiscount}
                            onChange={(e) => setApplyInteriorDiscount(e.target.checked)}
                            className="rounded border-slate-300 text-amber-600 focus:ring-amber-500"
                          />
                          CK gói nội thất (12% sau PTTT2)
                        </span>
                        <span className="text-emerald-700 font-semibold">-{formatVND(priceBreakdown.interiorDiscount)}</span>
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
                          className="w-24 px-2.5 py-1 text-right font-semibold border border-slate-200 rounded-lg bg-white text-slate-900"
                        />
                      </div>

                      <div className="flex justify-between items-baseline pt-3 border-t border-slate-200 text-sm sm:text-base font-bold text-slate-900">
                        <span>Giá ước tính sau chiết khấu:</span>
                        <div className="text-right">
                          <div className="text-amber-800 text-base sm:text-lg">{formatBillion(priceBreakdown.estimatedNet)}</div>
                          <div className="text-[11px] font-medium text-slate-500">{formatVND(priceBreakdown.estimatedNet)}</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Form cập nhật trạng thái */}
                  <form onSubmit={handleSaveStatus} className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs space-y-3.5">
                    <div className="flex items-center justify-between">
                      <h2 className="font-bold text-slate-900 text-sm sm:text-base">Cập nhật trạng thái căn</h2>
                      <span className="text-[11px] text-slate-400">{selectedUnit?.updatedAt}</span>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-xs sm:text-sm">
                      <div>
                        <label className="block text-xs font-semibold text-slate-600 mb-1">Mã căn</label>
                        <select
                          value={editorCode}
                          onChange={(e) => {
                            const code = e.target.value;
                            setEditorCode(code);
                            const found = units.find((u) => u.code === code);
                            if (found) handleSelectUnit(found);
                          }}
                          className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white font-medium"
                        >
                          {units.map((u) => (
                            <option key={u.code} value={u.code}>{u.code} ({u.zone})</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-600 mb-1">Trạng thái mới</label>
                        <select
                          value={editorStatus}
                          onChange={(e) => setEditorStatus(e.target.value)}
                          className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white font-medium"
                        >
                          <option value="Trống">Trống</option>
                          <option value="Giữ chỗ">Giữ chỗ</option>
                          <option value="Đã cọc">Đã cọc</option>
                          <option value="Đã rút">Đã rút</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1">Tư vấn viên / Cohort</label>
                      <input
                        type="text"
                        value={editorSales}
                        onChange={(e) => setEditorSales(e.target.value)}
                        placeholder="VD: Phương Uyên / DTH1"
                        className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/30"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1">Ghi chú giữ căn / cọc</label>
                      <input
                        type="text"
                        value={editorNote}
                        onChange={(e) => setEditorNote(e.target.value)}
                        placeholder="VD: Giữ 24h, khách hẹn xem thực địa..."
                        className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/30"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-2.5 px-4 rounded-xl bg-[#0F172A] hover:bg-slate-800 text-white text-sm font-semibold transition shadow-2xs"
                    >
                      Lưu cập nhật trạng thái
                    </button>
                  </form>
                </div>
              </div>

              {/* Hàng dưới: Thêm căn nhanh + Nhật ký */}
              <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
                <form onSubmit={handleAddUnit} className="xl:col-span-5 bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs space-y-3.5">
                  <h2 className="font-bold text-slate-900 text-sm sm:text-base flex items-center gap-1.5">
                    <Plus className="w-4 h-4 text-amber-700" />
                    Thêm nhanh mã căn vào giỏ
                  </h2>
                  <div className="grid grid-cols-2 gap-3 text-xs sm:text-sm">
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1">Mã căn</label>
                      <input
                        type="text"
                        value={newCode}
                        onChange={(e) => setNewCode(e.target.value)}
                        placeholder="VD: LA4-T115.02"
                        className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1">Zone</label>
                      <input
                        type="text"
                        value={newZone}
                        onChange={(e) => setNewZone(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1">Loại sản phẩm</label>
                      <input
                        type="text"
                        value={newType}
                        onChange={(e) => setNewType(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1">DT đất (m²)</label>
                      <input
                        type="number"
                        step="0.01"
                        value={newLandArea}
                        onChange={(e) => setNewLandArea(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Giá tham chiếu (VNĐ)</label>
                    <input
                      type="number"
                      step="1000000"
                      value={newPrice}
                      onChange={(e) => setNewPrice(e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 text-sm font-bold transition shadow-2xs"
                  >
                    + Thêm căn vào danh sách
                  </button>
                </form>

                <section className="xl:col-span-7 bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs space-y-3">
                  <h2 className="font-bold text-slate-900 text-sm sm:text-base flex items-center gap-1.5">
                    <History className="w-4 h-4 text-slate-600" />
                    Nhật ký hoạt động gần đây
                  </h2>
                  <div className="divide-y divide-slate-100 max-h-60 overflow-y-auto text-xs sm:text-sm">
                    {logs.map((item, idx) => (
                      <div key={idx} className="py-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                        <div>
                          <span className="font-semibold text-slate-900">{item.actor}: </span>
                          <span className="text-slate-600">{item.detail}</span>
                        </div>
                        <span className="text-xs text-slate-400 shrink-0">{item.time}</span>
                      </div>
                    ))}
                  </div>
                </section>
              </div>
            </>
          ) : (
            /* Tab CRM Khách hàng & Giữ chỗ */
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
              <section className="xl:col-span-7 bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="font-bold text-slate-900 text-base">Danh sách khách hàng quan tâm & giữ chỗ</h2>
                    <p className="text-xs text-slate-500">Gắn nhanh với mã căn đang chọn ({selectedUnit?.code})</p>
                  </div>
                </div>

                <div className="space-y-3">
                  {leads.map((lead) => (
                    <div key={lead.id} className="p-4 rounded-xl border border-slate-200/80 bg-[#F8FAFC] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-bold text-slate-900 text-sm">{lead.name}</span>
                          <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-100/80 text-amber-900 font-semibold">
                            {lead.stage}
                          </span>
                          <span className="text-xs text-slate-500">• {lead.owner}</span>
                        </div>
                        <div className="text-xs text-slate-600 flex items-center gap-3 flex-wrap">
                          <span className="inline-flex items-center gap-1 font-medium text-slate-700">
                            <PhoneCall className="w-3.5 h-3.5 text-slate-400" /> {lead.phone}
                          </span>
                          <span>Mã quan tâm: <strong className="text-slate-900">{lead.interest}</strong></span>
                        </div>
                        <p className="text-xs text-slate-500">{lead.note}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              <form onSubmit={handleAddLead} className="xl:col-span-5 bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs space-y-3.5">
                <h2 className="font-bold text-slate-900 text-base">Thêm khách hàng / lịch giữ chỗ</h2>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Tên khách hàng</label>
                  <input
                    type="text"
                    value={leadName}
                    onChange={(e) => setLeadName(e.target.value)}
                    placeholder="VD: Anh Minh Tuấn"
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3 text-xs sm:text-sm">
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Số điện thoại</label>
                    <input
                      type="text"
                      value={leadPhone}
                      onChange={(e) => setLeadPhone(e.target.value)}
                      placeholder="090x xxx xxx"
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Giai đoạn</label>
                    <select
                      value={leadStage}
                      onChange={(e) => setLeadStage(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white"
                    >
                      <option value="Khách mới">Khách mới</option>
                      <option value="Đặt lịch tham quan">Đặt lịch tham quan</option>
                      <option value="Đang giữ chỗ / tư vấn">Đang giữ chỗ / tư vấn</option>
                      <option value="Chờ chốt cọc">Chờ chốt cọc</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Ghi chú nhu cầu & lịch hẹn</label>
                  <input
                    type="text"
                    value={leadNote}
                    onChange={(e) => setLeadNote(e.target.value)}
                    placeholder={`Quan tâm ${selectedUnit?.code || 'LA4-SD02.02'}, hẹn xem nhà mẫu...`}
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-2.5 px-4 rounded-xl bg-[#0F172A] hover:bg-slate-800 text-white text-sm font-semibold transition"
                >
                  + Lưu khách hàng vào CRM
                </button>
              </form>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

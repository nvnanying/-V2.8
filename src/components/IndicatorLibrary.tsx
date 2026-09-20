import React, { useEffect, useState } from 'react';
import {
  ChevronDown, ChevronLeft, ChevronRight, Download, Edit2, FileText, Folder, GripVertical, Info, Plus, RotateCcw, Search, Settings, X,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import {
  buildIndicators, buildLibIndicators, buildLibTree, DATA_TYPES, findGeneralTable, GENERAL_LIB, Indicator, INDICATOR_DISEASES,
  LibGroup, PATIENT_INFO_CODE, REFERENCED_CODES, SEARCH_TYPES,
} from './researchData';
import { btn, Checkbox, Drawer, Highlight, useToast } from './ResearchUI';

export interface IndicatorFocus {
  dsCode: string;
  keyword: string;
  nonce: number;
}

type ColKey = 'fillRate' | 'dataType' | 'field' | 'searchType' | 'domain' | 'code' | 'desc';
const OPTIONAL_COLS: { key: ColKey; title: string; width: number }[] = [
  { key: 'fillRate', title: '填充率', width: 130 },
  { key: 'dataType', title: '数据类型', width: 100 },
  { key: 'field', title: '绑定字段', width: 180 },
  { key: 'searchType', title: '检索类型', width: 130 },
  { key: 'domain', title: '检索值域', width: 160 },
  { key: 'code', title: '指标编码', width: 110 },
  { key: 'desc', title: '指标说明', width: 170 },
];

const fillColor = (v: number) => (v >= 80 ? 'bg-green-500' : v >= 30 ? 'bg-blue-500' : v > 0 ? 'bg-orange-400' : 'bg-slate-300');

const Select = ({ value, options, placeholder, onChange, allowAll }: {
  value: string; options: string[]; placeholder: string; onChange: (v: string) => void; allowAll?: boolean;
}) => (
  <div className="relative">
    <select
      value={value}
      onChange={e => onChange(e.target.value)}
      className={`w-full h-8 appearance-none border border-slate-200 rounded px-2.5 pr-7 text-[13px] outline-none focus:border-blue-500 bg-white ${value ? 'text-slate-800' : 'text-slate-400'}`}
    >
      {allowAll && <option value="">{placeholder}</option>}
      {options.map(o => <option key={o} value={o} className="text-slate-800">{o}</option>)}
    </select>
    <ChevronDown className="absolute right-2 top-2 w-4 h-4 text-slate-400 pointer-events-none" />
  </div>
);

const EMPTY_FORM = { name: '', field: '', dataType: '无', searchType: '文本输入', domain: '', desc: '' };

export const IndicatorLibrary = ({ store, setStore, trees, setTrees, focus, onFocusHandled }: {
  store: Record<string, Indicator[]>; // key: `${科研库序号}|${数据集编码}`
  setStore: React.Dispatch<React.SetStateAction<Record<string, Indicator[]>>>;
  trees: Record<number, LibGroup[]>;
  setTrees: React.Dispatch<React.SetStateAction<Record<number, LibGroup[]>>>;
  focus: IndicatorFocus | null;
  onFocusHandled: () => void;
}) => {
  const [diseaseIndex, setDiseaseIndex] = useState(1);
  const [collapsed, setCollapsed] = useState(false);
  const [treeKeyword, setTreeKeyword] = useState('');
  const [closedGroups, setClosedGroups] = useState<string[]>([]);
  const [dsCode, setDsCode] = useState(PATIENT_INFO_CODE);

  // 从通用库引入
  const [importOpen, setImportOpen] = useState(false);
  const [importKeyword, setImportKeyword] = useState('');
  const [importSelected, setImportSelected] = useState<string[]>([]);
  const [importSearchConfig, setImportSearchConfig] = useState(false);
  const [importConfirm, setImportConfirm] = useState(false);

  const [draft, setDraft] = useState({ keyword: '', dataType: '', searchType: '' });
  const [filters, setFilters] = useState(draft);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(50);
  const [checked, setChecked] = useState<string[]>([]);
  const [hiddenCols, setHiddenCols] = useState<ColKey[]>([]);
  const [colMenu, setColMenu] = useState(false);

  const [drawer, setDrawer] = useState<{ mode: 'view' | 'edit' | 'add'; row: Indicator | null } | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState<{ name?: boolean; field?: boolean }>({});
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [toastNode, toast] = useToast();

  // 从科研数据集跳转过来时，定位数据集并按指标名筛选
  useEffect(() => {
    if (!focus) return;
    const group = findGeneralTable(focus.dsCode)?.group;
    if (group) setClosedGroups(o => o.filter(x => x !== `${GENERAL_LIB}:${group}`));
    setDiseaseIndex(GENERAL_LIB);
    setDsCode(focus.dsCode);
    const next = { keyword: focus.keyword, dataType: '', searchType: '' };
    setDraft(next); setFilters(next); setPage(1); setChecked([]);
    onFocusHandled();
  }, [focus]);

  const isGeneral = diseaseIndex === GENERAL_LIB;
  const libName = INDICATOR_DISEASES[diseaseIndex];
  const tree = trees[diseaseIndex] ?? buildLibTree(diseaseIndex, libName);
  const placedCodes = tree.flatMap(g => g.tables.map(t => t.code));
  // 专病库引用了、但还没放进目录的通用库表
  const unassigned = isGeneral ? [] : REFERENCED_CODES.filter(c => !placedCodes.includes(c)).map(c => ({ name: findGeneralTable(c)!.table.name, code: c }));
  const allTables = [...tree.flatMap(g => g.tables), ...unassigned];

  const storeKey = (lib: number, code: string) => `${lib}|${code}`;
  const rows = store[storeKey(diseaseIndex, dsCode)] ?? buildLibIndicators(diseaseIndex, dsCode);
  const setRows = (fn: (r: Indicator[]) => Indicator[]) => setStore(prev => {
    const key = storeKey(diseaseIndex, dsCode);
    return { ...prev, [key]: fn(prev[key] ?? buildLibIndicators(diseaseIndex, dsCode)) };
  });
  const dsName = allTables.find(t => t.code === dsCode)?.name ?? '';

  const switchLibrary = (i: number) => {
    const nextTree = trees[i] ?? buildLibTree(i, INDICATOR_DISEASES[i]);
    const codes = [...nextTree.flatMap(g => g.tables.map(t => t.code)), ...(i === GENERAL_LIB ? [] : REFERENCED_CODES)];
    setDiseaseIndex(i);
    if (!codes.includes(dsCode)) setDsCode(codes[0]);
    setChecked([]); setPage(1);
  };

  /* ---------- 从通用库引入 ---------- */
  const importList = REFERENCED_CODES.map(code => {
    const src = findGeneralTable(code)!;
    return { code, name: src.table.name, group: src.group };
  });
  const importKw = importKeyword.trim().toLowerCase();
  const importVisible = importList.filter(t => !importKw || `${t.name}${t.code}`.toLowerCase().includes(importKw));
  const importVisibleChecked = importVisible.filter(t => importSelected.includes(t.code)).length;

  const openImport = () => {
    setImportKeyword(''); setImportSelected([]); setImportSearchConfig(false); setImportConfirm(false); setImportOpen(true);
  };
  const submitImport = () => {
    if (!importSelected.length) return toast('warn', '请先选择要引入的表');
    setImportConfirm(true);
  };
  const executeImport = () => {
    const codes = importList.map(t => t.code).filter(c => importSelected.includes(c));
    const lib = diseaseIndex;

    // 目录：没有目录的表按通用库路径放入（同名目录复用）；已有目录的表位置不动，只更新表定义
    setTrees(prev => {
      const groups = (prev[lib] ?? buildLibTree(lib, libName)).map(g => ({ ...g, tables: [...g.tables] }));
      codes.forEach(code => {
        const src = findGeneralTable(code)!;
        const current = groups.find(g => g.tables.some(t => t.code === code));
        if (current) {
          current.tables = current.tables.map(t => (t.code === code ? { ...t, name: src.table.name } : t));
        } else {
          const same = groups.find(g => g.name === src.group);
          if (same) same.tables.push({ name: src.table.name, code });
          else groups.push({ name: src.group, tables: [{ name: src.table.name, code }] });
        }
      });
      return { ...prev, [lib]: groups };
    });

    // 指标：用通用库覆盖指标定义；勾选附加选项才覆盖检索和导出配置；专病库自建指标不受影响
    setStore(prev => {
      const next = { ...prev };
      codes.forEach(code => {
        const general = prev[storeKey(GENERAL_LIB, code)] ?? buildIndicators(code);
        const current = prev[storeKey(lib, code)] ?? buildLibIndicators(lib, code);
        next[storeKey(lib, code)] = current.map(r => {
          const g = general.find(x => x.field === r.field);
          if (!g) return r;
          return {
            ...r, name: g.name, fieldType: g.fieldType, dataType: g.dataType, desc: g.desc,
            ...(importSearchConfig ? { searchType: g.searchType, domain: g.domain } : {}),
          };
        });
      });
      return next;
    });

    // 刷新数据集树并定位到引入的第一张表
    setClosedGroups(c => c.filter(k => !codes.some(code => k === `${lib}:${findGeneralTable(code)!.group}`)));
    setDsCode(codes[0]); setPage(1); setChecked([]);
    setImportConfirm(false); setImportOpen(false);
    toast('ok', `已引入 ${codes.length} 张表！`);
  };

  const kw = filters.keyword.toLowerCase();
  const filtered = rows.filter(r =>
    (!kw || r.name.toLowerCase().includes(kw) || r.code.toLowerCase().includes(kw))
    && (!filters.dataType || r.dataType === filters.dataType)
    && (!filters.searchType || r.searchType === filters.searchType));
  const pages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const safePage = Math.min(page, pages);
  const pageRows = filtered.slice((safePage - 1) * pageSize, safePage * pageSize);
  const pageChecked = pageRows.filter(r => checked.includes(r.id)).length;
  const cols = OPTIONAL_COLS.filter(c => !hiddenCols.includes(c.key));

  const selectDataset = (code: string) => { setDsCode(code); setPage(1); setChecked([]); };
  const query = () => { setFilters(draft); setPage(1); };
  const reset = () => { const empty = { keyword: '', dataType: '', searchType: '' }; setDraft(empty); setFilters(empty); setPage(1); };

  const openForm = (mode: 'edit' | 'add', row: Indicator | null) => {
    setForm(row ? { name: row.name, field: row.field, dataType: row.dataType, searchType: row.searchType, domain: row.domain, desc: row.desc } : EMPTY_FORM);
    setErrors({});
    setDrawer({ mode, row });
  };
  const save = () => {
    const nextErrors = { name: !form.name.trim(), field: !form.field.trim() };
    setErrors(nextErrors);
    if (nextErrors.name || nextErrors.field) return;
    const isEdit = drawer?.mode === 'edit' && drawer.row;
    if (isEdit) {
      setRows(r => r.map(x => (x.id === drawer!.row!.id ? { ...x, ...form, name: form.name.trim(), field: form.field.trim() } : x)));
    } else {
      setRows(r => [{
        id: `${dsCode}_n${Date.now()}`, ...form, name: form.name.trim(), field: form.field.trim(), fieldType: 'varchar', fillRate: 0, code: `IDX_${1001 + r.length}`,
      }, ...r]);
      setPage(1);
    }
    setDrawer(null);
    toast('ok', isEdit ? '指标已保存！' : '指标已新增！');
  };
  const confirmDelete = () => {
    const n = checked.length;
    setRows(r => r.filter(x => !checked.includes(x.id)));
    setChecked([]); setDeleteOpen(false);
    toast('ok', `已删除${n}个指标！`);
  };

  const cell = (r: Indicator, key: ColKey) => {
    const dash = <span className="text-slate-400">-</span>;
    switch (key) {
      case 'fillRate': return (
        <span className="flex items-center gap-2">
          <span className="w-12">{r.fillRate}%</span>
          <span className="w-10 h-1 rounded-full bg-slate-200 overflow-hidden"><span className={`block h-full rounded-full ${fillColor(r.fillRate)}`} style={{ width: `${r.fillRate}%` }} /></span>
        </span>
      );
      case 'dataType': return r.dataType;
      case 'field': return `${r.field} (${r.fieldType})`;
      case 'searchType': return r.searchType;
      case 'domain': return r.domain || dash;
      case 'code': return <span className="font-mono">{r.code}</span>;
      case 'desc': return r.desc ? <span title={r.desc}>{r.desc}</span> : dash;
    }
  };

  const formRow = (label: string, required: boolean, control: React.ReactNode, error?: string) => (
    <div className="flex mb-5">
      <label className="w-24 shrink-0 text-right pr-4 leading-8 text-[13px] text-slate-700">{required && <span className="text-red-500 mr-1">*</span>}{label}</label>
      <div className="flex-1 min-w-0">
        {control}
        {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
      </div>
    </div>
  );
  const inputCls = (err?: boolean) => `w-full h-8 border rounded px-3 text-[13px] outline-none ${err ? 'border-red-400' : 'border-slate-200 focus:border-blue-500'}`;

  return (
    <div className="flex-1 min-w-0 flex gap-4 min-h-0" onClick={() => setColMenu(false)}>
      {/* 专病库 */}
      <div className={`${collapsed ? 'w-12' : 'w-44'} shrink-0 flex flex-col transition-all duration-200`}>
        <button
          onClick={() => setCollapsed(c => !c)}
          title={collapsed ? '展开' : '收起'}
          className="w-6 h-6 mx-auto mb-3 shrink-0 rounded-full bg-white shadow-sm border border-slate-200 flex items-center justify-center text-slate-500 hover:text-blue-600"
        >
          {collapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
        </button>
        <div className="flex-1 overflow-y-auto custom-scrollbar space-y-2 pr-1">
          {INDICATOR_DISEASES.map((name, i) => (
            <div
              key={name}
              title={name}
              onClick={() => switchLibrary(i)}
              className={`h-11 rounded-lg flex items-center gap-3 cursor-pointer overflow-hidden whitespace-nowrap border transition-colors ${collapsed ? 'px-2.5' : 'px-3'} ${
                i === diseaseIndex ? 'bg-blue-600 border-blue-600 text-white font-semibold shadow-sm' : 'bg-white border-slate-200 text-slate-700 hover:border-blue-300'
              }`}
            >
              <span className={`w-6 h-6 shrink-0 rounded-full flex items-center justify-center text-xs font-bold ${i === diseaseIndex ? 'bg-white/25 text-white' : 'bg-blue-50 text-blue-600'}`}>{name.slice(0, 1)}</span>
              {!collapsed && <span className="text-[13px] truncate">{name}</span>}
            </div>
          ))}
        </div>
      </div>

      {/* 数据集树 */}
      <div className="w-60 shrink-0 bg-white rounded-lg shadow-sm border border-slate-200 p-3 flex flex-col">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-slate-400" />
            <input
              value={treeKeyword}
              onChange={e => setTreeKeyword(e.target.value)}
              placeholder="请输入关键词搜索"
              className="w-full h-8 border border-slate-200 rounded pl-8 pr-2 text-[13px] outline-none focus:border-blue-500"
            />
          </div>
          <button onClick={() => toast('warn', '新增数据集待设计')} className="w-8 h-8 shrink-0 rounded bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center" title="新增数据集">
            <Plus className="w-4 h-4" />
          </button>
        </div>
        {!isGeneral && (
          <button onClick={openImport} className="mt-2 h-8 w-full rounded border border-blue-200 bg-blue-50 hover:bg-blue-100 text-blue-600 text-[13px] font-semibold flex items-center justify-center gap-1.5">
            <Download className="w-3.5 h-3.5" />从通用库引入
          </button>
        )}
        <div className="flex-1 overflow-y-auto custom-scrollbar mt-3 text-[13px]">
          {[...tree.map(g => ({ ...g, unassigned: false })), ...(unassigned.length ? [{ name: '未分配目录', tables: unassigned, unassigned: true }] : [])].map(g => {
            const tk = treeKeyword.trim();
            const kids = g.tables.filter(c => !tk || c.name.includes(tk) || g.name.includes(tk));
            if (tk && !kids.length) return null;
            const groupKey = `${diseaseIndex}:${g.name}`;
            const open = !!tk || !closedGroups.includes(groupKey);
            return (
              <div key={groupKey}>
                <div
                  onClick={() => setClosedGroups(o => (o.includes(groupKey) ? o.filter(x => x !== groupKey) : [...o, groupKey]))}
                  className={`h-9 px-1 flex items-center gap-1 rounded cursor-pointer hover:bg-slate-50 ${g.unassigned ? 'text-slate-400' : 'text-slate-700'}`}
                >
                  <ChevronRight className={`w-4 h-4 text-slate-400 transition-transform ${open ? 'rotate-90' : ''}`} />
                  {!g.unassigned && <Folder className="w-3.5 h-3.5 text-slate-400 shrink-0" />}
                  <span className="truncate"><Highlight text={g.name} keyword={tk} /></span>
                  {g.unassigned && <span className="ml-auto text-xs">{g.tables.length}</span>}
                </div>
                {open && !kids.length && <div className="h-8 pl-9 flex items-center text-xs text-slate-300">暂无指标表</div>}
                {open && kids.map(c => (
                  <div
                    key={c.code}
                    onClick={() => selectDataset(c.code)}
                    className={`h-9 pl-9 pr-2 flex items-center gap-2 rounded cursor-pointer ${c.code === dsCode ? 'bg-blue-50 text-blue-700 font-semibold' : 'text-slate-700 hover:bg-slate-50'}`}
                  >
                    <FileText className={`w-4 h-4 shrink-0 ${c.code === dsCode ? 'text-blue-600' : 'text-slate-400'}`} />
                    <span className="truncate"><Highlight text={c.name} keyword={tk} /></span>
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      </div>

      {/* 指标列表 */}
      <div className="flex-1 min-w-0 flex flex-col gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4 grid grid-cols-[1fr_1fr_1fr_auto] gap-6 items-end">
          <div className="space-y-1.5">
            <label className="text-[11px] text-slate-500 font-medium ml-1">关键词</label>
            <input
              value={draft.keyword}
              onChange={e => setDraft(d => ({ ...d, keyword: e.target.value }))}
              onKeyDown={e => e.key === 'Enter' && query()}
              placeholder="请输入指标中文名/指标编码"
              className="w-full h-8 border border-slate-200 rounded px-2.5 text-[13px] outline-none focus:border-blue-500"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-[11px] text-slate-500 font-medium ml-1">数据类型</label>
            <Select value={draft.dataType} options={DATA_TYPES} placeholder="请选择" allowAll onChange={v => setDraft(d => ({ ...d, dataType: v }))} />
          </div>
          <div className="space-y-1.5">
            <label className="text-[11px] text-slate-500 font-medium ml-1">检索类型</label>
            <Select value={draft.searchType} options={SEARCH_TYPES} placeholder="请选择" allowAll onChange={v => setDraft(d => ({ ...d, searchType: v }))} />
          </div>
          <div className="flex gap-2">
            <button onClick={reset} className={`${btn.default} flex items-center gap-1`}><RotateCcw className="w-3.5 h-3.5" />重置</button>
            <button onClick={query} className={btn.primary}>查询</button>
          </div>
        </div>

        <div className="flex-1 min-h-0 bg-white rounded-lg shadow-sm border border-slate-200 flex flex-col overflow-hidden">
          <div className="p-3 px-6 flex justify-between items-center border-b border-slate-100 bg-slate-50/50">
            <div className="text-xs font-bold text-slate-700">关联数据集：<span className="font-normal text-slate-600">{dsName} <span className="font-mono">{dsCode}</span></span></div>
            <div className="flex items-center gap-2 relative">
              {checked.length > 0 && (
                <span className="text-xs text-slate-500 mr-2">已选 <b className="text-blue-600">{checked.length}</b> 项 <button onClick={() => setChecked([])} className={btn.link}>取消选择</button></span>
              )}
              <button onClick={() => (checked.length ? toast('ok', `已选${checked.length}项，批量编辑待设计`) : toast('warn', '请先勾选指标'))} className={btn.default}>批量操作</button>
              <button onClick={() => toast('warn', '数据绑定待设计')} className={btn.default}>数据绑定</button>
              <button onClick={() => (checked.length ? setDeleteOpen(true) : toast('warn', '请先勾选要删除的指标'))} className={btn.default}>删除</button>
              <button onClick={() => openForm('add', null)} className={btn.primary}>新增</button>
              <button onClick={e => { e.stopPropagation(); setColMenu(m => !m); }} className="w-8 h-8 border border-slate-200 rounded bg-white hover:border-blue-500 hover:text-blue-600 text-slate-500 flex items-center justify-center" title="列设置">
                <Settings className="w-4 h-4" />
              </button>
              {colMenu && (
                <div onClick={e => e.stopPropagation()} className="absolute right-0 top-10 z-20 w-44 bg-white rounded-md shadow-lg border border-slate-100 py-2 text-[13px]">
                  <div className="px-4 pb-1 text-xs text-slate-400">显示列</div>
                  {OPTIONAL_COLS.map(c => (
                    <label key={c.key} onClick={() => setHiddenCols(h => (h.includes(c.key) ? h.filter(k => k !== c.key) : [...h, c.key]))}
                      className="h-8 px-4 flex items-center gap-2 cursor-pointer hover:bg-slate-50 text-slate-700">
                      <Checkbox checked={!hiddenCols.includes(c.key)} />{c.title}
                    </label>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex-1 overflow-auto custom-scrollbar">
            <table className="w-full text-left text-xs border-separate border-spacing-0 table-fixed" style={{ minWidth: 520 + cols.reduce((s, c) => s + c.width, 0) }}>
              <colgroup>
                <col style={{ width: 32 }} /><col style={{ width: 40 }} /><col style={{ width: 70 }} /><col style={{ width: 150 }} />
                {cols.map(c => <col key={c.key} style={{ width: c.width }} />)}
                <col style={{ width: 110 }} />
              </colgroup>
              <thead className="text-slate-500">
                <tr>
                  <th className="sticky top-0 z-10 bg-slate-50 border-b border-slate-100 py-2.5" />
                  <th className="sticky top-0 z-10 bg-slate-50 border-b border-slate-100 py-2.5 px-2">
                    <Checkbox
                      checked={!!pageRows.length && pageChecked === pageRows.length}
                      half={pageChecked > 0 && pageChecked < pageRows.length}
                      onClick={() => {
                        const ids = pageRows.map(r => r.id);
                        setChecked(c => (pageChecked === pageRows.length ? c.filter(id => !ids.includes(id)) : [...c, ...ids.filter(id => !c.includes(id))]));
                      }}
                    />
                  </th>
                  {[{ key: 'no', title: '序号' }, { key: 'name', title: '指标名称' }, ...cols].map(c => (
                    <th key={c.key} className="sticky top-0 z-10 bg-slate-50 border-b border-slate-100 py-2.5 px-3 font-semibold whitespace-nowrap">
                      {c.key !== 'fillRate' && <Edit2 className="inline w-3 h-3 mr-1 text-slate-400 -mt-0.5" />}
                      {c.title}
                      {c.key === 'searchType' && <span title="决定该指标在科研检索中的输入方式"><Info className="inline w-3 h-3 ml-1 text-slate-400 -mt-0.5 cursor-help" /></span>}
                    </th>
                  ))}
                  <th className="sticky top-0 right-0 z-20 bg-slate-50 border-b border-slate-100 py-2.5 px-3 font-semibold shadow-[-6px_0_8px_-6px_rgba(0,0,0,0.12)]">操作</th>
                </tr>
              </thead>
              <tbody className="text-slate-700 text-[13px]">
                {pageRows.length === 0 && (
                  <tr><td colSpan={5 + cols.length} className="py-24 text-center text-slate-400">没有符合条件的指标，换个筛选条件试试</td></tr>
                )}
                {pageRows.map((r, i) => {
                  const on = checked.includes(r.id);
                  const bg = on ? 'bg-blue-50' : 'bg-white group-hover:bg-slate-50';
                  return (
                    <tr key={r.id} className="group">
                      <td className={`py-3 pl-2 border-b border-slate-100 ${bg}`}><GripVertical className="w-3.5 h-3.5 text-slate-300 cursor-grab" /></td>
                      <td className={`py-3 px-2 border-b border-slate-100 ${bg}`}>
                        <Checkbox checked={on} onClick={() => setChecked(c => (on ? c.filter(id => id !== r.id) : [...c, r.id]))} />
                      </td>
                      <td className={`py-3 px-3 border-b border-slate-100 text-slate-500 ${bg}`}>{(safePage - 1) * pageSize + i + 1}</td>
                      <td className={`py-3 px-3 border-b border-slate-100 font-medium text-slate-800 truncate ${bg}`} title={r.name}><Highlight text={r.name} keyword={filters.keyword} /></td>
                      {cols.map(c => <td key={c.key} className={`py-3 px-3 border-b border-slate-100 truncate ${bg}`}>{cell(r, c.key)}</td>)}
                      <td className={`py-3 px-3 border-b border-slate-100 sticky right-0 shadow-[-6px_0_8px_-6px_rgba(0,0,0,0.12)] ${bg}`}>
                        <div className="flex gap-4">
                          <button onClick={() => setDrawer({ mode: 'view', row: r })} className={btn.link}>详情</button>
                          <button onClick={() => openForm('edit', r)} className={btn.link}>编辑</button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="p-3 px-6 border-t border-slate-200 flex items-center justify-end gap-4 text-xs text-slate-500 shrink-0">
            <span>共 {pages} 页, {filtered.length} 条</span>
            <span className="flex items-center gap-1">每页
              <select value={pageSize} onChange={e => { setPageSize(+e.target.value); setPage(1); }} className="h-7 border border-slate-200 rounded px-1.5 outline-none text-slate-700">
                {[10, 20, 50, 100].map(s => <option key={s}>{s}</option>)}
              </select>条
            </span>
            <div className="flex items-center gap-1.5">
              <button disabled={safePage <= 1} onClick={() => setPage(safePage - 1)} className="p-1 rounded border border-slate-200 bg-white disabled:opacity-30 disabled:cursor-not-allowed"><ChevronLeft className="w-4 h-4" /></button>
              {Array.from({ length: pages }, (_, k) => k + 1).map(p => (
                <button key={p} onClick={() => setPage(p)} className={`w-6 h-6 flex items-center justify-center rounded ${p === safePage ? 'bg-blue-600 text-white font-semibold' : 'hover:bg-slate-100 text-slate-700'}`}>{p}</button>
              ))}
              <button disabled={safePage >= pages} onClick={() => setPage(safePage + 1)} className="p-1 rounded border border-slate-200 bg-white disabled:opacity-30 disabled:cursor-not-allowed"><ChevronRight className="w-4 h-4" /></button>
            </div>
          </div>
        </div>
      </div>

      {/* 详情 / 编辑 / 新增 */}
      <Drawer
        open={!!drawer}
        onClose={() => setDrawer(null)}
        title={drawer?.mode === 'view' ? '指标详情' : drawer?.mode === 'edit' ? '编辑指标' : '新增指标'}
        footer={drawer?.mode === 'view'
          ? <><button onClick={() => setDrawer(null)} className={btn.default}>关闭</button><button onClick={() => openForm('edit', drawer.row)} className={btn.primary}>编辑</button></>
          : <><button onClick={() => setDrawer(null)} className={btn.default}>取消</button><button onClick={save} className={btn.primary}>保存</button></>}
      >
        <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
          {drawer?.mode === 'view' && drawer.row && ([
            ['指标名称', drawer.row.name], ['指标编码', drawer.row.code], ['关联数据集', `${dsName} ${dsCode}`],
            ['绑定字段', `${drawer.row.field} (${drawer.row.fieldType})`], ['填充率', `${drawer.row.fillRate}%`], ['数据类型', drawer.row.dataType],
            ['检索类型', drawer.row.searchType], ['检索值域', drawer.row.domain], ['指标说明', drawer.row.desc],
          ] as [string, string][]).map(([label, value]) => (
            <React.Fragment key={label}>{formRow(label, false, <div className="leading-8 text-[13px] text-slate-800">{value || '-'}</div>)}</React.Fragment>
          ))}
          {drawer && drawer.mode !== 'view' && <>
            {formRow('指标名称', true,
              <input value={form.name} maxLength={30} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} onBlur={() => setErrors(x => ({ ...x, name: !form.name.trim() }))} placeholder="请输入指标名称" className={inputCls(errors.name)} />,
              errors.name ? '请输入指标名称' : undefined)}
            {formRow('指标编码', false, <input disabled value={drawer.row?.code ?? ''} placeholder="保存后自动生成" className="w-full h-8 border border-slate-200 rounded px-3 text-[13px] bg-slate-50 text-slate-400" />)}
            {formRow('绑定字段', true,
              <input value={form.field} onChange={e => setForm(f => ({ ...f, field: e.target.value }))} onBlur={() => setErrors(x => ({ ...x, field: !form.field.trim() }))} placeholder="请输入绑定字段" className={inputCls(errors.field)} />,
              errors.field ? '请输入绑定字段' : undefined)}
            {formRow('数据类型', true, <Select value={form.dataType} options={DATA_TYPES} placeholder="请选择" onChange={v => setForm(f => ({ ...f, dataType: v }))} />)}
            {formRow('检索类型', true, <Select value={form.searchType} options={SEARCH_TYPES} placeholder="请选择" onChange={v => setForm(f => ({ ...f, searchType: v }))} />)}
            {formRow('检索值域', false, <input value={form.domain} onChange={e => setForm(f => ({ ...f, domain: e.target.value }))} placeholder="检索类型为值选择时需填写，如：生理性别代码表" className={inputCls()} />)}
            {formRow('指标说明', false, <>
              <textarea value={form.desc} maxLength={200} onChange={e => setForm(f => ({ ...f, desc: e.target.value }))} placeholder="请输入指标说明" className="w-full h-24 border border-slate-200 rounded px-3 py-2 text-[13px] outline-none focus:border-blue-500 resize-none" />
              <div className="text-right text-xs text-slate-400">{form.desc.length}/200</div>
            </>)}
          </>}
        </div>
      </Drawer>

      {/* 从通用库引入 */}
      <AnimatePresence>
        {importOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setImportOpen(false)} className="absolute inset-0 bg-black/40" />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="relative bg-white rounded-xl shadow-2xl w-[760px] max-h-[85vh] flex flex-col overflow-hidden">
              <div className="h-14 shrink-0 px-6 flex items-center justify-between border-b border-slate-100">
                <h3 className="font-bold text-slate-800 text-[15px]">从通用库引入</h3>
                <button onClick={() => setImportOpen(false)} className="p-1 hover:bg-slate-100 rounded-full"><X className="w-4 h-4 text-slate-400" /></button>
              </div>
              <div className="px-6 pt-4 flex-1 min-h-0 flex flex-col">
                <p className="text-xs text-slate-500 mb-3">以下是「{libName}」引用的通用库表。勾选的表将用通用库的配置覆盖指标表定义和指标定义。</p>
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-slate-400" />
                  <input value={importKeyword} onChange={e => setImportKeyword(e.target.value)} placeholder="搜索表名"
                    className="w-full h-8 border border-slate-200 rounded pl-8 pr-2 text-[13px] outline-none focus:border-blue-500" />
                </div>
                <div className="mt-3 border border-slate-200 rounded-lg overflow-hidden flex flex-col min-h-0">
                  <div className="overflow-y-auto custom-scrollbar max-h-[340px]">
                    <table className="w-full text-[13px] border-collapse">
                      <thead className="sticky top-0 bg-slate-50 text-slate-500 text-xs z-10">
                        <tr>
                          <th className="w-12 py-2.5 px-4 text-left">
                            <Checkbox
                              checked={!!importVisible.length && importVisibleChecked === importVisible.length}
                              half={importVisibleChecked > 0 && importVisibleChecked < importVisible.length}
                              disabled={!importVisible.length}
                              onClick={() => {
                                const codes = importVisible.map(t => t.code);
                                setImportSelected(s => (importVisibleChecked === importVisible.length ? s.filter(c => !codes.includes(c)) : [...s, ...codes.filter(c => !s.includes(c))]));
                              }}
                            />
                          </th>
                          <th className="py-2.5 px-3 text-left font-semibold">表中文名</th>
                          <th className="py-2.5 px-3 text-left font-semibold">表英文名</th>
                          <th className="py-2.5 px-3 text-left font-semibold">通用库中的目录</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-slate-700">
                        {importVisible.length === 0 && (
                          <tr><td colSpan={4} className="py-10 text-center text-xs text-slate-400">没有找到"{importKeyword}"相关的表</td></tr>
                        )}
                        {importVisible.map(t => {
                          const on = importSelected.includes(t.code);
                          return (
                            <tr key={t.code} onClick={() => setImportSelected(s => (on ? s.filter(c => c !== t.code) : [...s, t.code]))}
                              className={`cursor-pointer ${on ? 'bg-blue-50/60' : 'hover:bg-slate-50'}`}>
                              <td className="py-2.5 px-4"><Checkbox checked={on} /></td>
                              <td className="py-2.5 px-3 font-medium text-slate-800"><Highlight text={t.name} keyword={importKeyword.trim()} /></td>
                              <td className="py-2.5 px-3 font-mono text-xs text-slate-500"><Highlight text={t.code} keyword={importKeyword.trim()} /></td>
                              <td className="py-2.5 px-3">{t.group}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
                <div className="flex items-center justify-between mt-3 text-[13px]">
                  <label className="flex items-center gap-2 cursor-pointer select-none text-slate-700" onClick={() => setImportSearchConfig(v => !v)}>
                    <Checkbox checked={importSearchConfig} />同时更新检索和导出配置
                  </label>
                  <span className="text-xs text-slate-500">已选 <b className="text-blue-600">{importSelected.length}</b> 张表</span>
                </div>
              </div>
              <div className="h-16 shrink-0 px-6 mt-4 border-t border-slate-100 flex items-center justify-end gap-2.5">
                <button onClick={() => setImportOpen(false)} className={btn.default}>取消</button>
                <button onClick={submitImport} className={btn.primary}>确定引入</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 引入二次确认 */}
      <AnimatePresence>
        {importConfirm && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setImportConfirm(false)} className="absolute inset-0 bg-black/30" />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative bg-white rounded-xl shadow-2xl w-[440px] p-6">
              <div className="flex gap-3">
                <span className="w-5 h-5 mt-0.5 shrink-0 rounded-full bg-orange-500 text-white text-xs font-bold flex items-center justify-center">!</span>
                <div className="text-[13px] text-slate-600 leading-6">
                  <h3 className="font-bold text-slate-800 text-[15px] mb-1.5">确认从通用库引入</h3>
                  <p>将用通用库的配置覆盖所选 {importSelected.length} 张表的指标表定义和指标定义，本库修改过的内容会被替换。</p>
                  <p>还没有目录的表，将按通用库的目录放入（已有同名目录时直接放入）；已有目录的表，位置保持不变。</p>
                  {importSearchConfig && <p>检索和导出配置也将被覆盖。</p>}
                </div>
              </div>
              <div className="flex justify-end gap-2.5 mt-6">
                <button onClick={() => setImportConfirm(false)} className={btn.default}>取消</button>
                <button onClick={executeImport} className={btn.primary}>确定引入</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 删除确认 */}
      <AnimatePresence>
        {deleteOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setDeleteOpen(false)} className="absolute inset-0 bg-black/40" />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative bg-white rounded-xl shadow-2xl w-[420px] p-6">
              <div className="flex gap-3">
                <span className="w-5 h-5 mt-0.5 shrink-0 rounded-full bg-orange-500 text-white text-xs font-bold flex items-center justify-center">!</span>
                <div>
                  <h3 className="font-bold text-slate-800 text-[15px] mb-1.5">确定删除选中的 {checked.length} 个指标？</h3>
                  <p className="text-[13px] text-slate-500">删除后，绑定该指标的科研数据集将无法再使用，且不可恢复。</p>
                </div>
              </div>
              <div className="flex justify-end gap-2.5 mt-6">
                <button onClick={() => setDeleteOpen(false)} className={btn.default}>取消</button>
                <button onClick={confirmDelete} className={btn.danger}>删除</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      {toastNode}
    </div>
  );
};

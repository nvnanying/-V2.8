import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, FileText, Plus, RefreshCw, Search } from 'lucide-react';
import {
  buildDiseaseDataset, DATASET_DISEASES, DatasetTable, DiseaseDataset, fieldsOfTable,
} from './researchData';
import { btn, Highlight, useToast } from './ResearchUI';
import { SyncDrawer } from './SyncDrawer';

export const ResearchDataset = ({ datasets, setDatasets, onViewIndicators }: {
  datasets: Record<number, DiseaseDataset>;
  setDatasets: React.Dispatch<React.SetStateAction<Record<number, DiseaseDataset>>>;
  onViewIndicators: (indicatorName: string) => void;
}) => {
  const [diseaseIndex, setDiseaseIndex] = useState(0);
  const [collapsed, setCollapsed] = useState(false);
  const [tableId, setTableId] = useState<string | null>(null);
  const [keyword, setKeyword] = useState('');
  const [syncOpen, setSyncOpen] = useState(false);
  const [toastNode, toast] = useToast();

  const data = datasets[diseaseIndex] ?? buildDiseaseDataset(diseaseIndex);
  const update = (fn: (d: DiseaseDataset) => DiseaseDataset) =>
    setDatasets(prev => ({ ...prev, [diseaseIndex]: fn(prev[diseaseIndex] ?? buildDiseaseDataset(diseaseIndex)) }));

  const tables = data.tables.filter(t => !keyword || t.name.toLowerCase().includes(keyword.toLowerCase()));
  const current = data.tables.find(t => t.id === tableId);

  const handleSync = (ids: number[]) => {
    update(d => {
      const picked = d.pending.filter(p => ids.includes(p.id));
      let nextTables = d.tables.map(t =>
        picked.some(p => p.changed && p.name === t.name) && t.changed ? { ...t, changed: false, isNew: true } : t);
      const added: DatasetTable[] = picked.filter(p => !p.changed).map(p => ({ id: `n_${p.code}`, name: p.name, code: p.code, changed: false, isNew: true }));
      nextTables = [...added, ...nextTables];
      return { tables: nextTables, pending: d.pending.filter(p => !ids.includes(p.id)) };
    });
    setSyncOpen(false);
    toast('ok', `已同步${ids.length}张表！`);
  };

  return (
    <div className="flex-1 min-w-0 flex gap-4 min-h-0">
      {/* 专病库 */}
      <div className={`${collapsed ? 'w-12' : 'w-48'} shrink-0 flex flex-col transition-all duration-200`}>
        <button
          onClick={() => setCollapsed(c => !c)}
          title={collapsed ? '展开' : '收起'}
          className="w-6 h-6 mx-auto mb-3 shrink-0 rounded-full bg-white shadow-sm border border-slate-200 flex items-center justify-center text-slate-500 hover:text-blue-600"
        >
          {collapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
        </button>
        <div className="flex-1 overflow-y-auto custom-scrollbar space-y-2 pr-1">
          {DATASET_DISEASES.map((name, i) => (
            <div
              key={name}
              title={name}
              onClick={() => { setDiseaseIndex(i); setTableId(null); setKeyword(''); }}
              className={`h-11 rounded-lg flex items-center gap-3 cursor-pointer overflow-hidden whitespace-nowrap transition-colors border ${
                collapsed ? 'px-2.5' : 'px-3'
              } ${i === diseaseIndex ? 'bg-blue-600 border-blue-600 text-white font-semibold shadow-sm' : 'bg-white border-slate-200 text-slate-700 hover:border-blue-300'}`}
            >
              <span className={`w-6 h-6 shrink-0 rounded-full flex items-center justify-center text-xs font-bold ${i === diseaseIndex ? 'bg-white/25 text-white' : 'bg-blue-50 text-blue-600'}`}>
                {name.slice(0, 1)}
              </span>
              {!collapsed && <span className="text-[13px] truncate">{name}</span>}
            </div>
          ))}
        </div>
        <button
          onClick={() => toast('warn', '新增专病库待设计')}
          className="h-10 mt-3 shrink-0 rounded-lg border border-dashed border-blue-300 bg-white text-blue-600 text-[13px] hover:bg-blue-50 flex items-center justify-center gap-1"
        >
          <Plus className="w-4 h-4" />{!collapsed && '新增专病库'}
        </button>
      </div>

      {/* 数据表列表 */}
      <div className="w-64 shrink-0 bg-white rounded-lg shadow-sm border border-slate-200 p-3 flex flex-col">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-slate-400" />
            <input
              value={keyword}
              onChange={e => setKeyword(e.target.value)}
              placeholder="搜索表名"
              className="w-full h-8 border border-slate-200 rounded pl-8 pr-2 text-[13px] outline-none focus:border-blue-500"
            />
          </div>
          <button onClick={() => setSyncOpen(true)} className={`${btn.primary} flex items-center gap-1 px-3`}>
            <RefreshCw className="w-3.5 h-3.5" />同步
          </button>
        </div>
        <div className="text-xs text-slate-400 mt-2.5 mb-1 px-1">
          {keyword ? `搜索到 ${tables.length} 张表` : `共 ${data.tables.length} 张表，${data.pending.length} 张待同步`}
        </div>
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {tables.length === 0 && <div className="py-10 text-center text-xs text-slate-400">没有找到相关的表</div>}
          {tables.map(t => (
            <div
              key={t.id}
              title={t.name}
              onClick={() => setTableId(t.id)}
              className={`h-9 px-2 flex items-center gap-2 rounded cursor-pointer text-[13px] ${
                t.id === tableId ? 'bg-blue-50 text-blue-700 font-semibold' : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              <FileText className={`w-4 h-4 shrink-0 ${t.id === tableId ? 'text-blue-600' : 'text-slate-400'}`} />
              <span className="truncate"><Highlight text={t.name} keyword={keyword} /></span>
              {t.isNew ? <span className="ml-auto pl-2 shrink-0 text-xs font-normal text-green-600">新同步</span>
                : t.changed ? <span className="ml-auto pl-2 shrink-0 text-xs font-normal text-blue-600">有变更</span> : null}
            </div>
          ))}
        </div>
      </div>

      {/* 表字段 */}
      <div className="flex-1 min-w-0 bg-white rounded-lg shadow-sm border border-slate-200 flex flex-col overflow-hidden">
        {!current ? (
          <>
            <div className="p-3 px-6 border-b border-slate-100 bg-slate-50/50 text-xs font-bold text-slate-700">{DATASET_DISEASES[diseaseIndex]}</div>
            <div className="flex-1 flex flex-col items-center justify-center gap-3 text-slate-400 text-[13px]">
              <div className="w-16 h-16 rounded-xl bg-slate-100 flex items-center justify-center"><FileText className="w-8 h-8 text-slate-300" /></div>
              请选择左侧的数据表，查看表字段
            </div>
          </>
        ) : (
          <>
            <div className="p-3 px-6 flex justify-between items-center border-b border-slate-100 bg-slate-50/50">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
                {current.name}
                {current.code && <span className="font-mono font-normal text-slate-500">{current.code}</span>}
                {current.changed && <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-600 font-normal">有字段属性变更，待同步</span>}
                {current.isNew && <span className="px-2 py-0.5 rounded bg-green-50 text-green-600 font-normal">已同步</span>}
              </div>
              {current.name === '基本信息' && (
                <button onClick={() => onViewIndicators('')} className="flex items-center gap-1 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 border border-blue-100 rounded text-xs font-bold">
                  查看绑定指标
                </button>
              )}
            </div>
            <div className="flex-1 overflow-auto custom-scrollbar">
              <table className="w-full text-left text-xs border-collapse min-w-[700px]">
                <thead className="sticky top-0 bg-slate-50 text-slate-500 border-b border-slate-100 z-10">
                  <tr>
                    <th className="py-2.5 px-6 font-semibold w-[80px]">序号</th>
                    <th className="py-2.5 px-4 font-semibold">字段中文名</th>
                    <th className="py-2.5 px-4 font-semibold">字段英文名</th>
                    <th className="py-2.5 px-4 font-semibold w-[140px]">字段类型</th>
                    <th className="py-2.5 px-4 font-semibold">绑定指标</th>
                    <th className="py-2.5 px-6 font-semibold w-[140px]">状态</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700 text-[13px]">
                  {fieldsOfTable(current).map((f, i) => {
                    const changed = current.changed && i === 3;
                    return (
                      <tr key={f.en} className="hover:bg-slate-50/50">
                        <td className="py-3 px-6 text-slate-500">{i + 1}</td>
                        <td className={`py-3 px-4 font-medium ${changed ? 'text-blue-600' : 'text-slate-800'}`}>{f.cn}</td>
                        <td className="py-3 px-4 font-mono">{f.en}</td>
                        <td className="py-3 px-4">{f.type}{changed && <span className="text-slate-400"> ← varchar</span>}</td>
                        <td className="py-3 px-4">
                          {f.indicator
                            ? <button onClick={() => onViewIndicators(f.indicator)} className={btn.link}>{f.indicator}</button>
                            : <span className="text-slate-400">-</span>}
                        </td>
                        <td className="py-3 px-6">
                          {changed
                            ? <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-600 text-xs">类型已变更</span>
                            : <span className="flex items-center gap-1.5 text-slate-600"><i className="w-1.5 h-1.5 rounded-full bg-green-500" />已同步</span>}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div className="p-3 px-6 border-t border-slate-200 text-xs text-slate-500 text-right">共 {fieldsOfTable(current).length} 个字段</div>
          </>
        )}
      </div>

      <SyncDrawer
        open={syncOpen}
        onClose={() => setSyncOpen(false)}
        pending={data.pending}
        onToggleUpdateName={id => update(d => ({ ...d, pending: d.pending.map(p => (p.id === id ? { ...p, updateName: !p.updateName } : p)) }))}
        onSubmit={handleSync}
        toast={toast}
      />
      {toastNode}
    </div>
  );
};

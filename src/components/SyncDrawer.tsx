import React, { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, Search, Square } from 'lucide-react';
import type { PendingTable } from './researchData';
import { btn, Checkbox, Drawer, Highlight, MiniSwitch, SearchBox, ToastType } from './ResearchUI';

const PREVIEW_FIELDS = [['patient_id', '患者ID', 'varchar(64)'], ['visit_no', '就诊号', 'varchar(64)'], ['report_time', '报告时间', 'datetime']];

const matches = (t: PendingTable, kw: string) => !kw || `${t.name}${t.code}`.toLowerCase().includes(kw.toLowerCase());

const TableName = ({ t, keyword }: { t: PendingTable; keyword: string }) => (
  <span title={`${t.name}(${t.code})`} className={`flex-1 min-w-0 flex whitespace-nowrap ${t.changed ? 'text-blue-600' : 'text-slate-800'}`}>
    <span className="shrink-0 max-w-[75%] overflow-hidden text-ellipsis"><Highlight text={t.name} keyword={keyword} /></span>
    {t.name !== t.code && (
      <span className={`min-w-0 overflow-hidden text-ellipsis ${t.changed ? 'text-blue-600' : 'text-slate-400'}`}>(<Highlight text={t.code} keyword={keyword} />)</span>
    )}
  </span>
);

const Empty = ({ icon, title, children }: { icon: React.ReactNode; title: string; children?: React.ReactNode }) => (
  <div className="py-16 text-center text-slate-400 text-[13px]">
    <div className="w-14 h-14 mx-auto mb-3 rounded-lg bg-slate-100 flex items-center justify-center text-slate-300">{icon}</div>
    <p className="text-slate-700 mb-1">{title}</p>
    {children}
  </div>
);

export const SyncDrawer = ({ open, onClose, pending, onToggleUpdateName, onSubmit, toast }: {
  open: boolean;
  onClose: () => void;
  pending: PendingTable[];
  onToggleUpdateName: (id: number) => void;
  onSubmit: (ids: number[]) => void;
  toast: (type: ToastType, text: string) => void;
}) => {
  const [selected, setSelected] = useState<number[]>([]);
  const [view, setView] = useState<'all' | 'picked'>('all');
  const [keyword, setKeyword] = useState('');
  const [pickedKeyword, setPickedKeyword] = useState('');
  const [expanded, setExpanded] = useState<number[]>([]);
  const [confirmClear, setConfirmClear] = useState(false);

  // 每次打开抽屉都从空白状态开始
  useEffect(() => {
    if (open) {
      setSelected([]); setView('all'); setKeyword(''); setPickedKeyword(''); setExpanded([]); setConfirmClear(false);
    }
  }, [open]);

  const isSelected = (id: number) => selected.includes(id);
  const toggle = (id: number) => setSelected(s => (s.includes(id) ? s.filter(x => x !== id) : [...s, id]));

  const visible = pending.filter(t => matches(t, keyword));
  const visibleSelected = visible.filter(t => isSelected(t.id)).length;
  const toggleAllVisible = () => {
    if (!visible.length) return;
    const allOn = visibleSelected === visible.length;
    const ids = visible.map(t => t.id);
    setSelected(s => (allOn ? s.filter(id => !ids.includes(id)) : [...s, ...ids.filter(id => !s.includes(id))]));
  };

  const pickedAll = selected.map(id => pending.find(t => t.id === id)).filter(Boolean) as PendingTable[];
  const pickedList = pickedAll.filter(t => matches(t, pickedKeyword));

  const submit = () => {
    if (!selected.length) return toast('warn', '请先选择要同步的表');
    onSubmit(selected);
  };

  return (
    <Drawer
      open={open}
      onClose={onClose}
      title="同步"
      width={680}
      footer={<>
        <button onClick={onClose} className={btn.default}>取 消</button>
        <button onClick={submit} className={btn.primary}>确定同步</button>
      </>}
    >
      <div className="flex-1 min-h-0 flex flex-col px-6 pt-4" onClick={() => setConfirmClear(false)}>
        {/* 说明（仅展示） */}
        <div className="bg-slate-50 rounded px-4 py-3 grid grid-cols-[56px_1fr] gap-y-2 text-[13px] text-slate-800">
          <span className="font-semibold">说明：</span>
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-2"><i className="w-1.5 h-1.5 rounded-full bg-slate-800" />黑色为"未同步的表"</span>
            <span className="flex items-center gap-2 text-blue-600"><i className="w-1.5 h-1.5 rounded-full bg-blue-600" />蓝色为"有字段属性变更的表"</span>
          </div>
          <span className="col-start-2 flex items-center gap-2"><MiniSwitch on />同步更新绑定的指标库指标名称</span>
          <span className="col-start-2 flex items-center gap-2"><MiniSwitch on={false} />同步时不更新绑定的科研指标库指标名称</span>
        </div>

        {view === 'all' ? (
          <>
            <div className="mt-4"><SearchBox value={keyword} onChange={setKeyword} placeholder="请输入关键词搜索" /></div>
            <div className="h-11 shrink-0 mt-2 px-2 flex items-center justify-between border-b border-slate-100 text-[13px]">
              <label className="flex items-center gap-2 text-slate-800 cursor-pointer select-none" onClick={toggleAllVisible}>
                <Checkbox checked={!!visible.length && visibleSelected === visible.length} half={visibleSelected > 0 && visibleSelected < visible.length} disabled={!visible.length} />
                全选
              </label>
              <div className="flex items-center gap-3 text-slate-600">
                <span>已选<b className="text-blue-600 mx-1">{selected.length}</b>张表</span>
                <span className="w-px h-3 bg-slate-200" />
                <button disabled={!selected.length} onClick={() => { setPickedKeyword(''); setView('picked'); }} className={btn.link}>查看已选</button>
              </div>
            </div>
            <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar py-1 text-[13px]">
              {pending.length === 0 ? (
                <Empty icon={<Square className="w-6 h-6" />} title="所有表都已同步！"><p>暂时没有需要同步的表</p></Empty>
              ) : visible.length === 0 ? (
                <Empty icon={<Search className="w-6 h-6" />} title={`没有找到"${keyword}"相关的表`}><p>换个关键词试试</p></Empty>
              ) : visible.map(t => (
                <React.Fragment key={t.id}>
                  <div onClick={() => toggle(t.id)} className="h-9 px-2 flex items-center gap-2 rounded cursor-pointer hover:bg-slate-50">
                    <Checkbox checked={isSelected(t.id)} />
                    <ChevronRight
                      onClick={e => { e.stopPropagation(); setExpanded(x => (x.includes(t.id) ? x.filter(i => i !== t.id) : [...x, t.id])); }}
                      className={`w-4 h-4 shrink-0 text-slate-500 transition-transform ${expanded.includes(t.id) ? 'rotate-90' : ''}`}
                    />
                    <MiniSwitch on={t.updateName} onClick={e => { e.stopPropagation(); onToggleUpdateName(t.id); }} />
                    <TableName t={t} keyword={keyword} />
                  </div>
                  {expanded.includes(t.id) && (
                    <div className="ml-16 mb-1 pl-4 border-l border-slate-200 text-xs text-slate-600">
                      {PREVIEW_FIELDS.map(([en, cn, type], i) => (
                        <div key={en} className="h-7 flex items-center gap-4">
                          <span>{cn}</span><span className="text-slate-400">{en}</span><span className="text-slate-400">{type}</span>
                          {t.changed && i === 2 && <span className="text-blue-600">类型已变更</span>}
                        </div>
                      ))}
                    </div>
                  )}
                </React.Fragment>
              ))}
            </div>
          </>
        ) : (
          <>
            <div className="h-11 shrink-0 mt-4 px-2 flex items-center justify-between relative text-[13px]">
              <div className="flex items-center gap-2 text-slate-800 font-semibold">
                <button onClick={() => setView('all')} className="flex items-center text-slate-500 hover:text-blue-600 font-normal"><ChevronLeft className="w-4 h-4" />返回</button>
                <span className="w-px h-3 bg-slate-200 mx-1" />
                <span>已选 <b className="text-blue-600">{pickedAll.length}</b> 张表</span>
                {pickedKeyword && <span className="text-xs text-slate-400 font-normal">（搜索到 {pickedList.length} 张）</span>}
              </div>
              <button
                disabled={!pickedAll.length}
                onClick={e => { e.stopPropagation(); setConfirmClear(v => !v); }}
                className="text-slate-600 hover:text-red-500 disabled:text-slate-300 disabled:cursor-not-allowed"
              >清空所选</button>
              {confirmClear && (
                <div onClick={e => e.stopPropagation()} className="absolute right-0 top-10 z-10 w-64 bg-white rounded-md shadow-lg border border-slate-100 p-4">
                  <p className="flex gap-2 text-slate-800"><span className="w-4 h-4 mt-0.5 shrink-0 rounded-full bg-orange-500 text-white text-[11px] font-bold flex items-center justify-center">!</span>确定清空全部 {pickedAll.length} 张已选表？</p>
                  <div className="flex justify-end gap-2 mt-3">
                    <button onClick={() => setConfirmClear(false)} className="h-7 px-3 border border-slate-200 rounded text-xs hover:border-blue-500 hover:text-blue-600">取消</button>
                    <button onClick={() => { setSelected([]); setConfirmClear(false); }} className="h-7 px-3 rounded text-xs text-white bg-blue-600 hover:bg-blue-700">清空</button>
                  </div>
                </div>
              )}
            </div>
            <SearchBox value={pickedKeyword} onChange={setPickedKeyword} placeholder="在已选的表中搜索表名或英文名" />
            <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar mt-2 border-t border-slate-100 text-[13px]">
              {pickedAll.length === 0 ? (
                <Empty icon={<Square className="w-6 h-6" />} title="还没有选择表">
                  <button onClick={() => setView('all')} className={btn.link}>返回列表选择</button>
                </Empty>
              ) : pickedList.length === 0 ? (
                <Empty icon={<Search className="w-6 h-6" />} title={`已选的表中没有"${pickedKeyword}"相关的表`}>
                  <p>换个关键词试试，或<button onClick={() => setPickedKeyword('')} className={btn.link}>清除搜索</button></p>
                </Empty>
              ) : pickedList.map((t, i) => (
                <div key={t.id} className="h-9 px-2 flex items-center gap-3 border-b border-slate-50 hover:bg-slate-50">
                  <span className="w-6 text-right text-xs text-slate-400 shrink-0">{i + 1}</span>
                  <MiniSwitch on={t.updateName} title={t.updateName ? '同步更新绑定的指标库指标名称' : '同步时不更新指标名称'} />
                  <TableName t={t} keyword={pickedKeyword} />
                  <button onClick={() => toggle(t.id)} className="shrink-0 text-slate-600 hover:text-red-500">移除</button>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </Drawer>
  );
};

import React, { useState } from 'react';
import {
  ArrowLeft, Baby, Bandage, Bone, Brain, Bug, Calendar, Check, ChevronDown, ChevronUp, Copy, Dna, Download, Droplet, Ear, Eye, FileText,
  GripVertical, Hand, Heart, HeartCrack, MapPin, Microscope, Pill, Plus, Search, SquarePlus, Stethoscope, Syringe, Thermometer, Trash2, Upload, X,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// 数据库管理 - 新增专病库（三步向导：基本设置 → 纳排设置 → 数据集设置）

export const DISEASE_ICONS: Record<string, React.ElementType> = {
  MapPin, HeartCrack, Stethoscope, Baby, Dna, Bone, Bandage, Bug, Pill, Eye, Ear, Brain, Syringe, Microscope, SquarePlus, Hand, Heart, Thermometer, Droplet,
};
const ICON_NAMES = Object.keys(DISEASE_ICONS);

const DEPARTMENTS = ['消化内科', '肿瘤科', '神经内科', '心血管内科', '妇科', '肝胆外科'];
const ADMINS = ['吴汶芮', 'test_A', '陈光俊', '丘绍翔', '谢坤翔', '柳结华'];

export interface NewDiseaseDbResult {
  code: string;
  name: string;
  department: string;
  admin: string;
  intro: string;
  icon: string;
}

/* ---------------------------------------------------------------- 通用小件 */

let seq = 0;
const uid = () => `id_${Date.now()}_${seq++}`;

const inputCls = (err?: boolean) =>
  `w-full h-9 border rounded-md px-3 text-[13px] text-slate-800 outline-none bg-white transition-colors ${err ? 'border-red-400' : 'border-slate-200 hover:border-slate-300 focus:border-blue-500'}`;

const NativeSelect = ({ value, onChange, options, placeholder, className = '', small }: {
  value: string; onChange: (v: string) => void; options: string[]; placeholder?: string; className?: string; small?: boolean;
}) => (
  <div className={`relative ${className}`}>
    <select
      value={value}
      onChange={e => onChange(e.target.value)}
      className={`w-full appearance-none border border-slate-200 rounded-md bg-white outline-none hover:border-slate-300 focus:border-blue-500 pr-8 ${
        small ? 'h-8 pl-2.5 text-xs font-semibold' : 'h-9 pl-3 text-[13px]'} ${value ? 'text-slate-800' : 'text-slate-400'}`}
    >
      {placeholder !== undefined && <option value="">{placeholder}</option>}
      {options.map(o => <option key={o} value={o} className="text-slate-800">{o}</option>)}
    </select>
    <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
  </div>
);

const Required = ({ label }: { label: string }) => (
  <label className="block text-xs font-bold text-slate-700 mb-2"><span className="text-red-500 mr-1">*</span>{label}</label>
);

const AddLink = ({ children, onClick }: { children: React.ReactNode; onClick: () => void }) => (
  <button onClick={onClick} className="flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-700">
    <span className="w-3.5 h-3.5 rounded-full border border-blue-500 flex items-center justify-center"><Plus className="w-2.5 h-2.5" /></span>
    {children}
  </button>
);

/* ---------------------------------------------------------------- 步骤条 */

const STEPS = ['基本设置', '纳排设置', '数据集设置'];

const StepBar = ({ step }: { step: number }) => (
  <div className="flex items-center gap-3">
    {STEPS.map((s, i) => {
      const done = i < step, active = i === step;
      return (
        <React.Fragment key={s}>
          {i > 0 && <span className={`w-16 h-0.5 rounded ${i <= step ? 'bg-blue-600' : 'bg-slate-200'}`} />}
          <span className="flex items-center gap-2">
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold ${
              done || active ? 'bg-blue-600 text-white' : 'border border-slate-300 text-slate-400'}`}>
              {done ? <Check className="w-3 h-3" strokeWidth={3} /> : i + 1}
            </span>
            <span className={`text-xs font-bold ${done || active ? 'text-blue-600' : 'text-slate-400'}`}>{s}</span>
          </span>
        </React.Fragment>
      );
    })}
  </div>
);

/* ---------------------------------------------------------------- 第一步：基本设置 */

const BasicStep = ({ form, setForm, errors }: {
  form: NewDiseaseDbResult; setForm: React.Dispatch<React.SetStateAction<NewDiseaseDbResult>>; errors: Record<string, boolean>;
}) => {
  const [iconsExpanded, setIconsExpanded] = useState(true);
  const set = (k: keyof NewDiseaseDbResult) => (v: string) => setForm(f => ({ ...f, [k]: v }));
  const shownIcons = iconsExpanded ? ICON_NAMES : ICON_NAMES.slice(0, 10);
  const err = (k: string, msg: string) => errors[k] && <p className="text-xs text-red-500 mt-1">{msg}</p>;

  return (
    <div className="grid grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)] gap-8 p-8">
      <div className="space-y-5">
        <div><Required label="专病库编码" /><input value={form.code} onChange={e => set('code')(e.target.value)} placeholder="请输入专病库编码" className={inputCls(errors.code)} />{err('code', '请输入专病库编码')}</div>
        <div><Required label="专病库名称" /><input value={form.name} onChange={e => set('name')(e.target.value)} placeholder="请输入专病库名称" className={inputCls(errors.name)} />{err('name', '请输入专病库名称')}</div>
        <div><Required label="科室" /><NativeSelect value={form.department} onChange={set('department')} options={DEPARTMENTS} placeholder="请选择" />{err('department', '请选择科室')}</div>
        <div><Required label="管理员:" /><NativeSelect value={form.admin} onChange={set('admin')} options={ADMINS} placeholder="请选择" />{err('admin', '请选择管理员')}</div>
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-2">简介</label>
          <div className="relative">
            <textarea value={form.intro} maxLength={500} onChange={e => set('intro')(e.target.value)} placeholder="请输入简介"
              className="w-full h-24 border border-slate-200 rounded-md px-3 py-2 text-[13px] outline-none hover:border-slate-300 focus:border-blue-500 resize-none" />
            <span className="absolute right-3 bottom-2.5 text-[10px] font-mono text-slate-400">{form.intro.length} / 500</span>
          </div>
        </div>
      </div>

      <div>
        <Required label="选择图标:" />
        <div className={`border rounded-lg p-4 bg-slate-50/40 ${errors.icon ? 'border-red-300' : 'border-slate-200'}`}>
          <div className="grid grid-cols-5 gap-3">
            {shownIcons.map(name => {
              const Icon = DISEASE_ICONS[name];
              const on = form.icon === name;
              return (
                <button key={name} onClick={() => set('icon')(name)}
                  className={`relative h-14 rounded-md border flex items-center justify-center bg-white transition-colors ${
                    on ? 'border-blue-600' : 'border-dashed border-slate-200 hover:border-blue-300'}`}>
                  <Icon className="w-5 h-5 text-blue-600" />
                  {on && <span className="absolute -right-px -bottom-px w-4 h-4 rounded-tl-md rounded-br-md bg-blue-600 flex items-center justify-center"><Check className="w-3 h-3 text-white" strokeWidth={3} /></span>}
                </button>
              );
            })}
          </div>
          <button onClick={() => setIconsExpanded(x => !x)} className="mt-3 mx-auto flex items-center gap-1 text-xs font-bold text-blue-600">
            {iconsExpanded ? <>收起 <ChevronUp className="w-3.5 h-3.5" /></> : <>展开 <ChevronDown className="w-3.5 h-3.5" /></>}
          </button>
        </div>
        {err('icon', '请选择图标')}
      </div>
    </div>
  );
};

/* ---------------------------------------------------------------- 第二步：纳排设置 */

const RULE_FIELDS = ['诊断信息\\诊断名称(标准ICD)', '诊断信息\\诊断日期', '检验报告\\检验项目名称', '手术记录\\手术名称', '基本信息\\性别', '基本信息\\年龄'];
const OPERATORS = ['等于', '不等于', '包含', '大于', '小于'];

interface Rule { id: string; field: string; op: string; values: string[] }
interface Bracket { id: string; bracket: true; logic: '且' | '或'; rules: Rule[] }
type RuleItem = Rule | Bracket;
type Criterion =
  | { id: string; kind: 'visit'; campus: string; visitType: string; dept: string; start: string; end: string }
  | { id: string; kind: 'rules'; scope: string; logic: '且' | '或'; items: RuleItem[] };

const newRule = (): Rule => ({ id: uid(), field: RULE_FIELDS[0], op: '等于', values: [] });

const initialInclude = (): Criterion[] => [
  { id: uid(), kind: 'visit', campus: '东院区', visitType: '全部', dept: '就诊科室', start: '', end: '' },
  { id: uid(), kind: 'rules', scope: '同一次就诊', logic: '且', items: [{ id: uid(), field: RULE_FIELDS[0], op: '等于', values: ['C16胃恶性肿瘤'] }] },
];

const RuleRow: React.FC<{
  rule: Rule; onChange: (r: Rule) => void; onCopy: () => void; onDelete: () => void; onAddAfter: () => void;
}> = ({ rule, onChange, onCopy, onDelete, onAddAfter }) => {
  const [draft, setDraft] = useState('');
  const addValue = () => {
    const v = draft.trim();
    if (v && !rule.values.includes(v)) onChange({ ...rule, values: [...rule.values, v] });
    setDraft('');
  };
  return (
    <div className="group flex items-center gap-2 bg-slate-50/70 border border-slate-100 rounded-lg px-3 py-2.5">
      <GripVertical className="w-4 h-4 text-slate-300 cursor-grab shrink-0" />
      <NativeSelect small value={rule.field} onChange={v => onChange({ ...rule, field: v })} options={RULE_FIELDS} className="w-56" />
      <NativeSelect small value={rule.op} onChange={v => onChange({ ...rule, op: v })} options={OPERATORS} className="w-20" />
      <div className="flex-1 min-w-0 flex flex-wrap items-center gap-1.5 min-h-8 border border-slate-200 bg-white rounded-md px-2 py-1">
        {rule.values.map(v => (
          <span key={v} className="flex items-center gap-1 h-6 px-2 rounded bg-slate-100 text-xs font-bold text-slate-700">
            {v}<X className="w-3 h-3 text-slate-400 hover:text-red-500 cursor-pointer" onClick={() => onChange({ ...rule, values: rule.values.filter(x => x !== v) })} />
          </span>
        ))}
        <input value={draft} onChange={e => setDraft(e.target.value)} onKeyDown={e => e.key === 'Enter' && addValue()} onBlur={addValue}
          placeholder={rule.values.length ? '' : '输入值后按回车'} className="flex-1 min-w-20 h-6 text-xs outline-none" />
      </div>
      <div className="flex items-center gap-2 text-slate-400 shrink-0">
        <Copy onClick={onCopy} className="w-4 h-4 hover:text-blue-600 cursor-pointer"><title>复制</title></Copy>
        <Trash2 onClick={onDelete} className="w-4 h-4 hover:text-red-500 cursor-pointer"><title>删除</title></Trash2>
        <Plus onClick={onAddAfter} className="w-4 h-4 hover:text-blue-600 cursor-pointer"><title>在下方添加条件</title></Plus>
      </div>
    </div>
  );
};

const LogicButton = ({ logic, onChange }: { logic: '且' | '或'; onChange: (l: '且' | '或') => void }) => (
  <button onClick={() => onChange(logic === '且' ? '或' : '且')} title="点击切换 且/或"
    className="h-7 px-2.5 rounded bg-blue-600 text-white text-xs font-bold flex items-center gap-1">
    {logic}<ChevronDown className="w-3 h-3" />
  </button>
);

const RuleList = ({ items, onChange }: { items: RuleItem[]; onChange: (items: RuleItem[]) => void }) => {
  const replace = (id: string, next: RuleItem | null, extra?: RuleItem) => {
    const out: RuleItem[] = [];
    items.forEach(it => {
      if (it.id !== id) return out.push(it);
      if (next) out.push(next);
      if (extra) out.push(extra);
    });
    onChange(out);
  };
  return (
    <div className="space-y-2.5">
      {items.map(it => 'bracket' in it ? (
        <div key={it.id} className="border border-dashed border-blue-200 rounded-lg p-3 bg-blue-50/20">
          <div className="flex items-center gap-2 mb-2.5 text-xs font-bold text-slate-500">
            <span className="text-blue-600 text-base leading-none">(</span>括号条件组
            <LogicButton logic={it.logic} onChange={l => replace(it.id, { ...it, logic: l })} />
            <Trash2 onClick={() => replace(it.id, null)} className="w-4 h-4 ml-auto text-slate-400 hover:text-red-500 cursor-pointer" />
          </div>
          <div className="space-y-2">
            {it.rules.map(r => (
              <RuleRow key={r.id} rule={r}
                onChange={nr => replace(it.id, { ...it, rules: it.rules.map(x => (x.id === r.id ? nr : x)) })}
                onCopy={() => replace(it.id, { ...it, rules: it.rules.flatMap(x => (x.id === r.id ? [x, { ...x, id: uid() }] : [x])) })}
                onDelete={() => replace(it.id, it.rules.length > 1 ? { ...it, rules: it.rules.filter(x => x.id !== r.id) } : null)}
                onAddAfter={() => replace(it.id, { ...it, rules: it.rules.flatMap(x => (x.id === r.id ? [x, newRule()] : [x])) })}
              />
            ))}
          </div>
          <div className="mt-2.5 flex items-center gap-3">
            <AddLink onClick={() => replace(it.id, { ...it, rules: [...it.rules, newRule()] })}>条件</AddLink>
            <span className="text-blue-600 text-base leading-none ml-auto">)</span>
          </div>
        </div>
      ) : (
        <RuleRow key={it.id} rule={it}
          onChange={nr => replace(it.id, nr)}
          onCopy={() => replace(it.id, it, { ...it, id: uid() })}
          onDelete={() => replace(it.id, null)}
          onAddAfter={() => replace(it.id, it, newRule())}
        />
      ))}
      <div className="flex items-center gap-4 pt-1">
        <AddLink onClick={() => onChange([...items, newRule()])}>条件</AddLink>
        <AddLink onClick={() => onChange([...items, { id: uid(), bracket: true, logic: '且', rules: [newRule()] }])}>括号</AddLink>
      </div>
    </div>
  );
};

const CriteriaStep = ({ include, setInclude, exclude, setExclude }: {
  include: Criterion[]; setInclude: (c: Criterion[]) => void; exclude: Criterion[]; setExclude: (c: Criterion[]) => void;
}) => {
  const [tab, setTab] = useState<'include' | 'exclude'>('include');
  const [zoom, setZoom] = useState(100);
  const list = tab === 'include' ? include : exclude;
  const setList = tab === 'include' ? setInclude : setExclude;
  const label = tab === 'include' ? '纳入条件' : '排除条件';
  const update = (id: string, next: Criterion) => setList(list.map(c => (c.id === id ? next : c)));

  return (
    <div className="p-6 flex flex-col gap-5 flex-1 min-h-0">
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <div className="flex p-1 bg-slate-100 rounded-lg">
          {(['include', 'exclude'] as const).map(k => (
            <button key={k} onClick={() => setTab(k)}
              className={`h-8 px-5 rounded-md text-xs font-bold transition-colors ${tab === k ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-800'}`}>
              {k === 'include' ? '纳入标准' : '排除标准'}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-3 h-8 px-3 rounded-md bg-slate-100 text-xs font-bold font-mono text-slate-700">
          <button onClick={() => setZoom(z => Math.max(50, z - 10))} className="hover:text-blue-600">-</button>
          <span className="w-10 text-center">{zoom}%</span>
          <button onClick={() => setZoom(z => Math.min(150, z + 10))} className="hover:text-blue-600">+</button>
        </div>
      </div>

      <div className="flex-1 min-h-[480px] rounded-xl border border-slate-200 bg-slate-50/60 overflow-auto custom-scrollbar">
        <div className="min-h-full flex items-center p-10" style={{ zoom: zoom / 100 }}>
          <div className="flex items-center">
            <button
              onClick={() => setList([...list, { id: uid(), kind: 'rules', scope: '同一次就诊', logic: '且', items: [newRule()] }])}
              className="h-8 px-4 rounded-md bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-sm whitespace-nowrap flex items-center gap-1 shrink-0"
            >
              <Plus className="w-3.5 h-3.5" />{label}
            </button>
            {list.length > 0 && <span className="w-8 h-px bg-slate-300 shrink-0" />}
            {list.length > 0 && (
              <div className="relative pl-6 space-y-5 border-l border-slate-300 py-2">
                {list.map((c, i) => (
                  <div key={c.id} className="relative">
                    <span className="absolute -left-6 top-7 w-6 h-px bg-slate-300" />
                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 min-w-[640px]">
                      {c.kind === 'visit' ? (
                        <div className="flex items-center gap-3">
                          <span className="text-xs font-bold text-slate-400 whitespace-nowrap">{label}{i + 1}</span>
                          <NativeSelect small value={c.campus} onChange={v => update(c.id, { ...c, campus: v })} options={['全部院区', '东院区', '西院区']} className="w-28" />
                          <NativeSelect small value={c.visitType} onChange={v => update(c.id, { ...c, visitType: v })} options={['全部', '门诊', '住院', '急诊']} className="w-24" />
                          <NativeSelect small value={c.dept} onChange={v => update(c.id, { ...c, dept: v })} options={['就诊科室', '出院科室', '入院科室']} className="w-28" />
                          <div className="flex items-center gap-1.5 h-8 px-2 border border-slate-200 rounded-md bg-white text-xs">
                            <Calendar className="w-3.5 h-3.5 text-slate-400" />
                            <input type="date" value={c.start} onChange={e => update(c.id, { ...c, start: e.target.value })} className="outline-none text-slate-600 w-28" title="开始日期" />
                            <span className="text-slate-400">-</span>
                            <input type="date" value={c.end} onChange={e => update(c.id, { ...c, end: e.target.value })} className="outline-none text-slate-600 w-28" title="结束日期" />
                          </div>
                          <Trash2 onClick={() => setList(list.filter(x => x.id !== c.id))} className="w-4 h-4 ml-auto text-slate-400 hover:text-red-500 cursor-pointer" />
                        </div>
                      ) : (
                        <>
                          <div className="flex items-center gap-3 mb-3">
                            <span className="text-xs font-bold text-slate-400 whitespace-nowrap">{label}{i + 1}</span>
                            <Trash2 onClick={() => setList(list.filter(x => x.id !== c.id))} className="w-4 h-4 text-slate-400 hover:text-red-500 cursor-pointer"><title>删除条件</title></Trash2>
                            <Plus onClick={() => update(c.id, { ...c, items: [...c.items, newRule()] })} className="w-4 h-4 text-slate-400 hover:text-blue-600 cursor-pointer"><title>添加规则</title></Plus>
                            <NativeSelect small value={c.scope} onChange={v => update(c.id, { ...c, scope: v })} options={['同一次就诊', '不限就诊']} className="w-32 ml-4" />
                            <LogicButton logic={c.logic} onChange={l => update(c.id, { ...c, logic: l })} />
                          </div>
                          <div className="ml-4 pl-5 border-l border-slate-200">
                            <RuleList items={c.items} onChange={items => update(c.id, { ...c, items })} />
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
            {list.length === 0 && <span className="ml-4 text-xs text-slate-400">还没有{label}，点击左侧按钮添加</span>}
          </div>
        </div>
      </div>
    </div>
  );
};

/* ---------------------------------------------------------------- 第三步：数据集设置 */

const FIELD_TYPES = ['文本', '整数', '小数位', '日期', '日期时间'];

interface ValueGroup { id: string; source: string; conditions: { id: string; field: string; bracket?: boolean }[] }
interface ValueConfig { type: '取值型' | '二分型' | '枚举型'; enums: string[]; activeEnum: string; groups: ValueGroup[] }
interface DsField { id: string; cn: string; en: string; type: string; config?: ValueConfig }
interface DsTable { id: string; name: string; en: string; fields: DsField[] }

const RDR_TABLES: [string, string, number][] = [
  ['基本信息', 'pat_info', 55], ['就诊记录', 'visit_record', 40], ['检验报告', 'lab_report', 41], ['诊断信息', 'diag_info', 26],
  ['检查报告', 'exam_report', 21], ['医嘱处方-药品', 'order_drug', 47], ['手术记录', 'ope_record', 33], ['病理报告', 'pathology_report', 18],
  ['护理记录', 'nursing_record', 29], ['随访记录', 'followup_record', 16],
];
const GENERIC_FIELDS: [string, string, string][] = [
  ['记录ID', 'record_id', '文本'], ['患者ID', 'patient_id', '文本'], ['就诊号', 'visit_no', '文本'], ['记录时间', 'record_time', '日期时间'], ['科室名称', 'dept_name', '文本'],
];
const fromRdr = ([name, en]: [string, string, number]): DsTable => ({
  id: uid(), name, en, fields: GENERIC_FIELDS.map(([cn, fen, type]) => ({ id: uid(), cn, en: fen, type })),
});
const initialTables = (): DsTable[] => RDR_TABLES.slice(0, 6).map(t => t[0] === '检验报告'
  ? {
    id: uid(), name: '检验报告', en: 'test_report', fields: [
      { id: uid(), cn: '谷丙转氨酶', en: 'gbzam', type: '小数位' },
      { id: uid(), cn: '谷草转氨酶', en: 'gczam', type: '小数位' },
      { id: uid(), cn: '总胆红素', en: 'zdhs', type: '小数位', config: { type: '枚举型', enums: ['是', '否'], activeEnum: '是', groups: [{ id: uid(), source: '检验报告', conditions: [{ id: uid(), field: '' }] }] } },
    ],
  }
  : fromRdr(t));

const defaultConfig = (table: string): ValueConfig => ({ type: '取值型', enums: [], activeEnum: '', groups: [{ id: uid(), source: table, conditions: [{ id: uid(), field: '' }] }] });

const ValuePanel: React.FC<{
  field: DsField; tables: DsTable[]; siblings: DsField[]; onCancel: () => void; onConfirm: (c: ValueConfig) => void;
}> = ({ field, tables, siblings, onCancel, onConfirm }) => {
  const tableNames = tables.map(t => t.name);
  const [cfg, setCfg] = useState<ValueConfig>(() => JSON.parse(JSON.stringify(field.config ?? defaultConfig(tableNames[0] ?? ''))));
  const [newEnum, setNewEnum] = useState<string | null>(null);
  const [refOpen, setRefOpen] = useState(false);

  const setType = (type: ValueConfig['type']) => setCfg(c => {
    const enums = type === '二分型' ? ['是', '否'] : type === '枚举型' ? (c.enums.length ? c.enums : ['是', '否']) : [];
    return { ...c, type, enums, activeEnum: enums[0] ?? '' };
  });
  const setGroup = (id: string, g: ValueGroup | null) => setCfg(c => ({ ...c, groups: c.groups.flatMap(x => (x.id === id ? (g ? [g] : []) : [x])) }));
  const sourceFields = (source: string) => tables.find(t => t.name === source)?.fields.map(f => `${f.cn}(${f.en})`) ?? [];
  const configured = siblings.filter(f => f.id !== field.id && f.config);

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <span className="text-[13px] font-bold text-slate-800">取值设置 - {field.cn || '未命名字段'}</span>
        <div className="flex gap-2">
          <button onClick={onCancel} className="h-7 px-3 border border-slate-200 rounded text-xs font-bold text-slate-600 hover:border-blue-500 hover:text-blue-600">取消</button>
          <button onClick={() => onConfirm(cfg)} className="h-7 px-3 rounded bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold">确定</button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar pt-4 space-y-3 text-xs">
        <div className="flex items-center gap-3">
          <span className="font-bold text-slate-600 w-16 text-right">指标类型:</span>
          {(['取值型', '二分型', '枚举型'] as const).map(t => (
            <label key={t} onClick={() => setType(t)} className="flex items-center gap-1.5 cursor-pointer text-slate-700">
              <span className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${cfg.type === t ? 'border-blue-600' : 'border-slate-300'}`}>
                {cfg.type === t && <span className="w-2 h-2 rounded-full bg-blue-600" />}
              </span>{t}
            </label>
          ))}
        </div>

        {cfg.type !== '取值型' && (
          <div className="flex items-start gap-3">
            <span className="font-bold text-slate-600 w-16 text-right leading-7">指标值域:</span>
            <div className="flex-1 flex flex-wrap items-center gap-2">
              {cfg.enums.map(v => (
                <span key={v} onClick={() => setCfg(c => ({ ...c, activeEnum: v }))}
                  className={`h-7 px-2.5 rounded flex items-center gap-1.5 font-bold cursor-pointer ${cfg.activeEnum === v ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700'}`}>
                  {v}
                  {cfg.type === '枚举型' && (
                    <X className="w-3 h-3 opacity-70 hover:opacity-100" onClick={e => {
                      e.stopPropagation();
                      setCfg(c => { const enums = c.enums.filter(x => x !== v); return { ...c, enums, activeEnum: c.activeEnum === v ? enums[0] ?? '' : c.activeEnum }; });
                    }} />
                  )}
                </span>
              ))}
              {cfg.type === '枚举型' && (newEnum === null
                ? <AddLink onClick={() => setNewEnum('')}>添加枚举值</AddLink>
                : <input autoFocus value={newEnum} onChange={e => setNewEnum(e.target.value)} placeholder="回车添加"
                    onBlur={() => setNewEnum(null)}
                    onKeyDown={e => {
                      if (e.key !== 'Enter') return;
                      const v = newEnum.trim();
                      if (v && !cfg.enums.includes(v)) setCfg(c => ({ ...c, enums: [...c.enums, v], activeEnum: c.activeEnum || v }));
                      setNewEnum(null);
                    }}
                    className="h-7 w-24 border border-blue-400 rounded px-2 outline-none" />)}
            </div>
            <div className="relative">
              <button onClick={() => setRefOpen(o => !o)} className="leading-7 font-bold text-blue-600 hover:text-blue-700 whitespace-nowrap">引用其他字段配置</button>
              {refOpen && (
                <div className="absolute right-0 top-8 z-20 w-44 bg-white border border-slate-100 rounded-md shadow-lg py-1">
                  {configured.length === 0 && <div className="px-3 py-2 text-slate-400">暂无可引用的字段配置</div>}
                  {configured.map(f => (
                    <button key={f.id} onClick={() => { setCfg(JSON.parse(JSON.stringify(f.config))); setRefOpen(false); }}
                      className="w-full text-left px-3 py-2 hover:bg-slate-50 text-slate-700">{f.cn}</button>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        <div className="pt-2 font-bold text-blue-600">取值限定{cfg.type !== '取值型' && cfg.activeEnum ? ` - 【${cfg.activeEnum}】` : ''}</div>
        <div className="border border-slate-200 rounded-lg p-4 space-y-3 bg-slate-50/40">
          {cfg.groups.map(g => (
            <div key={g.id} className="space-y-3 pb-3 border-b border-dashed border-slate-200 last:border-0 last:pb-0">
              <div className="flex items-center gap-3">
                <span className="font-bold text-slate-600 whitespace-nowrap">来源数据表:</span>
                <NativeSelect value={g.source} onChange={v => setGroup(g.id, { ...g, source: v })} options={tableNames} className="flex-1" />
                <button onClick={() => setGroup(g.id, null)} className="font-bold text-red-500 hover:text-red-600">删除</button>
              </div>
              {g.conditions.map(cond => (
                <div key={cond.id} className={`flex items-center gap-2 border border-slate-200 bg-white rounded-md p-2 ${cond.bracket ? 'border-dashed border-blue-300' : ''}`}>
                  {cond.bracket && <span className="text-blue-600 text-base font-bold">(</span>}
                  <NativeSelect value={cond.field} placeholder="请选择" options={sourceFields(g.source)} className="flex-1"
                    onChange={v => setGroup(g.id, { ...g, conditions: g.conditions.map(x => (x.id === cond.id ? { ...x, field: v } : x)) })} />
                  {cond.bracket && <span className="text-blue-600 text-base font-bold">)</span>}
                  <X onClick={() => setGroup(g.id, { ...g, conditions: g.conditions.filter(x => x.id !== cond.id) })} className="w-4 h-4 text-red-500 cursor-pointer shrink-0" />
                </div>
              ))}
              <div className="flex items-center gap-4">
                <AddLink onClick={() => setGroup(g.id, { ...g, conditions: [...g.conditions, { id: uid(), field: '' }] })}>条件</AddLink>
                <AddLink onClick={() => setGroup(g.id, { ...g, conditions: [...g.conditions, { id: uid(), field: '', bracket: true }] })}>括号</AddLink>
              </div>
            </div>
          ))}
          <button onClick={() => setCfg(c => ({ ...c, groups: [...c.groups, { id: uid(), source: tableNames[0] ?? '', conditions: [{ id: uid(), field: '' }] }] }))}
            className="h-8 px-4 rounded bg-blue-600 hover:bg-blue-700 text-white font-bold">添加组</button>
        </div>
      </div>
    </div>
  );
};

const DatasetStep = ({ tables, setTables, toast }: {
  tables: DsTable[]; setTables: React.Dispatch<React.SetStateAction<DsTable[]>>; toast: (text: string, warn?: boolean) => void;
}) => {
  const [source, setSource] = useState<'rdr' | 'disease'>('disease');
  const [keyword, setKeyword] = useState('');
  const [activeId, setActiveId] = useState(() => tables.find(t => t.name === '检验报告')?.id ?? tables[0]?.id ?? '');
  const [valueFieldId, setValueFieldId] = useState<string | null>(() => tables.find(t => t.name === '检验报告')?.fields.find(f => f.config)?.id ?? null);

  const active = tables.find(t => t.id === activeId);
  const valueField = active?.fields.find(f => f.id === valueFieldId);
  const updateActive = (fn: (t: DsTable) => DsTable) => setTables(ts => ts.map(t => (t.id === activeId ? fn(t) : t)));
  const updateField = (id: string, patch: Partial<DsField>) => updateActive(t => ({ ...t, fields: t.fields.map(f => (f.id === id ? { ...f, ...patch } : f)) }));
  const kw = keyword.trim();

  const addTable = () => {
    const t: DsTable = { id: uid(), name: '未命名数据表', en: '', fields: [{ id: uid(), cn: '', en: '', type: '文本' }] };
    setTables(ts => [...ts, t]); setSource('disease'); setActiveId(t.id); setValueFieldId(null);
  };

  return (
    <div className="flex-1 min-h-0 grid grid-cols-[280px_minmax(0,1fr)_420px]">
      {/* 数据表选择区 */}
      <div className="border-r border-slate-100 p-4 flex flex-col min-h-0">
        <div className="text-[13px] font-bold text-slate-800 mb-3">数据表选择区</div>
        <div className="relative">
          <input value={keyword} onChange={e => setKeyword(e.target.value)} placeholder="请输入关键字检索" className={`${inputCls()} pr-8`} />
          <Search className="absolute right-2.5 top-2.5 w-4 h-4 text-slate-400" />
        </div>
        <div className="flex p-1 bg-slate-100 rounded-md mt-3">
          {(['rdr', 'disease'] as const).map(k => (
            <button key={k} onClick={() => setSource(k)}
              className={`flex-1 h-7 rounded text-xs font-bold ${source === k ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500'}`}>
              {k === 'rdr' ? 'RDR数据集' : '专病库数据集'}
            </button>
          ))}
        </div>
        <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar mt-3 space-y-2.5 pr-1">
          {source === 'disease' ? (
            <>
              {tables.filter(t => !kw || t.name.includes(kw)).map(t => (
                <div key={t.id} onClick={() => { setActiveId(t.id); setValueFieldId(null); }}
                  className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${t.id === activeId ? 'border-blue-500 bg-blue-50/30' : 'border-slate-200 hover:border-blue-300'}`}>
                  <FileText className="w-5 h-5 text-slate-400 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="text-[13px] font-bold text-slate-800 truncate">{t.name}</div>
                    <div className="text-[11px] text-slate-400">字段数: {t.fields.length}</div>
                  </div>
                  <button onClick={e => {
                    e.stopPropagation();
                    setTables(ts => ts.filter(x => x.id !== t.id));
                    if (t.id === activeId) { setActiveId(tables.find(x => x.id !== t.id)?.id ?? ''); setValueFieldId(null); }
                  }} className="text-xs font-bold text-pink-600 hover:text-pink-700">移除</button>
                </div>
              ))}
              {tables.length === 0 && <div className="py-10 text-center text-xs text-slate-400">还没有数据表，从 RDR 数据集添加或新增数据表</div>}
            </>
          ) : RDR_TABLES.filter(t => !kw || t[0].includes(kw)).map(t => {
            const added = tables.some(x => x.name === t[0]);
            return (
              <div key={t[0]} className="flex items-center gap-3 p-3 rounded-lg border border-slate-200">
                <FileText className="w-5 h-5 text-slate-400 shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="text-[13px] font-bold text-slate-800 truncate">{t[0]}</div>
                  <div className="text-[11px] text-slate-400">字段数: {t[2]}</div>
                </div>
                <button disabled={added} onClick={() => { const nt = fromRdr(t); setTables(ts => [...ts, nt]); toast(`已添加「${t[0]}」`); }}
                  className="text-xs font-bold text-blue-600 hover:text-blue-700 disabled:text-slate-300">{added ? '已添加' : '添加'}</button>
              </div>
            );
          })}
        </div>
      </div>

      {/* 字段配置 */}
      <div className="p-4 flex flex-col min-h-0 border-r border-slate-100">
        <div className="flex justify-end gap-2">
          <button onClick={() => toast('批量导入待设计', true)} className="h-8 px-3 border border-slate-200 rounded text-xs font-bold text-slate-700 hover:border-blue-500 hover:text-blue-600 flex items-center gap-1"><Upload className="w-3.5 h-3.5" />批量导入</button>
          <button onClick={() => toast('模板下载待对接', true)} className="h-8 px-3 border border-blue-200 bg-blue-50 rounded text-xs font-bold text-blue-600 hover:bg-blue-100 flex items-center gap-1"><Download className="w-3.5 h-3.5" />下载模板</button>
          <button onClick={addTable} className="h-8 px-3 rounded bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold">新增数据表</button>
        </div>
        {!active ? (
          <div className="flex-1 flex items-center justify-center text-xs text-slate-400">请在左侧选择数据表</div>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-3 mt-4">
              <input value={active.name} onChange={e => updateActive(t => ({ ...t, name: e.target.value }))} placeholder="数据表中文名" className={inputCls()} />
              <input value={active.en} onChange={e => updateActive(t => ({ ...t, en: e.target.value }))} placeholder="数据表英文名" className={`${inputCls()} font-mono`} />
            </div>
            <div className="flex-1 min-h-0 mt-3 border border-slate-200 rounded-lg flex flex-col overflow-hidden">
              <div className="flex-1 min-h-0 overflow-auto custom-scrollbar">
                <table className="w-full text-xs">
                  <thead className="sticky top-0 bg-slate-50 text-slate-600 z-10">
                    <tr>
                      <th className="text-left font-bold py-2.5 px-3">字段中文名</th>
                      <th className="text-left font-bold py-2.5 px-3">字段名称</th>
                      <th className="text-left font-bold py-2.5 px-3 w-28">字段类型</th>
                      <th className="text-left font-bold py-2.5 px-3 w-28">操作</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {active.fields.map(f => (
                      <tr key={f.id} className={f.id === valueFieldId ? 'bg-blue-50/40' : ''}>
                        <td className="py-2 px-3"><input value={f.cn} onChange={e => updateField(f.id, { cn: e.target.value })} placeholder="请输入" className="w-full h-8 border border-slate-200 rounded px-2 text-[13px] outline-none focus:border-blue-500" /></td>
                        <td className="py-2 px-3"><input value={f.en} onChange={e => updateField(f.id, { en: e.target.value })} placeholder="请输入" className="w-full h-8 border border-slate-200 rounded px-2 text-[13px] font-mono outline-none focus:border-blue-500" /></td>
                        <td className="py-2 px-3"><NativeSelect small value={f.type} onChange={v => updateField(f.id, { type: v })} options={FIELD_TYPES} /></td>
                        <td className="py-2 px-3 whitespace-nowrap">
                          <button onClick={() => { updateActive(t => ({ ...t, fields: t.fields.filter(x => x.id !== f.id) })); if (valueFieldId === f.id) setValueFieldId(null); }}
                            className="font-bold text-slate-400 hover:text-red-500 mr-3">删除</button>
                          <button onClick={() => setValueFieldId(f.id)} className="font-bold text-blue-600 hover:text-blue-700">取值设置{f.config && <span className="ml-0.5 text-green-600">●</span>}</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="p-3 border-t border-slate-100">
                <button onClick={() => updateActive(t => ({ ...t, fields: [...t.fields, { id: uid(), cn: '', en: '', type: '文本' }] }))}
                  className="w-full h-9 border border-dashed border-slate-300 rounded-md text-xs font-bold text-blue-600 hover:border-blue-400 hover:bg-blue-50/40 flex items-center justify-center gap-1">
                  <Plus className="w-3.5 h-3.5" />新增字段
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* 取值设置 */}
      <div className="p-4 min-h-0">
        {active && valueField ? (
          <ValuePanel key={valueField.id} field={valueField} tables={tables} siblings={active.fields}
            onCancel={() => setValueFieldId(null)}
            onConfirm={cfg => { updateField(valueField.id, { config: cfg }); setValueFieldId(null); toast('取值设置已保存！'); }} />
        ) : (
          <div className="h-full flex flex-col items-center justify-center gap-2 text-xs text-slate-400">
            <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center"><FileText className="w-6 h-6 text-slate-300" /></div>
            点击字段的「取值设置」进行配置
          </div>
        )}
      </div>
    </div>
  );
};

/* ---------------------------------------------------------------- 向导主体 */

export const NewDiseaseDbWizard = ({ onClose, onSubmit }: {
  onClose: () => void;
  onSubmit: (result: NewDiseaseDbResult, tableCount: number) => void;
}) => {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<NewDiseaseDbResult>({ code: '', name: '', department: '', admin: '', intro: '', icon: 'MapPin' });
  const [errors, setErrors] = useState<Record<string, boolean>>({});
  const [include, setInclude] = useState<Criterion[]>(initialInclude);
  const [exclude, setExclude] = useState<Criterion[]>([]);
  const [tables, setTables] = useState<DsTable[]>(initialTables);
  const [toast, setToast] = useState<{ text: string; warn?: boolean } | null>(null);

  const showToast = (text: string, warn?: boolean) => {
    setToast({ text, warn });
    window.setTimeout(() => setToast(t => (t?.text === text ? null : t)), 2000);
  };

  const next = () => {
    if (step === 0) {
      const e = { code: !form.code.trim(), name: !form.name.trim(), department: !form.department, admin: !form.admin, icon: !form.icon };
      setErrors(e);
      if (Object.values(e).some(Boolean)) return showToast('请完善必填信息', true);
    }
    if (step === 1 && include.length === 0) return showToast('请至少添加1个纳入条件', true);
    setStep(s => s + 1);
  };

  const submit = () => {
    if (tables.length === 0) return showToast('请至少添加1张数据表', true);
    onSubmit({ ...form, code: form.code.trim(), name: form.name.trim() }, tables.length);
  };

  return (
    <div className="absolute inset-0 z-40 bg-slate-100 flex flex-col text-slate-700 select-none">
      <div className="h-14 shrink-0 bg-white border-b border-slate-200 shadow-sm px-6 grid grid-cols-[1fr_auto_1fr] items-center">
        <button onClick={onClose} className="justify-self-start flex items-center gap-2 text-sm font-bold text-slate-800 hover:text-blue-600">
          <ArrowLeft className="w-4 h-4" />新增专病库
        </button>
        <StepBar step={step} />
        <span />
      </div>

      <div className={`flex-1 min-h-0 overflow-y-auto custom-scrollbar ${step === 2 ? 'p-4' : 'p-6 px-10'}`}>
        <div className={`bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col min-h-full ${step === 2 ? '' : 'max-w-6xl mx-auto'}`}>
          {step === 0 && <div className="flex-1"><BasicStep form={form} setForm={setForm} errors={errors} /></div>}
          {step === 1 && <CriteriaStep include={include} setInclude={setInclude} exclude={exclude} setExclude={setExclude} />}
          {step === 2 && <DatasetStep tables={tables} setTables={setTables} toast={showToast} />}

          <div className="shrink-0 mx-8 py-5 border-t border-slate-100 flex justify-center gap-4">
            {step > 0 && <button onClick={() => setStep(s => s - 1)} className="h-9 w-28 border border-slate-200 rounded-md text-xs font-bold text-slate-700 hover:border-blue-500 hover:text-blue-600">上一步</button>}
            {step === 2 && <button onClick={() => showToast('已保存为草稿！')} className="h-9 w-24 border border-blue-200 rounded-md text-xs font-bold text-blue-600 hover:bg-blue-50">保存</button>}
            {step < 2
              ? <button onClick={next} className="h-9 w-28 rounded-md bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-sm">下一步</button>
              : <button onClick={submit} className="h-9 w-24 rounded-md bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-sm">提交</button>}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {toast && (
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
            className="fixed top-5 left-1/2 -translate-x-1/2 z-[100] bg-white rounded-md shadow-lg border border-slate-100 px-4 py-2.5 flex items-center gap-2 text-[13px] text-slate-800">
            <span className={`w-4 h-4 rounded-full text-white text-[10px] font-bold flex items-center justify-center ${toast.warn ? 'bg-orange-500' : 'bg-green-600'}`}>{toast.warn ? '!' : <Check className="w-3 h-3" strokeWidth={3} />}</span>
            {toast.text}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

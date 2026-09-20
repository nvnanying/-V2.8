import React, { useCallback, useRef, useState } from 'react';
import { AlertCircle, CheckCircle2, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// 科研数据集 / 科研指标库 共用的小组件

export const Checkbox = ({ checked, half, disabled, onClick }: {
  checked?: boolean; half?: boolean; disabled?: boolean; onClick?: (e: React.MouseEvent) => void;
}) => (
  <span
    onClick={disabled ? undefined : onClick}
    className={`relative inline-flex w-3.5 h-3.5 shrink-0 rounded-sm border transition-colors ${
      disabled ? 'bg-slate-100 border-slate-200 cursor-not-allowed'
        : checked || half ? 'bg-blue-600 border-blue-600 cursor-pointer' : 'bg-white border-slate-300 hover:border-blue-500 cursor-pointer'
    }`}
  >
    {checked && <span className="absolute left-[4px] top-[1px] w-[4px] h-[8px] border-white border-r-2 border-b-2 rotate-45" />}
    {!checked && half && <span className="absolute left-[2px] top-[5px] w-[8px] h-[2px] bg-white" />}
  </span>
);

export const MiniSwitch = ({ on, onClick, title }: { on: boolean; onClick?: (e: React.MouseEvent) => void; title?: string }) => (
  <span
    title={title}
    onClick={onClick}
    className={`relative inline-block w-7 h-4 shrink-0 rounded-full transition-colors ${on ? 'bg-blue-600' : 'bg-slate-300'} ${onClick ? 'cursor-pointer' : 'cursor-default'}`}
  >
    <span className={`absolute top-0.5 w-3 h-3 rounded-full bg-white shadow-sm transition-all ${on ? 'left-3.5' : 'left-0.5'}`} />
  </span>
);

export const Highlight = ({ text, keyword }: { text: string; keyword: string }) => {
  const i = keyword ? text.toLowerCase().indexOf(keyword.toLowerCase()) : -1;
  if (i < 0) return <>{text}</>;
  return (
    <>
      {text.slice(0, i)}
      <mark className="bg-orange-100 text-inherit rounded-sm px-px">{text.slice(i, i + keyword.length)}</mark>
      {text.slice(i + keyword.length)}
    </>
  );
};

export const SearchBox = ({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder: string }) => (
  <div className="flex">
    <div className="relative flex-1">
      <input
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full h-9 border border-slate-200 border-r-0 rounded-l pl-3 pr-8 text-[13px] outline-none focus:border-blue-500 placeholder:text-slate-400"
      />
      {value && (
        <button onClick={() => onChange('')} className="absolute right-2 top-2.5 w-4 h-4 rounded-full bg-slate-300 hover:bg-slate-400 text-white flex items-center justify-center" title="清除">
          <X className="w-3 h-3" />
        </button>
      )}
    </div>
    <button className="h-9 px-4 border border-slate-200 bg-slate-50 hover:bg-slate-100 rounded-r text-[13px] text-slate-700">搜索</button>
  </div>
);

export type ToastType = 'ok' | 'warn';

export function useToast() {
  const [toast, setToast] = useState<{ type: ToastType; text: string } | null>(null);
  const timer = useRef<number | undefined>(undefined);
  const show = useCallback((type: ToastType, text: string) => {
    setToast({ type, text });
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setToast(null), 2000);
  }, []);
  const node = (
    <AnimatePresence>
      {toast && (
        <motion.div
          initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
          className="fixed top-5 left-1/2 -translate-x-1/2 z-[100] bg-white rounded-md shadow-lg border border-slate-100 px-4 py-2.5 flex items-center gap-2 text-[13px] text-slate-800"
        >
          {toast.type === 'ok' ? <CheckCircle2 className="w-4 h-4 text-green-600" /> : <AlertCircle className="w-4 h-4 text-orange-500" />}
          {toast.text}
        </motion.div>
      )}
    </AnimatePresence>
  );
  return [node, show] as const;
}

export const Drawer = ({ open, onClose, title, width = 560, footer, children }: {
  open: boolean; onClose: () => void; title: string; width?: number; footer?: React.ReactNode; children: React.ReactNode;
}) => (
  <AnimatePresence>
    {open && (
      <div className="fixed inset-0 z-50">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-black/40" />
        <motion.div
          initial={{ x: width }} animate={{ x: 0 }} exit={{ x: width }} transition={{ type: 'tween', duration: 0.2 }}
          style={{ width }}
          className="absolute top-0 right-0 bottom-0 bg-white shadow-2xl flex flex-col"
        >
          <div className="h-14 shrink-0 px-6 flex items-center justify-between border-b border-slate-100">
            <h3 className="font-bold text-slate-800 text-base">{title}</h3>
            <button onClick={onClose} className="p-1 hover:bg-slate-100 rounded-full transition-colors"><X className="w-4 h-4 text-slate-400" /></button>
          </div>
          {children}
          {footer && <div className="h-16 shrink-0 px-6 border-t border-slate-100 flex items-center justify-end gap-3">{footer}</div>}
        </motion.div>
      </div>
    )}
  </AnimatePresence>
);

export const btn = {
  default: 'h-8 px-4 border border-slate-200 rounded text-[13px] text-slate-700 bg-white hover:border-blue-500 hover:text-blue-600 transition-colors whitespace-nowrap',
  primary: 'h-8 px-4 rounded text-[13px] text-white bg-blue-600 hover:bg-blue-700 shadow-sm transition-colors whitespace-nowrap',
  danger: 'h-8 px-4 rounded text-[13px] text-white bg-red-500 hover:bg-red-600 transition-colors whitespace-nowrap',
  link: 'text-blue-600 hover:text-blue-800 font-medium transition-colors cursor-pointer disabled:text-slate-300 disabled:cursor-not-allowed',
};

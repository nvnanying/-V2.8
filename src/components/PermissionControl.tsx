import React, { useState } from 'react';
import { ChevronDown, ChevronRight, Search, SquareMinus, UserPlus } from 'lucide-react';

type Props = { databaseName: string; admins: string[]; onBack: () => void };
const roles = ['全院', '本院', '数据权限1', '数据权限2', '22', '2222'];
const users = ['普通人员2', '黄菊', '杨应麟', 'test_001', 'test_001', '周圆圆', '周森', '田会英', '陆科宏2', '普通人员', '测试001'];

const SearchBox = () => <div className="flex items-center border border-slate-300 bg-white px-3 py-2 text-slate-400"><input className="min-w-0 flex-1 bg-transparent text-sm outline-none" placeholder="请输入关键字进行检索"/><Search className="h-4 w-4"/></div>;

const ScopePanel = () => <div className="p-7">
  <h3 className="mb-6 border-l-4 border-blue-500 pl-2 text-lg font-bold text-slate-800">数据范围</h3>
  <div className="mb-5 font-medium">可访问</div>
  <div className="mb-12 flex flex-wrap gap-x-10 gap-y-3 text-sm">{['全院','本院','所在组织','所在组织及下级组织','自定义'].map((x,i)=><label key={x} className="flex items-center gap-2"><input name="scope" type="radio" defaultChecked={i===0} className="accent-blue-600"/>{x}</label>)}</div>
  <h3 className="mb-6 border-l-4 border-blue-500 pl-2 text-lg font-bold text-slate-800">检索指标集</h3>
  <div className="w-full max-w-[515px] border border-slate-200 bg-white">
    <div className="p-7 pb-4"><SearchBox/></div>
    <div className="h-[240px] overflow-y-auto border-t border-slate-100 px-8 py-5 text-sm custom-scrollbar">
      <div className="flex items-center gap-2 py-2"><ChevronDown className="h-4 w-4"/><SquareMinus className="h-4 w-4 text-slate-300"/>全选</div>
      <div className="ml-5 flex items-center gap-2 py-2"><ChevronDown className="h-4 w-4"/><input type="checkbox" defaultChecked/>患者信息</div>
      <div className="ml-14 flex gap-2 py-2"><input type="checkbox" defaultChecked/>基本信息</div>
      <div className="ml-14 flex gap-2 py-2"><input type="checkbox" defaultChecked/>表单表</div>
      <div className="ml-10 flex gap-2 py-2"><ChevronRight className="h-4 w-4"/><input type="checkbox"/>子表单</div>
    </div>
  </div>
</div>;

export const PermissionControl = ({databaseName, admins, onBack}: Props) => {
  const [tab,setTab]=useState<'role'|'user'>('role');
  const [role,setRole]=useState('全院');
  const [user,setUser]=useState('普通人员2');
  return <div className="fixed bottom-0 left-[255px] right-0 top-[39px] z-50 flex flex-col overflow-hidden bg-[#f2f3f5] text-slate-700">
    <header className="flex h-[68px] shrink-0 items-center bg-white px-7"><button onClick={onBack} className="mr-5 text-2xl text-blue-600">←</button><h2 className="text-xl font-bold text-slate-900">权限控制</h2></header>
    <div className="mx-7 mt-7 flex h-[54px] shrink-0 items-center bg-white px-7">
      <button onClick={()=>setTab('role')} className={`mr-10 h-full font-bold ${tab==='role'?'border-b-2 border-blue-600 text-blue-600':''}`}>角色授权</button>
      <button onClick={()=>setTab('user')} className={`mr-10 h-full font-bold ${tab==='user'?'border-b-2 border-blue-600 text-blue-600':''}`}>用户授权</button>
      <div className="truncate text-sm">管理员：{admins.join('、')}　权限库：{databaseName}</div>
    </div>
    <main className="mx-7 mb-7 flex min-h-0 flex-1 bg-white p-7 pt-6">
      {tab==='role'?<>
        <aside className="mr-7 flex w-[260px] shrink-0 flex-col border-r border-slate-200 pr-7">
          <div className="mb-4 flex items-center gap-2 font-medium"><SquareMinus className="h-4 w-4"/>数据权限角色列表</div>
          <div className="flex-1 space-y-1">{roles.map(x=><button key={x} onClick={()=>setRole(x)} className={`block w-full rounded px-3 py-3 text-left text-sm ${role===x?'bg-blue-50':'hover:bg-slate-50'}`}>{x}</button>)}</div>
          <button className="border border-blue-600 py-2.5 text-sm text-blue-600">＋ 新增数据授权</button>
        </aside>
        <section className="min-w-0 flex-1 overflow-y-auto rounded border border-slate-200 custom-scrollbar">
          <div className="flex items-center gap-7 bg-slate-50 px-7 py-7"><label>数据权限角色：</label><input value={role} onChange={e=>setRole(e.target.value)} className="w-44 border border-slate-300 bg-white px-3 py-2"/><label>备注：</label><input placeholder="请输入" className="min-w-[200px] flex-1 border border-slate-300 bg-white px-3 py-2"/><button className="border border-slate-300 bg-white px-5 py-2">编辑</button></div>
          <ScopePanel/>
        </section>
      </>:<>
        <aside className="mr-7 flex w-[48%] min-w-[420px] max-w-[585px] shrink-0 flex-col border border-slate-200">
          <div className="flex border-b border-slate-200"><button className="bg-blue-600 px-6 py-3 text-white">用户管理</button><button className="px-6 py-3">角色管理</button></div>
          <div className="grid min-h-0 flex-1 grid-cols-2">
            <div className="border-r border-slate-200 p-7"><SearchBox/><div className="mt-5 space-y-3 text-sm"><div className="bg-blue-50 p-2">▣ 全部（24）</div><div>▼ 测试一级机构打算呐呐...</div><div className="pl-5">▼ 测试二级机构 (2)</div><div className="pl-10">应用管理-二级机构 (2)</div><div className="pl-10">应用管理 (1)</div><div className="pl-10">系统设置 (2)</div><div className="pl-10">账户管理 (1)</div><div className="pl-10">权限管理 (1)</div></div></div>
            <div className="p-7"><SearchBox/><div className="mt-4 space-y-1 overflow-y-auto">{users.map((x,i)=><button key={i} onClick={()=>setUser(x)} className={`block w-full px-2 py-2 text-left text-sm ${user===x?'bg-blue-50 text-blue-600':''}`}>{x}</button>)}</div></div>
          </div>
        </aside>
        <section className="min-w-0 flex-1 overflow-y-auto rounded border border-slate-200 custom-scrollbar"><div className="flex flex-wrap items-center justify-between gap-3 bg-slate-50 px-7 py-7"><div className="flex min-w-0 items-center gap-3"><label className="whitespace-nowrap">数据权限名称：</label><select className="w-56 min-w-[130px] border border-slate-300 bg-white px-3 py-2"><option>全院</option><option>本院</option></select></div><div className="flex shrink-0 gap-3"><button className="whitespace-nowrap border border-slate-300 bg-white px-5 py-2">移除权限</button><button className="whitespace-nowrap border border-slate-300 bg-white px-5 py-2">编辑权限</button></div></div><ScopePanel/></section>
      </>}
    </main>
    {tab==='user'&&<div className="absolute right-14 top-[176px] flex gap-3"><button className="whitespace-nowrap border border-slate-300 bg-white px-5 py-2">批量移除权限</button><button className="flex items-center gap-2 whitespace-nowrap bg-blue-600 px-5 py-2 text-white"><UserPlus className="h-4 w-4"/>新增用户授权</button></div>}
  </div>;
};

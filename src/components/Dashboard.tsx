import React from 'react';
import { 
  Maximize2, Users, Eye, MousePointerClick, Search, Bookmark, Download, 
  PhoneCall, Workflow, Database, HardDrive, FileText, Layers, Tag, Box, 
  Activity, ChevronRight, Stethoscope, Pill, Syringe, ClipboardList, BarChart4,
  Info
} from 'lucide-react';

export function Dashboard() {
  return (
    <div className="relative h-full w-full bg-[#0d111c] text-slate-100 flex flex-col font-sans overflow-auto overflow-x-hidden custom-scrollbar pb-16">
      
      {/* Background ambient lighting */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-[#1d3369] blur-[200px] rounded-full pointer-events-none opacity-30" />
      <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-[#0c4a6e] blur-[200px] rounded-full pointer-events-none opacity-20" />
      
      {/* Fullscreen Button */}
      <div className="absolute top-5 right-6 flex items-center gap-1.5 text-slate-400 hover:text-white cursor-pointer bg-[#1e293b]/40 border border-slate-700/50 p-1.5 px-3 rounded z-50 transition-colors">
        <Maximize2 className="w-3.5 h-3.5" />
        <span className="text-[13px] font-medium">全屏展现</span>
      </div>

      <div className="flex-1 w-full max-w-[1600px] mx-auto p-6 md:p-8 space-y-6 pt-6 relative z-10">
        
        {/* =========================================
            ROW 1: 4 KPIs Sections
        ========================================= */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
           
           {/* Card 1: 平台运营情况 (Req 1) */}
           <div className="relative border border-[#233559] bg-[#161f36]/80 rounded-lg shadow-lg backdrop-blur-md p-5 flex flex-col justify-between overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-2xl group-hover:bg-blue-500/10 transition-colors"></div>
              <div className="flex items-center gap-2 mb-4 relative z-10">
                 <div className="w-1.5 h-4 bg-cyan-400 rounded-full shadow-[0_0_8px_#22d3ee]"></div>
                 <h3 className="text-[15px] text-white font-bold tracking-wider">平台运营情况</h3>
              </div>
              <div className="space-y-3 relative z-10">
                <div className="flex justify-between items-center bg-[#0f172a]/80 px-3 py-2 rounded border border-[#1e293b]">
                   <div className="flex items-center gap-2 text-[12px] text-[#94a3b8]">
                      <Users className="w-3.5 h-3.5 text-blue-400" /> 每日在线人数UV
                   </div>
                   <div className="text-[18px] font-mono font-bold text-cyan-300">1,245</div>
                </div>
                <div className="flex justify-between items-center bg-[#0f172a]/80 px-3 py-2 rounded border border-[#1e293b]">
                   <div className="flex items-center gap-2 text-[12px] text-[#94a3b8]">
                      <Eye className="w-3.5 h-3.5 text-blue-400" /> 页面浏览PV
                   </div>
                   <div className="text-[18px] font-mono font-bold text-[#e0f2fe]">14,890</div>
                </div>
                <div className="flex justify-between items-center bg-[#0f172a]/80 px-3 py-2 rounded border border-[#1e293b]">
                   <div className="flex items-center gap-2 text-[12px] text-[#94a3b8]">
                      <MousePointerClick className="w-3.5 h-3.5 text-blue-400" /> 平均页面访问量
                   </div>
                   <div className="text-[16px] font-mono font-bold text-[#e0f2fe]">11.9 <span className="text-[10px] font-sans text-slate-500 ml-0.5">次/人</span></div>
                </div>
              </div>
           </div>

           {/* Card 2: 平台业务情况统计 (Req 2) */}
           <div className="relative border border-[#233559] bg-[#161f36]/80 rounded-lg shadow-lg backdrop-blur-md p-5 flex flex-col justify-between overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-2xl group-hover:bg-indigo-500/10 transition-colors"></div>
              <div className="flex items-center gap-2 mb-4 relative z-10">
                 <div className="w-1.5 h-4 bg-indigo-400 rounded-full shadow-[0_0_8px_#818cf8]"></div>
                 <h3 className="text-[15px] text-white font-bold tracking-wider">平台业务情况统计</h3>
              </div>
              <div className="grid grid-cols-2 gap-3 relative z-10">
                 <div className="bg-[#0f172a]/80 p-2 rounded border border-[#1e293b]">
                    <div className="text-[11px] text-[#94a3b8] flex items-center gap-1.5"><Search className="w-3 h-3 text-indigo-400"/> 搜索使用情况</div>
                    <div className="text-[16px] font-mono font-bold text-white mt-0.5">84,210</div>
                 </div>
                 <div className="bg-[#0f172a]/80 p-2 rounded border border-[#1e293b]">
                    <div className="text-[11px] text-[#94a3b8] flex items-center gap-1.5"><Bookmark className="w-3 h-3 text-indigo-400"/> 课题及收藏使用</div>
                    <div className="text-[16px] font-mono font-bold text-white mt-0.5">3,410</div>
                 </div>
                 <div className="bg-[#0f172a]/80 p-2 rounded border border-[#1e293b]">
                    <div className="text-[11px] text-[#94a3b8] flex items-center gap-1.5"><Download className="w-3 h-3 text-indigo-400"/> 数据导出情况</div>
                    <div className="text-[16px] font-mono font-bold text-white mt-0.5">482</div>
                 </div>
                 <div className="bg-[#0f172a]/80 p-2 rounded border border-[#1e293b]">
                    <div className="text-[11px] text-[#94a3b8] flex items-center gap-1.5"><PhoneCall className="w-3 h-3 text-indigo-400"/> 随访情况</div>
                    <div className="text-[16px] font-mono font-bold text-white mt-0.5">1,204</div>
                 </div>
                 <div className="col-span-2 bg-[#0f172a]/80 p-2 rounded border border-[#1e293b] flex justify-between items-center">
                    <div className="text-[11px] text-[#94a3b8] flex items-center gap-1.5"><Workflow className="w-3 h-3 text-indigo-400"/> 数据探索情况</div>
                    <div className="text-[16px] font-mono font-bold text-indigo-300">8,941 <span className="text-[10px] font-sans text-slate-500">次</span></div>
                 </div>
              </div>
           </div>

           {/* Card 3: 平台数据集成情况 (Req 3) */}
           <div className="relative border border-[#233559] bg-[#161f36]/80 rounded-lg shadow-lg backdrop-blur-md p-5 flex flex-col justify-between overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-sky-500/5 rounded-full blur-2xl group-hover:bg-sky-500/10 transition-colors"></div>
              <div className="flex items-center gap-2 mb-4 relative z-10">
                 <div className="w-1.5 h-4 bg-sky-400 rounded-full shadow-[0_0_8px_#38bdf8]"></div>
                 <h3 className="text-[15px] text-white font-bold tracking-wider">平台数据集成情况</h3>
              </div>
              <div className="space-y-3 relative z-10">
                <div className="flex items-center gap-4 bg-[#0f172a]/80 p-2.5 rounded border border-[#1e293b]">
                   <div className="w-10 h-10 rounded-full bg-sky-500/10 flex items-center justify-center border border-sky-500/30">
                     <Users className="w-5 h-5 text-sky-400" />
                   </div>
                   <div>
                     <div className="text-[12px] text-[#94a3b8]">集成的患者人数</div>
                     <div className="text-[20px] font-mono font-bold text-white mt-0.5 leading-none">4,210,034</div>
                   </div>
                </div>
                <div className="flex items-center gap-4 bg-[#0f172a]/80 p-2.5 rounded border border-[#1e293b]">
                   <div className="w-10 h-10 rounded-full bg-sky-500/10 flex items-center justify-center border border-sky-500/30">
                     <Database className="w-5 h-5 text-sky-400" />
                   </div>
                   <div>
                     <div className="text-[12px] text-[#94a3b8]">病历人数</div>
                     <div className="text-[20px] font-mono font-bold text-white mt-0.5 leading-none">12,894,112</div>
                   </div>
                </div>
                <div className="flex items-center gap-4 bg-[#0f172a]/80 p-2.5 rounded border border-[#1e293b]">
                   <div className="w-10 h-10 rounded-full bg-sky-500/10 flex items-center justify-center border border-sky-500/30">
                     <HardDrive className="w-5 h-5 text-sky-400" />
                   </div>
                   <div>
                     <div className="text-[12px] text-[#94a3b8] mb-1">占用磁盘情况</div>
                     <div className="flex items-baseline gap-2">
                       <div className="text-[20px] font-mono font-bold text-sky-300 leading-none">42.5</div>
                       <span className="text-[11px] text-slate-400">TB</span>
                     </div>
                   </div>
                </div>
              </div>
           </div>

           {/* Card 4: 院内结构化数据概要 */}
           <div className="relative border border-[#233559] bg-[#161f36]/80 rounded-lg shadow-lg backdrop-blur-md p-5 flex flex-col justify-between overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl group-hover:bg-emerald-500/10 transition-colors"></div>
              <div className="flex items-center gap-2 mb-4 relative z-10">
                 <div className="w-1.5 h-4 bg-emerald-400 rounded-full shadow-[0_0_8px_#34d399]"></div>
                 <h3 className="text-[15px] text-white font-bold tracking-wider">结构化与变量治理</h3>
              </div>
              <div className="flex-1 flex flex-col justify-center space-y-5 relative z-10">
                <div className="text-center">
                   <div className="text-[12px] text-[#94a3b8] flex justify-center items-center gap-1.5 mb-1"><Layers className="w-3.5 h-3.5"/> 结构化总数量</div>
                   <div className="text-[32px] font-mono font-bold text-emerald-400 drop-shadow-[0_0_6px_rgba(52,211,153,0.4)] leading-none">89.4 <span className="text-[14px] font-sans text-slate-300">亿</span></div>
                </div>
                <div className="h-px w-full bg-slate-700/50"></div>
                <div className="grid grid-cols-2 gap-4 text-center">
                   <div>
                     <div className="text-[11px] text-[#94a3b8] mb-1">平台内的变量情况</div>
                     <div className="text-[20px] font-mono font-bold text-white">4,521</div>
                   </div>
                   <div>
                     <div className="text-[11px] text-[#94a3b8] mb-1">被结构化文本大类</div>
                     <div className="text-[20px] font-mono font-bold text-white">9<span className="text-[11px] font-sans text-slate-500 ml-1">类</span></div>
                   </div>
                </div>
              </div>
           </div>

        </div>

        {/* =========================================
            ROW 2: 2 BIG CARDS (Ops/Dept Ranking & Structured Data Trends)
        ========================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-2">
           
           {/* Panel 1: 日常登录及平台运营情况 (Req 1 Dashboard view) */}
           <div className="relative border border-[#233559] bg-[#161f36]/80 rounded-lg shadow-lg backdrop-blur-md px-6 py-6 overflow-hidden flex flex-col">
              <div className="flex items-center justify-between mb-6 border-b border-[#233559] pb-4">
                 <div className="flex items-center gap-2.5">
                   <div className="bg-[#1e293b] p-1.5 rounded border border-[#334155] shadow-inner">
                      <Activity className="w-4 h-4 text-cyan-400" />
                   </div>
                   <h2 className="text-[16px] text-white font-bold tracking-widest text-shadow-sm">日常登录及平台运营情况</h2>
                 </div>
              </div>
              
              <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-8">
                 {/* Left: 折线图 */}
                 <div className="flex flex-col h-[240px]">
                    <div className="text-[13px] font-bold text-[#e0f2fe] mb-4">每日在线人数统计</div>
                    <div className="flex-1 relative border-l border-b border-[#2a3c66]">
                       {/* SVG Line Chart */}
                       <svg viewBox="0 0 500 200" className="w-full h-full" preserveAspectRatio="none">
                          <path d="M0 40h500 M0 80h500 M0 120h500 M0 160h500" stroke="#2a3c66" strokeWidth="1" strokeDasharray="4 4" fill="none" />
                          <path d="M0,200 L0,140 Q50,90 100,120 T200,100 T300,50 T400,80 T500,40 L500,200 Z" fill="url(#lineGridGradient)" />
                          <path d="M0,140 Q50,90 100,120 T200,100 T300,50 T400,80 T500,40" fill="none" stroke="#22d3ee" strokeWidth="3" strokeLinecap="round" style={{filter: 'drop-shadow(0 4px 6px rgba(34,211,238,0.4))'}}/>
                          <defs>
                            <linearGradient id="lineGridGradient" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.3"/>
                              <stop offset="100%" stopColor="#22d3ee" stopOpacity="0"/>
                            </linearGradient>
                          </defs>
                       </svg>
                       {/* Axis Labes */}
                       <div className="absolute right-0 bottom-1 flex w-full justify-between px-2 text-[10px] text-[#5b7396]">
                          <span>01日</span><span>05日</span><span>10日</span><span>15日</span><span>20日</span><span>25日</span><span>30日</span>
                       </div>
                    </div>
                 </div>

                 {/* Right: 柱状图 */}
                 <div className="flex flex-col h-[240px]">
                    <div className="text-[13px] font-bold text-[#e0f2fe] mb-4">科室使用排行榜 Top 5</div>
                    <div className="flex-1 flex flex-col justify-between py-1 space-y-1">
                       {[
                         {name: '心血管内科', width: '90%', value: 854},
                         {name: '神经内科', width: '75%', value: 682},
                         {name: '骨科', width: '60%', value: 521},
                         {name: '胸外科', width: '45%', value: 395},
                         {name: '内分泌科', width: '30%', value: 243},
                       ].map((item, idx) => (
                         <div key={idx} className="flex items-center gap-3">
                           <div className="w-6 h-6 rounded bg-[#1e293b] text-[#94a3b8] flex items-center justify-center text-[10px] font-bold border border-[#334155]">{idx + 1}</div>
                           <div className="w-20 text-right text-[12px] text-[#e0f2fe] truncate font-medium">{item.name}</div>
                           <div className="flex-1 h-[22px] flex items-center pr-2 relative group overflow-hidden bg-[#0f172a] rounded-r">
                             <div className="h-full bg-gradient-to-r from-blue-600/80 to-cyan-400 absolute left-0 top-0 bottom-0 shadow-[0_0_10px_rgba(34,211,238,0.2)] rounded-r" style={{ width: item.width }} />
                             <span className="relative z-10 ml-2 text-[11px] text-white font-mono">{item.value}</span>
                           </div>
                         </div>
                       ))}
                    </div>
                 </div>
              </div>
           </div>

           {/* Panel 2: 院内结构化数据的情况 (Req 5) & Req 4 trend */}
           <div className="relative border border-[#233559] bg-[#161f36]/80 rounded-lg shadow-lg backdrop-blur-md px-6 py-6 overflow-hidden flex flex-col">
              <div className="flex items-center justify-between mb-6 border-b border-[#233559] pb-4">
                 <div className="flex items-center gap-2.5">
                   <div className="bg-[#1e293b] p-1.5 rounded border border-[#334155] shadow-inner">
                      <BarChart4 className="w-4 h-4 text-emerald-400" />
                   </div>
                   <h2 className="text-[16px] text-white font-bold tracking-widest text-shadow-sm">院内结构化数据的情况</h2>
                 </div>
              </div>
              
              <div className="flex-1 grid grid-cols-1 xl:grid-cols-[1fr_200px] gap-6">
                 {/* Left: 线图/面积图 (趋势) */}
                 <div className="flex flex-col h-[240px]">
                    <div className="flex justify-between items-end mb-4">
                      <div className="text-[13px] font-bold text-[#e0f2fe]">按照时间维度展示结构化情况 <span className="text-[10px] font-normal text-[#94a3b8] ml-2">(涵盖及结构化趋势图)</span></div>
                      <div className="text-[11px] bg-[#1e293b] px-2 py-0.5 rounded text-emerald-400 border border-emerald-500/30">总数量: 89.4 亿</div>
                    </div>
                    <div className="flex-1 relative border-l border-b border-[#2a3c66]">
                       <svg viewBox="0 0 400 160" className="w-full h-full" preserveAspectRatio="none">
                          <path d="M0 32h400 M0 64h400 M0 96h400 M0 128h400" stroke="#2a3c66" strokeWidth="1" strokeDasharray="2 4" fill="none" />
                          <path d="M0,160 L0,120 Q40,110 80,80 T160,90 T240,50 T320,60 T400,20 L400,160 Z" fill="url(#structGradient)" />
                          <path d="M0,120 Q40,110 80,80 T160,90 T240,50 T320,60 T400,20" fill="none" stroke="#34d399" strokeWidth="2.5" strokeLinecap="round" />
                          <defs>
                            <linearGradient id="structGradient" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor="#34d399" stopOpacity="0.3"/>
                              <stop offset="100%" stopColor="#34d399" stopOpacity="0"/>
                            </linearGradient>
                          </defs>
                       </svg>
                       <div className="absolute right-0 bottom-1 flex w-full justify-between px-2 text-[10px] text-[#5b7396]">
                          <span>1月</span><span>3月</span><span>5月</span><span>7月</span><span>9月</span><span>11月</span>
                       </div>
                    </div>
                 </div>

                 {/* Right: 竖向柱状图 TOP & 文本大类 */}
                 <div className="flex flex-col h-[240px]">
                    <div className="text-[13px] font-bold text-[#e0f2fe] mb-3 leading-tight tracking-wide">
                      结构化数据top统计
                      <div className="text-[10px] text-[#94a3b8] font-normal mt-0.5 whitespace-nowrap overflow-hidden text-ellipsis">被结构化的文本大类归属统计</div>
                    </div>
                    <div className="flex-1 flex justify-between items-end pb-4 border-b border-[#2a3c66]">
                       {[
                         {name: '疾病诊断', height: '90%', value: '12亿'},
                         {name: '手术操作', height: '70%', value: '8.5亿'},
                         {name: '检查项目', height: '55%', value: '6.2亿'},
                         {name: '药品字典', height: '40%', value: '4.8亿'},
                       ].map((item, idx) => (
                         <div key={idx} className="flex flex-col items-center group w-1/4 h-full justify-end">
                           <span className="text-[10px] text-emerald-300 font-mono opacity-0 group-hover:opacity-100 transition-opacity mb-2">{item.value}</span>
                           <div className="w-8 bg-emerald-900/40 relative rounded-t-sm flex items-end mb-2" style={{ height: item.height }}>
                             <div className="w-full h-full bg-gradient-to-t from-emerald-600 to-emerald-400 rounded-t-sm shadow-[0_0_10px_rgba(52,211,153,0.3)] transition-all"></div>
                           </div>
                           <span className="text-[10px] text-[#94a3b8] scale-90 whitespace-nowrap">{item.name}</span>
                         </div>
                       ))}
                    </div>
                 </div>
              </div>
           </div>
        </div>

        {/* =========================================
            ROW 3: 2 BIG CARDS (Normalization Rings & Variable Management)
        ========================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-2 pb-10">
           
           {/* Panel 3: 诊断、手术、检验、药品结构化术语归一的情况 (Req 4 Donuts) */}
           <div className="relative border border-[#233559] bg-[#161f36]/80 rounded-lg shadow-lg backdrop-blur-md px-6 py-6 overflow-hidden flex flex-col">
              <div className="flex items-center justify-between mb-8 border-b border-[#233559] pb-4">
                 <div className="flex items-center gap-2.5">
                   <div className="bg-[#1e293b] p-1.5 rounded border border-[#334155] shadow-inner">
                      <Stethoscope className="w-4 h-4 text-orange-400" />
                   </div>
                   <h2 className="text-[16px] text-white font-bold tracking-widest text-shadow-sm">结构化术语归一的情况</h2>
                 </div>
              </div>
              
              <div className="flex-1 flex justify-around items-center px-4 pb-4">
                 {/* 4 Donut Charts */}
                 {[
                   { label: '诊断归一率', value: '89%', icon: Stethoscope, color: '#f97316', dashoffset: 282 * (1 - 0.89) },
                   { label: '手术归一率', value: '95%', icon: ClipboardList, color: '#0ea5e9', dashoffset: 282 * (1 - 0.95) },
                   { label: '检验归一率', value: '92%', icon: Activity, color: '#8b5cf6', dashoffset: 282 * (1 - 0.92) },
                   { label: '药品归一率', value: '99%', icon: Pill, color: '#10b981', dashoffset: 282 * (1 - 0.99) },
                 ].map((item, idx) => (
                    <div key={idx} className="flex flex-col items-center gap-4 relative group">
                      <div className="relative w-[110px] h-[110px] flex items-center justify-center">
                        {/* Background Container */}
                        <div className="absolute inset-2 rounded-full bg-[#0d162a] border border-[#1e2d4a] shadow-[inset_0_4px_10px_rgba(0,0,0,0.5)]"></div>
                        {/* SVG Progress Ring */}
                        <svg className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none">
                           <circle cx="55" cy="55" r="45" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="6" />
                           <circle cx="55" cy="55" r="45" fill="none" stroke={item.color} strokeWidth="6" strokeDasharray="282.7" strokeDashoffset={item.dashoffset} strokeLinecap="round" style={{filter: `drop-shadow(0 0 6px ${item.color})`, transition: 'stroke-dashoffset 1s ease-in-out'}} />
                        </svg>
                        
                        {/* Center Value */}
                        <div className="relative z-10 flex flex-col items-center">
                          <item.icon className="w-4 h-4 mb-0.5 opacity-60" style={{color: item.color}} />
                          <span className="text-[22px] font-bold font-mono text-white drop-shadow-md leading-none">{item.value}</span>
                        </div>
                      </div>
                      
                      <div className="text-[13px] text-[#c0d0e6] font-medium tracking-wide mt-1">
                        {item.label}
                      </div>
                    </div>
                 ))}
              </div>
           </div>

           {/* Panel 4: 平台内的变量情况 (Req 6 Treemap & Breakdown) */}
           <div className="relative border border-[#233559] bg-[#161f36]/80 rounded-lg shadow-lg backdrop-blur-md px-6 py-6 overflow-hidden flex flex-col">
              <div className="flex items-center justify-between mb-6 border-b border-[#233559] pb-4">
                 <div className="flex items-center gap-2.5">
                   <div className="bg-[#1e293b] p-1.5 rounded border border-[#334155] shadow-inner">
                      <Box className="w-4 h-4 text-indigo-400" />
                   </div>
                   <h2 className="text-[16px] text-white font-bold tracking-widest text-shadow-sm">平台内的变量情况统计</h2>
                 </div>
              </div>
              
              <div className="flex-1 grid grid-cols-1 xl:grid-cols-2 gap-8">
                 {/* Left: Treemap (矩形图) */}
                 <div className="flex flex-col h-[220px]">
                    <div className="text-[13px] font-bold text-[#e0f2fe] mb-3">不同变量类型的统计 <span className="text-[10px] text-slate-500 font-normal ml-1">(矩形分布图)</span></div>
                    {/* Custom Treemap CSS implementation */}
                    <div className="w-full flex-1 flex flex-col gap-1.5">
                      <div className="flex gap-1.5 h-[60%]">
                        <div className="w-[48%] bg-gradient-to-br from-blue-700 to-blue-900 rounded p-3 relative overflow-hidden group shadow border border-blue-500/20 flex flex-col justify-between">
                          <span className="text-white text-[13px] font-bold relative z-10 tracking-widest">诊断变量</span>
                          <span className="text-blue-200 text-[11px] font-mono relative z-10">1,820 种</span>
                          <div className="absolute -right-3 -bottom-3 opacity-20"><Stethoscope className="w-16 h-16"/></div>
                        </div>
                        <div className="w-[32%] bg-gradient-to-br from-indigo-600 to-indigo-800 rounded p-3 relative overflow-hidden group shadow border border-indigo-500/20 flex flex-col justify-between">
                          <span className="text-white text-[13px] font-bold relative z-10 tracking-wide">检验变量</span>
                          <span className="text-indigo-200 text-[11px] font-mono relative z-10">1,241 种</span>
                        </div>
                        <div className="w-[20%] bg-gradient-to-br from-cyan-600 to-cyan-800 rounded p-3 relative overflow-hidden group shadow border border-cyan-500/20 flex flex-col justify-between">
                          <span className="text-white text-[12px] font-bold relative z-10">药品</span>
                          <span className="text-cyan-200 text-[10px] font-mono relative z-10">842</span>
                        </div>
                      </div>
                      <div className="flex gap-1.5 h-[40%]">
                        <div className="w-[35%] bg-gradient-to-br from-emerald-600 to-emerald-800 rounded p-3 relative overflow-hidden group shadow border border-emerald-500/20 flex flex-col justify-between">
                          <span className="text-white text-[12px] font-bold relative z-10">人口学特征</span>
                          <span className="text-emerald-200 text-[10px] font-mono relative z-10">421 种</span>
                        </div>
                        <div className="w-[45%] bg-gradient-to-br from-sky-600 to-sky-800 rounded p-3 relative overflow-hidden group shadow border border-sky-500/20 flex flex-col justify-between">
                          <span className="text-white text-[12px] font-bold relative z-10">手术操作</span>
                          <span className="text-sky-200 text-[10px] font-mono relative z-10">350 种</span>
                        </div>
                        <div className="w-[20%] bg-gradient-to-br from-slate-600 to-slate-800 rounded p-2 relative overflow-hidden group shadow border border-slate-500/20 flex items-center justify-center">
                          <span className="text-white text-[11px] font-bold relative z-10">其他</span>
                        </div>
                      </div>
                    </div>
                 </div>

                 {/* Right: Bar charts & NLP Prod stats */}
                 <div className="flex flex-col h-[220px] justify-between">
                    
                    {/* 变量被引用的情况统计 (Horizontal Bar) */}
                    <div>
                      <div className="text-[13px] font-bold text-[#e0f2fe] mb-3">变量被引用的情况统计</div>
                      <div className="space-y-2.5">
                         {[
                           {name: '高尿酸血症伴发', width: '90%', value: '1,421次'},
                           {name: '左室射血分数(LVEF)', width: '65%', value: '984次'},
                           {name: '阿司匹林肠溶片', width: '45%', value: '640次'},
                         ].map((item, idx) => (
                           <div key={idx} className="flex items-center gap-2">
                             <div className="w-24 text-right text-[11px] text-[#94a3b8] truncate">{item.name}</div>
                             <div className="flex-1 h-3 flex items-center">
                               <div className="h-full bg-indigo-500 rounded-sm" style={{ width: item.width }} />
                               <span className="ml-2 text-[10px] font-mono text-indigo-300">{item.value}</span>
                             </div>
                           </div>
                         ))}
                      </div>
                    </div>

                    {/* 变量术语生产 / NLP生产 */}
                    <div className="mt-4 pt-4 border-t border-[#2a3c66]">
                      <div className="text-[13px] font-bold text-[#e0f2fe] mb-3">变量核心生产路径</div>
                      <div className="flex items-center justify-between gap-4">
                         
                         <div className="flex-1 bg-[#0f172a] border border-[#1e293b] rounded p-3 flex justify-between items-center relative overflow-hidden">
                            <div className="absolute left-0 top-0 bottom-0 w-1 bg-cyan-500"></div>
                            <span className="text-[12px] text-[#94a3b8] pl-2">变量术语生产的情况</span>
                            <span className="text-[16px] font-bold font-mono text-white">4,021</span>
                         </div>
                         
                         <div className="flex-1 bg-[#0f172a] border border-[#1e293b] rounded p-3 flex justify-between items-center relative overflow-hidden">
                            <div className="absolute left-0 top-0 bottom-0 w-1 bg-purple-500"></div>
                            <span className="text-[12px] text-[#94a3b8] pl-2">通过NLP生产的变量</span>
                            <span className="text-[16px] font-bold font-mono text-white">2,840</span>
                         </div>

                      </div>
                    </div>

                 </div>
              </div>
           </div>
        </div>

        {/* =========================================
            ROW 4: 数据分析
        ========================================= */}
        <div className="pt-2 pb-6">
           
           {/* Section Header */}
           <div className="flex items-center mb-6">
             <div className="relative h-[32px] flex items-center pr-8">
               <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-400 skew-x-[-20deg] rounded-sm transform origin-bottom-left shadow-[0_0_15px_rgba(37,99,235,0.2)]"></div>
               <div className="absolute top-0 right-[-6px] w-3 h-full bg-blue-400 skew-x-[-20deg] rounded-sm opacity-60"></div>
               <div className="relative z-10 flex items-center gap-2.5 px-6 font-bold text-white tracking-widest text-[15px]">
                 <div className="flex gap-0.5 mt-0.5 opacity-90">
                   <div className="w-1 h-3.5 bg-white skew-x-[-15deg]"></div>
                   <div className="w-1 h-3.5 bg-white skew-x-[-15deg]"></div>
                 </div>
                 数据分析
               </div>
             </div>
             <div className="flex-1 h-px bg-gradient-to-r from-blue-500/50 to-transparent ml-2"></div>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
              
              {/* Panel 1: 环形图 - 性别分布 */}
              <div className="relative border border-[#233559] bg-[#161f36]/80 rounded-lg shadow-lg flex flex-col p-6 min-h-[320px]">
                 <div className="text-[14px] font-bold text-[#e0f2fe] mb-2 relative z-10">性别分布</div>
                 
                 <div className="flex-1 flex flex-col items-center justify-center relative">
                    <div className="relative w-[180px] h-[180px] flex items-center justify-center">
                       {/* Center Values */}
                       <div className="absolute inset-0 flex flex-col items-center justify-center z-20">
                         <span className="text-[24px] font-mono font-bold text-white leading-tight">4,821</span>
                         <span className="text-[10px] font-bold text-slate-400 mt-0.5">总计</span>
                       </div>
                       
                       {/* SVG Ring Charts */}
                       <svg viewBox="0 0 200 200" className="w-[120%] h-[120%] absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 -rotate-90">
                         {/* Outer subtle tracks */}
                         <circle cx="100" cy="100" r="82" fill="none" stroke="#233559" strokeWidth="1" strokeDasharray="4 4" />
                         <circle cx="100" cy="100" r="68" fill="#111827" stroke="#1e293b" strokeWidth="1.5" />
                         
                         {/* Segments: Male (55%), Female (45%) */}
                         <circle cx="100" cy="100" r="70" fill="none" stroke="#3b82f6" strokeWidth="14" strokeDasharray="242 440" strokeLinecap="butt" /> 
                         <circle cx="100" cy="100" r="70" fill="none" stroke="#ec4899" strokeWidth="14" strokeDasharray="198 440" strokeDashoffset="-242" strokeLinecap="butt" /> 
                       </svg>
                    </div>

                    <div className="absolute bottom-0 flex justify-center w-full gap-6 text-[11px] text-[#c0d0e6]">
                       <div className="flex flex-col items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-[#3b82f6]"></div>男性</div>
                       <div className="flex flex-col items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-[#ec4899]"></div>女性</div>
                    </div>
                 </div>
              </div>

              {/* Panel 2: 柱状图 - 就诊年龄分布 */}
              <div className="relative border border-[#233559] bg-[#161f36]/80 rounded-lg shadow-lg flex flex-col p-6 min-h-[320px]">
                 <div className="text-[14px] font-bold text-[#e0f2fe] mb-2 relative z-10">就诊年龄分布</div>
                 
                 <div className="flex-1 flex flex-col justify-end relative mt-6 pb-2">
                   {/* Background Grid */}
                   <div className="absolute inset-x-0 bottom-6 top-0 flex flex-col justify-between pointer-events-none z-0">
                      {[...Array(5)].map((_, i) => (
                         <div key={i} className="w-full border-t border-dashed border-[#2a3c66]/50 h-0"></div>
                      ))}
                   </div>
                   
                   <div className="relative z-10 flex justify-around items-end h-[180px] px-2 mb-2">
                     {[
                       { name: '0-18岁', height: '35%', val: '120' },
                       { name: '19-35岁', height: '65%', val: '380' },
                       { name: '36-50岁', height: '85%', val: '610' },
                       { name: '51-65岁', height: '50%', val: '230' },
                       { name: '>65岁', height: '40%', val: '150' },
                     ].map((item, idx) => (
                       <div key={idx} className="flex flex-col items-center group w-[15%] h-full justify-end">
                         <span className="text-[10px] text-sky-300 font-mono opacity-0 group-hover:opacity-100 transition-opacity mb-1">{item.val}</span>
                         <div className="w-full bg-sky-900/40 relative rounded-t-sm flex items-end" style={{ height: item.height }}>
                           <div className="w-full h-full bg-gradient-to-t from-blue-700 to-sky-400 rounded-t-sm shadow-[0_0_8px_rgba(56,189,248,0.4)] transition-all"></div>
                         </div>
                       </div>
                     ))}
                   </div>
                   <div className="relative z-10 flex justify-around items-center px-0 border-t border-[#2a3c66]">
                     {['0-18岁','19-35岁','36-50岁','51-65岁','>65岁'].map((name, idx) => (
                       <span key={idx} className="text-[11px] text-[#94a3b8] mt-2 whitespace-nowrap scale-90">{name}</span>
                     ))}
                   </div>
                 </div>
              </div>
              
              {/* Panel 3: 折线图 - 病历趋势 */}
              <div className="relative border border-[#233559] bg-[#161f36]/80 rounded-lg shadow-lg flex flex-col p-6 min-h-[320px]">
                 <div className="flex items-center gap-2 text-[14px] font-bold text-[#e0f2fe] mb-2 relative z-10">
                   病历趋势
                 </div>
                 
                 <div className="flex-1 flex flex-col justify-end relative mt-2 pb-2">
                    <div className="absolute inset-x-0 bottom-6 top-2 flex flex-col justify-between pointer-events-none z-0">
                      {[...Array(4)].map((_, i) => (
                         <div key={i} className="w-full border-t border-dashed border-[#2a3c66]/50 h-0"></div>
                      ))}
                    </div>
                    <div className="relative z-10 w-full h-[180px]">
                       <svg viewBox="0 0 400 160" className="w-full h-full" preserveAspectRatio="none">
                          <path d="M0,160 L0,120 Q40,90 80,110 T160,70 T240,80 T320,40 T400,60 L400,160 Z" fill="url(#lineGridGradient3)" />
                          <path d="M0,120 Q40,90 80,110 T160,70 T240,80 T320,40 T400,60" fill="none" stroke="#a855f7" strokeWidth="3" strokeLinecap="round" style={{filter: 'drop-shadow(0 4px 6px rgba(168,85,247,0.4))'}}/>
                          
                          {/* Dots */}
                          <circle cx="80" cy="110" r="4" fill="#161f36" stroke="#a855f7" strokeWidth="2.5" />
                          <circle cx="160" cy="70" r="4" fill="#161f36" stroke="#a855f7" strokeWidth="2.5" />
                          <circle cx="240" cy="80" r="4" fill="#161f36" stroke="#a855f7" strokeWidth="2.5" />
                          <circle cx="320" cy="40" r="4" fill="#161f36" stroke="#a855f7" strokeWidth="2.5" />
                          <circle cx="400" cy="60" r="4" fill="#161f36" stroke="#a855f7" strokeWidth="2.5" />

                          <defs>
                            <linearGradient id="lineGridGradient3" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor="#a855f7" stopOpacity="0.4"/>
                              <stop offset="100%" stopColor="#a855f7" stopOpacity="0"/>
                            </linearGradient>
                          </defs>
                       </svg>
                    </div>
                    <div className="relative z-10 flex justify-between px-2 text-[10px] text-[#5b7396] mt-2 font-mono">
                       <span>1月</span><span>2月</span><span>3月</span><span>4月</span><span>5月</span><span>6月</span>
                    </div>
                 </div>
              </div>
              
              {/* Panel 4: 矩形图 - 数据模态分布统计 */}
              <div className="relative border border-[#233559] bg-[#161f36]/80 rounded-lg shadow-lg flex flex-col p-6 min-h-[320px]">
                 <div className="text-[14px] font-bold text-[#e0f2fe] mb-4 relative z-10">数据模态分布统计</div>
                 
                 <div className="flex-1 flex flex-col gap-1.5 h-full">
                    <div className="flex gap-1.5 h-[50%]">
                      <div className="w-[55%] bg-gradient-to-br from-indigo-700 to-indigo-900 rounded-sm p-3 relative overflow-hidden group shadow flex flex-col justify-between hover:brightness-110 transition-all cursor-crosshair">
                        <span className="text-white text-[13px] font-bold relative z-10 tracking-widest leading-none">结构化文本</span>
                        <span className="text-indigo-200 text-[11px] font-mono relative z-10 leading-none">45% (1.2M)</span>
                      </div>
                      <div className="w-[45%] bg-gradient-to-br from-teal-600 to-teal-800 rounded-sm p-3 relative overflow-hidden group shadow flex flex-col justify-between hover:brightness-110 transition-all cursor-crosshair">
                        <span className="text-white text-[12px] font-bold relative z-10 tracking-wide leading-none">影像DICOM</span>
                        <span className="text-teal-200 text-[10px] font-mono relative z-10 leading-none">25% (640K)</span>
                      </div>
                    </div>
                    <div className="flex gap-1.5 h-[50%]">
                      <div className="w-[40%] bg-gradient-to-br from-orange-600 to-orange-800 rounded-sm p-3 relative overflow-hidden group shadow flex flex-col justify-between hover:brightness-110 transition-all cursor-crosshair">
                        <span className="text-white text-[12px] font-bold relative z-10 leading-none">基因组数据</span>
                        <span className="text-orange-200 text-[10px] font-mono relative z-10 leading-none">15% (380K)</span>
                      </div>
                      <div className="w-[35%] bg-gradient-to-br from-pink-600 to-pink-800 rounded-sm p-3 relative overflow-hidden group shadow flex flex-col justify-between hover:brightness-110 transition-all cursor-crosshair">
                        <span className="text-white text-[11px] font-bold relative z-10 leading-none">随访记录</span>
                        <span className="text-pink-200 text-[10px] font-mono relative z-10 leading-none">10% (250K)</span>
                      </div>
                      <div className="w-[25%] bg-gradient-to-br from-slate-600 to-slate-800 rounded-sm p-2 relative overflow-hidden group shadow flex items-center justify-center hover:brightness-110 transition-all cursor-crosshair">
                        <span className="text-white text-[11px] font-bold relative z-10 leading-none">其他</span>
                      </div>
                    </div>
                 </div>
              </div>

           </div>
        </div>

      </div>
    </div>
  );
}

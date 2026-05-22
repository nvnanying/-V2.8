import React, { useState } from 'react';
import { 
  Check, 
  Plus, 
  Search, 
  RotateCcw, 
  X, 
  ChevronRight, 
  ChevronLeft, 
  User, 
  Clock, 
  ArrowLeft, 
  FileText, 
  AlertCircle, 
  ThumbsUp, 
  ThumbsDown, 
  ClipboardCheck, 
  RefreshCw, 
  CheckCircle2,
  Database,
  ArrowRight,
  ChevronDown,
  Calendar,
  Power
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// Seeding standard applications for rich visual detail
interface ApplicationRequest {
  id: string;
  workflowId: string;
  workflowName: string;
  category: string;
  libraries: string;
  subConfigs: string;
  applicant: string;
  reason: string;
  status: 'Approved' | 'Pending' | 'Rejected' | 'Withdrawn';
  submitTime: string;
  reviewComment?: string;
  nodesStatus: {
    name: string;
    role: string;
    status: 'completed' | 'active' | 'pending' | 'rejected';
    operator?: string;
    time?: string;
  }[];
}

const SEED_APPLICATIONS: ApplicationRequest[] = [
  {
    id: 'REQ20260512001',
    workflowId: 'wf1',
    workflowName: '全院心脑血管患者数据提取审批流',
    category: '数据导出',
    libraries: '心血管病专题数据库',
    subConfigs: '数据中心, 数据检索',
    applicant: '科研演示02',
    reason: '重大临床课题：中老年心源性猝死易感靶点筛查及回顾性队列随访，需要导出2024-2025年度心内科排除去隐私化后的核心检验数据集。',
    status: 'Approved',
    submitTime: '2026-05-12 14:33',
    reviewComment: '已确认课题协议与合规声明，准予导出高保密数据集。',
    nodesStatus: [
      { name: '提交申请', role: '申请人', status: 'completed', operator: '科研演示02', time: '2026-05-12 14:33' },
      { name: '学术委员会一审', role: '学术委员会', status: 'completed', operator: '张林 主任', time: '2026-05-12 15:40' },
      { name: '伦理核查', role: '高级伦理委员', status: 'completed', operator: '陈静 教授', time: '2026-05-12 16:12' },
      { name: '科务会脱敏签发', role: '保密管理部门', status: 'completed', operator: '系统自动脱敏', time: '2026-05-12 17:00' }
    ]
  },
  {
    id: 'REQ20260512002',
    workflowId: 'wf5',
    workflowName: '基因组学测序原始数据安全导出审批表',
    category: '数据导出',
    libraries: '肿瘤免疫多组学科研库',
    subConfigs: '数据中心',
    applicant: '科研演示02',
    reason: '进行肺癌PD-1耐药患者外显子测序靶点生存分析，需拉取靶向测序FASTQ原始测序及变异注释突变表格。',
    status: 'Pending',
    submitTime: '2026-05-12 11:32',
    nodesStatus: [
      { name: '提交申请', role: '申请人', status: 'completed', operator: '科研演示02', time: '2026-05-12 11:32' },
      { name: '学术委员会一审', role: '学术委员会', status: 'active' },
      { name: '数据中心安全员', role: '系统管理员', status: 'pending' }
    ]
  },
  {
    id: 'REQ20260509001',
    workflowId: 'wf3',
    workflowName: '骨科随访历史病历查询快速通道',
    category: '数据查询',
    libraries: '骨科临床随访科研库',
    subConfigs: '数据检索, 患者收藏',
    applicant: '科研演示02',
    reason: '骨关节病假体置换患者长期生存率真实世界研究，需批量检索近10年置换手术记录及术后定期线上随访回卷对比数据。',
    status: 'Approved',
    submitTime: '2026-05-09 11:32',
    reviewComment: '日常临床随访数据库浏览，流程自动核对满足隐私合规。已通过权限分派。',
    nodesStatus: [
      { name: '提交申请', role: '申请人', status: 'completed', operator: '科研演示02', time: '2026-05-09 11:32' },
      { name: '自动比对合规校验', role: '合规验证器', status: 'completed', operator: '系统自动化判定', time: '2026-05-09 11:32' }
    ]
  },
  {
    id: 'REQ20260508003',
    workflowId: 'wf4',
    workflowName: '重点实验室多中心队列提取计划审核',
    category: '科研项目审查',
    libraries: '公共对照人群库',
    subConfigs: '课题',
    applicant: '李大民 医生',
    reason: '国家脑瘤精准生存多中心列队方案比对入组，需调用公共对照库中同年龄、同性别区间的健康对照血清代谢组配对列表。',
    status: 'Pending',
    submitTime: '2026-05-11 09:20',
    nodesStatus: [
      { name: '提交申请', role: '申请人', status: 'completed', operator: '李大民 医生', time: '2026-05-11 09:20' },
      { name: '对应协作中心审批', role: '实验室主任', status: 'active' }
    ]
  },
  {
    id: 'REQ20260507005',
    workflowId: 'wf8',
    workflowName: '冰冻切片免疫组化样本调拨审批',
    category: '样本使用',
    libraries: '肿瘤免疫多组学科研库',
    subConfigs: '课题, 患者收藏',
    applicant: '王晓婷 研究员',
    reason: '申请调拨30例乳腺癌免疫微环境冰冻病理标本进行单细胞核转录组测序验证试验。已取得伦理签发证书。',
    status: 'Rejected',
    submitTime: '2026-05-07 15:10',
    reviewComment: '本批库存标本目前正在执行重大专项，目前容量受限无法大批调出。建议缩减申请数量。',
    nodesStatus: [
      { name: '提交申请', role: '申请人', status: 'completed', operator: '王晓婷 研究员', time: '2026-05-07 15:10' },
      { name: '样本库主管预审', role: '高级实验师', status: 'rejected', operator: '陈主任', time: '2026-05-08 10:15' }
    ]
  }
];

export interface ExportApplication {
  id: number;
  dbName: string;
  source: string;
  datasetName: string;
  dataVolume: string;
  dept: string;
  applicant: string;
  applyTime: string;
  status: '待审批' | '审批中' | '审批通过' | '审批拒绝' | '已撤销';
  currentApprovalNode: string;
  opinion: string;
  approveTime: string;
}

const DEFAULT_MY_APPLICATIONS: ExportApplication[] = [
  {
    id: 1,
    dbName: '通用科研库',
    source: '快速检索',
    datasetName: '1',
    dataVolume: '196793份病历，2位患者',
    dept: '开发专用3-2级',
    applicant: 'test_A',
    applyTime: '2026-05-12 14:33',
    status: '审批通过',
    opinion: '1',
    approveTime: '2026-05-12 14:33:41',
    currentApprovalNode: '流程结束'
  },
  {
    id: 2,
    dbName: '通用科研库',
    source: '患者收藏',
    datasetName: '测试20260402001',
    dataVolume: '10份病历，0位患者',
    dept: '开发专用3-2级',
    applicant: 'test_A',
    applyTime: '2026-04-02 14:52',
    status: '已撤销',
    opinion: '-',
    approveTime: '-',
    currentApprovalNode: '流程结束'
  },
  {
    id: 3,
    dbName: '通用科研库',
    source: '科研检索',
    datasetName: '1',
    dataVolume: '10份病历，3位患者',
    dept: '开发专用3-2级',
    applicant: 'test_A',
    applyTime: '2026-03-30 17:23',
    status: '审批通过',
    opinion: '1',
    approveTime: '2026-03-30 17:24:16',
    currentApprovalNode: '流程结束'
  },
  {
    id: 4,
    dbName: '通用科研库',
    source: '患者列表',
    datasetName: '1',
    dataVolume: '16份病历，3位患者',
    dept: '开发专用3-2级',
    applicant: 'test_A',
    applyTime: '2026-03-11 15:46',
    status: '审批通过',
    opinion: '-',
    approveTime: '2026-03-11 15:46:35',
    currentApprovalNode: '流程结束'
  }
];

const DEFAULT_MY_REVIEWS: ExportApplication[] = [
  {
    id: 1,
    dbName: '通用科研库',
    source: '患者收藏',
    datasetName: '2',
    dataVolume: '54份病历，4位患者',
    dept: '医院管理平台级科室',
    applicant: 'test_B',
    applyTime: '2026-05-21 17:01',
    status: '待审批',
    opinion: '-',
    approveTime: '-',
    currentApprovalNode: '部门主管审批'
  },
  {
    id: 2,
    dbName: '通用科研库',
    source: '快速检索',
    datasetName: 'test',
    dataVolume: '118800份病历，11409位患者',
    dept: '开发专用1级(专科科室)',
    applicant: '吴汶芮',
    applyTime: '2026-05-21 09:23',
    status: '审批通过',
    opinion: '-',
    approveTime: '2026-05-21 09:25:02',
    currentApprovalNode: '流程结束'
  },
  {
    id: 3,
    dbName: '通用科研库',
    source: '患者收藏',
    datasetName: '套餐导出',
    dataVolume: '4份病历，4位患者',
    dept: '开发专用1级(专科科室)',
    applicant: '吴汶芮',
    applyTime: '2026-05-15 16:38',
    status: '审批通过',
    opinion: '-',
    approveTime: '2026-05-15 16:40:14',
    currentApprovalNode: '流程结束'
  },
  {
    id: 4,
    dbName: '通用科研库',
    source: '快速检索',
    datasetName: '测试',
    dataVolume: '118800份病历，11409位患者',
    dept: '开发专用1级(专科科室)',
    applicant: '吴汶芮',
    applyTime: '2026-05-15 14:11',
    status: '审批中',
    opinion: '-',
    approveTime: '-',
    currentApprovalNode: '样本库主管预审'
  },
  {
    id: 5,
    dbName: '通用科研库',
    source: '科研检索',
    datasetName: '1',
    dataVolume: '1份病历，1位患者',
    dept: '开发专用1级(专科科室)',
    applicant: '柳结华',
    applyTime: '2026-05-14 10:17',
    status: '待审批',
    opinion: '-',
    approveTime: '-',
    currentApprovalNode: '部门主管审批'
  },
  {
    id: 6,
    dbName: '通用科研库',
    source: '患者收藏',
    datasetName: '测试测试测试',
    dataVolume: '1份病历，1位患者',
    dept: '开发专用1级(专科科室)',
    applicant: '柳结华',
    applyTime: '2026-05-13 09:44',
    status: '待审批',
    opinion: '-',
    approveTime: '-',
    currentApprovalNode: '部门主管审批'
  },
  {
    id: 7,
    dbName: '通用科研库',
    source: '患者收藏',
    datasetName: '测试',
    dataVolume: '1份病历，1位患者',
    dept: '开发专用1级(专科科室)',
    applicant: '柳结华',
    applyTime: '2026-05-13 09:44',
    status: '待审批',
    opinion: '-',
    approveTime: '-',
    currentApprovalNode: '部门主管审批'
  },
  {
    id: 8,
    dbName: '通用科研库',
    source: '快速检索',
    datasetName: 'tyyyyyy',
    dataVolume: '391534份病历，3位患者',
    dept: '全科室',
    applicant: '高家勇',
    applyTime: '2026-05-12 14:40',
    status: '待审批',
    opinion: '-',
    approveTime: '-',
    currentApprovalNode: '部门主管审批'
  },
  {
    id: 9,
    dbName: '通用科研库',
    source: '快速检索',
    datasetName: 'eyyyyyy',
    dataVolume: '10份病历，3位患者',
    dept: '全科室',
    applicant: '高家勇',
    applyTime: '2026-05-12 14:40',
    status: '待审批',
    opinion: '-',
    approveTime: '-',
    currentApprovalNode: '部门主管审批'
  },
  {
    id: 10,
    dbName: '通用科研库',
    source: '高级检索',
    datasetName: 'fff',
    dataVolume: '10份病历，10位患者',
    dept: '全科室',
    applicant: '高家勇',
    applyTime: '2026-05-12 14:38',
    status: '审批通过',
    opinion: '-',
    approveTime: '2026-05-12 14:38:26',
    currentApprovalNode: '流程结束'
  },
  {
    id: 11,
    dbName: '通用科研库',
    source: '高级检索',
    datasetName: 'xv',
    dataVolume: '10份病历，10位患者',
    dept: '全科室',
    applicant: '高家勇',
    applyTime: '2026-05-12 14:35',
    status: '审批通过',
    opinion: "a's'd",
    approveTime: '2026-05-12 14:36:13',
    currentApprovalNode: '流程结束'
  },
  {
    id: 12,
    dbName: '通用科研库',
    source: '快速检索',
    datasetName: '1',
    dataVolume: '196793份病历，2位患者',
    dept: '开发专用3-2级',
    applicant: 'test_A',
    applyTime: '2026-05-12 14:33',
    status: '审批通过',
    opinion: '1',
    approveTime: '2026-05-12 14:33:41',
    currentApprovalNode: '流程结束'
  }
];

interface ApprovalCenterProps {
  workflows: any[];
}

export const ApprovalCenter = ({ workflows }: ApprovalCenterProps) => {
  // Navigation: 'overview' | 'my-applications' | 'my-approvals' | 'export-detail'
  const [currentView, setCurrentView] = useState<'overview' | 'my-applications' | 'my-approvals' | 'export-detail'>('overview');
  const [detailItem, setDetailItem] = useState<ExportApplication | null>(null);
  const [applications, setApplications] = useState<ApplicationRequest[]>(SEED_APPLICATIONS);
  
  // Modals
  const [showNewRequestModal, setShowNewRequestModal] = useState(false);
  const [selectedAppForDetail, setSelectedAppForDetail] = useState<ApplicationRequest | null>(null);
  const [selectedAppForAction, setSelectedAppForAction] = useState<ApplicationRequest | null>(null);

  // New application sheet template states
  const [selectedWfId, setSelectedWfId] = useState('');
  const [newReason, setNewReason] = useState('');

  // States for custom medical My Applications layout
  const [myExportList, setMyExportList] = useState<ExportApplication[]>(DEFAULT_MY_APPLICATIONS);
  const [selectedApplyTab, setSelectedApplyTab] = useState<'permission' | 'export'>('export');
  const [exportDbSource, setExportDbSource] = useState('');
  const [exportSearchContent, setExportSearchContent] = useState('');
  const [exportTimeRange, setExportTimeRange] = useState('');
  
  // States for custom medical My Approvals layout
  const [myReviewList, setMyReviewList] = useState<ExportApplication[]>(DEFAULT_MY_REVIEWS);
  const [selectedReviewTab, setSelectedReviewTab] = useState<'permission' | 'export'>('export');
  const [reviewDbSource, setReviewDbSource] = useState('');
  const [reviewStatus, setReviewStatus] = useState('');
  const [reviewTimeRange, setReviewTimeRange] = useState('');
  const [reviewSearchContent, setReviewSearchContent] = useState('');
  const [showApprovalActionModal, setShowApprovalActionModal] = useState<ExportApplication | null>(null);
  const [approvalActionComment, setApprovalActionComment] = useState('');
  const [showInlineApproval, setShowInlineApproval] = useState(false);
  
  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  
  // Toasts
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  
  // Helper to find selected detail
  const selectedExportDetail = detailItem;

  if (currentView === 'export-detail' && selectedExportDetail) {
    return (
      <div className="flex-grow flex flex-col bg-slate-50 min-h-screen">
        {/* Title Header */}
        <div className="flex items-center justify-between px-8 py-6 bg-white border-b border-slate-200 shadow-sm select-none">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setCurrentView('my-approvals')}
              className="p-1.5 rounded-full hover:bg-slate-100 transition-colors cursor-pointer text-slate-600"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">{selectedExportDetail.datasetName}</h1>
          </div>
          <div className="flex gap-3">
             <button 
                onClick={() => setShowInlineApproval(!showInlineApproval)}
                className="px-5 py-2 bg-blue-600 text-white rounded font-semibold text-sm hover:bg-blue-700 transition-colors"
             >
                审批
             </button>
          </div>
        </div>

        <div className="p-6 max-w-full mx-auto w-full grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column (Information & Preview) */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-8">
              <h2 className="font-bold text-xl text-slate-900 mb-6 flex items-center gap-2">
                检索信息
              </h2>
              <div className="border border-slate-200 text-sm overflow-hidden">
                  <div className="grid grid-cols-[160px_1fr_160px_1fr] border-b border-slate-200">
                      <div className="bg-slate-50 p-3 font-semibold text-slate-600">数据集名称</div>
                      <div className="p-3 text-slate-900 border-l border-slate-200">{selectedExportDetail.datasetName}</div>
                      <div className="bg-slate-50 p-3 font-semibold text-slate-600 border-l border-slate-200">业务用途</div>
                      <div className="p-3 text-slate-900 border-l border-slate-200">ff</div>
                  </div>
                  <div className="grid grid-cols-[160px_1fr_160px_1fr] border-b border-slate-200">
                      <div className="bg-slate-50 p-3 font-semibold text-slate-600">申请附件</div>
                      <div className="p-3 text-slate-900 border-l border-slate-200"></div>
                      <div className="bg-slate-50 p-3 font-semibold text-slate-600 border-l border-slate-200">数据量</div>
                      <div className="p-3 text-slate-900 border-l border-slate-200">{selectedExportDetail.dataVolume}</div>
                  </div>
                  <div className="grid grid-cols-[160px_1fr_160px_1fr] border-b border-slate-200">
                      <div className="bg-slate-50 p-3 font-semibold text-slate-600">导出人</div>
                      <div className="p-3 text-slate-900 border-l border-slate-200">{selectedExportDetail.applicant}</div>
                      <div className="bg-slate-50 p-3 font-semibold text-slate-600 border-l border-slate-200">导出时间</div>
                      <div className="p-3 text-slate-900 border-l border-slate-200"></div>
                  </div>
                  <div className="grid grid-cols-[160px_1fr_160px_1fr]">
                      <div className="bg-slate-50 p-3 font-semibold text-slate-600">导出字段</div>
                      <div className="p-3 text-blue-600 cursor-pointer hover:underline border-l border-slate-200">查看</div>
                      <div className="bg-slate-50 p-3 font-semibold text-slate-600 border-l border-slate-200">有效状态</div>
                      <div className="p-3 text-slate-900 border-l border-slate-200 flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-amber-500" /> 未开始</div>
                  </div>
                  <div className="grid grid-cols-[160px_1fr] border-t border-slate-200">
                      <div className="bg-slate-50 p-3 font-semibold text-slate-600">失败原因</div>
                      <div className="p-3 text-slate-900 border-l border-slate-200">-</div>
                  </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-8">
              <h2 className="font-bold text-xl text-slate-900 mb-6 flex items-center gap-2">
                数据集预览
              </h2>
              <div className="border border-slate-100 rounded-lg overflow-hidden">
                 <table className="w-full text-left text-sm">
                  <thead className="bg-[#e4efff] text-slate-700 border-b border-slate-100">
                    <tr>
                      <th className="p-4">就诊类型</th>
                      <th className="p-4">就诊科室</th>
                      <th className="p-4">就诊时间</th>
                      <th className="p-4">rid (调用函数生成)</th>
                      <th className="p-4">empi</th>
                      <th className="p-4">患者ID</th>
                      <th className="p-4">就诊ID</th>
                      <th className="p-4">接诊医生</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {[1, 2, 3, 4].map((i) => (
                      <tr key={i} className="hover:bg-slate-50">
                        <td className="p-4">门诊</td>
                        <td className="p-4">骨科</td>
                        <td className="p-4">2024-02-xx</td>
                        <td className="p-4 font-mono text-slate-600">68146327738487743...</td>
                        <td className="p-4 text-slate-600">EMPI...</td>
                        <td className="p-4 font-mono text-slate-600">P0000...</td>
                        <td className="p-4 font-mono text-slate-600">V0038...</td>
                        <td className="p-4 text-slate-600">Dr.骨科...</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Right Column (Workflow & Actions) */}
          <div className="lg:col-span-1 space-y-6">
            <AnimatePresence>
              {showInlineApproval && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden"
                >
                  <div className="p-6">
                     <h2 className="font-bold text-lg text-slate-900 mb-6">审批操作</h2>
                     <textarea
                       placeholder="请输入审批意见..."
                       value={approvalActionComment}
                       onChange={(e) => setApprovalActionComment(e.target.value)}
                       className="w-full border border-slate-300 rounded p-3 text-sm focus:outline-none focus:border-blue-500 min-h-[100px] resize-y mb-4"
                     />
                     <div className="grid grid-cols-2 gap-3">
                        <button 
                          onClick={() => {
                            const updated = myReviewList.map(item => {
                              if (item.id === selectedExportDetail.id) {
                                return { ...item, status: '已驳回' };
                              }
                              return item;
                            });
                            setMyReviewList(updated);
                            setDetailItem(null);
                            setCurrentView('my-approvals');
                            setShowInlineApproval(false);
                            triggerToast(`申请【数据集:${selectedExportDetail.datasetName}】已被成功驳回`);
                          }}
                          className="py-2 bg-red-50 text-red-600 border border-red-200 rounded font-semibold text-sm hover:bg-red-100 transition-colors"
                        >
                          审批拒绝
                        </button>
                        <button 
                          onClick={() => {
                            const updated = myReviewList.map(item => {
                              if (item.id === selectedExportDetail.id) {
                                return { ...item, status: '审批通过' };
                              }
                              return item;
                            });
                            setMyReviewList(updated);
                            setDetailItem(null);
                            setCurrentView('my-approvals');
                            setShowInlineApproval(false);
                            triggerToast(`已通过审批并赋权【数据集:${selectedExportDetail.datasetName}】`);
                          }}
                          className="py-2 bg-blue-600 text-white rounded font-semibold text-sm hover:bg-blue-700 transition-colors"
                        >
                          审批通过
                        </button>
                     </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="bg-slate-50/50 rounded-lg shadow-sm p-6 border border-slate-200 min-h-[600px] sticky top-6">
              {/* Timeline container */}
              <div className="space-y-6 relative ml-2">
                
                {/* Node 1: 开始 */}
                <div className="relative flex gap-4">
                  <div className="absolute top-8 left-[11px] bottom-[-24px] w-[2px] bg-slate-200" />
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center relative z-10">
                     <User className="w-3.5 h-3.5" />
                     <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 rounded-full border-[2px] border-white flex items-center justify-center">
                       <Check className="w-2 h-2 text-white" />
                     </div>
                  </div>
                  <div className="flex-1 pb-2">
                    <div className="flex items-center justify-between">
                      <div className="font-bold text-slate-800 text-[14px]">开始</div>
                      <div className="text-[11px] text-slate-400 font-mono">2026-05-19 09:57:15</div>
                    </div>
                    <div className="mt-2.5 flex flex-wrap gap-2">
                      <div className="flex items-center gap-1.5 px-2.5 py-0.5 bg-white rounded-full border border-slate-200/50 shadow-sm">
                        <div className="w-4 h-4 rounded-full bg-blue-600 text-white flex items-center justify-center text-[9px] font-bold">g</div>
                        <span className="text-[12px] text-slate-700">guest1</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Node 2: 遗传办公室审批 */}
                <div className="relative flex gap-4">
                  <div className="absolute top-8 left-[11px] bottom-[-24px] w-[2px] bg-slate-200" />
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center relative z-10">
                     <User className="w-3.5 h-3.5" />
                     <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-slate-400 rounded-full border-[2px] border-white flex items-center justify-center">
                       <Clock className="w-2 h-2 text-white" />
                     </div>
                  </div>
                  <div className="flex-1 pb-2">
                    <div className="font-bold text-slate-800 text-[14px]">遗传办公室审批</div>
                    <div className="mt-2.5 flex flex-wrap gap-2">
                      <div className="flex items-center gap-1.5 px-2.5 py-0.5 bg-white rounded-full border border-slate-200/50 shadow-sm">
                        <div className="w-4 h-4 rounded-full bg-white border border-slate-200 text-slate-300 flex items-center justify-center overflow-hidden">
                           <User className="w-2.5 h-2.5" />
                        </div>
                        <span className="text-[12px] text-slate-600">yangliu</span>
                      </div>
                      <div className="flex items-center gap-1.5 px-2.5 py-0.5 bg-white rounded-full border border-slate-200/50 shadow-sm">
                        <div className="w-4 h-4 rounded-full bg-blue-600 text-white flex items-center justify-center text-[9px] font-bold">M</div>
                        <span className="text-[12px] text-slate-700">MrZhang</span>
                      </div>
                      <div className="flex items-center gap-1.5 px-2.5 py-0.5 bg-white rounded-full border border-slate-200/50 shadow-sm">
                        <div className="w-4 h-4 rounded-full bg-slate-300 text-white flex items-center justify-center overflow-hidden"><img src="https://i.pravatar.cc/100?img=11" alt="admin" /></div>
                        <span className="text-[12px] text-slate-700">admin</span>
                      </div>
                      <div className="flex items-center gap-1.5 px-2.5 py-0.5 bg-white rounded-full border border-slate-200/50 shadow-sm">
                        <div className="w-4 h-4 rounded-full bg-slate-300 text-white flex items-center justify-center overflow-hidden"><img src="https://i.pravatar.cc/100?img=12" alt="tianhy" /></div>
                        <span className="text-[12px] text-slate-700">tianhy</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Node 3: 课题PI审批 */}
                <div className="relative flex gap-4">
                  <div className="absolute top-8 left-[11px] bottom-[-24px] w-[2px] bg-slate-200" />
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center relative z-10">
                     <User className="w-3.5 h-3.5" />
                     <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-slate-400 rounded-full border-[2px] border-white flex items-center justify-center">
                       <Clock className="w-2 h-2 text-white" />
                     </div>
                  </div>
                  <div className="flex-1 pb-2">
                    <div className="font-bold text-slate-800 text-[14px]">课题PI审批</div>
                    <div className="mt-2.5 flex flex-wrap gap-2">
                      <div className="flex items-center gap-1.5 px-2.5 py-0.5 bg-white rounded-full border border-slate-200/50 shadow-sm">
                        <div className="w-4 h-4 rounded-full bg-blue-600 text-white flex items-center justify-center text-[9px] font-bold">a</div>
                        <span className="text-[12px] text-slate-700">admin</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Node 4: 科教科审批 */}
                <div className="relative flex gap-4">
                  <div className="absolute top-8 left-[11px] bottom-[-24px] w-[2px] bg-slate-200" />
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center relative z-10">
                     <User className="w-3.5 h-3.5" />
                     <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-slate-400 rounded-full border-[2px] border-white flex items-center justify-center">
                       <Clock className="w-2 h-2 text-white" />
                     </div>
                  </div>
                  <div className="flex-1 pb-2">
                    <div className="font-bold text-slate-800 text-[14px]">科教科审批</div>
                    <div className="mt-2.5 flex flex-wrap gap-2">
                      <div className="flex items-center gap-1.5 px-2.5 py-0.5 bg-white rounded-full border border-slate-200/50 shadow-sm">
                        <div className="w-4 h-4 rounded-full bg-white border border-slate-200 text-slate-300 flex items-center justify-center overflow-hidden">
                           <User className="w-2.5 h-2.5" />
                        </div>
                        <span className="text-[12px] text-slate-600">yangliu</span>
                      </div>
                      <div className="flex items-center gap-1.5 px-2.5 py-0.5 bg-white rounded-full border border-slate-200/50 shadow-sm">
                        <div className="w-4 h-4 rounded-full bg-blue-600 text-white flex items-center justify-center text-[9px] font-bold">M</div>
                        <span className="text-[12px] text-slate-700">MrZhang</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Node 5: 信息科审批 */}
                <div className="relative flex gap-4">
                  <div className="absolute top-8 left-[11px] bottom-[-24px] w-[2px] bg-slate-200" />
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center relative z-10">
                     <User className="w-3.5 h-3.5" />
                     <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-slate-400 rounded-full border-[2px] border-white flex items-center justify-center">
                       <Clock className="w-2 h-2 text-white" />
                     </div>
                  </div>
                  <div className="flex-1 pb-2">
                    <div className="font-bold text-slate-800 text-[14px]">信息科审批</div>
                    <div className="mt-2.5 flex flex-wrap gap-2">
                      <div className="flex items-center gap-1.5 px-2.5 py-0.5 bg-white rounded-full border border-slate-200/50 shadow-sm">
                        <div className="w-4 h-4 rounded-full bg-slate-300 text-white flex items-center justify-center overflow-hidden"><img src="https://i.pravatar.cc/100?img=12" alt="tianhy" /></div>
                        <span className="text-[12px] text-slate-700">tianhy</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Node 6: 结束 */}
                <div className="relative flex gap-4">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center relative z-10">
                     <Power className="w-3.5 h-3.5" />
                     <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-slate-400 rounded-full border-[2px] border-white flex items-center justify-center">
                       <Clock className="w-2 h-2 text-white" />
                     </div>
                  </div>
                  <div className="flex-1 pb-2">
                    <div className="font-bold text-slate-800 text-[14px] mt-0.5">结束</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }


  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  // Derivative metrics
  // "我的申请" refers to requests where applicant is "科研演示02" (Current user role)
  const myRequests = applications.filter(app => app.applicant === '科研演示02');
  const myRequestsPendingCount = myRequests.filter(app => app.status === 'Pending').length;
  
  // "我的审批" refers to requests that other users submitted (not applicant: 科研演示02) and are pending review
  const reviewsCount = myReviewList.filter(app => app.status === '待审批').length;

  const filteredMyReviews = myReviewList.filter(item => {
    if (reviewDbSource && item.dbName !== reviewDbSource) return false;
    if (reviewStatus && item.status !== reviewStatus) return false;
    if (reviewSearchContent) {
      const q = reviewSearchContent.toLowerCase();
      return (
        item.datasetName.toLowerCase().includes(q) ||
        item.applicant.toLowerCase().includes(q) ||
        item.dept.toLowerCase().includes(q)
      );
    }
    return true;
  });

  // General dashboard metrics
  const totalMyRequests = myRequests.length;
  const approvedMyRequests = myRequests.filter(app => app.status === 'Approved').length;
  const rejectedMyRequests = myRequests.filter(app => app.status === 'Rejected').length;

  // Handles submitting a brand new request
  const handleCreateRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedWfId) {
      triggerToast('请先选择一个审批流程模板');
      return;
    }
    if (!newReason.trim()) {
      triggerToast('请填写申请原由用途');
      return;
    }

    const linkedWf = workflows.find(w => w.id === selectedWfId);
    if (!linkedWf) return;

    const newApp: ApplicationRequest = {
      id: `REQ20260521${Math.floor(100 + Math.random() * 900)}`,
      workflowId: linkedWf.id,
      workflowName: linkedWf.name,
      category: linkedWf.category,
      libraries: linkedWf.formName || '全院科研数据中心',
      subConfigs: linkedWf.subConfigs || '数据中心, 数据检索',
      applicant: '科研演示02',
      reason: newReason,
      status: 'Pending',
      submitTime: new Date().toISOString().replace('T', ' ').slice(0, 16),
      nodesStatus: [
        { name: '提交申请', role: '申请人', status: 'completed', operator: '科研演示02', time: new Date().toISOString().replace('T', ' ').slice(0, 16) },
        { name: '一级审核', role: '科室负责人', status: 'active' },
        { name: '安全判定级审', role: '科研部专家团', status: 'pending' }
      ]
    };

    setApplications(prev => [newApp, ...prev]);
    setShowNewRequestModal(false);
    setSelectedWfId('');
    setNewReason('');
    triggerToast('申请单提交成功！已加入到审批流序列。');
  };

  // Approving/Rejecting a request as an administrator
  const handlePerformApproval = (status: 'Approved' | 'Rejected', comment: string) => {
    if (!selectedAppForAction) return;

    setApplications(prev => prev.map(app => {
      if (app.id === selectedAppForAction.id) {
        // Complete current active node, update overall status
        const updatedNodes = app.nodesStatus.map(n => {
          if (n.status === 'active') {
            return {
              ...n,
              status: status === 'Approved' ? 'completed' : 'rejected' as any,
              operator: '科研演示02',
              time: '2026-05-21 10:18'
            };
          }
          return n;
        });
        return {
          ...app,
          status: status,
          reviewComment: comment || (status === 'Approved' ? '符合合规要求，同意导出/进入该模块' : '安全审批被拒。内容超出立项界定。'),
          nodesStatus: updatedNodes
        };
      }
      return app;
    }));

    setSelectedAppForAction(null);
    triggerToast(status === 'Approved' ? '您已同意该审批申请' : '您已驳回该审批申请');
  };

  // Withdrawal logic
  const handleWithdrawRequest = (id: string) => {
    if (confirm('确定要撤销该项审批申请吗？')) {
      setApplications(prev => prev.map(app => {
        if (app.id === id) {
          return { ...app, status: 'Withdrawn' };
        }
        return app;
      }));
      triggerToast('您已成功撤回此条申请');
    }
  };

  return (
    <div className="flex-1 overflow-y-auto custom-scrollbar relative flex flex-col">
      {/* Toast Alert Box */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 right-8 bg-[#1e293b] text-white text-xs px-4 py-2.5 rounded shadow-xl border border-slate-700 z-50 flex items-center gap-2 font-medium"
          >
            <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {currentView === 'overview' && (
          <motion.div 
            key="overview"
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.15 }}
            className="flex-grow flex flex-col space-y-6"
          >
            {/* Title Block & KPI Stats Dashboard Row */}
            <div className="flex items-start justify-between bg-white/20 p-5 rounded-lg border border-white/40 shadow-sm backdrop-blur-sm">
              <div className="space-y-1">
                <h1 className="text-[22px] font-bold text-slate-800 tracking-tight flex items-center gap-2">
                  <ClipboardCheck className="w-6 h-6 text-blue-600" />
                  <span>审批中心</span>
                </h1>
                <p className="text-slate-500 text-[12px] font-medium leading-relaxed">
                  管理您的数据申请与审批任务，连接科研设计流与科研库应用实体
                </p>
              </div>

              {/* KPI Block */}
              <div className="flex items-center gap-8 pr-2">
                <div className="text-center">
                  <p className="text-2xl font-bold font-mono text-[#2563eb] leading-tight">{totalMyRequests}</p>
                  <span className="text-[11px] text-slate-500 font-semibold tracking-wide">累计申请</span>
                </div>
                <div className="h-8 w-px bg-slate-200" />
                <div className="text-center">
                  <p className="text-2xl font-bold font-mono text-[#10b981] leading-tight">{approvedMyRequests}</p>
                  <span className="text-[11px] text-slate-500 font-semibold tracking-wide">已通过</span>
                </div>
                <div className="h-8 w-px bg-slate-200" />
                <div className="text-center">
                  <p className="text-2xl font-bold font-mono text-[#ef4444] leading-tight">{rejectedMyRequests}</p>
                  <span className="text-[11px] text-slate-500 font-semibold tracking-wide">已驳回</span>
                </div>
              </div>
            </div>

            {/* Quick Action Navigation Grid Panel Cards */}
            <div className="grid grid-cols-2 gap-6">
              {/* Card 1: 我的申请 */}
              <div className="bg-gradient-to-br from-white to-[#f5f9ff] border border-[#e2efff] rounded-xl p-5 shadow-sm relative flex flex-col justify-between group hover:shadow-md transition-all h-[155px]">
                <div className="flex gap-4">
                  {/* Icon Box */}
                  <div className="w-12 h-12 bg-[#ecf4ff] rounded flex items-center justify-center border border-[#d6e8ff] text-blue-600 shrink-0">
                    <FileText className="w-6 h-6" />
                  </div>
                  <div className="space-y-1.5 pt-0.5">
                    <h3 className="font-bold text-[15.5px] text-slate-800 tracking-tight">我的申请</h3>
                    <p className="text-slate-400 text-[11px] font-medium leading-relaxed max-w-[280px]">
                      查看您提交的导出申请和权限申请进度
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-4">
                  <button 
                    onClick={() => setCurrentView('my-applications')}
                    className="text-[12px] font-bold text-blue-600 group-hover:text-blue-700 transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <span>立即进入 &gt;</span>
                  </button>
                  <div className="bg-[#e0efff]/60 text-blue-700 border border-blue-200 text-[11px] font-bold px-2.5 py-0.5 rounded-full">
                    {myRequestsPendingCount} 条进行中
                  </div>
                </div>
              </div>

              {/* Card 2: 我的审批 */}
              <div className="bg-gradient-to-br from-white to-[#fffaf2] border border-[#ffe9d2] rounded-xl p-5 shadow-sm relative flex flex-col justify-between group hover:shadow-md transition-all h-[155px]">
                <div className="flex gap-4">
                  {/* Icon Box */}
                  <div className="w-12 h-12 bg-[#fff5ea] rounded flex items-center justify-center border border-[#ffe5cc] text-amber-600 shrink-0">
                    <ClipboardCheck className="w-6 h-6" />
                  </div>
                  <div className="space-y-1.5 pt-0.5">
                    <h3 className="font-bold text-[15.5px] text-slate-800 tracking-tight">我的审批</h3>
                    <p className="text-slate-400 text-[11px] font-medium leading-relaxed max-w-[280px]">
                      处理来自其他用户的导出和权限审批任务
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-4">
                  <button 
                    onClick={() => setCurrentView('my-approvals')}
                    className="text-[12px] font-bold text-amber-600 group-hover:text-amber-700 transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <span>立即进入 &gt;</span>
                  </button>
                  <div className="bg-[#fff3e4] text-[#d97706] border border-[#ffddb9] text-[11px] font-bold px-2.5 py-0.5 rounded-full">
                    {reviewsCount} 条待处理
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Dynamic Activities feed block */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col flex-1 divide-y divide-slate-100">
              <div className="p-4 bg-slate-50/50 flex items-center justify-between px-6 shrink-0">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-blue-600 animate-spin-slow" />
                  <h2 className="font-bold text-[13px] text-slate-800 tracking-wide">您最近的动态</h2>
                </div>
                <button 
                  onClick={() => setCurrentView('my-applications')}
                  className="text-xs text-slate-400 hover:text-blue-500 font-semibold cursor-pointer"
                >
                  查看全部
                </button>
              </div>

              <div className="flex-1 overflow-y-auto max-h-[380px] divide-y divide-slate-50">
                {applications.slice(0, 3).map((app) => (
                  <div 
                    key={app.id} 
                    onClick={() => setSelectedAppForDetail(app)}
                    className="group px-6 py-4 flex items-center justify-between hover:bg-slate-50/70 transition-all cursor-pointer"
                  >
                    <div className="flex items-center gap-4">
                      {/* Log Round Check Bullet */}
                      <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center border border-slate-200 text-slate-500 group-hover:bg-blue-50 group-hover:border-blue-200 group-hover:text-blue-600 transition-all duration-150">
                        <FileText className="w-4 h-4" />
                      </div>
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="text-[12.5px] font-bold text-slate-800">
                            {app.applicant === '科研演示02' ? '您' : app.applicant}
                          </span>
                          <span className="text-[12px] text-slate-600 font-medium">
                            提交了 {app.category}
                          </span>
                          <span className="text-[11px] text-slate-400 px-1 bg-slate-100 border border-slate-200/60 rounded">
                            {app.workflowName}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 font-medium">
                          {app.libraries} · <span className="font-mono">{app.submitTime}</span>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      {/* Badge status */}
                      {app.status === 'Approved' ? (
                        <span className="text-[11px] bg-emerald-50 text-emerald-600 border border-emerald-200 px-2.5 py-0.5 rounded-full font-bold">
                          审批通过
                        </span>
                      ) : app.status === 'Pending' ? (
                        <span className="text-[11px] bg-amber-50 text-amber-600 border border-amber-200 px-2.5 py-0.5 rounded-full font-bold">
                          待审批
                        </span>
                      ) : app.status === 'Rejected' ? (
                        <span className="text-[11px] bg-red-50 text-red-600 border border-red-200 px-2.5 py-0.5 rounded-full font-bold">
                          已驳回
                        </span>
                      ) : (
                        <span className="text-[11px] bg-slate-100 text-slate-500 border border-slate-200 px-2.5 py-0.5 rounded-full font-bold">
                          已撤回
                        </span>
                      )}
                      <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-slate-400 group-hover:translate-x-0.5 transition-all" />
                    </div>
                  </div>
                ))}

                {applications.length === 0 && (
                  <div className="py-16 text-center text-slate-400 text-xs">
                    暂无任何审批动态
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {currentView === 'my-applications' && (
          <motion.div 
            key="my-applications"
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className="flex-grow flex flex-col space-y-4 bg-slate-50/40 p-6 rounded-lg border border-slate-200 relative min-h-[600px] overflow-hidden"
          >
            {/* Watermark layers */}
            <div className="absolute inset-0 pointer-events-none select-none overflow-hidden z-0">
              <div className="absolute top-[8%] left-[20%] text-slate-400/5 font-mono text-[13px] tracking-widest rotate-[-22deg] font-semibold select-none">test_A 8901</div>
              <div className="absolute top-[10%] left-[55%] text-slate-400/5 font-mono text-[13px] tracking-widest rotate-[-22deg] font-semibold select-none">test_A 8901</div>
              <div className="absolute top-[12%] left-[88%] text-slate-400/5 font-mono text-[13px] tracking-widest rotate-[-22deg] font-semibold select-none">test_A 8901</div>
              <div className="absolute top-[28%] left-[24%] text-slate-400/5 font-mono text-[13px] tracking-widest rotate-[-22deg] font-semibold select-none">test_A 8901</div>
              <div className="absolute top-[32%] left-[39%] text-slate-400/5 font-mono text-[13px] tracking-widest rotate-[-22deg] font-semibold select-none">test_A 8901</div>
              <div className="absolute top-[30%] left-[88%] text-slate-400/5 font-mono text-[13px] tracking-widest rotate-[-22deg] font-semibold select-none">test_A 8901</div>
              <div className="absolute top-[76%] left-[7%] text-slate-400/5 font-mono text-[13px] tracking-widest rotate-[-22deg] font-semibold select-none">test_A 8901</div>
              <div className="absolute top-[75%] left-[23%] text-slate-400/5 font-mono text-[13px] tracking-widest rotate-[-22deg] font-semibold select-none">test_A 8901</div>
              <div className="absolute top-[77%] left-[39%] text-slate-400/5 font-mono text-[13px] tracking-widest rotate-[-22deg] font-semibold select-none">test_A 8901</div>
              <div className="absolute top-[76%] left-[55%] text-slate-400/5 font-mono text-[13px] tracking-widest rotate-[-22deg] font-semibold select-none">test_A 8901</div>
              <div className="absolute top-[78%] left-[72%] text-slate-400/5 font-mono text-[13px] tracking-widest rotate-[-22deg] font-semibold select-none">test_A 8901</div>
              <div className="absolute top-[77%] left-[88%] text-slate-400/5 font-mono text-[13px] tracking-widest rotate-[-22deg] font-semibold select-none">test_A 8901</div>
            </div>

            {/* Title Header with arrow left and text */}
            <div className="flex items-center gap-2.5 z-10 select-none">
              <button 
                onClick={() => setCurrentView('overview')}
                className="p-1 rounded text-slate-700 hover:text-slate-900 hover:bg-slate-200/50 transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-5 h-5 font-bold" />
              </button>
              <h1 className="text-[17px] font-bold text-slate-900 tracking-tight">申请详情</h1>
            </div>

            {/* Custom inner white panel (matches image wrapper card) */}
            <div className="bg-white rounded border border-slate-200/80 shadow-sm p-4 flex flex-col flex-grow z-10 min-h-[500px]">
              
              {/* Tab section */}
              <div className="flex items-center gap-2 mb-4">
                <button 
                  onClick={() => setSelectedApplyTab('permission')}
                  className={`text-xs px-4 py-2 transition-all font-semibold ${
                    selectedApplyTab === 'permission' 
                      ? 'bg-blue-600 text-white rounded' 
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  权限申请
                </button>
                <button 
                  onClick={() => setSelectedApplyTab('export')}
                  className={`text-xs px-4 py-2 transition-all font-semibold ${
                    selectedApplyTab === 'export' 
                      ? 'bg-blue-600 text-white rounded' 
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  导出申请
                </button>
              </div>

              {/* Filtering row controls */}
              <div className="grid grid-cols-[auto_1fr_auto_1fr_auto_1fr_auto] gap-x-2.5 items-center bg-white py-2 px-1 border border-slate-100 rounded mb-4 text-[13px]">
                <span className="text-slate-500 shrink-0 font-medium">数据来源:</span>
                <div className="relative w-full max-w-[180px]">
                  <select 
                    value={exportDbSource}
                    onChange={(e) => setExportDbSource(e.target.value)}
                    className="w-full appearance-none bg-white border border-slate-200 rounded px-2.5 py-1 text-xs text-slate-700 outline-none focus:border-blue-500 cursor-pointer h-[32px]"
                  >
                    <option value="">请选择</option>
                    <option value="通用科研库">通用科研库</option>
                  </select>
                  <ChevronDown className="absolute right-2 top-2.5 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
                </div>

                <span className="text-slate-500 shrink-0 ml-1.5 font-medium">申请内容:</span>
                <div className="relative w-full max-w-[200px]">
                  <Search className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-slate-400" />
                  <input 
                    type="text" 
                    placeholder="请输入"
                    value={exportSearchContent}
                    onChange={(e) => setExportSearchContent(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded pl-8 pr-2 py-1 text-xs text-slate-700 outline-none focus:border-blue-500 h-[32px]"
                  />
                </div>

                <span className="text-slate-500 shrink-0 ml-1.5 font-medium">申请时间:</span>
                <div className="relative w-full max-w-[245px]">
                  <Calendar className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
                  <input 
                    type="text" 
                    placeholder="开始时间 - 结束时间"
                    value={exportTimeRange}
                    onChange={(e) => setExportTimeRange(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded pl-8 pr-2 py-1 text-xs text-slate-500 outline-none focus:border-blue-500 tracking-tight h-[32px]"
                  />
                </div>

                {/* Right button actions (Align perfectly with image) */}
                <div className="flex gap-2 justify-end">
                  <button 
                    onClick={() => {
                      setExportDbSource('');
                      setExportSearchContent('');
                      setExportTimeRange('');
                    }}
                    className="px-4 py-1 border border-slate-200 hover:bg-slate-50 rounded text-slate-600 text-xs font-semibold cursor-pointer transition-colors"
                  >
                    重置
                  </button>
                  <button 
                    className="px-5 py-1 bg-[#2563eb] hover:bg-[#1d4ed8] text-white rounded text-xs font-semibold cursor-pointer shadow-sm transition-colors"
                  >
                    查询
                  </button>
                </div>
              </div>

              {/* Table rendering block */}
              <div className="flex-1 overflow-x-auto min-h-[300px]">
                {selectedApplyTab === 'export' ? (
                  <table className="w-full text-left text-xs border-collapse select-none">
                    <thead>
                      <tr className="border-b border-slate-200/80 bg-slate-50 text-slate-500 font-bold">
                        <th className="py-3 px-3 font-semibold text-slate-500 text-[12px]">序号</th>
                        <th className="py-3 px-3 font-semibold text-slate-500 text-[12px]">科研库</th>
                        <th className="py-3 px-3 font-semibold text-slate-500 text-[12px]">来源</th>
                        <th className="py-3 px-3 font-semibold text-slate-500 text-[12px]">数据集名称</th>
                        <th className="py-3 px-3 font-semibold text-slate-500 text-[12px]">数据量</th>
                        <th className="py-3 px-3 font-semibold text-slate-500 text-[12px]">申请科室</th>
                        <th className="py-3 px-3 font-semibold text-slate-500 text-[12px]">申请人</th>
                        <th className="py-3 px-3 font-semibold text-slate-500 text-[12px]">申请时间</th>
                        <th className="py-3 px-3 font-semibold text-slate-500 text-[12px]">审批状态</th>
                        <th className="py-3 px-3 font-semibold text-slate-500 text-[12px]">审批意见</th>
                        <th className="py-3 px-3 font-semibold text-slate-500 text-[12px]">审批时间</th>
                        <th className="py-3 px-3 font-semibold text-slate-500 text-[12px]">操作</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-[12px] text-slate-700 font-normal">
                      {myExportList
                        .filter(item => !exportDbSource || item.dbName === exportDbSource)
                        .filter(item => {
                          if (!exportSearchContent) return true;
                          return (
                            item.datasetName.includes(exportSearchContent) || 
                            item.source.includes(exportSearchContent) || 
                            item.dataVolume.includes(exportSearchContent)
                          );
                        })
                        .map((item, idx) => (
                          <tr key={item.id} className="hover:bg-slate-50/45 transition-colors">
                            <td className="py-3 px-3 text-slate-600">{idx + 1}</td>
                            <td className="py-3 px-3 text-slate-800">{item.dbName}</td>
                            <td className="py-3 px-3 text-slate-600">{item.source}</td>
                            <td className="py-3 px-3 text-slate-800 font-mono">{item.datasetName}</td>
                            <td className="py-3 px-3 text-slate-600 text-[11px] whitespace-nowrap">{item.dataVolume}</td>
                            <td className="py-3 px-3 text-slate-500">{item.dept}</td>
                            <td className="py-3 px-3 text-slate-800">{item.applicant}</td>
                            <td className="py-3 px-3 text-slate-500 font-mono text-[11.5px]">{item.applyTime}</td>
                            <td className="py-3 px-3">
                              <span className={
                                item.status === '审批通过' ? 'text-slate-800 font-medium' :
                                item.status === '已撤销' ? 'text-slate-400 font-medium' :
                                item.status === '待审批' ? 'text-amber-500 font-medium' : 'text-red-500'
                              }>
                                {item.status}
                              </span>
                            </td>
                            <td className="py-3 px-3 font-mono text-slate-500">{item.opinion}</td>
                            <td className="py-3 px-3 text-slate-500 font-mono text-[11.5px]">{item.approveTime}</td>
                            <td className="py-3 px-3">
                              <div className="flex items-center gap-4">
                                <button 
                                  onClick={() => {
                                    setDetailItem(item);
                                    setCurrentView('export-detail');
                                  }}
                                  className="text-blue-500 hover:text-blue-700 hover:underline cursor-pointer font-medium"
                                >
                                  申请详情
                                </button>
                                <button 
                                  onClick={() => {
                                    if (item.status === '已撤销') {
                                      triggerToast('该申请已在撤销状态');
                                      return;
                                    }
                                    if (confirm('确认要撤销这笔申请吗？')) {
                                      setMyExportList(prev => prev.map(p => p.id === item.id ? { ...p, status: '已撤销', approveTime: '-', opinion: '-' } : p));
                                      triggerToast('申请撤销完成！');
                                    }
                                  }}
                                  disabled={item.status === '已撤销'}
                                  className={`font-medium transition-all ${
                                    item.status === '已撤销' 
                                      ? 'text-slate-300 cursor-not-allowed' 
                                      : 'text-blue-300 hover:text-blue-500 cursor-pointer'
                                  }`}
                                >
                                  撤销
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      {myExportList.length === 0 && (
                        <tr>
                          <td colSpan={12} className="py-12 text-center text-slate-400">
                            暂无对应导出申请记录。
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                ) : (
                  <div className="py-16 text-center text-slate-400 text-xs">
                    <p className="mb-1 font-semibold">权限申请列表暂无数据</p>
                    <p className="opacity-70">支持在 “数据库配置” 管理中申请对应科室或安全级别的科研库使用权限，或切换查看 “导出申请”。</p>
                  </div>
                )}
              </div>

              {/* Standard bottom pagination panel (perfect replication) */}
              <div className="flex items-center justify-end gap-2 text-slate-500 text-xs py-2 mt-4 pt-4 border-t border-slate-150 select-none z-10">
                <span>共1页，{selectedApplyTab === 'export' ? myExportList.length : 0} 条  每页 </span>
                <div className="relative inline-block shrink-0">
                  <select className="appearance-none bg-white border border-slate-200 rounded pl-2.5 pr-6 py-0.5 text-xs text-slate-700 outline-none h-[24px]">
                    <option>50</option>
                    <option>100</option>
                  </select>
                  <ChevronDown className="w-3 h-3 absolute right-1.5 top-1.5 text-slate-400 pointer-events-none" />
                </div>
                <span>条</span>
                <button className="p-1 rounded hover:bg-slate-100 disabled:opacity-20 disabled:cursor-not-allowed" disabled>
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>
                <span className="px-2 py-0.5 bg-blue-600 text-white font-bold rounded text-[11px] min-w-[20px] text-center cursor-default">1</span>
                <button className="p-1 rounded hover:bg-slate-100 disabled:opacity-20 disabled:cursor-not-allowed" disabled>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>
          </motion.div>
        )}

        {currentView === 'my-approvals' && (
          <motion.div 
            key="my-approvals"
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className="flex-grow flex flex-col space-y-4"
          >
            {/* Header section with back button and Title */}
            <div className="flex items-center gap-3 select-none">
              <button 
                onClick={() => setCurrentView('overview')}
                className="p-1 rounded text-slate-705 hover:text-slate-905 hover:bg-slate-200/50 transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-5 h-5 font-bold" />
              </button>
              <h2 className="text-base font-bold text-slate-800 tracking-wide">审批详情</h2>
            </div>

            {/* Custom styled application panels matching image 2 exactly */}
            <div className="bg-slate-50 p-5 rounded-lg border border-slate-200 shadow-sm space-y-4 flex-1 flex flex-col relative min-h-[500px]">
              
              {/* Image 2 Watermarks */}
              <div className="absolute inset-0 pointer-events-none select-none overflow-hidden z-0">
                <div className="absolute top-[8%] left-[20%] text-slate-400/5 font-mono text-[13px] tracking-widest rotate-[-22deg] font-semibold">test_A 8901</div>
                <div className="absolute top-[8%] left-[60%] text-slate-400/5 font-mono text-[13px] tracking-widest rotate-[-22deg] font-semibold">test_A 8901</div>
                <div className="absolute top-[30%] left-[10%] text-slate-400/5 font-mono text-[13px] tracking-widest rotate-[-22deg] font-semibold">test_A 8901</div>
                <div className="absolute top-[30%] left-[45%] text-slate-400/5 font-mono text-[13px] tracking-widest rotate-[-22deg] font-semibold">test_A 8901</div>
                <div className="absolute top-[30%] left-[80%] text-slate-400/5 font-mono text-[13px] tracking-widest rotate-[-22deg] font-semibold">test_A 8901</div>
                <div className="absolute top-[55%] left-[25%] text-slate-400/5 font-mono text-[13px] tracking-widest rotate-[-22deg] font-semibold">test_A 8901</div>
                <div className="absolute top-[55%] left-[70%] text-slate-400/5 font-mono text-[13px] tracking-widest rotate-[-22deg] font-semibold">test_A 8901</div>
                <div className="absolute top-[75%] left-[15%] text-slate-400/5 font-mono text-[13px] tracking-widest rotate-[-22deg] font-semibold">test_A 8901</div>
                <div className="absolute top-[75%] left-[55%] text-slate-400/5 font-mono text-[13px] tracking-widest rotate-[-22deg] font-semibold">test_A 8901</div>
                <div className="absolute top-[90%] left-[40%] text-slate-400/5 font-mono text-[13px] tracking-widest rotate-[-22deg] font-semibold">test_A 8901</div>
                <div className="absolute top-[90%] left-[85%] text-slate-400/5 font-mono text-[13px] tracking-widest rotate-[-22deg] font-semibold">test_A 8901</div>
              </div>

              {/* Tabs with "权限审批" & "导出审批" */}
              <div className="flex items-center gap-2.5 z-10 select-none">
                <button 
                  onClick={() => setSelectedReviewTab('permission')}
                  className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all border ${
                    selectedReviewTab === 'permission'
                      ? 'bg-blue-600 text-white border-blue-600 shadow-sm font-semibold'
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50 font-medium'
                  }`}
                >
                  权限审批
                </button>
                <button 
                  onClick={() => setSelectedReviewTab('export')}
                  className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all border ${
                    selectedReviewTab === 'export'
                      ? 'bg-blue-600 text-white border-blue-600 shadow-sm font-semibold'
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50 font-medium'
                  }`}
                >
                  导出审批
                </button>
              </div>

              {/* Filters Block */}
              <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4 z-10 select-none text-slate-700">
                <div className="flex flex-wrap items-center gap-5 text-xs font-medium">
                  {/* 数据来源 */}
                  <div className="flex items-center gap-2">
                    <span className="text-slate-500 font-semibold">数据来源:</span>
                    <div className="relative">
                      <select 
                        value={reviewDbSource}
                        onChange={(e) => setReviewDbSource(e.target.value)}
                        className="appearance-none bg-white border border-slate-200 rounded px-3 py-1.5 pr-8 text-xs text-slate-800 outline-none w-[130px] font-medium"
                      >
                        <option value="">请选择</option>
                        <option value="通用科研库">通用科研库</option>
                        <option value="公共对照人群库">公共对照人群库</option>
                        <option value="肿瘤免疫多组学科研库">肿瘤免疫多组学科研库</option>
                      </select>
                      <ChevronDown className="w-3.5 h-3.5 absolute right-2 top-2 text-slate-400 pointer-events-none" />
                    </div>
                  </div>

                  {/* 审批状态 */}
                  <div className="flex items-center gap-2">
                    <span className="text-slate-500 font-semibold">审批状态:</span>
                    <div className="relative">
                      <select 
                        value={reviewStatus}
                        onChange={(e) => setReviewStatus(e.target.value)}
                        className="appearance-none bg-white border border-slate-200 rounded px-3 py-1.5 pr-8 text-xs text-slate-800 outline-none w-[130px] font-medium"
                      >
                        <option value="">请选择</option>
                        <option value="待审批">待审批</option>
                        <option value="审批通过">审批通过</option>
                        <option value="已驳回">已驳回</option>
                      </select>
                      <ChevronDown className="w-3.5 h-3.5 absolute right-2 top-2 text-slate-400 pointer-events-none" />
                    </div>
                  </div>

                  {/* 申请时间 */}
                  <div className="flex items-center gap-2">
                    <span className="text-slate-500 font-semibold">申请时间:</span>
                    <div className="relative flex items-center h-[28px] border border-slate-200 rounded bg-white shadow-xs px-2.5">
                      <Calendar className="w-3.5 h-3.5 text-slate-400 mr-2 shrink-0" />
                      <input 
                        type="text" 
                        placeholder="开始时间 - 结束时间" 
                        value={reviewTimeRange}
                        onChange={(e) => setReviewTimeRange(e.target.value)}
                        className="bg-transparent border-none outline-none text-[11px] font-medium text-slate-700 w-[140px]"
                      />
                    </div>
                  </div>

                  {/* 搜索 */}
                  <div className="flex items-center gap-2">
                    <span className="text-slate-500 font-semibold">关键字:</span>
                    <div className="relative flex items-center h-[28px] border border-slate-200 rounded bg-white px-2.5">
                      <Search className="w-3.5 h-3.5 text-slate-400 mr-1.5 shrink-0" />
                      <input 
                        type="text" 
                        placeholder="检索申请人、科室..." 
                        value={reviewSearchContent}
                        onChange={(e) => setReviewSearchContent(e.target.value)}
                        className="bg-transparent border-none outline-none text-[11px] font-medium text-slate-700 w-[130px]"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => {
                      setReviewDbSource('');
                      setReviewStatus('');
                      setReviewTimeRange('');
                      setReviewSearchContent('');
                      triggerToast('筛选条件已重置');
                    }}
                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 border border-slate-250 text-slate-700 rounded text-xs font-semibold shadow-xs transition-colors cursor-pointer flex items-center gap-1"
                  >
                    <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
                    <span>重置</span>
                  </button>
                  <button 
                    onClick={() => {
                      triggerToast('搜索结果加载完成');
                    }}
                    className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-semibold shadow-xs transition-colors cursor-pointer"
                  >
                    查询
                  </button>
                </div>
              </div>

              {/* Grid content conforming to image 2 */}
              <div className="bg-white rounded-lg border border-slate-200 overflow-hidden shadow-xs flex-1 flex flex-col z-10">
                <div className="flex-1 overflow-x-auto min-h-[300px]">
                  <table className="w-full text-left text-[11.5px] border-collapse">
                    <thead className="bg-[#f8fafc] text-slate-700 border-b border-slate-200 font-bold select-none text-[12px]">
                      <tr>
                        <th className="py-3 px-4 w-[50px] text-center">序号</th>
                        <th className="py-3 px-4 w-[115px]">科研库</th>
                        <th className="py-3 px-4 w-[90px]">来源</th>
                        <th className="py-3 px-4">数据集名称</th>
                        <th className="py-3 px-4">数据量</th>
                        <th className="py-3 px-4">申请科室</th>
                        <th className="py-3 px-4 w-[80px]">申请人</th>
                        <th className="py-3 px-4 w-[125px]">申请时间</th>
                        <th className="py-3 px-4 w-[90px]">审批状态</th>
                        <th className="py-3 px-4 w-[100px]">当前节点</th>
                        <th className="py-3 px-4">审批意见</th>
                        <th className="py-3 px-4 w-[125px]">审批时间</th>
                        <th className="py-3 px-4 text-center w-[120px]">操作</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                      {selectedReviewTab === 'permission' ? (
                        <tr>
                          <td colSpan={13} className="py-12 text-center text-slate-400 text-xs font-bold bg-white">
                            暂无权限审批申请
                          </td>
                        </tr>
                      ) : filteredMyReviews.length === 0 ? (
                        <tr>
                          <td colSpan={13} className="py-12 text-center text-slate-400 text-xs font-bold bg-white">
                            未检索到符合条件的导出审批数据
                          </td>
                        </tr>
                      ) : (
                        filteredMyReviews.map((item, index) => (
                          <tr key={item.id} className="hover:bg-slate-50/50 transition-colors bg-white">
                            <td className="py-2.5 px-4 text-center text-slate-500 font-mono">{index + 1}</td>
                            <td className="py-2.5 px-4 text-slate-900">{item.dbName}</td>
                            <td className="py-2.5 px-4 text-slate-600">{item.source}</td>
                            <td className="py-2.5 px-4 text-slate-900 truncate max-w-[130px]" title={item.datasetName}>{item.datasetName}</td>
                            <td className="py-2.5 px-4 text-slate-500 font-medium truncate max-w-[150px]" title={item.dataVolume}>{item.dataVolume}</td>
                            <td className="py-2.5 px-4 text-slate-550 truncate max-w-[130px]" title={item.dept}>{item.dept}</td>
                            <td className="py-2.5 px-4 text-slate-800 font-semibold">{item.applicant}</td>
                            <td className="py-2.5 px-4 text-slate-450 font-mono text-[11px]">{item.applyTime}</td>
                            <td className="py-2.5 px-4 text-slate-600 font-medium">{item.status}</td>
                            <td className="py-2.5 px-4 text-slate-700 font-semibold">{item.currentApprovalNode}</td>
                            <td className="py-2.5 px-4 text-slate-450 truncate max-w-[100px]" title={item.opinion}>{item.opinion}</td>
                            <td className="py-2.5 px-4 text-slate-450 font-mono text-[11px]">{item.approveTime}</td>
                            <td className="py-2.5 px-4" onClick={(e) => e.stopPropagation()}>
                              <div className="flex items-center justify-center gap-3">
                                <button
                                  onClick={() => {
                                    setDetailItem(item);
                                    setCurrentView('export-detail');
                                  }}
                                  className="text-blue-600 hover:text-blue-800 hover:underline cursor-pointer font-bold transition-all text-[11px]"
                                >
                                  审批详情
                                </button>
                                <button
                                  onClick={() => {
                                    if (item.status !== '待审批') {
                                      triggerToast('该申请已审批完毕');
                                      return;
                                    }
                                    setShowApprovalActionModal(item);
                                    setApprovalActionComment('');
                                  }}
                                  className={`text-blue-600 hover:text-blue-800 hover:underline cursor-pointer font-bold transition-all text-[11px] ${
                                    item.status !== '待审批' ? 'opacity-40 hover:no-underline cursor-not-allowed text-slate-400' : ''
                                  }`}
                                >
                                  审批
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Pagination Footing conforming to Image 2 */}
                <div className="bg-slate-50 p-3 flex items-center justify-between text-xs text-slate-500 select-none border-t border-slate-200">
                  <div className="flex items-center gap-1.5">
                    <span>共1页，{selectedReviewTab === 'export' ? filteredMyReviews.length : 0} 条  每页 </span>
                    <div className="relative inline-block shrink-0">
                      <select className="appearance-none bg-white border border-slate-200 rounded pl-2.5 pr-6 py-0.5 text-xs text-slate-700 outline-none h-[24px]">
                        <option>50</option>
                        <option>100</option>
                      </select>
                      <ChevronDown className="w-3 h-3 absolute right-1.5 top-1.5 text-slate-400 pointer-events-none" />
                    </div>
                    <span>条</span>
                  </div>

                  <div className="flex items-center gap-1 font-bold">
                    <button className="p-1 rounded hover:bg-slate-100 disabled:opacity-20 disabled:cursor-not-allowed" disabled>
                      <ChevronLeft className="w-3.5 h-3.5" />
                    </button>
                    <span className="px-2 py-0.5 bg-blue-600 text-white font-bold rounded text-[11px] min-w-[20px] text-center cursor-default">1</span>
                    <button className="p-1 rounded hover:bg-slate-100 disabled:opacity-20 disabled:cursor-not-allowed" disabled>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- MODAL 1: NEW APPLICATION SUBMISSION FORM --- */}
      <AnimatePresence>
        {showNewRequestModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowNewRequestModal(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />
            
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-lg shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden select-none relative z-10 flex flex-col max-h-[90vh]"
            >
              {/* Header */}
              <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                <div className="flex items-center gap-2 text-slate-800">
                  <Plus className="w-4 h-4 text-blue-600" />
                  <h3 className="font-bold text-sm">创建新审批流申请</h3>
                </div>
                <button 
                  onClick={() => setShowNewRequestModal(false)}
                  className="p-1 rounded-full hover:bg-slate-200 transition-colors cursor-pointer text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Body */}
              <form onSubmit={handleCreateRequest} className="p-5 overflow-y-auto space-y-4">
                {/* Flow selection template */}
                <div className="space-y-1.5">
                  <label className="text-[12px] font-bold text-slate-500 uppercase tracking-wide">
                    请选择关联审批流程模板
                  </label>
                  <select 
                    value={selectedWfId}
                    onChange={(e) => setSelectedWfId(e.target.value)}
                    required
                    className="w-full border border-slate-200 rounded px-3 py-2 text-xs outline-none bg-white font-medium"
                  >
                    <option value="">-- 请选择要适配的工作流模板 --</option>
                    {workflows.map(w => (
                      <option key={w.id} value={w.id}>
                        {w.name} ({w.category})
                      </option>
                    ))}
                  </select>
                </div>

                {selectedWfId && (() => {
                  const linkedWf = workflows.find(w => w.id === selectedWfId);
                  if (!linkedWf) return null;
                  return (
                    <motion.div 
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-blue-50/50 rounded border border-blue-100 p-3 space-y-2 text-xs"
                    >
                      <div className="grid grid-cols-2 gap-3 leading-relaxed">
                        <div>
                          <strong className="text-slate-400 block mb-0.5">适配的科研库</strong>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {(linkedWf.formName || '全院科研数据中心').split(',').map((f: string, i: number) => (
                              <span key={i} className="bg-white border border-slate-200 text-slate-700 px-1.5 py-0.5 rounded text-[10px] shadow-xs">
                                {f.trim()}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div>
                          <strong className="text-slate-400 block mb-0.5">下一步模块生效配置</strong>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {((linkedWf as any).subConfigs || '数据中心, 数据检索').split(',').map((c: string, i: number) => (
                              <span key={i} className="bg-emerald-50 text-emerald-700 border border-emerald-100 px-1.5 py-0.5 rounded text-[10px] font-bold">
                                {c.trim()}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })()}

                {/* Purpose and reason statement */}
                <div className="space-y-1.5">
                  <label className="text-[12px] font-bold text-slate-500 uppercase tracking-wide">
                    科研申请理由及数据用途陈述
                  </label>
                  <textarea 
                    value={newReason}
                    onChange={(e) => setNewReason(e.target.value)}
                    required
                    rows={4}
                    placeholder="请输入该项审批的科研合理性原由、涉及病例数据量及课题组立项文号..."
                    className="w-full border border-slate-200 rounded px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium text-slate-800"
                  />
                </div>

                {/* Controls */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
                  <button 
                    type="button"
                    onClick={() => setShowNewRequestModal(false)}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded text-slate-600 text-xs font-semibold cursor-pointer"
                  >
                    取消
                  </button>
                  <button 
                    type="submit"
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-semibold shadow-sm cursor-pointer"
                  >
                    提交审批申请
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* --- MODAL 2: DETAIL VIEWER / TIMELINE PROGRESS TRACE --- */}
      <AnimatePresence>
        {selectedAppForDetail && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedAppForDetail(null)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />
            
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-lg shadow-2xl border border-slate-200 w-full max-w-xl overflow-hidden select-none relative z-10 flex flex-col max-h-[92vh]"
            >
              <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-blue-600" />
                  <span className="text-slate-800 font-bold text-xs font-mono">{selectedAppForDetail.id}</span>
                  <span className="text-slate-400 text-xs font-medium">审批呈批公文</span>
                </div>
                <button 
                  onClick={() => setSelectedAppForDetail(null)}
                  className="p-1 rounded-full hover:bg-slate-200 transition-colors cursor-pointer text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-5 overflow-y-auto space-y-5">
                {/* Row details */}
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-slate-400 block font-medium mb-1">公文名：</span>
                    <strong className="text-slate-800 font-bold max-w-xs block leading-relaxed">{selectedAppForDetail.workflowName}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-medium mb-1">提报单元及申请人：</span>
                    <strong className="text-indigo-950 font-bold block">{selectedAppForDetail.applicant} (科研员)</strong>
                  </div>
                </div>

                <div className="border-t border-slate-100/80 pt-3 grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-slate-400 block font-medium mb-1">适配的科研数据库 (多选)：</span>
                    <div className="flex flex-wrap gap-1 mt-0.5">
                      {selectedAppForDetail.libraries.split(',').map((lib, i) => (
                        <span key={i} className="bg-slate-100 border border-slate-200 rounded px-2 py-0.5 text-[11px] text-slate-700">
                          {lib.trim()}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-medium mb-1">下一步生效配置模块 (多选)：</span>
                    <div className="flex flex-wrap gap-1 mt-0.5">
                      {selectedAppForDetail.subConfigs.split(',').map((cfg, i) => (
                        <span key={i} className="bg-emerald-50 text-emerald-700 border border-emerald-100 px-2 py-0.5 rounded text-[11px]">
                          {cfg.trim()}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Reason description block */}
                <div className="bg-slate-50 border border-slate-100 rounded p-3 text-xs space-y-1">
                  <span className="text-slate-400 font-medium block">科研合理性与数据原由陈述：</span>
                  <p className="text-slate-700 leading-relaxed font-medium whitespace-pre-wrap">
                    {selectedAppForDetail.reason}
                  </p>
                </div>

                {selectedAppForDetail.reviewComment && (
                  <div className="bg-blue-50/40 border border-blue-100/60 rounded p-3 text-xs space-y-1">
                    <span className="text-blue-600 font-bold block">审批决策反馈意见：</span>
                    <p className="text-slate-700 leading-relaxed font-semibold block">
                      {selectedAppForDetail.reviewComment}
                    </p>
                  </div>
                )}

                {/* BPMN-Style Interactive Workflow Nodes Timeline Progress */}
                <div className="space-y-3 pt-2">
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                    BPMN 审批网关流向核对进度条 (链条链式反映)
                  </label>
                  <div className="relative pl-6 space-y-5 border-l border-slate-200 ml-3 py-1 text-xs">
                    {selectedAppForDetail.nodesStatus.map((node, index) => {
                      let iconColor = 'bg-slate-200 border-slate-300 text-slate-500';
                      let labelColor = 'text-slate-400';
                      let badge = null;

                      if (node.status === 'completed') {
                        iconColor = 'bg-emerald-500 border-emerald-500 text-white';
                        labelColor = 'text-slate-800 font-bold';
                        badge = <span className="bg-emerald-50 text-emerald-600 px-1 py-0.1 border border-emerald-100 rounded text-[9px] font-black">完成</span>;
                      } else if (node.status === 'active') {
                        iconColor = 'bg-blue-600 border-blue-600 text-white animate-pulse';
                        labelColor = 'text-blue-700 font-black';
                        badge = <span className="bg-blue-50 text-blue-600 px-1 py-0.1 border border-blue-100 rounded text-[9px] font-black">处理中</span>;
                      } else if (node.status === 'rejected') {
                        iconColor = 'bg-red-500 border-red-500 text-white';
                        labelColor = 'text-red-600 font-bold';
                        badge = <span className="bg-red-50 text-red-600 px-1 py-0.1 border border-red-100 rounded text-[9px] font-black">驳回</span>;
                      }

                      return (
                        <div key={index} className="relative">
                          {/* Dot Circle */}
                          <div className={`absolute -left-[30px] top-0.5 w-[20px] h-[20px] rounded-full border-2 flex items-center justify-center font-bold text-[9px] ${iconColor}`}>
                            {node.status === 'completed' ? <Check className="w-3 h-3 stroke-[3]" /> : (index + 1)}
                          </div>

                          <div className="flex items-start justify-between">
                            <div className="space-y-0.5">
                              <div className="flex items-center gap-2">
                                <span className={labelColor}>{node.name}</span>
                                <span className="text-[10px] text-slate-400 bg-slate-100 px-1 rounded">{node.role}</span>
                                {badge}
                              </div>
                              {node.operator && (
                                <p className="text-[10px] text-slate-500">
                                  审核执行：{node.operator} {node.time && <span className="font-mono text-[9px] bg-slate-50 border px-1 rounded ml-1">{node.time}</span>}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Modal actions close */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-end">
                  <button 
                    onClick={() => setSelectedAppForDetail(null)}
                    className="px-5 py-1.5 bg-slate-800 hover:bg-slate-900 text-white rounded text-xs font-semibold cursor-pointer shadow-sm transition-colors"
                  >
                    返回列表
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* --- MODAL 3: PERFORM ADMINISTRATIVE ACTION OR REMODEL --- */}
      <AnimatePresence>
        {selectedAppForAction && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedAppForAction(null)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />

            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-lg shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden select-none relative z-10 flex flex-col"
            >
              <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                <div className="flex items-center gap-2 font-bold text-xs text-slate-800">
                  <ClipboardCheck className="w-4 h-4 text-amber-600" />
                  <span>批文签署核定：{selectedAppForAction.id}</span>
                </div>
                <button 
                  onClick={() => setSelectedAppForAction(null)}
                  className="p-1 rounded-full hover:bg-slate-200 transition-colors cursor-pointer text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-5 space-y-4 text-xs">
                {/* Summary Context */}
                <div className="bg-slate-50 border rounded p-3 text-slate-700 leading-relaxed font-medium">
                  <p className="mb-2"><strong className="text-slate-400">申请关联模版：</strong>{selectedAppForAction.workflowName}</p>
                  <p className="mb-2"><strong className="text-slate-400">递提申请人：</strong>{selectedAppForAction.applicant}</p>
                  <p className="mb-2"><strong className="text-slate-400">适配的科研数据库：</strong>{selectedAppForAction.libraries}</p>
                  <p className="mb-2"><strong className="text-slate-400">生效出口模块：</strong>{selectedAppForAction.subConfigs}</p>
                  <p><strong className="text-slate-400">理由用途：</strong>{selectedAppForAction.reason}</p>
                </div>

                {/* Input Decision Feedback Note */}
                <div className="space-y-1.5">
                  <label className="text-slate-500 font-bold block bg-slate-100 py-1 px-2 rounded">对公审批审批反馈意见 (字里签发留样)</label>
                  <textarea 
                    id="action-comment"
                    rows={3}
                    placeholder="请写下审批同意或拒绝该项申请、准许数据调用导出的决策合规反馈意见..."
                    className="w-full border border-slate-200 rounded px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium text-slate-800"
                  />
                </div>

                {/* Buttons block */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
                  <button 
                    onClick={() => setSelectedAppForAction(null)}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded font-semibold cursor-pointer"
                  >
                    再行斟酌
                  </button>
                  <button 
                    onClick={() => {
                      const text = (document.getElementById('action-comment') as HTMLTextAreaElement)?.value || '';
                      handlePerformApproval('Rejected', text);
                    }}
                    className="px-4 py-2 bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 rounded font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <ThumbsDown className="w-3.5 h-3.5" />
                    <span>安全驳回</span>
                  </button>
                  <button 
                    onClick={() => {
                      const text = (document.getElementById('action-comment') as HTMLTextAreaElement)?.value || '';
                      handlePerformApproval('Approved', text);
                    }}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <ThumbsUp className="w-3.5 h-3.5" />
                    <span>同意通过</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

        {/* CUSTOM FULL-PAGE EXPORT DETAIL VIEW */}
        {selectedExportDetail && (
          <motion.div 
            key="export-detail-view"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.15 }}
            className="flex-grow flex flex-col space-y-4 bg-slate-50/40 p-6 rounded-lg border border-slate-200 relative min-h-[600px] overflow-hidden"
          >
             <div className="flex items-center gap-2.5 z-10 select-none">
              <button 
                onClick={() => setDetailExportId(null)}
                className="p-1 rounded text-slate-700 hover:text-slate-900 hover:bg-slate-200/50 transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-5 h-5 font-bold" />
              </button>
              <h1 className="text-[17px] font-bold text-slate-900 tracking-tight">{selectedExportDetail.datasetName}</h1>
            </div>

            <div className="bg-white rounded border border-slate-200/80 shadow-sm p-6 flex flex-col flex-grow z-10">
              {/* Header and top info sections remain largely the same, but structural */}
              {/* This replaces lines 1640 - 1800 logic. */}
              
              <h2 className="font-bold text-lg text-slate-800 mb-6">检索信息</h2>
              <div className="grid grid-cols-2 gap-x-8 gap-y-4 text-sm border-b border-slate-100 pb-6 mb-6">
                <div className="flex"><span className="text-slate-500 w-32">数据集名称</span><span className="font-semibold text-slate-900">{selectedExportDetail.datasetName}</span></div>
                <div className="flex"><span className="text-slate-500 w-32">业务用途</span><span className="font-semibold text-slate-900">测试</span></div>
                <div className="flex"><span className="text-slate-500 w-32">申请附件</span><span className="text-blue-600 cursor-pointer hover:underline">查看</span></div>
                <div className="flex"><span className="text-slate-500 w-32">数据量</span><span className="font-semibold text-slate-900">{selectedExportDetail.dataVolume}</span></div>
                <div className="flex"><span className="text-slate-500 w-32">导出人</span><span className="font-semibold text-slate-900">{selectedExportDetail.applicant}</span></div>
                <div className="flex"><span className="text-slate-500 w-32">导出时间</span><span className="font-semibold text-slate-900">{selectedExportDetail.approveTime}</span></div>
                <div className="flex"><span className="text-slate-500 w-32">导出字段</span><span className="text-blue-600 cursor-pointer hover:underline">查看</span></div>
                <div className="flex"><span className="text-slate-500 w-32">有效状态</span><span className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-blue-500" /> {selectedExportDetail.status}</span></div>
                <div className="flex"><span className="text-slate-500 w-32">失败原因</span><span className="font-semibold text-slate-900">-</span></div>
              </div>

              <h2 className="font-bold text-lg text-slate-800 mb-4">数据集预览</h2>
              <div className="border border-slate-200 rounded-lg overflow-hidden text-xs">
                <div className="overflow-x-auto">
                      <table className="w-full text-left whitespace-nowrap">
                        <thead className="bg-slate-50 text-slate-700 border-b border-slate-200">
                          <tr>
                            <th className="p-3">rid</th>
                            <th className="p-3">患者ID</th>
                            <th className="p-3">就诊ID</th>
                            <th className="p-3">诊断名称(ICD10)</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 bg-white">
                          {[1, 2, 3].map((i) => (
                            <tr key={i}>
                              <td className="p-3 font-mono">100{i}</td>
                              <td className="p-3 font-mono">PAT202600{i}</td>
                              <td className="p-3 font-mono">VIS202699{i}</td>
                              <td className="p-3">冠状动脉粥样硬化性...</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                </div>
              </div>
            </div>
          </motion.div>
        )}


      {/* --- EXPORT ACTION SUBMISSION MODAL --- */}
      <AnimatePresence>
        {showApprovalActionModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowApprovalActionModal(null)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />
            
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-lg shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden select-none relative z-10 flex flex-col"
            >
              <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                <div className="flex items-center gap-2 text-slate-800">
                  <ClipboardCheck className="w-4 h-4 text-blue-600" />
                  <h3 className="font-bold text-sm">科研文件导出快速审批</h3>
                </div>
                <button 
                  onClick={() => setShowApprovalActionModal(null)}
                  className="p-1 rounded-full hover:bg-slate-200 transition-colors text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-5 space-y-4 text-xs">
                <div className="bg-blue-50/50 p-3 rounded-md border border-blue-100 space-y-1.5">
                  <p className="text-[11px] text-slate-500 font-semibold">待审数据集及申请信息</p>
                  <div className="grid grid-cols-2 gap-y-1.5 text-[11.5px] font-medium text-slate-700 col-span-2">
                    <div><span className="text-slate-400 font-normal">申请人：</span>{showApprovalActionModal.applicant}</div>
                    <div><span className="text-slate-400 font-normal">来源于：</span>{showApprovalActionModal.source}</div>
                    <div className="col-span-2"><span className="text-slate-400 font-normal">科研库：</span>{showApprovalActionModal.dbName}</div>
                    <div className="col-span-2"><span className="text-slate-400 font-normal">数据量：</span>{showApprovalActionModal.dataVolume}</div>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">
                    审批意见 / 反馈说明:
                  </label>
                  <textarea
                    rows={3}
                    placeholder="请输入审批评语（如：符合出库合规标准，予以放行）"
                    value={approvalActionComment}
                    onChange={(e) => setApprovalActionComment(e.target.value)}
                    className="w-full border border-slate-250 rounded p-2.5 text-xs outline-none focus:border-blue-600 font-medium text-slate-800 focus:ring-1 focus:ring-blue-100 placeholder:text-slate-350"
                  />
                </div>
              </div>

              <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-2.5">
                <button 
                  onClick={() => setShowApprovalActionModal(null)}
                  className="px-3.5 py-1.5 bg-white border border-slate-200 rounded text-xs font-semibold text-slate-600 hover:bg-slate-50 cursor-pointer"
                >
                  取消
                </button>
                <button 
                  onClick={() => {
                    const comment = approvalActionComment.trim() || '不符合合规标准，已被驳回';
                    const timestamp = new Date().toISOString().replace('T', ' ').slice(0, 19);
                    
                    const updated = myReviewList.map(item => {
                      if (item.id === showApprovalActionModal.id) {
                        return {
                          ...item,
                          status: '已驳回',
                          opinion: comment,
                          approveTime: timestamp
                        };
                      }
                      return item;
                    });
                    setMyReviewList(updated);
                    setShowApprovalActionModal(null);
                    setDetailItem(null);
                    setCurrentView('my-approvals');
                    triggerToast(`申请【数据集:${showApprovalActionModal.datasetName}】已被成功驳回`);
                  }}
                  className="px-3.5 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 rounded text-xs font-semibold cursor-pointer"
                >
                  驳回申请
                </button>
                <button 
                  onClick={() => {
                    const comment = approvalActionComment.trim() || '符合出库合规标准，同意导出本数据集';
                    const timestamp = new Date().toISOString().replace('T', ' ').slice(0, 19);

                    const updated = myReviewList.map(item => {
                      if (item.id === showApprovalActionModal.id) {
                        return {
                          ...item,
                          status: '审批通过',
                          opinion: comment,
                          approveTime: timestamp
                        };
                      }
                      return item;
                    });
                    setMyReviewList(updated);
                    setShowApprovalActionModal(null);
                    setDetailItem(null);
                    setCurrentView('my-approvals');
                    triggerToast(`已经同意通过申请并赋权【数据集:${showApprovalActionModal.datasetName}】`);
                  }}
                  className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-semibold cursor-pointer"
                >
                  同意并通过
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

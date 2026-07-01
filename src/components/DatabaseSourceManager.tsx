import React, { useState } from 'react';
import { 
  Database, 
  Users, 
  User, 
  Calendar, 
  FolderLock, 
  Clipboard, 
  Search, 
  Plus, 
  MoreHorizontal, 
  TrendingUp, 
  BookOpen, 
  Building2, 
  Edit2, 
  Trash2, 
  X, 
  AlertCircle, 
  Biohazard,
  Check,
  Download,
  Copy
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { WorkflowDesigner, WorkflowItem } from './WorkflowDesigner';

interface DatabaseSource {
  id: string;
  name: string;
  admins: string[];
  timeSpan: string;
  lastUpdated: string;
  usersCount: number;
  patientsCount: number;
  recordsCount: number;
  isCustomIcon?: boolean; // For JH传染病 custom sparkles
  exportApproval?: boolean;
  approvalType?: 'oa' | 'platform';
  selectedWorkflowId?: string;
  customWorkflows?: Array<{
    id: string;
    name: string;
    version: string;
    modules: string[];
    workflow: WorkflowItem;
  }>;
}

const INITIAL_DATABASES: DatabaseSource[] = [
  {
    id: 'db1',
    name: '通用科研库',
    admins: ['肝胆&肾外科', '陈光俊', '丘绍翔', '谢坤翔', '林谦宏01', '肝胆外科'],
    timeSpan: '2020-01-26 ~ 2026-04-13',
    lastUpdated: '2026-05-21',
    usersCount: 52,
    patientsCount: 12920,
    recordsCount: 392531
  },
  {
    id: 'db2',
    name: '心脏健康',
    admins: ['陆科宏2', '吴汶芮', 'test_qy1', 'lkhc', '陈培均', 'test_A'],
    timeSpan: '2026-01-10 ~ 2026-01-23',
    lastUpdated: '2026-05-21',
    usersCount: 6,
    patientsCount: 3,
    recordsCount: 16
  },
  {
    id: 'db3',
    name: '0312归一',
    admins: ['吴汶芮', 'test_A'],
    timeSpan: '2026-01-10 ~ 2026-01-19',
    lastUpdated: '2026-05-21',
    usersCount: 2,
    patientsCount: 1,
    recordsCount: 3
  },
  {
    id: 'db4',
    name: 'A',
    admins: ['test_A', '高家勇'],
    timeSpan: '2024-01-01 ~ 2026-01-23',
    lastUpdated: '2026-05-21',
    usersCount: 2,
    patientsCount: 30,
    recordsCount: 1401
  },
  {
    id: 'db5',
    name: '0413创建1',
    admins: ['吴汶芮', 'test_A'],
    timeSpan: '2024-01-01 ~ 2025-12-31',
    lastUpdated: '2026-05-21',
    usersCount: 3,
    patientsCount: 754,
    recordsCount: 33528
  },
  {
    id: 'db6',
    name: 'zbk2',
    admins: ['test_A'],
    timeSpan: '2026-01-19 ~ 2026-01-22',
    lastUpdated: '2026-05-21',
    usersCount: 1,
    patientsCount: 1,
    recordsCount: 6
  },
  {
    id: 'db7',
    name: 'zzz',
    admins: ['test_A'],
    timeSpan: '暂无数据周期',
    lastUpdated: '2026-05-21',
    usersCount: 1,
    patientsCount: 0,
    recordsCount: 0
  },
  {
    id: 'db8',
    name: 'ABC',
    admins: ['test_A'],
    timeSpan: '2025-03-01 ~ 2025-03-10',
    lastUpdated: '2026-05-21',
    usersCount: 1,
    patientsCount: 0,
    recordsCount: 0
  },
  {
    id: 'db9',
    name: 'JH传染病',
    admins: ['YS', 'test_B', '朱茜茜', '马金航', 'test_A', '周森', '田会英'],
    timeSpan: '2024-01-01 ~ 2026-04-13',
    lastUpdated: '2026-05-21',
    usersCount: 7,
    patientsCount: 13135,
    recordsCount: 393617,
    isCustomIcon: true
  },
  {
    id: 'db10',
    name: '非传染病专病库',
    admins: ['吴汶芮', '柳结华', 'test_A', '陈志伟', '谢俊豪'],
    timeSpan: '2024-01-01 ~ 2026-01-19',
    lastUpdated: '2026-05-21',
    usersCount: 6,
    patientsCount: 1162,
    recordsCount: 51764
  },
  {
    id: 'db11',
    name: '胃病专病库',
    admins: ['吴汶芮'],
    timeSpan: '2024-01-01 ~ 2025-12-31',
    lastUpdated: '2026-05-21',
    usersCount: 5,
    patientsCount: 264,
    recordsCount: 11314
  },
  {
    id: 'db12',
    name: '心肌炎专病库',
    admins: ['test_B', '吴汶芮', 'test_A'],
    timeSpan: '2024-01-01 ~ 2025-12-31',
    lastUpdated: '2026-05-21',
    usersCount: 4,
    patientsCount: 3180,
    recordsCount: 138624
  }
];

export const DatabaseSourceManager = () => {
  const [databases, setDatabases] = useState<DatabaseSource[]>(INITIAL_DATABASES);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Custom dialogs & dropdown controls
  const [showAddModal, setShowAddModal] = useState(false);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Form values
  const [newDbName, setNewDbName] = useState('');
  const [newDbAdmins, setNewDbAdmins] = useState('');
  const [newDbUsers, setNewDbUsers] = useState<number>(1);
  const [newDbPatients, setNewDbPatients] = useState<number>(0);
  const [newDbRecords, setNewDbRecords] = useState<number>(0);
  const [newDbStartDate, setNewDbStartDate] = useState('2024-01-01');
  const [newDbEndDate, setNewDbEndDate] = useState('2026-05-21');
  const [editingDb, setEditingDb] = useState<DatabaseSource | null>(null);

  // States for dynamic export workflow configuration screen
  const [exportingDb, setExportingDb] = useState<DatabaseSource | null>(null);
  const [exportApproval, setExportApproval] = useState<boolean>(true);
  const [approvalType, setApprovalType] = useState<'oa' | 'platform'>('platform');

  // Completely dynamic user-defined workflows to implement "whatever flows they configure are generated"
  const [customWorkflows, setCustomWorkflows] = useState<Array<{
    id: string;
    name: string;
    version: string;
    modules: string[]; // List of bound active entries
    workflow: WorkflowItem;
  }>>([
    {
      id: 'wf-1',
      name: '基础调阅合规审批流',
      version: 'V1',
      modules: ['数据中心', '数据检索'],
      workflow: {
        id: 'wf_flow_1',
        category: '数据导出',
        name: '基础调阅合规审批流',
        visible: true,
        visibleRange: '全员',
        formName: '通用科研库',
        lastPublish: '2026-05-21',
        version: 'V1'
      }
    },
    {
      id: 'wf-2',
      name: '科研课题安全脱敏流',
      version: 'V2',
      modules: ['患者收藏', '课题'],
      workflow: {
        id: 'wf_flow_2',
        category: '数据导出',
        name: '科研课题安全脱敏流',
        visible: true,
        visibleRange: '全员',
        formName: '通用科研库',
        lastPublish: '2026-05-21',
        version: 'V2'
      }
    }
  ]);

  const [selectedWorkflowId, setSelectedWorkflowId] = useState<string>('wf-1');

  // States for importing/referencing workflow configs from other databases
  const [showReferenceModal, setShowReferenceModal] = useState(false);
  const [referenceSourceDbId, setReferenceSourceDbId] = useState<string>('');
  const [referenceWorkflowIds, setReferenceWorkflowIds] = useState<string[]>([]);
  const [referenceMode, setReferenceMode] = useState<'append' | 'overwrite'>('append');

  const getWorkflowsForDatabase = (db: DatabaseSource) => {
    if (db.customWorkflows) return db.customWorkflows;
    return [
      {
        id: 'wf-1',
        name: '基础调阅合规审批流',
        version: 'V1',
        modules: ['数据中心', '数据检索'],
        workflow: {
          id: 'wf_flow_1',
          category: '数据导出',
          name: '基础调阅合规审批流',
          visible: true,
          visibleRange: '全员',
          formName: db.name,
          lastPublish: '2026-05-21',
          version: 'V1'
        }
      },
      {
        id: 'wf-2',
        name: '科研课题安全脱敏流',
        version: 'V2',
        modules: ['患者收藏', '课题'],
        workflow: {
          id: 'wf_flow_2',
          category: '数据导出',
          name: '科研课题安全脱敏流',
          visible: true,
          visibleRange: '全员',
          formName: db.name,
          lastPublish: '2026-05-21',
          version: 'V2'
        }
      }
    ];
  };

  const handleOpenReferenceModal = () => {
    const others = databases.filter(d => d.id !== exportingDb?.id);
    if (others.length === 0) {
      triggerToast('暂无可引用的其他科研库（当前仅有1个科研库）');
      return;
    }
    const targetDb = others[0];
    setReferenceSourceDbId(targetDb.id);
    const targetWorkflows = getWorkflowsForDatabase(targetDb);
    setReferenceWorkflowIds(targetWorkflows.map(w => w.id));
    setReferenceMode('append');
    setShowReferenceModal(true);
  };

  const handleSourceDatabaseChange = (dbId: string) => {
    setReferenceSourceDbId(dbId);
    const targetDb = databases.find(d => d.id === dbId);
    if (targetDb) {
      const targetWorkflows = getWorkflowsForDatabase(targetDb);
      setReferenceWorkflowIds(targetWorkflows.map(w => w.id));
    }
  };

  const handleConfirmReference = () => {
    if (!exportingDb) return;
    const sourceDb = databases.find(d => d.id === referenceSourceDbId);
    if (!sourceDb) {
      triggerToast('选择的源科研库不存在！');
      return;
    }
    
    const sourceWorkflows = getWorkflowsForDatabase(sourceDb);
    const selectedSourceFlows = sourceWorkflows.filter(w => referenceWorkflowIds.includes(w.id));
    
    if (selectedSourceFlows.length === 0) {
      triggerToast('请至少选择一个要引用的工作流！');
      return;
    }
    
    const clonedFlows = selectedSourceFlows.map((flow, idx) => {
      const newId = `flow_cloned_${Date.now()}_${idx}`;
      return {
        ...flow,
        id: newId,
        name: `${flow.name} (自-${sourceDb.name})`,
        workflow: {
          ...flow.workflow,
          id: `wf_${newId}`,
          name: `${flow.workflow.name} (来自${sourceDb.name})`,
          formName: exportingDb.name
        }
      };
    });
    
    let nextFlows = [];
    if (referenceMode === 'append') {
      nextFlows = [...customWorkflows, ...clonedFlows];
    } else {
      nextFlows = clonedFlows;
    }
    
    setCustomWorkflows(nextFlows);
    setSelectedWorkflowId(clonedFlows[0].id);
    
    setDatabases(prev => prev.map(d => {
      if (d.id === exportingDb.id) {
        return {
          ...d,
          customWorkflows: nextFlows,
          selectedWorkflowId: clonedFlows[0].id
        };
      }
      return d;
    }));
    
    setShowReferenceModal(false);
    triggerToast(`成功引用自【${sourceDb.name}】的 ${clonedFlows.length} 个工作流，并已独立保存！`);
  };

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Derivative general metrics
  const totalSpecialsCount = databases.length;
  const timeSpanDays = 2269; 
  const totalPatients = databases.reduce((sum, d) => sum + d.patientsCount, 0);
  const totalRecords = databases.reduce((sum, d) => sum + d.recordsCount, 0);
  const totalDepartments = 37;
  const totalActiveUsers = 54;

  const handleSearch = () => {
    // Basic search filtering
  };

  const filteredDatabases = databases.filter(db => 
    db.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    db.admins.some(a => a.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleSubmitAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDbName.trim()) {
      triggerToast('请输入专病库名称');
      return;
    }

    if (editingDb) {
      // Editing Mode
      setDatabases(prev => prev.map(db => {
        if (db.id === editingDb.id) {
          return {
            ...db,
            name: newDbName,
            admins: newDbAdmins.split(/[,，]/).map(x => x.trim()).filter(Boolean),
            usersCount: newDbUsers,
            patientsCount: newDbPatients,
            recordsCount: newDbRecords,
            timeSpan: `${newDbStartDate} ~ ${newDbEndDate}`
          };
        }
        return db;
      }));
      triggerToast('专病库配置更新成功');
    } else {
      // Creating Mode
      const newIndex = databases.length + 1;
      const newDb: DatabaseSource = {
        id: `db_custom_${Date.now()}`,
        name: newDbName,
        admins: newDbAdmins.split(/[,，]/).map(x => x.trim()).filter(Boolean),
        timeSpan: `${newDbStartDate} ~ ${newDbEndDate}`,
        lastUpdated: new Date().toISOString().split('T')[0],
        usersCount: newDbUsers,
        patientsCount: newDbPatients,
        recordsCount: newDbRecords,
        isCustomIcon: Math.random() > 0.8
      };
      setDatabases(prev => [...prev, newDb]);
      triggerToast('新增精排专病库成功！');
    }

    // Reset fields
    setShowAddModal(false);
    setEditingDb(null);
    setNewDbName('');
    setNewDbAdmins('');
    setNewDbUsers(1);
    setNewDbPatients(0);
    setNewDbRecords(0);
  };

  const handleStartEdit = (db: DatabaseSource) => {
    setEditingDb(db);
    setNewDbName(db.name);
    setNewDbAdmins(db.admins.join(', '));
    setNewDbUsers(db.usersCount);
    setNewDbPatients(db.patientsCount);
    setNewDbRecords(db.recordsCount);
    if (db.timeSpan && db.timeSpan.includes('~')) {
      const parts = db.timeSpan.split('~');
      setNewDbStartDate(parts[0].trim());
      setNewDbEndDate(parts[1].trim());
    }
    setActiveMenuId(null);
    setShowAddModal(true);
  };

  const handleExportDbConfig = (db: DatabaseSource) => {
    setExportingDb(db);
    setExportApproval(db.exportApproval !== undefined ? db.exportApproval : true);
    setApprovalType(db.approvalType || 'platform');
    
    if (db.customWorkflows) {
      setCustomWorkflows(db.customWorkflows);
      setSelectedWorkflowId(db.selectedWorkflowId || db.customWorkflows[0]?.id || 'wf-1');
    } else {
      // Create a fresh default set for this db so they don't share reference or get reset
      const defaultWorkflows = [
        {
          id: 'wf-1',
          name: '基础调阅合规审批流',
          version: 'V1',
          modules: ['数据中心', '数据检索'],
          workflow: {
            id: 'wf_flow_1',
            category: '数据导出',
            name: '基础调阅合规审批流',
            visible: true,
            visibleRange: '全员',
            formName: db.name || '通用科研库',
            lastPublish: '2026-05-21',
            version: 'V1'
          }
        },
        {
          id: 'wf-2',
          name: '科研课题安全脱敏流',
          version: 'V2',
          modules: ['患者收藏', '课题'],
          workflow: {
            id: 'wf_flow_2',
            category: '数据导出',
            name: '科研课题安全脱敏流',
            visible: true,
            visibleRange: '全员',
            formName: db.name || '通用科研库',
            lastPublish: '2026-05-21',
            version: 'V2'
          }
        }
      ];
      setCustomWorkflows(defaultWorkflows);
      setSelectedWorkflowId(db.selectedWorkflowId || 'wf-1');
    }
    setActiveMenuId(null);
  };

  return (
    <div className="flex-grow flex flex-col space-y-6 overflow-y-auto custom-scrollbar p-1 select-none text-slate-700 relative">
      {/* Intercept to show modern export config panel matching user request screenshot */}
      {exportingDb && (
        <div className="absolute inset-0 bg-slate-50 flex flex-col overflow-y-auto custom-scrollbar z-40 text-slate-700 select-none">
          {/* Top breadcrumb controller */}
          <div className="flex items-center justify-between border-b border-slate-200/80 bg-white px-6 py-4.5 select-none shrink-0">
            <button 
              onClick={() => setExportingDb(null)}
              className="flex items-center gap-2 text-slate-800 hover:text-blue-655 transition-colors cursor-pointer select-none font-bold text-sm bg-transparent border-0"
            >
              <span className="text-base font-bold">←</span>
              <span>导出配置</span>
            </button>
          </div>

          <div className="flex-1 p-6 space-y-6 flex flex-col overflow-y-auto">
            {/* Interactive cards panel conforming exactly to Image 1 layout & typography */}
            <div className="bg-white p-6.5 rounded-2xl border border-slate-200/80 shadow-[0_2px_12px_rgba(0,0,0,0.02)] space-y-6 select-none w-full shrink-0">
              {/* 科研指标库: 通用科研库 Header */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-sm shadow-blue-500/10 shrink-0">
                    <Database className="w-5 h-5" />
                  </div>
                  <span className="font-bold text-slate-800 text-base tracking-tight">
                    {exportingDb.name}
                  </span>
                </div>
              </div>

              {/* 导出审批 Switch */}
              <div className="flex items-center gap-4 py-1.5 select-none">
                <span className="text-slate-500 font-bold text-xs w-20 shrink-0">导出审批：</span>
                <button
                  type="button"
                  onClick={() => setExportApproval(!exportApproval)}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    exportApproval ? 'bg-blue-600' : 'bg-slate-200'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                      exportApproval ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
                <span className="text-xs text-slate-400 font-bold">
                  {exportApproval ? '已启用' : '已关闭'}
                </span>
              </div>

              {/* 审批方式 Card style selection */}
              {exportApproval && (
                <div className="flex items-center gap-4 py-1.5 select-none animate-fade-in">
                  <span className="text-slate-500 font-bold text-xs w-20 shrink-0">审批方式：</span>
                  <div className="flex items-center gap-4">
                    {/* OA审批 Option */}
                    <div
                      onClick={() => setApprovalType('oa')}
                      className={`flex items-center gap-3 px-5 py-3 rounded-xl border-2 cursor-pointer transition-all select-none ${
                        approvalType === 'oa'
                          ? 'border-blue-600 bg-blue-50/10'
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <div className="relative flex items-center justify-center shrink-0">
                        <div className={`w-4 h-4 rounded-full border flex items-center justify-center transition-colors ${
                          approvalType === 'oa' ? 'border-blue-600 bg-blue-600' : 'border-slate-300 bg-white'
                        }`}>
                          {approvalType === 'oa' && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                        </div>
                      </div>
                      <span className={`text-xs ${approvalType === 'oa' ? 'text-slate-900 font-bold' : 'text-slate-600 font-bold'}`}>
                        OA审批
                      </span>
                    </div>

                    {/* 科研平台审批 Option */}
                    <div
                      onClick={() => setApprovalType('platform')}
                      className={`flex items-center gap-3 px-5 py-3 rounded-xl border-2 cursor-pointer transition-all select-none ${
                        approvalType === 'platform'
                          ? 'border-blue-600 bg-blue-50/10'
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <div className="relative flex items-center justify-center shrink-0">
                        <div className={`w-4 h-4 rounded-full border flex items-center justify-center transition-colors ${
                          approvalType === 'platform' ? 'border-blue-600 bg-blue-600' : 'border-slate-300 bg-white'
                        }`}>
                          {approvalType === 'platform' && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                        </div>
                      </div>
                      <span className={`text-xs ${approvalType === 'platform' ? 'text-slate-900 font-bold' : 'text-slate-600 font-bold'}`}>
                        科研平台审批
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Split layout for workflows left-list & right-config */}
            {exportApproval && approvalType === 'platform' && (
              <div className="flex-1 flex gap-6 min-h-[850px] items-stretch select-none">
                {/* Left Column: Workflows Sidebar list */}
                <div className="w-[240px] flex flex-col gap-4 select-none shrink-0">
                  <div className="flex flex-col gap-2.5 max-h-[620px] overflow-y-auto custom-scrollbar pr-1">
                    {customWorkflows.map((item) => {
                      const isActive = selectedWorkflowId === item.id;
                      return (
                        <div
                          key={item.id}
                          onClick={() => setSelectedWorkflowId(item.id)}
                          className={`px-5 py-3.5 rounded-xl text-left cursor-pointer transition-all select-none border shadow-sm relative ${
                            isActive
                              ? 'bg-blue-600 border-blue-600 text-white font-bold text-xs'
                              : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700 hover:text-slate-950 text-xs'
                          }`}
                        >
                          <span className="truncate block pr-2">{item.name}</span>
                        </div>
                      );
                    })}
                  </div>

                  {/* "+ 自定义数据导出审批流" dashed button card */}
                  <div
                    onClick={() => {
                      const newId = `flow_${Date.now()}`;
                      const newIndex = customWorkflows.length + 1;
                      const newName = `自定义数据导出审批流 #${newIndex}`;
                      const newFlowObj = {
                        id: newId,
                        name: newName,
                        version: 'V1',
                        modules: [],
                        workflow: {
                          id: `wf_${newId}`,
                          category: '数据导出',
                          name: `${newName}设计版`,
                          visible: true,
                          visibleRange: '全员',
                          formName: exportingDb.name || '通用科研库',
                          lastPublish: '2026-05-21',
                          version: 'V1'
                        }
                      };
                      const nextFlows = [...customWorkflows, newFlowObj];
                      setCustomWorkflows(nextFlows);
                      setSelectedWorkflowId(newId);
                      
                      // Auto save the new workflow to database list!
                      setDatabases(prev => prev.map(d => {
                        if (d.id === exportingDb.id) {
                          return {
                            ...d,
                            selectedWorkflowId: newId,
                            customWorkflows: nextFlows
                          };
                        }
                        return d;
                      }));
                      triggerToast(`已成功创建并单独保存新工作流【${newName}】！`);
                    }}
                    className="border border-dashed border-blue-500 hover:border-blue-600 bg-white hover:bg-blue-50/20 rounded-xl flex items-center justify-center p-4 gap-2 text-center cursor-pointer transition-all shadow-sm text-blue-600 font-bold text-xs"
                  >
                    <span className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-sm font-bold">+</span>
                    <span>自定义数据导出审批流</span>
                  </div>
                </div>

                {/* Right Column: Workflow Designer Workspace */}
                <div className="flex-1 bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-sm relative flex flex-col min-h-[800px]">
                  <WorkflowDesigner
                    workflow={customWorkflows.find(f => f.id === selectedWorkflowId)?.workflow || customWorkflows[0].workflow}
                    onSave={(updated) => {
                      // Save action
                      setCustomWorkflows(prev => prev.map(flow => {
                        if (flow.id === selectedWorkflowId) {
                          return {
                            ...flow,
                            name: updated.name,
                            workflow: updated
                          };
                        }
                        return flow;
                      }));
                      
                      setDatabases(prev => prev.map(d => {
                        if (d.id === exportingDb.id) {
                          const updatedWorkflows = (d.customWorkflows || customWorkflows).map(flow => {
                            if (flow.id === selectedWorkflowId) {
                              return {
                                ...flow,
                                name: updated.name,
                                workflow: updated
                              };
                            }
                            return flow;
                          });
                          return {
                            ...d,
                            customWorkflows: updatedWorkflows
                          };
                        }
                        return d;
                      }));

                      const targetName = updated.name || '工作流';
                      triggerToast(`【${targetName}】流程配置已保存成功！`);
                    }}
                    onClose={() => setExportingDb(null)}
                    onDelete={() => {
                      if (customWorkflows.length <= 1) {
                        triggerToast('这是最后一个工作流，无法删除！');
                        return;
                      }
                      const remaining = customWorkflows.filter(c => c.id !== selectedWorkflowId);
                      setCustomWorkflows(remaining);
                      setSelectedWorkflowId(remaining[0].id);
                      setDatabases(prev => prev.map(d => {
                        if (d.id === exportingDb.id) {
                          return {
                            ...d,
                            customWorkflows: remaining,
                            selectedWorkflowId: remaining[0].id
                          };
                        }
                        return d;
                      }));
                      triggerToast('工作流已成功删除！');
                    }}
                    onReference={handleOpenReferenceModal}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Toast notifications */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 right-8 bg-[#1e293b] text-white text-xs px-4 py-2.5 rounded shadow-xl border border-slate-700 z-50 flex items-center gap-2 font-medium"
          >
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 🚀 SIX STATS BLOCKS HEADER ROW */}
      <div className="grid grid-cols-6 gap-4 bg-white/40 p-4 rounded-xl border border-white/60 shadow-sm backdrop-blur-sm">
        {/* Core Block 1: 科研专题库 */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-50 border border-blue-100 rounded-lg flex items-center justify-center text-blue-600 shrink-0">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] text-slate-400 font-bold tracking-wider">科研专题库</div>
            <div className="flex items-baseline gap-1.5 leading-none mt-1">
              <span className="text-[20px] font-bold font-mono tracking-tight">{totalSpecialsCount}</span>
              <span className="text-[11px] text-slate-500 font-semibold">个</span>
              <span className="text-[10px] text-emerald-500 flex items-center">↑</span>
            </div>
          </div>
        </div>

        {/* Core Block 2: 数据时间跨度 */}
        <div className="flex items-center gap-3 border-l border-slate-200/60 pl-4">
          <div className="w-10 h-10 bg-blue-50 border border-blue-100 rounded-lg flex items-center justify-center text-blue-650 shrink-0">
            <Calendar className="w-5 h-5 text-blue-500" />
          </div>
          <div>
            <div className="text-[11px] text-slate-400 font-bold tracking-wider">数据时间跨度</div>
            <div className="flex items-baseline gap-1 mt-1 leading-none">
              <span className="text-[20px] font-bold font-mono tracking-tight">2,269</span>
              <span className="text-[11px] text-slate-500 font-semibold">天</span>
            </div>
          </div>
        </div>

        {/* Core Block 3: 患者总数 */}
        <div className="flex items-center gap-3 border-l border-slate-200/60 pl-4">
          <div className="w-10 h-10 bg-blue-50 border border-blue-100 rounded-lg flex items-center justify-center text-blue-600 shrink-0">
            <User className="w-5 h-5 text-blue-500" />
          </div>
          <div>
            <div className="text-[11px] text-slate-400 font-bold tracking-wider">患者总数</div>
            <div className="flex items-baseline gap-1 mt-1 leading-none">
              <span className="text-[20px] font-bold font-mono tracking-tight">{totalPatients.toLocaleString()}</span>
              <span className="text-[11px] text-slate-500 font-semibold">人</span>
            </div>
          </div>
        </div>

        {/* Core Block 4: 病历总数 */}
        <div className="flex items-center gap-3 border-l border-slate-200/60 pl-4">
          <div className="w-10 h-10 bg-blue-50 border border-blue-100 rounded-lg flex items-center justify-center text-blue-650 shrink-0">
            <Clipboard className="w-5 h-5 text-blue-550" />
          </div>
          <div>
            <div className="text-[11px] text-slate-400 font-bold tracking-wider">病历总数</div>
            <div className="flex items-baseline gap-1 mt-1 leading-none">
              <span className="text-[20px] font-bold font-mono tracking-tight">{totalRecords.toLocaleString()}</span>
              <span className="text-[11px] text-slate-500 font-semibold">份</span>
            </div>
          </div>
        </div>

        {/* Core Block 5: 覆盖科室数 */}
        <div className="flex items-center gap-3 border-l border-slate-200/60 pl-4">
          <div className="w-10 h-10 bg-blue-50 border border-blue-100 rounded-lg flex items-center justify-center text-blue-600 shrink-0">
            <Building2 className="w-5 h-5 text-blue-550" />
          </div>
          <div>
            <div className="text-[11px] text-slate-400 font-bold tracking-wider">覆盖科室数</div>
            <div className="flex items-baseline gap-1.5 leading-none mt-1">
              <span className="text-[20px] font-bold font-mono tracking-tight">{totalDepartments}</span>
              <span className="text-[11px] text-slate-500 font-semibold">个</span>
              <span className="text-[10px] text-emerald-500 flex items-center">↑</span>
            </div>
          </div>
        </div>

        {/* Core Block 6: 覆盖用户数 */}
        <div className="flex items-center gap-3 border-l border-slate-200/60 pl-4">
          <div className="w-10 h-10 bg-blue-50 border border-blue-100 rounded-lg flex items-center justify-center text-blue-600 shrink-0">
            <Users className="w-5 h-5 text-blue-550" />
          </div>
          <div>
            <div className="text-[11px] text-slate-400 font-bold tracking-wider">覆盖用户数</div>
            <div className="flex items-baseline gap-1.5 leading-none mt-1">
              <span className="text-[20px] font-bold font-mono tracking-tight">{totalActiveUsers}</span>
              <span className="text-[11px] text-slate-500 font-semibold">个</span>
              <span className="text-[10px] text-emerald-500 flex items-center">↑</span>
            </div>
          </div>
        </div>
      </div>

      {/* 🚀 SEARCH BAR & NEW SPECIAL BUTTON ROW */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 max-w-sm flex-1">
          <div className="relative flex-1">
            <input 
              type="text" 
              placeholder="请输入关键检索..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-slate-300 rounded px-3 py-1.5 text-xs outline-none focus:border-blue-500 placeholder-slate-400 font-medium"
            />
            {searchQuery && (
              <X 
                className="absolute right-2.5 top-2.5 w-3 h-3 text-slate-400 hover:text-slate-600 cursor-pointer" 
                onClick={() => setSearchQuery('')}
              />
            )}
          </div>
          <button 
            onClick={handleSearch}
            className="px-4 py-1.5 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded text-xs font-bold text-slate-700 transition-colors cursor-pointer shrink-0"
          >
            搜索
          </button>
        </div>

        <button 
          onClick={() => { setEditingDb(null); setShowAddModal(true); }}
          className="flex items-center gap-1.5 px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded font-bold text-xs shadow-sm transition-all cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>新增专病库</span>
        </button>
      </div>

      {/* 🚀 GRIDS OF DATABASE SOURCES */}
      <div className="grid grid-cols-4 gap-4 pb-12">
        {filteredDatabases.map((db) => (
          <div 
            key={db.id}
            className="bg-white border border-slate-200/90 rounded-xl overflow-hidden hover:shadow-md transition-all duration-200 relative flex flex-col justify-between"
          >
            {/* Absolute wave graphics background placeholder */}
            <div className="absolute top-0 right-0 left-0 h-16 bg-gradient-to-b from-blue-50/40 via-blue-50/10 to-transparent pointer-events-none" />

            <div className="p-4 space-y-3 flex-1 flex flex-col relative z-10">
              {/* Card Title & Icon Row */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2.5">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border shadow-xs ${
                    db.isCustomIcon 
                      ? 'bg-blue-100 border-blue-200 text-blue-600' 
                      : 'bg-blue-50 border-blue-100 text-blue-500'
                  }`}>
                    {db.isCustomIcon ? (
                      <Biohazard className="w-4 h-4 text-blue-600 animate-pulse" />
                    ) : (
                      <Plus className="w-4 h-4 text-blue-600 font-bold" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-bold text-[14px] text-slate-800 leading-tight tracking-tight">{db.name}</h3>
                    <div className="text-[10px] text-slate-400 mt-0.5 leading-snug">
                      管理员: <span className="text-slate-500 font-medium">{db.admins.join(', ')}</span>
                    </div>
                  </div>
                </div>

                {/* Dropdown Options */}
                <div className="relative">
                  <button 
                    onClick={() => setActiveMenuId(activeMenuId === db.id ? null : db.id)}
                    className="p-1 hover:bg-slate-100 rounded text-slate-400 hover:text-slate-700 cursor-pointer transition-colors"
                  >
                    <MoreHorizontal className="w-4 h-4" />
                  </button>

                  <AnimatePresence>
                    {activeMenuId === db.id && (
                      <>
                        <div className="fixed inset-0 z-30" onClick={() => setActiveMenuId(null)} />
                        <motion.div 
                          initial={{ opacity: 0, scale: 0.95, y: -5 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.95, y: -5 }}
                          className="absolute right-0 top-6 w-24 bg-white border border-slate-200 rounded shadow-lg py-1 z-40 text-xs"
                        >
                          <button 
                            onClick={() => handleStartEdit(db)}
                            className="w-full text-left px-3 py-1.5 hover:bg-slate-50 text-slate-600 flex items-center gap-1.5 font-bold"
                          >
                            <Edit2 className="w-3 h-3 text-slate-400" />
                            <span>编辑</span>
                          </button>
                          <button 
                            onClick={() => handleExportDbConfig(db)}
                            className="w-full text-left px-3 py-1.5 hover:bg-blue-50 text-slate-600 flex items-center gap-1.5 font-bold"
                          >
                            <Download className="w-3 h-3 text-blue-500" />
                            <span>导出配置</span>
                          </button>
                        </motion.div>
                      </>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Time Span Information lines */}
              <div className="space-y-1 bg-slate-50/50 p-2 rounded-lg border border-slate-100/60 text-[11px] leading-tight flex-1 flex flex-col justify-center">
                <div className="flex justify-between items-center text-slate-400">
                  <span>就诊时间跨度</span>
                  <span className="font-mono text-slate-700 font-semibold">{db.timeSpan || '—'}</span>
                </div>
                <div className="flex justify-between items-center text-slate-400">
                  <span>最近更新时间</span>
                  <span className="font-mono text-slate-700 font-semibold">{db.lastUpdated || '—'}</span>
                </div>
              </div>
            </div>

            {/* Bottom Tri-Stats Panel Indicators */}
            <div className="border-t border-slate-150 p-3 px-4 bg-slate-50/30 grid grid-cols-3 gap-1 text-center select-none shrink-0 rounded-b-xl">
              <div>
                <span className="text-[10px] text-slate-400 block font-medium leading-none mb-1">用户数</span>
                <span className="text-[13px] font-extrabold text-slate-800 font-mono leading-none">{db.usersCount.toLocaleString()}</span>
              </div>
              <div className="border-l border-slate-150">
                <span className="text-[10px] text-slate-400 block font-medium leading-none mb-1">患者数</span>
                <span className="text-[13px] font-extrabold text-slate-800 font-mono leading-none">
                  {db.patientsCount ? db.patientsCount.toLocaleString() : '—'}
                </span>
              </div>
              <div className="border-l border-slate-150">
                <span className="text-[10px] text-slate-400 block font-medium leading-none mb-1">病历数</span>
                <span className="text-[13px] font-extrabold text-slate-800 font-mono leading-none">
                  {db.recordsCount ? db.recordsCount.toLocaleString() : '—'}
                </span>
              </div>
            </div>
          </div>
        ))}

        {filteredDatabases.length === 0 && (
          <div className="col-span-4 py-24 text-center text-slate-400 text-xs">
            未发现与搜索词匹配的专病数据库模型
          </div>
        )}
      </div>

      {/* --- ADD / EDIT SPECIAL MODAL SHEET --- */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAddModal(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />

            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden relative z-10 flex flex-col max-h-[92vh]"
            >
              <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                <div className="flex items-center gap-2">
                  <Plus className="w-4 h-4 text-blue-600" />
                  <h3 className="font-bold text-slate-800 text-xs">{editingDb ? '编辑科研专病数据库' : '创建新增专病科研库'}</h3>
                </div>
                <button 
                  onClick={() => setShowAddModal(false)}
                  className="p-1 rounded-full hover:bg-slate-200 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleSubmitAdd} className="p-5 overflow-y-auto space-y-4">
                {/* Form fields */}
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">名称*</label>
                  <input 
                    type="text" 
                    value={newDbName}
                    onChange={(e) => setNewDbName(e.target.value)}
                    placeholder="例如: 慢阻肺公共物理队列科研专病库"
                    className="w-full border border-slate-200 rounded px-2.5 py-1.5 text-xs outline-none focus:border-blue-500 font-semibold"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">平台管理员* (逗号分隔)</label>
                  <input 
                    type="text" 
                    value={newDbAdmins}
                    onChange={(e) => setNewDbAdmins(e.target.value)}
                    placeholder="管理人员，例如: YS,吴汶芮,陈静"
                    className="w-full border border-slate-200 rounded px-2.5 py-1.5 text-xs outline-none focus:border-blue-500 font-semibold"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-400 block">开始周期时间段</label>
                    <input 
                      type="date"
                      value={newDbStartDate}
                      onChange={(e) => setNewDbStartDate(e.target.value)}
                      className="w-full border border-slate-200 rounded px-2.5 py-1 text-xs outline-none focus:border-blue-500 font-mono"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-400 block">截至周期时间段</label>
                    <input 
                      type="date"
                      value={newDbEndDate}
                      onChange={(e) => setNewDbEndDate(e.target.value)}
                      className="w-full border border-slate-200 rounded px-2.5 py-1 text-xs outline-none focus:border-blue-500 font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3 bg-slate-50 p-4 rounded-lg border border-slate-100">
                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-500 font-bold block">用户数</label>
                    <input 
                      type="number"
                      min={0}
                      value={newDbUsers}
                      onChange={(e) => setNewDbUsers(Number(e.target.value))}
                      className="w-full border border-slate-200 rounded px-2 py-1 text-xs text-center outline-none bg-white font-semibold"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-500 font-bold block">患者总数 (人)</label>
                    <input 
                      type="number"
                      min={0}
                      value={newDbPatients}
                      onChange={(e) => setNewDbPatients(Number(e.target.value))}
                      className="w-full border border-slate-200 rounded px-2 py-1 text-xs text-center outline-none bg-white font-semibold"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-500 font-bold block">病历总份数 (份)</label>
                    <input 
                      type="number"
                      min={0}
                      value={newDbRecords}
                      onChange={(e) => setNewDbRecords(Number(e.target.value))}
                      className="w-full border border-slate-200 rounded px-2 py-1 text-xs text-center outline-none bg-white font-semibold"
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2.5">
                  <button 
                    type="button" 
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-1.5 bg-slate-100 hover:bg-slate-200 rounded text-xs font-bold text-slate-600 cursor-pointer"
                  >
                    取消
                  </button>
                  <button 
                    type="submit" 
                    className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-bold shadow-sm cursor-pointer"
                  >
                    {editingDb ? '应用编辑配置' : '确认新增专病库'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* --- REFERENCE OTHER DATABASE WORKFLOW CONFIG MODAL --- */}
      <AnimatePresence>
        {showReferenceModal && exportingDb && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowReferenceModal(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />

            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-xl overflow-hidden relative z-[101] flex flex-col max-h-[90vh]"
            >
              {/* Header */}
              <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50 select-none">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600 shrink-0">
                    <Copy className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-slate-800 text-sm">引用其他科研库工作流配置</h3>
                    <p className="text-[10px] text-slate-400 font-medium">快速导入已有科研库配置成熟的审批流方案</p>
                  </div>
                </div>
                <button 
                  onClick={() => setShowReferenceModal(false)}
                  className="p-1 rounded-full hover:bg-slate-200 text-slate-400 hover:text-slate-600 cursor-pointer border-0 bg-transparent transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Body */}
              <div className="p-6 overflow-y-auto space-y-5 flex-1 text-xs text-slate-700">
                {/* 1. Target Database Selection */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">
                    选择源科研数据库*
                  </label>
                  <select
                    value={referenceSourceDbId}
                    onChange={(e) => handleSourceDatabaseChange(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 font-bold outline-none focus:border-blue-500 focus:bg-white transition-all cursor-pointer"
                  >
                    <option value="" disabled>-- 请选择作为引用源的科研库 --</option>
                    {databases
                      .filter(d => d.id !== exportingDb.id)
                      .map(d => {
                        const count = getWorkflowsForDatabase(d).length;
                        return (
                          <option key={d.id} value={d.id}>
                            {d.name} ({count}个工作流)
                          </option>
                        );
                      })}
                  </select>
                </div>

                {/* 2. Workflows checklist of chosen database */}
                {referenceSourceDbId && (
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">
                      选择要引用的工作流* (可多选)
                    </label>
                    <div className="border border-slate-200 rounded-xl overflow-hidden bg-slate-50/30 max-h-48 overflow-y-auto divide-y divide-slate-100">
                      {getWorkflowsForDatabase(databases.find(d => d.id === referenceSourceDbId)!).map((wf) => {
                        const isChecked = referenceWorkflowIds.includes(wf.id);
                        return (
                          <div 
                            key={wf.id}
                            onClick={() => {
                              if (isChecked) {
                                setReferenceWorkflowIds(prev => prev.filter(id => id !== wf.id));
                              } else {
                                setReferenceWorkflowIds(prev => [...prev, wf.id]);
                              }
                            }}
                            className="flex items-start gap-3 p-3 hover:bg-slate-50 cursor-pointer select-none transition-all"
                          >
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => {}} // handled by parent onClick
                              className="mt-0.5 rounded text-blue-600 focus:ring-blue-500"
                            />
                            <div className="space-y-1 pl-1">
                              <span className="font-bold text-slate-800 text-xs block">{wf.name}</span>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {wf.modules.map(mod => (
                                  <span key={mod} className="text-[9px] bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded font-bold">
                                    {mod}
                                  </span>
                                ))}
                                {wf.modules.length === 0 && (
                                  <span className="text-[9px] text-slate-400 font-medium">未绑定任何模块</span>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* 3. Reference mode choosing */}
                <div className="space-y-2.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">
                    选择导入模式*
                  </label>
                  <div className="grid grid-cols-2 gap-3.5">
                    {/* Append */}
                    <div
                      onClick={() => setReferenceMode('append')}
                      className={`flex flex-col p-3 rounded-xl border-2 cursor-pointer transition-all ${
                        referenceMode === 'append'
                          ? 'border-blue-600 bg-blue-50/10'
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <span className="font-bold text-slate-800 text-xs flex items-center gap-1.5 mb-1 select-none">
                        <span className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${referenceMode === 'append' ? 'border-blue-600' : 'border-slate-300'}`}>
                          {referenceMode === 'append' && <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />}
                        </span>
                        <span>追加并共存</span>
                      </span>
                      <span className="text-[10px] text-slate-400 leading-normal pl-5 font-medium">
                        复制选中审批流并新增至本库，保留当前已设计的全部内容。
                      </span>
                    </div>

                    {/* Overwrite */}
                    <div
                      onClick={() => setReferenceMode('overwrite')}
                      className={`flex flex-col p-3 rounded-xl border-2 cursor-pointer transition-all ${
                        referenceMode === 'overwrite'
                          ? 'border-red-600 bg-red-50/5'
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <span className="font-bold text-slate-800 text-xs flex items-center gap-1.5 mb-1 select-none">
                        <span className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${referenceMode === 'overwrite' ? 'border-red-600' : 'border-slate-300'}`}>
                          {referenceMode === 'overwrite' && <span className="w-1.5 h-1.5 rounded-full bg-red-600" />}
                        </span>
                        <span>覆盖当前配置</span>
                      </span>
                      <span className="text-[10px] text-slate-400 leading-normal pl-5 font-medium">
                        清空当前本库的工作流，完全以选中的目标工作流进行替代。
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-3 shrink-0">
                <button
                  type="button"
                  onClick={() => setShowReferenceModal(false)}
                  className="px-4.5 py-2 bg-white hover:bg-slate-100 text-slate-600 border border-slate-200 rounded-xl text-xs font-bold transition-all cursor-pointer"
                >
                  取消
                </button>
                <button
                  type="button"
                  onClick={handleConfirmReference}
                  disabled={!referenceSourceDbId || referenceWorkflowIds.length === 0}
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed text-white rounded-xl text-xs font-bold shadow-sm transition-all cursor-pointer border-0"
                >
                  确认导入配置
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

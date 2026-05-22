/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Database, 
  FileClock, 
  Settings, 
  Book, 
  ChevronDown, 
  ChevronRight,
  Search,
  RotateCcw,
  Edit2,
  Trash2,
  ChevronLeft,
  User,
  Menu,
  X,
  GitBranch,
  Copy,
  Plus,
  MoreHorizontal,
  FolderTree,
  Eye,
  EyeOff,
  CheckCircle2,
  ClipboardCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { WorkflowDesigner } from './components/WorkflowDesigner';
import { ApprovalCenter } from './components/ApprovalCenter';
import { DatabaseSourceManager } from './components/DatabaseSourceManager';

// --- Types ---
interface MenuItem {
  id: string;
  name: string;
  icon: React.ElementType;
  children?: { id: string, name: string }[];
}

interface DictionaryEntry {
  id: string;
  code: string;
  name: string;
}

interface TableRow {
  index: number;
  code: string;
  name: string;
  isActive: boolean;
}

interface WorkflowItem {
  id: string;
  category: string;
  name: string;
  visible: boolean;
  visibleRange: string;
  formName: string;
  lastPublish: string; // "未发布" or date format
  version: string; // "V1", "V2", etc., or empty
}

// --- Data ---
const MENU_ITEMS: MenuItem[] = [
  { id: 'dashboard', name: '科研驾驶舱', icon: LayoutDashboard },
  { id: 'database', name: '数据库源管理', icon: Database },
  { id: 'logs', name: '日志管理', icon: FileClock },
  { 
    id: 'config', 
    name: '配置管理', 
    icon: Settings,
    children: [
      { id: 'dataset', name: '科研数据集' },
      { id: 'indices', name: '科研指标库' },
      { id: 'base-config', name: '基础配置' },
      { id: 'security', name: '安全配置' },
      { id: 'standard-terms', name: '标准术语库' },
      { id: 'lab-report', name: '检验报告配套' },
      { id: 'dictionary', name: '字典库' },
    ]
  },
  { id: 'workflow', name: '工作流配置', icon: GitBranch },
  { id: 'approval-center', name: '审批中心', icon: ClipboardCheck },
];

const DICTIONARY_LIST: DictionaryEntry[] = [
  { id: '1', code: 'CV02.01.101', name: '身份证件类别代码表' },
  { id: '2', code: 'CV02.01.102', name: '出生(分娩)地点类别代码表' },
  { id: '3', code: 'CV02.01.103', name: '死亡地点类别代码表' },
  { id: '4', code: 'CV02.01.104', name: '传染病患者归属性代码表' },
  { id: '5', code: 'CV02.01.201', name: '血缘关系代码表' },
  { id: '6', code: 'CV02.01.202', name: '传染病患者职业代码表' },
  { id: '7', code: 'CV02.01.203', name: '家庭年人均收入代码表' },
  { id: '8', code: 'CV02.01.204', name: '医疗保险类别代码表' },
  { id: '9', code: 'CV02.01.205', name: '地址类别代码表' },
  { id: '10', code: 'CV02.10.001', name: '家族近亲婚配者与本人关系代码表' },
  { id: '11', code: 'CV02.10.002', name: '妊娠终止方式代码表' },
  { id: '12', code: 'CV02.10.003', name: '分娩方式代码表' },
];

const TABLE_DATA: TableRow[] = [
  { index: 1, code: '01', name: '居民身份证', isActive: true },
  { index: 2, code: '02', name: '居民户口簿', isActive: true },
  { index: 3, code: '03', name: '护照', isActive: true },
  { index: 4, code: '04', name: '军官证', isActive: true },
  { index: 5, code: '05', name: '驾驶证', isActive: true },
  { index: 6, code: '06', name: '港澳居民来往内地通行证', isActive: true },
  { index: 7, code: '07', name: '台湾居民来往内地通行证', isActive: true },
  { index: 8, code: '99', name: '其他法定有效证件', isActive: true },
];

// Seed 22 workflow items to match screenshot and support page pagination beautifully!
const SEED_WORKFLOWS: WorkflowItem[] = [
  { id: 'wf1', category: '数据导出', name: '全院心脑血管患者数据提取审批流', visible: true, visibleRange: '全员', formName: '心血管病专题数据库', lastPublish: '未发布', version: '' },
  { id: 'wf2', category: '样本使用', name: '肿瘤免疫原代细胞提取审批流', visible: true, visibleRange: '全员', formName: '肿瘤免疫多组学科研库', lastPublish: '2025-11-13 13:33:30', version: 'V1' },
  { id: 'wf3', category: '数据查询', name: '骨科随访历史病历查询快速通道', visible: true, visibleRange: '全员', formName: '骨科临床随访科研库', lastPublish: '2025-11-13 10:47:10', version: 'V2' },
  { id: 'wf4', category: '科研项目审查', name: '重点实验室多中心队列提取计划审核', visible: true, visibleRange: '全员', formName: '公共对照人群库', lastPublish: '2025-11-03 13:42:41', version: 'V2' },
  { id: 'wf5', category: '数据导出', name: '基因组学测序原始数据安全导出审批表', visible: true, visibleRange: '全员', formName: '肿瘤免疫多组学科研库', lastPublish: '2025-10-31 14:27:50', version: 'V1' },
  { id: 'wf6', category: '数据导出', name: '中西医结合优势病种科研数据集导出流', visible: true, visibleRange: '演示账号2', formName: '全院科研数据中心', lastPublish: '2025-11-17 09:32:06', version: 'V7' },
  { id: 'wf7', category: '数据查询', name: '心血管急诊随访追踪数据库访问流', visible: true, visibleRange: '全员', formName: '心血管病专题数据库', lastPublish: '2025-10-30 16:11:54', version: 'V2' },
  { id: 'wf8', category: '样本使用', name: '冰冻切片免疫组化样本调拨审批', visible: true, visibleRange: '全员', formName: '肿瘤免疫多组学科研库', lastPublish: '2025-10-30 16:11:29', version: 'V2' },
  { id: 'wf9', category: '数据查询', name: '慢阻肺公共物理队列科研查询通道', visible: true, visibleRange: '全员', formName: '公共对照人群库', lastPublish: '2025-10-30 16:10:39', version: 'V3' },
  { id: 'wf10', category: '科研项目审查', name: '抗肿瘤靶向药临床试验患者筛查审批流程', visible: true, visibleRange: '全员', formName: '肿瘤免疫多组学科研库', lastPublish: '2025-10-30 15:43:50', version: 'V1' },
  { id: 'wf11', category: '数据导出', name: '多中心数据导出规范流程(高保密)', visible: true, visibleRange: '全员', formName: '全院科研数据中心', lastPublish: '2025-10-30 14:49:26', version: 'V3' },
  { id: 'wf12', category: '科研项目审查', name: '分组方案学术委员会联合评审审批流', visible: true, visibleRange: '演示账号2, 小张', formName: '全院科研数据中心', lastPublish: '2025-10-31 16:54:34', version: 'V12' },
  { id: 'wf13', category: '数据导出', name: '血液科化疗敏感性关联 analysis 字段导出流', visible: true, visibleRange: '全员', formName: '肿瘤免疫多组学科研库', lastPublish: '未发布', version: '' },
  { id: 'wf14', category: '样本使用', name: '骨密质病理标本提取测试流程', visible: true, visibleRange: '全员', formName: '骨科临床随访科研库', lastPublish: '2025-10-31 09:55:18', version: 'V2' },
  { id: 'wf15', category: '数据查询', name: '健康对照组影像学数据浏览访问流', visible: true, visibleRange: '全员', formName: '公共对照人群库', lastPublish: '2025-11-13 13:26:58', version: 'V3' },
  { id: 'wf16', category: '数据导出', name: '表单数据导出审批流程_复制', visible: true, visibleRange: '全员', formName: '全院科研数据中心', lastPublish: '未发布', version: '' },
  // Extra rows to reach 22 count for Page 2
  { id: 'wf17', category: '科研项目审查', name: '季度科研资助审批流', visible: true, visibleRange: '科研部主管', formName: '全院科研数据中心', lastPublish: '2025-10-29 11:22:11', version: 'V1' },
  { id: 'wf18', category: '样本使用', name: '国家重点课题骨科研究高级标本审批', visible: true, visibleRange: '仅管理员', formName: '骨科临床随访科研库', lastPublish: '2025-11-01 08:30:00', version: 'V4' },
  { id: 'wf19', category: '数据查询', name: '临床分子检测指标自动查询流', visible: false, visibleRange: '技术支持组', formName: '全院科研数据中心', lastPublish: '未发布', version: '' },
  { id: 'wf20', category: '数据查询', name: '重组病原计算分析资源调用审核单', visible: true, visibleRange: '实验室主任', formName: '公共对照人群库', lastPublish: '2025-11-12 18:20:00', version: 'V2' },
  { id: 'wf21', category: '科研项目审查', name: '学术委员会临床检验对照审查流', visible: true, visibleRange: '学术委员会', formName: '全院科研数据中心', lastPublish: '2025-11-15 15:43:21', version: 'V5' },
  { id: 'wf22', category: '数据查询', name: '临床随访血气指标批量提取审核流程', visible: true, visibleRange: '办公室秘书', formName: '公共对照人群库', lastPublish: '2025-11-18 20:00:10', version: 'V1' },
];

// --- Sidebar Component ---
const Sidebar = ({ activeItem, setActiveItem, expandedMenus, toggleMenu, onSelectTab }: any) => {
  return (
    <div className="w-64 bg-[#0c1b3d] text-white flex flex-col h-full border-r border-slate-700 select-none shrink-0">
      <div className="p-4 flex items-center gap-3 border-b border-indigo-950/40">
        <div className="w-8 h-8 bg-blue-500 rounded flex items-center justify-center">
            <Database className="w-5 h-5 text-white" />
        </div>
        <h1 className="font-bold text-base tracking-tight">科研数据管理平台</h1>
      </div>

      <nav className="flex-1 py-4 overflow-y-auto custom-scrollbar">
        {MENU_ITEMS.map((item) => (
          <div key={item.id} className="mb-1">
            <div 
              onClick={() => {
                if (item.children) {
                  toggleMenu(item.id);
                } else {
                  setActiveItem(item.id);
                  onSelectTab(item.id, item.name);
                }
              }}
              className={`px-4 py-3 flex items-center justify-between cursor-pointer transition-colors hover:bg-white/10 ${
                activeItem === item.id || (item.children && item.children.some(c => c.id === activeItem)) ? 'bg-blue-600/35' : ''
              }`}
            >
              <div className="flex items-center gap-3">
                <item.icon className={`w-5 h-5 ${activeItem === item.id ? 'text-blue-400' : 'opacity-75'}`} />
                <span className={`text-[14px] font-medium ${activeItem === item.id ? 'text-blue-400 font-semibold' : ''}`}>{item.name}</span>
              </div>
              {item.children && (
                expandedMenus.includes(item.id) ? <ChevronDown className="w-4 h-4 opacity-50" /> : <ChevronRight className="w-4 h-4 opacity-50" />
              )}
            </div>

            {item.children && expandedMenus.includes(item.id) && (
              <div className="bg-[#081329]">
                {item.children.map((child) => (
                  <div 
                    key={child.id}
                    onClick={() => {
                      setActiveItem(child.id);
                      onSelectTab(child.id, child.name);
                    }}
                    className={`pl-12 pr-4 py-3 flex items-center justify-between cursor-pointer transition-colors hover:text-blue-400 group ${
                      activeItem === child.id ? 'text-blue-400 font-semibold bg-blue-950/20' : 'text-slate-400'
                    }`}
                  >
                    <span className="text-[13px]">{child.name}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>
    </div>
  );
};

// --- Custom Components ---
const Switch = ({ active, onChange }: { active: boolean, onChange: () => void }) => (
  <div 
    onClick={(e) => {
      e.stopPropagation();
      onChange();
    }}
    className={`w-10 h-5 rounded-full relative cursor-pointer transition-colors duration-200 ease-in-out shrink-0 ${
      active ? 'bg-blue-600' : 'bg-slate-300'
    }`}
  >
    <div className={`absolute top-0.5 transition-all duration-200 ease-in-out ${
      active ? 'left-5.5' : 'left-0.5'
    } bg-white w-4 h-4 rounded-full shadow-sm`} />
  </div>
);

const Modal = ({ isOpen, onClose, title, children }: any) => (
  <AnimatePresence>
    {isOpen && (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        />
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden border border-slate-100"
        >
          <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
            <h3 className="font-bold text-slate-800 text-[15px]">{title}</h3>
            <button onClick={onClose} className="p-1 hover:bg-slate-200 rounded-full transition-colors">
              <X className="w-4 h-4 text-slate-400" />
            </button>
          </div>
          <div className="p-6">
            {children}
          </div>
        </motion.div>
      </div>
    )}
  </AnimatePresence>
);

// --- App Component ---
export default function App() {
  // Navigation & Tabs States
  const [activeItem, setActiveItem] = useState('workflow'); // Start on work flow list by default to match "流程管理" view in image
  const [expandedMenus, setExpandedMenus] = useState(['config']);
  const [tabs, setTabs] = useState([
    { id: 'dictionary', name: '首页', closable: false },
    { id: 'workflow', name: '流程管理', closable: true }
  ]);
  const [activeTab, setActiveTab] = useState('workflow');

  // Dictionary States
  const [activeDictionaryId, setActiveDictionaryId] = useState('1');
  const [searchFilter, setSearchFilter] = useState('');
  const [dictionaries, setDictionaries] = useState<DictionaryEntry[]>(DICTIONARY_LIST);
  const [tableData, setTableData] = useState<Record<string, TableRow[]>>({
    '1': [...TABLE_DATA],
  });

  // Workflow Config States
  const [workflows, setWorkflows] = useState<WorkflowItem[]>(SEED_WORKFLOWS);
  const [designerWf, setDesignerWf] = useState<any | null>(null);
  const [wfFilterCategory, setWfFilterCategory] = useState('');
  const [wfFilterName, setWfFilterName] = useState('');
  const [wfPage, setWfPage] = useState(1);
  const [wfPageSize, setWfPageSize] = useState(20);

  // Common Modal States
  const [modalType, setModalType] = useState<'table' | 'row' | 'import' | 'workflow-form' | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [currentItem, setCurrentItem] = useState<any>(null);

  // Quick tooltips trigger
  const [hoveredWfId, setHoveredWfId] = useState<string | null>(null);

  const toggleMenu = (id: string) => {
    setExpandedMenus(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  // Switch tabs cleanly or create new ones
  const handleSelectTab = (id: string, name: string) => {
    // Map sidebar elements to tabs
    let tabId = id;
    let tabName = name;
    
    // Group all non-workflow config items into "首页" tab to match her workspace design
    if (id === 'approval-center') {
      tabId = 'approval-center';
      tabName = '审批中心';
    } else if (id === 'workflow') {
      tabId = 'workflow';
      tabName = '流程管理';
    } else if (id === 'database') {
      tabId = 'database';
      tabName = '数据库源管理';
    } else {
      tabId = 'dictionary';
      tabName = '首页';
    }

    // Add tab if not exist
    if (!tabs.some(t => t.id === tabId)) {
      setTabs(prev => [...prev, { id: tabId, name: tabName, closable: tabId !== 'dictionary' }]);
    }
    setActiveTab(tabId);
  };

  // --- Dictionary Logic Handlers ---
  const handleAddDictionary = () => {
    setCurrentItem({ code: '', name: '' });
    setIsEditing(false);
    setModalType('table');
  };

  const handleEditDictionary = (item: DictionaryEntry, e: React.MouseEvent) => {
    e.stopPropagation();
    currentItemAndEdit(item, 'table');
  };

  const currentItemAndEdit = (item: any, type: 'table' | 'row' | 'workflow-form') => {
    setCurrentItem(item);
    setIsEditing(true);
    setModalType(type);
  };

  const handleDeleteDictionary = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('确定要删除这个字典表吗？相关的数值范围也将被清除。')) {
      setDictionaries(prev => prev.filter(d => d.id !== id));
      if (activeDictionaryId === id) setActiveDictionaryId(dictionaries[0]?.id || '');
    }
  };

  const saveDictionary = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const code = formData.get('code') as string;
    const name = formData.get('name') as string;

    if (isEditing) {
      setDictionaries(prev => prev.map(d => d.id === currentItem.id ? { ...d, code, name } : d));
    } else {
      const newId = Math.random().toString(36).substr(2, 9);
      setDictionaries(prev => [...prev, { id: newId, code, name }]);
      setTableData(prev => ({ ...prev, [newId]: [] })); 
    }
    setModalType(null);
  };

  // Dictionary values
  const handleAddRow = () => {
    setCurrentItem({ code: '', name: '', isActive: true });
    setIsEditing(false);
    setModalType('row');
  };

  const handleEditRow = (row: TableRow) => {
    setCurrentItem(row);
    setIsEditing(true);
    setModalType('row');
  };

  const handleDeleteRow = (index: number) => {
    if (confirm('确定要删除这行数据吗？')) {
      setTableData(prev => ({
        ...prev,
        [activeDictionaryId]: (prev[activeDictionaryId] || []).filter(r => r.index !== index)
      }));
    }
  };

  const saveRow = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const code = formData.get('code') as string;
    const name = formData.get('name') as string;
    const currentData = tableData[activeDictionaryId] || [];

    if (isEditing) {
      setTableData(prev => ({
        ...prev,
        [activeDictionaryId]: currentData.map(r => r.index === currentItem.index ? { ...r, code, name } : r)
      }));
    } else {
      const nextIndex = currentData.length > 0 ? Math.max(...currentData.map(r => r.index)) + 1 : 1;
      setTableData(prev => ({
        ...prev,
        [activeDictionaryId]: [...currentData, { index: nextIndex, code, name, isActive: true }]
      }));
    }
    setModalType(null);
  };

  const handleImport = () => {
    setModalType('import');
  };

  const executeImport = (e: React.FormEvent) => {
    e.preventDefault();
    const newId = 'import-' + Date.now();
    setDictionaries(prev => [
      { id: newId, code: 'IMP.01.001', name: '导入的数据字典' },
      ...prev
    ]);
    setTableData(prev => ({
        ...prev,
        [newId]: [
            { index: 1, code: '01', name: '导入项A', isActive: true },
            { index: 2, code: '02', name: '导入项B', isActive: true },
        ]
    }));
    setModalType(null);
  };

  // --- Workflow Management Handlers ---
  const handleAddWorkflow = () => {
    const randomIdStr = 'p_' + Math.floor(Math.random() * 1000000) + '304' + Math.floor(Math.random() * 100000);
    const newWf: any = { 
      id: randomIdStr, 
      category: '数据导出', 
      name: '表单数据导出审批流程_复制', 
      visible: true, 
      visibleRange: '全员', 
      formName: '全院科研数据中心', 
      lastPublish: '未发布', 
      version: '' 
    };
    setDesignerWf(newWf);
  };

  const handleEditWorkflow = (item: WorkflowItem) => {
    setDesignerWf(item);
  };

  const handleCopyWorkflow = (item: WorkflowItem) => {
    const copyItem: WorkflowItem = {
      ...item,
      id: 'wf-' + Math.random().toString(36).substr(2, 9),
      name: `${item.name}_复制`,
      lastPublish: '未发布',
      version: ''
    };
    setWorkflows(prev => [copyItem, ...prev]);
  };

  const handleDeleteWorkflow = (id: string) => {
    if (confirm('确定要删除这个流程配置吗？')) {
      setWorkflows(prev => prev.filter(w => w.id !== id));
    }
  };

  const saveWorkflow = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const category = formData.get('category') as string;
    const name = formData.get('name') as string;
    const visibleRange = formData.get('visibleRange') as string;
    const formName = formData.get('formName') as string;
    const visible = formData.get('visible') === 'true';

    if (isEditing) {
      setWorkflows(prev => prev.map(w => w.id === currentItem.id ? { 
        ...w, 
        category, 
        name, 
        visibleRange, 
        formName, 
        visible 
      } : w));
    } else {
      const newId = 'wf-' + Math.random().toString(36).substr(2, 9);
      const newWf: WorkflowItem = {
        id: newId,
        category,
        name,
        visible,
        visibleRange,
        formName,
        lastPublish: '未发布',
        version: ''
      };
      setWorkflows(prev => [newWf, ...prev]);
    }
    setModalType(null);
  };

  // Filter workflows
  const filteredWorkflows = workflows.filter(wf => {
    const matchesCategory = !wfFilterCategory || wf.category.includes(wfFilterCategory);
    const matchesName = !wfFilterName || wf.name.toLowerCase().includes(wfFilterName.toLowerCase());
    return matchesCategory && matchesName;
  });

  // Pagination calculations
  const totalWfRecords = filteredWorkflows.length;
  const totalWfPages = Math.ceil(totalWfRecords / wfPageSize);
  const startWfIndex = (wfPage - 1) * wfPageSize;
  const paginatedWorkflows = filteredWorkflows.slice(startWfIndex, startWfIndex + wfPageSize);

  const currentRows = tableData[activeDictionaryId] || [];

  return (
    <div className="flex h-screen w-full bg-[#f0f4f8] text-slate-800 font-sans overflow-hidden">
      {/* Main Sidebar */}
      <Sidebar 
        activeItem={activeItem} 
        setActiveItem={setActiveItem} 
        expandedMenus={expandedMenus}
        toggleMenu={toggleMenu}
        onSelectTab={handleSelectTab}
      />

      <div className="flex-1 flex flex-col min-w-0 h-full relative">
        {/* Repeating watermark security overlay to exactly match her screenshot environment design beautifully */}
        <div className="absolute inset-x-0 bottom-0 top-14 pointer-events-none opacity-80 watermark-bg z-0" />

        {/* Top Header */}
        <header className="h-14 bg-[#0a1835] text-white flex items-center justify-between px-6 z-10 shrink-0">
            <div className="flex items-center gap-2">
               <span className="text-xs bg-blue-500 text-white font-bold px-1.5 py-0.5 rounded">PRO</span>
               <span className="text-sm font-semibold tracking-wide text-slate-200">系统数据运行监视与控制中心</span>
            </div>
            <div className="flex items-center gap-3 cursor-pointer group">
                <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center border border-slate-700 group-hover:bg-slate-700 transition-colors shadow-sm">
                    <User className="w-4 h-4 text-slate-300" />
                </div>
                <span className="text-sm font-medium text-slate-200">科研演示02</span>
                <Settings className="w-4 h-4 text-slate-400 hover:text-white transition-colors" />
            </div>
        </header>

        {/* Browser Tabs Header Bar */}
        <div className="bg-[#e9eff5] border-b border-slate-300/80 px-4 pt-1.5 flex items-end justify-between select-none z-10 shrink-0">
          <div className="flex gap-1 items-end">
            {tabs.map((tab) => (
              <div 
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setActiveItem(
                    tab.id === 'workflow' 
                      ? 'workflow' 
                      : tab.id === 'approval-center' 
                        ? 'approval-center' 
                        : tab.id === 'database'
                          ? 'database'
                          : 'dictionary'
                  );
                }}
                className={`px-4 py-1.5 rounded-t-md text-[13px] font-medium cursor-pointer transition-all duration-150 flex items-center gap-2 border-t border-x ${
                  activeTab === tab.id 
                    ? 'bg-white text-blue-700 border-slate-300 shadow-[0_-2px_4px_rgba(0,0,0,0.03)] font-semibold' 
                    : 'bg-slate-200/50 text-slate-600 border-transparent hover:bg-slate-200 hover:text-slate-900'
                }`}
              >
                <span>{tab.name}</span>
                {tab.closable && (
                  <X 
                    className="w-3.5 h-3.5 text-slate-400 hover:text-red-500 rounded-full hover:bg-slate-300 p-0.5 transition-all"
                    onClick={(e) => {
                      e.stopPropagation();
                      setTabs(prev => prev.filter(t => t.id !== tab.id));
                      if (activeTab === tab.id) {
                        const remaining = tabs.filter(t => t.id !== tab.id);
                        const fallback = remaining[remaining.length - 1]?.id || 'dictionary';
                        setActiveTab(fallback);
                        setActiveItem(
                          fallback === 'workflow' 
                            ? 'workflow' 
                            : fallback === 'approval-center' 
                              ? 'approval-center' 
                              : fallback === 'database'
                                ? 'database'
                                : 'dictionary'
                        );
                      }
                    }}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="pb-1.5 pr-2">
            <ChevronDown className="w-4 h-4 text-slate-400 hover:text-slate-600 cursor-pointer" />
          </div>
        </div>

        {/* Content View Router Panel */}
        <main className="flex-1 p-4 overflow-hidden flex flex-col z-10">
          <AnimatePresence mode="wait">
            {activeTab === 'workflow' ? (
              designerWf ? (
                <WorkflowDesigner 
                  workflow={designerWf}
                  onSave={(updated) => {
                    if (workflows.some(w => w.id === updated.id || w.id === designerWf.id)) {
                      setWorkflows(prev => prev.map(w => (w.id === updated.id || w.id === designerWf.id) ? { ...w, ...updated } : w));
                    } else {
                      setWorkflows(prev => [updated, ...prev]);
                    }
                    setDesignerWf(null);
                  }}
                  onClose={() => setDesignerWf(null)}
                />
              ) : (
                <motion.div 
                  key="workflow"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                transition={{ duration: 0.15 }}
                className="flex-1 bg-white rounded-lg shadow-sm border border-slate-200 flex flex-col overflow-hidden"
              >
                {/* Visual Title / Action Ribbon */}
                <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                  <div className="flex items-center gap-2">
                    <span className="w-1 h-4 bg-blue-600 rounded" />
                    <h2 className="font-bold text-[15px] text-slate-800">流程列表</h2>
                  </div>
                  <button 
                    onClick={handleAddWorkflow}
                    className="flex items-center gap-1.5 px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded font-medium text-xs shadow-sm transition-all cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>新建流程</span>
                  </button>
                </div>

                {/* Workflow search filtering row styled delicately */}
                <div className="px-6 py-3 border-b border-slate-50 bg-slate-50/10 grid grid-cols-4 gap-4 items-center">
                    <div className="relative">
                       <input 
                         type="text" 
                         placeholder="按审批类型过滤..." 
                         className="w-full bg-white border border-slate-200 rounded px-3 py-1 text-xs outline-none focus:border-blue-500"
                         value={wfFilterCategory}
                         onChange={(e) => { setWfFilterCategory(e.target.value); setWfPage(1); }}
                       />
                       {wfFilterCategory && (
                         <X className="absolute right-2 top-1.5 w-3 h-3 text-slate-400 cursor-pointer hover:text-slate-600" onClick={() => setWfFilterCategory('')} />
                       )}
                    </div>
                    <div className="relative">
                       <input 
                         type="text" 
                         placeholder="按流程名称搜..." 
                         className="w-full bg-white border border-slate-200 rounded px-3 py-1 text-xs outline-none focus:border-blue-500"
                         value={wfFilterName}
                         onChange={(e) => { setWfFilterName(e.target.value); setWfPage(1); }}
                       />
                       {wfFilterName && (
                         <X className="absolute right-2 top-1.5 w-3 h-3 text-slate-400 cursor-pointer hover:text-slate-600" onClick={() => setWfFilterName('')} />
                       )}
                    </div>
                    <div className="text-slate-400 text-xs flex gap-4">
                       <span>匹配数量: <strong className="text-slate-700 font-bold">{totalWfRecords}</strong> 条</span>
                    </div>
                    <div className="flex justify-end">
                       <button 
                         onClick={() => { setWfFilterName(''); setWfFilterCategory(''); setWfPage(1); }}
                         className="flex items-center gap-1 px-3 py-1 border border-slate-200 text-slate-600 hover:bg-slate-50 rounded text-xs transition-colors"
                       >
                         <RotateCcw className="w-3 h-3" /> 重置
                       </button>
                    </div>
                </div>

                {/* Main Data Table */}
                <div className="flex-1 overflow-auto custom-scrollbar relative">
                  <table className="w-full text-left text-xs border-collapse min-w-[900px]">
                    <thead className="sticky top-0 bg-slate-50 text-slate-500 border-b border-slate-100 z-10">
                      <tr>
                        <th className="py-3 px-6 font-semibold">审批类型</th>
                        <th className="py-3 px-4 font-semibold">流程名称</th>
                        <th className="py-3 px-4 font-semibold w-[100px]">是否可见</th>
                        <th className="py-3 px-4 font-semibold">可见范围</th>
                        <th className="py-3 px-4 font-semibold">适配的科研库</th>
                        <th className="py-3 px-4 font-semibold">最后发布</th>
                        <th className="py-3 px-4 font-semibold w-[100px]">流程版本</th>
                        <th className="py-3 px-6 font-semibold text-right w-[180px]">操作</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-700 text-[13px]">
                      {paginatedWorkflows.map((wf) => (
                        <tr 
                          key={wf.id} 
                          className="hover:bg-slate-50/50 transition-colors group relative"
                        >
                          {/* Col 1 */}
                          <td className="py-3.5 px-6 font-medium text-slate-500">{wf.category}</td>
                          
                          {/* Col 2 - with tooltip styled after user's image */}
                          <td className="py-3.5 px-4 relative">
                            <span 
                              onMouseEnter={() => setHoveredWfId(wf.id)}
                              onMouseLeave={() => setHoveredWfId(null)}
                              className="font-medium text-slate-800 hover:text-blue-600 cursor-pointer transition-colors pb-1 border-b border-dashed border-slate-300"
                            >
                              {wf.name}
                            </span>
                            {/* Embedded Easter Egg Hover Tooltip for that gorgeous high-fidelity touch! */}
                            {hoveredWfId === wf.id && (
                              <div className="absolute left-4 -top-8 z-30 bg-slate-900 text-white text-xs px-2.5 py-1.5 rounded shadow-lg flex items-center gap-1.5 whitespace-nowrap pointer-events-none">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 absolute left-2 top-1.5 animate-ping" />
                                <span className="pl-3">{wf.name} 流程有效</span>
                              </div>
                            )}
                          </td>

                          {/* Col 3 */}
                          <td className="py-3.5 px-4">
                            <Switch 
                              active={wf.visible} 
                              onChange={() => {
                                setWorkflows(prev => prev.map(w => w.id === wf.id ? { ...w, visible: !w.visible } : w));
                              }} 
                            />
                          </td>

                          {/* Col 4 */}
                          <td className="py-3.5 px-4 text-slate-500 font-medium">{wf.visibleRange}</td>

                          {/* Col 5 - Adapted Research Libraries and Sub Configs Next Steps (Both Multi-select) */}
                          <td className="py-3.5 px-4">
                            <div className="flex flex-col gap-1.5 py-1">
                              {/* Libraries */}
                              <div className="flex flex-wrap gap-1 max-w-[280px]">
                                {(wf.formName || '全院科研数据中心').split(',').map(s => s.trim()).filter(Boolean).map((lib, i) => (
                                  <span key={i} className="text-[11px] font-medium text-slate-700 bg-slate-100 hover:bg-slate-200/80 px-2 py-0.5 rounded border border-slate-200 transition-colors">
                                    {lib}
                                  </span>
                                ))}
                              </div>
                              {/* Sub Configs */}
                              <div className="flex flex-wrap gap-1 max-w-[280px]">
                                {((wf as any).subConfigs || '数据中心, 数据检索').split(',').map((s: string) => s.trim()).filter(Boolean).map((cfg: string, i: number) => (
                                  <span key={i} className="text-[9px] font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100/75 px-1.5 py-0.2 rounded border border-emerald-100 tracking-wide transition-colors">
                                    {cfg}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </td>

                          {/* Col 6 */}
                          <td className="py-3.5 px-4">
                            {wf.lastPublish === '未发布' ? (
                              <span className="text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded text-xs">未发布</span>
                            ) : (
                              <span className="text-slate-600 font-mono text-xs">{wf.lastPublish}</span>
                            )}
                          </td>

                          {/* Col 7 */}
                          <td className="py-3.5 px-4">
                            {wf.version ? (
                              <span className="text-blue-600 bg-blue-50 px-2 py-0.5 rounded font-bold text-xs">{wf.version}</span>
                            ) : (
                              <span className="text-slate-300 font-light">-</span>
                            )}
                          </td>

                          {/* Col 8 - Exact operations row "编辑 复制 ..." */}
                          <td className="py-3.5 px-6 text-right">
                            <div className="flex items-center justify-end gap-3.5 text-blue-600">
                              <button 
                                onClick={() => handleEditWorkflow(wf)}
                                className="hover:text-blue-800 font-medium cursor-pointer py-1 block"
                              >
                                编辑
                              </button>
                              <button 
                                onClick={() => handleCopyWorkflow(wf)}
                                className="hover:text-blue-800 font-medium cursor-pointer py-1 block"
                              >
                                复制
                              </button>

                              {/* Simple direct deletion action inside secondary list to avoid overly complex state */}
                              <button 
                                onClick={() => handleDeleteWorkflow(wf.id)}
                                className="text-slate-400 hover:text-red-500 rounded p-1 transition-all"
                                title="删除此工作流"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}

                      {paginatedWorkflows.length === 0 && (
                        <tr>
                          <td colSpan={8} className="py-24 text-center text-slate-400 bg-slate-50/20 text-sm">
                            查无匹配的流程配置，点击顶部“新建流程”即可添加一项。
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Pagination Controls exact matches copy layout */}
                <div className="p-4 border-t border-slate-200 flex items-center justify-end gap-5 text-xs text-slate-500 bg-slate-50/20 shrink-0 select-none">
                  <span>共2页, {totalWfRecords} 条 条</span>
                  <div className="flex items-center gap-1.5">
                    <span>每页</span>
                    <select 
                      className="border border-slate-200 rounded px-2 py-0.5 bg-white text-slate-600 outline-none"
                      value={wfPageSize}
                      onChange={(e) => { setWfPageSize(Number(e.target.value)); setWfPage(1); }}
                    >
                      <option value={10}>10 条</option>
                      <option value={20}>20 条</option>
                      <option value={50}>50 条</option>
                    </select>
                  </div>

                  <div className="flex items-center gap-1">
                    <button 
                      onClick={() => setWfPage(p => Math.max(1, p - 1))}
                      disabled={wfPage === 1}
                      className="p-1 rounded border border-slate-200 bg-white hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    
                    {Array.from({ length: totalWfPages }, (_, i) => i + 1).map((p) => (
                      <button
                        key={p}
                        onClick={() => setWfPage(p)}
                        className={`w-7 h-7 flex items-center justify-center rounded text-xs font-semibold ${
                          wfPage === p 
                            ? 'bg-blue-600 text-white shadow-sm' 
                            : 'bg-white border border-slate-200 hover:bg-slate-100 text-slate-600'
                        }`}
                      >
                        {p}
                      </button>
                    ))}

                    <button 
                      onClick={() => setWfPage(p => Math.min(totalWfPages, p + 1))}
                      disabled={wfPage === totalWfPages || totalWfPages === 0}
                      className="p-1 rounded border border-slate-200 bg-white hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
              )
            ) : activeTab === 'approval-center' ? (
              <ApprovalCenter workflows={workflows} />
            ) : activeTab === 'database' ? (
              <DatabaseSourceManager />
            ) : (
              // Original Dictionary Main Editor Window component
              <motion.div 
                key="dictionary"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                transition={{ duration: 0.15 }}
                className="flex-1 bg-white rounded-lg shadow-sm border border-slate-200 flex overflow-hidden"
              >
                {/* Left Dictionary List Sidebar */}
                <div className="w-72 border-r border-slate-100 flex flex-col bg-slate-50/30">
                  <div className="p-3 border-b border-slate-100 space-y-2">
                    <div className="flex items-center justify-between mb-1">
                       <h2 className="text-xs font-bold text-slate-700 px-1 tracking-wide uppercase">字典库列表</h2>
                       <div className="flex gap-1">
                         <button 
                            onClick={handleImport}
                            className="p-1 text-slate-400 hover:text-blue-500 hover:bg-blue-50 rounded transition-all"
                            title="导入字典列表"
                          >
                           <FileClock className="w-4 h-4" />
                         </button>
                         <button 
                            onClick={handleAddDictionary}
                            className="p-1 text-slate-400 hover:text-blue-500 hover:bg-blue-50 rounded transition-all"
                            title="新增字典"
                          >
                           <Book className="w-4 h-4" />
                         </button>
                       </div>
                    </div>
                    <div className="relative">
                      <input 
                        type="text" 
                        placeholder="请输入标准名称" 
                        className="w-full bg-white border border-slate-200 rounded py-1.5 pl-3 pr-8 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                        value={searchFilter}
                        onChange={(e) => setSearchFilter(e.target.value)}
                      />
                      <Search className="absolute right-2.5 top-2.5 w-3.5 h-3.5 text-slate-400" />
                    </div>
                  </div>
                  <div className="flex-1 overflow-y-auto py-1 custom-scrollbar">
                    {dictionaries.filter(d => d.name.includes(searchFilter) || d.code.includes(searchFilter)).map((item) => (
                      <div 
                        key={item.id}
                        onClick={() => setActiveDictionaryId(item.id)}
                        className={`px-4 py-3 cursor-pointer group transition-colors border-l-2 relative ${
                            activeDictionaryId === item.id 
                            ? 'bg-blue-50 border-blue-500 text-blue-700 font-semibold' 
                            : 'border-transparent text-slate-600 hover:bg-slate-100/60'
                        }`}
                      >
                        <div className="flex justify-between items-start">
                            <div className="flex-1 overflow-hidden">
                                <div className="text-[11px] font-mono opacity-60 mb-0.5 truncate">{item.code}</div>
                                <div className="text-[13px] leading-tight truncate pr-4">{item.name}</div>
                            </div>
                            <div className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-inherit pl-1 flex gap-1 z-20">
                                <button 
                                    onClick={(e) => handleEditDictionary(item, e)}
                                    className="p-1 text-slate-400 hover:text-blue-500 rounded bg-white border border-slate-200/50 shadow-sm"
                                >
                                    <Edit2 className="w-3 h-3" />
                                </button>
                                <button 
                                    onClick={(e) => handleDeleteDictionary(item.id, e)}
                                    className="p-1 text-slate-400 hover:text-red-500 rounded bg-white border border-slate-200/50 shadow-sm"
                                >
                                    <Trash2 className="w-3 h-3" />
                                </button>
                            </div>
                        </div>
                      </div>
                    ))}
                    {dictionaries.length === 0 && (
                      <div className="p-8 text-center text-slate-400 text-xs">暂无可用字典表</div>
                    )}
                  </div>
                </div>

                {/* Right Value Ranges and Codes Grid Panel */}
                <div className="flex-1 flex flex-col overflow-hidden">
                  {/* Values Filter Inputs */}
                  <div className="p-4 border-b border-slate-100 grid grid-cols-[1fr_1fr_1fr_auto] gap-6 items-end content-start">
                    <div className="space-y-1.5">
                      <label className="text-[11px] text-slate-500 font-medium uppercase tracking-wider ml-1">字典值域名称</label>
                      <input type="text" placeholder="请输入值域名关键字" className="w-full border border-slate-200 rounded px-2.5 py-1.5 text-xs outline-none focus:border-blue-500 bg-white" />
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-[11px] text-slate-500 font-medium uppercase tracking-wider ml-1">字典值域代码</label>
                        <input type="text" placeholder="请输入关联代码值" className="w-full border border-slate-200 rounded px-2.5 py-1.5 text-xs outline-none focus:border-blue-500 bg-white" />
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-[11px] text-slate-500 font-medium uppercase tracking-wider ml-1">状态</label>
                        <div className="relative">
                            <select className="w-full appearance-none border border-slate-200 rounded px-2.5 py-1.5 text-xs outline-none focus:border-blue-500 bg-white">
                                <option>请选择过滤状态</option>
                                <option>启用</option>
                                <option>停用</option>
                            </select>
                            <ChevronDown className="absolute right-2 top-2.5 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <button className="flex items-center gap-1 px-3 py-1.5 border border-slate-200 rounded text-slate-600 text-xs hover:bg-slate-50 transition-colors">
                            <RotateCcw className="w-3.5 h-3.5" /> 重置
                        </button>
                        <button className="px-4 py-1.5 bg-blue-600 text-white rounded text-xs hover:bg-blue-700 transition-colors shadow-sm">
                            查询
                        </button>
                    </div>
                  </div>

                  {/* Range Value Controls Ribbon */}
                  <div className="p-3 px-6 flex justify-between items-center border-b border-slate-100 bg-slate-50/50">
                      <div className="text-xs font-bold text-slate-700">
                        分项值域 {dictionaries.find(d => d.id === activeDictionaryId)?.name ? ` - ${dictionaries.find(d => d.id === activeDictionaryId)?.name}` : ''}
                      </div>
                      <div className="flex gap-2">
                          <button 
                             onClick={handleAddRow}
                             className="flex items-center gap-1 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 border border-blue-100 rounded text-xs font-bold transition-all shrink-0 cursor-pointer"
                          >
                             <Plus className="w-3.5 h-3.5" /> 新增项值域
                          </button>
                          <button className="p-1.5 text-slate-400 hover:text-slate-600 transition-colors rounded hover:bg-white border border-transparent hover:border-slate-200 shrink-0">
                            <Settings className="w-4 h-4" />
                          </button>
                      </div>
                  </div>

                  {/* Main Value Codes List table view */}
                  <div className="flex-1 overflow-auto relative custom-scrollbar">
                    <table className="w-full text-left text-xs border-collapse min-w-[700px]">
                      <thead className="sticky top-0 bg-slate-50 text-slate-500 border-b border-slate-100 z-10">
                        <tr>
                          <th className="py-2.5 px-6 font-semibold w-[80px]">序号</th>
                          <th className="py-2.5 px-4 font-semibold">值域代码</th>
                          <th className="py-2.5 px-4 font-semibold">值域名称</th>
                          <th className="py-2.5 px-4 font-semibold w-[120px]">是否使用</th>
                          <th className="py-2.5 px-6 font-semibold text-right">操作</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-slate-700 text-[13px]">
                        {currentRows.map((row) => (
                          <tr key={row.index} className="hover:bg-slate-50/50 transition-colors">
                            <td className="py-3 px-6 text-slate-500 font-medium">{row.index}</td>
                            <td className="py-3 px-4 font-mono font-medium text-slate-800">{row.code}</td>
                            <td className="py-3 px-4 text-slate-700 font-medium">{row.name}</td>
                            <td className="py-3 px-4">
                              <Switch 
                                active={row.isActive} 
                                onChange={() => {
                                  setTableData(prev => ({
                                      ...prev,
                                      [activeDictionaryId]: currentRows.map(r => r.index === row.index ? { ...r, isActive: !r.isActive } : r)
                                  }))
                                }} 
                              />
                            </td>
                            <td className="py-3 px-6 text-right">
                              <div className="flex justify-end items-center gap-4 text-blue-600">
                                <button onClick={() => handleEditRow(row)} className="hover:text-blue-800 font-medium transition-colors cursor-pointer">编辑</button>
                                <button onClick={() => handleDeleteRow(row.index)} className="hover:text-blue-800 font-medium transition-colors cursor-pointer">删除</button>
                              </div>
                            </td>
                          </tr>
                        ))}
                        {currentRows.length === 0 && (
                            <tr>
                                <td colSpan={5} className="py-24 text-center text-slate-400 bg-slate-50/10">
                                    暂无可用值域项，选取左侧字典大类或点击 “新增项值域” 启动。
                                </td>
                            </tr>
                        )}
                      </tbody>
                    </table>
                  </div>

                  {/* Simple pagination spacer */}
                  <div className="p-4 border-t border-slate-200 flex items-center justify-end gap-4 text-xs text-slate-500 bg-slate-50/20 shrink-0">
                      <span>共 1 页, {currentRows.length} 条</span>
                      <div className="flex items-center gap-1.5 ml-4">
                        <button className="p-1 rounded border border-slate-200 bg-white disabled:opacity-30 disabled:cursor-not-allowed" disabled>
                            <ChevronLeft className="w-4 h-4" />
                        </button>
                        <button className="w-6 h-6 flex items-center justify-center rounded bg-blue-600 text-white font-semibold">
                            1
                        </button>
                        <button className="p-1 rounded border border-slate-200 bg-white disabled:opacity-30 disabled:cursor-not-allowed" disabled>
                            <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>

      {/* --- Dialog / Slide Modal Controls --- */}

      {/* Dictionary Modal form */}
      <Modal 
        isOpen={modalType === 'table'} 
        onClose={() => setModalType(null)}
        title={isEditing ? '编辑数据字典分类' : '新建数据字典分类'}
      >
        <form onSubmit={saveDictionary} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">字典分类代码</label>
            <input 
              name="code"
              defaultValue={currentItem?.code}
              required
              className="w-full border border-slate-200 rounded px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-mono"
              placeholder="如: CV02.01.101"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">字典名称</label>
            <input 
              name="name"
              defaultValue={currentItem?.name}
              required
              className="w-full border border-slate-200 rounded px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              placeholder="请输入清晰的词典表层名称"
            />
          </div>
          <div className="pt-4 flex justify-end gap-2.5">
            <button type="button" onClick={() => setModalType(null)} className="px-4 py-2 border border-slate-200 text-slate-600 hover:bg-slate-50 font-medium rounded text-xs transition-colors">取消</button>
            <button type="submit" className="px-5 py-2 bg-blue-600 text-white font-semibold rounded text-xs hover:bg-blue-700 shadow shadow-blue-500/10 transition-colors">确认保存</button>
          </div>
        </form>
      </Modal>

      {/* Value Range Item Modal form */}
      <Modal 
        isOpen={modalType === 'row'} 
        onClose={() => setModalType(null)}
        title={isEditing ? '编辑字典项值' : '新增字典项值'}
      >
        <form onSubmit={saveRow} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">选项值域代码</label>
            <input 
              name="code"
              defaultValue={currentItem?.code}
              required
              className="w-full border border-slate-200 rounded px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-mono"
              placeholder="如: 01"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">项名标签 / 值域名称</label>
            <input 
              name="name"
              defaultValue={currentItem?.name}
              required
              className="w-full border border-slate-200 rounded px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              placeholder="输入标签名, 如 居民身份证"
            />
          </div>
          <div className="pt-4 flex justify-end gap-2.5">
            <button type="button" onClick={() => setModalType(null)} className="px-4 py-2 border border-slate-200 text-slate-600 hover:bg-slate-50 font-medium rounded text-xs transition-colors">取消</button>
            <button type="submit" className="px-5 py-2 bg-blue-600 text-white font-semibold rounded text-xs hover:bg-blue-700 shadow shadow-blue-500/10 transition-all">确认保存</button>
          </div>
        </form>
      </Modal>

      {/* Import File Dialog form */}
      <Modal 
        isOpen={modalType === 'import'} 
        onClose={() => setModalType(null)}
        title="批量快速检索与字典库导入"
      >
        <form onSubmit={executeImport} className="space-y-6">
          <div className="border-2 border-dashed border-slate-200 rounded-xl p-8 text-center bg-slate-50 hover:bg-blue-50 hover:border-blue-200 transition-all cursor-pointer">
             <FileClock className="w-10 h-10 text-slate-400 mx-auto mb-3" />
             <p className="text-slate-600 font-medium text-xs">点击或拖曳数据结构文件到此处</p>
             <p className="text-slate-400 text-[11px] mt-1">支持标准 .xls, .xlsx 格式文件字典结构定义</p>
          </div>
          <div className="pt-2 flex justify-end gap-2.5">
            <button type="button" onClick={() => setModalType(null)} className="px-4 py-2 border border-slate-200 text-slate-600 hover:bg-slate-50 font-medium rounded text-xs transition-colors">取消</button>
            <button type="submit" className="px-5 py-2 bg-blue-600 text-white font-semibold rounded text-xs hover:bg-blue-700 shadow transition-colors">导入该表组</button>
          </div>
        </form>
      </Modal>

      {/* Dynamic Workflow Configuration Modals */}
      <Modal 
        isOpen={modalType === 'workflow-form'} 
        onClose={() => setModalType(null)}
        title={isEditing ? '配置此项工作流参数' : '登记新增审批工作流'}
      >
        <form onSubmit={saveWorkflow} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">审批类型</label>
              <select 
                name="category"
                defaultValue={currentItem?.category || '数据导出'}
                className="w-full border border-slate-200 rounded px-2.5 py-1.5 text-xs outline-none bg-white font-medium"
              >
                <option value="数据导出">数据导出</option>
                <option value="数据查询">数据查询</option>
                <option value="样本使用">样本使用</option>
                <option value="科研项目审查">科研项目审查</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">是否开启可见</label>
              <select 
                name="visible"
                defaultValue={currentItem?.visible ? 'true' : 'false'}
                className="w-full border border-slate-200 rounded px-2.5 py-1.5 text-xs outline-none bg-white font-medium"
              >
                <option value="true">开启可见 (是)</option>
                <option value="false">隐藏可见 (否)</option>
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">流程名称</label>
            <input 
              name="name"
              defaultValue={currentItem?.name}
              required
              className="w-full border border-slate-200 rounded px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium text-slate-800"
              placeholder="请输入流程名称"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">可见范围等级（指定用户组）</label>
            <input 
              name="visibleRange"
              defaultValue={currentItem?.visibleRange || '全员'}
              required
              className="w-full border border-slate-200 rounded px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              placeholder="全员, 演示账号2, or 特殊项目组"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">适配的科研库</label>
            <select 
              name="formName"
              defaultValue={currentItem?.formName || '全院科研数据中心'}
              className="w-full border border-slate-200 rounded px-2.5 py-1.5 text-xs outline-none bg-white font-medium"
            >
              <option value="全院科研数据中心">全院科研数据中心</option>
              <option value="心血管病专题数据库">心血管病专题数据库</option>
              <option value="肿瘤免疫多组学科研库">肿瘤免疫多组学科研库</option>
              <option value="骨科临床随访科研库">骨科临床随访科研库</option>
              <option value="公共对照人群库">公共对照人群库</option>
            </select>
          </div>

          <div className="pt-4 flex justify-end gap-2.5">
            <button type="button" onClick={() => setModalType(null)} className="px-4 py-2 border border-slate-200 text-slate-600 hover:bg-slate-50 font-medium rounded text-xs transition-colors">取消</button>
            <button type="submit" className="px-5 py-2 bg-blue-600 text-white font-semibold rounded text-xs hover:bg-blue-700 shadow-lg shadow-blue-500/10 transition-all">保存工作流配置</button>
          </div>
        </form>
      </Modal>

      {/* Embedded CSS layout overrides including watermark */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
        .watermark-bg {
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180' viewBox='0 0 180 180'%3E%3Ctext fill='rgba(15, 23, 42, 0.035)' font-size='11' font-family='sans-serif' x='20' y='90' transform='rotate(-22 90 90)' font-weight='500'%3E科研演示02 8903%3C/text%3E%3C/svg%3E");
          background-repeat: repeat;
        }
      `}</style>
    </div>
  );
}

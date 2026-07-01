import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { 
  Settings, 
  ChevronDown, 
  ChevronRight, 
  ChevronLeft,
  RotateCcw, 
  User, 
  Users,
  X, 
  Plus, 
  Eye, 
  Check, 
  FolderOpen, 
  Download, 
  RefreshCw, 
  Play, 
  Square, 
  Maximize2,
  CheckCircle2,
  Trash2,
  Tag,
  Pencil,
  Network,
  Computer,
  Link,
  FileText,
  FileEdit,
  GitFork,
  Search,
  HelpCircle,
  Info,
  Sliders,
  Calendar
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// --- Types ---
export interface WorkflowItem {
  id: string;
  category: string;
  name: string;
  visible: boolean;
  visibleRange: string;
  formName: string;
  lastPublish: string;
  version: string;
}

interface BPMNNode {
  id: string;
  type: 'start' | 'end' | 'gateway-or' | 'gateway-and' | 'gateway-inclusive' | 'gateway-exclusive' | 'gateway-parallel' | 'task';
  label: string;
  x: number;
  y: number;
  width: number;
  height: number;
  subType?: '|||' | '≡' | '';
  cooperationMode?: 'or' | 'vote' | 'and';
  rejectToNodeId?: string;
  useCustomForm?: 'no' | 'yes';
  formPath?: string;
  ccTargets?: string[];
  customParams?: string;
  assigneeList?: Array<{ key: string; permission: string }>;
}

interface BPMNEdge {
  id: string;
  from: string;
  to: string;
  label?: string;
  routeType: 'straight-h' | 'straight-v' | 'right-down' | 'right-down-left' | 'custom' | 'horizontal-straight';
  condType?: string;
  condName?: string;
  condOp?: string;
  condVal?: string;
  condUserIdentities?: string[];
  condDataVolumeMin?: string;
  condDataVolumeMax?: string;
  condDataTables?: string[];
  condSelectMode?: 'userIdentity' | 'dataVolume' | 'dataTable' | 'spel' | 'default';
  condSpel?: string;
  condDefaultExpr?: string;
}

interface WorkflowDesignerProps {
  workflow: WorkflowItem;
  onSave: (updated: WorkflowItem) => void;
  onClose: () => void;
  onDelete?: () => void;
  onReference?: () => void;
}

// --- Hardcoded Preset Diagrams for absolute screenshot look ---
const DEFAULT_NODES: BPMNNode[] = [
  { id: 'start', type: 'start', label: '开始', x: 270, y: 150, width: 36, height: 36 },
  { id: 'task1', type: 'task', label: '申请人', x: 380, y: 130, width: 110, height: 75, subType: '' },
  { id: 'gate1', type: 'gateway-inclusive', label: '', x: 550, y: 145, width: 46, height: 46 },
  { id: 'task2', type: 'task', label: '收藏负责人审批', x: 700, y: 130, width: 110, height: 75, subType: '', cooperationMode: 'or', rejectToNodeId: 'task1', useCustomForm: 'no', formPath: '', ccTargets: ['队列负责人'], customParams: '' },
  { id: 'task3', type: 'task', label: '遗传办公室审批', x: 440, y: 350, width: 110, height: 75, subType: '' },
  { id: 'task4', type: 'task', label: '药剂科审批', x: 600, y: 350, width: 110, height: 75, subType: '' },
  { id: 'gate2', type: 'gateway-exclusive', label: '', x: 550, y: 550, width: 46, height: 46 },
  { id: 'task5', type: 'task', label: '院长审批', x: 520, y: 720, width: 110, height: 75, subType: '' },
  { id: 'end', type: 'end', label: '结束', x: 800, y: 740, width: 36, height: 36 },
];

const DEFAULT_EDGES: BPMNEdge[] = [
  { id: 'e1', from: 'start', to: 'task1', label: '', routeType: 'straight-h' },
  { id: 'e2', from: 'task1', to: 'gate1', label: '', routeType: 'straight-h' },
  { id: 'e3', from: 'gate1', to: 'task2', label: '', routeType: 'straight-h', condType: '审批通过', condName: '条件名', condOp: '等于', condVal: '库管理员', condUserIdentities: ['库管理员'], condSelectMode: 'userIdentity' },
  { id: 'e4', from: 'gate1', to: 'task3', label: '', routeType: 'custom', condType: '条件分支', condName: '数据类型', condOp: '等于', condVal: '测序', condDataTables: ['测序样本表'], condSelectMode: 'dataTable' }, 
  { id: 'e5', from: 'gate1', to: 'task4', label: '', routeType: 'custom', condType: '条件分支', condName: '数据类型', condOp: '等于', condVal: '药品', condDataTables: ['药品成分表'], condSelectMode: 'dataTable' },
  { id: 'e6', from: 'task2', to: 'gate2', label: '', routeType: 'right-down-left' },
  { id: 'e7', from: 'task3', to: 'gate2', label: '', routeType: 'custom' },
  { id: 'e8', from: 'task4', to: 'gate2', label: '', routeType: 'custom' },
  { id: 'e9', from: 'gate2', to: 'task5', label: '', routeType: 'straight-v', condType: '条件分支', condName: '病历数', condOp: '大于', condVal: '1000', condDataVolumeMax: '5000', condDataTables: ['病历信息表'], condSelectMode: 'dataVolume' },
  { id: 'e10', from: 'gate2', to: 'end', label: '', routeType: 'custom', condType: '条件分支', condName: '病历数', condOp: '小于等于', condVal: '1000', condDataVolumeMax: '1000', condDataTables: ['病历信息表'], condSelectMode: 'dataVolume' },
  { id: 'e11', from: 'task5', to: 'end', label: '', routeType: 'straight-h' },
];

const PERSONNEL_PRESETS = [
  { name: '丘绍远', code: 'qsy', key: '1877280922536161281', group: '默认分组', created: '2026-06-30 14:58:20' },
  { name: '黄启城', code: 'hqc', key: '1877281259489767426', group: '默认分组', created: '2026-06-30 14:58:20' },
  { name: '高唯唯', code: 'gww', key: '1889607242941329409', group: '默认分组', created: '2026-06-30 14:58:20' },
  { name: '许晋辉', code: 'xjh', key: '1889863272778559489', group: '默认分组', created: '2026-06-30 14:58:20' },
  { name: '洪驹发', code: 'hjf', key: '1892419531415351298', group: '默认分组', created: '2026-06-30 14:58:20' },
  { name: '李白', code: 'libai', key: '1899006491302948865', group: '默认分组', created: '2026-06-30 14:58:20' },
  { name: '李白', code: 'libai', key: '1899006491302948865', group: '默认分组', created: '2026-06-30 14:58:20' },
  { name: '丘绍远', code: 'qsy', key: '1877280922536161281', group: '默认分组', created: '2026-06-30 14:58:20' },
  { name: 'gaojiayong', code: 'gjy', key: '1914581733248712706', group: '默认分组', created: '2026-06-30 14:58:20' },
];

const SPEL_PRESETS = [
  { name: '导出审批-课题负责人-动态...', code: '无', key: '@topicWorkflowHelper.getLeaderUserId(#topicId)', group: '默认分组', created: '2026-06-16 14:01:20' },
];

export function WorkflowDesigner({ workflow, onSave, onClose, onDelete, onReference }: WorkflowDesignerProps) {
  // Sync state with parent details
  const [flowId, setFlowId] = useState(workflow.id || 'p_' + Date.now().toString().slice(3));
  const [flowName, setFlowName] = useState(workflow.name || '新建流程_复制');
  const [category, setCategory] = useState(workflow.category || '数据导出');
  
  // New States for Tab Layout
  const [activeTab, setActiveTab] = useState<'basic' | 'design'>('basic');
  const [designerModel, setDesignerModel] = useState<'classic' | 'dingtalk'>('classic');
  const [customForm, setCustomForm] = useState<'no' | 'yes'>('yes');
  const [formIdentifier, setFormIdentifier] = useState('');
  
  // Custom multi-select states matching the new research library adaptation & subConfigs
  const [selectedLibraries, setSelectedLibraries] = useState<string[]>(() => {
    if (!workflow.formName) return ['全院科研数据中心'];
    return workflow.formName.split(',').map(s => s.trim()).filter(Boolean);
  });

  const [selectedSubConfigs, setSelectedSubConfigs] = useState<string[]>(() => {
    const subConfigsStr = (workflow as any).subConfigs;
    if (!subConfigsStr) return ['数据中心', '数据检索'];
    return subConfigsStr.split(',').map((s: string) => s.trim()).filter(Boolean);
  });
  
  const [scenesDropdownOpen, setScenesDropdownOpen] = useState(false);
  const scenesDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (scenesDropdownRef.current && !scenesDropdownRef.current.contains(event.target as Node)) {
        setScenesDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  // Custom states matching screenshot
  const [description, setDescription] = useState('');
  const [visible, setVisible] = useState(workflow.visible !== false);
  const [permissions, setPermissions] = useState(workflow.visibleRange === '全员' ? 'all' : 'select');
  
  // Right sidebar
  const [allowWithdraw, setAllowWithdraw] = useState(true);
  const [titleSetting, setTitleSetting] = useState('flow-name');
  const [summarySetting, setSummarySetting] = useState('first-3');

  // Interactive canvas states
  const [nodes, setNodes] = useState<BPMNNode[]>(DEFAULT_NODES);
  const [edges, setEdges] = useState<BPMNEdge[]>(DEFAULT_EDGES);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [selectedEdgeId, setSelectedEdgeId] = useState<string | null>(null);
  const [toolMode, setToolMode] = useState<'pointer' | 'hand' | 'connect' | 'add'>('pointer');
  
  // Canvas zoom and offset states (with limits)
  const [zoom, setZoom] = useState(1);
  const [panOffset, setPanOffset] = useState({ x: -100, y: -40 });
  const [panning, setPanning] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [draggingNodeId, setDraggingNodeId] = useState<string | null>(null);
  
  // Connect execution state
  const [connectFromId, setConnectFromId] = useState<string | null>(null);

  // Undo/Redo states
  const [history, setHistory] = useState<{nodes: BPMNNode[], edges: BPMNEdge[]}[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  // Floating accordion expansion state
  const [inspectorExpanded, setInspectorExpanded] = useState(true);
  const [customConfigExpanded, setCustomConfigExpanded] = useState(false);
  const [conditionExpanded, setConditionExpanded] = useState(true);
  const [userTaskExpanded, setUserTaskExpanded] = useState(true);
  const [multiApprovalExpanded, setMultiApprovalExpanded] = useState(false);

  const [flowType, setFlowType] = useState('条件流转路径');
  const [conditionFormat, setConditionFormat] = useState('表达式');
  const [conditionConfigType, setConditionConfigType] = useState<'dataTable' | 'volumeRange' | 'applicantIdentity' | ''>('');
  
  // User task config states
  const [ruleType, setRuleType] = useState('指定成员');
  const [specifiedUsers, setSpecifiedUsers] = useState<string[]>(['超级管理员']);
  const [userIdentities, setUserIdentities] = useState<string[]>([]);

  
  // New assignee configuration states
  const [isAddingAssignee, setIsAddingAssignee] = useState(false);
  const [newAssigneeKey, setNewAssigneeKey] = useState('');
  const [newAssigneePerm, setNewAssigneePerm] = useState('');
  const [isSelectingPreset, setIsSelectingPreset] = useState(false);

  // States for personnel selection dialog ("人员选择" 弹窗)
  const [personnelActiveTab, setPersonnelActiveTab] = useState<'user' | 'spel'>('user');
  const [searchPermissionCode, setSearchPermissionCode] = useState('');
  const [searchPermissionName, setSearchPermissionName] = useState('');
  const [searchStartDate, setSearchStartDate] = useState('');
  const [searchEndDate, setSearchEndDate] = useState('');
  const [deptSearch, setDeptSearch] = useState('');
  const [selectedPresetIndices, setSelectedPresetIndices] = useState<number[]>([]);

  // --- Personnel Selection Dialog Handlers ---
  const filteredPresets = PERSONNEL_PRESETS.filter(preset => {
    if (searchPermissionCode.trim() && !preset.code.toLowerCase().includes(searchPermissionCode.trim().toLowerCase())) {
      return false;
    }
    if (searchPermissionName.trim() && !preset.name.toLowerCase().includes(searchPermissionName.trim().toLowerCase())) {
      return false;
    }
    return true;
  });

  const filteredSpelPresets = SPEL_PRESETS.filter(preset => {
    if (searchPermissionCode.trim() && !preset.code.toLowerCase().includes(searchPermissionCode.trim().toLowerCase())) {
      return false;
    }
    if (searchPermissionName.trim() && !preset.name.toLowerCase().includes(searchPermissionName.trim().toLowerCase())) {
      return false;
    }
    return true;
  });

  const handleTogglePresetRow = (idx: number) => {
    setSelectedPresetIndices(prev => 
      prev.includes(idx) ? prev.filter(i => i !== idx) : [...prev, idx]
    );
  };

  const handleSelectAllPreset = () => {
    const listToUse = personnelActiveTab === 'user' ? filteredPresets : filteredSpelPresets;
    const masterList = personnelActiveTab === 'user' ? PERSONNEL_PRESETS : SPEL_PRESETS;
    const visibleIndices = listToUse.map(preset => masterList.indexOf(preset));
    const allVisibleSelected = visibleIndices.every(idx => selectedPresetIndices.includes(idx));
    
    if (allVisibleSelected) {
      setSelectedPresetIndices(prev => prev.filter(idx => !visibleIndices.includes(idx)));
    } else {
      setSelectedPresetIndices(prev => Array.from(new Set([...prev, ...visibleIndices])));
    }
  };

  const handlePresetReset = () => {
    setSearchPermissionCode('');
    setSearchPermissionName('');
    setSearchStartDate('');
    setSearchEndDate('');
    setSelectedPresetIndices([]);
  };

  const handlePresetConfirm = () => {
    if (!selectedNodeId) {
      showToast('未选择活动节点');
      return;
    }
    if (selectedPresetIndices.length === 0) {
      showToast('请至少选择一个办理人');
      return;
    }
    
    const masterList = personnelActiveTab === 'user' ? PERSONNEL_PRESETS : SPEL_PRESETS;
    const selectedPresets = selectedPresetIndices.map(idx => masterList[idx]);
    const node = nodes.find(n => n.id === selectedNodeId);
    if (!node) return;
    
    const currentList = node.assigneeList || [];
    const nextList = [...currentList];
    
    selectedPresets.forEach(preset => {
      // Avoid duplicates based on key (入库主键)
      if (!nextList.some(item => item.key === preset.key)) {
        nextList.push({
          key: preset.key,
          permission: preset.name
        });
      }
    });
    
    setNodes(prev => prev.map(n => n.id === selectedNodeId ? { ...n, assigneeList: nextList } : n));
    setIsSelectingPreset(false);
    setSelectedPresetIndices([]);
    showToast(`成功添加 ${selectedPresets.length} 个办理人`);
  };

  // New state to control inspector visibility
  const [isInspectorVisible, setIsInspectorVisible] = useState(false);
  const [nodeActiveTab, setNodeActiveTab] = useState<'basic' | 'assignee' | 'listener' | 'permission'>('basic');

  // New state variables for condition configuration
  const [dataTables, setDataTables] = useState<string[]>([]);
  const [volumeThreshold, setVolumeThreshold] = useState<number>(0);
  const [applicantIdentities, setApplicantIdentities] = useState<string[]>([]);
  const [expression, setExpression] = useState('');
  const [tableSearch, setTableSearch] = useState('');

  // Toast message notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Checkpoint recording for Undo/Redo
  const recordHistory = (newNodes: BPMNNode[], newEdges: BPMNEdge[]) => {
    const nextHistory = history.slice(0, historyIndex + 1);
    nextHistory.push({ nodes: JSON.parse(JSON.stringify(newNodes)), edges: JSON.parse(JSON.stringify(newEdges)) });
    setHistory(nextHistory);
    setHistoryIndex(nextHistory.length - 1);
  };

  useEffect(() => {
    // Record initial checkpoint
    recordHistory(DEFAULT_NODES, DEFAULT_EDGES);
  }, []);

  useEffect(() => {
    if (workflow) {
      setFlowId(workflow.id || '');
      setFlowName(workflow.name || '');
      setCategory(workflow.category || '数据导出');
      
      const libs = workflow.formName 
        ? workflow.formName.split(',').map((s: string) => s.trim()).filter(Boolean)
        : ['全院科研数据中心'];
      setSelectedLibraries(libs);
      
      const subConfigsStr = (workflow as any).subConfigs;
      const subCfgs = subConfigsStr
        ? subConfigsStr.split(',').map((s: string) => s.trim()).filter(Boolean)
        : ['数据中心', '数据检索'];
      setSelectedSubConfigs(subCfgs);
      
      setVisible(workflow.visible !== false);
      setPermissions(workflow.visibleRange === '全员' ? 'all' : 'select');
    }
  }, [workflow]);

  const handleUndo = () => {
    if (historyIndex > 0) {
      const prevIndex = historyIndex - 1;
      setHistoryIndex(prevIndex);
      setNodes(history[prevIndex].nodes);
      setEdges(history[prevIndex].edges);
      showToast('撤销成功');
    } else {
      showToast('已经是最早状态');
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const nextIndex = historyIndex + 1;
      setHistoryIndex(nextIndex);
      setNodes(history[nextIndex].nodes);
      setEdges(history[nextIndex].edges);
      showToast('重做成功');
    } else {
      showToast('已经是最优新状态');
    }
  };

  const handleResetCanvas = () => {
    setNodes(DEFAULT_NODES);
    setEdges(DEFAULT_EDGES);
    setZoom(1);
    setPanOffset({ x: -100, y: -40 });
    setSelectedNodeId(null);
    showToast('画布已重置');
  };

  // File picker simulation for templates
  const handleOpenFile = () => {
    const templates = [
      { name: '表单导出审批流程', nodes: DEFAULT_NODES, edges: DEFAULT_EDGES },
      { 
        name: '基础双审流程', 
        nodes: [
          { id: 'start', type: 'start', label: '开始', x: 200, y: 150, width: 36, height: 36 },
          { id: 'task1', type: 'task', label: 'PI主管一级审批', x: 300, y: 130, width: 110, height: 75, subType: '≡' },
          { id: 'task2', type: 'task', label: '信息科网络审核', x: 480, y: 130, width: 110, height: 75, subType: '|||' },
          { id: 'end', type: 'end', label: '结束', x: 650, y: 150, width: 36, height: 36 },
        ] as BPMNNode[],
        edges: [
          { id: 'e1', from: 'start', to: 'task1', routeType: 'straight-h' },
          { id: 'e2', from: 'task1', to: 'task2', routeType: 'straight-h' },
          { id: 'e3', from: 'task2', to: 'end', routeType: 'straight-h' },
        ] as BPMNEdge[]
      },
       { 
        name: '单步直达流', 
        nodes: [
          { id: 'start', type: 'start', label: '开始', x: 200, y: 200, width: 36, height: 36 },
          { id: 'task1', type: 'task', label: '系统自动执行备份及审查', x: 320, y: 180, width: 130, height: 75, subType: '|||' },
          { id: 'end', type: 'end', label: '结束', x: 520, y: 200, width: 36, height: 36 },
        ] as BPMNNode[],
        edges: [
          { id: 'e1', from: 'start', to: 'task1', routeType: 'straight-h' },
          { id: 'e2', from: 'task1', to: 'end', routeType: 'straight-h' },
        ] as BPMNEdge[]
      }
    ];

    const confirmLoad = window.confirm('选择预置模版？导入新的工作流文件会覆盖当前的节点配置。');
    if (confirmLoad) {
      const selected = templates[Math.floor(Math.random() * templates.length)];
      setNodes(selected.nodes);
      setEdges(selected.edges);
      recordHistory(selected.nodes, selected.edges);
      showToast(`模版「${selected.name}」载入成功`);
    }
  };

  // Simulating downloading BPMN/JSON config file
  const handleDownloadFile = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify({ flowName, flowId, category, formName: selectedLibraries.join(', '), subConfigs: selectedSubConfigs.join(', '), description, nodes, edges }, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `BPMN_workflow_${flowId}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast('流程定义 json 文件下载成功！');
  };

  // Save current workflow structure back to parent
  const handleSaveAll = () => {
    const updated: WorkflowItem = {
      ...workflow,
      id: flowId,
      name: flowName,
      category: category,
      formName: selectedLibraries.join(', '),
      visible: visible,
      visibleRange: permissions === 'all' ? '全员' : '指定人员',
      lastPublish: new Date().toISOString().replace('T', ' ').slice(0, 19),
      // Set the special virtual field
      subConfigs: selectedSubConfigs.join(', ')
    } as any;
    onSave(updated);
  };

  // Add standard nodes from Toolbox click
  const handleAddNodeToCanvas = (type: 'start' | 'end' | 'gateway-or' | 'gateway-and' | 'gateway-inclusive' | 'gateway-exclusive' | 'gateway-parallel' | 'task') => {
    const nextOffset = nodes.length * 20;
    const labels = {
      'start': '新开始节点',
      'end': '新结束节点',
      'gateway-or': '审批决策判定',
      'gateway-and': '并行同步验证',
      'gateway-inclusive': '包含网关',
      'gateway-exclusive': '互斥网关',
      'gateway-parallel': '并行网关',
      'task': '新增办理审批任务'
    };
    const dimensions = {
      'start': { w: 36, h: 36 },
      'end': { w: 36, h: 36 },
      'gateway-or': { w: 46, h: 46 },
      'gateway-and': { w: 46, h: 46 },
      'gateway-inclusive': { w: 46, h: 46 },
      'gateway-exclusive': { w: 46, h: 46 },
      'gateway-parallel': { w: 46, h: 46 },
      'task': { w: 110, h: 75 }
    };
    
    const newNode: BPMNNode = {
      id: 'node_' + Date.now().toString().slice(8),
      type,
      label: labels[type],
      x: 350 + (nextOffset % 150),
      y: 200 + (nextOffset % 150),
      width: dimensions[type].w,
      height: dimensions[type].h,
      subType: type === 'task' ? '≡' : ''
    };

    const updatedNodes = [...nodes, newNode];
    setNodes(updatedNodes);
    setSelectedNodeId(newNode.id);
    recordHistory(updatedNodes, edges);
    showToast(`放置「${labels[type]}」到画布。`);
  };

  // Node Drag events inside SVG Workspace
  const handleNodeMouseDown = (e: React.MouseEvent, nodeId: string) => {
    e.stopPropagation();
    setSelectedNodeId(nodeId);
    setIsInspectorVisible(true);
    
    if (toolMode === 'connect') {
      if (!connectFromId) {
        setConnectFromId(nodeId);
        showToast('选择目标节点以创建连接连线');
      } else if (connectFromId !== nodeId) {
        // create edge
        const newEdge: BPMNEdge = {
          id: 'edge_' + Date.now().toString().slice(8),
          from: connectFromId,
          to: nodeId,
          routeType: 'straight-h'
        };
        const updatedEdges = [...edges, newEdge];
        setEdges(updatedEdges);
        recordHistory(nodes, updatedEdges);
        setConnectFromId(null);
        setToolMode('pointer');
        showToast('节点连接创建成功');
      }
      return;
    }

    if (toolMode !== 'pointer') return;

    setDraggingNodeId(nodeId);
    const node = nodes.find(n => n.id === nodeId);
    if (!node) return;

    setDragOffset({
      x: e.clientX / zoom - node.x,
      y: e.clientY / zoom - node.y
    });
  };

  const handleCanvasMouseDown = (e: React.MouseEvent) => {
    if (toolMode === 'hand') {
      setPanning(true);
    } else {
      setSelectedNodeId(null);
      setConnectFromId(null);
      setIsInspectorVisible(false);
    }
  };

  const handleCanvasMouseMove = (e: React.MouseEvent) => {
    if (draggingNodeId && dragOffset && toolMode === 'pointer') {
      const newX = Math.round(e.clientX / zoom - dragOffset.x);
      const newY = Math.round(e.clientY / zoom - dragOffset.y);
      setNodes(prev => prev.map(n => n.id === draggingNodeId ? { ...n, x: newX, y: newY } : n));
    } else if (panning && toolMode === 'hand') {
      setPanOffset(prev => ({
        x: prev.x + e.movementX,
        y: prev.y + e.movementY
      }));
    }
  };

  const handleCanvasMouseUp = () => {
    if (draggingNodeId) {
      recordHistory(nodes, edges);
    }
    setDraggingNodeId(null);
    setPanning(false);
  };

  const handleWheel = (e: React.WheelEvent) => {
    if (e.deltaY < 0) {
      setZoom(z => Math.min(1.5, z + 0.05));
    } else {
      setZoom(z => Math.max(0.6, z - 0.05));
    }
  };

  // Delete node and its connections
  const handleDeleteNode = (nodeId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updatedNodes = nodes.filter(n => n.id !== nodeId);
    const updatedEdges = edges.filter(edge => edge.from !== nodeId && edge.to !== nodeId);
    setNodes(updatedNodes);
    setEdges(updatedEdges);
    setSelectedNodeId(null);
    recordHistory(updatedNodes, updatedEdges);
    showToast('删除节点及其所有关联连线');
  };

  // Dynamic Routing calculations to match specific curves perfectly
  const getRoutePathStr = (edge: BPMNEdge) => {
    const from = nodes.find(n => n.id === edge.from);
    const to = nodes.find(n => n.id === edge.to);
    if (!from || !to) return '';

    // Calculate face borders
    const fromRight = from.x + from.width / 2;
    const fromBottom = from.y + from.height / 2;
    const fromLeft = from.x - from.width / 2;
    const fromTop = from.y - from.height / 2;

    const toRight = to.x + to.width / 2;
    const toBottom = to.y + to.height / 2;
    const toLeft = to.x - to.width / 2;
    const toTop = to.y - to.height / 2;

    if (edge.routeType === 'straight-h') {
      // Go horizontally to the midpoint, then vertically, then horizontally to the target (strictly orthogonal, no slant)
      const midX = (fromRight + toLeft) / 2;
      return `M ${fromRight} ${from.y} L ${midX} ${from.y} L ${midX} ${to.y} L ${toLeft} ${to.y}`;
    }

    if (edge.routeType === 'straight-v') {
      // Go vertically to the midpoint, then horizontally, then vertically to the target (strictly orthogonal, no slant)
      const midY = (fromBottom + toTop) / 2;
      return `M ${from.x} ${fromBottom} L ${from.x} ${midY} L ${to.x} ${midY} L ${to.x} ${toTop}`;
    }

    if (edge.routeType === 'right-down') {
      // Go right then down into top
      return `M ${fromRight} ${from.y} L ${to.x} ${from.y} L ${to.x} ${toTop}`;
    }

    if (edge.routeType === 'right-down-left') {
      // Go right out, down, then left into right side
      const bendX = Math.max(fromRight + 30, toRight + 30);
      return `M ${fromRight} ${from.y} L ${bendX} ${from.y} L ${bendX} ${to.y} L ${toRight} ${to.y}`;
    }

    if (edge.routeType === 'custom') {
      // For gate1 -> task3, gate1 -> task4, task3 -> gate2, task4 -> gate2
      // Typical top-down split or merge (from bottom of node to top of target)
      return `M ${from.x} ${fromBottom} L ${from.x} ${(fromBottom + toTop)/2} L ${to.x} ${(fromBottom + toTop)/2} L ${to.x} ${toTop}`;
    }

    // Default Fallback adaptive orthogonal router
    if (Math.abs(from.y - to.y) < 1) {
      return `M ${fromRight} ${from.y} L ${toLeft} ${to.y}`;
    } else {
      return `M ${fromRight} ${from.y} L ${(fromRight + toLeft) / 2} ${from.y} L ${(fromRight + toLeft) / 2} ${to.y} L ${toLeft} ${to.y}`;
    }
  };

  const activeNode = nodes.find(n => n.id === selectedNodeId);

  return (
    <div className="flex-1 flex flex-col bg-[#f8fbff] text-slate-800 font-sans h-full overflow-hidden absolute inset-0 z-20">
      
      {/* Toast Notice alerts */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white font-medium text-xs py-2.5 px-5 rounded-lg shadow-xl flex items-center gap-2 border border-slate-800"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top Navigation Tabs configured exactly as the image */}
      <div className="bg-white border-b border-slate-200 select-none shrink-0 flex flex-col">
        {/* Line 1: Header / Action Row */}
        <div className="h-[56px] px-6 flex items-center justify-between border-b border-slate-100">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-slate-800 text-[15px]">工作流配置设计面板</span>
          </div>

          <div className="flex items-center gap-2">
            {onDelete && (
              <button
                type="button"
                onClick={onDelete}
                className="px-4 py-2 bg-[#f1f5f9] hover:bg-[#e2e8f0] text-slate-600 rounded-lg text-xs font-bold transition-all cursor-pointer border border-slate-200/80"
              >
                删除
              </button>
            )}
            {onReference && (
              <button
                type="button"
                onClick={onReference}
                className="px-4 py-2 bg-white hover:bg-blue-50 text-blue-600 border border-blue-500 rounded-lg text-xs font-bold transition-all cursor-pointer"
              >
                引用其他库配置
              </button>
            )}
            <button
              type="button"
              onClick={() => {
                const updatedWorkflow: WorkflowItem = {
                  ...workflow,
                  id: flowId,
                  name: flowName,
                  category: category,
                  visible: visible,
                  visibleRange: permissions === 'all' ? '全员' : '指定',
                  formName: selectedLibraries.join(', '),
                  version: workflow.version,
                };
                (updatedWorkflow as any).subConfigs = selectedSubConfigs.join(', ');
                onSave(updatedWorkflow);
              }}
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-all cursor-pointer border-0 shadow-sm"
            >
              完成配置并保持
            </button>
          </div>
        </div>

        {/* Line 2: Centered Tabs Row */}
        <div className="h-[48px] flex items-center justify-center bg-[#f8fafc]">
          <div className="flex bg-slate-200/50 rounded-lg p-1 gap-1 border border-slate-200/30 shadow-sm">
            <button 
              onClick={() => setActiveTab('basic')}
              className={`flex items-center gap-1.5 px-6 py-1.5 rounded-md text-xs font-bold transition-all duration-200 ${
                activeTab === 'basic' 
                  ? 'bg-blue-600 text-white shadow-sm' 
                  : 'text-slate-600 hover:bg-slate-200/50'
              }`}
            >
              基础信息
            </button>
            <button 
              onClick={() => setActiveTab('design')}
              className={`flex items-center gap-1.5 px-6 py-1.5 rounded-md text-xs font-bold transition-all duration-200 ${
                activeTab === 'design' 
                  ? 'bg-blue-600 text-white shadow-sm' 
                  : 'text-slate-600 hover:bg-slate-200/50'
              }`}
            >
              流程设计
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto bg-[#f6f8fb] relative flex">
        {activeTab === 'basic' ? (
          <div className="w-full h-full flex justify-center p-8 overflow-y-auto custom-scrollbar">
            
            {/* The Form from Image 1 */}
            <div className="w-[900px] h-fit bg-white rounded-xl shadow-[0_2px_12px_rgba(0,0,0,0.02)] border border-slate-200/80 p-8 pt-6 relative">
              {/* Left blue border marker */}
              <div className="absolute left-[-1px] top-8 bottom-8 w-[4px] bg-[#3b82f6] rounded-r-md"></div>
              
              <h2 className="text-[16px] font-bold text-slate-800 mb-8 flex items-center gap-2">
                <div className="w-1 h-[14px] bg-blue-600 rounded-sm"></div>
                基本配置
              </h2>

              <div className="space-y-6">
                
                {/* 流程编码 */}
                <div className="flex text-[14px]">
                  <div className="w-[120px] pt-2 text-slate-700 font-semibold flex-shrink-0">
                    <span className="text-red-500 mr-1">*</span>流程编码
                  </div>
                  <div className="flex-1 relative">
                    <input 
                      type="text" 
                      placeholder="请输入流程编码" 
                      value={flowId}
                      onChange={(e) => setFlowId(e.target.value)}
                      className="w-full h-10 px-3 border border-slate-200 rounded text-slate-800 outline-none focus:border-blue-500 transition-colors"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs">{flowId.length} / 40</span>
                  </div>
                </div>

                {/* 流程名称 */}
                <div className="flex text-[14px]">
                  <div className="w-[120px] pt-2 text-slate-700 font-semibold flex-shrink-0">
                    <span className="text-red-500 mr-1">*</span>流程名称
                  </div>
                  <div className="flex-1 relative">
                    <input 
                      type="text" 
                      placeholder="请输入流程名称" 
                      value={flowName}
                      onChange={(e) => setFlowName(e.target.value)}
                      className="w-full h-10 px-3 border border-slate-200 rounded text-slate-800 outline-none focus:border-blue-500 transition-colors"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs">{flowName.length} / 100</span>
                  </div>
                </div>

                {/* 设计器模型 */}
                <div className="flex text-[14px]">
                  <div className="w-[120px] pt-2 text-slate-700 font-semibold flex-shrink-0">
                    <span className="text-red-500 mr-1">*</span>设计器模型
                  </div>
                  <div className="flex-1">
                    <div className="flex gap-4">
                      <div 
                        onClick={() => setDesignerModel('classic')}
                        className={`flex-1 border rounded-md p-4 cursor-pointer relative transition-all overflow-hidden ${
                          designerModel === 'classic' 
                            ? 'border-blue-400 bg-blue-50/40' 
                            : 'border-slate-200 bg-white hover:border-blue-300'
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center shrink-0">
                            <Computer className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <h4 className="font-bold text-blue-500 mb-0.5 text-[15px]">经典模型</h4>
                            <p className="text-slate-400 text-[12px]">自由拖拽连线，灵活编排流程</p>
                          </div>
                        </div>
                        <div className={`absolute right-4 top-4 w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors ${designerModel === 'classic' ? 'border-blue-500 bg-blue-500' : 'border-slate-300'}`}>
                          {designerModel === 'classic' && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                        </div>
                        {designerModel === 'classic' && (
                          <div className="absolute right-0 bottom-0 text-blue-500 pointer-events-none">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                              <path d="M24 0V24H0L24 0Z" fill="currentColor"/>
                              <path d="M17 9L11 15L7.5 11.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          </div>
                        )}
                      </div>


                    </div>
                  </div>
                </div>

                {/* 流程类别 */}
                <div className="flex text-[14px]">
                  <div className="w-[120px] pt-2 text-slate-700 font-semibold flex-shrink-0">
                    流程类别
                  </div>
                  <div className="flex-1">
                    <div className="relative">
                      <select 
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-[320px] h-10 px-3 border border-slate-200 rounded text-slate-800 outline-none focus:border-blue-500 transition-colors appearance-none bg-white"
                      >
                        <option value="" disabled>请选择流程类别</option>
                        <option value="数据导出">数据导出</option>
                        <option value="权限审批">权限审批</option>
                      </select>
                      <ChevronDown className="w-4 h-4 text-slate-400 absolute left-[295px] top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  </div>
                </div>

                {/* 导出场景 */}
                <div className="flex text-[14px]">
                  <div className="w-[120px] pt-2 text-slate-700 font-semibold flex-shrink-0">
                    导出场景
                  </div>
                  <div className="flex-1">
                    <div className="relative w-[320px]" ref={scenesDropdownRef}>
                      <div
                        onClick={() => setScenesDropdownOpen(!scenesDropdownOpen)}
                        className="w-full min-h-[40px] px-3 py-1.5 border border-slate-200 rounded text-slate-800 bg-white cursor-pointer hover:border-slate-300 focus-within:border-blue-500 transition-colors flex flex-wrap items-center gap-1.5 pr-8 select-none"
                      >
                        {selectedSubConfigs.length === 0 ? (
                          <span className="text-slate-400 text-xs">请选择导出场景</span>
                        ) : (
                          selectedSubConfigs.map((scene) => (
                            <span
                              key={scene}
                              className="inline-flex items-center gap-1 bg-blue-50 text-blue-600 px-2 py-0.5 rounded-md text-xs font-bold border border-blue-100"
                            >
                              <span>{scene}</span>
                              <span
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedSubConfigs(prev => prev.filter(item => item !== scene));
                                }}
                                className="w-3.5 h-3.5 rounded-full hover:bg-blue-100 flex items-center justify-center text-blue-500 hover:text-blue-700 cursor-pointer font-bold text-[10px]"
                              >
                                ✕
                              </span>
                            </span>
                          ))
                        )}
                        <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                      </div>

                      {/* Dropdown Options */}
                      <AnimatePresence>
                        {scenesDropdownOpen && (
                          <motion.div
                            initial={{ opacity: 0, y: -4 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -4 }}
                            transition={{ duration: 0.15 }}
                            className="absolute left-0 right-0 mt-1 bg-white border border-slate-200 rounded-lg shadow-lg z-50 overflow-hidden py-1"
                          >
                            {['数据中心', '数据检索', '患者收藏', '课题'].map((scene) => {
                              const isSelected = selectedSubConfigs.includes(scene);
                              return (
                                <div
                                  key={scene}
                                  onClick={() => {
                                    if (isSelected) {
                                      setSelectedSubConfigs(prev => prev.filter(item => item !== scene));
                                    } else {
                                      setSelectedSubConfigs(prev => [...prev, scene]);
                                    }
                                  }}
                                  className="px-4 py-2 hover:bg-slate-50 cursor-pointer flex items-center justify-between text-xs text-slate-750 select-none animate-fade-in"
                                >
                                  <div className="flex items-center gap-2">
                                    <div className={`w-3.5 h-3.5 rounded border flex items-center justify-center transition-colors ${isSelected ? 'border-blue-600 bg-blue-600 text-white' : 'border-slate-300 bg-white'}`}>
                                      {isSelected && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                                    </div>
                                    <span className={isSelected ? 'font-bold text-slate-900' : 'text-slate-750'}>{scene}</span>
                                  </div>
                                </div>
                              );
                            })}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                </div>



              </div>
            </div>
            
          </div>
        ) : (
          <>
          <div className="flex-1 w-full h-full relative overflow-hidden bg-[#fafbfc]">
            {/* Left Tool Palette */}
            <div className="absolute left-6 top-6 bg-white border border-slate-200 shadow-[0_2px_12px_rgba(0,0,0,0.06)] rounded-lg w-16 py-3 flex flex-col items-center gap-4 z-30">
              <div className="flex flex-col items-center group cursor-pointer" title="开始" onClick={() => handleAddNodeToCanvas('start')}>
                <div className="w-8 h-8 rounded-full border-[3px] border-slate-300 bg-white flex items-center justify-center">
                   <div className="w-3 h-3 bg-green-500 rounded-full group-hover:scale-110 transition-transform"></div>
                </div>
                <span className="text-[10px] mt-1 text-slate-500 font-medium">开始</span>
              </div>
              <div className="w-8 h-px bg-slate-100"></div>
              <div className="flex flex-col items-center group cursor-pointer" title="中间节点" onClick={() => handleAddNodeToCanvas('task')}>
                <div className="w-8 h-8 rounded-full border-2 border-slate-400 bg-white group-hover:bg-slate-50 transition-colors flex items-center justify-center">
                  <div className="w-2 h-2 rounded-sm border border-slate-300 bg-white group-hover:scale-110 transition-transform"></div>
                </div>
                <span className="text-[10px] mt-1 text-slate-500 font-medium">中间节点</span>
              </div>
              <div className="flex flex-col items-center group cursor-pointer" title="结束" onClick={() => handleAddNodeToCanvas('end')}>
                <div className="w-8 h-8 rounded-full border-[3px] border-slate-600 bg-white flex items-center justify-center">
                  <div className="w-4 h-4 rounded-full border border-slate-400 group-hover:scale-110 transition-transform"></div>
                </div>
                <span className="text-[10px] mt-1 text-slate-500 font-medium">结束</span>
              </div>
              <div className="w-8 h-px bg-slate-100"></div>
              <div className="flex flex-col items-center group cursor-pointer" title="互斥网关" onClick={() => handleAddNodeToCanvas('gateway-exclusive')}>
                <div className="w-8 h-8 rotate-45 border-2 border-slate-400 bg-white flex items-center justify-center group-hover:bg-slate-50 transition-colors">
                  <span className="-rotate-45 text-slate-600 font-bold text-lg leading-none">×</span>
                </div>
                <span className="text-[10px] mt-1 text-slate-500 font-medium">互斥网关</span>
              </div>
              <div className="flex flex-col items-center group cursor-pointer" title="并行网关" onClick={() => handleAddNodeToCanvas('gateway-parallel')}>
                <div className="w-8 h-8 rotate-45 border-2 border-slate-400 bg-white flex items-center justify-center group-hover:bg-slate-50 transition-colors">
                  <span className="-rotate-45 text-slate-600 font-bold text-lg leading-none">+</span>
                </div>
                <span className="text-[10px] mt-1 text-slate-500 font-medium">并行网关</span>
              </div>
              <div className="flex flex-col items-center group cursor-pointer" title="包含网关" onClick={() => handleAddNodeToCanvas('gateway-inclusive')}>
                <div className="w-8 h-8 rotate-45 border-2 border-slate-400 bg-white flex items-center justify-center group-hover:bg-slate-50 transition-colors">
                  <div className="-rotate-45 w-4 h-4 rounded-full border-2 border-slate-400"></div>
                </div>
                <span className="text-[10px] mt-1 text-slate-500 font-medium">包含网关</span>
              </div>
            </div>

            <div className="hidden">

        {/* Info Forms */}
        <div className="flex-1 p-4 space-y-4.5 overflow-y-auto custom-scrollbar text-xs">
          
          {/* Flow ID identifier */}
          <div className="space-y-1.5">
            <label className="text-slate-500 font-medium">流程标识</label>
            <input 
              type="text" 
              className="w-full bg-[#f4f7fc]/90 border border-[#e2e8f5] rounded px-3 py-2 text-slate-800 outline-none focus:border-blue-500 transition-colors placeholder-[#a0aec0] font-sans h-8 text-[12px]" 
              value={flowId}
              onChange={(e) => {
                setFlowId(e.target.value);
                setNodes(prev => prev.map(n => n.id === selectedNodeId ? { ...n, id: e.target.value } : n));
              }}
              placeholder="请输入流程标识"
            />
          </div>

          {/* Flow Icon design copy */}
          <div className="space-y-2 pt-1 border-t border-[#f1f5fd]">
            <label className="text-slate-500 font-medium block">流程图标</label>
            <button 
              type="button" 
              className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded font-medium text-xs transition-colors cursor-pointer text-center"
              onClick={() => showToast('已调起系统图标资源管理器')}
            >
              上传图标
            </button>
            <div className="pt-2">
              <div className="w-[72px] h-[72px] rounded-lg bg-blue-50 border border-blue-100 flex flex-col items-center justify-center text-blue-600 shadow-sm relative overflow-hidden group">
                <span className="text-[20px] font-bold select-none text-blue-600 tracking-wider">表单</span>
                <div className="absolute inset-x-0 bottom-0 py-0.5 bg-blue-600/10 text-center text-[10px] text-blue-500 group-hover:bg-blue-600/20">内置</div>
              </div>
              <p className="text-[#a0aec0] text-[10px] leading-relaxed mt-2 select-none">
                支持格式: jpg、jpeg、png、gif、svg, 不超过2MB
              </p>
            </div>
          </div>

          {/* Flow Description textarea */}
          <div className="space-y-1.5">
            <label className="text-slate-500 font-medium">流程描述</label>
            <textarea 
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="请输入流程说明"
              className="w-full border border-[#e2e8f5] rounded px-3 py-2 text-slate-800 outline-none focus:border-blue-500 transition-colors placeholder-[#a0aec0] text-[12px] resize-none"
            />
          </div>

          {/* Visible Range toggler */}
          <div className="space-y-2">
            <label className="text-slate-500 font-medium block">可见范围</label>
            <div className="flex gap-0.5 bg-slate-100 p-0.5 rounded border border-slate-200/50 w-fit">
              <button 
                type="button"
                onClick={() => setVisible(true)}
                className={`px-4 py-1.5 rounded transition-all font-semibold ${visible ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-200'}`}
              >
                可见
              </button>
              <button 
                type="button"
                onClick={() => setVisible(false)}
                className={`px-4 py-1.5 rounded transition-all font-semibold ${!visible ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-200'}`}
              >
                隐藏
              </button>
            </div>
          </div>

          {/* Start permissions toggle */}
          <div className="space-y-2">
            <label className="text-slate-500 font-medium block">发起权限</label>
            <div className="flex gap-0.5 bg-slate-100 p-0.5 rounded border border-slate-200/50 w-fit">
              <button 
                type="button"
                onClick={() => setPermissions('all')}
                className={`px-4 py-1.5 rounded transition-all font-semibold ${permissions === 'all' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-200'}`}
              >
                全员
              </button>
              <button 
                type="button"
                onClick={() => setPermissions('select')}
                className={`px-4 py-1.5 rounded transition-all font-semibold ${permissions === 'select' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-200'}`}
              >
                指定人员
              </button>
            </div>
          </div>

        </div>
      </div>
      </div>

      {/* --- Part 2: CENTER BPMN DESIGNER CANVAS --- */}
      <div className="absolute inset-0 z-10 overflow-hidden bg-slate-50"
        onWheel={handleWheel}
        onMouseDown={handleCanvasMouseDown}
        onMouseMove={handleCanvasMouseMove}
        onMouseUp={handleCanvasMouseUp}
        onMouseLeave={handleCanvasMouseUp}
        onClick={() => { setSelectedNodeId(null); setSelectedEdgeId(null); }}
      >
        <div className="w-full h-full relative">
          
          {/* Top Right Tool Bar */}
          <div className="absolute right-6 top-6 bg-white border border-slate-200 shadow-[0_2px_12px_rgba(0,0,0,0.06)] rounded flex items-center z-30">
            <button onClick={() => { setZoom(1); setPanOffset({ x: -100, y: -40 }); }} className="w-8 h-8 flex items-center justify-center border-r border-slate-100 hover:bg-slate-50 transition-colors" title="适应屏幕">
              <Maximize2 className="w-3.5 h-3.5 text-slate-600" />
            </button>
            <button onClick={() => setZoom(z => Math.min(1.5, z + 0.1))} className="w-8 h-8 flex items-center justify-center border-r border-slate-100 hover:bg-slate-50 transition-colors" title="放大">
              <span className="text-slate-600 font-bold leading-none">+</span>
            </button>
            <button onClick={() => setZoom(z => Math.max(0.6, z - 0.1))} className="w-8 h-8 flex items-center justify-center border-r border-slate-100 hover:bg-slate-50 transition-colors" title="缩小">
              <span className="text-slate-600 font-bold leading-none">-</span>
            </button>
            <button onClick={handleUndo} className="w-8 h-8 flex items-center justify-center border-r border-slate-100 hover:bg-slate-50 transition-colors" title="撤销">
              <span className="text-slate-600 font-bold">«</span>
            </button>
            <button onClick={handleRedo} className="w-8 h-8 flex items-center justify-center border-r border-slate-100 hover:bg-slate-50 transition-colors" title="重做">
              <span className="text-slate-600 font-bold">»</span>
            </button>
            <button onClick={() => { if(selectedNodeId) handleDeleteNode(selectedNodeId, {stopPropagation:()=>{}} as any) }} className="w-8 h-8 flex items-center justify-center border-r border-slate-100 hover:bg-slate-50 text-red-500 transition-colors" title="删除">
              <Trash2 className="w-3.5 h-3.5" />
            </button>
            <button onClick={() => showToast('已保存为图片')} className="w-8 h-8 flex items-center justify-center border-r border-slate-100 hover:bg-slate-50 transition-colors" title="保存图片">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-600"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
            </button>
            <button onClick={handleDownloadFile} className="w-8 h-8 flex items-center justify-center hover:bg-slate-50 transition-colors" title="下载">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-600"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
            </button>
          </div>

          {/* Interactive designer Canvas Paper */}
          <div className="flex-1 w-full h-full overflow-hidden relative cursor-crosshair">
            
            {/* Real SVG Grid canvas backdrop */}
            <svg 
              className="absolute inset-0 w-full h-full"
              style={{ userSelect: 'none' }}
            >
              <defs>
                {/* SVG Dot grid pattern matching BPMN visual guidelines */}
                <pattern id="grid_pattern" width="16" height="16" patternUnits="userSpaceOnUse">
                  <path d="M 16 0 L 0 0 0 16" fill="none" stroke="rgba(0,0,0,0.03)" strokeWidth="1"/>
                  <circle cx="16" cy="16" r="0.75" fill="rgba(0,0,0,0.15)"/>
                </pattern>
                {/* Arrow markers for connection lines */}
                <marker 
                  id="arrow" 
                  viewBox="0 0 10 10" 
                  refX="6" 
                  refY="5" 
                  markerWidth="6" 
                  markerHeight="6" 
                  orient="auto-start-reverse"
                >
                  <path d="M 0 1 L 10 5 L 0 9 z" fill="rgba(80,80,80,0.95)" />
                </marker>
              </defs>

              {/* Grid backing background rect */}
              <rect width="100%" height="100%" fill="url(#grid_pattern)" />

              {/* Main visual BPMN elements wrap */}
              <g transform={`translate(${panOffset.x}, ${panOffset.y}) scale(${zoom})`}>
                
                {/* 1. Drawings Connections / Edges */}
                {edges.map((edge) => {
                  const pathStr = getRoutePathStr(edge);
                  if (!pathStr) return null;
                  const isEdgeSelected = selectedEdgeId === edge.id;

                  return (
                    <g 
                      key={edge.id} 
                      className="group cursor-pointer" 
                      onClick={(e) => { 
                        e.stopPropagation(); 
                        setSelectedEdgeId(edge.id); 
                        setSelectedNodeId(null); 
                      }}
                    >
                      {/* Thicker hover path trigger target */}
                      <path 
                        d={pathStr} 
                        fill="none" 
                        stroke="transparent" 
                        strokeWidth="12" 
                        className="hover:stroke-blue-50/50"
                      />
                      {/* Active visible line */}
                      <path 
                        d={pathStr} 
                        fill="none" 
                        stroke={isEdgeSelected ? "#3b82f6" : "rgba(80,80,80,0.95)"} 
                        strokeWidth={isEdgeSelected ? "2.5" : "1.75"} 
                        markerEnd="url(#arrow)"
                        className="transition-all"
                      />
                      
                      {/* Action Path label "是" or "否" or other conditions */}
                      {(() => {
                        const fromNode = nodes.find(n => n.id === edge.from);
                        const toNode = nodes.find(n => n.id === edge.to);
                        if (!fromNode || !toNode) return null;
                        
                        // Dynamically compile summary label if none is custom-typed
                        let displayLabel = edge.label;
                        if (!displayLabel) {
                          const mode = edge.condSelectMode || (edge.condUserIdentities && edge.condUserIdentities.length > 0 ? 'userIdentity' : (edge.condDataVolumeMin || edge.condDataVolumeMax ? 'dataVolume' : (edge.condDataTables && edge.condDataTables.length > 0 ? 'dataTable' : (edge.condSpel ? 'spel' : (edge.condDefaultExpr ? 'default' : 'userIdentity')))));
                          
                          if (mode === 'userIdentity' && edge.condUserIdentities && edge.condUserIdentities.length > 0) {
                            displayLabel = edge.condUserIdentities.join('/');
                          } else if (mode === 'dataVolume') {
                            const max = edge.condDataVolumeMax || '无上限';
                            displayLabel = max === '无上限' ? '病历数无上限' : `≤${max}条`;
                          } else if (mode === 'dataTable' && edge.condDataTables && edge.condDataTables.length > 0) {
                            displayLabel = `${edge.condDataTables.length}张表`;
                          } else if (mode === 'spel' && edge.condSpel) {
                            displayLabel = edge.condSpel;
                          } else if (mode === 'default' && edge.condDefaultExpr) {
                            displayLabel = edge.condDefaultExpr;
                          }
                        }
                        
                        if (!displayLabel) return null;

                        let mx = (fromNode.x + toNode.x) / 2;
                        let my = (fromNode.y + toNode.y) / 2;
                        
                        if (edge.routeType === 'straight-h') {
                          mx = (fromNode.x + fromNode.width / 2 + toNode.x - toNode.width / 2) / 2;
                          my = fromNode.y;
                        } else if (edge.routeType === 'straight-v') {
                          mx = fromNode.x;
                          my = (fromNode.y + fromNode.height / 2 + toNode.y - toNode.height / 2) / 2;
                        } else if (edge.routeType === 'right-down') {
                          mx = toNode.x;
                          my = fromNode.y;
                        } else if (edge.routeType === 'right-down-left') {
                          const bendX = Math.max(fromNode.x + fromNode.width / 2 + 30, toNode.x + toNode.width / 2 + 30);
                          mx = bendX;
                          my = (fromNode.y + toNode.y) / 2;
                        } else if (edge.routeType === 'custom') {
                          mx = (fromNode.x + toNode.x) / 2;
                          my = (fromNode.y + fromNode.height / 2 + toNode.y - toNode.height / 2) / 2;
                        }
                        
                        const labelWidth = displayLabel.length * 7 + 16;
                        
                        return (
                          <g>
                            <rect 
                              x={mx - labelWidth / 2}
                              y={my - 10}
                              width={labelWidth}
                              height="20"
                              fill="white"
                              stroke={isEdgeSelected ? "#3b82f6" : "#e2e8f0"}
                              strokeWidth="1"
                              rx="4"
                              className="shadow-sm"
                            />
                            <text 
                              x={mx}
                              y={my + 4}
                              fill={isEdgeSelected ? "#2563eb" : "#475569"}
                              fontSize="11"
                              fontWeight="500"
                              textAnchor="middle"
                              className="font-sans select-none"
                            >
                              {displayLabel}
                            </text>
                          </g>
                        );
                      })()}
                    </g>
                  );
                })}

                {/* 2. Visual BPMN Nodes */}
                {nodes.map((node) => {
                  const isSelected = selectedNodeId === node.id;
                  
                  return (
                    <g 
                      key={node.id}
                      transform={`translate(${node.x}, ${node.y})`}
                      onMouseDown={(e) => handleNodeMouseDown(e, node.id)}
                      className={`select-none cursor-pointer group`}
                    >
                      {/* Option for standard visual highlights */}
                      <rect 
                        x={-node.width/2 - 4}
                        y={-node.height/2 - 4}
                        width={node.width + 8}
                        height={node.height + 8}
                        fill="transparent"
                        stroke={isSelected ? '#3182ce' : 'transparent'}
                        strokeWidth="1.5"
                        strokeDasharray="3,3"
                        rx={node.type === 'task' ? 8 : 4}
                        className="transition-all duration-150"
                      />

                      {/* Rendering START events circles */}
                      {node.type === 'start' && (
                        <g>
                          <circle 
                            cx="0" 
                            cy="0" 
                            r={node.width / 2}
                            fill="#fafafe" 
                            stroke="#333" 
                            strokeWidth="1.5" 
                          />
                          <text 
                            y={-node.height/2 - 8} 
                            textAnchor="middle" 
                            fill="#4a5568" 
                            fontSize="11" 
                            fontWeight="500"
                          >
                            {node.label}
                          </text>
                        </g>
                      )}

                      {/* Rendering END events circles */}
                      {node.type === 'end' && (
                        <g>
                          <circle 
                            cx="0" 
                            cy="0" 
                            r={node.width / 2}
                            fill="#fafafe" 
                            stroke="#333" 
                            strokeWidth="3.2" 
                          />
                          <text 
                            y={-node.height/2 - 8} 
                            textAnchor="middle" 
                            fill="#4a5568" 
                            fontSize="11" 
                            fontWeight="500"
                          >
                            {node.label}
                          </text>
                        </g>
                      )}

                      {/* Rendering Gateway diamonds */}
                      {(node.type === 'gateway-exclusive' || node.type === 'gateway-parallel' || node.type === 'gateway-inclusive' || node.type === 'gateway-or' || node.type === 'gateway-and') && (
                        <g>
                          <polygon 
                            points={`0,${-node.height/2} ${node.width/2},0 0,${node.height/2} ${-node.width/2},0`}
                            fill="#fafafe"
                            stroke="#333"
                            strokeWidth="1.5"
                          />
                          {/* Inner cross indicator for gateway */}
                          {(node.type === 'gateway-exclusive' || node.type === 'gateway-or') && (
                            <text y="4.5" textAnchor="middle" fontSize="15" fontWeight="bold" fill="#333">✕</text>
                          )}
                          {(node.type === 'gateway-parallel' || node.type === 'gateway-and') && (
                            <text y="5" textAnchor="middle" fontSize="18" fontWeight="bold" fill="#333">＋</text>
                          )}
                          {node.type === 'gateway-inclusive' && (
                            <circle cx="0" cy="0" r="10" fill="none" stroke="#333" strokeWidth="1.5" />
                          )}
                          <text 
                            y={-node.height/2 - 8} 
                            textAnchor="middle" 
                            fill="#4a5568" 
                            fontSize="11" 
                            fontWeight="500"
                          >
                            {node.label}
                          </text>
                        </g>
                      )}

                      {/* Rendering Task Node boxes */}
                      {node.type === 'task' && (
                        <g>
                          <rect 
                            x={-node.width/2}
                            y={-node.height/2}
                            width={node.width}
                            height={node.height}
                            fill="#fcfcfc"
                            stroke="#555"
                            strokeWidth="1.5"
                            rx="5"
                          />
                          
                          {/* Center task label text wrapping cleanly */}
                          <text 
                            textAnchor="middle" 
                            fill="#333" 
                            fontSize="11.5" 
                            fontWeight="500"
                            className="font-sans select-none"
                            y={4}
                          >
                            {node.label}
                          </text>
                        </g>
                      )}

                      {/* Overlay delete button shown upon selection highlight */}
                      {isSelected && (
                        <g transform={`translate(${node.width/2 + 5}, ${-node.height/2 - 5})`}>
                          <circle cx="0" cy="0" r="7.5" fill="#f56565" />
                          <text 
                            x="0" 
                            y="2.5" 
                            textAnchor="middle" 
                            fill="white" 
                            fontSize="8.5" 
                            fontWeight="black"
                            onClick={(e) => handleDeleteNode(node.id, e)}
                          >
                            ✕
                          </text>
                        </g>
                      )}
                    </g>
                  );
                })}

              </g>
            </svg>

            {/* Canvas Floating Sidebar Toolbox */}
            <div className="absolute left-4 top-4 bg-white rounded-lg shadow-lg border border-slate-200/80 p-1 flex flex-col gap-1 z-35 select-none">
              
              {/* Pointer select mode tool */}
              <button 
                onClick={() => { setToolMode('pointer'); setConnectFromId(null); }}
                className={`p-2 rounded hover:bg-slate-50 flex items-center justify-center transition-colors ${toolMode === 'pointer' ? 'bg-blue-50 text-blue-600' : 'text-slate-500'}`}
                title="选择节点（指针模式）"
              >
                <span className="text-xs font-black">🏹</span>
              </button>

              {/* Hand/Pan canvas tool */}
              <button 
                onClick={() => { setToolMode('hand'); setConnectFromId(null); }}
                className={`p-2 rounded hover:bg-slate-50 flex items-center justify-center transition-colors ${toolMode === 'hand' ? 'bg-blue-50 text-blue-600' : 'text-slate-500'}`}
                title="平移画布（抓手模式）"
              >
                <span className="text-xs">🤚</span>
              </button>

              {/* Connector line create mode */}
              <button 
                onClick={() => { setToolMode('connect'); setConnectFromId(null); showToast('连接模式：选取起始连线审批节点'); }}
                className={`p-2 rounded hover:bg-slate-50 flex items-center justify-center transition-colors ${toolMode === 'connect' ? 'bg-blue-50 text-blue-600' : 'text-slate-500'}`}
                title="创建逻辑连线"
              >
                <span className="text-[10px] font-bold">➔</span>
              </button>

              <span className="w-full h-px bg-slate-200" />

              {/* Circle - Start trigger */}
              <button 
                onClick={() => handleAddNodeToCanvas('start')}
                className="p-2 rounded hover:bg-slate-50 flex items-center justify-center text-slate-500 border border-transparent hover:border-slate-100"
                title="新增：开始节点"
              >
                <circle cx="12" cy="12" r="6" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4 fill-none" />
              </button>

              {/* User Task rectangle */}
              <button 
                onClick={() => handleAddNodeToCanvas('task')}
                className="p-2 rounded hover:bg-slate-50 flex items-center justify-center text-slate-500"
                title="新增：审批办理任务"
              >
                <div className="w-3.5 h-3 bg-white border border-slate-500 rounded-sm" />
              </button>

              {/* Gateway decision diamond */}
              <button 
                onClick={() => handleAddNodeToCanvas('gateway-or')}
                className="p-2 rounded hover:bg-slate-50 flex items-center justify-center text-slate-500"
                title="新增：分支判决决策点"
              >
                <div className="w-3 h-3 rotate-45 border border-slate-500 bg-white" />
              </button>

              {/* End circle */}
              <button 
                onClick={() => handleAddNodeToCanvas('end')}
                className="p-2 rounded hover:bg-slate-50 flex items-center justify-center text-slate-500"
                title="新增：结束节点"
              >
                <circle cx="12" cy="12" r="6" stroke="currentColor" strokeWidth="2.5" className="w-4 h-4 fill-none" />
              </button>

            </div>

            {/* Conditional Right Inspector Panel - Removed per user request */}
            {false && isInspectorVisible && !selectedNodeId && (() => {
              const selectedNode = nodes.find(n => n.id === selectedNodeId);
              const isTaskNode = selectedNode?.type === 'task';

              return (
              <div 
                style={{ width: '280px' }}
                className="absolute right-4 top-4 bg-white rounded-lg shadow-xl border border-slate-200 flex flex-col z-35 overflow-hidden select-none max-h-[80vh] overflow-y-auto"
                onMouseDown={(e) => e.stopPropagation()}
                onClick={(e) => e.stopPropagation()}
              >
              {/* Accordion 1: 常规 info */}
              <div 
                onClick={() => setInspectorExpanded(!inspectorExpanded)}
                className="p-3 border-b border-slate-200/80 bg-slate-50/50 flex items-center justify-between cursor-pointer"
              >
                <span className="text-xs font-bold text-slate-700">常规</span>
                <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${inspectorExpanded ? '' : '-rotate-90'}`} />
              </div>

              {inspectorExpanded && (
                <div className="p-3.5 space-y-3 bg-white">
                  
                  {/* Sync field: Node ID or Flow ID */}
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-semibold text-slate-500 block uppercase">
                      {selectedNode ? 'ID' : <><span className="text-red-500 font-bold pr-0.5">*</span>流程标识</>}
                    </label>
                    {selectedNode ? (
                      <input 
                        type="text" 
                        readOnly
                        className="w-full border border-slate-200 rounded px-2.5 py-1.5 outline-none text-xs text-slate-700 bg-slate-50/50 font-mono" 
                        value={selectedNode.id}
                      />
                    ) : (
                      <input 
                        type="text" 
                        className="w-full border border-slate-200 rounded px-2.5 py-1.5 outline-none focus:border-blue-500 text-xs text-slate-700 bg-slate-50/50 font-mono" 
                        value={flowId}
                        onChange={(e) => setFlowId(e.target.value)}
                        placeholder="流程标识 ID"
                      />
                    )}
                  </div>

                  {/* Sync field: Node Name or Flow Name */}
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-semibold text-slate-500 block uppercase">
                      {selectedNode ? '名称' : <><span className="text-red-500 font-bold pr-0.5">*</span>流程名称</>}
                    </label>
                    {selectedNode ? (
                      <input 
                        type="text" 
                        className="w-full border border-slate-200 rounded px-2.5 py-1.5 outline-none focus:border-blue-500 text-xs text-slate-700" 
                        value={selectedNode.label}
                        onChange={(e) => {
                          const newNodes = [...nodes];
                          const idx = newNodes.findIndex(n => n.id === selectedNodeId);
                          if (idx !== -1) {
                            newNodes[idx].label = e.target.value;
                            setNodes(newNodes);
                          }
                        }}
                        placeholder="节点名称"
                      />
                    ) : (
                      <input 
                        type="text" 
                        className="w-full border border-slate-200 rounded px-2.5 py-1.5 outline-none focus:border-blue-500 text-xs text-slate-700" 
                        value={flowName}
                        onChange={(e) => setFlowName(e.target.value)}
                        placeholder="流程的描述名称"
                      />
                    )}
                  </div>
                </div>
              )}

              {/* ONLY FOR TASK NODES: 用户任务 */}
              {isTaskNode && (
                <>
                  <div 
                    onClick={() => setUserTaskExpanded(!userTaskExpanded)}
                    className="p-3 border-t border-slate-200 bg-slate-50/50 flex items-center justify-between cursor-pointer"
                  >
                    <span className="text-xs font-bold text-slate-700">用户任务</span>
                    <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${userTaskExpanded ? '' : '-rotate-90'}`} />
                  </div>

                  {userTaskExpanded && (
                    <div className="p-3.5 space-y-3 bg-white border-t border-slate-100">
                      <div className="space-y-1.5 relative">
                        <label className="text-[11px] font-semibold text-slate-500 block uppercase">规则类型</label>
                        <select 
                          className="w-full border border-slate-200 rounded px-2 py-1.5 outline-none text-xs text-slate-700 bg-white"
                          value={ruleType}
                          onChange={(e) => setRuleType(e.target.value)}
                        >
                          <option value="指定成员">指定成员</option>
                          <option value="用户身份">用户身份</option>
                        </select>
                      </div>

                      {ruleType === '指定成员' && (
                        <div className="space-y-1.5">
                          <label className="text-[11px] font-semibold text-slate-500 block uppercase">指定用户</label>
                          <select 
                            className="w-full border border-slate-200 rounded px-2 py-1.5 outline-none text-xs text-slate-700 bg-white"
                            value={specifiedUsers[0] || ''}
                            onChange={(e) => setSpecifiedUsers([e.target.value])}
                          >
                            <option value="超级管理员">超级管理员</option>
                            <option value="普通用户">普通用户</option>
                          </select>
                        </div>
                      )}

                      {ruleType === '用户身份' && (
                        <div className="space-y-1.5">
                          <label className="text-[11px] font-semibold text-slate-500 block uppercase">用户身份 (多选)</label>
                          <select 
                            multiple
                            className="w-full border border-slate-200 rounded px-2 py-1.5 outline-none text-xs text-slate-700 bg-white h-20"
                            value={userIdentities}
                            onChange={(e) => {
                              const options = Array.from(e.target.selectedOptions);
                              setUserIdentities(options.map((o: any) => o.value));
                            }}
                          >
                            <option value="库管理员">库管理员</option>
                            <option value="队列/课题负责人">队列/课题负责人</option>
                          </select>
                        </div>
                      )}
                    </div>
                  )}

                  <div 
                    onClick={() => setMultiApprovalExpanded(!multiApprovalExpanded)}
                    className="p-3 border-t border-slate-200 bg-slate-50/50 flex items-center justify-between cursor-pointer"
                  >
                    <span className="text-xs font-bold text-slate-700">多人审批方式</span>
                    <ChevronRight className={`w-4 h-4 text-slate-400 transition-transform ${multiApprovalExpanded ? 'rotate-90' : ''}`} />
                  </div>
                  {multiApprovalExpanded && (
                    <div className="p-3.5 space-y-3 bg-white border-t border-slate-100 italic text-xs text-slate-500">
                      配置内容
                    </div>
                  )}
                </>
              )}

              {/* ONLY FOR EDGES: 流转条件 */}
              {!selectedNode && (
                <>
                  <div 
                    onClick={() => setConditionExpanded(!conditionExpanded)}
                    className="p-3 border-t border-slate-200 bg-slate-50/50 flex items-center justify-between cursor-pointer"
                  >
                    <span className="text-xs font-bold text-slate-700">流转条件</span>
                    <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${conditionExpanded ? '' : '-rotate-90'}`} />
                  </div>
                  
                  {conditionExpanded && (
                    <div className="p-3 space-y-3 bg-white border-t border-slate-100">
                        <div className="space-y-1.5">
                            <label className="text-[11px] font-semibold text-slate-500 block uppercase">流转类型</label>
                            <select 
                                className="w-full border border-slate-200 rounded px-2 py-1.5 outline-none text-xs text-slate-700 bg-white"
                                value={flowType}
                                onChange={(e) => setFlowType(e.target.value)}
                            >
                                <option>条件流转路径</option>
                            </select>
                        </div>
                        
                        <div className="space-y-1.5">
                            <label className="text-[11px] font-semibold text-slate-500 block uppercase">条件格式</label>
                            <select 
                                className="w-full border border-blue-400 rounded px-2 py-1.5 outline-none text-xs text-slate-700 bg-blue-50"
                                value={conditionFormat}
                                onChange={(e) => setConditionFormat(e.target.value)}
                            >
                                <option value="表达式">表达式</option>
                                <option value="脚本">脚本</option>
                                <option value="条件配置">条件配置</option>
                            </select>
                        </div>
                        
                        {conditionFormat === '条件配置' ? (
                            <div className="space-y-3 pt-2">
                                <div className="space-y-1.5">
                                    <label className="text-[11px] font-semibold text-slate-500 block uppercase">配置类型</label>
                                    <select 
                                        className="w-full border border-slate-200 rounded px-2 py-1.5 outline-none text-xs text-slate-700 bg-white"
                                        value={conditionConfigType}
                                        onChange={(e) => {
                                            setConditionConfigType(e.target.value as any);
                                            setDataTables([]);
                                            setVolumeThreshold(0);
                                            setApplicantIdentities([]);
                                        }}
                                    >
                                        <option value="">请选择配置类型</option>
                                        <option value="dataTable">数据表</option>
                                        <option value="volumeRange">数据量范围</option>
                                        <option value="applicantIdentity">申请人身份</option>
                                    </select>
                                </div>
                                {conditionConfigType === 'dataTable' && (
                                    <div className="space-y-1.5">
                                        <label className="text-[11px] font-semibold text-slate-500 block uppercase">数据表 (可多选)</label>
                                        <select 
                                            multiple 
                                            className="w-full border border-slate-200 rounded px-2 py-1.5 outline-none text-xs text-slate-700 bg-white h-20" 
                                            value={dataTables} 
                                            onChange={(e) => setDataTables(Array.from(e.target.selectedOptions, (option: any) => option.value))}
                                        >
                                            <option value="表A">表A</option>
                                            <option value="表B">表B</option>
                                            <option value="表C">表C</option>
                                        </select>
                                    </div>
                                )}
                                {conditionConfigType === 'volumeRange' && (
                                    <div className="space-y-1.5">
                                        <label className="text-[11px] font-semibold text-slate-500 block uppercase">数据量大于</label>
                                        <input 
                                            type="number"
                                            className="w-full border border-slate-200 rounded px-2 py-1.5 outline-none text-xs text-slate-700" 
                                            value={volumeThreshold} 
                                            onChange={(e) => setVolumeThreshold(Number(e.target.value))} 
                                            placeholder="请输入阈值" 
                                        />
                                    </div>
                                )}
                                {conditionConfigType === 'applicantIdentity' && (
                                    <div className="space-y-1.5">
                                        <label className="text-[11px] font-semibold text-slate-500 block uppercase">申请人身份 (可多选)</label>
                                        <select 
                                            multiple
                                            className="w-full border border-slate-200 rounded px-2 py-1.5 outline-none text-xs text-slate-700 bg-white h-20" 
                                            value={applicantIdentities} 
                                            onChange={(e) => setApplicantIdentities(Array.from(e.target.selectedOptions, (option: any) => option.value))}
                                        >
                                            <option value="库管理员">库管理员</option>
                                            <option value="队列/课题负责人">队列/课题负责人</option>
                                            <option value="普通成员">普通成员</option>
                                        </select>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="space-y-1.5">
                                <label className="text-[11px] font-semibold text-slate-500 block uppercase">{conditionFormat === '表达式' ? '表达式' : '脚本'}</label>
                                <textarea
                                    className="w-full border border-slate-200 rounded p-2 text-xs text-slate-700 h-16 resize-none"
                                    value={expression}
                                    onChange={(e) => setExpression(e.target.value)}
                                    placeholder={conditionFormat === '表达式' ? '请输入表达式' : '请输入脚本'}
                                />
                            </div>
                        )}
                    </div>
                  )}
                </>
              )}

              {/* Accordion 2: 自定义配置 collapsed */}
              <div 
                onClick={() => setCustomConfigExpanded(!customConfigExpanded)}
                className="p-3 border-t border-slate-200 bg-slate-50/20 flex items-center justify-between cursor-pointer"
              >
                <span className="text-xs font-bold text-slate-600">自定义配置</span>
                <ChevronRight className={`w-3.5 h-3.5 text-slate-400 transition-transform ${customConfigExpanded ? 'rotate-90' : ''}`} />
              </div>

              {customConfigExpanded && (
                <div className="p-3 text-[11px] text-slate-500 bg-white space-y-2 border-t border-slate-100">
                  <div className="flex justify-between items-center py-0.5">
                    <span>最后发布版本:</span>
                    <span className="font-mono bg-slate-100 px-1.5 py-0.5 rounded text-slate-600">V1.02.04</span>
                  </div>
                  <p className="text-[10px] text-slate-400 leading-relaxed bg-slate-50 p-1 rounded border border-dashed">
                    这里是流程图的个性化引擎自定义变量，编辑基础基本信息及拖拽卡片均可对逻辑属性实时热同步。
                  </p>
                </div>
              )}
              </div>
              );
            })()}

            {/* Custom BPMN.io platform attribution matching image exactly */}
            <div className="absolute right-4 bottom-4 text-slate-400 text-xs font-semibold tracking-wide font-mono select-none opacity-60">
              BPMN.io
            </div>

          </div>

        </div>
      </div>

      {/* --- Part 3: RIGHT PANEL Submitter permissions config --- */}
      <div className="hidden">
        
        {/* Header row */}
        <div className="p-4 py-3.5 border-b border-[#f1f5fd] select-none">
          <h2 className="font-bold text-[14px] text-slate-800 tracking-wide">提交人权限</h2>
        </div>

        {/* Configurations Forms widgets */}
        <div className="flex-1 p-5 space-y-7 overflow-y-auto custom-scrollbar text-xs">
          
          {/* Box 1 checkmark withdraw approval */}
          <div className="space-y-4">
            <label className="flex items-start gap-2.5 cursor-pointer group">
              <input 
                type="checkbox" 
                className="mt-0.5 w-4 h-4 rounded text-blue-600 border-slate-300 focus:ring-blue-500 accent-blue-600 hover:border-blue-500 cursor-pointer"
                checked={allowWithdraw}
                onChange={() => setAllowWithdraw(!allowWithdraw)}
              />
              <div className="space-y-1 select-none">
                <span className="font-bold text-[13px] text-slate-700 leading-tight group-hover:text-blue-600 transition-colors">
                  允许撤销审批中的申请
                </span>
                <p className="text-[#a0aec0] text-[11px] leading-relaxed select-none">
                  第一个审批节点通过后，提交人仍可撤销申请
                </p>
              </div>
            </label>
          </div>

          <span className="block h-px bg-[#f1f5fd] w-full" />

          {/* Box 2 Title Customizer Radio buttons */}
          <div className="space-y-3">
            <h3 className="font-bold text-[13px] text-slate-700 tracking-wide select-none">标题设置</h3>
            
            <div className="space-y-2.5">
              {/* Op 1: Display Name */}
              <label className="flex items-center gap-2.5 cursor-pointer group">
                <input 
                  type="radio" 
                  name="titleSettingRadio"
                  className="w-4 h-4 text-blue-600 accent-blue-600 border-slate-300 focus:ring-blue-500 cursor-pointer"
                  checked={titleSetting === 'flow-name'}
                  onChange={() => setTitleSetting('flow-name')}
                />
                <span className="text-slate-600 font-medium group-hover:text-blue-600 transition-colors text-[12px]">
                  展示流程名称
                </span>
              </label>

              {/* Op 2: Custom Title */}
              <label className="flex items-center gap-2.5 cursor-pointer group">
                <input 
                  type="radio" 
                  name="titleSettingRadio"
                  className="w-4 h-4 text-blue-600 accent-blue-600 border-slate-300 focus:ring-blue-500 cursor-pointer"
                  checked={titleSetting === 'custom'}
                  onChange={() => setTitleSetting('custom')}
                />
                <span className="text-slate-600 font-medium group-hover:text-blue-600 transition-colors text-[12px]">
                  自定义标题
                </span>
              </label>
            </div>
          </div>

          <span className="block h-px bg-[#f1f5fd] w-full" />

          {/* Box 3 Summary Customizer Radio buttons */}
          <div className="space-y-3">
            <h3 className="font-bold text-[13px] text-slate-700 tracking-wide select-none">摘要设置</h3>
            
            <div className="space-y-2.5">
              {/* Op 1: Display first 3 fields */}
              <label className="flex items-center gap-2.5 cursor-pointer group">
                <input 
                  type="radio" 
                  name="summaryRadio"
                  className="w-4 h-4 text-blue-600 accent-blue-600 border-slate-300 focus:ring-blue-500 cursor-pointer"
                  checked={summarySetting === 'first-3'}
                  onChange={() => setSummarySetting('first-3')}
                />
                <span className="text-slate-600 font-medium group-hover:text-blue-600 transition-colors text-[12px]">
                  展示表单前 3 个字段
                </span>
              </label>

              {/* Op 2: Custom Summary */}
              <label className="flex items-center gap-2.5 cursor-pointer group">
                <input 
                  type="radio" 
                  name="summaryRadio"
                  className="w-4 h-4 text-blue-600 accent-blue-600 border-slate-300 focus:ring-blue-500 cursor-pointer"
                  checked={summarySetting === 'custom'}
                  onChange={() => setSummarySetting('custom')}
                />
                <span className="text-slate-600 font-medium group-hover:text-blue-600 transition-colors text-[12px]">
                  自定义摘要
                </span>
              </label>
            </div>
          </div>

        </div>
      </div>
          </>
        )}
      </div>

      {/* Node Property Config Drawer (设置中间属性右侧抽屉) */}
      <AnimatePresence>
        {selectedNodeId && (() => {
          const node = nodes.find(n => n.id === selectedNodeId);
          if (!node) return null;
          return (
            <div 
              className="fixed inset-0 z-[100] flex justify-end bg-slate-900/30 backdrop-blur-[2px]" 
              onClick={() => setSelectedNodeId(null)}
            >
              <motion.div 
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 220 }}
                className="bg-white w-[460px] h-full shadow-[-4px_0_24px_rgba(0,0,0,0.08)] border-l border-slate-200 flex flex-col" 
                onClick={(e) => e.stopPropagation()}
              >
                {/* Header */}
                <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between select-none shrink-0">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                      <Settings className="w-4 h-4" />
                    </div>
                    <h3 className="font-bold text-[15px] text-slate-800">设置中间属性</h3>
                  </div>
                  <button 
                    onClick={() => setSelectedNodeId(null)}
                    className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Tabs selection */}
                <div className="px-5 py-2.5 bg-slate-50/50 border-b border-slate-100 shrink-0">
                  <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200/40 select-none">
                    {[
                      { id: 'basic', label: '基础设置' },
                      { id: 'assignee', label: '办理人设置' }
                    ].map(tab => {
                      const isActive = nodeActiveTab === tab.id;
                      return (
                        <button
                          key={tab.id}
                          type="button"
                          onClick={() => setNodeActiveTab(tab.id as any)}
                          className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg text-xs font-bold transition-all duration-200 ${
                            isActive 
                              ? 'bg-blue-600 text-white shadow-sm' 
                              : 'text-slate-500 hover:text-slate-800 hover:bg-white/50'
                          }`}
                        >
                          <span>{tab.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Body Content */}
                <div className="flex-1 p-5 overflow-y-auto space-y-5 custom-scrollbar">
                  {nodeActiveTab === 'basic' && (
                    <div className="space-y-4 animate-fade-in">
                      {/* Section 1: 基础配置 */}
                      <div className="bg-slate-50/50 border border-slate-200/60 rounded-xl p-4.5 space-y-4 shadow-sm">
                        <div className="flex items-center gap-2 pb-2 border-b border-slate-200/40 select-none">
                          <User className="w-4 h-4 text-blue-500" />
                          <span className="font-bold text-[13px] text-slate-700">基础配置</span>
                        </div>

                        {/* 节点名称 */}
                        <div className="space-y-1.5">
                          <label className="text-slate-600 font-bold text-xs block select-none">节点名称:</label>
                          <textarea 
                            value={node.label || ''}
                            onChange={(e) => {
                              const val = e.target.value;
                              setNodes(prev => prev.map(item => item.id === node.id ? { ...item, label: val } : item));
                            }}
                            className="w-full border border-slate-200 rounded-lg px-3 py-2 outline-none text-xs text-slate-700 bg-white h-18 focus:border-blue-500 transition-colors resize-none"
                            placeholder="请输入节点名称"
                          />
                        </div>

                        {/* 协作方式 */}
                        <div className="space-y-2">
                          <label className="text-slate-600 font-bold text-xs block select-none">协作方式:</label>
                          <div className="flex items-center gap-2.5">
                            {[
                              { id: 'or', label: '或签' },
                              { id: 'and', label: '会签' }
                            ].map(opt => {
                              const currentMode = node.cooperationMode || 'or';
                              const isSelected = currentMode === opt.id;
                              return (
                                <button
                                  key={opt.id}
                                  type="button"
                                  onClick={() => {
                                    setNodes(prev => prev.map(item => item.id === node.id ? { ...item, cooperationMode: opt.id as any } : item));
                                  }}
                                  className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 border rounded-xl text-xs font-semibold transition-all duration-200 ${
                                    isSelected 
                                      ? 'bg-blue-50/50 border-blue-500 text-blue-600 shadow-sm' 
                                      : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/50 text-slate-500'
                                  }`}
                                >
                                  <div className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center transition-colors ${
                                    isSelected ? 'border-blue-500 bg-blue-500' : 'border-slate-300 bg-white'
                                  }`}>
                                    {isSelected && <div className="w-1 h-1 rounded-full bg-white" />}
                                  </div>
                                  <span>{opt.label}</span>
                                  <HelpCircle className="w-3.5 h-3.5 text-slate-300 ml-0.5 shrink-0" />
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {nodeActiveTab === 'assignee' && (
                    <div className="space-y-4 animate-fade-in">
                      <div className="bg-slate-50/50 border border-slate-200/60 rounded-xl p-4.5 space-y-4 shadow-sm">
                        {/* Title Header */}
                        <div className="flex items-center gap-2 pb-2.5 border-b border-slate-200/40 select-none">
                          <Users className="w-4 h-4 text-blue-500" />
                          <span className="font-bold text-[13px] text-blue-600">办理人设置</span>
                        </div>

                        {/* Assignee Table */}
                        <div className="border border-slate-200/80 rounded-xl bg-white overflow-hidden shadow-sm">
                          {/* Table Headers */}
                          <div className="grid grid-cols-[2fr_1fr] bg-slate-50/70 border-b border-slate-200/60 px-4 py-2.5 text-slate-500 font-bold text-xs select-none">
                            <div className="text-left">权限名称</div>
                            <div className="text-right">操作</div>
                          </div>

                          {/* Table Content */}
                          {(!node.assigneeList || node.assigneeList.length === 0) ? (
                            <div className="py-9 text-center text-slate-400 text-xs select-none">
                              暂无数据
                            </div>
                          ) : (
                            <div className="divide-y divide-slate-100 max-h-[220px] overflow-y-auto">
                              {node.assigneeList.map((item, idx) => (
                                <div key={idx} className="grid grid-cols-[2fr_1fr] px-4 py-2 items-center text-slate-700 text-xs hover:bg-slate-50/50 transition-colors">
                                  <div className="text-left font-medium truncate text-slate-700" title={item.permission}>
                                    {item.permission}
                                  </div>
                                  <div className="text-right">
                                    <button
                                      type="button"
                                      onClick={() => {
                                        const nextList = (node.assigneeList || []).filter((_, i) => i !== idx);
                                        setNodes(prev => prev.map(n => n.id === node.id ? { ...n, assigneeList: nextList } : n));
                                        showToast('删除办理人成功');
                                      }}
                                      className="w-8 h-8 rounded bg-red-500 hover:bg-red-600 text-white transition-colors inline-flex items-center justify-center cursor-pointer shadow-sm"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* Dashed Buttons */}
                        <div className="flex items-center gap-3 select-none">
                          <button
                            type="button"
                            onClick={() => {
                              setIsSelectingPreset(true);
                            }}
                            className="w-full py-2 border border-dashed border-slate-300 hover:border-slate-400 hover:bg-slate-50/20 text-slate-500 rounded-lg text-xs font-bold transition-all duration-200 flex items-center justify-center gap-1 cursor-pointer"
                          >
                            <span>选择</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                </div>
              </motion.div>
            </div>
          );
        })()}
      </AnimatePresence>

      {/* Edge Property Config Drawer (设置边属性右侧抽屉) */}
      <AnimatePresence>
        {selectedEdgeId && (() => {
          const edge = edges.find(e => e.id === selectedEdgeId);
          if (!edge) return null;
          return (
            <div 
              className="fixed inset-0 z-[100] flex justify-end bg-slate-900/30 backdrop-blur-[2px]" 
              onClick={() => setSelectedEdgeId(null)}
            >
              <motion.div 
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 220 }}
                className="bg-white w-[380px] h-full shadow-[-4px_0_24px_rgba(0,0,0,0.08)] border-l border-slate-200 flex flex-col" 
                onClick={(e) => e.stopPropagation()}
              >
                {/* Header */}
                <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between select-none shrink-0">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                      <GitFork className="w-4 h-4" />
                    </div>
                    <h3 className="font-bold text-[15px] text-slate-800">设置边属性</h3>
                  </div>
                  <button 
                    onClick={() => setSelectedEdgeId(null)}
                    className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Body */}
                <div className="flex-1 p-5 overflow-y-auto space-y-5">
                  <div className="bg-slate-50/70 border border-slate-200/50 rounded-lg p-4 space-y-4">
                    {/* Inner Title */}
                    <div className="flex items-center gap-2 pb-2 border-b border-slate-200/40 select-none">
                      <span className="font-bold text-[13px] text-slate-700">跳转条件配置</span>
                    </div>

                    {/* Field 1: 跳转名称 */}
                    <div className="space-y-1.5">
                      <label className="text-slate-600 font-bold text-xs block select-none">跳转名称</label>
                      <input 
                        type="text" 
                        value={edge.label || ''}
                        onChange={(e) => {
                          const val = e.target.value;
                          setEdges(prev => prev.map(item => item.id === edge.id ? { ...item, label: val } : item));
                        }}
                        className="w-full border border-slate-200 rounded px-3 py-1.5 outline-none text-xs text-slate-700 bg-white h-9 focus:border-blue-500 transition-colors placeholder-slate-400"
                        placeholder="请输入跳转名称（留空则按条件自动生成）"
                      />
                    </div>

                    {/* Field 2: 跳转类型 */}
                    <div className="space-y-1.5">
                      <label className="text-slate-600 font-bold text-xs block select-none">跳转类型</label>
                      <select
                        value="审核通过"
                        onChange={(e) => {
                          const val = e.target.value;
                          setEdges(prev => prev.map(item => item.id === edge.id ? { ...item, condType: val } : item));
                        }}
                        className="w-full border border-slate-200 rounded px-3 py-1.5 outline-none text-xs text-slate-700 bg-white h-9 focus:border-blue-500 transition-colors cursor-pointer"
                      >
                        <option value="审核通过">审核通过</option>
                      </select>
                    </div>

                    {/* --- FEATURE: 3选1条件配置 (3-choose-1 Condition configuration) --- */}
                    {(() => {
                      const mode = edge.condSelectMode || 'userIdentity';
                      
                      return (
                        <div className="space-y-4 pt-1 border-t border-slate-100">
                          <div className="space-y-1.5">
                            <label className="text-slate-600 font-bold text-xs block select-none">跳转条件类型</label>
                            <select
                              value={mode}
                              onChange={(e) => {
                                const selectedKey = e.target.value;
                                setEdges(prev => prev.map(item => {
                                  if (item.id === edge.id) {
                                    const updated = { ...item, condSelectMode: selectedKey as any };
                                    // Enforce mutually exclusive state upon switching
                                    if (selectedKey !== 'userIdentity') {
                                      updated.condUserIdentities = [];
                                    }
                                    if (selectedKey !== 'dataVolume') {
                                      updated.condDataVolumeMin = '';
                                      updated.condDataVolumeMax = '';
                                    }
                                    if (selectedKey !== 'dataTable') {
                                      updated.condDataTables = [];
                                    }
                                    if (selectedKey !== 'spel') {
                                      updated.condSpel = '';
                                    }
                                    if (selectedKey !== 'default') {
                                      updated.condDefaultExpr = '';
                                    }
                                    return updated;
                                  }
                                  return item;
                                }));
                              }}
                              className="w-full border border-slate-200 rounded px-3 py-1.5 outline-none text-xs text-slate-700 bg-white h-9 focus:border-blue-500 transition-colors cursor-pointer font-bold"
                            >
                              <option value="userIdentity">用户身份</option>
                              <option value="dataTable">指标表</option>
                              <option value="dataVolume">病历数</option>
                              <option value="spel">spel</option>
                              <option value="default">默认</option>
                            </select>
                          </div>

                          {/* --- Render only selected choice --- */}
                          {mode === 'userIdentity' && (() => {
                            const selectedIdentity = edge.condUserIdentities?.[0] || '';
                            const options = ['普通用户', '库管理员', '课题负责人', '收藏负责人'];

                            return (
                              <div className="space-y-2 animate-fade-in">
                                <label className="text-slate-500 font-bold text-[11px] block select-none uppercase tracking-wider">
                                  用户身份
                                </label>
                                <div className="space-y-1.5">
                                  {options.map((opt) => {
                                    const isSelected = selectedIdentity === opt;
                                    return (
                                      <button
                                        key={opt}
                                        type="button"
                                        onClick={() => {
                                          setEdges(prev => prev.map(item => item.id === edge.id ? { ...item, condUserIdentities: [opt] } : item));
                                        }}
                                        className={`w-full text-left px-3 py-2 rounded-lg border transition-all duration-200 cursor-pointer flex items-center gap-3 select-none ${
                                          isSelected
                                            ? 'bg-blue-50/60 border-blue-500/80 shadow-[0_1px_4px_rgba(59,130,246,0.06)]'
                                            : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/50'
                                        }`}
                                      >
                                        <div className="shrink-0">
                                          <div className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center transition-colors ${
                                            isSelected ? 'border-blue-500 bg-blue-500' : 'border-slate-300 bg-white'
                                          }`}>
                                            {isSelected && (
                                              <div className="w-1 h-1 rounded-full bg-white" />
                                            )}
                                          </div>
                                        </div>
                                        <span className={`text-xs font-bold transition-colors ${isSelected ? 'text-blue-700' : 'text-slate-700'}`}>
                                          {opt}
                                        </span>
                                      </button>
                                    );
                                  })}
                                </div>
                              </div>
                            );
                          })()}

                          {mode === 'dataVolume' && (
                            <div className="space-y-2 animate-fade-in">
                              <label className="text-slate-500 font-bold text-[11px] block select-none uppercase tracking-wider">
                                最大数量 (条)
                              </label>
                              <input 
                                type="number" 
                                min="0"
                                placeholder="请输入最大数量，不填则默认无上限"
                                value={edge.condDataVolumeMax || ''}
                                onChange={(e) => {
                                  const val = e.target.value;
                                  setEdges(prev => prev.map(item => item.id === edge.id ? { ...item, condDataVolumeMax: val, condDataVolumeMin: '' } : item));
                                }}
                                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-700 bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-100 transition-all outline-none"
                              />
                            </div>
                          )}

                          {mode === 'dataTable' && (() => {
                            const selectedTables = edge.condDataTables || [];
                            const tables = ['病历信息表', '临床表型表', '测序样本表', '生存随访表', '药品成分表', '基因组变异表'];
                            
                            const toggleTable = (tableName: string) => {
                              const newTables = selectedTables.includes(tableName)
                                ? selectedTables.filter(t => t !== tableName)
                                : [...selectedTables, tableName];
                              setEdges(prev => prev.map(item => item.id === edge.id ? { ...item, condDataTables: newTables } : item));
                            };

                            const filteredTables = tables.filter(table => 
                              table.toLowerCase().includes(tableSearch.toLowerCase())
                            );

                            return (
                              <div className="space-y-2 animate-fade-in">
                                <label className="text-slate-500 font-bold text-[11px] block select-none uppercase tracking-wider">
                                  指标表
                                </label>
                                
                                <div className="relative">
                                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                                  <input
                                    type="text"
                                    placeholder="搜索指标表..."
                                    value={tableSearch}
                                    onChange={(e) => setTableSearch(e.target.value)}
                                    className="w-full border border-slate-200 rounded-lg pl-8 pr-2.5 py-1 text-xs text-slate-700 bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-100 transition-all placeholder:text-slate-400 outline-none h-8"
                                  />
                                  {tableSearch && (
                                    <button 
                                      type="button"
                                      onClick={() => setTableSearch('')}
                                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                                    >
                                      <X className="w-3.5 h-3.5" />
                                    </button>
                                  )}
                                </div>

                                <div className="bg-white border border-slate-200 rounded-lg p-2.5 max-h-[140px] overflow-y-auto space-y-1.5 custom-scrollbar">
                                  {filteredTables.length > 0 ? (
                                    filteredTables.map((table) => {
                                      const isChecked = selectedTables.includes(table);
                                      return (
                                        <label 
                                          key={table} 
                                          className="flex items-center gap-2 px-2 py-1 rounded hover:bg-slate-50 cursor-pointer select-none transition-colors"
                                        >
                                          <input 
                                            type="checkbox"
                                            checked={isChecked}
                                            onChange={() => toggleTable(table)}
                                            className="w-3.5 h-3.5 rounded text-blue-600 accent-blue-600 border-slate-300 focus:ring-blue-500 cursor-pointer"
                                          />
                                          <span className={`text-[11px] font-medium transition-colors ${isChecked ? 'text-blue-600 font-bold' : 'text-slate-600'}`}>
                                            {table}
                                          </span>
                                        </label>
                                      );
                                    })
                                  ) : (
                                    <div className="text-[11px] text-slate-400 text-center py-4 select-none">
                                      未查找到相关指标表
                                    </div>
                                  )}
                                </div>
                              </div>
                            );
                          })()}

                          {mode === 'spel' && (
                            <div className="space-y-2 animate-fade-in">
                              <label className="text-slate-500 font-bold text-[11px] block select-none uppercase tracking-wider">
                                SpEL 表达式
                              </label>
                              <input 
                                type="text"
                                placeholder="输入 SpEL 表达式，如: #user.identity == '普通用户'"
                                value={edge.condSpel || ''}
                                onChange={(e) => {
                                  const val = e.target.value;
                                  setEdges(prev => prev.map(item => item.id === edge.id ? { ...item, condSpel: val } : item));
                                }}
                                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-700 bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-100 transition-all outline-none"
                              />
                            </div>
                          )}

                          {mode === 'default' && (
                            <div className="space-y-2 animate-fade-in">
                              <label className="text-slate-500 font-bold text-[11px] block select-none uppercase tracking-wider">
                                表达式
                              </label>
                              <input 
                                type="text"
                                placeholder="输入表达式，如: #user.identity == '普通用户'"
                                value={edge.condDefaultExpr || ''}
                                onChange={(e) => {
                                  const val = e.target.value;
                                  setEdges(prev => prev.map(item => item.id === edge.id ? { ...item, condDefaultExpr: val } : item));
                                }}
                                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-700 bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-100 transition-all outline-none"
                              />
                            </div>
                          )}
                        </div>
                      );
                    })()}

                  </div>
                </div>
              </motion.div>
            </div>
          );
        })()}
      </AnimatePresence>

      {/* 人员选择 弹出窗 */}
      {typeof document !== 'undefined' && createPortal(
        <AnimatePresence>
          {isSelectingPreset && (
            <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-900/40 backdrop-blur-[2px]" onClick={() => setIsSelectingPreset(false)}>
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="bg-white w-[92%] max-w-5xl h-[85vh] max-h-[680px] rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-slate-200"
                onClick={(e) => e.stopPropagation()}
              >
              {/* Header */}
              <div className="px-6 py-4.5 border-b border-slate-100 flex items-center justify-between select-none shrink-0">
                <span className="font-bold text-base text-slate-800">人员选择</span>
                <button
                  onClick={() => setIsSelectingPreset(false)}
                  className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Tabs Row */}
              <div className="px-6 py-3 border-b border-slate-100/60 bg-slate-50/20 flex items-center gap-4 shrink-0">
                <button
                  onClick={() => {
                    setPersonnelActiveTab('user');
                    setSelectedPresetIndices([]);
                  }}
                  className={`font-bold text-xs px-4 py-1.5 rounded-lg transition-all cursor-pointer ${
                    personnelActiveTab === 'user'
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-slate-500 hover:text-slate-700 hover:bg-slate-100/60'
                  }`}
                >
                  用户
                </button>
                <button
                  onClick={() => {
                    setPersonnelActiveTab('spel');
                    setSelectedPresetIndices([]);
                  }}
                  className={`font-bold text-xs px-4 py-1.5 rounded-lg transition-all cursor-pointer ${
                    personnelActiveTab === 'spel'
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-slate-500 hover:text-slate-700 hover:bg-slate-100/60'
                  }`}
                >
                  SpEL表达式
                </button>
              </div>

              {/* Main Content columns */}
              <div className={`flex-1 min-h-0 grid p-5 gap-5 overflow-hidden ${
                personnelActiveTab === 'spel' ? 'grid-cols-1' : 'grid-cols-[240px_1fr]'
              }`}>
                {/* Left col: 组织架构 */}
                {personnelActiveTab !== 'spel' && (
                  <div className="border border-slate-200 rounded-xl bg-slate-50/20 flex flex-col overflow-hidden">
                    <div className="p-3 border-b border-slate-150 bg-white flex items-center justify-between select-none shrink-0">
                      <div className="flex items-center gap-2 text-slate-700 font-bold text-xs">
                        <FolderOpen className="w-4 h-4 text-blue-500" />
                        <span>组织架构</span>
                      </div>
                      <ChevronDown className="w-4 h-4 text-slate-400" />
                    </div>
                    
                    <div className="p-3 shrink-0 bg-white border-b border-slate-100">
                      <div className="relative">
                        <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          value={deptSearch}
                          onChange={(e) => setDeptSearch(e.target.value)}
                          placeholder="搜索部门名称"
                          className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-700 outline-none focus:border-blue-500 focus:bg-white transition-colors"
                        />
                      </div>
                    </div>

                    <div className="flex-1 flex flex-col items-center justify-center text-slate-400 text-xs py-10 select-none bg-white font-medium">
                      暂无数据
                    </div>
                  </div>
                )}

                {/* Right col: Filters + Table */}
                <div className="flex flex-col min-h-0 space-y-4">
                  {/* Filters Card */}
                  <div className="bg-slate-50/70 border border-slate-200/60 rounded-xl p-4.5 space-y-4 shadow-sm shrink-0">
                    {/* Filter Inputs Grid */}
                    <div className="grid gap-x-3.5 gap-y-3 items-center text-xs text-slate-600 font-bold select-none grid-cols-[auto_1fr_auto_1fr]">
                      <div className="text-right whitespace-nowrap">权限编码</div>
                      <input
                        type="text"
                        value={searchPermissionCode}
                        onChange={(e) => setSearchPermissionCode(e.target.value)}
                        placeholder="请输入权限编码"
                        className="bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-700 outline-none focus:border-blue-500 transition-colors w-full h-9"
                      />

                      <div className="text-right whitespace-nowrap">权限名称</div>
                      <input
                        type="text"
                        value={searchPermissionName}
                        onChange={(e) => setSearchPermissionName(e.target.value)}
                        placeholder="请输入权限名称"
                        className="bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-700 outline-none focus:border-blue-500 transition-colors w-full h-9"
                      />
                    </div>

                    {/* Filter Buttons */}
                    <div className="flex items-center justify-between pt-1 border-t border-slate-100/40">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            showToast('搜索完成');
                          }}
                          className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-1.5 rounded-lg shadow-sm transition-colors flex items-center gap-1.5 cursor-pointer"
                        >
                          <Search className="w-3.5 h-3.5" />
                          <span>搜索</span>
                        </button>
                        <button
                          type="button"
                          onClick={handlePresetReset}
                          className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs font-bold px-4 py-1.5 rounded-lg transition-colors cursor-pointer"
                        >
                          重置
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={handlePresetConfirm}
                        className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-5 py-1.5 rounded-lg shadow-sm transition-colors cursor-pointer"
                      >
                        确定
                      </button>
                    </div>
                  </div>

                  {/* Preset list data table */}
                  <div className="border border-slate-200 rounded-xl bg-white flex-1 min-h-0 flex flex-col overflow-hidden shadow-sm">
                    <div className="flex-1 overflow-auto custom-scrollbar">
                      <table className="w-full text-xs text-left text-slate-600 border-collapse">
                        <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-bold sticky top-0 select-none z-10">
                          <tr>
                            <th className="px-4 py-3 w-10 text-center">
                              <input
                                type="checkbox"
                                checked={
                                  personnelActiveTab === 'user'
                                    ? filteredPresets.length > 0 && filteredPresets.every(p => selectedPresetIndices.includes(PERSONNEL_PRESETS.indexOf(p)))
                                    : filteredSpelPresets.length > 0 && filteredSpelPresets.every(p => selectedPresetIndices.includes(SPEL_PRESETS.indexOf(p)))
                                }
                                onChange={handleSelectAllPreset}
                                className="w-3.5 h-3.5 text-blue-600 accent-blue-600 border-slate-300 rounded cursor-pointer"
                              />
                            </th>
                            <th className="px-4 py-3">权限名称</th>
                            <th className="px-4 py-3">权限编码</th>
                            <th className="px-4 py-3">入库主键</th>
                            <th className="px-4 py-3">权限分组</th>
                            <th className="px-4 py-3">创建时间</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {personnelActiveTab === 'user' ? (
                            filteredPresets.map((preset) => {
                              const origIdx = PERSONNEL_PRESETS.indexOf(preset);
                              const isSelected = selectedPresetIndices.includes(origIdx);
                              return (
                                <tr
                                  key={origIdx}
                                  onClick={() => handleTogglePresetRow(origIdx)}
                                  className={`hover:bg-slate-50/50 transition-colors cursor-pointer ${
                                    isSelected ? 'bg-blue-50/20' : ''
                                  }`}
                                >
                                  <td className="px-4 py-3 text-center" onClick={(e) => e.stopPropagation()}>
                                    <input
                                      type="checkbox"
                                      checked={isSelected}
                                      onChange={() => handleTogglePresetRow(origIdx)}
                                      className="w-3.5 h-3.5 text-blue-600 accent-blue-600 border-slate-300 rounded cursor-pointer"
                                    />
                                  </td>
                                  <td className="px-4 py-3 font-bold text-slate-700">{preset.name}</td>
                                  <td className="px-4 py-3 text-slate-500 font-mono">{preset.code}</td>
                                  <td className="px-4 py-3 text-slate-600 font-mono">{preset.key}</td>
                                  <td className="px-4 py-3 text-slate-500">{preset.group}</td>
                                  <td className="px-4 py-3 text-slate-400 font-mono">{preset.created}</td>
                                </tr>
                              );
                            })
                          ) : (
                            filteredSpelPresets.map((preset) => {
                              const origIdx = SPEL_PRESETS.indexOf(preset);
                              const isSelected = selectedPresetIndices.includes(origIdx);
                              return (
                                <tr
                                  key={origIdx}
                                  onClick={() => handleTogglePresetRow(origIdx)}
                                  className={`hover:bg-slate-50/50 transition-colors cursor-pointer ${
                                    isSelected ? 'bg-blue-50/20' : ''
                                  }`}
                                >
                                  <td className="px-4 py-3 text-center" onClick={(e) => e.stopPropagation()}>
                                    <input
                                      type="checkbox"
                                      checked={isSelected}
                                      onChange={() => handleTogglePresetRow(origIdx)}
                                      className="w-3.5 h-3.5 text-blue-600 accent-blue-600 border-slate-300 rounded cursor-pointer"
                                    />
                                  </td>
                                  <td className="px-4 py-3 font-bold text-slate-700">{preset.name}</td>
                                  <td className="px-4 py-3 text-slate-500 font-mono">{preset.code}</td>
                                  <td className="px-4 py-3 text-slate-600 font-mono">{preset.key}</td>
                                  <td className="px-4 py-3 text-slate-500">{preset.group}</td>
                                  <td className="px-4 py-3 text-slate-400 font-mono">{preset.created}</td>
                                </tr>
                              );
                            })
                          )}
                          {((personnelActiveTab === 'user' && filteredPresets.length === 0) ||
                            (personnelActiveTab === 'spel' && filteredSpelPresets.length === 0)) && (
                            <tr>
                              <td colSpan={6} className="text-center text-slate-400 py-12 select-none">
                                暂无数据
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>

                    {/* Pagination Row */}
                    {personnelActiveTab === 'spel' && (
                      <div className="px-4 py-3 border-t border-slate-100 bg-slate-50/40 flex items-center justify-start text-xs text-slate-500 gap-3.5 select-none shrink-0">
                        <div className="flex items-center gap-1.5">
                          <button type="button" className="p-1 hover:bg-slate-200/60 rounded text-slate-400 transition-colors cursor-not-allowed">
                            <ChevronLeft className="w-3.5 h-3.5" />
                          </button>
                          <span className="px-2 py-0.5 text-blue-600 font-bold bg-blue-50/50 rounded border border-blue-100/30">1</span>
                          <button type="button" className="p-1 hover:bg-slate-200/60 rounded text-slate-400 transition-colors cursor-not-allowed">
                            <ChevronRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span>前往</span>
                          <input 
                            type="text" 
                            defaultValue="1" 
                            disabled
                            className="w-8 h-6 text-center border border-slate-200 rounded bg-white text-slate-700 outline-none text-xs font-bold"
                          />
                          <span>页</span>
                        </div>
                        <div className="text-slate-400 ml-1">
                          共 1 条
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </div>
  );
}

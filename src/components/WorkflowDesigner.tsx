import React, { useState, useEffect, useRef } from 'react';
import { 
  Settings, 
  ChevronDown, 
  ChevronRight, 
  ChevronLeft,
  RotateCcw, 
  User, 
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
  Trash2
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
  type: 'start' | 'end' | 'gateway-or' | 'gateway-and' | 'task';
  label: string;
  x: number;
  y: number;
  width: number;
  height: number;
  subType?: '|||' | '≡' | '';
}

interface BPMNEdge {
  id: string;
  from: string;
  to: string;
  label?: string;
  routeType: 'straight-h' | 'straight-v' | 'right-down' | 'right-down-left' | 'custom' | 'horizontal-straight';
}

interface WorkflowDesignerProps {
  workflow: WorkflowItem;
  onSave: (updated: WorkflowItem) => void;
  onClose: () => void;
}

// --- Hardcoded Preset Diagrams for absolute screenshot look ---
const DEFAULT_NODES: BPMNNode[] = [
  { id: 'start', type: 'start', label: '开始', x: 270, y: 150, width: 36, height: 36 },
  { id: 'gate1', type: 'gateway-or', label: '判断申请人', x: 380, y: 150, width: 46, height: 46 },
  { id: 'task1', type: 'task', label: '课题PI审批', x: 380, y: 290, width: 110, height: 75, subType: '|||' },
  { id: 'gate2', type: 'gateway-and', label: '判断报告', x: 570, y: 290, width: 46, height: 46 },
  { id: 'task2', type: 'task', label: '药剂科审批', x: 570, y: 440, width: 110, height: 75, subType: '≡' },
  { id: 'task3', type: 'task', label: '遗传办公室审批', x: 740, y: 290, width: 110, height: 75, subType: '' },
  { id: 'task4', type: 'task', label: '科教科审批', x: 570, y: 590, width: 110, height: 75, subType: '≡' },
  { id: 'task5', type: 'task', label: '信息科审批', x: 570, y: 740, width: 110, height: 75, subType: '≡' },
  { id: 'end', type: 'end', label: '结束', x: 740, y: 740, width: 36, height: 36 },
];

const DEFAULT_EDGES: BPMNEdge[] = [
  { id: 'e1', from: 'start', to: 'gate1', label: '', routeType: 'straight-h' },
  { id: 'e2', from: 'gate1', to: 'task1', label: '否', routeType: 'straight-v' },
  { id: 'e3', from: 'gate1', to: 'gate2', label: '是', routeType: 'right-down' },
  { id: 'e4', from: 'task1', to: 'gate2', label: '', routeType: 'straight-h' },
  { id: 'e5', from: 'gate2', to: 'task2', label: '', routeType: 'straight-v' },
  { id: 'e6', from: 'gate2', to: 'task3', label: '', routeType: 'straight-h' },
  { id: 'e7', from: 'task2', to: 'task4', label: '', routeType: 'straight-v' },
  { id: 'e8', from: 'task3', to: 'task4', label: '', routeType: 'right-down-left' },
  { id: 'e9', from: 'task4', to: 'task5', label: '', routeType: 'straight-v' },
  { id: 'e10', from: 'task5', to: 'end', label: '', routeType: 'straight-h' },
];

export function WorkflowDesigner({ workflow, onSave, onClose }: WorkflowDesignerProps) {
  // Sync state with parent details
  const [flowId, setFlowId] = useState(workflow.id || 'p_' + Date.now().toString().slice(3));
  const [flowName, setFlowName] = useState(workflow.name || '新建流程_复制');
  const [category, setCategory] = useState(workflow.category || '数据导出');
  
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

  
  // New state to control inspector visibility
  const [isInspectorVisible, setIsInspectorVisible] = useState(false);

  // New state variables for condition configuration
  const [dataTables, setDataTables] = useState<string[]>([]);
  const [volumeThreshold, setVolumeThreshold] = useState<number>(0);
  const [applicantIdentities, setApplicantIdentities] = useState<string[]>([]);
  const [expression, setExpression] = useState('');

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
  const handleAddNodeToCanvas = (type: 'start' | 'end' | 'gateway-or' | 'gateway-and' | 'task') => {
    const nextOffset = nodes.length * 20;
    const labels = {
      'start': '新开始节点',
      'end': '新结束节点',
      'gateway-or': '审批决策判定',
      'gateway-and': '并行同步验证',
      'task': '新增办理审批任务'
    };
    const dimensions = {
      'start': { w: 36, h: 36 },
      'end': { w: 36, h: 36 },
      'gateway-or': { w: 46, h: 46 },
      'gateway-and': { w: 46, h: 46 },
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
      // Direct right layout
      return `M ${fromRight} ${from.y} L ${toLeft} ${to.y}`;
    }

    if (edge.routeType === 'straight-v') {
      // Direct down layout
      return `M ${from.x} ${fromBottom} L ${to.x} ${toTop}`;
    }

    if (edge.routeType === 'right-down') {
      // Gateway 1 '是' direction
      return `M ${fromRight} ${from.y} L ${to.x} ${from.y} L ${to.x} ${toTop}`;
    }

    if (edge.routeType === 'right-down-left') {
      // Task 3 '遗传办公室审批' right connect down and left to Task 4 '科教科审批'
      const startX = fromRight;
      const startY = from.y;
      const bendX = fromRight + 30; // goes right by 30px
      const endX = toRight;
      const endY = to.y;
      return `M ${startX} ${startY} L ${bendX} ${startY} L ${bendX} ${endY} L ${endX} ${endY}`;
    }

    // Default Fallback adaptive orthgonal router
    if (Math.abs(from.y - to.y) < 15) {
      return `M ${fromRight} ${from.y} L ${toLeft} ${to.y}`;
    } else {
      return `M ${fromRight} ${from.y} L ${(fromRight + toLeft) / 2} ${from.y} L ${(fromRight + toLeft) / 2} ${to.y} L ${toLeft} ${to.y}`;
    }
  };

  const activeNode = nodes.find(n => n.id === selectedNodeId);

  return (
    <div className="flex-1 flex bg-[#f8fbff] text-slate-800 font-sans h-full overflow-hidden absolute inset-0 z-20">
      
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

      {/* --- Part 1: LEFT SIDEBAR Basic Info --- */}
      <div id="left_sidebar_info" className="w-[280px] bg-white border-r border-[#e2e8f5] flex flex-col h-full shrink-0 shadow-sm z-30 select-none">
        
        {/* Title row */}
        <div className="p-4 py-3.5 border-b border-[#f1f5fd] flex items-center gap-2">
          <ChevronLeft 
            onClick={onClose} 
            className="w-5 h-5 text-slate-400 hover:text-slate-700 cursor-pointer transition-colors" 
            title="返回流程列表"
          />
          <div className="flex items-center gap-1.5 ml-1">
            <span className="w-1 h-4 bg-blue-600 rounded-sm" />
            <h2 className="font-bold text-[14px] text-slate-800 tracking-wide">基本信息</h2>
          </div>
        </div>

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

      {/* --- Part 2: CENTER BPMN DESIGNER CANVAS --- */}
      <div className="flex-1 flex flex-col p-4 relative z-20 min-w-0">
        
        {/* Canvas frame and toolbar structure */}
        <div className="flex-1 bg-white rounded-xl shadow-[0_4px_24px_rgba(0,0,0,0.04)] border border-[#e2e8f5] flex flex-col overflow-hidden relative">
          
          {/* Top BPMN toolbar matching her style */}
          <div className="h-12 border-b border-[#e2e8f5] px-4 bg-[#fafcfe] flex items-center justify-between shrink-0 select-none z-10">
            <div className="flex items-center gap-3">
              
              {/* File selectors */}
              <button 
                onClick={handleOpenFile}
                className="flex items-center gap-1.5 px-2.5 py-1.5 text-slate-600 hover:text-blue-600 hover:bg-blue-50/50 rounded font-medium text-xs transition-colors cursor-pointer"
                title="导入预置 BPMN 流程"
              >
                <FolderOpen className="w-4 h-4 text-slate-500" />
                <span>打开文件</span>
              </button>

              <button 
                onClick={handleDownloadFile}
                className="flex items-center gap-1.5 px-2.5 py-1.5 text-slate-600 hover:text-blue-600 hover:bg-blue-50/50 rounded font-medium text-xs transition-colors cursor-pointer"
                title="导出并下载流程 json"
              >
                <Download className="w-4 h-4 text-slate-500" />
                <span>导出配置</span>
              </button>

              <button 
                onClick={() => showToast('流程图格式校对：验证通过 (流程设计有效)')}
                className="flex items-center gap-1.5 px-2.5 py-1.5 text-slate-600 hover:text-blue-600 hover:bg-blue-50/50 rounded font-medium text-xs transition-all cursor-pointer"
                title="校验与浏览当前流程"
              >
                <Eye className="w-4 h-4 text-slate-500" />
                <span>浏览</span>
              </button>

              <span className="w-px h-5 bg-slate-200 mx-1" />

              {/* Alignments (Standard vector grid alignment icons) */}
              <div className="flex items-center gap-1">
                {[
                  { title: '左对齐', path: 'M4 4h16M4 8h10M4 12h16M4 16h10M4 20h16' },
                  { title: '居中对齐', path: 'M4 4h16M6 8h12M4 12h16M6 16h12M4 20h16' },
                  { title: '右对齐', path: 'M4 4h16M10 8h10M4 12h16M10 16h10M4 20h16' },
                  { title: '等距分布', path: 'M4 4v16M20 4v16M8 8h8M8 14h8' }
                ].map((item, id) => (
                  <button 
                    key={id}
                    onClick={() => showToast(`自动重新编排：${item.title}`)}
                    className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-slate-100 rounded transition-colors"
                    title={item.title}
                  >
                    <svg className="w-3.5 h-3.5 fill-none stroke-current" strokeWidth="2" strokeLinecap="round" viewBox="0 0 24 24">
                      <path d={item.path} />
                    </svg>
                  </button>
                ))}
              </div>

              <span className="w-px h-5 bg-slate-200 mx-1" />

              {/* Zoom multipliers */}
              <div className="flex items-center gap-1">
                <button 
                  onClick={() => setZoom(z => Math.max(0.6, z - 0.1))} 
                  className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-slate-100 rounded transition-colors text-xs font-bold"
                  title="缩小"
                >
                  －
                </button>
                <select 
                  className="bg-transparent text-[11px] font-semibold text-slate-600 outline-none border-none py-1 px-1.5 hover:bg-slate-100 rounded"
                  value={`${Math.round(zoom * 100)}%`}
                  onChange={(e) => setZoom(parseFloat(e.target.value) / 100)}
                >
                  <option value="60%">60%</option>
                  <option value="80%">80%</option>
                  <option value="100%">100%</option>
                  <option value="120%">120%</option>
                  <option value="140%">140%</option>
                </select>
                <button 
                  onClick={() => setZoom(z => Math.min(1.5, z + 0.1))} 
                  className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-slate-100 rounded transition-colors text-xs font-bold"
                  title="放大"
                >
                  ＋
                </button>
                <button 
                  onClick={() => { setZoom(1); setPanOffset({ x: -100, y: -40 }); }}
                  className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-slate-100 rounded transition-colors"
                  title="居中适应画布"
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                </button>
              </div>

              <span className="w-px h-5 bg-slate-200 mx-1" />

              {/* Undo/Redo/Refresh */}
              <div className="flex items-center gap-0.5">
                <button 
                  onClick={handleUndo} 
                  className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-slate-100 rounded transition-colors"
                  title="撤销"
                >
                  <span className="text-xs font-bold font-mono">↩</span>
                </button>
                <button 
                  onClick={handleRedo} 
                  className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-slate-100 rounded transition-colors"
                  title="重做"
                >
                  <span className="text-xs font-bold font-mono">↪</span>
                </button>
                <button 
                  onClick={handleResetCanvas} 
                  className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-slate-100 rounded transition-colors ml-0.5"
                  title="刷新/重置到默认"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>

            {/* Visual Header Save triggers */}
            <div className="flex items-center gap-2">
              <button 
                onClick={handleSaveAll}
                className="px-4.5 py-1 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded text-xs transition-colors shadow-sm cursor-pointer h-7 text-center block"
              >
                保存
              </button>
            </div>
          </div>

          {/* Interactive designer Canvas Paper */}
          <div 
            className={`flex-1 overflow-hidden relative cursor-crosshair`}
            onMouseDown={handleCanvasMouseDown}
            onMouseMove={handleCanvasMouseMove}
            onMouseUp={handleCanvasMouseUp}
          >
            
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

                  return (
                    <g key={edge.id} className="group cursor-pointer" onClick={() => { setIsInspectorVisible(true); setSelectedNodeId(null); }}>
                      {/* Thicker hover path trigger target */}
                      <path 
                        d={pathStr} 
                        fill="none" 
                        stroke="transparent" 
                        strokeWidth="10" 
                        className="hover:stroke-blue-50"
                      />
                      {/* Active visible line */}
                      <path 
                        d={pathStr} 
                        fill="none" 
                        stroke="rgba(80,80,80,0.95)" 
                        strokeWidth="1.75" 
                        markerEnd="url(#arrow)"
                        className="transition-all stroke-slate-700"
                      />
                      
                      {/* Action Path label "是" or "否" */}
                      {edge.label && (
                        <g>
                          <rect 
                            x={edge.from === 'gate1' && edge.to === 'task1' ? 390 : 476}
                            y={edge.from === 'gate1' && edge.to === 'task1' ? 208 : 138}
                            width="20"
                            height="15"
                            fill="white"
                            rx="2"
                          />
                          <text 
                            x={edge.from === 'gate1' && edge.to === 'task1' ? 400 : 486}
                            y={edge.from === 'gate1' && edge.to === 'task1' ? 220 : 150}
                            fill="#718096"
                            fontSize="10"
                            fontWeight="semibold"
                            textAnchor="middle"
                          >
                            {edge.label}
                          </text>
                        </g>
                      )}
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
                      {(node.type === 'gateway-or' || node.type === 'gateway-and') && (
                        <g>
                          <polygon 
                            points={`0,${-node.height/2} ${node.width/2},0 0,${node.height/2} ${-node.width/2},0`}
                            fill="#fafafe"
                            stroke="#333"
                            strokeWidth="1.5"
                          />
                          {/* Inner cross indicator for gateway */}
                          {node.type === 'gateway-or' && (
                            <text y="4.5" textAnchor="middle" fontSize="15" fontWeight="bold" fill="#333">✕</text>
                          )}
                          {node.type === 'gateway-and' && (
                            <text y="5" textAnchor="middle" fontSize="18" fontWeight="bold" fill="#333">＋</text>
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
                            fill="white"
                            stroke="#2d3748"
                            strokeWidth="1.5"
                            rx="5"
                          />
                          
                          {/* Human user avatar on upper-left inside task box */}
                          <g transform={`translate(${-node.width/2 + 10}, ${-node.height/2 + 12}) scale(0.65)`}>
                            <ellipse cx="6" cy="4" rx="3.5" ry="3.5" fill="none" stroke="#2d3748" strokeWidth="1.75" />
                            <path d="M 1 12 C 1 9, 11 9, 11 12" fill="none" stroke="#2d3748" strokeWidth="1.75" />
                          </g>

                          {/* Center task label text wrapping cleanly */}
                          <text 
                            textAnchor="middle" 
                            fill="#2d3748" 
                            fontSize="11" 
                            fontWeight="bold"
                            className="font-sans select-none"
                            y={4}
                          >
                            {node.label}
                          </text>

                          {/* Parallel standard lines at bottom of task cards */}
                          {node.subType === '|||' && (
                            <g transform="translate(-6, 22)">
                              <line x1="0" y1="0" x2="0" y2="8" stroke="#4a5568" strokeWidth="1.5" />
                              <line x1="4" y1="0" x2="4" y2="8" stroke="#4a5568" strokeWidth="1.5" />
                              <line x1="8" y1="0" x2="8" y2="8" stroke="#4a5568" strokeWidth="1.5" />
                            </g>
                          )}

                          {/* User Hamburger menu standard parallel bars */}
                          {node.subType === '≡' && (
                            <g transform="translate(-5, 21)">
                              <line x1="0" y1="0" x2="10" y2="0" stroke="#718096" strokeWidth="1.2" />
                              <line x1="0" y1="3" x2="10" y2="3" stroke="#718096" strokeWidth="1.2" />
                              <line x1="0" y1="6" x2="10" y2="6" stroke="#718096" strokeWidth="1.2" />
                            </g>
                          )}
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

            {/* Conditional Right Inspector Panel */}
            {isInspectorVisible && (() => {
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
                              setUserIdentities(options.map(o => o.value));
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
                                            onChange={(e) => setDataTables(Array.from(e.target.selectedOptions, option => option.value))}
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
                                            onChange={(e) => setApplicantIdentities(Array.from(e.target.selectedOptions, option => option.value))}
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
      <div className="w-[280px] bg-white border-l border-[#e2e8f5] flex flex-col h-full shrink-0 shadow-sm z-30 select-none">
        
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

    </div>
  );
}

import type { LearningStatus, NodeType, ReviewStatus } from '../data/knowledgeGraph';

export type Locale = 'zh' | 'en';

export type UiText = {
  appEyebrow: string;
  appTitle: string;
  toggleLanguage: string;
  search: string;
  searchPlaceholder: string;
  mapLayers: string;
  learningPath: string;
  rotate: string;
  zoom: string;
  dragNodes: string;
  clickToInspect: string;
  connectedConcepts: string;
  learning: string;
  confidence: string;
  updated: string;
  source: string;
  fullDetailHint: string;
  closeDetail: string;
  problem: string;
  rootCause: string;
  solution: string;
  engineeringLesson: string;
  relatedFrontierTech: string;
  evidence: string;
  emptyDetail: string;
  graphCounterLabel: string;
  detailAriaSuffix: string;
};

export const uiText: Record<Locale, UiText> = {
  zh: {
    appEyebrow: '本地 AI 学习系统',
    appTitle: 'Study AI 知识图谱',
    toggleLanguage: 'English',
    search: '搜索',
    searchPlaceholder: 'RAG、MCP、部署...',
    mapLayers: '图谱层级',
    learningPath: '学习路径',
    rotate: '旋转',
    zoom: '缩放',
    dragNodes: '拖拽节点',
    clickToInspect: '点击查看',
    connectedConcepts: '关联概念',
    learning: '学习状态',
    confidence: '可信度',
    updated: '更新时间',
    source: '来源',
    fullDetailHint: '点击节点或学习路径条目，可以打开完整研究详情。',
    closeDetail: '关闭详情',
    problem: '问题',
    rootCause: '根因',
    solution: '解决方案',
    engineeringLesson: '工程经验',
    relatedFrontierTech: '相关前沿技术',
    evidence: '证据',
    emptyDetail: '这个节点目前只有简要摘要。下一轮分析可以补充问题、根因、解决方案和证据。',
    graphCounterLabel: '知识图谱统计',
    detailAriaSuffix: '详情',
  },
  en: {
    appEyebrow: 'Local AI Learning System',
    appTitle: 'Study AI Knowledge Graph',
    toggleLanguage: '中文',
    search: 'Search',
    searchPlaceholder: 'RAG, MCP, deployment...',
    mapLayers: 'Map Layers',
    learningPath: 'Learning Path',
    rotate: 'Rotate',
    zoom: 'Zoom',
    dragNodes: 'Drag nodes',
    clickToInspect: 'Click to inspect',
    connectedConcepts: 'Connected Concepts',
    learning: 'Learning',
    confidence: 'Confidence',
    updated: 'Updated',
    source: 'Source',
    fullDetailHint: 'Click the node again or a learning path item to open the full research detail.',
    closeDetail: 'Close detail',
    problem: 'Problem',
    rootCause: 'Root Cause',
    solution: 'Solution',
    engineeringLesson: 'Engineering Lesson',
    relatedFrontierTech: 'Related Frontier Tech',
    evidence: 'Evidence',
    emptyDetail: 'This node has a short summary now. The next analysis pass can enrich it with problem, root cause, solution, and evidence.',
    graphCounterLabel: 'knowledge graph counters',
    detailAriaSuffix: 'detail',
  },
};

export const nodeTypeLabels: Record<Locale, Record<NodeType, string>> = {
  zh: {
    company: '厂商',
    model: '模型',
    technique: '技术',
    scenario: '场景',
    engineering: '工程',
    'case-study': '工程案例',
  },
  en: {
    company: 'Company',
    model: 'Model',
    technique: 'Technique',
    scenario: 'Scenario',
    engineering: 'Engineering',
    'case-study': 'Case Study',
  },
};

export const nodeTypePluralLabels: Record<Locale, Record<NodeType, string>> = {
  zh: nodeTypeLabels.zh,
  en: {
    company: 'Companies',
    model: 'Models',
    technique: 'Techniques',
    scenario: 'Scenarios',
    engineering: 'Engineering',
    'case-study': 'Case Studies',
  },
};

export const reviewStatusLabels: Record<Locale, Record<ReviewStatus, string>> = {
  zh: {
    approved: '已通过',
    candidate: '候选',
    'needs-review': '待复核',
  },
  en: {
    approved: 'approved',
    candidate: 'candidate',
    'needs-review': 'needs-review',
  },
};

export const learningStatusLabels: Record<Locale, Record<LearningStatus, string>> = {
  zh: {
    new: '新知识',
    learning: '学习中',
    reviewed: '已复盘',
  },
  en: {
    new: 'new',
    learning: 'learning',
    reviewed: 'reviewed',
  },
};

export const evidenceTypeLabels: Record<Locale, Record<string, string>> = {
  zh: {
    git: 'Git 记录',
    web: '网页资料',
    manual: '手动整理',
    code: '代码证据',
  },
  en: {
    git: 'git',
    web: 'web',
    manual: 'manual',
    code: 'code',
  },
};

export function getUiText(locale: Locale): UiText {
  return uiText[locale];
}


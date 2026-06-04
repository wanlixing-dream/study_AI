export type NodeType = 'company' | 'model' | 'technique' | 'scenario' | 'engineering' | 'case-study';
export type ReviewStatus = 'approved' | 'candidate' | 'needs-review';
export type LearningStatus = 'new' | 'learning' | 'reviewed';

export type KnowledgeNode = {
  id: string;
  title: string;
  type: NodeType;
  summary: string;
  tags: string[];
  source: string;
  confidence: number;
  reviewStatus: ReviewStatus;
  learningStatus: LearningStatus;
  updatedAt: string;
};

export type KnowledgeEdge = {
  source: string;
  target: string;
  label: string;
  explanation: string;
};

export type LearningPath = {
  id: string;
  title: string;
  description: string;
  nodeIds: string[];
};

export const knowledgeNodes: KnowledgeNode[] = [
  {
    id: 'openai',
    title: 'OpenAI',
    type: 'company',
    summary: 'Frontier AI lab and platform company known for GPT models, ChatGPT, tool use, and enterprise AI APIs.',
    tags: ['vendor', 'frontier-model', 'api-platform'],
    source: 'manual seed',
    confidence: 0.82,
    reviewStatus: 'approved',
    learningStatus: 'learning',
    updatedAt: '2026-06-03'
  },
  {
    id: 'anthropic',
    title: 'Anthropic',
    type: 'company',
    summary: 'AI company focused on Claude models, safety research, long-context reasoning, and enterprise assistants.',
    tags: ['vendor', 'safety', 'long-context'],
    source: 'manual seed',
    confidence: 0.8,
    reviewStatus: 'approved',
    learningStatus: 'new',
    updatedAt: '2026-06-03'
  },
  {
    id: 'google-deepmind',
    title: 'Google DeepMind',
    type: 'company',
    summary: 'Google AI organization behind Gemini models and a broad research-to-product AI ecosystem.',
    tags: ['vendor', 'research', 'cloud'],
    source: 'manual seed',
    confidence: 0.8,
    reviewStatus: 'approved',
    learningStatus: 'new',
    updatedAt: '2026-06-03'
  },
  {
    id: 'meta-ai',
    title: 'Meta AI',
    type: 'company',
    summary: 'AI organization behind Llama model families and open-weight ecosystem contributions.',
    tags: ['vendor', 'open-weight', 'llama'],
    source: 'manual seed',
    confidence: 0.78,
    reviewStatus: 'approved',
    learningStatus: 'new',
    updatedAt: '2026-06-03'
  },
  {
    id: 'deepseek',
    title: 'DeepSeek',
    type: 'company',
    summary: 'AI company known for efficient reasoning and coding models with strong cost-performance attention.',
    tags: ['vendor', 'reasoning', 'cost-performance'],
    source: 'manual seed',
    confidence: 0.76,
    reviewStatus: 'approved',
    learningStatus: 'new',
    updatedAt: '2026-06-03'
  },
  {
    id: 'qwen',
    title: 'Qwen',
    type: 'model',
    summary: 'Alibaba Cloud model family commonly considered for Chinese, multilingual, agent, and enterprise scenarios.',
    tags: ['foundation-model', 'china', 'multilingual'],
    source: 'manual seed',
    confidence: 0.76,
    reviewStatus: 'approved',
    learningStatus: 'new',
    updatedAt: '2026-06-03'
  },
  {
    id: 'foundation-models',
    title: 'Foundation Models',
    type: 'model',
    summary: 'Large general-purpose models that provide language, vision, code, reasoning, and tool-use capabilities.',
    tags: ['llm', 'multimodal', 'selection'],
    source: 'manual seed',
    confidence: 0.86,
    reviewStatus: 'approved',
    learningStatus: 'learning',
    updatedAt: '2026-06-03'
  },
  {
    id: 'rag',
    title: 'RAG',
    type: 'technique',
    summary: 'Retrieval augmented generation connects model answers to external knowledge through retrieval and grounding.',
    tags: ['retrieval', 'knowledge-base', 'enterprise-ai'],
    source: 'manual seed',
    confidence: 0.9,
    reviewStatus: 'approved',
    learningStatus: 'learning',
    updatedAt: '2026-06-03'
  },
  {
    id: 'embedding',
    title: 'Embedding',
    type: 'technique',
    summary: 'Vector representations used for semantic search, clustering, reranking, and retrieval pipelines.',
    tags: ['retrieval', 'vector', 'semantic-search'],
    source: 'manual seed',
    confidence: 0.88,
    reviewStatus: 'approved',
    learningStatus: 'learning',
    updatedAt: '2026-06-03'
  },
  {
    id: 'vector-db',
    title: 'Vector Database',
    type: 'technique',
    summary: 'Storage and indexing layer for vector search over documents, chunks, memories, and other embeddings.',
    tags: ['retrieval', 'database', 'indexing'],
    source: 'manual seed',
    confidence: 0.86,
    reviewStatus: 'approved',
    learningStatus: 'new',
    updatedAt: '2026-06-03'
  },
  {
    id: 'prompt-engineering',
    title: 'Prompt Engineering',
    type: 'technique',
    summary: 'Designing instructions, context, examples, constraints, and output contracts for reliable model behavior.',
    tags: ['prompt', 'reliability', 'workflow'],
    source: 'manual seed',
    confidence: 0.84,
    reviewStatus: 'approved',
    learningStatus: 'reviewed',
    updatedAt: '2026-06-03'
  },
  {
    id: 'mcp',
    title: 'MCP',
    type: 'technique',
    summary: 'Model Context Protocol standardizes how AI applications connect models with tools, resources, and context.',
    tags: ['agent', 'tools', 'protocol'],
    source: 'manual seed',
    confidence: 0.78,
    reviewStatus: 'needs-review',
    learningStatus: 'learning',
    updatedAt: '2026-06-03'
  },
  {
    id: 'agent-workflow',
    title: 'Agent Workflow',
    type: 'technique',
    summary: 'Multi-step AI execution pattern combining planning, tool calls, memory, verification, and human review.',
    tags: ['agent', 'workflow', 'automation'],
    source: 'manual seed',
    confidence: 0.82,
    reviewStatus: 'approved',
    learningStatus: 'learning',
    updatedAt: '2026-06-03'
  },
  {
    id: 'enterprise-knowledge-base',
    title: 'Enterprise Knowledge Base',
    type: 'scenario',
    summary: 'Internal assistant scenario for policy, product, process, support, and technical documentation questions.',
    tags: ['enterprise', 'knowledge', 'support'],
    source: 'manual seed',
    confidence: 0.84,
    reviewStatus: 'approved',
    learningStatus: 'new',
    updatedAt: '2026-06-03'
  },
  {
    id: 'customer-service',
    title: 'AI Customer Service',
    type: 'scenario',
    summary: 'Customer support use case that needs routing, retrieval, escalation, tone control, and quality monitoring.',
    tags: ['enterprise', 'support', 'automation'],
    source: 'manual seed',
    confidence: 0.8,
    reviewStatus: 'approved',
    learningStatus: 'new',
    updatedAt: '2026-06-03'
  },
  {
    id: 'evaluation',
    title: 'Evaluation',
    type: 'engineering',
    summary: 'Testing model behavior with datasets, assertions, human review, regression checks, and production telemetry.',
    tags: ['testing', 'quality', 'reliability'],
    source: 'manual seed',
    confidence: 0.86,
    reviewStatus: 'approved',
    learningStatus: 'learning',
    updatedAt: '2026-06-03'
  },
  {
    id: 'deployment',
    title: 'Deployment',
    type: 'engineering',
    summary: 'Separating development and production environments, secrets, observability, rollback, and runtime controls.',
    tags: ['ops', 'production', 'environment'],
    source: 'manual seed',
    confidence: 0.84,
    reviewStatus: 'approved',
    learningStatus: 'new',
    updatedAt: '2026-06-03'
  },
  {
    id: 'cost-latency',
    title: 'Cost and Latency',
    type: 'engineering',
    summary: 'Operational trade-off across model selection, caching, batching, routing, context length, and response speed.',
    tags: ['ops', 'model-selection', 'performance'],
    source: 'manual seed',
    confidence: 0.82,
    reviewStatus: 'approved',
    learningStatus: 'new',
    updatedAt: '2026-06-03'
  },
  {
    id: 'case-skill-builder-blank-screen',
    title: 'Skill Builder Blank Screen',
    type: 'case-study',
    summary: 'BestCowork-GA fixed a Skill Builder blank screen by tracing UI state flow: handleShowSkillBuilder did not set skillBuilderActive, and CoworkView passed onCreateSkill into the wrong open-builder callback.',
    tags: ['BestCowork-GA', 'skill-builder', 'ui-state', 'callback-wiring'],
    source: 'BestCowork-GA git commit 38003b04, 2026-06-02',
    confidence: 0.92,
    reviewStatus: 'approved',
    learningStatus: 'learning',
    updatedAt: '2026-06-04'
  },
  {
    id: 'case-installed-skill-delete-state',
    title: 'Installed Skill Delete State',
    type: 'case-study',
    summary: 'BestCowork-GA fixed an installed-skill delete button that appeared unresponsive because the skills:delete handler returned after LibreFang uninstall success before local state cleanup, notification, and frontend list refresh.',
    tags: ['BestCowork-GA', 'skill-lifecycle', 'state-sync', 'ipc'],
    source: 'BestCowork-GA git commit 291e2291, 2026-06-02',
    confidence: 0.91,
    reviewStatus: 'approved',
    learningStatus: 'learning',
    updatedAt: '2026-06-04'
  },
  {
    id: 'case-group-chat-room-isolation',
    title: 'Group Chat Room Isolation',
    type: 'case-study',
    summary: 'BestCowork-GA fixed cross-room message leakage by making groupChatSlice actions accept roomId, binding GroupChatView messages to the active room, and adding room-isolation regression tests.',
    tags: ['BestCowork-GA', 'group-chat', 'state-isolation', 'regression-test'],
    source: 'BestCowork-GA git commit 969cbfd0, 2026-06-02',
    confidence: 0.93,
    reviewStatus: 'approved',
    learningStatus: 'learning',
    updatedAt: '2026-06-04'
  },
  {
    id: 'case-agent-memory-two-layer',
    title: 'Two-Layer Group Chat Memory',
    type: 'case-study',
    summary: 'BestCowork-GA introduced a two-layer memory pattern for group chat: inject the latest six turns as short-term context, persist L4 memory, and summarize every six rounds.',
    tags: ['BestCowork-GA', 'agent-memory', 'group-chat', 'summarization'],
    source: 'BestCowork-GA git commit 42e7757a, 2026-06-01',
    confidence: 0.88,
    reviewStatus: 'approved',
    learningStatus: 'learning',
    updatedAt: '2026-06-04'
  },
  {
    id: 'case-lan-dep-discovery-cache',
    title: 'LAN DEP Discovery Cache',
    type: 'case-study',
    summary: 'BestCowork-GA fixed local-network DEP selection by preventing option 4 from reusing stale DEP cache and limiting discovery to LAN DEP instances.',
    tags: ['BestCowork-GA', 'lan', 'service-discovery', 'cache-invalidation'],
    source: 'BestCowork-GA git commits d5a4b4d9 and 3c6ea7e8, 2026-06-01',
    confidence: 0.89,
    reviewStatus: 'approved',
    learningStatus: 'new',
    updatedAt: '2026-06-04'
  },
  {
    id: 'case-bestdep-startup-hang',
    title: 'Startup Health Check Hang',
    type: 'case-study',
    summary: 'BestDEP-Lib fixed a menu startup hang by adding -m 5 timeout limits to curl health checks in bestdep.sh, preventing unavailable services from blocking startup indefinitely.',
    tags: ['BestDEP-Lib', 'startup', 'health-check', 'shell-script'],
    source: 'BestDEP-Lib git commit 62db549, 2026-05-27',
    confidence: 0.94,
    reviewStatus: 'approved',
    learningStatus: 'learning',
    updatedAt: '2026-06-04'
  },
  {
    id: 'case-bestdep-cpu-spike',
    title: 'High Concurrency CPU Spike',
    type: 'case-study',
    summary: 'BestDEP-Lib fixed server CPU reaching 100 percent under high concurrency by debouncing saveStore, simplifying health checks, and caching provider metadata.',
    tags: ['BestDEP-Lib', 'performance', 'concurrency', 'cache'],
    source: 'BestDEP-Lib git commit 852cc92, 2026-05-27',
    confidence: 0.93,
    reviewStatus: 'approved',
    learningStatus: 'learning',
    updatedAt: '2026-06-04'
  },
  {
    id: 'case-auth-seed-db-clean-deploy',
    title: 'Clean Deploy Auth Seed DB',
    type: 'case-study',
    summary: 'BestDEP-Lib fixed clean deployment data loss by packaging auth.db, preserving required data files in package.json and .gitignore, and copying data-seed/auth-seed.db when no database exists.',
    tags: ['BestDEP-Lib', 'clean-deploy', 'seed-data', 'packaging'],
    source: 'BestDEP-Lib git commits 6402929, 264d175, 2d69cc3, 513dd01, 2026-05-17',
    confidence: 0.9,
    reviewStatus: 'approved',
    learningStatus: 'learning',
    updatedAt: '2026-06-04'
  },
  {
    id: 'case-wiki-soft-delete-recreate',
    title: 'Wiki Soft Delete Recreate',
    type: 'case-study',
    summary: 'BestDEP-Lib fixed help-document categories and articles not reappearing after soft delete and recreation, showing that CRUD flows need uniqueness rules that account for deleted records.',
    tags: ['BestDEP-Lib', 'wiki', 'soft-delete', 'crud'],
    source: 'BestDEP-Lib git commits d3eccba and d3e8f19, 2026-05-18',
    confidence: 0.88,
    reviewStatus: 'approved',
    learningStatus: 'new',
    updatedAt: '2026-06-04'
  },
  {
    id: 'case-skill-visibility-permission',
    title: 'Skill Visibility Permission Mismatch',
    type: 'case-study',
    summary: 'BestDEP-Lib fixed inconsistent skill visibility and download permission behavior, a practical reminder that UI visibility, API authorization, and download policy must share one policy source.',
    tags: ['BestDEP-Lib', 'skills', 'rbac', 'policy'],
    source: 'BestDEP-Lib git commit 4911868, 2026-05-19',
    confidence: 0.87,
    reviewStatus: 'approved',
    learningStatus: 'new',
    updatedAt: '2026-06-04'
  },
  {
    id: 'learning-agent-system',
    title: 'LearningAgent System',
    type: 'case-study',
    summary: 'A decoupled personalized learning engine with CLI, REST API, MCP server, hybrid RAG, multi-scope memory, mastery tracking, and tracing. It should connect to Study AI through stable adapter contracts instead of being merged into the React graph frontend.',
    tags: ['LearningAgent', 'personalized learning engine', 'decoupled-module', 'workspace-integration'],
    source: 'learningAgent/README.md and docs/plans/2025-01-09-learningagent-design.md',
    confidence: 0.94,
    reviewStatus: 'approved',
    learningStatus: 'learning',
    updatedAt: '2026-06-04'
  },
  {
    id: 'learning-agent-hybrid-rag',
    title: 'LearningAgent Hybrid RAG',
    type: 'case-study',
    summary: 'LearningAgent combines dense embedding retrieval with sparse BM25 retrieval, score fusion, markdown-aware chunking, and vector persistence for learning-context injection.',
    tags: ['LearningAgent', 'hybrid-rag', 'bm25', 'embedding', 'chunking'],
    source: 'learningAgent/core/rag and learningAgent/README.md',
    confidence: 0.92,
    reviewStatus: 'approved',
    learningStatus: 'learning',
    updatedAt: '2026-06-04'
  },
  {
    id: 'learning-agent-memory',
    title: 'LearningAgent Multi-Scope Memory',
    type: 'case-study',
    summary: 'LearningAgent stores long-term learning memory with entity extraction, importance, recency, semantic retrieval, and fallback retrieval when embedding services are unavailable.',
    tags: ['LearningAgent', 'memory', 'entity-extraction', 'retrieval'],
    source: 'learningAgent/core/memory_* and learningAgent/README.md',
    confidence: 0.91,
    reviewStatus: 'approved',
    learningStatus: 'learning',
    updatedAt: '2026-06-04'
  },
  {
    id: 'learning-agent-mastery',
    title: 'LearningAgent Mastery Tracking',
    type: 'case-study',
    summary: 'LearningAgent tracks concept-level mastery, confidence, attempts, weak concepts, and review timing so learning can adapt to user progress instead of staying as static notes.',
    tags: ['LearningAgent', 'adaptive-learning', 'mastery', 'spaced-review'],
    source: 'learningAgent/core/mastery_tracker.py and learningAgent/api/server.py',
    confidence: 0.91,
    reviewStatus: 'approved',
    learningStatus: 'learning',
    updatedAt: '2026-06-04'
  },
  {
    id: 'learning-agent-mcp',
    title: 'LearningAgent MCP Interface',
    type: 'case-study',
    summary: 'LearningAgent exposes learning domains, plans, progress summaries, memory search, knowledge notes, weak concepts, and mastery updates through a FastMCP server.',
    tags: ['LearningAgent', 'mcp', 'tools', 'resources', 'prompts'],
    source: 'learningAgent/mcp_server/server.py',
    confidence: 0.93,
    reviewStatus: 'approved',
    learningStatus: 'learning',
    updatedAt: '2026-06-04'
  },
  {
    id: 'learning-agent-observability',
    title: 'LearningAgent Observability',
    type: 'case-study',
    summary: 'LearningAgent records traces, latency, intent, agent execution, and deterministic evaluation signals, allowing learning workflows to be inspected rather than treated as opaque chat.',
    tags: ['LearningAgent', 'observability', 'tracing', 'evaluation'],
    source: 'learningAgent/core/tracing.py, learningAgent/core/evaluation.py, learningAgent/api/server.py',
    confidence: 0.9,
    reviewStatus: 'approved',
    learningStatus: 'learning',
    updatedAt: '2026-06-04'
  }
];

export const knowledgeEdges: KnowledgeEdge[] = [
  { source: 'openai', target: 'foundation-models', label: 'provides', explanation: 'OpenAI is one major provider to compare during foundation model selection.' },
  { source: 'anthropic', target: 'foundation-models', label: 'provides', explanation: 'Claude models are part of the frontier model selection landscape.' },
  { source: 'google-deepmind', target: 'foundation-models', label: 'provides', explanation: 'Gemini belongs in the model landscape for multimodal and cloud-integrated choices.' },
  { source: 'meta-ai', target: 'foundation-models', label: 'open ecosystem', explanation: 'Llama-style open-weight models affect deployment, privacy, and customization choices.' },
  { source: 'deepseek', target: 'foundation-models', label: 'cost-performance', explanation: 'Efficient reasoning and coding models are relevant when budget and latency matter.' },
  { source: 'foundation-models', target: 'prompt-engineering', label: 'controlled by', explanation: 'Prompts shape task behavior before deeper workflow or fine-tuning changes are needed.' },
  { source: 'foundation-models', target: 'embedding', label: 'paired with', explanation: 'Embedding models are often selected alongside generation models for retrieval systems.' },
  { source: 'embedding', target: 'vector-db', label: 'stored in', explanation: 'Vector databases index embeddings so systems can retrieve semantically similar content.' },
  { source: 'vector-db', target: 'rag', label: 'supports', explanation: 'RAG usually depends on vector retrieval to ground answers in external knowledge.' },
  { source: 'rag', target: 'enterprise-knowledge-base', label: 'enables', explanation: 'Enterprise knowledge bases are one of the clearest RAG application scenarios.' },
  { source: 'rag', target: 'evaluation', label: 'requires', explanation: 'RAG quality depends on retrieval, grounding, answer faithfulness, and regression evaluation.' },
  { source: 'evaluation', target: 'deployment', label: 'protects', explanation: 'Evaluation catches quality regressions before production deployment changes reach users.' },
  { source: 'deployment', target: 'cost-latency', label: 'balances', explanation: 'Production deployment decisions must balance user experience, model cost, and latency.' },
  { source: 'mcp', target: 'agent-workflow', label: 'connects tools', explanation: 'MCP can make agent workflows more modular by exposing tools and resources consistently.' },
  { source: 'agent-workflow', target: 'customer-service', label: 'automates', explanation: 'Support agents combine retrieval, tool calls, escalation, and policy constraints.' },
  { source: 'customer-service', target: 'evaluation', label: 'monitored by', explanation: 'Customer-facing AI needs quality, safety, tone, and escalation evaluation.' },
  { source: 'case-skill-builder-blank-screen', target: 'agent-workflow', label: 'debugs builder flow', explanation: 'Agent-facing builders need explicit state transitions and correctly wired callbacks.' },
  { source: 'case-installed-skill-delete-state', target: 'mcp', label: 'cleans tool lifecycle', explanation: 'Tool and skill lifecycle operations must update remote runtime and local UI state consistently.' },
  { source: 'case-group-chat-room-isolation', target: 'evaluation', label: 'validated by regression', explanation: 'Room isolation is a state-boundary problem that should be protected with regression tests.' },
  { source: 'case-agent-memory-two-layer', target: 'agent-workflow', label: 'adds memory pattern', explanation: 'Short-term context and persisted summaries solve different parts of agent memory.' },
  { source: 'case-lan-dep-discovery-cache', target: 'deployment', label: 'fixes environment routing', explanation: 'Local and remote DEP discovery need explicit cache invalidation and environment boundaries.' },
  { source: 'case-bestdep-startup-hang', target: 'deployment', label: 'hardens startup', explanation: 'Health checks in startup scripts need timeouts so missing services do not block operators.' },
  { source: 'case-bestdep-cpu-spike', target: 'cost-latency', label: 'reduces pressure', explanation: 'Debouncing writes, lighter health checks, and provider caching reduce production load.' },
  { source: 'case-auth-seed-db-clean-deploy', target: 'deployment', label: 'packages seeds', explanation: 'Clean deployments need packaged seed data and deterministic database initialization.' },
  { source: 'case-wiki-soft-delete-recreate', target: 'enterprise-knowledge-base', label: 'repairs content lifecycle', explanation: 'Knowledge base CRUD logic must handle soft-deleted records during recreate flows.' },
  { source: 'case-skill-visibility-permission', target: 'mcp', label: 'aligns permissions', explanation: 'Skill visibility and executable/download permission should resolve through one policy model.' },
  { source: 'learning-agent-system', target: 'agent-workflow', label: 'implements', explanation: 'LearningAgent is a concrete learning-oriented agent workflow with routing, tools, memory, and evaluation.' },
  { source: 'learning-agent-system', target: 'learning-agent-hybrid-rag', label: 'contains', explanation: 'The system uses hybrid retrieval to ground learning answers and summaries.' },
  { source: 'learning-agent-system', target: 'learning-agent-memory', label: 'contains', explanation: 'The system keeps multi-scope learning memory so user progress accumulates across sessions.' },
  { source: 'learning-agent-system', target: 'learning-agent-mastery', label: 'contains', explanation: 'Mastery tracking converts sessions into measurable learning state.' },
  { source: 'learning-agent-system', target: 'learning-agent-mcp', label: 'exposes', explanation: 'The MCP server is the cleanest future integration contract for external agents and tools.' },
  { source: 'learning-agent-system', target: 'learning-agent-observability', label: 'observed by', explanation: 'Tracing and evaluation make the learning agent inspectable and debuggable.' },
  { source: 'learning-agent-hybrid-rag', target: 'rag', label: 'concretizes', explanation: 'LearningAgent is a runnable example of RAG applied to personal learning context.' },
  { source: 'learning-agent-hybrid-rag', target: 'embedding', label: 'uses', explanation: 'Dense retrieval depends on embeddings for semantic similarity search.' },
  { source: 'learning-agent-hybrid-rag', target: 'vector-db', label: 'persists in', explanation: 'Vector persistence allows notes and chunks to be reused across learning sessions.' },
  { source: 'learning-agent-memory', target: 'agent-workflow', label: 'adds continuity', explanation: 'Memory retrieval gives the agent continuity beyond the current prompt.' },
  { source: 'learning-agent-mastery', target: 'evaluation', label: 'measures learning', explanation: 'Concept mastery is a domain-specific evaluation signal for adaptive learning.' },
  { source: 'learning-agent-mcp', target: 'mcp', label: 'implements', explanation: 'LearningAgent exposes its learning capabilities through MCP tools, resources, and prompts.' },
  { source: 'learning-agent-observability', target: 'evaluation', label: 'supports', explanation: 'Trace and score records make agent behavior measurable and reviewable.' }
];

export const learningPaths: LearningPath[] = [
  {
    id: 'enterprise-rag',
    title: 'Enterprise RAG Landing',
    description: 'From model selection to retrieval, evaluation, and deployment for enterprise knowledge systems.',
    nodeIds: ['foundation-models', 'embedding', 'vector-db', 'rag', 'evaluation', 'deployment']
  },
  {
    id: 'agent-internship',
    title: 'Agent Internship Core',
    description: 'Concepts to connect agent work with tools, protocols, scenarios, and operational checks.',
    nodeIds: ['foundation-models', 'prompt-engineering', 'mcp', 'agent-workflow', 'customer-service', 'evaluation']
  },
  {
    id: 'model-selection',
    title: 'Model Selection Map',
    description: 'Compare vendors, foundation model families, and practical cost-performance constraints.',
    nodeIds: ['openai', 'anthropic', 'google-deepmind', 'meta-ai', 'deepseek', 'foundation-models', 'cost-latency']
  },
  {
    id: 'project-retrospective',
    title: 'Project Retrospective',
    description: 'Real engineering lessons extracted from BestCowork-GA and BestDEP-Lib git history.',
    nodeIds: [
      'case-skill-builder-blank-screen',
      'case-installed-skill-delete-state',
      'case-group-chat-room-isolation',
      'case-bestdep-startup-hang',
      'case-bestdep-cpu-spike',
      'case-auth-seed-db-clean-deploy'
    ]
  },
  {
    id: 'learning-agent-integration',
    title: 'LearningAgent Integration',
    description: 'How the previous LearningAgent project connects to the Study AI graph as a decoupled learning engine.',
    nodeIds: [
      'learning-agent-system',
      'learning-agent-hybrid-rag',
      'learning-agent-memory',
      'learning-agent-mastery',
      'learning-agent-mcp',
      'learning-agent-observability'
    ]
  }
];

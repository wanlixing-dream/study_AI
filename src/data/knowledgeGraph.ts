export type NodeType = 'company' | 'model' | 'technique' | 'scenario' | 'engineering';
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
  { source: 'customer-service', target: 'evaluation', label: 'monitored by', explanation: 'Customer-facing AI needs quality, safety, tone, and escalation evaluation.' }
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
  }
];


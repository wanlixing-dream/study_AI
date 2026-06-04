import type { KnowledgeDetail, KnowledgeEdge, KnowledgeNode } from './knowledgeGraph';

export type CandidateStatus = 'pending-review' | 'approved' | 'rejected' | 'needs-edit';

export type CandidateKnowledge = {
  id: string;
  title: string;
  sourceProjects: string[];
  generatedBy: 'manual-architecture' | 'git-analyzer' | 'web-research-agent' | 'llm-synthesis';
  status: CandidateStatus;
  confidence: number;
  proposedNode: KnowledgeNode;
  proposedEdges: KnowledgeEdge[];
  detail: KnowledgeDetail;
  createdAt: string;
};

export const candidateKnowledge: CandidateKnowledge[] = [
  {
    id: 'candidate-auto-git-analysis-pipeline',
    title: 'Automatic Git-to-Knowledge Analysis Pipeline',
    sourceProjects: [
      '/Users/wlx/Desktop/wlx/BestCowork-GA',
      '/Users/wlx/Desktop/wlx/BestDEP-Lib',
      '/Users/wlx/Desktop/wlx/learningAgent',
      '/Users/wlx/Desktop/wlx/BestCowork'
    ],
    generatedBy: 'manual-architecture',
    status: 'pending-review',
    confidence: 0.82,
    createdAt: '2026-06-04',
    proposedNode: {
      id: 'auto-git-analysis-pipeline',
      title: 'Automatic Git-to-Knowledge Analysis Pipeline',
      type: 'engineering',
      summary: 'A future pipeline that reads project git history, clusters engineering problems, enriches them with current AI Agent research, and produces human-reviewed knowledge graph candidates.',
      tags: ['git-analysis', 'knowledge-graph', 'human-review', 'agent-pipeline'],
      source: 'manual architecture candidate',
      confidence: 0.82,
      reviewStatus: 'candidate',
      learningStatus: 'new',
      updatedAt: '2026-06-04'
    },
    proposedEdges: [
      {
        source: 'auto-git-analysis-pipeline',
        target: 'evaluation',
        label: 'requires review',
        explanation: 'Generated knowledge needs confidence scoring, evidence, and human approval before it becomes durable personal knowledge.'
      },
      {
        source: 'auto-git-analysis-pipeline',
        target: 'agent-workflow',
        label: 'implemented as',
        explanation: 'The pipeline should be split into collector, analyzer, web researcher, synthesizer, reviewer, and graph mapper agents.'
      }
    ],
    detail: {
      problem: 'Project knowledge is currently scattered across git commits, local docs, and external AI Agent research, making it hard to turn experience into reusable understanding.',
      rootCause: 'The existing graph stores approved concepts, but there is no candidate layer for automatically generated summaries and no explicit review gate.',
      solution: 'Introduce a candidate knowledge store. Git and web research agents write candidates with evidence, then the user approves, rejects, or edits before graph insertion.',
      engineeringLesson: 'The important architecture boundary is not collection versus synthesis; it is candidate knowledge versus approved knowledge.',
      relatedFrontierTech: ['human-in-the-loop agents', 'MCP tool contracts', 'agent tracing', 'retrieval augmented synthesis'],
      evidence: [
        {
          type: 'manual',
          title: 'Project boundary document',
          urlOrPath: '/Users/wlx/Desktop/wlx/study_AI/docs/architecture/project-boundaries.md',
          date: '2026-06-04'
        }
      ]
    }
  }
];


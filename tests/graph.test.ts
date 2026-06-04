import { describe, expect, it } from 'vitest';
import { knowledgeEdges, knowledgeNodes, learningPaths } from '../src/data/knowledgeGraph';
import {
  getConnectedNodes,
  getLearningPathNodes,
  getNodeTypeCounts,
  searchAndFilterNodes
} from '../src/lib/graph';

describe('knowledge graph helpers', () => {
  it('filters nodes by type and search text', () => {
    const nodes = searchAndFilterNodes(knowledgeNodes, {
      query: 'retrieval augmented',
      activeTypes: new Set(['technique'])
    });

    expect(nodes.map((node) => node.id)).toEqual(['rag']);
  });

  it('returns directly connected nodes with relationship explanations', () => {
    const connected = getConnectedNodes('rag', knowledgeNodes, knowledgeEdges);

    expect(connected.map((item) => item.node.id)).toContain('vector-db');
    expect(connected.find((item) => item.node.id === 'evaluation')?.edge.explanation).toMatch(
      /quality/
    );
  });

  it('resolves learning path nodes in configured order', () => {
    const pathNodes = getLearningPathNodes('enterprise-rag', learningPaths, knowledgeNodes);

    expect(pathNodes.map((node) => node.id)).toEqual([
      'foundation-models',
      'embedding',
      'vector-db',
      'rag',
      'evaluation',
      'deployment'
    ]);
  });

  it('counts nodes by type for the dashboard counters', () => {
    const counts = getNodeTypeCounts(knowledgeNodes);

    expect(counts.company).toBeGreaterThanOrEqual(5);
    expect(counts.technique).toBeGreaterThanOrEqual(5);
    expect(counts.engineering).toBeGreaterThanOrEqual(3);
    expect(counts['case-study']).toBeGreaterThanOrEqual(8);
  });

  it('searches real project lessons extracted from git history', () => {
    const nodes = searchAndFilterNodes(knowledgeNodes, {
      query: 'skill builder blank screen',
      activeTypes: new Set(['case-study'])
    });

    expect(nodes.map((node) => node.id)).toEqual(['case-skill-builder-blank-screen']);
  });

  it('resolves project retrospective path from git-derived lessons', () => {
    const pathNodes = getLearningPathNodes('project-retrospective', learningPaths, knowledgeNodes);

    expect(pathNodes.map((node) => node.id)).toEqual([
      'case-skill-builder-blank-screen',
      'case-installed-skill-delete-state',
      'case-group-chat-room-isolation',
      'case-bestdep-startup-hang',
      'case-bestdep-cpu-spike',
      'case-auth-seed-db-clean-deploy'
    ]);
  });

  it('searches the decoupled LearningAgent integration node', () => {
    const nodes = searchAndFilterNodes(knowledgeNodes, {
      query: 'personalized learning engine',
      activeTypes: new Set(['case-study'])
    });

    expect(nodes.map((node) => node.id)).toEqual(['learning-agent-system']);
  });

  it('resolves the LearningAgent integration path', () => {
    const pathNodes = getLearningPathNodes('learning-agent-integration', learningPaths, knowledgeNodes);

    expect(pathNodes.map((node) => node.id)).toEqual([
      'learning-agent-system',
      'learning-agent-hybrid-rag',
      'learning-agent-memory',
      'learning-agent-mastery',
      'learning-agent-mcp',
      'learning-agent-observability'
    ]);
  });

  it('stores rich engineering detail for git-derived case studies', () => {
    const node = knowledgeNodes.find((candidate) => candidate.id === 'case-skill-builder-blank-screen');

    expect(node?.detail?.problem).toMatch(/blank screen/i);
    expect(node?.detail?.rootCause).toMatch(/state/i);
    expect(node?.detail?.solution).toMatch(/callback/i);
    expect(node?.detail?.evidence[0]).toMatchObject({
      type: 'git',
      commitHash: '38003b04'
    });
  });
});

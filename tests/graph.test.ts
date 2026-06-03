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
  });
});

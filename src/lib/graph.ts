import type { KnowledgeEdge, KnowledgeNode, LearningPath, NodeType } from '../data/knowledgeGraph';

export type NodeFilter = {
  query: string;
  activeTypes: Set<NodeType>;
};

export type ConnectedNode = {
  node: KnowledgeNode;
  edge: KnowledgeEdge;
};

export function searchAndFilterNodes(nodes: KnowledgeNode[], filter: NodeFilter): KnowledgeNode[] {
  const normalizedQuery = filter.query.trim().toLowerCase();

  return nodes.filter((node) => {
    const matchesType = filter.activeTypes.size === 0 || filter.activeTypes.has(node.type);
    const searchableText = [node.title, node.summary, node.type, ...node.tags].join(' ').toLowerCase();
    const matchesQuery = normalizedQuery.length === 0 || searchableText.includes(normalizedQuery);

    return matchesType && matchesQuery;
  });
}

export function getConnectedNodes(
  nodeId: string,
  nodes: KnowledgeNode[],
  edges: KnowledgeEdge[]
): ConnectedNode[] {
  return edges
    .filter((edge) => edge.source === nodeId || edge.target === nodeId)
    .map((edge) => {
      const connectedId = edge.source === nodeId ? edge.target : edge.source;
      const node = nodes.find((candidate) => candidate.id === connectedId);
      return node ? { node, edge } : undefined;
    })
    .filter((item): item is ConnectedNode => Boolean(item));
}

export function getLearningPathNodes(
  pathId: string,
  paths: LearningPath[],
  nodes: KnowledgeNode[]
): KnowledgeNode[] {
  const path = paths.find((candidate) => candidate.id === pathId);
  if (!path) {
    return [];
  }

  return path.nodeIds
    .map((nodeId) => nodes.find((node) => node.id === nodeId))
    .filter((node): node is KnowledgeNode => Boolean(node));
}

export function getNodeTypeCounts(nodes: KnowledgeNode[]): Record<NodeType, number> {
  return nodes.reduce<Record<NodeType, number>>(
    (counts, node) => {
      counts[node.type] += 1;
      return counts;
    },
    {
      company: 0,
      model: 0,
      technique: 0,
      scenario: 0,
      engineering: 0
    }
  );
}

export function getVisibleGraph(
  nodes: KnowledgeNode[],
  edges: KnowledgeEdge[],
  filter: NodeFilter
): { nodes: KnowledgeNode[]; edges: KnowledgeEdge[] } {
  const visibleNodes = searchAndFilterNodes(nodes, filter);
  const visibleIds = new Set(visibleNodes.map((node) => node.id));
  const visibleEdges = edges.filter((edge) => visibleIds.has(edge.source) && visibleIds.has(edge.target));

  return { nodes: visibleNodes, edges: visibleEdges };
}

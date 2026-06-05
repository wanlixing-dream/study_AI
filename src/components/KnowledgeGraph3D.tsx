import { useMemo, useRef } from 'react';
import ForceGraph3D, { type ForceGraphMethods } from 'react-force-graph-3d';
import SpriteText from 'three-spritetext';
import type { KnowledgeEdge, KnowledgeNode, NodeType } from '../data/knowledgeGraph';
import { getUiText, nodeTypeLabels, type Locale } from '../lib/i18n';

type KnowledgeGraph3DProps = {
  edges: KnowledgeEdge[];
  highlightedNodeIds: Set<string>;
  locale: Locale;
  nodes: KnowledgeNode[];
  selectedNodeId: string;
  onSelectNode: (node: KnowledgeNode) => void;
};

type GraphNode = KnowledgeNode & {
  color: string;
};

const nodeColors: Record<NodeType, string> = {
  company: '#67e8f9',
  model: '#facc15',
  technique: '#a7f3d0',
  scenario: '#f9a8d4',
  engineering: '#c4b5fd',
  'case-study': '#fb7185'
};

export function KnowledgeGraph3D({
  edges,
  highlightedNodeIds,
  locale,
  nodes,
  selectedNodeId,
  onSelectNode
}: KnowledgeGraph3DProps) {
  const graphRef = useRef<ForceGraphMethods<GraphNode, KnowledgeEdge> | undefined>(undefined);
  const text = getUiText(locale);

  const graphData = useMemo(
    () => ({
      nodes: nodes.map((node) => ({
        ...node,
        color: nodeColors[node.type]
      })),
      links: edges
    }),
    [edges, nodes]
  );

  return (
    <section className="graph-stage" aria-label="interactive 3d knowledge graph">
      <ForceGraph3D
        ref={graphRef}
        graphData={graphData}
        backgroundColor="rgba(0,0,0,0)"
        linkColor={(link) =>
          highlightedNodeIds.has(String(link.source)) && highlightedNodeIds.has(String(link.target))
            ? 'rgba(250, 204, 21, 0.9)'
            : 'rgba(148, 163, 184, 0.34)'
        }
        linkDirectionalParticles={2}
        linkDirectionalParticleSpeed={0.004}
        linkLabel={(link) => `${link.label}: ${link.explanation}`}
        linkOpacity={0.72}
        nodeLabel={(node) => `${node.title} | ${nodeTypeLabels[locale][node.type]}`}
        nodeThreeObject={(node) => {
          const sprite = new SpriteText(node.title);
          sprite.color = node.id === selectedNodeId ? '#ffffff' : node.color;
          sprite.textHeight = node.id === selectedNodeId ? 7 : 5;
          sprite.backgroundColor = node.id === selectedNodeId ? 'rgba(15, 23, 42, 0.88)' : 'rgba(2, 6, 23, 0.5)';
          sprite.borderRadius = 4;
          sprite.padding = 4;
          return sprite;
        }}
        onNodeClick={(node) => {
          onSelectNode(node);
          const distance = 92;
          const distRatio = 1 + distance / Math.hypot(node.x ?? 1, node.y ?? 1, node.z ?? 1);
          graphRef.current?.cameraPosition(
            {
              x: (node.x ?? 1) * distRatio,
              y: (node.y ?? 1) * distRatio,
              z: (node.z ?? 1) * distRatio
            },
            { x: node.x ?? 0, y: node.y ?? 0, z: node.z ?? 0 },
            900
          );
        }}
        warmupTicks={80}
      />
      <div className="graph-caption">
        <span>{text.rotate}</span>
        <span>{text.zoom}</span>
        <span>{text.dragNodes}</span>
        <span>{text.clickToInspect}</span>
      </div>
    </section>
  );
}

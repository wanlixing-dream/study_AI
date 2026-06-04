import { useMemo, useState } from 'react';
import { DetailDrawer } from './components/DetailDrawer';
import { DetailPanel } from './components/DetailPanel';
import { KnowledgeGraph3D } from './components/KnowledgeGraph3D';
import { Sidebar } from './components/Sidebar';
import { knowledgeEdges, knowledgeNodes, learningPaths, type KnowledgeNode, type NodeType } from './data/knowledgeGraph';
import { getConnectedNodes, getLearningPathNodes, getNodeTypeCounts, getVisibleGraph } from './lib/graph';

const allNodeTypes: NodeType[] = ['company', 'model', 'technique', 'scenario', 'engineering', 'case-study'];

export default function App() {
  const [query, setQuery] = useState('');
  const [activeTypes, setActiveTypes] = useState<Set<NodeType>>(new Set());
  const [selectedNodeId, setSelectedNodeId] = useState('rag');
  const [selectedPathId, setSelectedPathId] = useState('enterprise-rag');
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const selectedNode = knowledgeNodes.find((node) => node.id === selectedNodeId) ?? knowledgeNodes[0];
  const selectedPathNodes = getLearningPathNodes(selectedPathId, learningPaths, knowledgeNodes);
  const selectedPathIds = new Set(selectedPathNodes.map((node) => node.id));

  const graph = useMemo(
    () => getVisibleGraph(knowledgeNodes, knowledgeEdges, { query, activeTypes }),
    [activeTypes, query]
  );

  const connectedNodes = useMemo(
    () => getConnectedNodes(selectedNode.id, knowledgeNodes, knowledgeEdges),
    [selectedNode.id]
  );

  const counts = useMemo(() => getNodeTypeCounts(knowledgeNodes), []);

  function toggleType(type: NodeType) {
    setActiveTypes((current) => {
      const next = new Set(current);
      if (next.has(type)) {
        next.delete(type);
      } else {
        next.add(type);
      }
      return next;
    });
  }

  function selectNode(node: KnowledgeNode) {
    setSelectedNodeId(node.id);
    setIsDetailOpen(true);
  }

  return (
    <main className="app-shell">
      <header className="topbar">
        <div>
          <p className="eyebrow">Local AI Learning System</p>
          <h1>Study AI Knowledge Graph</h1>
        </div>
        <div className="metric-strip" aria-label="knowledge graph counters">
          {allNodeTypes.map((type) => (
            <div className="metric" key={type}>
              <span>{counts[type]}</span>
              <small>{type}</small>
            </div>
          ))}
        </div>
      </header>

      <section className="workspace">
        <Sidebar
          activeTypes={activeTypes}
          allNodeTypes={allNodeTypes}
          learningPaths={learningPaths}
          query={query}
          selectedPathId={selectedPathId}
          selectedPathNodes={selectedPathNodes}
          onPathChange={setSelectedPathId}
          onQueryChange={setQuery}
          onSelectNode={selectNode}
          onToggleType={toggleType}
        />
        <KnowledgeGraph3D
          edges={graph.edges}
          highlightedNodeIds={selectedPathIds}
          nodes={graph.nodes}
          selectedNodeId={selectedNode.id}
          onSelectNode={selectNode}
        />
        <DetailPanel node={selectedNode} connectedNodes={connectedNodes} />
      </section>
      <DetailDrawer
        connectedNodes={connectedNodes}
        isOpen={isDetailOpen}
        node={selectedNode}
        onClose={() => setIsDetailOpen(false)}
      />
    </main>
  );
}

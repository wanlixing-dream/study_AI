import { useMemo, useState } from 'react';
import { DetailDrawer } from './components/DetailDrawer';
import { DetailPanel } from './components/DetailPanel';
import { KnowledgeGraph3D } from './components/KnowledgeGraph3D';
import { Sidebar } from './components/Sidebar';
import { knowledgeEdges, knowledgeNodes, learningPaths, type KnowledgeNode, type NodeType } from './data/knowledgeGraph';
import { getUiText, nodeTypeLabels, type Locale } from './lib/i18n';
import { getConnectedNodes, getLearningPathNodes, getNodeTypeCounts, getVisibleGraph } from './lib/graph';

const allNodeTypes: NodeType[] = ['company', 'model', 'technique', 'scenario', 'engineering', 'case-study'];

export default function App() {
  const [query, setQuery] = useState('');
  const [activeTypes, setActiveTypes] = useState<Set<NodeType>>(new Set());
  const [selectedNodeId, setSelectedNodeId] = useState('rag');
  const [selectedPathId, setSelectedPathId] = useState('enterprise-rag');
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [locale, setLocale] = useState<Locale>('zh');
  const text = getUiText(locale);

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
          <p className="eyebrow">{text.appEyebrow}</p>
          <h1>{text.appTitle}</h1>
        </div>
        <div className="topbar-actions">
          <button
            className="language-toggle"
            type="button"
            onClick={() => setLocale((current) => (current === 'zh' ? 'en' : 'zh'))}
          >
            {text.toggleLanguage}
          </button>
          <div className="metric-strip" aria-label={text.graphCounterLabel}>
            {allNodeTypes.map((type) => (
              <div className="metric" key={type}>
                <span>{counts[type]}</span>
                <small>{nodeTypeLabels[locale][type]}</small>
              </div>
            ))}
          </div>
        </div>
      </header>

      <section className="workspace">
        <Sidebar
          activeTypes={activeTypes}
          allNodeTypes={allNodeTypes}
          learningPaths={learningPaths}
          locale={locale}
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
          locale={locale}
          nodes={graph.nodes}
          selectedNodeId={selectedNode.id}
          onSelectNode={selectNode}
        />
        <DetailPanel locale={locale} node={selectedNode} connectedNodes={connectedNodes} />
      </section>
      <DetailDrawer
        connectedNodes={connectedNodes}
        isOpen={isDetailOpen}
        locale={locale}
        node={selectedNode}
        onClose={() => setIsDetailOpen(false)}
      />
    </main>
  );
}

import type { KnowledgeNode, LearningPath, NodeType } from '../data/knowledgeGraph';

type SidebarProps = {
  activeTypes: Set<NodeType>;
  allNodeTypes: NodeType[];
  learningPaths: LearningPath[];
  query: string;
  selectedPathId: string;
  selectedPathNodes: KnowledgeNode[];
  onPathChange: (pathId: string) => void;
  onQueryChange: (query: string) => void;
  onSelectNode: (node: KnowledgeNode) => void;
  onToggleType: (type: NodeType) => void;
};

const typeLabels: Record<NodeType, string> = {
  company: 'Companies',
  model: 'Models',
  technique: 'Techniques',
  scenario: 'Scenarios',
  engineering: 'Engineering',
  'case-study': 'Case Studies'
};

export function Sidebar({
  activeTypes,
  allNodeTypes,
  learningPaths,
  query,
  selectedPathId,
  selectedPathNodes,
  onPathChange,
  onQueryChange,
  onSelectNode,
  onToggleType
}: SidebarProps) {
  const selectedPath = learningPaths.find((path) => path.id === selectedPathId) ?? learningPaths[0];

  return (
    <aside className="sidebar">
      <label className="search-box">
        <span>Search</span>
        <input
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          placeholder="rag, mcp, deployment..."
        />
      </label>

      <section>
        <h2>Map Layers</h2>
        <div className="filter-list">
          {allNodeTypes.map((type) => (
            <button
              className={activeTypes.has(type) ? 'filter active' : 'filter'}
              key={type}
              onClick={() => onToggleType(type)}
              type="button"
            >
              <span className={`dot ${type}`} />
              {typeLabels[type]}
            </button>
          ))}
        </div>
      </section>

      <section>
        <h2>Learning Path</h2>
        <select value={selectedPathId} onChange={(event) => onPathChange(event.target.value)}>
          {learningPaths.map((path) => (
            <option key={path.id} value={path.id}>
              {path.title}
            </option>
          ))}
        </select>
        <p className="path-description">{selectedPath.description}</p>
        <ol className="path-list">
          {selectedPathNodes.map((node) => (
            <li key={node.id}>
              <button type="button" onClick={() => onSelectNode(node)}>
                <span>{node.title}</span>
                <small>{node.type}</small>
              </button>
            </li>
          ))}
        </ol>
      </section>
    </aside>
  );
}

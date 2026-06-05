import type { KnowledgeNode, LearningPath, NodeType } from '../data/knowledgeGraph';
import { getUiText, nodeTypeLabels, nodeTypePluralLabels, type Locale } from '../lib/i18n';

type SidebarProps = {
  activeTypes: Set<NodeType>;
  allNodeTypes: NodeType[];
  learningPaths: LearningPath[];
  locale: Locale;
  query: string;
  selectedPathId: string;
  selectedPathNodes: KnowledgeNode[];
  onPathChange: (pathId: string) => void;
  onQueryChange: (query: string) => void;
  onSelectNode: (node: KnowledgeNode) => void;
  onToggleType: (type: NodeType) => void;
};

export function Sidebar({
  activeTypes,
  allNodeTypes,
  learningPaths,
  locale,
  query,
  selectedPathId,
  selectedPathNodes,
  onPathChange,
  onQueryChange,
  onSelectNode,
  onToggleType
}: SidebarProps) {
  const selectedPath = learningPaths.find((path) => path.id === selectedPathId) ?? learningPaths[0];
  const text = getUiText(locale);

  return (
    <aside className="sidebar">
      <label className="search-box">
        <span>{text.search}</span>
        <input
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          placeholder={text.searchPlaceholder}
        />
      </label>

      <section>
        <h2>{text.mapLayers}</h2>
        <div className="filter-list">
          {allNodeTypes.map((type) => (
            <button
              className={activeTypes.has(type) ? 'filter active' : 'filter'}
              key={type}
              onClick={() => onToggleType(type)}
              type="button"
            >
              <span className={`dot ${type}`} />
              {nodeTypePluralLabels[locale][type]}
            </button>
          ))}
        </div>
      </section>

      <section>
        <h2>{text.learningPath}</h2>
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
                <small>{nodeTypeLabels[locale][node.type]}</small>
              </button>
            </li>
          ))}
        </ol>
      </section>
    </aside>
  );
}

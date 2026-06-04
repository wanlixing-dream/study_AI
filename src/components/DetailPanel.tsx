import type { ConnectedNode } from '../lib/graph';
import type { KnowledgeNode, NodeType } from '../data/knowledgeGraph';

type DetailPanelProps = {
  node: KnowledgeNode;
  connectedNodes: ConnectedNode[];
};

const typeLabels: Record<NodeType, string> = {
  company: 'Company',
  model: 'Model',
  technique: 'Technique',
  scenario: 'Scenario',
  engineering: 'Engineering',
  'case-study': 'Case Study'
};

export function DetailPanel({ node, connectedNodes }: DetailPanelProps) {
  return (
    <aside className="detail-panel">
      <div className="detail-header">
        <span className={`type-pill ${node.type}`}>{typeLabels[node.type]}</span>
        <span className="review-status">{node.reviewStatus}</span>
      </div>
      <h2>{node.title}</h2>
      <p className="summary">{node.summary}</p>
      {node.detail ? (
        <p className="detail-hint">Click the node again or a learning path item to open the full research detail.</p>
      ) : null}

      <div className="tag-list">
        {node.tags.map((tag) => (
          <span key={tag}>{tag}</span>
        ))}
      </div>

      <dl className="meta-grid">
        <div>
          <dt>Learning</dt>
          <dd>{node.learningStatus}</dd>
        </div>
        <div>
          <dt>Confidence</dt>
          <dd>{Math.round(node.confidence * 100)}%</dd>
        </div>
        <div>
          <dt>Updated</dt>
          <dd>{node.updatedAt}</dd>
        </div>
        <div>
          <dt>Source</dt>
          <dd>{node.source}</dd>
        </div>
      </dl>

      <section className="connections">
        <h3>Connected Concepts</h3>
        {connectedNodes.map(({ node: connectedNode, edge }) => (
          <article key={`${edge.source}-${edge.target}`}>
            <strong>{connectedNode.title}</strong>
            <span>{edge.label}</span>
            <p>{edge.explanation}</p>
          </article>
        ))}
      </section>
    </aside>
  );
}

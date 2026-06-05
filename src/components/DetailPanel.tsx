import type { ConnectedNode } from '../lib/graph';
import type { KnowledgeNode } from '../data/knowledgeGraph';
import { getUiText, learningStatusLabels, nodeTypeLabels, reviewStatusLabels, type Locale } from '../lib/i18n';

type DetailPanelProps = {
  node: KnowledgeNode;
  connectedNodes: ConnectedNode[];
  locale: Locale;
};

export function DetailPanel({ node, connectedNodes, locale }: DetailPanelProps) {
  const text = getUiText(locale);

  return (
    <aside className="detail-panel">
      <div className="detail-header">
        <span className={`type-pill ${node.type}`}>{nodeTypeLabels[locale][node.type]}</span>
        <span className="review-status">{reviewStatusLabels[locale][node.reviewStatus]}</span>
      </div>
      <h2>{node.title}</h2>
      <p className="summary">{node.summary}</p>
      {node.detail ? (
        <p className="detail-hint">{text.fullDetailHint}</p>
      ) : null}

      <div className="tag-list">
        {node.tags.map((tag) => (
          <span key={tag}>{tag}</span>
        ))}
      </div>

      <dl className="meta-grid">
        <div>
          <dt>{text.learning}</dt>
          <dd>{learningStatusLabels[locale][node.learningStatus]}</dd>
        </div>
        <div>
          <dt>{text.confidence}</dt>
          <dd>{Math.round(node.confidence * 100)}%</dd>
        </div>
        <div>
          <dt>{text.updated}</dt>
          <dd>{node.updatedAt}</dd>
        </div>
        <div>
          <dt>{text.source}</dt>
          <dd>{node.source}</dd>
        </div>
      </dl>

      <section className="connections">
        <h3>{text.connectedConcepts}</h3>
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

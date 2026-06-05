import type { ConnectedNode } from '../lib/graph';
import type { KnowledgeNode } from '../data/knowledgeGraph';
import { evidenceTypeLabels, getUiText, nodeTypeLabels, type Locale } from '../lib/i18n';

type DetailDrawerProps = {
  node: KnowledgeNode;
  connectedNodes: ConnectedNode[];
  isOpen: boolean;
  locale: Locale;
  onClose: () => void;
};

export function DetailDrawer({ node, connectedNodes, isOpen, locale, onClose }: DetailDrawerProps) {
  const text = getUiText(locale);

  if (!isOpen) {
    return null;
  }

  return (
    <div className="drawer-backdrop" role="presentation" onClick={onClose}>
      <aside
        aria-label={`${node.title} ${text.detailAriaSuffix}`}
        className="detail-drawer"
        role="dialog"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="drawer-header">
          <div>
            <span className={`type-pill ${node.type}`}>{nodeTypeLabels[locale][node.type]}</span>
            <h2>{node.title}</h2>
          </div>
          <button className="icon-button" type="button" aria-label={text.closeDetail} onClick={onClose}>
            x
          </button>
        </div>

        <p className="summary">{node.summary}</p>

        {node.detail ? (
          <div className="detail-sections">
            <DetailSection title={text.problem} content={node.detail.problem} />
            <DetailSection title={text.rootCause} content={node.detail.rootCause} />
            <DetailSection title={text.solution} content={node.detail.solution} />
            <DetailSection title={text.engineeringLesson} content={node.detail.engineeringLesson} />

            {node.detail.relatedFrontierTech?.length ? (
              <section>
                <h3>{text.relatedFrontierTech}</h3>
                <div className="tag-list">
                  {node.detail.relatedFrontierTech.map((tech) => (
                    <span key={tech}>{tech}</span>
                  ))}
                </div>
              </section>
            ) : null}

            <section>
              <h3>{text.evidence}</h3>
              <div className="evidence-list">
                {node.detail.evidence.map((item) => (
                  <article key={`${item.type}-${item.title}-${item.commitHash ?? item.urlOrPath}`}>
                    <strong>{item.title}</strong>
                    <span>{evidenceTypeLabels[locale][item.type] ?? item.type}{item.commitHash ? ` / ${item.commitHash}` : ''}</span>
                    <p>{item.urlOrPath}</p>
                  </article>
                ))}
              </div>
            </section>
          </div>
        ) : (
          <p className="empty-detail">{text.emptyDetail}</p>
        )}

        <section className="connections drawer-connections">
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
    </div>
  );
}

function DetailSection({ title, content }: { title: string; content?: string }) {
  if (!content) {
    return null;
  }

  return (
    <section>
      <h3>{title}</h3>
      <p>{content}</p>
    </section>
  );
}

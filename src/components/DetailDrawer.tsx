import type { ConnectedNode } from '../lib/graph';
import type { KnowledgeNode, NodeType } from '../data/knowledgeGraph';

type DetailDrawerProps = {
  node: KnowledgeNode;
  connectedNodes: ConnectedNode[];
  isOpen: boolean;
  onClose: () => void;
};

const typeLabels: Record<NodeType, string> = {
  company: 'Company',
  model: 'Model',
  technique: 'Technique',
  scenario: 'Scenario',
  engineering: 'Engineering',
  'case-study': 'Case Study'
};

export function DetailDrawer({ node, connectedNodes, isOpen, onClose }: DetailDrawerProps) {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="drawer-backdrop" role="presentation" onClick={onClose}>
      <aside
        aria-label={`${node.title} detail`}
        className="detail-drawer"
        role="dialog"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="drawer-header">
          <div>
            <span className={`type-pill ${node.type}`}>{typeLabels[node.type]}</span>
            <h2>{node.title}</h2>
          </div>
          <button className="icon-button" type="button" aria-label="Close detail" onClick={onClose}>
            x
          </button>
        </div>

        <p className="summary">{node.summary}</p>

        {node.detail ? (
          <div className="detail-sections">
            <DetailSection title="Problem" content={node.detail.problem} />
            <DetailSection title="Root Cause" content={node.detail.rootCause} />
            <DetailSection title="Solution" content={node.detail.solution} />
            <DetailSection title="Engineering Lesson" content={node.detail.engineeringLesson} />

            {node.detail.relatedFrontierTech?.length ? (
              <section>
                <h3>Related Frontier Tech</h3>
                <div className="tag-list">
                  {node.detail.relatedFrontierTech.map((tech) => (
                    <span key={tech}>{tech}</span>
                  ))}
                </div>
              </section>
            ) : null}

            <section>
              <h3>Evidence</h3>
              <div className="evidence-list">
                {node.detail.evidence.map((item) => (
                  <article key={`${item.type}-${item.title}-${item.commitHash ?? item.urlOrPath}`}>
                    <strong>{item.title}</strong>
                    <span>{item.type}{item.commitHash ? ` / ${item.commitHash}` : ''}</span>
                    <p>{item.urlOrPath}</p>
                  </article>
                ))}
              </div>
            </section>
          </div>
        ) : (
          <p className="empty-detail">This node has a short summary now. The next analysis pass can enrich it with problem, root cause, solution, and evidence.</p>
        )}

        <section className="connections drawer-connections">
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


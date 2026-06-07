-- Study AI Phase A schema.
-- Target: PostgreSQL with pgvector enabled.

CREATE EXTENSION IF NOT EXISTS vector;
CREATE EXTENSION IF NOT EXISTS pg_trgm;

CREATE TABLE IF NOT EXISTS documents (
  id TEXT PRIMARY KEY,
  owner_id TEXT NOT NULL,
  title TEXT NOT NULL,
  source_type TEXT NOT NULL,
  storage_uri TEXT NOT NULL,
  mime_type TEXT NOT NULL DEFAULT 'text/plain',
  file_size BIGINT NOT NULL DEFAULT 0,
  content_hash TEXT NOT NULL DEFAULT '',
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_documents_owner_status ON documents(owner_id, status);
CREATE INDEX IF NOT EXISTS idx_documents_title_trgm ON documents USING gin (title gin_trgm_ops);

CREATE TABLE IF NOT EXISTS document_chunks (
  id TEXT PRIMARY KEY,
  document_id TEXT NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
  seq INTEGER NOT NULL,
  start_pos INTEGER NOT NULL,
  end_pos INTEGER NOT NULL,
  content TEXT NOT NULL,
  token_count INTEGER NOT NULL DEFAULT 0,
  category TEXT NOT NULL DEFAULT 'uncategorized',
  tags TEXT[] NOT NULL DEFAULT '{}',
  search_vector tsvector GENERATED ALWAYS AS (to_tsvector('simple', content)) STORED,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_document_chunks_doc_seq ON document_chunks(document_id, seq);
CREATE INDEX IF NOT EXISTS idx_document_chunks_category ON document_chunks(category);
CREATE INDEX IF NOT EXISTS idx_document_chunks_search ON document_chunks USING gin(search_vector);

CREATE TABLE IF NOT EXISTS chunk_embeddings (
  chunk_id TEXT PRIMARY KEY REFERENCES document_chunks(id) ON DELETE CASCADE,
  embedding vector(1024),
  embedding_model TEXT NOT NULL,
  embedding_dim INTEGER NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_chunk_embeddings_vector
  ON chunk_embeddings USING ivfflat (embedding vector_cosine_ops)
  WITH (lists = 100);

CREATE TABLE IF NOT EXISTS retrieval_sparse_terms (
  chunk_id TEXT NOT NULL REFERENCES document_chunks(id) ON DELETE CASCADE,
  term TEXT NOT NULL,
  weight DOUBLE PRECISION NOT NULL,
  PRIMARY KEY (chunk_id, term)
);

CREATE INDEX IF NOT EXISTS idx_retrieval_sparse_terms_term ON retrieval_sparse_terms(term);

CREATE TABLE IF NOT EXISTS agent_memories (
  id TEXT PRIMARY KEY,
  owner_id TEXT NOT NULL,
  scope TEXT NOT NULL,
  memory_type TEXT NOT NULL,
  content TEXT NOT NULL,
  entities TEXT[] NOT NULL DEFAULT '{}',
  importance DOUBLE PRECISION NOT NULL DEFAULT 0.5,
  confidence DOUBLE PRECISION NOT NULL DEFAULT 0.5,
  source_id TEXT,
  status TEXT NOT NULL DEFAULT 'candidate',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_agent_memories_owner_scope ON agent_memories(owner_id, scope);
CREATE INDEX IF NOT EXISTS idx_agent_memories_status ON agent_memories(status);

CREATE TABLE IF NOT EXISTS memory_events (
  id TEXT PRIMARY KEY,
  memory_id TEXT REFERENCES agent_memories(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  reason TEXT NOT NULL,
  actor TEXT NOT NULL DEFAULT 'system',
  source_text TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS memory_index (
  id TEXT PRIMARY KEY,
  owner_id TEXT NOT NULL,
  layer TEXT NOT NULL,
  category TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  memory_ref TEXT NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_memory_index_owner_layer ON memory_index(owner_id, layer);

CREATE TABLE IF NOT EXISTS knowledge_candidates (
  id TEXT PRIMARY KEY,
  candidate_type TEXT NOT NULL,
  title TEXT NOT NULL,
  summary TEXT NOT NULL,
  confidence DOUBLE PRECISION NOT NULL,
  review_status TEXT NOT NULL DEFAULT 'candidate',
  source_document_id TEXT REFERENCES documents(id) ON DELETE SET NULL,
  source_memory_id TEXT REFERENCES agent_memories(id) ON DELETE SET NULL,
  tags TEXT[] NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_knowledge_candidates_review ON knowledge_candidates(review_status);

CREATE TABLE IF NOT EXISTS candidate_edges (
  id TEXT PRIMARY KEY,
  candidate_id TEXT NOT NULL REFERENCES knowledge_candidates(id) ON DELETE CASCADE,
  source_node TEXT NOT NULL,
  target_node TEXT NOT NULL,
  label TEXT NOT NULL,
  explanation TEXT NOT NULL DEFAULT ''
);

CREATE TABLE IF NOT EXISTS evidence_records (
  id TEXT PRIMARY KEY,
  candidate_id TEXT NOT NULL REFERENCES knowledge_candidates(id) ON DELETE CASCADE,
  source_type TEXT NOT NULL,
  source_id TEXT NOT NULL,
  quote TEXT NOT NULL DEFAULT '',
  location TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS ingestion_jobs (
  id TEXT PRIMARY KEY,
  owner_id TEXT NOT NULL,
  document_id TEXT NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'queued',
  stage TEXT NOT NULL DEFAULT 'created',
  error TEXT NOT NULL DEFAULT '',
  retry_count INTEGER NOT NULL DEFAULT 0,
  started_at TIMESTAMPTZ,
  finished_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_ingestion_jobs_status ON ingestion_jobs(status, created_at);
CREATE INDEX IF NOT EXISTS idx_ingestion_jobs_owner ON ingestion_jobs(owner_id);

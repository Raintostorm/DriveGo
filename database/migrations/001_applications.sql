-- Additive migration: license applications + documents (no changes to existing tables)

CREATE TABLE IF NOT EXISTS license_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  license_class VARCHAR(16) NOT NULL DEFAULT 'B2',
  center_id UUID REFERENCES training_centers(id),
  status VARCHAR(32) NOT NULL DEFAULT 'draft',
  personal_info JSONB NOT NULL DEFAULT '{}'::jsonb,
  submitted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_license_applications_user ON license_applications(user_id);
CREATE INDEX IF NOT EXISTS idx_license_applications_status ON license_applications(status);

CREATE TABLE IF NOT EXISTS application_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id UUID NOT NULL REFERENCES license_applications(id) ON DELETE CASCADE,
  doc_type VARCHAR(32) NOT NULL,
  slot_index INT NOT NULL DEFAULT 0,
  file_path TEXT NOT NULL,
  original_name VARCHAR(255),
  mime_type VARCHAR(128),
  uploaded_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(application_id, doc_type, slot_index)
);

CREATE INDEX IF NOT EXISTS idx_application_documents_app ON application_documents(application_id);

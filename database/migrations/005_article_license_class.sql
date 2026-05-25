ALTER TABLE document_articles
  ADD COLUMN IF NOT EXISTS license_class VARCHAR(16);

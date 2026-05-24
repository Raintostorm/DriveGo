ALTER TABLE student_profiles
  ADD COLUMN IF NOT EXISTS held_licenses JSONB NOT NULL DEFAULT '[]'::jsonb;

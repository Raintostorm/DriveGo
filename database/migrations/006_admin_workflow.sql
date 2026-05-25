-- Admin workflow: slot types, review fields, center scope for admins

ALTER TABLE users
  ADD COLUMN IF NOT EXISTS center_id UUID REFERENCES training_centers(id);

ALTER TABLE schedule_slots
  ADD COLUMN IF NOT EXISTS slot_type VARCHAR(32) NOT NULL DEFAULT 'theory_exam';

UPDATE schedule_slots SET slot_type = 'theory_exam' WHERE slot_type IS NULL OR slot_type = '';

ALTER TABLE license_applications
  ADD COLUMN IF NOT EXISTS admin_note TEXT,
  ADD COLUMN IF NOT EXISTS reviewed_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS reviewed_by UUID REFERENCES users(id);

ALTER TABLE exam_registrations
  ADD COLUMN IF NOT EXISTS admin_note TEXT,
  ADD COLUMN IF NOT EXISTS reviewed_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS reviewed_by UUID REFERENCES users(id);

CREATE INDEX IF NOT EXISTS idx_exam_registrations_status ON exam_registrations(status);
CREATE INDEX IF NOT EXISTS idx_schedule_slots_slot_type ON schedule_slots(slot_type);
CREATE INDEX IF NOT EXISTS idx_license_applications_center ON license_applications(center_id);

-- Enrollment + dossier request + payment type (additive)

ALTER TABLE license_classes
  ADD COLUMN IF NOT EXISTS enrollment_fee NUMERIC(12, 2) DEFAULT 5000;

UPDATE license_classes SET enrollment_fee = 5000 WHERE enrollment_fee IS NULL;

ALTER TABLE payments
  ADD COLUMN IF NOT EXISTS payment_type VARCHAR(32) DEFAULT 'premium',
  ADD COLUMN IF NOT EXISTS license_class VARCHAR(16);

UPDATE payments SET payment_type = 'premium' WHERE payment_type IS NULL AND plan_id IS NOT NULL;

ALTER TABLE license_applications
  ADD COLUMN IF NOT EXISTS dossier_requested_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS dossier_deadline TIMESTAMPTZ;

CREATE TABLE IF NOT EXISTS course_enrollments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  license_class VARCHAR(16) NOT NULL,
  status VARCHAR(32) NOT NULL DEFAULT 'pending',
  payment_id UUID REFERENCES payments(id) ON DELETE SET NULL,
  enrolled_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, license_class)
);

CREATE INDEX IF NOT EXISTS idx_course_enrollments_user ON course_enrollments(user_id);
CREATE INDEX IF NOT EXISTS idx_course_enrollments_status ON course_enrollments(status);
CREATE INDEX IF NOT EXISTS idx_payments_payment_type ON payments(payment_type);

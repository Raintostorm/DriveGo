CREATE TABLE IF NOT EXISTS class_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  center_id UUID NOT NULL REFERENCES training_centers(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  session_date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  venue VARCHAR(255),
  session_type VARCHAR(32) NOT NULL DEFAULT 'theory',
  license_class VARCHAR(16),
  max_capacity INT NOT NULL DEFAULT 30,
  created_by UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS session_attendance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES class_sessions(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  checked_in_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  method VARCHAR(16) NOT NULL DEFAULT 'self',
  UNIQUE (session_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_class_sessions_center_date ON class_sessions(center_id, session_date);
CREATE INDEX IF NOT EXISTS idx_session_attendance_session ON session_attendance(session_id);

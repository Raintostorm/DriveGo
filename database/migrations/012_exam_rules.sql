-- Exam rules per license class (A1/A2 motorcycle 250, B1/B2 car 600)

ALTER TABLE license_classes
  ADD COLUMN IF NOT EXISTS questions_per_exam INT NOT NULL DEFAULT 30,
  ADD COLUMN IF NOT EXISTS exam_duration_minutes INT NOT NULL DEFAULT 22,
  ADD COLUMN IF NOT EXISTS pass_min_correct INT NOT NULL DEFAULT 26,
  ADD COLUMN IF NOT EXISTS bank_question_count INT NOT NULL DEFAULT 600,
  ADD COLUMN IF NOT EXISTS papers_count INT NOT NULL DEFAULT 20;

UPDATE license_classes SET
  questions_per_exam = 25,
  exam_duration_minutes = 19,
  pass_min_correct = 21,
  bank_question_count = 250,
  papers_count = 10
WHERE code IN ('A1', 'A2');

UPDATE license_classes SET
  questions_per_exam = 30,
  exam_duration_minutes = 22,
  pass_min_correct = 26,
  bank_question_count = 600,
  papers_count = 20
WHERE code IN ('B1', 'B2');

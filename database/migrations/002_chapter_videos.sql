-- Chapter videos + descriptions for theory lessons
ALTER TABLE study_chapters ADD COLUMN IF NOT EXISTS video_url TEXT;
ALTER TABLE study_chapters ADD COLUMN IF NOT EXISTS description TEXT;

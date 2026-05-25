-- Replace dead YouTube embeds (Thầy Tâm / 600 câu lý thuyết — còn phát)
UPDATE study_chapters SET video_url = 'https://www.youtube-nocookie.com/embed/8ndOIY5FNeo?rel=0&modestbranding=1'
WHERE video_url LIKE '%uxUPB3650Dg%';

UPDATE study_chapters SET video_url = 'https://www.youtube-nocookie.com/embed/jEqaK9lvlvA?rel=0&modestbranding=1'
WHERE video_url LIKE '%LlSwGVdgP80%';

UPDATE study_chapters SET video_url = 'https://www.youtube-nocookie.com/embed/MFx-VLUi4tw?rel=0&modestbranding=1'
WHERE video_url LIKE '%gmqXczpogrA%';

UPDATE study_chapters SET video_url = 'https://www.youtube-nocookie.com/embed/Uv_j-wkRFHE?rel=0&modestbranding=1'
WHERE video_url LIKE '%YN-hDPsGpsg%';

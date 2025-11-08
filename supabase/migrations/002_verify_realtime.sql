-- Verification script for Realtime setup
-- Run this to check if Realtime is properly configured

-- Check if the publication exists
SELECT 
  pubname as publication_name,
  puballtables as all_tables
FROM pg_publication 
WHERE pubname = 'supabase_realtime';

-- Check if scene_objects is in the publication
SELECT 
  schemaname,
  tablename
FROM pg_publication_tables 
WHERE pubname = 'supabase_realtime' 
  AND tablename = 'scene_objects';

-- If scene_objects is not in the publication, add it:
-- ALTER PUBLICATION supabase_realtime ADD TABLE scene_objects;


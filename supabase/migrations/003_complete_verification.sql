-- Complete verification script for the 3D Builder setup
-- Run these queries to verify everything is configured correctly

-- 1. Verify table exists
SELECT 
  table_name,
  table_schema
FROM information_schema.tables 
WHERE table_name = 'scene_objects' 
  AND table_schema = 'public';

-- 2. Verify Realtime publication (you already did this - should return 1 row)
SELECT 
  schemaname,
  tablename
FROM pg_publication_tables 
WHERE pubname = 'supabase_realtime' 
  AND tablename = 'scene_objects';

-- 3. Verify RLS is enabled
SELECT 
  tablename,
  rowsecurity as rls_enabled
FROM pg_tables 
WHERE schemaname = 'public' 
  AND tablename = 'scene_objects';

-- 4. Verify RLS policies exist
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd as command
FROM pg_policies 
WHERE tablename = 'scene_objects'
ORDER BY policyname;

-- 5. Verify indexes exist
SELECT 
  indexname,
  indexdef
FROM pg_indexes 
WHERE tablename = 'scene_objects';

-- 6. Verify trigger exists
SELECT 
  trigger_name,
  event_manipulation,
  event_object_table,
  action_statement
FROM information_schema.triggers 
WHERE event_object_table = 'scene_objects';

-- Expected results:
-- 1. Table exists: 1 row
-- 2. Realtime: 1 row (you already confirmed this ✓)
-- 3. RLS enabled: rowsecurity = true
-- 4. Policies: 4 policies (SELECT, INSERT, UPDATE, DELETE)
-- 5. Indexes: At least 2 indexes (user_id, created_at)
-- 6. Trigger: 1 trigger (update_updated_at_column)


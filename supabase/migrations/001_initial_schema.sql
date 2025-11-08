-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create scene_objects table
CREATE TABLE IF NOT EXISTS scene_objects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('cube', 'sphere')),
  position JSONB NOT NULL DEFAULT '[0, 0, 0]',
  rotation JSONB NOT NULL DEFAULT '[0, 0, 0]',
  scale JSONB NOT NULL DEFAULT '[1, 1, 1]',
  color TEXT NOT NULL DEFAULT '#ffffff',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_scene_objects_user_id ON scene_objects(user_id);
CREATE INDEX IF NOT EXISTS idx_scene_objects_created_at ON scene_objects(created_at);

-- Enable Row Level Security
ALTER TABLE scene_objects ENABLE ROW LEVEL SECURITY;

-- Create policies
-- Allow all authenticated users to read all objects
CREATE POLICY "Allow authenticated users to read scene objects"
  ON scene_objects FOR SELECT
  TO authenticated
  USING (true);

-- Allow all authenticated users to insert objects
CREATE POLICY "Allow authenticated users to insert scene objects"
  ON scene_objects FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Allow users to update their own objects or any object (for collaborative editing)
CREATE POLICY "Allow authenticated users to update scene objects"
  ON scene_objects FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Allow users to delete their own objects or any object (for collaborative editing)
CREATE POLICY "Allow authenticated users to delete scene objects"
  ON scene_objects FOR DELETE
  TO authenticated
  USING (true);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_scene_objects_updated_at
  BEFORE UPDATE ON scene_objects
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable realtime for scene_objects table
-- Note: This requires the Realtime feature to be enabled in your Supabase project
-- The supabase_realtime publication is created automatically by Supabase
-- If the publication doesn't exist, create it first:
-- CREATE PUBLICATION supabase_realtime FOR TABLE scene_objects;
-- Or add the table to existing publication:
ALTER PUBLICATION supabase_realtime ADD TABLE scene_objects;


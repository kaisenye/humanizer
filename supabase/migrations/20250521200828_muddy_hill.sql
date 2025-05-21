/*
  # Create projects table

  1. New Tables
    - `projects`
      - `id` (uuid, primary key)
      - `user_id` (uuid) - References profiles
      - `title` (text)
      - `content` (text)
      - `humanized_content` (text)
      - `credits_used` (integer)
      - `mode` (enum)
      - `humanization_strength` (numeric)
      - `personality` (enum)
      - `length_adjustment` (enum)
      - `humanization_document_id` (text)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `projects` table
    - Add policies for authenticated users to:
      - Create their own projects
      - Read their own projects
      - Update their own projects
      - Delete their own projects
*/

-- Create enum types for projects
CREATE TYPE project_mode AS ENUM ('standard', 'casual', 'academic', 'creative');
CREATE TYPE project_personality AS ENUM ('neutral', 'friendly', 'professional', 'casual');
CREATE TYPE project_length_adjustment AS ENUM ('maintain', 'shorter', 'longer');

-- Create projects table
CREATE TABLE IF NOT EXISTS projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  content text NOT NULL,
  humanized_content text,
  credits_used integer DEFAULT 0,
  mode project_mode DEFAULT 'standard',
  humanization_strength numeric DEFAULT 0.5,
  personality project_personality DEFAULT 'neutral',
  length_adjustment project_length_adjustment DEFAULT 'maintain',
  humanization_document_id text,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can create own projects"
  ON projects
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own projects"
  ON projects
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own projects"
  ON projects
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own projects"
  ON projects
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);
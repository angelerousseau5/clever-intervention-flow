
-- Add form_data column to tickets table
ALTER TABLE tickets 
ADD COLUMN IF NOT EXISTS form_data TEXT;

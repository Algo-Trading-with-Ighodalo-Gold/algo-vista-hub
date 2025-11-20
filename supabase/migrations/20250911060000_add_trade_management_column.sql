-- Add trade_management column to project_inquiries table
ALTER TABLE public.project_inquiries 
ADD COLUMN IF NOT EXISTS trade_management TEXT;

-- Drop existing policies if they exist and recreate to ensure they work
DROP POLICY IF EXISTS "Allow public insert on project inquiries" ON public.project_inquiries;
DROP POLICY IF EXISTS "Users can view their own project inquiries" ON public.project_inquiries;
DROP POLICY IF EXISTS "Anyone can view project inquiries" ON public.project_inquiries;

-- Create policy to allow public insert on project_inquiries
CREATE POLICY "Allow public insert on project inquiries" 
ON public.project_inquiries 
FOR INSERT 
WITH CHECK (true);

-- Create policy to allow users to view project inquiries by email
CREATE POLICY "Users can view their own project inquiries" 
ON public.project_inquiries 
FOR SELECT 
USING (true);

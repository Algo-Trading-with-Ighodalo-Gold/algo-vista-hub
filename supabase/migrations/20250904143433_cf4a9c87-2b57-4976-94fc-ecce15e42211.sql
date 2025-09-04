-- Create project inquiries table
CREATE TABLE public.project_inquiries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  strategy TEXT NOT NULL,
  instruments TEXT,
  timeframes TEXT,
  entry_logic TEXT NOT NULL,
  exit_logic TEXT NOT NULL,
  risk_management TEXT,
  special_features TEXT,
  budget TEXT,
  timeline TEXT,
  nda_agreed BOOLEAN NOT NULL DEFAULT false,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.project_inquiries ENABLE ROW LEVEL SECURITY;

-- Create policies for admin access (you can create admin users later)
CREATE POLICY "Allow public insert on project inquiries" 
ON public.project_inquiries 
FOR INSERT 
WITH CHECK (true);

-- Add trigger for automatic timestamp updates
CREATE TRIGGER update_project_inquiries_updated_at
BEFORE UPDATE ON public.project_inquiries
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
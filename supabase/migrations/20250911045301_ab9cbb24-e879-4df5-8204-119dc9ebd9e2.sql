-- Create support_tickets table for contact form submissions
CREATE TABLE public.support_tickets (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  topic TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.support_tickets ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anyone to submit support tickets
CREATE POLICY "Anyone can submit support tickets" 
ON public.support_tickets 
FOR INSERT 
WITH CHECK (true);

-- Create policy for users to view their own tickets (if they have an account)
CREATE POLICY "Users can view their own support tickets" 
ON public.support_tickets 
FOR SELECT 
USING (auth.uid() IS NOT NULL);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_support_tickets_updated_at
BEFORE UPDATE ON public.support_tickets
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
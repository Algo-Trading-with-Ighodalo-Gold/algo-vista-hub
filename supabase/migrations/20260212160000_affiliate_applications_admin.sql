-- Allow admins to view and update affiliate_applications
DROP POLICY IF EXISTS "Admins can view all affiliate applications" ON public.affiliate_applications;
CREATE POLICY "Admins can view all affiliate applications" ON public.affiliate_applications
  FOR SELECT USING (public.is_admin());

DROP POLICY IF EXISTS "Admins can update affiliate applications" ON public.affiliate_applications;
CREATE POLICY "Admins can update affiliate applications" ON public.affiliate_applications
  FOR UPDATE USING (public.is_admin());

-- Allow admins to insert affiliate records when approving applications
DROP POLICY IF EXISTS "Admins can insert affiliate records" ON public.affiliates;
CREATE POLICY "Admins can insert affiliate records" ON public.affiliates
  FOR INSERT WITH CHECK (public.is_admin());

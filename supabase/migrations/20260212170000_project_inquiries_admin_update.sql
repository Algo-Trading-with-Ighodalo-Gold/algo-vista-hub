-- Allow admins to update project_inquiries (for approve/reject)
CREATE POLICY "Admins can update project inquiries"
ON public.project_inquiries
FOR UPDATE
USING (public.is_admin());

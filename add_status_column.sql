-- Add missing status column to license_accounts table
-- Check if column exists first, then add it if missing

DO $$ 
BEGIN
  -- Check if status column exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'license_accounts' 
    AND column_name = 'status'
  ) THEN
    -- Add the status column with default value
    ALTER TABLE public.license_accounts 
    ADD COLUMN status TEXT DEFAULT 'offline' 
    CHECK (status IN ('active', 'offline', 'suspended'));
    
    -- Update existing rows to have a status
    UPDATE public.license_accounts 
    SET status = 'offline' 
    WHERE status IS NULL;
  END IF;
END $$;

-- Verify the column was added
SELECT column_name, data_type, column_default, is_nullable
FROM information_schema.columns
WHERE table_schema = 'public' 
  AND table_name = 'license_accounts'
  AND column_name = 'status';




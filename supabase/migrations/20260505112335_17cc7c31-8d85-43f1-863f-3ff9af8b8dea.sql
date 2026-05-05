
CREATE OR REPLACE FUNCTION public.set_member_code()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
BEGIN
  IF NEW.member_code IS NULL THEN
    NEW.member_code := 'KWSHG-' || LPAD((nextval('members_seq'))::TEXT, 4, '0');
  END IF;
  RETURN NEW;
END $$;

CREATE SEQUENCE IF NOT EXISTS public.members_seq START 1;
REVOKE EXECUTE ON FUNCTION public.set_member_code() FROM PUBLIC, anon, authenticated;

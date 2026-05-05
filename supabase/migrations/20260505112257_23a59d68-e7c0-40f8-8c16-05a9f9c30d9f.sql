
ALTER FUNCTION public.set_member_code() SET search_path = public;
REVOKE EXECUTE ON FUNCTION public.has_role(UUID, public.app_role) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.set_member_code() FROM PUBLIC, anon, authenticated;

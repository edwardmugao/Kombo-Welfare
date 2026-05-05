
-- Roles enum + table
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, role)
);
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL STABLE SECURITY DEFINER SET search_path = public
AS $$ SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role) $$;

CREATE POLICY "users view own roles" ON public.user_roles FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "admins manage roles" ON public.user_roles FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Members
CREATE TYPE public.member_status AS ENUM ('pending', 'approved', 'rejected');

CREATE TABLE public.members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  member_code TEXT UNIQUE,
  full_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  national_id TEXT,
  location TEXT,
  reason TEXT,
  next_of_kin TEXT,
  role TEXT,
  role_rank INT NOT NULL DEFAULT 99,
  status member_status NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "anyone reads approved members" ON public.members FOR SELECT USING (status = 'approved');
CREATE POLICY "admins read all members" ON public.members FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "anyone can apply" ON public.members FOR INSERT WITH CHECK (status = 'pending');
CREATE POLICY "admins update members" ON public.members FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "admins delete members" ON public.members FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Service requests
CREATE TYPE public.request_status AS ENUM ('new', 'in_progress', 'completed', 'cancelled');

CREATE TABLE public.service_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  event_location TEXT NOT NULL,
  event_date DATE NOT NULL,
  service_type TEXT NOT NULL,
  description TEXT,
  status request_status NOT NULL DEFAULT 'new',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.service_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "anyone can request a service" ON public.service_requests FOR INSERT WITH CHECK (status = 'new');
CREATE POLICY "admins read requests" ON public.service_requests FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "admins update requests" ON public.service_requests FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "admins delete requests" ON public.service_requests FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Gallery
CREATE TABLE public.gallery_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT,
  category TEXT NOT NULL,
  image_url TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.gallery_images ENABLE ROW LEVEL SECURITY;

CREATE POLICY "anyone reads gallery" ON public.gallery_images FOR SELECT USING (true);
CREATE POLICY "admins manage gallery" ON public.gallery_images FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Auto-generate member_code
CREATE OR REPLACE FUNCTION public.set_member_code()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  IF NEW.member_code IS NULL THEN
    NEW.member_code := 'KWSHG-' || LPAD(((EXTRACT(EPOCH FROM now())::BIGINT) % 100000)::TEXT, 5, '0');
  END IF;
  RETURN NEW;
END $$;
CREATE TRIGGER members_set_code BEFORE INSERT ON public.members FOR EACH ROW EXECUTE FUNCTION public.set_member_code();

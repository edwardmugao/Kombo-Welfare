import { Link, NavLink as RouterNavLink, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Menu, X, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";

const links = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/leadership", label: "Members" },
  { to: "/gallery", label: "Gallery" },
  { to: "/services", label: "Book Service" },
  { to: "/contact", label: "Contact" },
];

export default function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [authed, setAuthed] = useState(false);
  const nav = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll);
    supabase.auth.getSession().then(({ data }) => setAuthed(!!data.session));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setAuthed(!!s));
    return () => {
      window.removeEventListener("scroll", onScroll);
      sub.subscription.unsubscribe();
    };
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 inset-x-0 z-50 transition-smooth",
        scrolled ? "bg-background/90 backdrop-blur-md shadow-card" : "bg-transparent"
      )}
    >
      <div className="container flex items-center justify-between h-16 md:h-20">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="h-10 w-10 rounded-lg bg-gradient-emerald flex items-center justify-center shadow-elegant">
            <span className="font-display text-accent text-xl">K</span>
          </div>
          <div className="leading-tight">
            <p className="font-display text-base md:text-lg text-primary">Kombo Welfare</p>
            <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Self Help Group</p>
          </div>
        </Link>

        <nav className="hidden lg:flex items-center gap-1">
          {links.map((l) => (
            <RouterNavLink
              key={l.to}
              to={l.to}
              end={l.to === "/"}
              className={({ isActive }) =>
                cn(
                  "px-3 py-2 text-sm font-medium rounded-md transition-smooth",
                  isActive ? "text-primary" : "text-foreground/70 hover:text-primary hover:bg-secondary"
                )
              }
            >
              {l.label}
            </RouterNavLink>
          ))}
        </nav>

        <div className="hidden lg:flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={() => nav(authed ? "/admin" : "/auth")}>
            <Shield className="h-4 w-4 mr-1" />
            {authed ? "Admin" : "Admin Login"}
          </Button>
          <Button variant="hero" size="sm" onClick={() => nav("/register")}>Join Us</Button>
        </div>

        <button className="lg:hidden p-2" onClick={() => setOpen(!open)} aria-label="Menu">
          {open ? <X /> : <Menu />}
        </button>
      </div>

      {open && (
        <div className="lg:hidden border-t bg-background">
          <nav className="container py-4 flex flex-col gap-1">
            {links.map((l) => (
              <RouterNavLink
                key={l.to}
                to={l.to}
                end={l.to === "/"}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  cn(
                    "px-3 py-2 rounded-md text-sm font-medium",
                    isActive ? "bg-secondary text-primary" : "text-foreground/70"
                  )
                }
              >
                {l.label}
              </RouterNavLink>
            ))}
            <div className="flex gap-2 pt-2">
              <Button variant="outline" size="sm" className="flex-1" onClick={() => { setOpen(false); nav(authed ? "/admin" : "/auth"); }}>
                {authed ? "Admin" : "Admin Login"}
              </Button>
              <Button variant="hero" size="sm" className="flex-1" onClick={() => { setOpen(false); nav("/register"); }}>Join Us</Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}

import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import SiteLayout from "@/components/SiteLayout";
import { Crown, User } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

type Member = {
  id: string;
  member_code: string;
  full_name: string;
  role: string | null;
  role_rank: number;
};

const initials = (n: string) => n.split(" ").slice(0, 2).map((s) => s[0]).join("").toUpperCase();

const Leadership = () => {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from("members")
      .select("id, member_code, full_name, role, role_rank")
      .eq("status", "approved")
      .order("role_rank", { ascending: true })
      .order("full_name", { ascending: true })
      .then(({ data }) => {
        setMembers(data ?? []);
        setLoading(false);
      });
  }, []);

  const leaders = members.filter((m) => m.role_rank < 99);
  const general = members.filter((m) => m.role_rank === 99);

  return (
    <SiteLayout>
      <section className="py-20 bg-gradient-soft">
        <div className="container max-w-4xl text-center">
          <p className="text-sm uppercase tracking-widest text-accent font-semibold">Leadership & Members</p>
          <h1 className="mt-3 text-5xl md:text-6xl text-primary">The people behind Kombo</h1>
          <p className="mt-5 text-muted-foreground text-lg">
            Meet the elected committee and {members.length} approved members who keep our welfare group running.
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="container">
          <h2 className="text-3xl text-primary mb-2">Committee</h2>
          <div className="h-1 w-16 bg-gradient-gold rounded mb-8" />
          {loading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-48 rounded-2xl" />)}
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {leaders.map((m) => (
                <div key={m.id} className="p-6 rounded-2xl bg-gradient-emerald text-primary-foreground shadow-elegant relative overflow-hidden group">
                  <Crown className="absolute -top-3 -right-3 h-20 w-20 text-accent/20 rotate-12" />
                  <div className="h-16 w-16 rounded-full bg-accent text-primary font-display text-2xl flex items-center justify-center shadow-gold">
                    {initials(m.full_name)}
                  </div>
                  <p className="mt-5 text-xs uppercase tracking-widest text-accent">{m.role}</p>
                  <h3 className="mt-1 font-display text-xl leading-tight">{m.full_name}</h3>
                  <p className="mt-3 text-xs opacity-70">ID: {m.member_code}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="py-16 bg-secondary/30">
        <div className="container">
          <h2 className="text-3xl text-primary mb-2">All Members</h2>
          <div className="h-1 w-16 bg-gradient-gold rounded mb-8" />
          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {general.map((m) => (
              <div key={m.id} className="p-4 rounded-xl bg-card border shadow-card hover:shadow-elegant transition-smooth flex items-center gap-3">
                <div className="h-11 w-11 rounded-full bg-secondary text-primary flex items-center justify-center font-semibold shrink-0">
                  {initials(m.full_name)}
                </div>
                <div className="min-w-0">
                  <p className="font-medium text-sm text-primary truncate">{m.full_name}</p>
                  <p className="text-xs text-muted-foreground">{m.member_code}</p>
                </div>
                <User className="h-4 w-4 text-muted-foreground/40 ml-auto" />
              </div>
            ))}
          </div>
        </div>
      </section>
    </SiteLayout>
  );
};

export default Leadership;

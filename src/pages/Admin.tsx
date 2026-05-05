import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import SiteLayout from "@/components/SiteLayout";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Users, Calendar, Image as ImageIcon, LogOut, Check, X, Trash2, Plus } from "lucide-react";

type Member = { id: string; member_code: string; full_name: string; phone: string; location: string | null; reason: string | null; next_of_kin: string | null; role: string | null; status: string; created_at: string };
type Request = { id: string; full_name: string; phone: string; event_location: string; event_date: string; service_type: string; description: string | null; status: string; created_at: string };
type GalleryImg = { id: string; title: string | null; category: string; image_url: string };

const Admin = () => {
  const nav = useNavigate();
  const [checking, setChecking] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [userId, setUserId] = useState<string>("");
  const [members, setMembers] = useState<Member[]>([]);
  const [requests, setRequests] = useState<Request[]>([]);
  const [gallery, setGallery] = useState<GalleryImg[]>([]);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session) return nav("/auth", { replace: true });
      setUserId(data.session.user.id);
      const { data: roles } = await supabase.from("user_roles").select("role").eq("user_id", data.session.user.id);
      const admin = (roles ?? []).some((r) => r.role === "admin");
      setIsAdmin(admin);
      setChecking(false);
      if (admin) refresh();
    })();
  }, [nav]);

  const refresh = async () => {
    const [m, r, g] = await Promise.all([
      supabase.from("members").select("*").order("created_at", { ascending: false }),
      supabase.from("service_requests").select("*").order("created_at", { ascending: false }),
      supabase.from("gallery_images").select("*").order("created_at", { ascending: false }),
    ]);
    setMembers((m.data as Member[]) ?? []);
    setRequests((r.data as Request[]) ?? []);
    setGallery((g.data as GalleryImg[]) ?? []);
  };

  const updateMember = async (id: string, status: "approved" | "rejected") => {
    const { error } = await supabase.from("members").update({ status }).eq("id", id);
    if (error) return toast.error(error.message);
    toast.success(`Member ${status}`);
    refresh();
  };

  const updateRequest = async (id: string, status: string) => {
    const { error } = await supabase.from("service_requests").update({ status: status as "new" | "in_progress" | "completed" | "cancelled" }).eq("id", id);
    if (error) return toast.error(error.message);
    refresh();
  };

  const addImage = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const { error } = await supabase.from("gallery_images").insert({
      title: String(fd.get("title")),
      category: String(fd.get("category")),
      image_url: String(fd.get("image_url")),
    });
    if (error) return toast.error(error.message);
    toast.success("Image added");
    (e.target as HTMLFormElement).reset();
    refresh();
  };

  const deleteImage = async (id: string) => {
    if (!confirm("Delete this image?")) return;
    const { error } = await supabase.from("gallery_images").delete().eq("id", id);
    if (error) return toast.error(error.message);
    refresh();
  };

  const updateRole = async (id: string, role: string) => {
    const rank = role === "Chairman" ? 1 : role === "Vice Chairman" ? 2 : role === "Secretary" ? 3 : role === "Treasurer" ? 4 : role === "Committee Member" ? 5 : 99;
    const { error } = await supabase.from("members").update({ role: role || null, role_rank: rank }).eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Role updated");
    refresh();
  };

  const claimAdmin = async () => {
    // Allow self-promotion ONLY if there are no admins yet
    const { count } = await supabase.from("user_roles").select("*", { count: "exact", head: true }).eq("role", "admin");
    if ((count ?? 0) > 0) return toast.error("An admin already exists. Ask them to grant you access.");
    const { error } = await supabase.from("user_roles").insert({ user_id: userId, role: "admin" });
    if (error) return toast.error(error.message);
    toast.success("You are now an admin.");
    setIsAdmin(true);
    refresh();
  };

  if (checking) return <SiteLayout><div className="container py-32 text-center">Loading...</div></SiteLayout>;

  if (!isAdmin) {
    return (
      <SiteLayout>
        <section className="py-24">
          <div className="container max-w-md text-center bg-card p-8 rounded-2xl border shadow-card">
            <h1 className="text-3xl text-primary">Awaiting Admin Access</h1>
            <p className="mt-3 text-muted-foreground">Your account is signed in but does not have admin privileges yet.</p>
            <div className="mt-6 flex flex-col gap-3">
              <Button variant="hero" onClick={claimAdmin}>Claim founding-admin role</Button>
              <p className="text-xs text-muted-foreground">Only works if no admin exists yet.</p>
              <Button variant="outline" onClick={async () => { await supabase.auth.signOut(); nav("/auth"); }}>Sign Out</Button>
            </div>
          </div>
        </section>
      </SiteLayout>
    );
  }

  const pendingMembers = members.filter((m) => m.status === "pending");
  const stats = [
    { label: "Total Members", value: members.filter((m) => m.status === "approved").length, icon: Users },
    { label: "Pending Approvals", value: pendingMembers.length, icon: Users },
    { label: "Service Requests", value: requests.filter((r) => r.status !== "completed" && r.status !== "cancelled").length, icon: Calendar },
    { label: "Gallery Photos", value: gallery.length, icon: ImageIcon },
  ];

  return (
    <SiteLayout>
      <section className="bg-gradient-emerald text-primary-foreground py-12">
        <div className="container flex flex-wrap justify-between items-center gap-4">
          <div>
            <p className="text-xs uppercase tracking-widest text-accent">Dashboard</p>
            <h1 className="font-display text-4xl">Admin Panel</h1>
          </div>
          <Button variant="outline" className="bg-transparent border-primary-foreground/30 text-primary-foreground hover:bg-background/10 hover:text-accent" onClick={async () => { await supabase.auth.signOut(); nav("/"); }}>
            <LogOut className="h-4 w-4 mr-2" /> Sign Out
          </Button>
        </div>
      </section>

      <section className="container py-10 grid sm:grid-cols-2 lg:grid-cols-4 gap-4 -mt-8">
        {stats.map((s) => (
          <div key={s.label} className="bg-card border rounded-2xl p-5 shadow-card">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs uppercase tracking-widest text-muted-foreground">{s.label}</p>
                <p className="font-display text-3xl text-primary mt-1">{s.value}</p>
              </div>
              <div className="h-10 w-10 rounded-lg bg-secondary flex items-center justify-center">
                <s.icon className="h-5 w-5 text-primary" />
              </div>
            </div>
          </div>
        ))}
      </section>

      <section className="container pb-20">
        <Tabs defaultValue="members">
          <TabsList className="mb-6 flex-wrap h-auto">
            <TabsTrigger value="members">Members ({pendingMembers.length} pending)</TabsTrigger>
            <TabsTrigger value="requests">Service Requests</TabsTrigger>
            <TabsTrigger value="gallery">Gallery</TabsTrigger>
          </TabsList>

          <TabsContent value="members">
            <div className="space-y-3">
              {members.map((m) => (
                <div key={m.id} className="bg-card border rounded-xl p-5 shadow-card flex flex-wrap gap-4 items-center justify-between">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-semibold text-primary">{m.full_name}</p>
                      <Badge variant={m.status === "approved" ? "default" : m.status === "pending" ? "secondary" : "destructive"}>{m.status}</Badge>
                      {m.role && <Badge className="bg-accent text-accent-foreground">{m.role}</Badge>}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">{m.member_code} · {m.phone} · {m.location ?? "—"}</p>
                    {m.reason && <p className="text-sm text-muted-foreground mt-2 italic">"{m.reason}"</p>}
                  </div>
                  <div className="flex items-center gap-2">
                    {m.status === "pending" && (
                      <>
                        <Button size="sm" variant="emerald" onClick={() => updateMember(m.id, "approved")}><Check className="h-4 w-4" /></Button>
                        <Button size="sm" variant="destructive" onClick={() => updateMember(m.id, "rejected")}><X className="h-4 w-4" /></Button>
                      </>
                    )}
                    {m.status === "approved" && (
                      <Select defaultValue={m.role ?? ""} onValueChange={(v) => updateRole(m.id, v)}>
                        <SelectTrigger className="w-44"><SelectValue placeholder="Set role" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Chairman">Chairman</SelectItem>
                          <SelectItem value="Vice Chairman">Vice Chairman</SelectItem>
                          <SelectItem value="Secretary">Secretary</SelectItem>
                          <SelectItem value="Treasurer">Treasurer</SelectItem>
                          <SelectItem value="Committee Member">Committee Member</SelectItem>
                          <SelectItem value="member">Regular Member</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="requests">
            <div className="space-y-3">
              {requests.map((r) => (
                <div key={r.id} className="bg-card border rounded-xl p-5 shadow-card flex flex-wrap gap-4 items-center justify-between">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-semibold text-primary">{r.service_type}</p>
                      <Badge variant="outline">{r.status}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{r.full_name} · {r.phone} · {r.event_location} · {new Date(r.event_date).toLocaleDateString()}</p>
                    {r.description && <p className="text-sm text-muted-foreground mt-2 italic">"{r.description}"</p>}
                  </div>
                  <Select defaultValue={r.status} onValueChange={(v) => updateRequest(r.id, v)}>
                    <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="new">New</SelectItem>
                      <SelectItem value="in_progress">In Progress</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              ))}
              {requests.length === 0 && <p className="text-muted-foreground text-center py-12">No service requests yet.</p>}
            </div>
          </TabsContent>

          <TabsContent value="gallery">
            <form onSubmit={addImage} className="bg-card border rounded-xl p-5 shadow-card grid md:grid-cols-4 gap-3 items-end mb-6">
              <div className="md:col-span-1"><Label>Title</Label><Input name="title" /></div>
              <div className="md:col-span-1">
                <Label>Category</Label>
                <Select name="category" defaultValue="Events">
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Events">Events</SelectItem>
                    <SelectItem value="Equipment">Equipment</SelectItem>
                    <SelectItem value="Members">Members</SelectItem>
                    <SelectItem value="Ceremonies">Ceremonies</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="md:col-span-2"><Label>Image URL</Label><Input name="image_url" required placeholder="https://..." /></div>
              <Button type="submit" variant="hero" className="md:col-span-4"><Plus className="h-4 w-4 mr-1" /> Add Image</Button>
            </form>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {gallery.map((g) => (
                <div key={g.id} className="rounded-xl overflow-hidden border shadow-card relative group">
                  <img src={g.image_url} alt={g.title ?? ""} className="w-full aspect-[4/3] object-cover" />
                  <div className="p-3 bg-card">
                    <p className="font-medium text-sm truncate">{g.title ?? "Untitled"}</p>
                    <p className="text-xs text-muted-foreground">{g.category}</p>
                  </div>
                  <Button size="icon" variant="destructive" className="absolute top-2 right-2 h-8 w-8 opacity-0 group-hover:opacity-100 transition-smooth" onClick={() => deleteImage(g.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              {gallery.length === 0 && <p className="text-muted-foreground col-span-full text-center py-8">No gallery photos yet — add one above.</p>}
            </div>
          </TabsContent>
        </Tabs>
      </section>
    </SiteLayout>
  );
};

export default Admin;

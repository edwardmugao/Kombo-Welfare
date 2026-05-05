import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import SiteLayout from "@/components/SiteLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Shield } from "lucide-react";

const Auth = () => {
  const nav = useNavigate();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) nav("/admin", { replace: true });
    });
  }, [nav]);

  const onLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: String(fd.get("email")),
      password: String(fd.get("password")),
    });
    setLoading(false);
    if (error) return toast.error(error.message);
    nav("/admin");
  };

  const onSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email: String(fd.get("email")),
      password: String(fd.get("password")),
      options: { emailRedirectTo: window.location.origin + "/admin" },
    });
    setLoading(false);
    if (error) return toast.error(error.message);
    toast.success("Account created. You can now sign in.");
  };

  return (
    <SiteLayout>
      <section className="py-24 min-h-[70vh] flex items-center">
        <div className="container max-w-md">
          <div className="text-center mb-8">
            <div className="mx-auto h-14 w-14 rounded-2xl bg-gradient-emerald flex items-center justify-center shadow-elegant mb-4">
              <Shield className="h-7 w-7 text-accent" />
            </div>
            <h1 className="text-3xl text-primary">Admin Access</h1>
            <p className="text-muted-foreground mt-2">For committee members only</p>
          </div>
          <div className="bg-card border rounded-2xl p-6 shadow-card">
            <Tabs defaultValue="signin">
              <TabsList className="grid grid-cols-2 mb-5">
                <TabsTrigger value="signin">Sign In</TabsTrigger>
                <TabsTrigger value="signup">Create Account</TabsTrigger>
              </TabsList>
              <TabsContent value="signin">
                <form onSubmit={onLogin} className="space-y-4">
                  <div><Label htmlFor="email">Email</Label><Input id="email" name="email" type="email" required /></div>
                  <div><Label htmlFor="password">Password</Label><Input id="password" name="password" type="password" required minLength={6} /></div>
                  <Button type="submit" variant="hero" className="w-full" disabled={loading}>{loading ? "Signing in..." : "Sign In"}</Button>
                </form>
              </TabsContent>
              <TabsContent value="signup">
                <form onSubmit={onSignup} className="space-y-4">
                  <div><Label htmlFor="email2">Email</Label><Input id="email2" name="email" type="email" required /></div>
                  <div><Label htmlFor="password2">Password</Label><Input id="password2" name="password" type="password" required minLength={6} /></div>
                  <Button type="submit" variant="emerald" className="w-full" disabled={loading}>{loading ? "Creating..." : "Create Account"}</Button>
                  <p className="text-xs text-muted-foreground">After signup, an existing admin must grant you the admin role to access the dashboard.</p>
                </form>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
};

export default Auth;

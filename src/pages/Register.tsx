import { useState } from "react";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import SiteLayout from "@/components/SiteLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { CheckCircle2 } from "lucide-react";

const schema = z.object({
  full_name: z.string().trim().min(2).max(120),
  phone: z.string().trim().min(7).max(20),
  national_id: z.string().trim().min(4).max(20),
  location: z.string().trim().min(2).max(120),
  reason: z.string().trim().min(5).max(1000),
  next_of_kin: z.string().trim().min(2).max(200),
});

const Register = () => {
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget)) as Record<string, string>;
    const parsed = schema.safeParse(data);
    if (!parsed.success) {
      toast.error("Please fill all fields correctly.");
      return;
    }
    setLoading(true);
    const { error } = await supabase.from("members").insert({ ...(parsed.data as Required<typeof parsed.data>), status: "pending" });
    setLoading(false);
    if (error) {
      toast.error("Could not submit. Please try again.");
      return;
    }
    setDone(true);
  };

  if (done) {
    return (
      <SiteLayout>
        <section className="py-32">
          <div className="container max-w-xl text-center">
            <div className="mx-auto h-20 w-20 rounded-full bg-success text-success-foreground flex items-center justify-center mb-6">
              <CheckCircle2 className="h-10 w-10" />
            </div>
            <h1 className="text-4xl text-primary">Application received!</h1>
            <p className="mt-4 text-muted-foreground text-lg">
              Asante sana. Your application has been submitted and is pending committee approval.
              We'll reach out via the phone number you provided once a decision is made.
            </p>
          </div>
        </section>
      </SiteLayout>
    );
  }

  return (
    <SiteLayout>
      <section className="py-20 bg-gradient-soft">
        <div className="container max-w-3xl">
          <p className="text-sm uppercase tracking-widest text-accent font-semibold">Membership</p>
          <h1 className="mt-3 text-5xl text-primary">Apply to join</h1>
          <p className="mt-4 text-muted-foreground text-lg">
            Fill out the form below. The committee reviews new applicants at the monthly meeting.
          </p>
        </div>
      </section>
      <section className="py-12">
        <div className="container max-w-3xl">
          <form onSubmit={onSubmit} className="bg-card rounded-2xl border shadow-card p-8 space-y-5">
            <div className="grid md:grid-cols-2 gap-5">
              <div>
                <Label htmlFor="full_name">Full Name</Label>
                <Input id="full_name" name="full_name" required maxLength={120} />
              </div>
              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input id="phone" name="phone" required maxLength={20} placeholder="07xxxxxxxx" />
              </div>
              <div>
                <Label htmlFor="national_id">National ID</Label>
                <Input id="national_id" name="national_id" required maxLength={20} />
              </div>
              <div>
                <Label htmlFor="location">Location</Label>
                <Input id="location" name="location" required maxLength={120} placeholder="Village / Sub-county" />
              </div>
            </div>
            <div>
              <Label htmlFor="next_of_kin">Next of Kin (Name & phone)</Label>
              <Input id="next_of_kin" name="next_of_kin" required maxLength={200} />
            </div>
            <div>
              <Label htmlFor="reason">Reason for joining</Label>
              <Textarea id="reason" name="reason" required maxLength={1000} rows={4} placeholder="Tell us why you'd like to join Kombo Welfare." />
            </div>
            <Button type="submit" variant="hero" size="lg" disabled={loading} className="w-full">
              {loading ? "Submitting..." : "Submit Application"}
            </Button>
            <p className="text-xs text-muted-foreground text-center">
              Your information is kept confidential and only shared with the committee.
            </p>
          </form>
        </div>
      </section>
    </SiteLayout>
  );
};

export default Register;

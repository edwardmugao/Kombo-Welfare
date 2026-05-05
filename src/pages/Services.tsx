import { useState } from "react";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import SiteLayout from "@/components/SiteLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { CheckCircle2 } from "lucide-react";

const services = ["Tent Hire", "Chair Rental", "Catering / Cooking", "Invitation Printing", "Event Planning Support"];

const schema = z.object({
  full_name: z.string().trim().min(2).max(120),
  phone: z.string().trim().min(7).max(20),
  event_location: z.string().trim().min(2).max(200),
  event_date: z.string().min(4),
  service_type: z.string().min(2),
  description: z.string().trim().max(1000).optional(),
});

const Services = () => {
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [service, setService] = useState("");

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const data = {
      full_name: String(fd.get("full_name") ?? ""),
      phone: String(fd.get("phone") ?? ""),
      event_location: String(fd.get("event_location") ?? ""),
      event_date: String(fd.get("event_date") ?? ""),
      service_type: service,
      description: String(fd.get("description") ?? ""),
    };
    const parsed = schema.safeParse(data);
    if (!parsed.success) {
      toast.error("Please complete all required fields.");
      return;
    }
    setLoading(true);
    const { error } = await supabase.from("service_requests").insert({ ...(parsed.data as Required<typeof parsed.data>), status: "new" });
    setLoading(false);
    if (error) return toast.error("Could not submit your request.");
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
            <h1 className="text-4xl text-primary">Request received!</h1>
            <p className="mt-4 text-muted-foreground text-lg">
              Our event coordinator will call you on the number you provided to confirm details and pricing.
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
          <p className="text-sm uppercase tracking-widest text-accent font-semibold">Services</p>
          <h1 className="mt-3 text-5xl text-primary">Book a service</h1>
          <p className="mt-4 text-muted-foreground text-lg">
            Tents, chairs, catering, invitations and full event planning support — at fair, community-owned rates.
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
                <Input id="phone" name="phone" required maxLength={20} />
              </div>
              <div>
                <Label htmlFor="event_location">Event Location</Label>
                <Input id="event_location" name="event_location" required maxLength={200} />
              </div>
              <div>
                <Label htmlFor="event_date">Date of Event</Label>
                <Input id="event_date" name="event_date" type="date" required />
              </div>
            </div>
            <div>
              <Label>Service Needed</Label>
              <Select value={service} onValueChange={setService}>
                <SelectTrigger><SelectValue placeholder="Select a service" /></SelectTrigger>
                <SelectContent>
                  {services.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="description">Description / Special requests</Label>
              <Textarea id="description" name="description" rows={4} maxLength={1000} placeholder="Number of guests, setup preferences, menu, etc." />
            </div>
            <Button type="submit" variant="hero" size="lg" disabled={loading} className="w-full">
              {loading ? "Sending..." : "Submit Request"}
            </Button>
          </form>
        </div>
      </section>
    </SiteLayout>
  );
};

export default Services;

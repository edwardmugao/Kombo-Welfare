import SiteLayout from "@/components/SiteLayout";
import { Phone, Mail, MapPin, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

const phones = ["0712345678", "0798765430", "0797857600"];

const Contact = () => {
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const subject = encodeURIComponent(`Website message from ${fd.get("name")}`);
    const body = encodeURIComponent(`${fd.get("message")}\n\nFrom: ${fd.get("name")} (${fd.get("email")})`);
    window.location.href = `mailto:info@komboweleware.co.ke?subject=${subject}&body=${body}`;
    toast.success("Opening your email app...");
  };

  return (
    <SiteLayout>
      <section className="py-20 bg-gradient-soft">
        <div className="container max-w-4xl text-center">
          <p className="text-sm uppercase tracking-widest text-accent font-semibold">Get in Touch</p>
          <h1 className="mt-3 text-5xl md:text-6xl text-primary">Contact the committee</h1>
          <p className="mt-5 text-muted-foreground text-lg">
            Reach out for membership questions, service bookings or partnerships.
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="container grid lg:grid-cols-2 gap-10">
          <div className="space-y-5">
            {phones.map((p) => (
              <a key={p} href={`tel:${p}`} className="flex items-center gap-4 p-5 rounded-2xl bg-card border shadow-card hover:shadow-elegant transition-smooth">
                <div className="h-12 w-12 rounded-xl bg-gradient-emerald flex items-center justify-center">
                  <Phone className="h-5 w-5 text-accent" />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-widest text-muted-foreground">Call us</p>
                  <p className="font-display text-xl text-primary">{p}</p>
                </div>
              </a>
            ))}
            <a href="https://wa.me/254712345678" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 p-5 rounded-2xl bg-success text-success-foreground shadow-elegant hover:scale-[1.01] transition-smooth">
              <MessageCircle className="h-6 w-6" />
              <div>
                <p className="text-xs uppercase tracking-widest opacity-80">WhatsApp</p>
                <p className="font-display text-xl">Chat with us instantly</p>
              </div>
            </a>
            <div className="flex items-center gap-4 p-5 rounded-2xl bg-card border shadow-card">
              <div className="h-12 w-12 rounded-xl bg-gradient-gold flex items-center justify-center">
                <MapPin className="h-5 w-5 text-accent-foreground" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-widest text-muted-foreground">Location</p>
                <p className="font-display text-lg text-primary">Kombo Village, Kenya</p>
              </div>
            </div>
          </div>

          <form onSubmit={onSubmit} className="bg-card rounded-2xl border shadow-card p-8 space-y-5">
            <div className="flex items-center gap-3 mb-2">
              <Mail className="h-5 w-5 text-primary" />
              <h2 className="font-display text-2xl text-primary">Send us a message</h2>
            </div>
            <div>
              <Label htmlFor="name">Your name</Label>
              <Input id="name" name="name" required maxLength={120} />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" required maxLength={200} />
            </div>
            <div>
              <Label htmlFor="message">Message</Label>
              <Textarea id="message" name="message" rows={5} required maxLength={1000} />
            </div>
            <Button type="submit" variant="hero" size="lg" className="w-full">Send Message</Button>
          </form>
        </div>
      </section>
    </SiteLayout>
  );
};

export default Contact;

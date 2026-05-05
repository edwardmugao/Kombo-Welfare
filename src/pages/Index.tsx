import { Link } from "react-router-dom";
import { ArrowRight, Users, Calendar, Heart, Tent, Utensils, Mail, ShieldCheck, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import SiteLayout from "@/components/SiteLayout";
import hero from "@/assets/hero-community.jpg";

const Home = () => {
  return (
    <SiteLayout>
      {/* HERO */}
      <section className="relative min-h-[88vh] flex items-center overflow-hidden -mt-16 md:-mt-20 pt-16 md:pt-20">
        <div className="absolute inset-0">
          <img src={hero} alt="Kombo Welfare community gathering" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-hero" style={{ background: "var(--gradient-hero)" }} />
        </div>
        <div className="container relative z-10 py-20 grid lg:grid-cols-12 gap-10 items-center text-primary-foreground">
          <div className="lg:col-span-8 animate-fade-up">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/15 border border-accent/30 text-accent text-xs uppercase tracking-widest backdrop-blur">
              <Sparkles className="h-3.5 w-3.5" /> Community · Cooperation · Care
            </span>
            <h1 className="mt-6 text-5xl md:text-7xl leading-[1.05] font-display">
              Kombo Welfare <span className="text-gradient-gold">Self Help Group</span>
            </h1>
            <p className="mt-6 text-lg md:text-xl max-w-2xl opacity-90 leading-relaxed">
              Empowering community unity through collective support, events management, and welfare development across our village and beyond.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Button asChild variant="hero" size="lg">
                <Link to="/register">Join Us <ArrowRight className="ml-1" /></Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="bg-background/10 border-primary-foreground/30 text-primary-foreground hover:bg-background/20 hover:text-primary-foreground">
                <Link to="/services">Book a Service</Link>
              </Button>
              <Button asChild size="lg" variant="ghost" className="text-primary-foreground hover:bg-background/10 hover:text-accent">
                <Link to="/gallery">View Gallery</Link>
              </Button>
            </div>
            <div className="mt-12 grid grid-cols-3 gap-6 max-w-lg">
              {[
                { n: "46+", l: "Members" },
                { n: "120+", l: "Events Served" },
                { n: "5", l: "Years Strong" },
              ].map((s) => (
                <div key={s.l} className="border-l-2 border-accent pl-4">
                  <p className="font-display text-3xl text-accent">{s.n}</p>
                  <p className="text-xs uppercase tracking-widest opacity-80">{s.l}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* MISSION */}
      <section className="py-20 bg-gradient-soft">
        <div className="container grid lg:grid-cols-3 gap-8">
          {[
            { icon: Heart, title: "Community Support", text: "Standing together in times of joy and sorrow — funerals, weddings, and welfare needs of every member." },
            { icon: Users, title: "Financial Cooperation", text: "Pooled monthly contributions and table banking that grow our families and small enterprises." },
            { icon: Calendar, title: "Event Services", text: "Tents, chairs, catering and event planning offered to members and the wider community at fair rates." },
          ].map((c) => (
            <div key={c.title} className="bg-card rounded-2xl p-8 shadow-card hover:shadow-elegant transition-smooth border">
              <div className="h-12 w-12 rounded-xl bg-gradient-emerald flex items-center justify-center mb-5">
                <c.icon className="h-6 w-6 text-accent" />
              </div>
              <h3 className="text-2xl mb-3 text-primary">{c.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{c.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* SERVICES TEASER */}
      <section className="py-24">
        <div className="container">
          <div className="max-w-2xl mb-12">
            <p className="text-sm uppercase tracking-widest text-accent font-semibold mb-3">What We Offer</p>
            <h2 className="text-4xl md:text-5xl text-primary">Event services that bring your day together</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Tent, title: "Tent Hire", desc: "Spacious tents for weddings, funerals and celebrations." },
              { icon: Users, title: "Chair Rental", desc: "Hundreds of plastic & decorated chairs available." },
              { icon: Utensils, title: "Catering", desc: "Traditional Kenyan cuisine cooked on site." },
              { icon: Mail, title: "Invitations", desc: "Beautifully printed invitation cards & programmes." },
            ].map((s) => (
              <div key={s.title} className="group p-6 rounded-2xl border bg-card hover:bg-gradient-emerald hover:text-primary-foreground transition-smooth shadow-card">
                <s.icon className="h-8 w-8 mb-4 text-primary group-hover:text-accent transition-smooth" />
                <h4 className="text-xl mb-2 font-display">{s.title}</h4>
                <p className="text-sm text-muted-foreground group-hover:text-primary-foreground/80">{s.desc}</p>
              </div>
            ))}
          </div>
          <div className="mt-10 text-center">
            <Button asChild variant="emerald" size="lg"><Link to="/services">Request a Service</Link></Button>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="container">
          <div className="rounded-3xl bg-gradient-emerald text-primary-foreground p-12 md:p-16 shadow-elegant relative overflow-hidden">
            <div className="absolute -right-10 -bottom-10 h-64 w-64 rounded-full bg-accent/20 blur-3xl" />
            <div className="relative grid lg:grid-cols-2 gap-8 items-center">
              <div>
                <ShieldCheck className="h-10 w-10 text-accent mb-4" />
                <h2 className="text-4xl md:text-5xl">Become a member today</h2>
                <p className="mt-4 opacity-90 text-lg max-w-xl">
                  Join 46+ neighbors building a stronger Kombo through cooperation, accountability and shared progress.
                </p>
              </div>
              <div className="lg:justify-self-end flex gap-3">
                <Button asChild variant="hero" size="lg"><Link to="/register">Apply Now</Link></Button>
                <Button asChild size="lg" variant="outline" className="bg-transparent border-primary-foreground/30 text-primary-foreground hover:bg-background/10 hover:text-accent">
                  <Link to="/contact">Contact Us</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
};

export default Home;

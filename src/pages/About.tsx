import SiteLayout from "@/components/SiteLayout";
import { Check, Users, Coins, Calendar, Sprout } from "lucide-react";

const About = () => (
  <SiteLayout>
    <section className="py-20 bg-gradient-soft">
      <div className="container max-w-4xl">
        <p className="text-sm uppercase tracking-widest text-accent font-semibold">About Us</p>
        <h1 className="mt-3 text-5xl md:text-6xl text-primary">A welfare group built on trust</h1>
        <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
          A <strong className="text-primary">Welfare Self Help Group</strong> in Kenya is a registered community-based
          organization where members pool resources, time and skills to support one another through life's important
          moments — weddings, funerals, school fees, medical emergencies — and to invest in shared community
          infrastructure such as event equipment.
        </p>
      </div>
    </section>

    <section className="py-20">
      <div className="container grid md:grid-cols-2 gap-10">
        {[
          { icon: Users, title: "Community Support", text: "Stand-by support for every member during ceremonies, hospital visits and bereavement." },
          { icon: Coins, title: "Financial Cooperation", text: "Monthly contributions, table banking and emergency loans at fair member rates." },
          { icon: Calendar, title: "Event Support Services", text: "Tents, chairs, public address, catering and event planning offered to the public to fund our welfare kitty." },
          { icon: Sprout, title: "Social Development", text: "Tree planting, clean-ups, mentorship for youth, and women's empowerment workshops." },
        ].map((o) => (
          <div key={o.title} className="flex gap-5">
            <div className="h-14 w-14 shrink-0 rounded-xl bg-gradient-emerald flex items-center justify-center">
              <o.icon className="h-6 w-6 text-accent" />
            </div>
            <div>
              <h3 className="text-2xl text-primary">{o.title}</h3>
              <p className="mt-2 text-muted-foreground leading-relaxed">{o.text}</p>
            </div>
          </div>
        ))}
      </div>
    </section>

    <section className="py-20 bg-secondary/40">
      <div className="container max-w-3xl">
        <p className="text-sm uppercase tracking-widest text-accent font-semibold">Membership Structure</p>
        <h2 className="mt-3 text-4xl text-primary">How leadership works</h2>
        <p className="mt-4 text-muted-foreground">
          The group is led by an elected committee that serves a two-year renewable term. The committee meets monthly
          and reports to the general membership at each quarterly assembly.
        </p>
        <ul className="mt-8 space-y-3">
          {[
            "Chairman — overall leadership and external representation",
            "Vice Chairman — support and stand-in duties",
            "Secretary — records, communication and minutes",
            "Treasurer — finances, contributions and transparent reporting",
            "Committee Members — special projects, welfare visits, equipment custody",
          ].map((line) => (
            <li key={line} className="flex gap-3 items-start">
              <span className="mt-1 h-5 w-5 rounded-full bg-accent flex items-center justify-center shrink-0">
                <Check className="h-3 w-3 text-accent-foreground" />
              </span>
              <span className="text-foreground/80">{line}</span>
            </li>
          ))}
        </ul>
        <div className="mt-10 p-6 rounded-2xl border bg-card">
          <p className="font-display text-xl text-primary">Membership Protocol</p>
          <p className="mt-2 text-muted-foreground">
            New applicants submit a registration form and are vetted by the committee. Once approved, they pay a
            one-time joining fee plus a monthly contribution. All approvals and contributions are minuted and shared
            with the assembly to maintain full transparency.
          </p>
        </div>
      </div>
    </section>
  </SiteLayout>
);

export default About;

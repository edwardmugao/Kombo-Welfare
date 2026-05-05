import { useState } from "react";
import SiteLayout from "@/components/SiteLayout";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import tents from "@/assets/gallery-tents.jpg";
import chairs from "@/assets/gallery-chairs.jpg";
import uniform from "@/assets/gallery-uniform.jpg";
import meeting from "@/assets/gallery-meeting.jpg";
import ceremony from "@/assets/gallery-ceremony.jpg";
import catering from "@/assets/gallery-catering.jpg";
import women from "@/assets/gallery-women.jpg";
import hero from "@/assets/hero-community.jpg";

const images = [
  { src: tents, cat: "Equipment", title: "Tents set up at a wedding" },
  { src: chairs, cat: "Equipment", title: "Chair arrangement with red carpet" },
  { src: uniform, cat: "Members", title: "Members in group uniform" },
  { src: meeting, cat: "Events", title: "Community meeting under the tree" },
  { src: ceremony, cat: "Ceremonies", title: "Church wedding under tents" },
  { src: catering, cat: "Events", title: "Catering at a community event" },
  { src: women, cat: "Members", title: "Women's chapter outreach" },
  { src: hero, cat: "Ceremonies", title: "Members seated at a celebration" },
];
const cats = ["All", "Events", "Equipment", "Members", "Ceremonies"] as const;

const Gallery = () => {
  const [filter, setFilter] = useState<(typeof cats)[number]>("All");
  const [open, setOpen] = useState<string | null>(null);
  const filtered = images.filter((i) => filter === "All" || i.cat === filter);

  return (
    <SiteLayout>
      <section className="py-20 bg-gradient-soft">
        <div className="container max-w-4xl text-center">
          <p className="text-sm uppercase tracking-widest text-accent font-semibold">Gallery</p>
          <h1 className="mt-3 text-5xl md:text-6xl text-primary">Moments from our community</h1>
          <p className="mt-5 text-muted-foreground text-lg">
            Tents, chairs, uniforms, ceremonies and the people who make every event possible.
          </p>
        </div>
      </section>

      <section className="py-12">
        <div className="container">
          <div className="flex flex-wrap gap-2 justify-center mb-10">
            {cats.map((c) => (
              <button
                key={c}
                onClick={() => setFilter(c)}
                className={cn(
                  "px-5 py-2 rounded-full text-sm font-medium transition-smooth border",
                  filter === c
                    ? "bg-gradient-emerald text-primary-foreground border-transparent shadow-elegant"
                    : "bg-card text-muted-foreground hover:text-primary hover:border-primary/30"
                )}
              >
                {c}
              </button>
            ))}
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((img) => (
              <button
                key={img.src}
                onClick={() => setOpen(img.src)}
                className="group relative overflow-hidden rounded-2xl shadow-card hover:shadow-elegant transition-smooth aspect-[4/3]"
              >
                <img src={img.src} alt={img.title} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-smooth" />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/30 to-transparent opacity-0 group-hover:opacity-100 transition-smooth flex items-end p-5">
                  <div className="text-primary-foreground">
                    <p className="text-xs uppercase tracking-widest text-accent">{img.cat}</p>
                    <p className="font-display text-lg">{img.title}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      <Dialog open={!!open} onOpenChange={() => setOpen(null)}>
        <DialogContent className="max-w-5xl p-0 overflow-hidden bg-transparent border-0">
          {open && <img src={open} alt="" className="w-full h-auto rounded-lg" />}
        </DialogContent>
      </Dialog>
    </SiteLayout>
  );
};

export default Gallery;

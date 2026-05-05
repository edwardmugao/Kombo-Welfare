import { Link } from "react-router-dom";
import { Phone, Mail, MapPin } from "lucide-react";

export default function SiteFooter() {
  return (
    <footer className="bg-gradient-emerald text-primary-foreground mt-20">
      <div className="container py-14 grid md:grid-cols-4 gap-10">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="h-10 w-10 rounded-lg bg-accent text-primary flex items-center justify-center font-display text-xl">K</div>
            <div>
              <p className="font-display text-lg">Kombo Welfare</p>
              <p className="text-xs uppercase tracking-widest opacity-80">Self Help Group</p>
            </div>
          </div>
          <p className="text-sm opacity-80 leading-relaxed">
            Empowering community unity through collective support, events management, and welfare development.
          </p>
        </div>

        <div>
          <h4 className="font-display text-lg mb-3 text-accent">Quick Links</h4>
          <ul className="space-y-2 text-sm opacity-90">
            <li><Link to="/about" className="hover:text-accent">About Us</Link></li>
            <li><Link to="/leadership" className="hover:text-accent">Leadership & Members</Link></li>
            <li><Link to="/gallery" className="hover:text-accent">Gallery</Link></li>
            <li><Link to="/register" className="hover:text-accent">Become a Member</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-display text-lg mb-3 text-accent">Services</h4>
          <ul className="space-y-2 text-sm opacity-90">
            <li>Tent Hire</li>
            <li>Chair Rental</li>
            <li>Catering & Cooking</li>
            <li>Invitation Printing</li>
            <li>Event Planning</li>
          </ul>
        </div>

        <div>
          <h4 className="font-display text-lg mb-3 text-accent">Contact</h4>
          <ul className="space-y-2 text-sm opacity-90">
            <li className="flex items-center gap-2"><Phone className="h-4 w-4" /> 0712 345 678</li>
            <li className="flex items-center gap-2"><Phone className="h-4 w-4" /> 0798 765 430</li>
            <li className="flex items-center gap-2"><Mail className="h-4 w-4" /> info@komboweleware.co.ke</li>
            <li className="flex items-center gap-2"><MapPin className="h-4 w-4" /> Kombo Village, Kenya</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-primary-foreground/10">
        <div className="container py-4 text-xs opacity-70 flex flex-col md:flex-row justify-between gap-2">
          <p>© {new Date().getFullYear()} Kombo Welfare Self Help Group. All rights reserved.</p>
          <p>Registered community welfare organization · Kenya</p>
        </div>
      </div>
    </footer>
  );
}

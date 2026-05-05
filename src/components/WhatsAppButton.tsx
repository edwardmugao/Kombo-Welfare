import { MessageCircle } from "lucide-react";

export default function WhatsAppButton() {
  return (
    <a
      href="https://wa.me/254712345678?text=Hello%20Kombo%20Welfare%20Self%20Help%20Group"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-40 h-14 w-14 rounded-full bg-success text-success-foreground flex items-center justify-center shadow-elegant hover:scale-110 transition-smooth"
      aria-label="Chat on WhatsApp"
    >
      <MessageCircle className="h-7 w-7" />
    </a>
  );
}

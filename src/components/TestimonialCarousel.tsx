import { useEffect, useState } from "react";
import { Star } from "lucide-react";

interface Testimonial {
  quote: string;
  author: string;
  company: string;
  rating: number;
}

const testimonials: Testimonial[] = [
  {
    quote: "Ich schicke alle meine Fotos direkt vom Shooting an spaceseller. Am nächsten Morgen sind sie im Postfach. Zuverlässiger geht es nicht. Spart mir Stunden an Arbeit.",
    author: "Marcus Weber",
    company: "RE/MAX Hamburg",
    rating: 5,
  },
  {
    quote: "Wir haben spaceseller für ein Neubauprojekt gebucht. Der Fotograf war pünktlich, professionell und die fertigen Bilder inkl. Staging waren überragend. Die Anfragen haben sich verdreifacht.",
    author: "Sabine Koch",
    company: "Engel & Völkers Berlin",
    rating: 5,
  },
  {
    quote: "Egal ob komplettes Shooting oder nur Bildbearbeitung – spaceseller liefert immer Top-Qualität. Das macht sie zu unserem Standard-Partner für alle Objekte.",
    author: "Thomas Schneider",
    company: "Century 21 München",
    rating: 5,
  },
];

export const TestimonialCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const current = testimonials[currentIndex];

  return (
    <div className="bg-card border border-border rounded-xl p-6 shadow-card animate-fade-in">
      <div className="flex gap-1 mb-3">
        {Array.from({ length: current.rating }).map((_, i) => (
          <Star key={i} className="w-4 h-4 fill-accent text-accent" />
        ))}
      </div>
      <p className="text-foreground mb-4 italic">"{current.quote}"</p>
      <div className="flex items-center justify-between">
        <div>
          <p className="font-semibold text-foreground">{current.author}</p>
          <p className="text-sm text-muted-foreground">{current.company}</p>
        </div>
        <div className="flex gap-1">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentIndex ? "bg-accent w-6" : "bg-muted"
              }`}
              aria-label={`Testimonial ${index + 1} anzeigen`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

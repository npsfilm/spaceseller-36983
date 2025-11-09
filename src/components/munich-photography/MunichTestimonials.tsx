import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";

export const MunichTestimonials = () => {
  const testimonials = [
    {
      quote: "Dank spaceseller's Fotos war die Wohnung in Schwabing in unter 5 Tagen verkauft. Der 3D-Rundgang hat den Unterschied gemacht. Wir konnten 8% über dem Angebotspreis verkaufen.",
      author: "Stefan Müller",
      role: "Immobilienmakler",
      location: "München-Schwabing",
      rating: 5,
    },
    {
      quote: "Unsere Luxus-Villa in Grünwald wurde dank der professionellen Drohnenaufnahmen 15% über Angebotspreis verkauft. Jetzt nutzen wir spaceseller für alle High-End Objekte.",
      author: "Anna Becker",
      role: "Luxury Real Estate Agency",
      location: "Grünwald",
      rating: 5,
    },
    {
      quote: "Die Investition von 249€ hat sich 20-fach gelohnt. Meine Wohnung wurde in 2 Wochen statt 2 Monaten verkauft. Die Fotos haben online 3x mehr Anfragen generiert.",
      author: "Michael Weber",
      role: "Privatverkäufer",
      location: "München-Bogenhausen",
      rating: 5,
    },
  ];

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Was unsere Kunden sagen</h2>
          <p className="text-xl text-muted-foreground">
            Über 300 zufriedene Kunden in München vertrauen uns bereits
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                
                <blockquote className="text-muted-foreground mb-6 italic">
                  "{testimonial.quote}"
                </blockquote>
                
                <div className="border-t pt-4">
                  <p className="font-bold">{testimonial.author}</p>
                  <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  <p className="text-sm text-accent mt-1">📍 {testimonial.location}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

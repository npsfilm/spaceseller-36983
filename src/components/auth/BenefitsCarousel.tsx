import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Clock, Award, Users, Check } from 'lucide-react';

const benefits = [
  {
    icon: Camera,
    title: 'Professionelle Immobilienfotos',
    description: 'KI-gestützte Bildbearbeitung in Premium-Qualität',
    stats: '500+ Projekte',
  },
  {
    icon: Clock,
    title: '24h Expresslieferung',
    description: 'Schnelle Bearbeitung für zeitkritische Projekte',
    stats: '24h Lieferzeit',
  },
  {
    icon: Award,
    title: 'Premium Bearbeitung',
    description: 'Virtual Staging, HDR, Grundrisse und mehr',
    stats: 'ISO Zertifiziert',
  },
  {
    icon: Users,
    title: 'Vertrauen von 500+ Maklern',
    description: 'Die bevorzugte Plattform für Immobilienprofis',
    stats: '4.9/5 Bewertung',
  },
];

export function BenefitsCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % benefits.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const current = benefits[currentIndex];
  const Icon = current.icon;

  return (
    <div className="relative h-full flex flex-col justify-center p-12 text-white">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary via-accent to-primary/80 animate-gradient-shift" />
      
      {/* Subtle pattern overlay */}
      <div className="absolute inset-0 opacity-10" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
      }} />

      <div className="relative z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring' }}
              className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm"
            >
              <Icon className="w-8 h-8" />
            </motion.div>

            <div className="space-y-2">
              <h3 className="text-3xl font-bold">{current.title}</h3>
              <p className="text-lg text-white/90">{current.description}</p>
            </div>

            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm">
              <Check className="w-4 h-4" />
              <span className="font-semibold">{current.stats}</span>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Carousel indicators */}
        <div className="flex gap-2 mt-12">
          {benefits.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={cn(
                "h-1.5 rounded-full transition-all duration-300",
                index === currentIndex ? "w-8 bg-white" : "w-1.5 bg-white/40"
              )}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

        {/* Trust badges */}
        <div className="mt-16 pt-8 border-t border-white/20">
          <div className="grid grid-cols-3 gap-6 text-center">
            <div>
              <div className="text-2xl font-bold">500+</div>
              <div className="text-sm text-white/80">Zufriedene Kunden</div>
            </div>
            <div>
              <div className="text-2xl font-bold">10k+</div>
              <div className="text-sm text-white/80">Bearbeitete Bilder</div>
            </div>
            <div>
              <div className="text-2xl font-bold">4.9/5</div>
              <div className="text-sm text-white/80">Kundenbewertung</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function cn(...classes: (string | undefined | false)[]) {
  return classes.filter(Boolean).join(' ');
}

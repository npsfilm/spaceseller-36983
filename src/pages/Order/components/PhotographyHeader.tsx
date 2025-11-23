import { Camera } from 'lucide-react';

export const PhotographyHeader = () => {
  return (
    <div className="text-center space-y-3">
      <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-4">
        <Camera className="w-10 h-10 text-primary" />
      </div>
      <h2 className="text-4xl font-bold">Wählen Sie Ihr Fotografie-Paket</h2>
      <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
        Professionelle Immobilienfotografie für aussagekräftige Exposés
      </p>
    </div>
  );
};

import { Building2 } from "lucide-react";

export const TrustedByLogos = () => {
  return (
    <section className="py-12 bg-muted/30 border-y">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          <p className="text-center text-sm text-muted-foreground mb-8 font-medium">
            Vertraut von Münchens führenden Immobilienmaklern
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8 opacity-70">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Building2 className="w-8 h-8" />
              <span className="font-semibold text-lg">Engel & Völkers</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Building2 className="w-8 h-8" />
              <span className="font-semibold text-lg">Munich Real Estate</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Building2 className="w-8 h-8" />
              <span className="font-semibold text-lg">Premium Properties</span>
            </div>
            <div className="bg-accent/10 text-accent px-6 py-3 rounded-full font-bold">
              150+ Münchner Makler
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

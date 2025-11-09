import { Building2, CheckCircle2 } from "lucide-react";

export const ClientLogos = () => {
  const clients = [
    "RE/MAX",
    "Engel & Völkers",
    "Century 21",
    "Immowelt",
    "Scout24",
    "ImmoScout24",
  ];

  return (
    <div className="py-16 animate-fade-in border-y border-border/50 bg-muted/20">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-center gap-3 mb-8">
            <CheckCircle2 className="w-5 h-5 text-primary" />
            <p className="text-center text-foreground text-sm font-semibold tracking-wide uppercase">
              Vertraut von über 500 Maklern & Branchenführern
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {clients.map((client, index) => (
              <div
                key={index}
                className="group flex items-center justify-center gap-2 p-4 rounded-lg bg-background/50 border border-border/50 hover:border-primary/50 hover:bg-background/80 transition-all duration-300"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <Building2 className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                <span className="text-foreground font-semibold text-sm group-hover:text-primary transition-colors">
                  {client}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

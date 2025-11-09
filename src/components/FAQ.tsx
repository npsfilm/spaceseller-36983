import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export const FAQ = () => {
  const faqs = [
    {
      question: "In welchen Regionen bieten Sie Fotografie vor Ort an?",
      answer:
        "Aktuell sind unsere Fotografen in München, Berlin, Hamburg, Frankfurt und weiteren Großstädten für Sie verfügbar. Wir expandieren stetig. Prüfen Sie Ihre PLZ bei der Buchung.",
    },
    {
      question: "Was ist, wenn ich nicht zufrieden bin?",
      answer:
        "Egal ob Shooting oder Bearbeitung: Sollte etwas nicht passen, bieten wir kostenlose Nachbesserungen an, bis Sie 100% zufrieden sind. Das ist unsere Garantie.",
    },
    {
      question: "Wie schnell ist die Lieferung?",
      answer:
        "Express-Bildbearbeitung liefern wir in 24h. Virtual Staging & Grundrisse in 24-48h. Bei einem gebuchten Shooting erhalten Sie die fertigen Fotos innerhalb von 48h nach dem Termin.",
    },
    {
      question: "Kann ich Fotografie und Bearbeitung kombinieren?",
      answer:
        "Ja! Unser Shooting-Service enthält bereits professionelle Bildbearbeitung. Sie können aber auch zusätzliche Services wie Virtual Staging oder Grundrisse hinzubuchen.",
    },
    {
      question: "Welche Bildqualität benötigen Sie für die Bearbeitung?",
      answer:
        "Die Fotos von modernen Kameras oder Smartphones reichen völlig aus, solange sie scharf sind. Wir empfehlen eine Auflösung von mindestens 3000x2000 Pixel für beste Ergebnisse.",
    },
    {
      question: "Welche Dateiformate werden unterstützt?",
      answer:
        "Wir akzeptieren alle gängigen Bildformate: JPG, PNG, HEIC, RAW (CR2, NEF, ARW, etc.). Die bearbeiteten Bilder erhalten Sie als hochwertige JPG-Dateien.",
    },
    {
      question: "Kann ich spezielle Wünsche äußern?",
      answer:
        "Absolut! Bei jedem Upload können Sie ein Briefing hinterlegen. Ob bestimmte Objekte entfernt, der Himmel besonders dramatisch oder die Farben warm sein sollen – teilen Sie uns Ihre Wünsche mit.",
    },
    {
      question: "Bieten Sie auch Drohnenaufnahmen-Bearbeitung an?",
      answer:
        "Ja, wir bearbeiten auch Luftaufnahmen. Die Preise sind identisch zur normalen Bearbeitung. Für Drohnenfotos sind besonders Perspektivkorrektur und Himmelsaustausch beliebt.",
    },
  ];

  return (
    <section id="faq" className="py-24 bg-gradient-subtle">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4 animate-fade-in-up">
          <h2 className="text-4xl lg:text-5xl font-bold text-foreground">
            Häufige <span className="bg-gradient-hero bg-clip-text text-transparent">Fragen</span>
          </h2>
          <p className="text-xl text-muted-foreground">
            Alles, was Sie über unseren Service wissen müssen
          </p>
        </div>

        {/* FAQ Accordion */}
        <div className="max-w-3xl mx-auto animate-fade-in">
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="bg-card rounded-xl px-6 shadow-card border-none"
              >
                <AccordionTrigger className="text-left text-lg font-semibold text-foreground hover:text-accent transition-colors">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};

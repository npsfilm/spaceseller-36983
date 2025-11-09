import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export const RealEstatePhotographerFAQ = () => {
  const faqs = [
    {
      question: "Wie funktioniert die Testbearbeitung?",
      answer:
        "Du lädst 3 Beispielbilder hoch und erhältst innerhalb von 48 h die Ergebnisse – völlig kostenlos und ohne Verpflichtung.",
    },
    {
      question: "Wie bleibe ich anonym gegenüber meinen Kunden?",
      answer:
        "Alle Bilder werden neutral ausgeliefert, ohne Branding oder Wasserzeichen. Dein Name bleibt exklusiv sichtbar. 100% White-Label garantiert.",
    },
    {
      question: "Kann ich den Stil selbst bestimmen?",
      answer:
        "Ja, du kannst Referenzbilder oder Presets hinterlegen. Wir bearbeiten im gewünschten Stil und passen uns deinem Workflow an.",
    },
    {
      question: "Wie werden Daten gesichert?",
      answer:
        "Unsere Server sind DSGVO-konform mit verschlüsselter Übertragung über deutsche Rechenzentren. Deine Daten sind bei uns sicher.",
    },
    {
      question: "Wie läuft die Bezahlung?",
      answer:
        "Du erhältst monatliche Sammelrechnungen mit ausgewiesener MwSt. – transparent und fair. Perfekt für deine Buchhaltung.",
    },
    {
      question: "Welche Dateiformate akzeptiert ihr?",
      answer:
        "Alle gängigen RAW-Formate (CR2, NEF, ARW, DNG) sowie JPEG und TIFF. Bis 100MP pro Datei.",
    },
    {
      question: "Wie schnell ist die Bearbeitung?",
      answer:
        "Standard: 48h. Express: 24h (bei Professional & Agentur inklusive). Rush: 12h gegen Aufpreis.",
    },
    {
      question: "Was kostet Objektentfernung?",
      answer:
        "5€ pro Bild. Entfernung von Mülltonnen, Laternen, Schildern, Kabeln, Autos und anderen störenden Objekten.",
    },
    {
      question: "Was kostet Rasenbearbeitung?",
      answer:
        "8€ pro Bild. Braune Rasenflächen werden in sattes Grün verwandelt mit natürlicher Sättigung.",
    },
    {
      question: "Kann ich mehrere Services kombinieren?",
      answer:
        "Ja. Zum Beispiel: Sky Replacement (3€) + Objektentfernung (5€) + Rasenbearbeitung (8€) = 16€ Aufpreis pro Bild zusätzlich zum Basispreis.",
    },
    {
      question: "Wie sieht es mit Revisionen aus?",
      answer:
        "Professional & Agentur: Unlimited Revisionen. Starter: 2 Runden. Einzelauftrag: 1 Runde kostenlose Nachbesserung.",
    },
    {
      question: "Was passiert mit meinen Daten nach Bearbeitung?",
      answer:
        "Automatische Löschung nach 30 Tagen. DSGVO-konform und sicher.",
    },
  ];

  return (
    <section className="py-20 px-4 bg-background">
      <div className="container mx-auto max-w-3xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Häufige Fragen zum White-Label-Service
          </h2>
          <p className="text-lg text-muted-foreground">
            Alles, was du wissen musst
          </p>
        </div>

        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger className="text-left">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
};

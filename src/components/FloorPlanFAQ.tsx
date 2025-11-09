import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export const FloorPlanFAQ = () => {
  const faqs = [
    {
      question: "Welche Unterlagen benötigen Sie?",
      answer: "Wir arbeiten mit fast allen Unterlagen! Handgezeichnete Skizzen, Fotos aus jeder Perspektive, alte Baupläne, PDF-Scans, Screenshots aus Immobilienportalen oder selbst erstellte Zeichnungen – alles ist möglich. Je mehr Informationen Sie uns geben, desto genauer wird das Ergebnis.",
    },
    {
      question: "Wie genau werden die Grundrisse?",
      answer: "Unsere Grundrisse sind maßstabsgetreu nach Ihren Angaben erstellt. Bei Unsicherheiten oder fehlenden Maßen fragen wir aktiv nach. Alle Grundrisse werden mit professioneller CAD-Software erstellt und entsprechen den gängigen DIN-Standards.",
    },
    {
      question: "Kann ich Änderungen anfordern?",
      answer: "Ja! Unlimited Revisionen sind im Preis inklusive. Wir arbeiten so lange an Ihrem Grundriss, bis Sie zu 100% zufrieden sind. Ihre Zufriedenheit ist unser oberstes Ziel.",
    },
    {
      question: "In welchen Formaten erhalte ich die Grundrisse?",
      answer: "Sie erhalten Ihre Grundrisse standardmäßig als hochauflösendes PDF (druckfähig, 300 DPI), PNG und JPG – optimal für Print und Web. Auf Anfrage sind auch andere Formate wie DWG oder SVG verfügbar.",
    },
    {
      question: "Was kostet ein mehrstöckiges Haus?",
      answer: "Das erste Geschoss beginnt ab 45€ (2D) bzw. 75€ (3D). Jedes weitere Geschoss wird günstiger: 2. Geschoss nur +30€, 3. Geschoss +25€. Beispiel: Ein 2-stöckiges Haus in 2D kostet 45€ + 30€ = 75€ gesamt.",
    },
    {
      question: "Können Sie auch große Gewerbeimmobilien erstellen?",
      answer: "Ja, natürlich! Für große Objekte über 200m² oder Gewerbeimmobilien bieten wir individuelle Paketpreise an. Kontaktieren Sie uns einfach mit den Details Ihrer Immobilie für ein unverbindliches Angebot.",
    },
    {
      question: "Wie lange dauert die Erstellung?",
      answer: "Die Standard-Lieferzeit beträgt 48 Stunden nach Upload Ihrer Unterlagen. Benötigen Sie Ihre Grundrisse schneller? Express-Lieferung in 24 Stunden ist gegen einen Aufpreis von 50% möglich.",
    },
    {
      question: "Sind die Grundrisse DIN-gerecht?",
      answer: "Ja, alle unsere Grundrisse entsprechen den gängigen Standards wie DIN 277 und ÖNORM. Sie sind damit optimal für offizielle Zwecke, Behörden und professionelle Vermarktung geeignet.",
    },
  ];

  return (
    <section className="py-20 px-4">
      <div className="container mx-auto max-w-3xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Häufig gestellte Fragen
          </h2>
          <p className="text-lg text-muted-foreground">
            Alles, was Sie über unsere Grundriss-Services wissen müssen
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

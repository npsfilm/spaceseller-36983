import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export const AugsburgPhotographyFAQ = () => {
  const faqs = [
    {
      question: "Wie lange dauert ein Fotoshooting?",
      answer:
        "Ein durchschnittliches Fotoshooting dauert 1-2 Stunden, abhängig von der Objektgröße. Für ein Einfamilienhaus mit ca. 150m² planen wir etwa 90 Minuten ein.",
    },
    {
      question: "Wann bekomme ich die fertigen Fotos?",
      answer:
        "Standard-Lieferzeit beträgt 24 Stunden nach dem Shooting. Bei Bedarf bieten wir auch Express-Lieferung innerhalb von 12 Stunden gegen Aufpreis an.",
    },
    {
      question: "Fahren Sie wirklich kostenlos nach Augsburg?",
      answer:
        "Ja, innerhalb von Augsburg Stadt fallen keine Anfahrtskosten an. Auch in der Umgebung bis 25km (Friedberg, Königsbrunn, Stadtbergen, etc.) berechnen wir keine Anfahrt.",
    },
    {
      question: "Kann ich auch am Wochenende einen Termin bekommen?",
      answer:
        "Ja, Samstag und Sonntag sind gegen einen Aufpreis von 50€ möglich. Gerade für vermietete Objekte ist das oft die beste Lösung.",
    },
    {
      question: "Was ist im Preis alles enthalten?",
      answer:
        "Im Paketpreis enthalten sind: Fotografie vor Ort, professionelle Bildbearbeitung (HDR, Farbkorrektur, Perspektivkorrektur), hochauflösende Dateien (300 DPI) und 24h Lieferung. Bei den höheren Paketen zusätzlich Himmelsaustausch, Objektentfernung und mehr.",
    },
    {
      question: "Benötigen Sie eine Genehmigung für Drohnenaufnahmen?",
      answer:
        "Nein, wir haben alle notwendigen Genehmigungen und Versicherungen. Unser Pilot ist lizenziert und darf legal in Augsburg und Umgebung fliegen.",
    },
    {
      question: "Wie bereite ich meine Immobilie am besten vor?",
      answer:
        "Wichtige Punkte: Alle Räume aufräumen, persönliche Gegenstände entfernen, alle Lampen einschalten, Vorhänge öffnen, Betten machen, Küche leer räumen, Mülltonnen verstecken. Wir senden Ihnen nach Buchung eine detaillierte Checkliste zu.",
    },
    {
      question: "Können Sie auch leere Räume fotografieren?",
      answer:
        "Ja, absolut! Wir fotografieren sowohl möblierte als auch leere Immobilien. Bei leeren Räumen bieten wir zusätzlich Virtual Staging an, um die Räume digital zu möblieren (ab 35€ pro Raum).",
    },
    {
      question: "Bieten Sie auch Grundrisse an?",
      answer:
        "Ja, 2D-Grundrisse bieten wir ab 45€ an. Im Premium-Paket ist ein 2D-Grundriss bereits enthalten. 3D-Grundrisse auf Anfrage.",
    },
    {
      question: "Was passiert bei schlechtem Wetter?",
      answer:
        "Bei Außenaufnahmen können wir den Termin bei schlechtem Wetter kostenlos verschieben. Innenaufnahmen sind wetterunabhängig und finden wie geplant statt. Alternativ ersetzen wir den Himmel digital.",
    },
    {
      question: "Haben Sie Mengenrabatte für Makler?",
      answer:
        "Ja! Ab 5 Objekten pro Monat bieten wir 15% Rabatt auf alle Pakete. Bei 10+ Objekten sprechen wir über individuelle Konditionen. Kontaktieren Sie uns für ein persönliches Angebot.",
    },
    {
      question: "Welche Dateiformate bekomme ich?",
      answer:
        "Sie erhalten hochauflösende JPEGs mit 300 DPI, optimiert für Web und Druck. Die Dateien sind sofort verwendbar für Immobilienportale, Exposés und Social Media. RAW-Dateien auf Anfrage verfügbar.",
    },
  ];

  return (
    <section className="py-20 px-4 bg-muted/30">
      <div className="container mx-auto max-w-3xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Häufig gestellte Fragen
          </h2>
          <p className="text-lg text-muted-foreground">
            Alles was Sie über unsere Immobilienfotografie in Augsburg wissen müssen
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

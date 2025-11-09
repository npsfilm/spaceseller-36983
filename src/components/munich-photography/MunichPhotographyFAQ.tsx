import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export const MunichPhotographyFAQ = () => {
  const faqs = [
    {
      question: "Wie schnell bekomme ich die Fotos?",
      answer: "24-Stunden-Garantie! Standard-Lieferzeit ist 24 Stunden nach dem Shooting. Express-Lieferung in 12h gegen Aufpreis von 100€ verfügbar. Das bedeutet: Shooting heute, noch morgen online vermarkten."
    },
    {
      question: "Was passiert bei schlechtem Wetter?",
      answer: "Wir bieten kostenlose Umplanung oder unsere 'Blue Sky Guarantee' Bearbeitung - Ihr Himmel wird immer perfekt blau aussehen, auch wenn es beim Shooting regnet. Kein Aufpreis für Wetterbearbeitung."
    },
    {
      question: "Wo in München sind Sie tätig?",
      answer: "Im gesamten Münchner Stadtgebiet und Umland bis 30km (Starnberg, Grünwald, Pullach, etc.). Keine Anfahrtskosten innerhalb dieses Bereichs. Wir kennen den lokalen Immobilienmarkt perfekt."
    },
    {
      question: "Brauche ich eine spezielle Vorbereitung?",
      answer: "Wir senden Ihnen eine einfache Checkliste nach der Buchung. Grundregel: Aufräumen, persönliche Gegenstände entfernen, alle Lichter einschalten, Vorhänge öffnen. Das wars! Bei Bedarf beraten wir Sie auch telefonisch."
    },
    {
      question: "Können Sie auch in Grünwald/Starnberg fotografieren?",
      answer: "Selbstverständlich! Wir decken München und die Umgebung bis 30km ab, inklusive Grünwald, Starnberg, Pullach und alle anderen Gemeinden im Umkreis. Keine zusätzlichen Anfahrtskosten."
    },
    {
      question: "Bieten Sie auch Service auf Englisch an?",
      answer: "Yes, we offer our full service in English. Many of our clients in Munich are international, and we're happy to communicate in English throughout the entire process."
    },
    {
      question: "Wie bereite ich meine Immobilie am besten vor?",
      answer: "Laden Sie unsere kostenlose Checkliste herunter. Wichtigste Punkte: Räume aufräumen, persönliche Gegenstände entfernen, alle Lichter einschalten, Vorhänge öffnen, Außenbereich pflegen."
    },
    {
      question: "Kann ich auch am Wochenende einen Termin bekommen?",
      answer: "Ja, Samstag und Sonntag sind gegen einen Aufpreis von 50€ möglich. Gerade für Privatverkäufer ist das oft die beste Option."
    },
    {
      question: "Benötigen Sie Genehmigungen für Drohnenaufnahmen in München?",
      answer: "Nein, wir haben alle notwendigen Genehmigungen und Versicherungen für gewerbliche Drohnenflüge in München. Unser Pilot ist lizenziert und kennt alle lokalen Regelungen."
    },
    {
      question: "Was ist im Preis alles enthalten?",
      answer: "Im Preis enthalten sind: Fotografie vor Ort, professionelle Bildbearbeitung (HDR, Farbkorrektur, Perspektivkorrektur), hochauflösende Dateien per Download-Link und 24h Lieferzeit."
    },
    {
      question: "Können Sie auch leere Luxusimmobilien fotografieren?",
      answer: "Ja! Leere Räume fotografieren wir professionell. Optional bieten wir Virtual Staging an, um leere Räume digital zu möblieren (ab 35€ pro Raum). Das funktioniert besonders gut bei Premium-Immobilien."
    },
    {
      question: "Haben Sie Erfahrung mit High-End Immobilien?",
      answer: "Ja, wir haben umfangreiche Erfahrung mit Luxusimmobilien in München, Grünwald und Starnberg. Über 30% unserer Projekte sind Premium-Objekte im Wert über 1 Million Euro."
    },
    {
      question: "Gibt es Mengenrabatte für Makler?",
      answer: "Ja! Ab 5 Objekten pro Monat bieten wir 15% Rabatt. Ab 10 Objekten 20%. Kontaktieren Sie uns für individuelle Rahmenverträge."
    },
    {
      question: "Wie schnell bekomme ich die Fotos?",
      answer: "Standard-Lieferzeit ist 24 Stunden nach dem Shooting. Express-Service (12h) ist gegen Aufpreis von 100€ verfügbar. Gleicher-Tag-Service nur im Komplett-Paket möglich."
    },
  ];

  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Häufig gestellte Fragen</h2>
          <p className="text-xl text-muted-foreground">
            Alles was Sie über unsere Fotografie-Services in München wissen müssen
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem 
                key={index} 
                value={`item-${index}`}
                className="bg-card border rounded-lg px-6"
              >
                <AccordionTrigger className="text-left hover:no-underline">
                  <span className="font-semibold">{faq.question}</span>
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        <div className="text-center mt-12">
          <p className="text-muted-foreground mb-4">Haben Sie noch weitere Fragen?</p>
          <a 
            href="tel:+498211234567" 
            className="text-accent font-semibold hover:underline"
          >
            Rufen Sie uns an: +49 821 123 4567
          </a>
        </div>
      </div>
    </section>
  );
};

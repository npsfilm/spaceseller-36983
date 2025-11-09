import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export const VirtualStagingFAQ = () => {
  const faqs = [
    {
      question: "Was ist Virtual Staging genau?",
      answer: "Virtual Staging ist die digitale Möblierung von Fotos leerer Räume. Mit professioneller 3D-Software erstellen wir fotorealistische Möblierungen, die von echten Möbeln kaum zu unterscheiden sind.",
    },
    {
      question: "Wie realistisch sieht es aus?",
      answer: "Wir nutzen professionelle 3D-Rendering-Software (3ds Max, V-Ray) und eine Bibliothek von über 5.000 realistischen Möbelmodellen. Die Ergebnisse sind so realistisch, dass nur Experten den Unterschied erkennen können.",
    },
    {
      question: "Welche Fotos benötigen Sie?",
      answer: "Mindestens 1 gut beleuchtetes Foto pro Raum ist ausreichend. Je mehr Perspektiven Sie uns liefern, desto besser wird das Ergebnis. Achten Sie auf gute Beleuchtung und einen geraden Winkel.",
    },
    {
      question: "Kann ich den Stil selbst wählen?",
      answer: "Ja! Sie können aus über 20 verschiedenen Einrichtungsstilen wählen (Modern, Scandinavian, Industrial, etc.) oder uns Ihren gewünschten Look beschreiben. Wir beraten Sie auch gerne kostenlos.",
    },
    {
      question: "Was kostet ein ganzes Haus?",
      answer: "Nutzen Sie unser Premium-Paket: Bis zu 10 Räume für nur 250€ (25€ pro Raum). Das ist die beste Value-Option für größere Immobilien. Bei über 10 Räumen erstellen wir ein individuelles Angebot.",
    },
    {
      question: "Wie lange dauert die Erstellung?",
      answer: "Standard-Lieferzeit ist 48 Stunden nach Upload Ihrer Fotos. Gegen einen Aufpreis von 50% bieten wir auch Express-Lieferung in 24 Stunden an.",
    },
    {
      question: "Kann ich Änderungen anfordern?",
      answer: "Ja! Im Basic-Paket ist 1 Revisionsrunde inklusive, im Standard-Paket 2 Runden, und im Premium-Paket haben Sie unlimited Revisionen bis Sie 100% zufrieden sind.",
    },
    {
      question: "Muss ich angeben, dass es Virtual Staging ist?",
      answer: "Ja, bei der Vermarktung von Immobilien ist es gesetzlich vorgeschrieben, transparent zu kommunizieren, dass es sich um virtuelle Möblierung handelt. Wir empfehlen einen Hinweis wie 'Möblierung virtuell dargestellt'.",
    },
    {
      question: "Funktioniert das auch für Außenbereiche?",
      answer: "Ja! Wir können auch Terrassen, Balkone und Gärten professionell möblieren. Der Preis liegt bei 45€ pro Außenbereich (etwas höher aufgrund des zusätzlichen Aufwands).",
    },
    {
      question: "Was ist der ROI von Virtual Staging?",
      answer: "Studien zeigen: Immobilien mit Virtual Staging verkaufen sich 40% schneller, erzielen 15% höhere Preise und generieren 83% mehr Anfragen auf Online-Portalen. Bei Kosten von nur 35-250€ ist der ROI hervorragend.",
    },
  ];

  return (
    <section className="py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Häufig gestellte Fragen</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Alles was Sie über Virtual Staging wissen müssen
          </p>
        </div>
        
        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem 
                key={index} 
                value={`item-${index}`}
                className="bg-background px-6 rounded-lg border"
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
      </div>
    </section>
  );
};

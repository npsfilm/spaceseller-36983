import { useState } from 'react';
import { Plus, Info } from 'lucide-react';
import { ADD_ONS } from '@/data/photographyAddOns';
import { AddOnsList } from '../components/AddOnsList';
import { ConfigurationHeader } from '../components/shared';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface PhotographyAddOnsStepProps {
  selectedAddOns: string[];
  onAddOnToggle: (addOnId: string) => void;
}

export const PhotographyAddOnsStep = ({
  selectedAddOns,
  onAddOnToggle
}: PhotographyAddOnsStepProps) => {
  return (
    <div className="min-h-screen py-8">
      <ConfigurationHeader
        icon={Plus}
        title="Optionale Zusatzleistungen"
        description="Erweitern Sie Ihr Paket mit professionellen Zusatzservices"
      />

      <div className="max-w-6xl mx-auto px-4 mt-12 space-y-12">
        {/* Add-ons Grid */}
        <AddOnsList
          addOns={ADD_ONS}
          selectedAddOnIds={selectedAddOns}
          onAddOnToggle={onAddOnToggle}
        />

        {/* Hinweise / Notes Accordion */}
        <div className="mt-16">
          <div className="flex items-center gap-3 mb-6">
            <Info className="w-6 h-6 text-primary" />
            <h3 className="text-2xl font-semibold">Wichtige Hinweise</h3>
          </div>

          <Accordion type="single" collapsible className="space-y-4">
            <AccordionItem value="vorbereitung" className="border rounded-lg px-6">
              <AccordionTrigger className="text-lg font-medium hover:no-underline">
                Vorbereitung des Objekts
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground space-y-3 pb-4">
                <p>
                  Für optimale Aufnahmen empfehlen wir:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Räume aufgeräumt und sauber hinterlassen</li>
                  <li>Persönliche Gegenstände weitestgehend entfernen</li>
                  <li>Vorhänge/Jalousien öffnen für natürliches Licht</li>
                  <li>Außenbeleuchtung bei Dämmerungsaufnahmen testen</li>
                </ul>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="wetter" className="border rounded-lg px-6">
              <AccordionTrigger className="text-lg font-medium hover:no-underline">
                Wetter & Terminverschiebung
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground space-y-3 pb-4">
                <p>
                  Bei ungünstigen Wetterbedingungen (starker Regen, Sturm) kann der Fotograf
                  den Termin bis zu 24 Stunden vorher verschieben. Wir informieren Sie
                  umgehend und bieten einen Ersatztermin an.
                </p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="drohne" className="border rounded-lg px-6">
              <AccordionTrigger className="text-lg font-medium hover:no-underline">
                Drohnenaufnahmen & Genehmigungen
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground space-y-3 pb-4">
                <p>
                  Unsere Piloten verfügen über alle erforderlichen Genehmigungen gemäß
                  Luftverkehrsordnung. In besonderen Flugzonen (Flughäfen, militärische
                  Sperrgebiete) können zusätzliche Genehmigungen erforderlich sein.
                  Wir prüfen dies vorab für Sie.
                </p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="lieferung" className="border rounded-lg px-6">
              <AccordionTrigger className="text-lg font-medium hover:no-underline">
                Lieferung & Bildbearbeitung
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground space-y-3 pb-4">
                <p>
                  Die fertigen Bilder erhalten Sie in der Regel innerhalb von 48-72 Stunden
                  nach dem Shooting. Alle Bilder werden professionell bearbeitet (Belichtung,
                  Farben, Horizont-Korrektur) und in hoher Auflösung bereitgestellt.
                </p>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
    </div>
  );
};

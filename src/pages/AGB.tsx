import { Layout } from "@/components/Layout";

const AGB = () => {
  return (
    <Layout className="min-h-screen flex flex-col">
      <div className="flex-1 pt-20">
        <div className="container mx-auto px-4 py-16 max-w-4xl">
          <h1 className="text-4xl font-bold mb-8">Allgemeine Geschäftsbedingungen</h1>
          
          <div className="space-y-6 text-muted-foreground">
            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-3">§ 1 Geltungsbereich</h2>
              <p>(1) Diese Allgemeinen Geschäftsbedingungen (AGB) gelten für alle Verträge über die Erbringung von Bildbearbeitungsdienstleistungen zwischen spaceseller (nachfolgend "Anbieter") und dem Kunden.</p>
              <p className="mt-2">(2) Abweichende, entgegenstehende oder ergänzende Allgemeine Geschäftsbedingungen des Kunden werden nur dann und insoweit Vertragsbestandteil, als der Anbieter ihrer Geltung ausdrücklich zugestimmt hat.</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-3">§ 2 Vertragsschluss</h2>
              <p>(1) Die Darstellung der Dienstleistungen auf der Website stellt kein rechtlich bindendes Angebot dar, sondern eine unverbindliche Aufforderung zur Bestellung.</p>
              <p className="mt-2">(2) Durch das Absenden der Bestellung gibt der Kunde ein verbindliches Angebot zum Abschluss eines Vertrages ab. Der Anbieter kann dieses Angebot innerhalb von 5 Tagen durch eine Auftragsbestätigung per E-Mail annehmen.</p>
              <p className="mt-2">(3) Der Vertragstext wird vom Anbieter gespeichert und dem Kunden nach Vertragsschluss per E-Mail zugesandt.</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-3">§ 3 Leistungsumfang</h2>
              <p>(1) Der Anbieter erbringt Bildbearbeitungsdienstleistungen für Immobilienfotos gemäß der gewählten Leistungspakete (Basis-Retusche, Premium-Retusche, Virtual Staging, Drohnenaufnahmen).</p>
              <p className="mt-2">(2) Der konkrete Leistungsumfang ergibt sich aus der Leistungsbeschreibung auf der Website zum Zeitpunkt der Bestellung.</p>
              <p className="mt-2">(3) Der Kunde ist verpflichtet, Bildmaterial in ausreichender Qualität bereitzustellen. Der Anbieter behält sich vor, Aufträge bei unzureichender Bildqualität abzulehnen.</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-3">§ 4 Preise und Zahlungsbedingungen</h2>
              <p>(1) Es gelten die zum Zeitpunkt der Bestellung auf der Website angegebenen Preise. Alle Preise verstehen sich inklusive der gesetzlichen Mehrwertsteuer.</p>
              <p className="mt-2">(2) Die Zahlung erfolgt wahlweise per Vorkasse, PayPal, Kreditkarte oder auf Rechnung (bei Geschäftskunden nach Prüfung der Bonität).</p>
              <p className="mt-2">(3) Bei Zahlungsverzug ist der Anbieter berechtigt, Verzugszinsen in Höhe von 5 Prozentpunkten über dem Basiszinssatz zu berechnen.</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-3">§ 5 Lieferung und Lieferzeiten</h2>
              <p>(1) Die bearbeiteten Bilder werden dem Kunden per Download-Link zur Verfügung gestellt.</p>
              <p className="mt-2">(2) Die Lieferzeit beträgt in der Regel 24-48 Stunden nach Auftragseingang und Zahlungseingang. Bei größeren Aufträgen kann die Lieferzeit länger sein.</p>
              <p className="mt-2">(3) Liefertermine sind nur verbindlich, wenn sie vom Anbieter ausdrücklich schriftlich bestätigt wurden.</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-3">§ 6 Urheberrechte und Nutzungsrechte</h2>
              <p>(1) Der Kunde versichert, dass er über die erforderlichen Rechte an den zur Bearbeitung übermittelten Bildern verfügt.</p>
              <p className="mt-2">(2) Mit vollständiger Bezahlung gehen die Nutzungsrechte an den bearbeiteten Bildern auf den Kunden über. Der Anbieter behält sich das Recht vor, die bearbeiteten Bilder zu Referenzzwecken zu verwenden.</p>
              <p className="mt-2">(3) Eine Weitergabe der bearbeiteten Bilder an Dritte zu gewerblichen Zwecken bedarf der vorherigen schriftlichen Zustimmung des Anbieters.</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-3">§ 7 Gewährleistung</h2>
              <p>(1) Der Anbieter gewährleistet die fachgerechte Ausführung der Bildbearbeitungsdienstleistungen nach den aktuellen Standards der Branche.</p>
              <p className="mt-2">(2) Bei berechtigten Mängeln kann der Kunde zunächst eine Nachbesserung verlangen. Schlägt die Nachbesserung fehl, kann der Kunde nach seiner Wahl eine Minderung des Preises oder die Rückabwicklung des Vertrages verlangen.</p>
              <p className="mt-2">(3) Mängel müssen innerhalb von 7 Tagen nach Erhalt der bearbeiteten Bilder gerügt werden.</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-3">§ 8 Haftung</h2>
              <p>(1) Der Anbieter haftet unbeschränkt für Vorsatz und grobe Fahrlässigkeit sowie für die Verletzung von Leben, Körper oder Gesundheit.</p>
              <p className="mt-2">(2) Bei leicht fahrlässiger Verletzung wesentlicher Vertragspflichten ist die Haftung auf den vertragstypischen, vorhersehbaren Schaden begrenzt.</p>
              <p className="mt-2">(3) Im Übrigen ist die Haftung ausgeschlossen, soweit gesetzlich zulässig.</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-3">§ 9 Widerrufsrecht für Verbraucher</h2>
              <p>(1) Verbrauchern steht ein gesetzliches Widerrufsrecht zu. Die Einzelheiten ergeben sich aus der Widerrufsbelehrung.</p>
              <p className="mt-2">(2) Das Widerrufsrecht erlischt vorzeitig, wenn der Anbieter mit der Ausführung der Dienstleistung mit ausdrücklicher Zustimmung des Verbrauchers vor Ende der Widerrufsfrist begonnen hat.</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-3">§ 10 Datenschutz</h2>
              <p>Die Verarbeitung personenbezogener Daten erfolgt im Einklang mit der Datenschutz-Grundverordnung (DSGVO). Nähere Informationen finden Sie in unserer Datenschutzerklärung.</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-3">§ 11 Schlussbestimmungen</h2>
              <p>(1) Es gilt das Recht der Bundesrepublik Deutschland unter Ausschluss des UN-Kaufrechts.</p>
              <p className="mt-2">(2) Ist der Kunde Kaufmann, juristische Person des öffentlichen Rechts oder öffentlich-rechtliches Sondervermögen, ist ausschließlicher Gerichtsstand für alle Streitigkeiten aus diesem Vertrag der Geschäftssitz des Anbieters.</p>
              <p className="mt-2">(3) Sollten einzelne Bestimmungen dieser AGB unwirksam sein oder werden, berührt dies die Wirksamkeit der übrigen Bestimmungen nicht.</p>
            </section>

            <section className="mt-8 pt-6 border-t border-border">
              <p className="text-sm">Stand: Januar 2025</p>
              <p className="text-sm mt-2">spaceseller<br />
              Musterstraße 123<br />
              12345 Musterstadt</p>
            </section>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AGB;

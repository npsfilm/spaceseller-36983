import { Layout } from "@/components/Layout";

const Impressum = () => {
  return (
    <Layout className="min-h-screen flex flex-col">
      <div className="flex-1 pt-20">
        <div className="container mx-auto px-4 py-16 max-w-4xl">
          <h1 className="text-4xl font-bold mb-8">Impressum</h1>
          
          <div className="space-y-6 text-muted-foreground">
            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-3">Angaben gemäß § 5 TMG</h2>
              <p>spaceseller</p>
              <p>Musterstraße 123</p>
              <p>12345 Musterstadt</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-3">Vertreten durch</h2>
              <p>Max Mustermann</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-3">Kontakt</h2>
              <p>Telefon: +49 (0) 123 456789</p>
              <p>E-Mail: kontakt@spaceseller.de</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-3">Umsatzsteuer-ID</h2>
              <p>Umsatzsteuer-Identifikationsnummer gemäß § 27 a Umsatzsteuergesetz:</p>
              <p>DE123456789</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-3">Redaktionell verantwortlich</h2>
              <p>Max Mustermann</p>
              <p>Musterstraße 123</p>
              <p>12345 Musterstadt</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-3">EU-Streitschlichtung</h2>
              <p>Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit: 
              <a href="https://ec.europa.eu/consumers/odr/" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline ml-1">
                https://ec.europa.eu/consumers/odr/
              </a></p>
              <p className="mt-2">Unsere E-Mail-Adresse finden Sie oben im Impressum.</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-3">Verbraucher­streit­beilegung/Universal­schlichtungs­stelle</h2>
              <p>Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.</p>
            </section>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Impressum;

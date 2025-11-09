export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-primary text-primary-foreground py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold">spaceseller</h3>
            <p className="text-primary-foreground/80 text-sm">
              Professionelle Bildbearbeitung für Immobilienmakler. Schnell, zuverlässig, perfekt.
            </p>
          </div>

          {/* Services */}
          <div className="space-y-4">
            <h4 className="font-semibold">Services</h4>
            <ul className="space-y-2 text-sm text-primary-foreground/80">
              <li>
                <a href="#" className="hover:text-accent transition-colors">
                  Basis-Retusche
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-accent transition-colors">
                  Premium-Retusche
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-accent transition-colors">
                  Virtual Staging
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-accent transition-colors">
                  Drohnenaufnahmen
                </a>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div className="space-y-4">
            <h4 className="font-semibold">Unternehmen</h4>
            <ul className="space-y-2 text-sm text-primary-foreground/80">
              <li>
                <a href="#" className="hover:text-accent transition-colors">
                  Über uns
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-accent transition-colors">
                  Portfolio
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-accent transition-colors">
                  Kontakt
                </a>
              </li>
              <li>
                <a href="/fotografen-werden" className="hover:text-accent transition-colors">
                  Fotografen werden
                </a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div className="space-y-4">
            <h4 className="font-semibold">Rechtliches</h4>
            <ul className="space-y-2 text-sm text-primary-foreground/80">
              <li>
                <a href="/impressum" className="hover:text-accent transition-colors">
                  Impressum
                </a>
              </li>
              <li>
                <a href="/datenschutz" className="hover:text-accent transition-colors">
                  Datenschutz
                </a>
              </li>
              <li>
                <a href="/agb" className="hover:text-accent transition-colors">
                  AGB
                </a>
              </li>
              <li>
                <a href="/agb#widerruf" className="hover:text-accent transition-colors">
                  Widerrufsrecht
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-primary-foreground/20 text-center text-sm text-primary-foreground/60">
          <p>&copy; {currentYear} spaceseller. Alle Rechte vorbehalten.</p>
        </div>
      </div>
    </footer>
  );
};

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-primary text-primary-foreground py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
          {/* Company Info */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold">spaceseller</h3>
            <p className="text-primary-foreground/80 text-sm">
              Professionelle Bildbearbeitung für Immobilienmakler. Schnell, zuverlässig, perfekt.
            </p>
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

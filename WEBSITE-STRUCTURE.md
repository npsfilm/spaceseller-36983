# spaceseller - Website Structure Documentation

## 📋 Table of Contents
1. [Site Architecture](#site-architecture)
2. [Navigation Structure](#navigation-structure)
3. [All Pages Overview](#all-pages-overview)
4. [Page Details & Copywriting](#page-details--copywriting)
5. [User Journeys](#user-journeys)
6. [CTA Buttons & Links Map](#cta-buttons--links-map)
7. [Reusable Components](#reusable-components)

---

## 🏗️ Site Architecture

```
spaceseller Website
│
├── 🏠 Homepage (/)
│   ├── Dual-Path Hero (Photography vs Editing)
│   ├── Trust Indicators
│   ├── Services Overview
│   ├── Process Steps
│   ├── Testimonials
│   ├── FAQ
│   └── Final CTA
│
├── 📸 Photography Services
│   ├── /Immobilienmakler (For Brokers - General)
│   ├── /immobilienfotografie-muenchen (Munich Location)
│   ├── /immobilienfotografie-augsburg (Augsburg Location)
│   ├── /immobilienfotograf-whitelabel (White-label for Photographers)
│   └── /fotografen-werden (Photographer Recruitment)
│
├── 🎨 Editing Services
│   ├── /virtual-staging (Virtual Staging)
│   └── /grundrisse (Floor Plans)
│
├── 🔐 User Account
│   ├── /auth (Login/Signup)
│   ├── /onboarding (First-time setup)
│   ├── /order (Order placement)
│   ├── /order/confirmation/:orderId (Order confirmation)
│   ├── /my-orders (Order management)
│   └── /settings (Account settings)
│
└── ⚖️ Legal
    ├── /impressum (Imprint)
    ├── /datenschutz (Privacy Policy)
    └── /agb (Terms & Conditions)
```

---

## 🧭 Navigation Structure

### Header Navigation (Desktop)

**Desktop Mega Menu:**
- **Dienstleistungen** (Services Dropdown)
  - Grundrisse → `/grundrisse`
  - Virtual Staging → `/virtual-staging`
  - Immobilienfotografie → `/Immobilienmakler`
  
- **Standorte** (Locations Dropdown)
  - Immobilienfotografie München → `/immobilienfotografie-muenchen`
  - Immobilienfotografie Augsburg → `/immobilienfotografie-augsburg`
  - Whitelabel für Fotografen → `/immobilienfotograf-whitelabel`
  - Fotografen werden → `/fotografen-werden`
  
- **Für Makler** → `/Immobilienmakler`

**User Menu (when logged in):**
- Meine Bestellungen → `/my-orders`
- Einstellungen → `/settings`
- Abmelden (Logout action)
- **CTA Button:** "Bilder hochladen" → `/order`

**User Menu (when logged out):**
- Anmelden → `/auth`
- **CTA Button:** "Bilder hochladen" → `/order`

### Mobile Navigation

**Mobile Sheet Menu:**
- Navigation (Header)
- User Info (if logged in)
- **Accordion Section:** Dienstleistungen
  - Grundrisse
  - Virtual Staging
  - Immobilienfotografie
- **Accordion Section:** Standorte
  - Immobilienfotografie München
  - Immobilienfotografie Augsburg
  - Whitelabel für Fotografen
  - Fotografen werden
- **Direct Link:** Für Makler
- **User Actions** (if logged in):
  - Meine Bestellungen
  - Einstellungen
  - Abmelden
  - **CTA:** Bilder hochladen
- **User Actions** (if logged out):
  - Anmelden
  - **CTA:** Bilder hochladen
- **Legal Links:**
  - Impressum
  - Datenschutz
  - AGB

### Footer Navigation

**Services Column:**
- Basis-Retusche
- Premium-Retusche
- Virtual Staging
- Drohnenaufnahmen

**Company Column:**
- Über uns
- Portfolio
- Kontakt
- Fotografen werden → `/fotografen-werden`

**Legal Column:**
- Impressum → `/impressum`
- Datenschutz → `/datenschutz`
- AGB → `/agb`
- Widerrufsrecht → `/agb#widerruf`

---

## 📄 All Pages Overview

| Route | Page Name | Purpose | Auth Required |
|-------|-----------|---------|---------------|
| `/` | Homepage | Dual-path receptionist | No |
| `/Immobilienmakler` | For Brokers | Photography service page | No |
| `/immobilienfotografie-muenchen` | Munich Photography | Local photography service | No |
| `/immobilienfotografie-augsburg` | Augsburg Photography | Local photography service | No |
| `/immobilienfotograf-whitelabel` | White-label Service | B2B photographer service | No |
| `/fotografen-werden` | Photographer Recruitment | Partner photographer recruitment | No |
| `/grundrisse` | Floor Plans | Floor plan service | No |
| `/virtual-staging` | Virtual Staging | Virtual staging service | No |
| `/auth` | Login/Signup | Authentication | No |
| `/onboarding` | Onboarding | First-time user setup | Yes |
| `/order` | Place Order | Order creation | Yes |
| `/order/confirmation/:orderId` | Order Confirmation | Order success page | Yes |
| `/my-orders` | My Orders | Order management | Yes |
| `/settings` | Settings | Account settings | Yes |
| `/impressum` | Imprint | Legal information | No |
| `/datenschutz` | Privacy Policy | Privacy information | No |
| `/agb` | Terms & Conditions | Terms of service | No |

---

## 📝 Page Details & Copywriting

### 1. Homepage (`/`)

**Main Purpose:** Receptionist page - segments visitors into two paths immediately

#### Hero Section
**Pre-headline:** "Für Immobilienmakler & Fotografen"

**Main Headline:** 
"Verkaufsstarke Immobilienfotos. Ob vor Ort fotografiert oder Ihre Bilder veredelt."

**Subheadline:**
"Ihr All-in-One Partner für Immobilien-Marketing: Buchen Sie professionelle Fotografen in Ihrer Region oder nutzen Sie unseren 24h Express-Service für Bildbearbeitung, Virtual Staging & Grundrisse."

**Social Proof:**
- ⭐ 4.9/5 Sterne
- 500+ zufriedene Makler
- 10.000+ bearbeitete Bilder

**Primary CTAs:**
1. "Fotograf buchen" → `/immobilienfotografie-muenchen`
2. "Bilder jetzt bearbeiten" → `/order`

**Visual:** Before/After Slider (exterior property)

**Trust Badges:**
- 48h Lieferung garantiert
- Geld-zurück-Garantie
- 100% Zufriedenheit

#### Client Logos Section
**Headline:** "Vertraut von über 500 Maklern & Branchenführern"

**Clients Listed:**
- RE/MAX
- Engel & Völkers
- ImmobilienScout24
- ImmoWelt
- eBay Kleinanzeigen
- Homeday

#### Services Section
**Headline:** "Ihr Baukasten für digitales Immobilien-Marketing"

**Service Cards:**
1. **Immobilien-Fotografie**
   - Description: "Unsere spezialisierten Fotografen wissen, wie man Architektur und Ambiente einfängt, um Interesse zu wecken"
   - Features:
     - Professionelle Aufnahmen (Innen & Außen)
     - Drohnenaufnahmen optional
     - Inklusive Bildbearbeitung
     - Lieferung in 48h
   - Price: "ab 199€ / Shooting"
   - CTA: "Mehr erfahren" → `/immobilienfotografie-muenchen`

2. **Professionelle Bildbearbeitung**
   - Description: "Himmelsaustausch, Farbkorrektur, Perspektivkorrektur – Ihre Fotos in Perfektion"
   - Features:
     - Himmelsaustausch & Farboptimierung
     - Objektentfernung (Müll, Autos, etc.)
     - Rasen & Pflanzen-Optimierung
     - Perspektiv- & Linienkorrektur
   - Price: "ab 8€ / Bild"
   - CTA: "Mehr erfahren" → `/Immobilienmakler#preise`

3. **Virtual Staging**
   - Description: "Leere Räume digital möblieren und emotional verkaufen"
   - Features:
     - Professionelle 3D-Möblierung
     - Verschiedene Einrichtungsstile
     - Fotorealistische Qualität
     - Unlimited Revisionen
   - Price: "ab 35€ / Raum"
   - CTA: "Mehr erfahren" → `/virtual-staging`

4. **2D/3D Grundrisse**
   - Description: "Professionelle Grundrisse aus Ihren Skizzen oder Fotos"
   - Features:
     - 2D-Grundrisse mit Maßen
     - 3D-Visualisierungen
     - Möblierte Grundrisse
     - Schnelle Bearbeitung in 48h
   - Price: "ab 45€ / Grundriss"
   - CTA: "Mehr erfahren" → `/grundrisse`

#### Process Steps
(Component displays workflow steps)

#### Testimonials
(Carousel of customer testimonials)

#### FAQ
(Accordion with frequently asked questions)

#### Final CTA Section
**Headline:** "Bereit, Ihre Immobilien schneller zu verkaufen?"

**Subheadline:** "Starten Sie noch heute mit 20% Rabatt – egal ob Sie unseren Express-Bearbeitungsservice nutzen oder ein komplettes Shooting buchen."

**CTAs:**
1. "Fotograf anfragen"
2. "Bilder hochladen & 20% sparen"

**Trust Elements:**
- Zufriedenheitsgarantie
- Regionale Fotografen
- 24h Express-Service

---

### 2. Immobilienmakler (`/Immobilienmakler`)

**Purpose:** General photography service page for real estate brokers

#### Page Structure:
- TrustBanner (top sticky banner)
- Header
- Hero Section
- Portfolio Gallery
- Process Steps
- Pricing Tables
- FAQ
- Final CTA
- Footer

**Hero Copy:**
(Same as homepage hero but focused on photography services)

---

### 3. München Photography (`/immobilienfotografie-muenchen`)

**Purpose:** Local photography service for Munich area

#### Hero Section
**Headline:** "Immobilienfotografie München - Ihr lokaler Partner"

**Subheadline:** Premium photography service for Munich real estate market

**Stats:**
- 300+ München Immobilien schneller verkauft
- 150+ Makler vertrauen uns
- 24h Lieferung garantiert
- 12 Tage schnellerer Verkauf (Durchschnitt)

#### Why Choose Us Section
**Benefits:**
1. **Lokaler München-Service**
   - Schnelle Anfahrt, keine Anfahrtskosten
   - Kennen den lokalen Immobilienmarkt

2. **Premium-Markt Expertise**
   - Spezialisiert auf High-End Immobilien
   - Erfahrung mit Luxus-Objekten

3. **Komplettservice**
   - Fotografie + Bildbearbeitung
   - 24h Lieferung

4. **24h Lieferung - Noch heute online**
   - Shooting heute → Online morgen
   - Express in 12h verfügbar

5. **Profi-Ausrüstung**
   - Vollformat-Kameras
   - 4K-Drohne mit lizenziertem Piloten

6. **Faire Premium-Preise**
   - Transparente Paketpreise ab 149€
   - Mengenrabatt für Makler

#### Contact Section
**Headline:** "Jetzt Buchen & Schneller Verkaufen"
**Urgency:** "⚡ Nur noch 3 Termine diese Woche verfügbar"

**Contact Options:**
- **München Hotline:** (089) 1123-4567
- **Email:** muenchen@spaceseller.de
- **WhatsApp:** Jetzt chatten

**Guarantees:**
- Keine Verpflichtung
- Geld-zurück-Garantie
- Kostenlose Nachbesserung

---

### 4. Augsburg Photography (`/immobilienfotografie-augsburg`)

**Purpose:** Local photography service for Augsburg area

#### Hero Section
**Headline:** "Immobilienfotografie Augsburg - Professionell & Lokal"

**Benefits:**
1. **Lokaler Service**
   - Keine Anfahrtskosten in Augsburg
   - Lokale Kenntnis der besten Locations

2. **Erfahrung in Augsburg**
   - 200+ Objekte fotografiert
   - Kennen den lokalen Markt

3. **Komplettservice**
   - Fotografie + Bildbearbeitung
   - Alles aus einer Hand

4. **24h Express-Lieferung**
   - Fotos innerhalb von 24 Stunden
   - Perfekt für dringende Verkäufe

5. **Professionelle Ausrüstung**
   - Vollformat-Kameras
   - 4K-Drohne, lizenzierter Pilot

6. **Faire Preise**
   - Transparente Paketpreise
   - Mengenrabatt verfügbar

---

### 5. White-label Service (`/immobilienfotograf-whitelabel`)

**Purpose:** B2B service for photographers

#### Hero Section
**Headline:** "White-Label Bildbearbeitung für Immobilienfotografen"

**Subheadline:** "Ihre Marke. Unsere Expertise. Ab 6€ pro Bild bei Mengenabnahme."

**Trust Badges:**
- Made in Germany
- 48h Lieferung / 24h Express
- DSGVO-konform
- MwSt. Rechnung
- White-Label

**CTAs:**
1. "Gratis Testbearbeitung"
2. "Mengenpreise ansehen"

#### What is White-Label Section
**Headline:** "White-Label = Ihre Marke, unsere Arbeit"

**Description:** "Sie fotografieren Immobilien. Wir bearbeiten professionell. Ihre Kunden erhalten die Bilder von Ihnen – als hätten Sie selbst bearbeitet. Kein spaceseller-Branding, keine Wasserzeichen. 100% white-label."

**Benefits:**
1. **Skalieren ohne Festangestellte**
   - Keine Personalkosten, keine Sozialabgaben

2. **Gleichbleibende Qualität**
   - Professionelle Editoren mit jahrelanger Erfahrung

3. **Ihr Branding, unsere Expertise**
   - Kein spaceseller-Branding, 100% white-label

#### Stats
- 30.000+ Immobilienfotos bearbeitet
- 150+ Fotografen vertrauen uns
- 48h Standard-Lieferung
- 24h Express verfügbar

#### Comparison Table: In-House vs. Outsourcing

| Kriterium | In-House Editor | Freelancer | spaceseller |
|-----------|-----------------|------------|-------------|
| Kosten/Monat | 3.500€+ | 2.000€+ | ab 300€ |
| Skalierbar | Nein | Begrenzt | Ja |
| White-Label | - | Manchmal | Ja |
| MwSt-Rechnung | - | Oft nicht | Ja |
| DSGVO | Eigene Verantwortung | Unklar | Garantiert |
| Lieferzeit | 1-3 Tage | Variabel | 48h / 24h |

**Savings Message:** "Bei 200 Bildern/Monat sparen Sie 2.300€ gegenüber einem In-House-Editor"

#### Free Trial Section
**Headline:** "Überzeugen Sie sich selbst – Kostenlos"

**Subheadline:** "3 Bilder professionell bearbeitet. Keine Kreditkarte. Keine Verpflichtung."

**Process:**
1. 📤 Bilder hochladen
2. ✏️ Editing-Wünsche angeben
3. ✨ In 48h fertige Bilder

**CTA:** "Jetzt 3 Bilder gratis bearbeiten lassen"

---

### 6. Photographer Recruitment (`/fotografen-werden`)

**Purpose:** B2B partner photographer recruitment landing page

#### Hero Section
**Headline:** "Werde Teil von spaceseller – Fotografiere Immobilien, wir übernehmen den Rest."

**Subheadline:** "Mehr Aufträge. Kein Marketing. Keine Nachbearbeitung. Werde offizieller spaceseller Partner-Fotograf in deiner Region."

**CTAs:**
1. "Jetzt Partner werden" → Scroll to application form
2. "3 Testaufträge ansehen" → Modal/section with examples

**Visual:** Hero image with photographer in action + map overlay of DACH cities

**Trust Indicators:**
- ✓ 100+ Partner im Aufbau
- ✓ Faire Bezahlung
- ✓ Volle Flexibilität

#### Why spaceseller Section
**Headline:** "Wir bringen dich mit Auftraggebern zusammen – du fokussierst dich auf das, was du liebst: Fotografieren."

**5 USP Cards:**
1. 🎯 **Garantierte Aufträge** - Regional assignments from brokers, developers, owners
2. ✨ **Keine Nachbearbeitung** - Professional editing team handles all post-production
3. 💰 **Faire Bezahlung** - Transparent payment per job, on-time payouts
4. 📅 **Volle Flexibilität** - Decide when and how much you work
5. 🏢 **Professionelles Branding** - Shoot under spaceseller brand, benefit from marketing

#### Process Section
**Headline:** "In drei Schritten zum offiziellen spaceseller Partner."

**3 Steps:**
1. **Bewerben** (2 minutes)
   - Submit portfolio + experience
   - Review within 48 hours
   - CTA: "Bewerbung starten"

2. **Testshooting absolvieren** (1-2 hours)
   - Complete test assignment per guidelines
   - Receive detailed feedback

3. **Aufträge erhalten** (Unlimited)
   - Start as official partner
   - Flexible scheduling via booking system

**Express Note:** After passing test shooting, you can start immediately

#### Benefits Grid
**Headline:** "Mehr Freiheit. Mehr Struktur. Mehr Umsatz."

**Support & Organisation:**
- 24h Support durch das spaceseller Team
- Stetiger Auftragsfluss (Makler, Bauträger, Eigentümer)
- Kein Kundenkontakt, keine Rechnungsstellung
- Zugriff auf interne Ressourcen & Tutorials

**Tools & Wachstum:**
- Kostenlose Nutzung unserer Editing-Plattform
- Regionale Exklusivität möglich
- Modernes Branding & Marketingmaterialien
- Faire Vergütung pro Auftrag

**Bonus:** Partners with 10+ assignments/month get exclusive workshops + equipment discounts

#### Testimonials
**Headline:** "Das sagen Fotografen über die Zusammenarbeit mit spaceseller."

(Reuses TestimonialCarousel component with partner photographer quotes)

#### Interactive Map Section
**Headline:** "Wir wachsen im gesamten DACH-Raum – und suchen dich!"

**Cities:**
- **Active** (green): München, Augsburg
- **Recruiting** (orange): Stuttgart, Frankfurt, Hamburg, Berlin, Wien, Zürich

**Legend:** 
- Green marker = Active partner region
- Orange marker = Partners wanted

**CTA:** "Jetzt Partnerregion sichern"

#### Requirements Section
**Headline:** "Was du mitbringen solltest."

**Required:**
- ✓ Erfahrung in Immobilien- oder Architekturfotografie
- ✓ Eigene Kameraausrüstung (Vollformat empfohlen)
- ✓ Zuverlässigkeit & Qualitätsbewusstsein
- ✓ Lust auf langfristige Zusammenarbeit

**Optional (Advantages):**
- ○ Drohnenlizenz (A1/A3 oder A2)
- ○ Erfahrung in Interieurfotografie
- ○ Professionelles Weitwinkelobjektiv
- ○ Erfahrung mit Bildbearbeitungssoftware

**Encouragement:** "Noch unsicher? Wir bieten Onboarding-Workshops und Equipment-Beratung"

#### Final CTA Section
**Headline:** "Starte jetzt deine Partnerschaft mit spaceseller."

**Subheadline:** "Weniger Organisation. Mehr kreative Freiheit. Gemeinsam heben wir Immobilienfotografie auf das nächste Level."

**CTAs:**
1. "Jetzt Partner werden" → Application form
2. "Unverbindlich informieren" → Contact

**Trust Badges:**
- ⏱️ 48h Lieferung garantiert
- 👥 100+ Partner im Aufbau
- 🛡️ DSGVO-konforme Prozesse
- 💰 Faire Bezahlung & transparente Kommunikation

**Application Form Placeholder:**
- Currently shows email contact: partner@spaceseller.de
- Future: Embedded React Hook Form with fields:
  - Name, Email, Phone
  - Stadt/Region (dropdown)
  - Portfolio Link
  - Erfahrung (Jahre)
  - Kameraausrüstung
  - Drohnenlizenz (checkbox)
  - Nachricht

**Final Trust Line:** "✓ Keine versteckten Kosten · ✓ Jederzeit kündbar · ✓ Unverbindliche Bewerbung"

---

### 7. Virtual Staging (`/virtual-staging`)

**Purpose:** Virtual staging service page

#### Hero Section
**Headline:** "Verkaufen Sie leere Immobilien 40% schneller"

**Subheadline:** "Professionelle Virtual Staging – Räume digital möblieren ab nur 35€"

**CTAs:**
1. "Jetzt Raum möblieren lassen" → `/order`
2. "Beispiele ansehen" → `#gallery`

**Visual:** Before/After Slider (living room)

#### What is Virtual Staging Section
**Headline:** "Was ist Virtual Staging?"

**Description:** "Virtual Staging ist die digitale Möblierung leerer Räume. Wir verwandeln kahle Wände in einladende, wohnliche Räume – für einen Bruchteil der Kosten echter Möblierung."

**Cost Comparison:**

| Option | Cost | Timeline | Flexibility |
|--------|------|----------|-------------|
| Echte Möblierung | 3.000€ - 10.000€ | Wochen | Nur 1 Stil |
| Leer lassen | 0€ | Sofort | Wenig emotional |
| **Virtual Staging ✓** | **35€ - 250€** | **48h** | **Unbegrenzte Stile** |

#### Why Virtual Staging Section
**Stats:**
- **40%** schnellere Verkaufszeit
- **15%** höhere Verkaufspreise
- **300x** günstiger als echte Möblierung

**Benefits:**
1. **Emotionale Verbindung**
   - Käufer können sich das Leben im Raum vorstellen

2. **Kosteneffizient**
   - 35€ statt 3.000-10.000€

3. **Flexibilität**
   - Verschiedene Stile für verschiedene Zielgruppen

4. **Online-Wirkung**
   - 83% mehr Klicks auf Immobilienportalen

#### Room Types
(Component displays different room types)

#### Style Options
(Component displays different interior styles)

#### Final CTA
**Headline:** "Bereit für Virtual Staging?"

**Subheadline:** "Verwandeln Sie leere Räume in traumhafte Wohnwelten"

**CTAs:**
1. "Jetzt Raum möblieren lassen" → `/order`
2. "Kostenloses Musterbeispiel anfordern" → `/auth`

**Trust Indicators:**
- ✓ 500+ möblierte Räume
- ✓ 4.9/5 Bewertung
- ✓ Geld-zurück-Garantie

---

### 7. Floor Plans (`/grundrisse`)

**Purpose:** Floor plan creation service

#### Hero Section
**Headline:** "Professionelle 2D & 3D Grundrisse in 48 Stunden"

**Subheadline:** "Aus Ihren Skizzen oder Fotos erstellen wir perfekte Grundrisse – ab nur 45€"

**CTAs:**
1. "Jetzt Grundriss erstellen lassen" → `/order`
2. "Preise ansehen" → `#preise`

**Visual:** Before/After comparison (sketch → professional floor plan)

#### Stats & Benefits Section
**Key Stats:**
- **73%** der Käufer betrachten Grundrisse als wichtigste Information
- **2x** mehr Anfragen bei Inseraten mit Grundrissen
- **48h** Durchschnittliche Lieferzeit

**Benefits:**
1. **Pflicht in vielen Bundesländern**
   - In mehreren Bundesländern sind Grundrisse Pflicht

2. **Bessere Vermarktung**
   - Erhöhen Besichtigungen um 52%

3. **Zeitersparnis**
   - Weniger Rückfragen zur Raumaufteilung

4. **Professioneller Auftritt**
   - Zeigen Sie Kompetenz mit perfekten Unterlagen

#### What You Need Section
**Headline:** "Was Sie benötigen"

**Accepted Materials:**
- ✓ Handgezeichnete Skizzen
- ✓ Fotos aus jeder Perspektive
- ✓ Alte Baupläne oder Grundrisse
- ✓ PDF-Scans von Dokumenten
- ✓ Screenshots aus Immobilienportalen
- ✓ Selbst erstellte Zeichnungen

**Tip:** "Je mehr Informationen Sie uns geben, desto genauer wird das Ergebnis. Aber auch mit minimalen Unterlagen erstellen wir professionelle Grundrisse!"

#### Use Cases Section
**Headline:** "Perfekt für jeden Anwendungsfall"

**Use Cases:**
1. **Immobilienverkauf** - Pflicht in vielen Bundesländern
2. **Vermietung** - Reduziert Besichtigungen
3. **Renovierung & Umbau** - Planungsgrundlage
4. **Architektur-Dokumentation** - Bestandsaufnahme
5. **Immobilienexposés** - Professionelle Unterlagen
6. **Behördliche Unterlagen** - DIN-gerechte Grundrisse

#### Final CTA
**Headline:** "Bereit für professionelle Grundrisse?"

**CTAs:**
1. "Jetzt Grundriss beauftragen" → `/order`
2. "Kostenlose Beratung" → Email link

---

### 8. Order Page (`/order`)

**Purpose:** Multi-step order creation
**Auth Required:** Yes

**Steps:**
1. Service Selection
2. Image Upload
3. Briefing Details
4. Checkout & Payment

---

### 9. My Orders (`/my-orders`)

**Purpose:** Order management dashboard
**Auth Required:** Yes

**Features:**
- Order list with status badges
- Order details view
- Download completed orders

---

### 10. Settings (`/settings`)

**Purpose:** User account settings
**Auth Required:** Yes

**Settings Sections:**
- Profile information
- Password change
- Email preferences
- Account deletion

---

## 🚶 User Journeys

### Journey 1: Full-Service Photography (Munich/Augsburg)

```
Landing Page (/)
    ↓ Click "Fotograf buchen"
Munich/Augsburg Photography Page
    ↓ See portfolio, pricing, benefits
Booking Contact Section
    ↓ Call/Email/WhatsApp
[External: Sales conversation]
    ↓ Book photography session
[External: Photography shoot]
    ↓ Photos delivered
```

### Journey 2: Self-Service Image Editing

```
Landing Page (/)
    ↓ Click "Bilder jetzt bearbeiten"
Order Page (/order)
    ↓ Select service (requires auth)
Auth Page (/auth) [if not logged in]
    ↓ Sign up / Login
Order Page - Service Selection
    ↓ Choose: Editing / Virtual Staging / Floor Plans
Image Upload Step
    ↓ Upload images
Briefing Step
    ↓ Specify requirements
Checkout Step
    ↓ Review & Pay
Order Confirmation (/order/confirmation/:id)
    ↓ Order placed
[Wait for processing]
    ↓ Receive notification
My Orders (/my-orders)
    ↓ Download completed work
```

### Journey 3: B2B White-label Service

```
Landing Page (/) or Navigation
    ↓ Navigate to "Whitelabel für Fotografen"
White-label Page (/immobilienfotograf-whitelabel)
    ↓ See pricing, comparison table
Free Trial Section
    ↓ Click "3 Bilder gratis bearbeiten lassen"
Order Page (/order)
    ↓ Upload 3 test images
[Trial processing]
    ↓ Receive results
[Decision to continue]
    ↓ Set up regular service
[Ongoing partnership]
```

### Journey 4: Service Discovery

```
Landing Page (/)
    ↓ Scroll to Services Section
Service Card (e.g., Virtual Staging)
    ↓ Click "Mehr erfahren"
Service Detail Page (/virtual-staging)
    ↓ Browse gallery, read benefits
Final CTA
    ↓ Click "Jetzt Raum möblieren lassen"
Order Page (/order)
    ↓ [Continue with Journey 2]
```

---

## 🔗 CTA Buttons & Links Map

### Primary CTAs (Main Conversion Actions)

| Button Text | Appears On | Links To | Purpose |
|-------------|-----------|----------|---------|
| "Fotograf buchen" | Homepage Hero | `/immobilienfotografie-muenchen` | Photography booking |
| "Bilder jetzt bearbeiten" | Homepage Hero | `/order` | Image editing order |
| "Mehr erfahren" | Service Cards | Service pages | Learn about service |
| "Jetzt Raum möblieren lassen" | Virtual Staging | `/order` | Start virtual staging |
| "Jetzt Grundriss erstellen lassen" | Floor Plans | `/order` | Start floor plan |
| "Fotograf anfragen" | Final CTA | Contact/Phone | Photography inquiry |
| "Bilder hochladen & 20% sparen" | Final CTA | `/order` | Upload images with discount |
| "Gratis Testbearbeitung" | White-label | `/order` | Free trial for photographers |
| "Mengenpreise ansehen" | White-label | Pricing section | View bulk pricing |
| "Jetzt 3 Bilder gratis bearbeiten" | White-label Trial | `/order` | Free 3-image trial |

### Secondary CTAs

| Button Text | Appears On | Links To | Purpose |
|-------------|-----------|----------|---------|
| "Preise ansehen" | Various pages | `#preise` anchor | Jump to pricing |
| "Beispiele ansehen" | Virtual Staging | `#gallery` anchor | View portfolio |
| "Kostenlose Beratung" | Floor Plans | `mailto:` link | Email consultation |
| "Kostenloses Musterbeispiel" | Virtual Staging | `/auth` | Request free sample |

### Navigation Links

| Link Text | Links To | Category |
|-----------|----------|----------|
| "Grundrisse" | `/grundrisse` | Service Nav |
| "Virtual Staging" | `/virtual-staging` | Service Nav |
| "Immobilienfotografie" | `/Immobilienmakler` | Service Nav |
| "Immobilienfotografie München" | `/immobilienfotografie-muenchen` | Location Nav |
| "Immobilienfotografie Augsburg" | `/immobilienfotografie-augsburg` | Location Nav |
| "Whitelabel für Fotografen" | `/immobilienfotograf-whitelabel` | Location Nav |
| "Für Makler" | `/Immobilienmakler` | Direct Nav |

### Account Actions

| Action | Appears When | Links To / Action |
|--------|-------------|-------------------|
| "Anmelden" | Not logged in | `/auth` |
| "Bilder hochladen" (Header) | Always | `/order` |
| "Meine Bestellungen" | Logged in | `/my-orders` |
| "Einstellungen" | Logged in | `/settings` |
| "Abmelden" | Logged in | Logout action |

### Footer Links

| Section | Links |
|---------|-------|
| Services | Basis-Retusche, Premium-Retusche, Virtual Staging, Drohnenaufnahmen |
| Company | Über uns, Portfolio, Kontakt, Karriere |
| Legal | Impressum (`/impressum`), Datenschutz (`/datenschutz`), AGB (`/agb`), Widerrufsrecht (`/agb#widerruf`) |

---

## 🧩 Reusable Components

### Layout Components

1. **Header**
   - Logo (links to `/`)
   - Desktop Navigation (DesktopNav)
   - Mobile Navigation (MobileNav)
   - User Menu
   - CTA Button

2. **Footer**
   - Company Info
   - Services Links
   - Company Links
   - Legal Links
   - Copyright Notice

3. **TrustBanner**
   - Top sticky banner with trust message
   - Dismissible

### Content Components

4. **Hero** (Homepage-specific)
   - Dual-path choice blocks
   - Before/After slider
   - Social proof
   - Dual CTAs

5. **BeforeAfterSlider**
   - Interactive slider component
   - Used across multiple pages
   - Props: `beforeImage`, `afterImage`, `beforeAlt`, `afterAlt`

6. **Services**
   - Service cards grid
   - Features list
   - Pricing
   - CTAs

7. **ClientLogos**
   - Trusted by section
   - Grid of client names/logos

8. **ProcessSteps**
   - Step-by-step process visualization
   - Used on multiple pages

9. **TestimonialCarousel**
   - Rotating customer testimonials
   - Star ratings
   - Auto-advance with manual controls

10. **TrustBadges**
    - Small trust indicators
    - Badges: "48h Lieferung", "Geld-zurück-Garantie", "100% Zufriedenheit"

11. **FinalCTA**
    - Full-width CTA section
    - Background image with overlay
    - Dual CTA buttons
    - Trust elements

12. **FAQ**
    - Accordion-style FAQ
    - Different content per page

13. **Portfolio / Gallery**
    - Image galleries
    - Page-specific variations

14. **Pricing Tables**
    - Service pricing display
    - Comparison tables
    - Package options

15. **StatsCounter**
    - Animated number counter
    - Used for statistics display

### Specialized Components

16. **VirtualStagingRooms**
    - Room type selector
    - Used on Virtual Staging page

17. **VirtualStagingStyles**
    - Interior style showcase
    - Style options display

18. **FloorPlanTypes**
    - Floor plan type selector
    - 2D/3D options

19. **OrderStepper**
    - Multi-step order form
    - Progress indicator

20. **OrderStatusBadge**
    - Visual order status indicator
    - Used in My Orders

### Location-Specific Components

21. **MunichHero** / **AugsburgHero**
    - Location-specific hero sections
    - Local messaging

22. **ServiceAreaList**
    - List of covered service areas
    - Maps/locations

23. **MunichPhotographyServices** / **AugsburgPhotographyServices**
    - Location-specific service offerings

24. **MunichPortfolio** / **AugsburgPortfolio**
    - Location-specific portfolio galleries

25. **BeforeAfterShowcase**
    - Multiple before/after comparisons
    - Used on Munich page

---

## 📊 Key Metrics & Social Proof

### Homepage Stats
- ⭐ 4.9/5 Sterne
- 500+ zufriedene Makler
- 10.000+ bearbeitete Bilder

### Munich Page Stats
- 300+ München Immobilien (schneller verkauft)
- 150+ Makler vertrauen uns
- 24h Lieferung garantiert
- 12 Tage schnellerer Verkauf

### Augsburg Page Stats
- 200+ Objekte in Augsburg fotografiert

### White-label Page Stats
- 30.000+ Immobilienfotos bearbeitet
- 150+ Fotografen vertrauen uns
- 48h Standard-Lieferung
- 24h Express verfügbar

### Virtual Staging Stats
- 40% schnellere Verkaufszeit
- 15% höhere Verkaufspreise
- 300x günstiger als echte Möblierung
- 83% mehr Klicks auf Portalen
- 500+ möblierte Räume

### Floor Plans Stats
- 73% der Käufer betrachten Grundrisse als wichtigste Info
- 2x mehr Anfragen mit Grundrissen
- 52% mehr Besichtigungen

---

## 🎨 Design System & Brand Elements

### Color Tokens (from design system)
- Primary (main brand color)
- Accent
- Foreground / Background
- Muted / Muted-foreground
- Border
- Primary-foreground / Accent-foreground

### Typography
- Font Family: Gilroy (multiple weights)
- Heading scales: text-3xl to text-6xl
- Body text: text-lg, text-xl
- Small text: text-sm

### Button Variants
- `hero` - Primary hero CTA
- `cta` - Call to action
- `outline` - Secondary action
- `default` - Standard button
- `ghost` - Minimal button

### Visual Elements
- Gradients: `bg-gradient-subtle`, `bg-gradient-hero`, `bg-gradient-accent`
- Shadows: `shadow-elegant`, `shadow-glow`
- Animations: `animate-fade-in`, `animate-fade-in-up`, `animate-scale-in`

---

## 📱 Responsive Behavior

### Breakpoints
- Mobile: < 768px
- Tablet: 768px - 1023px
- Desktop: ≥ 1024px

### Mobile-Specific Features
- Hamburger menu (Sheet component)
- Accordion navigation
- Stacked layouts
- Touch-optimized CTAs

### Desktop-Specific Features
- Mega menu navigation
- Side-by-side layouts
- Hover effects
- Larger imagery

---

## 🔒 Authentication Flow

### Guest User
- Can browse all public pages
- Cannot place orders
- Redirected to `/auth` when trying to order

### Authenticated User
- Full access to all features
- Can place orders
- Access to My Orders
- Access to Settings
- Can logout

### First-Time User
- After signup → Redirected to `/onboarding`
- After onboarding → Can start ordering

---

## 🎯 Conversion Optimization Elements

### Trust Indicators
- Client logos
- Star ratings
- Customer testimonials
- Money-back guarantee
- Delivery time guarantees
- Stats and numbers

### Urgency Triggers
- "⚡ Nur noch 3 Termine diese Woche verfügbar" (Munich page)
- "24h Express-Service"
- "Noch heute online"

### Value Propositions
- Cost comparisons (Virtual Staging: 300x cheaper)
- Time savings (40% faster sales)
- Price increases (15% higher prices)
- Quality guarantees

### Risk Reversal
- Geld-zurück-Garantie (Money-back guarantee)
- Kostenlose Nachbesserung (Free revisions)
- 3 Bilder gratis (Free 3-image trial for photographers)
- Keine Verpflichtung (No commitment)

---

## 📈 Business Model

### Revenue Streams

1. **Photography Services** (Local)
   - Munich photography bookings
   - Augsburg photography bookings
   - On-site shooting with editing
   - Starting at 199€/shooting

2. **Image Editing** (Self-Service)
   - Basic retouching: from 8€/image
   - Premium retouching
   - Sky replacement, object removal, etc.

3. **Virtual Staging**
   - From 35€/room
   - Multiple style options
   - Unlimited revisions

4. **Floor Plans**
   - From 45€/floor plan
   - 2D and 3D options
   - Furnished variations

5. **White-label Service** (B2B)
   - From 6€/image for bulk orders
   - Aimed at professional photographers
   - White-label (no branding)

### Customer Segments

1. **Real Estate Brokers (Immobilienmakler)**
   - Primary target audience
   - Need professional images for listings
   - Value speed and quality

2. **Property Owners**
   - Selling own properties
   - Need professional marketing materials

3. **Professional Photographers**
   - Need white-label editing services
   - Want to scale without hiring

4. **Property Developers**
   - Marketing new developments
   - Need high-quality visuals

---

## 🚀 Technical Notes

### Routing
- React Router v6
- Client-side routing
- Protected routes for authenticated pages

### State Management
- React Context (BannerContext)
- React Query for data fetching
- Local state with useState

### Authentication
- Supabase Auth
- Protected Route wrapper component
- Automatic redirect to `/auth` when needed

### Form Handling
- Multi-step order form
- React Hook Form
- File upload with Supabase Storage

---

## 📝 Content Strategy

### Tone of Voice
- Professional yet approachable
- Benefit-focused
- Direct and clear
- Trust-building

### Key Messaging
- Speed: "24h Express", "48h Lieferung"
- Quality: "Professionell", "Premium"
- Trust: "Garantie", "500+ Makler"
- Value: Cost comparisons, ROI stats

### SEO Keywords
- Immobilienfotografie München
- Immobilienfotografie Augsburg
- Virtual Staging
- Grundrisse erstellen
- Bildbearbeitung Immobilien
- Immobilienfotograf

---

## 🔄 Future Considerations

### Potential Additions
- Online portfolio builder
- Real-time order tracking
- In-app messaging
- Referral program
- Subscription plans
- API for integrations

### Scaling Opportunities
- Expand to more cities
- Add more service types
- Enterprise plans
- White-label platform
- Photographer marketplace

---

**Document Version:** 1.0  
**Last Updated:** 2025-11-09  
**Author:** AI Agent  
**Project:** spaceseller Website

---

*This document serves as the comprehensive blueprint for the spaceseller website, covering architecture, copywriting, navigation, and user journeys. Use it as reference for marketing, development, and content strategy.*

import { Database } from '@/integrations/supabase/types';

type Profile = Database['public']['Tables']['profiles']['Row'];

export interface MissingField {
  field: string;
  label: string;
  section: string;
}

export interface ProfileCompletenessResult {
  isComplete: boolean;
  missingFields: MissingField[];
  completionPercentage: number;
}

/**
 * Service for checking photographer profile completeness
 */
export class ProfileCompletenessService {
  private static readonly REQUIRED_FIELDS: MissingField[] = [
    { field: 'vorname', label: 'Vorname', section: 'Persönliche Daten' },
    { field: 'nachname', label: 'Nachname', section: 'Persönliche Daten' },
    { field: 'telefon', label: 'Telefon', section: 'Persönliche Daten' },
    { field: 'strasse', label: 'Straße', section: 'Standort & Radius' },
    { field: 'plz', label: 'PLZ', section: 'Standort & Radius' },
    { field: 'stadt', label: 'Stadt', section: 'Standort & Radius' },
    { field: 'location_lat', label: 'Standort Koordinaten', section: 'Standort & Radius' },
    { field: 'location_lng', label: 'Standort Koordinaten', section: 'Standort & Radius' },
    { field: 'service_radius_km', label: 'Serviceradius', section: 'Standort & Radius' },
    { field: 'tax_status', label: 'Steuerstatus', section: 'Geschäftsdaten & Steuern' },
    { field: 'iban', label: 'IBAN', section: 'Bankverbindung' },
    { field: 'kontoinhaber', label: 'Kontoinhaber', section: 'Bankverbindung' },
    { field: 'berufshaftpflicht_bis', label: 'Berufshaftpflichtversicherung', section: 'Qualifikation' },
  ];

  /**
   * Check if a photographer profile is complete
   */
  static checkProfile(profile: Profile | null): ProfileCompletenessResult {
    if (!profile) {
      return {
        isComplete: false,
        missingFields: this.REQUIRED_FIELDS,
        completionPercentage: 0,
      };
    }

    const missingFields: MissingField[] = [];

    // Check basic personal info
    if (!profile.vorname || profile.vorname.trim() === '') {
      missingFields.push(this.REQUIRED_FIELDS[0]);
    }
    if (!profile.nachname || profile.nachname.trim() === '') {
      missingFields.push(this.REQUIRED_FIELDS[1]);
    }
    if (!profile.telefon || profile.telefon.trim() === '') {
      missingFields.push(this.REQUIRED_FIELDS[2]);
    }

    // Check address
    if (!profile.strasse || profile.strasse.trim() === '') {
      missingFields.push(this.REQUIRED_FIELDS[3]);
    }
    if (!profile.plz || profile.plz.trim() === '') {
      missingFields.push(this.REQUIRED_FIELDS[4]);
    }
    if (!profile.stadt || profile.stadt.trim() === '') {
      missingFields.push(this.REQUIRED_FIELDS[5]);
    }

    // Check location coordinates
    if (!profile.location_lat || !profile.location_lng) {
      missingFields.push(this.REQUIRED_FIELDS[6]);
    }

    // Check service radius
    if (!profile.service_radius_km || profile.service_radius_km <= 0) {
      missingFields.push(this.REQUIRED_FIELDS[8]);
    }

    // Check tax status: Kleinunternehmer OR (VAT liable with tax number)
    const taxStatusValid = 
      profile.kleinunternehmer === true ||
      (
        profile.umsatzsteuer_pflichtig === true &&
        (
          (profile.steuernummer && profile.steuernummer.trim() !== '') ||
          (profile.umsatzsteuer_id && profile.umsatzsteuer_id.trim() !== '')
        )
      );
    
    if (!taxStatusValid) {
      missingFields.push(this.REQUIRED_FIELDS[9]);
    }

    // Check banking
    if (!profile.iban || profile.iban.trim() === '') {
      missingFields.push(this.REQUIRED_FIELDS[10]);
    }
    if (!profile.kontoinhaber || profile.kontoinhaber.trim() === '') {
      missingFields.push(this.REQUIRED_FIELDS[11]);
    }

    // Check professional liability insurance
    if (!profile.berufshaftpflicht_bis) {
      missingFields.push(this.REQUIRED_FIELDS[12]);
    }

    const completionPercentage = Math.round(
      ((this.REQUIRED_FIELDS.length - missingFields.length) / this.REQUIRED_FIELDS.length) * 100
    );

    return {
      isComplete: missingFields.length === 0,
      missingFields,
      completionPercentage,
    };
  }

  /**
   * Get a user-friendly description of missing fields
   */
  static getMissingFieldsDescription(missingFields: MissingField[]): string {
    if (missingFields.length === 0) {
      return 'Ihr Profil ist vollständig.';
    }

    const sections = new Map<string, string[]>();
    missingFields.forEach(field => {
      if (!sections.has(field.section)) {
        sections.set(field.section, []);
      }
      sections.get(field.section)!.push(field.label);
    });

    const parts: string[] = [];
    sections.forEach((labels, section) => {
      parts.push(`${section}: ${labels.join(', ')}`);
    });

    return parts.join(' • ');
  }

  /**
   * Group missing fields by section
   */
  static groupMissingFieldsBySection(missingFields: MissingField[]): Map<string, string[]> {
    const sections = new Map<string, string[]>();
    missingFields.forEach(field => {
      if (!sections.has(field.section)) {
        sections.set(field.section, []);
      }
      sections.get(field.section)!.push(field.label);
    });
    return sections;
  }
}

export const profileCompletenessService = ProfileCompletenessService;

import { z } from 'zod';

/**
 * German IBAN validation (DE + 20 digits)
 */
const germanIBANRegex = /^DE\d{20}$/;

/**
 * German VAT ID validation (DE + 9 digits)
 */
const germanVATRegex = /^DE\d{9}$/;

/**
 * Validation schema for creating a new photographer
 */
export const createPhotographerSchema = z.object({
  email: z.string()
    .email('Ungültige E-Mail-Adresse')
    .max(255, 'E-Mail zu lang'),
  vorname: z.string()
    .min(1, 'Vorname ist erforderlich')
    .max(100, 'Vorname zu lang'),
  nachname: z.string()
    .min(1, 'Nachname ist erforderlich')
    .max(100, 'Nachname zu lang'),
  telefon: z.string()
    .max(50, 'Telefon zu lang')
    .optional(),
  strasse: z.string()
    .max(255, 'Straße zu lang')
    .optional(),
  plz: z.string()
    .max(20, 'PLZ zu lang')
    .optional(),
  stadt: z.string()
    .max(100, 'Stadt zu lang')
    .optional(),
  land: z.string()
    .min(1, 'Land ist erforderlich')
    .max(100, 'Land zu lang'),
  service_radius_km: z.number()
    .min(10, 'Mindestens 10 km')
    .max(200, 'Maximal 200 km')
});

/**
 * Validation schema for editing photographer information
 * (no email change allowed)
 */
export const editPhotographerSchema = z.object({
  vorname: z.string()
    .min(1, 'Vorname ist erforderlich')
    .max(100, 'Vorname zu lang'),
  nachname: z.string()
    .min(1, 'Nachname ist erforderlich')
    .max(100, 'Nachname zu lang'),
  telefon: z.string()
    .max(50, 'Telefon zu lang')
    .optional(),
  strasse: z.string()
    .max(255, 'Straße zu lang')
    .optional(),
  plz: z.string()
    .max(20, 'PLZ zu lang')
    .optional(),
  stadt: z.string()
    .max(100, 'Stadt zu lang')
    .optional(),
  land: z.string()
    .min(1, 'Land ist erforderlich')
    .max(100, 'Land zu lang'),
  service_radius_km: z.number()
    .min(10, 'Mindestens 10 km')
    .max(200, 'Maximal 200 km')
});

/**
 * Validation schema for photographer settings (extended profile fields)
 */
export const photographerSettingsSchema = z.object({
  // Personal Information
  vorname: z.string().min(1, 'Vorname erforderlich').max(100),
  nachname: z.string().min(1, 'Nachname erforderlich').max(100),
  telefon: z.string().max(50).optional(),
  
  // Address
  strasse: z.string().max(255).optional(),
  plz: z.string().max(20).optional(),
  stadt: z.string().max(100).optional(),
  land: z.string().max(100).default('Deutschland'),
  service_radius_km: z.number().min(10).max(200),
  
  // Tax & Business Information
  rechtsform: z.enum(['einzelunternehmen', 'gbr', 'ug', 'gmbh', 'freiberufler']).optional(),
  umsatzsteuer_pflichtig: z.boolean().default(false),
  umsatzsteuer_id: z.string()
    .regex(germanVATRegex, 'Ungültige USt-IdNr. (Format: DE123456789)')
    .optional()
    .or(z.literal('')),
  steuernummer: z.string().max(50).optional(),
  kleinunternehmer: z.boolean().default(false),
  handelsregister_nr: z.string().max(50).optional(),
  
  // Banking
  iban: z.string()
    .regex(germanIBANRegex, 'Ungültige IBAN (Format: DE + 20 Ziffern)')
    .optional()
    .or(z.literal('')),
  bic: z.string().max(11).optional(),
  kontoinhaber: z.string().max(100).optional(),
  
  // Professional
  berufshaftpflicht_bis: z.string().optional(), // date as ISO string
  equipment: z.string().optional(),
  portfolio_url: z.string().url('Ungültige URL').optional().or(z.literal('')),
}).refine(
  (data) => {
    // If VAT liable, require VAT ID
    if (data.umsatzsteuer_pflichtig && !data.umsatzsteuer_id) {
      return false;
    }
    return true;
  },
  {
    message: 'USt-IdNr. ist erforderlich wenn umsatzsteuerpflichtig',
    path: ['umsatzsteuer_id'],
  }
);

export type CreatePhotographerInput = z.infer<typeof createPhotographerSchema>;
export type EditPhotographerInput = z.infer<typeof editPhotographerSchema>;
export type PhotographerSettingsInput = z.infer<typeof photographerSettingsSchema>;

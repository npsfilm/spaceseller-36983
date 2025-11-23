import { z } from 'zod';

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

export type CreatePhotographerInput = z.infer<typeof createPhotographerSchema>;
export type EditPhotographerInput = z.infer<typeof editPhotographerSchema>;

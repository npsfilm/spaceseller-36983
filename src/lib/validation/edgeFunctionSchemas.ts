import { z } from 'zod';

/**
 * Validation schemas for edge function request bodies
 * Ensures runtime type safety for all incoming requests
 */

// Password Reset Schemas
export const requestPasswordResetSchema = z.object({
  email: z.string()
    .email('Ungültige E-Mail-Adresse')
    .max(255, 'E-Mail zu lang')
});

export const resetPasswordSchema = z.object({
  token: z.string()
    .min(1, 'Token erforderlich')
    .max(500, 'Token ungültig'),
  newPassword: z.string()
    .min(8, 'Passwort muss mindestens 8 Zeichen lang sein')
    .max(100, 'Passwort zu lang')
    .regex(/[A-Z]/, 'Passwort muss mindestens einen Großbuchstaben enthalten')
    .regex(/[a-z]/, 'Passwort muss mindestens einen Kleinbuchstaben enthalten')
    .regex(/[0-9]/, 'Passwort muss mindestens eine Zahl enthalten')
    .regex(/[^A-Za-z0-9]/, 'Passwort muss mindestens ein Sonderzeichen enthalten')
});

export const sendPasswordResetSchema = z.object({
  email: z.string()
    .email('Ungültige E-Mail-Adresse')
    .max(255, 'E-Mail zu lang'),
  token: z.string()
    .min(1, 'Token erforderlich')
    .max(500, 'Token ungültig'),
  firstName: z.string()
    .min(1, 'Vorname erforderlich')
    .max(100, 'Vorname zu lang')
});

// Geocoding Schema
export const geocodeAddressSchema = z.object({
  address: z.string()
    .min(1, 'Adresse erforderlich')
    .max(500, 'Adresse zu lang'),
  city: z.string()
    .min(1, 'Stadt erforderlich')
    .max(100, 'Stadt zu lang'),
  postal_code: z.string()
    .min(1, 'PLZ erforderlich')
    .max(20, 'PLZ zu lang'),
  country: z.string()
    .max(100, 'Land zu lang')
    .optional()
    .default('Deutschland')
});

// Photographer Management Schemas
export const createPhotographerSchema = z.object({
  email: z.string()
    .email('Ungültige E-Mail-Adresse')
    .max(255, 'E-Mail zu lang'),
  vorname: z.string()
    .min(1, 'Vorname erforderlich')
    .max(100, 'Vorname zu lang'),
  nachname: z.string()
    .min(1, 'Nachname erforderlich')
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
    .max(100, 'Land zu lang')
    .default('Deutschland'),
  service_radius_km: z.number()
    .min(10, 'Mindestradius: 10 km')
    .max(200, 'Maximalradius: 200 km')
    .optional()
    .default(50)
});

export const findAvailablePhotographersSchema = z.object({
  latitude: z.number()
    .min(-90, 'Breitengrad ungültig')
    .max(90, 'Breitengrad ungültig'),
  longitude: z.number()
    .min(-180, 'Längengrad ungültig')
    .max(180, 'Längengrad ungültig'),
  scheduled_date: z.string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Datum muss Format YYYY-MM-DD haben')
    .optional(),
  max_distance_km: z.number()
    .min(1, 'Mindestdistanz: 1 km')
    .max(500, 'Maximaldistanz: 500 km')
    .optional()
    .default(150)
});

// Zapier Webhook Schema
export const triggerZapierWebhookSchema = z.object({
  assignmentData: z.object({
    order_id: z.string().uuid('Ungültige Order ID'),
    photographer_id: z.string().uuid('Ungültige Photographer ID'),
    assignment_id: z.string().uuid('Ungültige Assignment ID'),
    scheduled_date: z.string().optional(),
    scheduled_time: z.string().optional()
  }).catchall(z.unknown()) // Allow additional properties
});

// File Upload Validation Schema
export const validateFileUploadSchema = z.object({
  fileName: z.string()
    .min(1, 'Dateiname erforderlich')
    .max(255, 'Dateiname zu lang')
    .regex(/^[^<>:"/\\|?*]+$/, 'Dateiname enthält ungültige Zeichen'),
  fileSize: z.number()
    .min(1, 'Dateigröße muss größer als 0 sein')
    .max(52428800, 'Dateigröße darf 50MB nicht überschreiten'),
  fileType: z.string()
    .min(1, 'Dateityp erforderlich')
    .max(100, 'Dateityp zu lang')
});

// Type exports
export type RequestPasswordResetInput = z.infer<typeof requestPasswordResetSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
export type SendPasswordResetInput = z.infer<typeof sendPasswordResetSchema>;
export type GeocodeAddressInput = z.infer<typeof geocodeAddressSchema>;
export type CreatePhotographerInput = z.infer<typeof createPhotographerSchema>;
export type FindAvailablePhotographersInput = z.infer<typeof findAvailablePhotographersSchema>;
export type TriggerZapierWebhookInput = z.infer<typeof triggerZapierWebhookSchema>;
export type ValidateFileUploadInput = z.infer<typeof validateFileUploadSchema>;

import { z } from 'https://deno.land/x/zod@v3.22.4/mod.ts';

/**
 * Schema for exporting user data request
 */
export const exportUserDataSchema = z.object({
  userId: z.string().uuid('Invalid user ID format')
});

/**
 * Schema for deleting user account request
 */
export const deleteAccountSchema = z.object({
  userId: z.string().uuid('Invalid user ID format'),
  confirmation: z.literal('DELETE', {
    errorMap: () => ({ message: 'Confirmation text must be exactly "DELETE"' })
  })
});

/**
 * Schema for updating user consent
 */
export const updateConsentSchema = z.object({
  userId: z.string().uuid('Invalid user ID'),
  consentType: z.enum(['marketing', 'analytics', 'third_party'], {
    errorMap: () => ({ message: 'Invalid consent type' })
  }),
  granted: z.boolean(),
  ipAddress: z.string().optional(),
  userAgent: z.string().optional()
});

export type ExportUserDataRequest = z.infer<typeof exportUserDataSchema>;
export type DeleteAccountRequest = z.infer<typeof deleteAccountSchema>;
export type UpdateConsentRequest = z.infer<typeof updateConsentSchema>;

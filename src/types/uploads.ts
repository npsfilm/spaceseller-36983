import { z } from 'zod';

/**
 * Database schema for order uploads
 */
export interface OrderUpload {
  id: string;
  order_id: string;
  user_id: string;
  file_path: string;
  file_name: string;
  file_size: number;
  file_type: string;
  uploaded_at: string | null;
  publicUrl?: string;
}

/**
 * Database schema for order deliverables
 */
export interface OrderDeliverable {
  id: string;
  order_id: string;
  file_path: string;
  file_name: string;
  delivered_at: string | null;
  publicUrl?: string;
}

/**
 * Zod schema for upload file validation
 */
export const uploadFileSchema = z.object({
  fileName: z.string()
    .min(1, 'Dateiname ist erforderlich')
    .max(255, 'Dateiname zu lang')
    .refine(
      (name) => !name.includes('..') && !name.includes('/') && !name.includes('\\'),
      'Ungültiger Dateiname'
    ),
  fileSize: z.number()
    .positive('Dateigröße muss positiv sein')
    .max(52428800, 'Dateigröße überschreitet 50MB Limit'),
  fileType: z.enum([
    'image/jpeg',
    'image/png',
    'image/tiff',
    'image/x-canon-cr2',
    'image/x-nikon-nef'
  ], {
    errorMap: () => ({ message: 'Dateityp nicht erlaubt. Erlaubt: JPG, PNG, TIFF, RAW' })
  })
});

export type UploadFileValidation = z.infer<typeof uploadFileSchema>;

/**
 * Validation result from file upload edge function
 */
export interface FileValidationResult {
  valid: boolean;
  errors?: string[];
  message?: string;
}

/**
 * Error types for file upload
 */
export class FileUploadError extends Error {
  constructor(
    message: string,
    public readonly code: 'VALIDATION_FAILED' | 'UPLOAD_FAILED' | 'DB_INSERT_FAILED',
    public readonly details?: unknown
  ) {
    super(message);
    this.name = 'FileUploadError';
  }
}

import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ValidationRequest {
  fileName: string;
  fileSize: number;
  fileType: string;
}

const ALLOWED_TYPES = [
  'image/jpeg',
  'image/png',
  'image/tiff',
  'image/x-canon-cr2',
  'image/x-nikon-nef'
];

const MAX_FILE_SIZE = 52428800; // 50MB

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { fileName, fileSize, fileType }: ValidationRequest = await req.json();

    const errors: string[] = [];

    // Validate file size
    if (fileSize > MAX_FILE_SIZE) {
      errors.push(`Dateigröße überschreitet das 50MB Limit (${(fileSize / 1024 / 1024).toFixed(2)}MB)`);
    }

    // Validate file type
    if (!ALLOWED_TYPES.includes(fileType)) {
      errors.push(`Dateityp nicht erlaubt: ${fileType}. Erlaubt: JPG, PNG, TIFF, RAW`);
    }

    // Validate file extension
    const ext = fileName.split('.').pop()?.toLowerCase();
    const allowedExtensions = ['jpg', 'jpeg', 'png', 'tiff', 'tif', 'cr2', 'nef'];
    if (!ext || !allowedExtensions.includes(ext)) {
      errors.push(`Dateiendung nicht erlaubt: ${ext}`);
    }

    // Check for suspicious file names (path traversal attempt)
    if (fileName.includes('..') || fileName.includes('/') || fileName.includes('\\')) {
      errors.push('Ungültiger Dateiname');
    }

    if (errors.length > 0) {
      return new Response(
        JSON.stringify({ valid: false, errors }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    return new Response(
      JSON.stringify({ valid: true, message: 'Dateivalidierung erfolgreich' }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unbekannter Fehler';
    const errorName = error instanceof Error ? error.name : 'UnknownError';
    
    return new Response(
      JSON.stringify({ 
        error: "Validierung fehlgeschlagen", 
        details: errorMessage,
        type: errorName
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);

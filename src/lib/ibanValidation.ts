/**
 * IBAN Validation Utility
 * Validates International Bank Account Numbers according to ISO 13616
 */

// Country-specific IBAN lengths
const IBAN_LENGTHS: Record<string, number> = {
  DE: 22, // Germany
  AT: 20, // Austria
  CH: 21, // Switzerland
  FR: 27, // France
  IT: 27, // Italy
  ES: 24, // Spain
  NL: 18, // Netherlands
  BE: 16, // Belgium
  LU: 20, // Luxembourg
  PL: 28, // Poland
  CZ: 24, // Czech Republic
  GB: 22, // United Kingdom
};

/**
 * Removes spaces and converts to uppercase
 */
export const formatIBAN = (iban: string): string => {
  return iban.replace(/\s/g, '').toUpperCase();
};

/**
 * Formats IBAN with spaces every 4 characters for display
 */
export const formatIBANForDisplay = (iban: string): string => {
  const cleaned = formatIBAN(iban);
  return cleaned.replace(/(.{4})/g, '$1 ').trim();
};

/**
 * Validates IBAN using MOD 97 algorithm (ISO 7064)
 */
export const validateIBAN = (iban: string): { isValid: boolean; error?: string } => {
  // Remove spaces and convert to uppercase
  const cleaned = formatIBAN(iban);
  
  // Check minimum length
  if (cleaned.length < 15) {
    return { isValid: false, error: 'IBAN ist zu kurz' };
  }
  
  // Check maximum length
  if (cleaned.length > 34) {
    return { isValid: false, error: 'IBAN ist zu lang' };
  }
  
  // Check format: 2 letters + 2 digits + alphanumeric
  if (!/^[A-Z]{2}[0-9]{2}[A-Z0-9]+$/.test(cleaned)) {
    return { isValid: false, error: 'Ungültiges IBAN-Format' };
  }
  
  // Extract country code
  const countryCode = cleaned.substring(0, 2);
  
  // Check country-specific length if known
  const expectedLength = IBAN_LENGTHS[countryCode];
  if (expectedLength && cleaned.length !== expectedLength) {
    return { 
      isValid: false, 
      error: `${countryCode}-IBAN muss ${expectedLength} Zeichen haben` 
    };
  }
  
  // MOD 97 validation (ISO 7064)
  // Move first 4 characters to end
  const rearranged = cleaned.substring(4) + cleaned.substring(0, 4);
  
  // Convert letters to numbers (A=10, B=11, ..., Z=35)
  let numericString = '';
  for (const char of rearranged) {
    if (/[A-Z]/.test(char)) {
      numericString += (char.charCodeAt(0) - 55).toString();
    } else {
      numericString += char;
    }
  }
  
  // Calculate MOD 97 using chunks (JavaScript can't handle such large numbers)
  let remainder = 0;
  for (let i = 0; i < numericString.length; i += 7) {
    const chunk = remainder.toString() + numericString.substring(i, i + 7);
    remainder = parseInt(chunk, 10) % 97;
  }
  
  if (remainder !== 1) {
    return { isValid: false, error: 'Ungültige IBAN-Prüfziffer' };
  }
  
  return { isValid: true };
};

/**
 * Zod refinement function for IBAN validation
 */
export const ibanRefinement = (iban: string): boolean => {
  if (!iban || iban.trim() === '') return false;
  return validateIBAN(iban).isValid;
};

/**
 * Get IBAN validation error message
 */
export const getIBANErrorMessage = (iban: string): string => {
  const result = validateIBAN(iban);
  return result.error || 'Ungültige IBAN';
};

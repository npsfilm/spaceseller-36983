// Common email typos and their corrections
const emailDomainSuggestions: Record<string, string> = {
  'gmial.com': 'gmail.com',
  'gmai.com': 'gmail.com',
  'gmil.com': 'gmail.com',
  'yahooo.com': 'yahoo.com',
  'yaho.com': 'yahoo.com',
  'hotmial.com': 'hotmail.com',
  'hotmai.com': 'hotmail.com',
  'outloo.com': 'outlook.com',
  'outlok.com': 'outlook.com',
};

export function suggestEmailCorrection(email: string): string | null {
  const parts = email.split('@');
  if (parts.length !== 2) return null;

  const domain = parts[1].toLowerCase();
  const suggestion = emailDomainSuggestions[domain];

  if (suggestion) {
    return `${parts[0]}@${suggestion}`;
  }

  return null;
}

export function validateEmail(email: string): {
  isValid: boolean;
  suggestion?: string;
  error?: string;
} {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  if (!email) {
    return { isValid: false, error: 'E-Mail-Adresse erforderlich' };
  }

  if (!emailRegex.test(email)) {
    return { isValid: false, error: 'Ungültige E-Mail-Adresse' };
  }

  const suggestion = suggestEmailCorrection(email);
  if (suggestion) {
    return { 
      isValid: true, 
      suggestion,
    };
  }

  return { isValid: true };
}

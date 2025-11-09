import { zxcvbn, zxcvbnOptions } from '@zxcvbn-ts/core';
import * as zxcvbnCommonPackage from '@zxcvbn-ts/language-common';

// Initialize zxcvbn with common dictionary
const options = {
  dictionary: {
    ...zxcvbnCommonPackage.dictionary,
  },
  graphs: zxcvbnCommonPackage.adjacencyGraphs,
};
zxcvbnOptions.setOptions(options);

export type PasswordStrength = 'very-weak' | 'weak' | 'medium' | 'strong';

export interface PasswordValidationResult {
  strength: PasswordStrength;
  score: number; // 0-4 from zxcvbn
  feedback: string[];
  crackTime: string;
  isCommon: boolean;
}

function formatCrackTime(seconds: number): string {
  if (seconds < 1) return 'sofort';
  if (seconds < 60) return `${Math.round(seconds)} Sekunden`;
  if (seconds < 3600) return `${Math.round(seconds / 60)} Minuten`;
  if (seconds < 86400) return `${Math.round(seconds / 3600)} Stunden`;
  if (seconds < 2592000) return `${Math.round(seconds / 86400)} Tage`;
  if (seconds < 31536000) return `${Math.round(seconds / 2592000)} Monate`;
  return `${Math.round(seconds / 31536000)} Jahre`;
}

export function validatePassword(password: string): PasswordValidationResult {
  if (!password) {
    return {
      strength: 'very-weak',
      score: 0,
      feedback: ['Geben Sie ein Passwort ein'],
      crackTime: 'sofort',
      isCommon: false,
    };
  }

  const result = zxcvbn(password);
  const feedback: string[] = [];

  // Convert zxcvbn score (0-4) to our strength scale
  let strength: PasswordStrength;
  if (result.score === 0) strength = 'very-weak';
  else if (result.score === 1) strength = 'weak';
  else if (result.score === 2) strength = 'weak';
  else if (result.score === 3) strength = 'medium';
  else strength = 'strong';

  // Add specific feedback based on missing requirements
  if (password.length < 8) {
    feedback.push('Mindestens 8 Zeichen verwenden');
  }
  if (!/[A-Z]/.test(password)) {
    feedback.push('Großbuchstaben hinzufügen');
  }
  if (!/[a-z]/.test(password)) {
    feedback.push('Kleinbuchstaben hinzufügen');
  }
  if (!/\d/.test(password)) {
    feedback.push('Zahlen hinzufügen');
  }
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    feedback.push('Sonderzeichen hinzufügen');
  }

  // Add zxcvbn suggestions
  if (result.feedback.warning) {
    feedback.push(result.feedback.warning);
  }
  result.feedback.suggestions.forEach(suggestion => {
    feedback.push(suggestion);
  });

  // If no issues, add positive feedback
  if (feedback.length === 0) {
    if (strength === 'strong') {
      feedback.push('Sehr sicheres Passwort!');
    } else if (strength === 'medium') {
      feedback.push('Gutes Passwort!');
    }
  }

  return {
    strength,
    score: result.score,
    feedback,
    crackTime: formatCrackTime(result.crackTimesSeconds.offlineSlowHashing1e4PerSecond),
    isCommon: result.score < 2,
  };
}

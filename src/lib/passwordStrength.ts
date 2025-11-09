export type PasswordStrength = "weak" | "medium" | "strong";

export interface PasswordStrengthResult {
  strength: PasswordStrength;
  score: number; // 0-100
  feedback: string[];
}

export const calculatePasswordStrength = (password: string): PasswordStrengthResult => {
  if (!password) {
    return {
      strength: "weak",
      score: 0,
      feedback: ["Geben Sie ein Passwort ein"],
    };
  }

  let score = 0;
  const feedback: string[] = [];

  // Length check (0-30 points)
  if (password.length >= 6) score += 10;
  if (password.length >= 8) score += 10;
  if (password.length >= 12) score += 10;
  else if (password.length < 6) feedback.push("Mindestens 6 Zeichen erforderlich");

  // Has lowercase letters (0-15 points)
  if (/[a-z]/.test(password)) {
    score += 15;
  } else {
    feedback.push("Verwenden Sie Kleinbuchstaben");
  }

  // Has uppercase letters (0-15 points)
  if (/[A-Z]/.test(password)) {
    score += 15;
  } else {
    feedback.push("Verwenden Sie Großbuchstaben");
  }

  // Has numbers (0-20 points)
  if (/\d/.test(password)) {
    score += 20;
  } else {
    feedback.push("Verwenden Sie Zahlen");
  }

  // Has special characters (0-20 points)
  if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    score += 20;
  } else {
    feedback.push("Verwenden Sie Sonderzeichen (!@#$%...)");
  }

  // Determine strength level
  let strength: PasswordStrength;
  if (score < 40) {
    strength = "weak";
  } else if (score < 70) {
    strength = "medium";
  } else {
    strength = "strong";
  }

  return {
    strength,
    score,
    feedback: feedback.length > 0 ? feedback : ["Starkes Passwort!"],
  };
};

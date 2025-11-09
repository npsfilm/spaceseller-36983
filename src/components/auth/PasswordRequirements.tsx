import { motion } from 'framer-motion';
import { Check, X } from 'lucide-react';

interface PasswordRequirementsProps {
  password: string;
  show: boolean;
}

interface Requirement {
  label: string;
  test: (password: string) => boolean;
}

const requirements: Requirement[] = [
  { label: 'Mindestens 8 Zeichen', test: (pwd) => pwd.length >= 8 },
  { label: 'Ein Großbuchstabe', test: (pwd) => /[A-Z]/.test(pwd) },
  { label: 'Ein Kleinbuchstabe', test: (pwd) => /[a-z]/.test(pwd) },
  { label: 'Eine Zahl', test: (pwd) => /\d/.test(pwd) },
  { label: 'Ein Sonderzeichen', test: (pwd) => /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(pwd) },
];

export function PasswordRequirements({ password, show }: PasswordRequirementsProps) {
  if (!show) return null;

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.2 }}
      className="overflow-hidden"
    >
      <div className="mt-3 p-3 rounded-lg bg-muted/50 border border-border space-y-2">
        <p className="text-xs font-medium text-muted-foreground">Passwort muss enthalten:</p>
        <div className="space-y-1.5">
          {requirements.map((req, index) => {
            const passed = req.test(password);
            return (
              <motion.div
                key={index}
                initial={{ x: -10, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-center gap-2 text-xs"
              >
                <motion.div
                  animate={{
                    scale: passed ? [1, 1.2, 1] : 1,
                  }}
                  transition={{ duration: 0.3 }}
                >
                  {passed ? (
                    <Check className="w-4 h-4 text-green-500" />
                  ) : (
                    <X className="w-4 h-4 text-muted-foreground" />
                  )}
                </motion.div>
                <span className={passed ? 'text-foreground' : 'text-muted-foreground'}>
                  {req.label}
                </span>
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}

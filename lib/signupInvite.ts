export function signupCode(value: unknown): string | null {
  if (typeof value !== 'string') return null;
  const normalized = value.trim().toUpperCase();
  return /^[ABCDEFGHJKLMNPQRSTUVWXYZ23456789]{8}$/.test(normalized) ? normalized : null;
}

export const SIGNUP_COPY = {
  fr: { title: 'Une invitation à essayer Margot', code: 'Ton code d’invitation', copy: 'Copier le code', copied: 'Code copié', manual: 'Sélectionne le code pour le copier.', detail: 'À la création de ton compte, choisis « J’ai un code d’invitation » et saisis ce code. Une invitation validée t’offre 3 jours de Premium, sans carte bancaire.', invalid: 'Ce code d’invitation est invalide.' },
  en: { title: 'An invitation to try Margot', code: 'Your invitation code', copy: 'Copy code', copied: 'Code copied', manual: 'Select the code to copy it.', detail: 'When creating your account, choose “I have an invitation code” and enter this code. A valid invitation gives you 3 days of Premium without a payment card.', invalid: 'This invitation code is invalid.' },
  es: { title: 'Una invitación para probar Margot', code: 'Tu código de invitación', copy: 'Copiar código', copied: 'Código copiado', manual: 'Selecciona el código para copiarlo.', detail: 'Al crear tu cuenta, elige «Tengo un código de invitación» e introduce este código. Una invitación válida te regala 3 días de Premium sin tarjeta bancaria.', invalid: 'Este código de invitación no es válido.' },
} as const;

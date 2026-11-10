import { expect,it } from 'vitest';
import { VOTE_COPY } from '../voteCopy';
it('FR/EN/ES cover all vote states without prohibited copy',()=>{
 expect(VOTE_COPY.fr.pitch).toBe('Margot choisit ta tenue chaque matin. Avec les vêtements que tu as déjà');
 for(const locale of ['fr','en','es'] as const){
  expect(Object.keys(VOTE_COPY[locale])).toEqual(Object.keys(VOTE_COPY.fr));
  for(const text of Object.values(VOTE_COPY[locale]))expect(text).not.toMatch(/[!—]|\b(?:IA|AI)\b/u);
 }
});

it('provides the fixed lexical refusal in every locale',()=>{
 expect(['fr','en','es'].map(locale=>(VOTE_COPY[locale as keyof typeof VOTE_COPY] as Record<string,string>).social_text_rejected)).toEqual([
 'Ce texte contient un terme non autorisé. Modifie-le pour continuer',
 'This text contains a term that is not allowed. Edit it to continue',
 'Este texto contiene un término no permitido. Cámbialo para continuar',
 ]);
});

it('covers every bounded report reason and terminal state in the existing catalogue',()=>{
 for(const lang of ['fr','en','es'] as const) for(const key of ['report','reportTitle','reportNotice','reportSend','reportSending','reportSent','reportFailed','reportLimited','reportUnavailable','reportCancel','report_harassment','report_hate','report_sexual','report_violence','report_spam','report_privacy','report_other'] as const)expect(VOTE_COPY[lang][key].length).toBeGreaterThan(0);
});

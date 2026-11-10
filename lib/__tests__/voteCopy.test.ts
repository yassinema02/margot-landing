import { expect,it } from 'vitest';
import { VOTE_COPY } from '../voteCopy';
it('FR/EN/ES cover all vote states without prohibited copy',()=>{
 expect(VOTE_COPY.fr.pitch).toBe('Margot choisit ta tenue chaque matin. Avec les vêtements que tu as déjà');
 for(const locale of ['fr','en','es'] as const){
  expect(Object.keys(VOTE_COPY[locale])).toEqual(Object.keys(VOTE_COPY.fr));
  for(const text of Object.values(VOTE_COPY[locale]))expect(text).not.toMatch(/[!—]|\b(?:IA|AI)\b/u);
 }
});

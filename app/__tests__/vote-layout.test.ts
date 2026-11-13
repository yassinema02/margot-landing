import {createElement} from 'react';import {renderToStaticMarkup} from 'react-dom/server';import {readFileSync} from 'node:fs';import {expect,it,vi} from 'vitest';
vi.mock('next/headers',()=>({headers:async()=>new Headers({'accept-language':'es'})}));vi.mock('@/lib/fonts',()=>({fraunces:{variable:'display'},montserrat:{variable:'sans'}}));
import Layout from '../(vote)/layout';
it('isolates vote layout and enables strict PostHog without any automatic trackers',async()=>{
 const html=renderToStaticMarkup(await Layout({children:createElement('main',null,'vote')}));expect(html).toContain('lang="es"');expect(html).not.toMatch(/gtag|fbq|_vercel|cookie.banner/);
 const code=readFileSync(new URL('../(vote)/layout.tsx',import.meta.url),'utf8');expect(code).toContain('<PostHogProvider strictVote>');expect(code).not.toMatch(/RootShell|ConversionTracker|Analytics|MetaPixel|Consent/);
});

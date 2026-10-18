import { marketingAgency } from './marketing-agency';
import { portfolio } from './portfolio';
import { restaurant } from './restaurant';
import { saasLanding } from './saas-landing';

export interface TemplateFile {
  path: string;
  content: string;
}

export interface Template {
  id: string;
  name: string;
  blurb: string;
  /** Lowercase keywords used for deterministic template matching. */
  keywords: string[];
  files: TemplateFile[];
}

export const TEMPLATES: Template[] = [
  marketingAgency,
  portfolio,
  restaurant,
  saasLanding,
];

export function getTemplate(id: string): Template | undefined {
  return TEMPLATES.find((t) => t.id === id);
}

/**
 * Pick the best template for a natural-language prompt by keyword score.
 * Deterministic: same prompt always yields the same template.
 */
export function matchTemplate(prompt: string): Template {
  const lower = prompt.toLowerCase();
  let best: Template = marketingAgency;
  let bestScore = 0;
  for (const t of TEMPLATES) {
    let score = 0;
    for (const kw of t.keywords) {
      if (lower.includes(kw)) score += kw.length; // longer keywords weigh more
    }
    if (score > bestScore) {
      bestScore = score;
      best = t;
    }
  }
  return best;
}

/**
 * Replace the {{NAME}} placeholder with the project's business name.
 * The placeholder is the only substitution the demo engine performs.
 */
export function instantiate(template: Template, businessName: string): TemplateFile[] {
  const safe = businessName.trim().slice(0, 60) || 'My Business';
  return template.files.map((f) => ({
    path: f.path,
    content: f.content.split('{{NAME}}').join(safe),
  }));
}

/**
 * Naive business-name extraction: quoted text, or "for X" / "called X".
 * Falls back to "My Business" — never invents a fancier name.
 */
export function extractBusinessName(prompt: string): string {
  const quoted = prompt.match(/["“]([^"”]{2,60})["”]/);
  if (quoted) return quoted[1].trim();
  const called = prompt.match(/\b(?:called|named|for)\s+([A-Z][\w&'’.-]*(?:\s+[A-Z\d][\w&'’.-]*){0,3})/);
  if (called) return called[1].trim();
  return 'My Business';
}

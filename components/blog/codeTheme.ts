import { Prism, type PrismTheme } from 'prism-react-renderer';

// prism-react-renderer ships a trimmed language set that leaves out bash —
// register it directly against the shared Prism instance, the pattern
// documented in the library's own README for "custom language support".
const globalTarget = (typeof global !== 'undefined' ? global : window) as unknown as {
  Prism: typeof Prism;
};
globalTarget.Prism = Prism;
require('prismjs/components/prism-bash');

export function inferLanguage(filename?: string): string {
  if (!filename) return 'bash';
  const lower = filename.toLowerCase();
  if (lower === 'terminal' || lower.includes('bash') || lower.includes('shell')) return 'bash';
  if (/\.ya?ml$/.test(lower)) return 'yaml';
  if (/\.json$/.test(lower)) return 'json';
  if (/\.tsx$/.test(lower)) return 'tsx';
  if (/\.ts$/.test(lower)) return 'typescript';
  if (/\.jsx$/.test(lower)) return 'jsx';
  if (/\.js$/.test(lower)) return 'javascript';
  return 'bash';
}

// Monokai Pro (Classic) palette.
const bg = '#2D2A2E';
const fg = '#FCFCFA';
const comment = '#727072';
const punctuationColor = '#939293';
const pink = '#FF6188';
const orange = '#FC9867';
const yellow = '#FFD866';
const green = '#A9DC76';
const cyan = '#78DCE8';
const purple = '#AB9DF2';

export const monokaiPro: PrismTheme = {
  plain: { color: fg, backgroundColor: bg },
  styles: [
    { types: ['comment', 'prolog', 'doctype', 'cdata'], style: { color: comment, fontStyle: 'italic' } },
    { types: ['punctuation'], style: { color: punctuationColor } },
    { types: ['keyword', 'imports', 'operator', 'arrow', 'boolean', 'tag'], style: { color: pink } },
    { types: ['number', 'constant'], style: { color: orange } },
    { types: ['class-name', 'maybe-class-name', 'builtin', 'console'], style: { color: cyan } },
    { types: ['function', 'method'], style: { color: yellow } },
    { types: ['string', 'char', 'attr-value', 'regex', 'inserted'], style: { color: green } },
    { types: ['property-access', 'property', 'attr-name', 'key', 'parameter'], style: { color: purple } },
    { types: ['variable'], style: { color: fg } },
    { types: ['deleted'], style: { color: pink } },
    { types: ['important', 'atrule'], style: { color: cyan } },
  ],
};

export const EDITOR_BG = bg;

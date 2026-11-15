#!/usr/bin/env node
/**
 * Newsletter email templates for Brevo, in the site's look (DESIGN.md «The Landing Log»), one per
 * language. Run `node scripts/emails.mjs` and paste each file of emails/ into Brevo's HTML editor:
 *   - notes-<locale>.html    the RSS integration of that language: every new note of the feed
 *   - confirm-<locale>.html  the double opt-in email of that language's form
 *
 * Email HTML, not web HTML: tables and inline styles (Gmail and Outlook drop most CSS), a 600px
 * column, a PNG logo (SVG is unreliable in mail), and system fonts after Manrope. The `{{ … }}`
 * and `{% … %}` placeholders are Brevo's: the feed items (`params.items`, ENCLOSURE = the note's
 * image from the feed), `{{ unsubscribe }}`, `{{ mirror }}` and `{{ doubleoptin }}`.
 * Copy lives here, not in src/i18n: these files are built outside Astro.
 */
import { mkdirSync, writeFileSync } from 'node:fs';

const SITE = 'https://aggiovato.netlify.app';

// Palette and type from src/styles/tokens.css.
const c = {
  bg: '#15161e',
  surface: '#1b1d28',
  border: '#363344',
  text: '#f5f1fa',
  muted: '#bcb5ca',
  subtle: '#9691a8',
  accent: '#c6a5ff',
  onAccent: '#21152f',
};
const sans = "Manrope, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif";
const mono = "'JetBrains Mono', ui-monospace, Menlo, Consolas, monospace";

export const copy = {
  en: {
    notesPreheader: 'A new note from Heber Alejandro Lugo.',
    read: 'Read the note',
    why: 'You get this email because you subscribed to Heber Alejandro Lugo’s notes.',
    browser: 'View in the browser',
    unsubscribe: 'Unsubscribe',
    confirmPreheader: 'One click to confirm your subscription.',
    confirmTitle: 'Confirm your subscription',
    confirmBody:
      'Click the button to start getting new notes by email, in English. If you didn’t ask for this, ignore this email and nothing else will arrive.',
    confirmButton: 'Confirm subscription',
  },
  es: {
    notesPreheader: 'Una nota nueva de Heber Alejandro Lugo.',
    read: 'Leer la nota',
    why: 'Recibes este correo porque te suscribiste a las notas de Heber Alejandro Lugo.',
    browser: 'Ver en el navegador',
    unsubscribe: 'Darme de baja',
    confirmPreheader: 'Un clic para confirmar tu suscripción.',
    confirmTitle: 'Confirma tu suscripción',
    confirmBody:
      'Pulsa el botón para empezar a recibir las notas nuevas por correo, en español. Si no lo has pedido tú, ignora este correo y no recibirás nada más.',
    confirmButton: 'Confirmar suscripción',
  },
  it: {
    notesPreheader: 'Una nuova nota di Heber Alejandro Lugo.',
    read: 'Leggi la nota',
    why: 'Ricevi questa email perché ti sei iscritto alle note di Heber Alejandro Lugo.',
    browser: 'Apri nel browser',
    unsubscribe: 'Disiscriviti',
    confirmPreheader: 'Un clic per confermare l’iscrizione.',
    confirmTitle: 'Conferma l’iscrizione',
    confirmBody:
      'Clicca il pulsante per iniziare a ricevere le nuove note via email, in italiano. Se non l’hai chiesto tu, ignora questa email e non riceverai altro.',
    confirmButton: 'Conferma l’iscrizione',
  },
};

const notesPath = (locale) => (locale === 'en' ? '/notes/' : `/${locale}/notes/`);

/** Lavender button as a table, so Outlook keeps its padding. */
const button = (href, label) => `
<table role="presentation" cellspacing="0" cellpadding="0" border="0"><tr>
  <td style="border-radius:12px;background:${c.accent};">
    <a href="${href}" style="display:inline-block;padding:14px 28px;font-family:${sans};font-size:16px;font-weight:700;line-height:20px;color:${c.onAccent};text-decoration:none;border-radius:12px;">${label}</a>
  </td>
</tr></table>`;

/** Shared frame: dark ground, logo header with the section path, content, footer. */
function layout({ locale, preheader, title, content, footer }) {
  return `<!doctype html>
<html lang="${locale}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="color-scheme" content="dark">
<meta name="supported-color-schemes" content="dark">
<title>${title}</title>
</head>
<body style="margin:0;padding:0;background:${c.bg};">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;">${preheader}</div>
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background:${c.bg};">
<tr><td align="center" style="padding:32px 16px;">
  <table role="presentation" width="600" cellspacing="0" cellpadding="0" border="0" style="width:100%;max-width:600px;">
    <tr><td style="padding:0 4px 28px;">
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0"><tr>
        <td style="vertical-align:middle;">
          <a href="${SITE}${locale === 'en' ? '/' : `/${locale}/`}" style="text-decoration:none;font-family:${sans};font-size:20px;font-weight:700;color:${c.text};">
            <img src="${SITE}/email/logo.png" width="30" height="24" alt="" style="vertical-align:middle;border:0;margin-right:10px;">aggiovato
          </a>
        </td>
        <td align="right" style="vertical-align:middle;font-family:${mono};font-size:13px;color:${c.subtle};">~/<span style="color:${c.accent};">notes</span></td>
      </tr></table>
    </td></tr>
${content}
    <tr><td style="padding:28px 4px 0;border-top:1px solid ${c.border};font-family:${sans};font-size:13px;line-height:20px;color:${c.subtle};">
${footer}
    </td></tr>
  </table>
</td></tr>
</table>
</body>
</html>
`;
}

/** RSS email: each new note of the feed as a card with its image, title, summary and button. */
export function notesEmail(locale) {
  const t = copy[locale];
  // Brevo's tags sit inside a cell: text between table rows is moved out of the table by any HTML
  // parser (and by Brevo's editor), which would leave the loop wrapping nothing.
  const content = `    <tr><td style="padding:0;">
{% for item in params.items %}
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin:0 0 24px;background:${c.surface};border:1px solid ${c.border};border-radius:20px;">
        <tr><td style="padding:0;">
          {% if item.ENCLOSURE %}<a href="{{ item.LINK }}"><img src="{{ item.ENCLOSURE }}" width="598" alt="" style="display:block;width:100%;max-width:598px;height:auto;border:0;border-radius:19px 19px 0 0;"></a>{% endif %}
        </td></tr>
        <tr><td style="padding:28px 28px 32px;">
          <h1 style="margin:0 0 12px;font-family:${sans};font-size:26px;line-height:32px;font-weight:750;letter-spacing:-0.4px;color:${c.text};">
            <a href="{{ item.LINK }}" style="color:${c.text};text-decoration:none;">{{ item.TITLE }}</a>
          </h1>
          <p style="margin:0 0 24px;font-family:${sans};font-size:16px;line-height:26px;color:${c.muted};">{{ item.DESCRIPTION }}</p>
${button('{{ item.LINK }}', t.read)}
        </td></tr>
      </table>
{% endfor %}
    </td></tr>`;
  const footer = `      <p style="margin:0 0 8px;">${t.why}</p>
      <p style="margin:0;"><a href="{{ mirror }}" style="color:${c.muted};">${t.browser}</a>&nbsp;&nbsp;&nbsp;<a href="{{ unsubscribe }}" style="color:${c.muted};">${t.unsubscribe}</a>&nbsp;&nbsp;&nbsp;<a href="${SITE}${notesPath(locale)}" style="color:${c.muted};">aggiovato.netlify.app</a></p>`;
  return layout({ locale, preheader: t.notesPreheader, title: t.notesPreheader, content, footer });
}

/** Double opt-in email: one message and one button with Brevo's confirmation link. */
export function confirmEmail(locale) {
  const t = copy[locale];
  const content = `    <tr><td style="padding:0 0 28px;">
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background:${c.surface};border:1px solid ${c.border};border-radius:20px;">
        <tr><td style="padding:32px 28px;">
          <h1 style="margin:0 0 12px;font-family:${sans};font-size:26px;line-height:32px;font-weight:750;letter-spacing:-0.4px;color:${c.text};">${t.confirmTitle}</h1>
          <p style="margin:0 0 24px;font-family:${sans};font-size:16px;line-height:26px;color:${c.muted};">${t.confirmBody}</p>
${button('{{ doubleoptin }}', t.confirmButton)}
        </td></tr>
      </table>
    </td></tr>`;
  const footer = `      <p style="margin:0;"><a href="${SITE}${notesPath(locale)}" style="color:${c.muted};">aggiovato.netlify.app</a></p>`;
  return layout({ locale, preheader: t.confirmPreheader, title: t.confirmTitle, content, footer });
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const out = new URL('../emails/', import.meta.url);
  mkdirSync(out, { recursive: true });
  for (const locale of Object.keys(copy)) {
    writeFileSync(new URL(`notes-${locale}.html`, out), notesEmail(locale));
    writeFileSync(new URL(`confirm-${locale}.html`, out), confirmEmail(locale));
    console.log(`  ✓ emails/notes-${locale}.html, emails/confirm-${locale}.html`);
  }
}

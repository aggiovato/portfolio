#!/usr/bin/env node
/**
 * Newsletter email templates for Brevo, «Orbital Journal»: a dark masthead with Jupiter over a
 * light paper body, one per language. Run `node scripts/emails.mjs` and paste each file of
 * emails/ into Brevo's HTML editor:
 *   - notes-<locale>.html    the RSS integration of that language: the new notes of the feed
 *   - confirm-<locale>.html  the double opt-in email of that language's form
 * It also renders public/email/jupiter.png, the masthead planet, and public/email/lockup.png, the
 * logo with its wordmark (email clients cannot use the site's font; a new file name also skips the
 * image proxies' cache of the old logo.png, which stays for emails already sent).
 *
 * Email HTML, not web HTML: tables and inline styles (Gmail and Outlook drop most CSS), a 600px
 * column, PNG images at fixed URLs under /email/ (fingerprinted /_astro/ URLs change with every
 * build and would break emails already sent; Outlook does not show WebP), system fonts.
 * The `{{ … }}` and `{% … %}` placeholders are Brevo's template language: the feed items
 * (`params.items`; ENCLOSURE = the note's image from the feed), `forloop.First` /
 * `forloop.Counter` to feature the first note, `{{ unsubscribe }}`, `{{ mirror }}` and
 * `{{ doubleoptin }}`. The feed date (PUBDATE) arrives unformatted, so it is not shown.
 * Copy lives here, not in src/i18n: these files are built outside Astro.
 */
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';

const SITE = 'https://portfolio.aggiovato.workers.dev';
const LINKS = { github: 'https://github.com/aggiovato', linkedin: 'https://www.linkedin.com/in/heberlugo' };

// Night masthead from src/styles/tokens.css; paper body and inks chosen for light email clients.
const c = {
  page: '#ECEAF0',
  paper: '#FAF9F6',
  night: '#15161E',
  starlight: '#F6F3FC',
  nightMuted: '#C6C2D1',
  accent: '#C6A5FF',
  accentHover: '#D6BEFF',
  ink: '#211B2E',
  body: '#514A60',
  soft: '#625B6D',
  label: '#756784',
  link: '#594079',
  rule: '#DDD7E5',
  footer: '#F0EDF4',
};
const sans = 'Arial, Helvetica, sans-serif';
const serif = "Georgia, 'Times New Roman', serif";
const mono = 'Consolas, Menlo, monospace';

export const copy = {
  en: {
    journal: 'ORBITAL JOURNAL',
    eyebrow: 'NEW FROM THE NOTEBOOK',
    heroTitle: 'Notes from<br>the build.',
    heroSub: 'Code, product &amp; things learned along the way.',
    intro: 'A few things from my notebook. Practical ideas to read, try, and bring into your next build.',
    notesPreheader: 'A new note from Heber Alejandro Lugo.',
    read: 'Read the note',
    also: 'ALSO IN THIS EDITION',
    signoff: 'Until next time,',
    replyAsk: 'Have a different take?',
    replyLink: 'I’d love to hear it.',
    allNotes: 'All notes',
    why: 'You’re receiving this because you subscribed to Heber Alejandro Lugo’s notes.',
    browser: 'View in the browser',
    unsubscribe: 'Unsubscribe',
    confirmPreheader: 'One click to confirm your subscription.',
    confirmEyebrow: 'ONE LAST STEP',
    confirmTitle: 'Confirm your subscription',
    confirmBody:
      'Click the button to start getting new notes by email, in English. If you didn’t ask for this, ignore this email and nothing else will arrive.',
    confirmButton: 'Confirm subscription',
  },
  es: {
    journal: 'ORBITAL JOURNAL',
    eyebrow: 'NOVEDADES DEL CUADERNO',
    heroTitle: 'Apuntes<br>de taller.',
    heroSub: 'Código, producto y lo que aprendo por el camino.',
    intro: 'Algunas cosas de mi cuaderno: ideas prácticas para leer, probar y llevar a tu próximo proyecto.',
    notesPreheader: 'Una nota nueva de Heber Alejandro Lugo.',
    read: 'Leer la nota',
    also: 'TAMBIÉN EN ESTA EDICIÓN',
    signoff: 'Hasta la próxima,',
    replyAsk: '¿Lo ves de otra forma?',
    replyLink: 'Me encantará leerlo.',
    allNotes: 'Todas las notas',
    why: 'Recibes este correo porque te suscribiste a las notas de Heber Alejandro Lugo.',
    browser: 'Ver en el navegador',
    unsubscribe: 'Darme de baja',
    confirmPreheader: 'Un clic para confirmar tu suscripción.',
    confirmEyebrow: 'UN ÚLTIMO PASO',
    confirmTitle: 'Confirma tu suscripción',
    confirmBody:
      'Pulsa el botón para empezar a recibir las notas nuevas por correo, en español. Si no lo has pedido tú, ignora este correo y no recibirás nada más.',
    confirmButton: 'Confirmar suscripción',
  },
  it: {
    journal: 'ORBITAL JOURNAL',
    eyebrow: 'NOVITÀ DAL TACCUINO',
    heroTitle: 'Appunti<br>dal cantiere.',
    heroSub: 'Codice, prodotto e ciò che imparo lungo la strada.',
    intro:
      'Qualche appunto dal mio taccuino: idee pratiche da leggere, provare e portare nel tuo prossimo progetto.',
    notesPreheader: 'Una nuova nota di Heber Alejandro Lugo.',
    read: 'Leggi la nota',
    also: 'ANCHE IN QUESTO NUMERO',
    signoff: 'Alla prossima,',
    replyAsk: 'La vedi diversamente?',
    replyLink: 'Mi farebbe piacere saperlo.',
    allNotes: 'Tutte le note',
    why: 'Ricevi questa email perché ti sei iscritto alle note di Heber Alejandro Lugo.',
    browser: 'Apri nel browser',
    unsubscribe: 'Disiscriviti',
    confirmPreheader: 'Un clic per confermare l’iscrizione.',
    confirmEyebrow: 'UN ULTIMO PASSO',
    confirmTitle: 'Conferma l’iscrizione',
    confirmBody:
      'Clicca il pulsante per iniziare a ricevere le nuove note via email, in italiano. Se non l’hai chiesto tu, ignora questa email e non riceverai altro.',
    confirmButton: 'Conferma l’iscrizione',
  },
};

const home = (locale) => `${SITE}${locale === 'en' ? '/' : `/${locale}/`}`;
const notesUrl = (locale) => `${SITE}${locale === 'en' ? '/notes/' : `/${locale}/notes/`}`;

// Every table carries cellpadding/cellspacing/border inline: clients that drop the <style> block
// (the Gmail app with other accounts) otherwise open gaps between the masthead rows.
/** Lavender button as a table, so Outlook keeps its padding. */
const button = (href, label) =>
  `<table role="presentation" cellpadding="0" cellspacing="0" border="0" class="cta" style="margin-top:22px;"><tr><td bgcolor="${c.accent}" style="border-radius:5px;text-align:center;mso-padding-alt:15px 24px;"><a class="button" href="${href}" style="display:inline-block;padding:15px 24px;font-family:${sans};font-size:15px;font-weight:bold;line-height:20px;color:${c.ink};text-decoration:none;border-radius:5px;">${label} &rarr;</a></td></tr></table>`;

/** Shared frame: night masthead with Jupiter, a lavender rule, the paper body and the footer. */
function layout({ locale, preheader, title, eyebrow, heroTitle, heroSub, content, footer }) {
  return `<!doctype html>
<html lang="${locale}" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="x-apple-disable-message-reformatting"><meta name="color-scheme" content="light"><meta name="supported-color-schemes" content="light">
<title>${title}</title>
<!--[if mso]><xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml><![endif]-->
<style>
html,body{margin:0!important;padding:0!important;width:100%!important}table{border-collapse:collapse;mso-table-lspace:0pt;mso-table-rspace:0pt}img{border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic}a{color:inherit}a[x-apple-data-detectors]{color:inherit!important;text-decoration:none!important}p{margin:0}.button:hover{background:${c.accentHover}!important}
@media screen and (max-width:620px){.outer{padding:0!important}.shell{width:100%!important}.pad{padding-left:24px!important;padding-right:24px!important}.hero-title{font-size:34px!important;line-height:39px!important}.article-title{font-size:27px!important;line-height:34px!important}.hero-planet{width:96px!important}.footer-links a{display:inline-block;padding:8px 5px!important}.cta{width:100%!important}.button{display:block!important;text-align:center!important}}
</style>
</head>
<body style="margin:0;padding:0;background-color:${c.page};color:${c.ink};font-family:${sans};">
<div style="display:none;font-size:1px;line-height:1px;color:${c.page};max-height:0;max-width:0;opacity:0;overflow:hidden;mso-hide:all;">${preheader}</div>
<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" bgcolor="${c.page}"><tr><td class="outer" align="center" style="padding:32px 12px;">
<!--[if mso]><table role="presentation" cellpadding="0" cellspacing="0" border="0" width="600" align="center"><tr><td><![endif]-->
<table role="presentation" cellpadding="0" cellspacing="0" border="0" class="shell" width="100%" style="max-width:600px;background-color:${c.paper};" bgcolor="${c.paper}">
<tr><td bgcolor="${c.night}" class="pad" style="padding:30px 40px 0;color:${c.starlight};">
<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%"><tr>
<td><a href="${home(locale)}" style="font-family:${sans};font-size:23px;font-weight:bold;text-decoration:none;color:${c.starlight};"><img src="${SITE}/email/lockup.png" width="129" height="28" alt="aggiovato" style="display:block;width:129px;height:28px;border:0;"></a></td>
<td align="right" style="font-family:${mono};font-size:10px;letter-spacing:1.5px;color:${c.accent};">${copy[locale].journal}</td>
</tr></table>
</td></tr>
<tr><td bgcolor="${c.night}" class="pad" style="padding:28px 40px 32px;color:${c.starlight};">
<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%"><tr>
<td valign="middle" style="padding-right:16px;">
<p style="font-family:${mono};font-size:11px;line-height:18px;letter-spacing:1.5px;color:${c.accent};">${eyebrow}</p>
<h1 class="hero-title" style="margin:12px 0 12px;font-family:${sans};font-size:40px;line-height:44px;letter-spacing:-1.4px;color:${c.starlight};">${heroTitle}</h1>
<p style="font-family:${sans};font-size:14px;line-height:22px;color:${c.nightMuted};">${heroSub}</p>
</td>
<td width="120" valign="middle"><img class="hero-planet" src="${SITE}/email/jupiter.png" width="120" height="120" alt="" style="display:block;width:120px;max-width:100%;height:auto;"></td>
</tr></table>
</td></tr>
<tr><td height="3" bgcolor="${c.accent}" style="font-size:0;line-height:3px;">&nbsp;</td></tr>
${content}
<tr><td class="pad" bgcolor="${c.footer}" style="padding:24px 40px 30px;font-family:${sans};">
${footer}
</td></tr>
</table>
<!--[if mso]></td></tr></table><![endif]-->
</td></tr></table>
</body>
</html>
`;
}

const footerLinks = (locale) => {
  const t = copy[locale];
  const a = (href, label) =>
    `<a href="${href}" style="color:${c.ink};text-decoration:underline;">${label}</a>`;
  return `<p class="footer-links" style="font-size:12px;line-height:24px;color:${c.ink};">${[
    a(notesUrl(locale), t.allNotes),
    a(home(locale), 'Portfolio'),
    a(LINKS.github, 'GitHub'),
    a(LINKS.linkedin, 'LinkedIn'),
  ].join('&nbsp; · &nbsp;')}</p>`;
};

/**
 * RSS email: the first new note featured with its image, title, summary and button; any other
 * notes of the same send listed below under «Also in this edition».
 */
export function notesEmail(locale) {
  const t = copy[locale];
  // Brevo hands DESCRIPTION over with its <description> element and escapes it, so the tags
  // showed as text in the email: `striptags` keeps only the summary, still escaped.
  // Brevo's tags sit inside a cell: text between table rows is moved out of the table by any HTML
  // parser (and by Brevo's editor), which would leave the loop wrapping nothing.
  const content = `<tr><td class="pad" style="padding:30px 40px 24px;">
<p style="font-family:${serif};font-size:19px;line-height:29px;color:#34303E;">${t.intro}</p>
</td></tr>
<tr><td class="pad" style="padding:0 40px;">
{% for item in params.items %}{% if forloop.First %}
<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%"><tr><td style="padding:0 0 22px;">{% if item.ENCLOSURE %}<a href="{{ item.LINK }}"><img src="{{ item.ENCLOSURE }}" width="520" alt="{{ item.TITLE }}" style="display:block;width:100%;max-width:520px;height:auto;border-radius:8px;"></a>{% endif %}</td></tr>
<tr><td style="padding:0 0 30px;">
<h2 class="article-title" style="margin:0 0 14px;font-family:${serif};font-size:32px;line-height:39px;letter-spacing:-.6px;color:${c.ink};"><a href="{{ item.LINK }}" style="color:${c.ink};text-decoration:none;">{{ item.TITLE }}</a></h2>
<p style="font-family:${sans};font-size:16px;line-height:27px;color:${c.body};">{{ item.DESCRIPTION|striptags }}</p>
${button('{{ item.LINK }}', t.read)}
</td></tr></table>
{% else %}{% if forloop.Counter == 2 %}<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%"><tr><td style="border-top:1px solid ${c.rule};padding-top:24px;"><p style="font-family:${mono};font-size:10px;line-height:18px;letter-spacing:1.5px;color:${c.label};">${t.also}</p></td></tr></table>{% endif %}
<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%"><tr><td style="padding:18px 0 8px;">
<h2 style="margin:0 0 9px;font-family:${sans};font-size:21px;line-height:29px;letter-spacing:-.3px;"><a href="{{ item.LINK }}" style="color:#352847;text-decoration:underline;">{{ item.TITLE }}&nbsp;&rarr;</a></h2>
<p style="font-family:${sans};font-size:14px;line-height:24px;color:${c.soft};">{{ item.DESCRIPTION|striptags }}</p>
</td></tr></table>
{% endif %}{% endfor %}
</td></tr>
<tr><td class="pad" style="padding:28px 40px 34px;">
<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%"><tr><td style="border-top:1px solid ${c.rule};padding-top:24px;font-family:${sans};">
<p style="font-size:15px;line-height:25px;color:${c.body};">${t.signoff}<br><strong style="color:${c.ink};">Heber Alejandro</strong></p>
<p style="margin-top:14px;font-size:13px;line-height:22px;color:${c.soft};">${t.replyAsk} <a href="mailto:aggiovato@gmail.com" style="color:${c.link};text-decoration:underline;">${t.replyLink}</a></p>
</td></tr></table>
</td></tr>`;
  const footer = `${footerLinks(locale)}
<p style="margin-top:12px;font-size:12px;line-height:19px;color:#6B6375;">${t.why}</p>
<p style="margin-top:12px;font-size:12px;line-height:20px;"><a href="{{ mirror }}" style="color:#514064;text-decoration:underline;">${t.browser}</a>&nbsp;&nbsp;·&nbsp;&nbsp;<a href="{{ unsubscribe }}" style="color:#514064;text-decoration:underline;">${t.unsubscribe}</a></p>
<p style="margin-top:12px;font-size:11px;line-height:18px;color:#766E80;">© Heber Alejandro Lugo · aggiovato</p>`;
  return layout({
    locale,
    preheader: t.notesPreheader,
    title: `${t.notesPreheader} — Orbital Journal`,
    eyebrow: t.eyebrow,
    heroTitle: t.heroTitle,
    heroSub: t.heroSub,
    content,
    footer,
  });
}

/** Double opt-in email: the same masthead, one message and one button with Brevo's link. */
export function confirmEmail(locale) {
  const t = copy[locale];
  const content = `<tr><td class="pad" style="padding:30px 40px 34px;">
<p style="font-family:${sans};font-size:16px;line-height:27px;color:${c.body};">${t.confirmBody}</p>
${button('{{ doubleoptin }}', t.confirmButton)}
</td></tr>`;
  const footer = `${footerLinks(locale)}
<p style="margin-top:12px;font-size:11px;line-height:18px;color:#766E80;">© Heber Alejandro Lugo · aggiovato</p>`;
  return layout({
    locale,
    preheader: t.confirmPreheader,
    title: t.confirmTitle,
    eyebrow: t.confirmEyebrow,
    heroTitle: t.confirmTitle,
    heroSub: t.heroSub,
    content,
    footer,
  });
}

/** The masthead planet: Jupiter with its transparency, 240 px for sharp 2× screens at 120 px. */
async function renderJupiter() {
  const { default: sharp } = await import('sharp');
  await sharp(new URL('../src/assets/hero/jupiter.png', import.meta.url).pathname)
    .resize(240, 240)
    .png({ compressionLevel: 9, palette: true, quality: 90 })
    .toFile(new URL('../public/email/jupiter.png', import.meta.url).pathname);
  console.log('  ✓ public/email/jupiter.png');
}

/** The masthead logo: the dark lockup (outlined), cropped like Lockup.astro, 3× for 28 px. */
async function renderLockup() {
  const { default: sharp } = await import('sharp');
  const svg = readFileSync(new URL('../src/assets/brand/lockup-dark.svg', import.meta.url), 'utf8').replace(
    /width="[\d.]+" height="[\d.]+" viewBox="[^"]*"/,
    'width="406.6" height="88" viewBox="30 15.5 406.6 88"',
  );
  await sharp(Buffer.from(svg), { density: 300 })
    .resize({ height: 84 })
    .png({ compressionLevel: 9 })
    .toFile(new URL('../public/email/lockup.png', import.meta.url).pathname);
  console.log('  ✓ public/email/lockup.png');
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const out = new URL('../emails/', import.meta.url);
  mkdirSync(out, { recursive: true });
  for (const locale of Object.keys(copy)) {
    writeFileSync(new URL(`notes-${locale}.html`, out), notesEmail(locale));
    writeFileSync(new URL(`confirm-${locale}.html`, out), confirmEmail(locale));
    console.log(`  ✓ emails/notes-${locale}.html, emails/confirm-${locale}.html`);
  }
  await renderJupiter();
  await renderLockup();
}

// Production origin validation for `node src/build.mjs --prod`. Dependency-free; pure (no I/O, no env access).
// Accepts only a bare absolute HTTPS origin on a real-looking public hostname. It never contacts the host.

const RESERVED_TLDS = new Set(['invalid', 'test', 'example', 'localhost', 'local', 'internal', 'lan', 'home', 'corp', 'intranet']);
const RESERVED_DOMAINS = ['example.com', 'example.net', 'example.org']; // RFC 2606 (also matches their subdomains)
const PLACEHOLDER_WORDS = ['example', 'placeholder', 'yourdomain', 'your-domain', 'changeme', 'localhost'];
const LABEL = /^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?)$/;

// Returns { ok: true, origin } with origin normalised (no trailing slash), or { ok: false, error }.
export function validateOrigin(value) {
  const fail = (error) => ({ ok: false, error });
  if (typeof value !== 'string' || value === '') return fail('SITE_ORIGIN is not set. Set it to the confirmed production origin, e.g. SITE_ORIGIN=https://<your-domain>.');
  if (value !== value.trim()) return fail('SITE_ORIGIN has leading or trailing whitespace.');

  let u;
  try { u = new URL(value); } catch { return fail(`SITE_ORIGIN is not a valid absolute URL: "${value}".`); }

  if (u.protocol !== 'https:') return fail(`SITE_ORIGIN must use https:// (got "${u.protocol}//").`);
  if (u.username || u.password) return fail('SITE_ORIGIN must not contain credentials.');
  if (u.port) return fail('SITE_ORIGIN must not specify a port; a production origin uses the default HTTPS port.');
  if (u.pathname !== '/' || u.search || u.hash) return fail('SITE_ORIGIN must be an origin only (no path, query or fragment); the site is generated for the domain root.');

  const host = u.hostname.toLowerCase().replace(/\.$/, '');
  if (host.startsWith('[') || /^\d+(?:\.\d+){0,3}$/.test(host)) return fail('SITE_ORIGIN must be a domain name, not an IP address.');
  if (host.length > 253) return fail('SITE_ORIGIN hostname is too long.');
  const labels = host.split('.');
  if (labels.length < 2) return fail(`SITE_ORIGIN hostname "${host}" has no top-level domain.`);
  if (!labels.every((l) => LABEL.test(l))) return fail(`SITE_ORIGIN hostname "${host}" contains invalid characters.`);
  const tld = labels[labels.length - 1];
  if (!/^(?:[a-z]{2,63}|xn--[a-z0-9-]{2,59})$/.test(tld)) return fail(`SITE_ORIGIN top-level domain ".${tld}" is not valid.`);

  if (RESERVED_TLDS.has(tld)) return fail(`SITE_ORIGIN uses a reserved/non-public suffix (.${tld}); it must be the real production domain.`);
  if (RESERVED_DOMAINS.some((d) => host === d || host.endsWith(`.${d}`))) return fail(`SITE_ORIGIN uses a reserved example domain (${host}).`);
  const word = PLACEHOLDER_WORDS.find((w) => host.includes(w));
  if (word) return fail(`SITE_ORIGIN looks like a placeholder (contains "${word}").`);

  return { ok: true, origin: `https://${host}` };
}

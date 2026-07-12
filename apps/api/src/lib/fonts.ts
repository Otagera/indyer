const GOOGLE_FONTS_CSS =
  "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=DM+Sans:wght@400;700&display=swap";

// UA without woff2 support so Google serves TTF — resvg's fontdb cannot parse woff2.
const FONT_FETCH_UA = "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36";

let fontData: { playfair: Buffer; dmSans: Buffer; dmSansBold: Buffer } | null = null;

async function fetchUrl(url: string): Promise<Response> {
  return fetch(url, {
    headers: { "User-Agent": FONT_FETCH_UA },
  });
}

async function fetchFont(url: string): Promise<Buffer> {
  const res = await fetchUrl(url);
  if (!res.ok) throw new Error(`Failed to fetch font: ${res.status}`);
  return Buffer.from(await res.arrayBuffer());
}

export function extractFontUrl(css: string, family: string, weight: number): string {
  const familyRe = new RegExp(`font-family:\\s*['"]?${family}['"]?\\s*;`);
  const weightRe = new RegExp(`font-weight:\\s*${weight}\\s*;`);
  const blocks = css.split("@font-face");
  const matching = blocks.filter((block) => familyRe.test(block) && weightRe.test(block));
  if (matching.length === 0) throw new Error(`No @font-face block for ${family} ${weight}`);
  // TTF CSS has no unicode-range subsets; woff2 CSS does — prefer the latin subset there.
  const block = matching.find((b) => b.includes("latin")) ?? matching[0];
  const match = block.match(/url\((['"]?)([^)'"]+)\1\)/);
  if (!match) throw new Error(`No font URL in @font-face block for ${family} ${weight}`);
  return match[2];
}

export async function getFonts(): Promise<{
  playfair: Buffer;
  dmSans: Buffer;
  dmSansBold: Buffer;
}> {
  if (!fontData) {
    const res = await fetchUrl(GOOGLE_FONTS_CSS);
    if (!res.ok) throw new Error(`Failed to fetch Google Fonts CSS: ${res.status}`);
    const css = await res.text();
    const [playfair, dmSans, dmSansBold] = await Promise.all([
      fetchFont(extractFontUrl(css, "Playfair Display", 700)),
      fetchFont(extractFontUrl(css, "DM Sans", 400)),
      fetchFont(extractFontUrl(css, "DM Sans", 700)),
    ]);
    fontData = { playfair, dmSans, dmSansBold };
  }
  return fontData;
}

export async function warmFonts(): Promise<void> {
  await getFonts();
}

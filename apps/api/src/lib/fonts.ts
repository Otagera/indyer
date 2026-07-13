import { readFile } from "node:fs/promises";

// TTFs vendored in src/assets/fonts (Playfair Display + DM Sans, both SIL OFL).
// Fetching from Google Fonts at runtime broke in production: the woff2-vs-ttf
// format Google serves depends on client fingerprinting, and resvg's fontdb
// silently drops all <text> elements when handed woff2 it cannot parse.
const FONT_DIR = new URL("../assets/fonts/", import.meta.url);

let fontData: { playfair: Buffer; dmSans: Buffer; dmSansBold: Buffer } | null = null;

export async function getFonts(): Promise<{
  playfair: Buffer;
  dmSans: Buffer;
  dmSansBold: Buffer;
}> {
  if (!fontData) {
    const [playfair, dmSans, dmSansBold] = await Promise.all([
      readFile(new URL("playfair-display-700.ttf", FONT_DIR)),
      readFile(new URL("dm-sans-400.ttf", FONT_DIR)),
      readFile(new URL("dm-sans-700.ttf", FONT_DIR)),
    ]);
    fontData = { playfair, dmSans, dmSansBold };
  }
  return fontData;
}

export async function warmFonts(): Promise<void> {
  await getFonts();
}

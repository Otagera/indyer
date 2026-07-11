const PLAYFAIR_URL = "https://fonts.gstatic.com/s/playfairdisplay/v37/nuFvD-vYSZviVYUb_rj3ij__anPXJzDwcbmjWBN2PKebunDXbtM.woff";
const DM_SANS_URL = "https://fonts.gstatic.com/s/dmsans/v15/rP2Yp2ywxg089UriI5-g4vlH9VoD8Cmcqbu0-K6z9Wg.woff";

let playfairData: ArrayBuffer | null = null;
let dmSansData: ArrayBuffer | null = null;

async function fetchFont(url: string): Promise<ArrayBuffer> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch font: ${res.status}`);
  return res.arrayBuffer();
}

export async function getFonts(): Promise<{ playfair: ArrayBuffer; dmSans: ArrayBuffer }> {
  if (!playfairData) {
    playfairData = await fetchFont(PLAYFAIR_URL);
  }
  if (!dmSansData) {
    dmSansData = await fetchFont(DM_SANS_URL);
  }
  return { playfair: playfairData, dmSans: dmSansData };
}

export async function warmFonts(): Promise<void> {
  await getFonts();
}

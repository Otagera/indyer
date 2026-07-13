import { access } from "node:fs/promises";
import { fileURLToPath } from "node:url";

// TTFs vendored in src/assets/fonts (Playfair Display + DM Sans, both SIL OFL).
// Passed to resvg as fontFiles paths: the undocumented fontBuffers option is
// silently ignored by the linux-x64-musl 2.6.2 binary (text vanishes from the
// card in production) even though the darwin-arm64 binary honors it.
const FONT_DIR = new URL("../assets/fonts/", import.meta.url);

export const fontFiles = [
  "playfair-display-700.ttf",
  "dm-sans-400.ttf",
  "dm-sans-700.ttf",
].map((name) => fileURLToPath(new URL(name, FONT_DIR)));

export async function warmFonts(): Promise<void> {
  await Promise.all(fontFiles.map((path) => access(path)));
}

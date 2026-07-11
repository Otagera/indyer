import type { Mode } from "@indyer/shared";

const MODE_COLORS: Record<Mode, string> = {
  easy: "#2a6b3f",
  normal: "#b8860b",
  hard: "#8b2e2e",
};

function wrapText(text: string, maxChars: number): string[] {
  const words = text.split(" ");
  const lines: string[] = [];
  let current = "";
  for (const word of words) {
    const candidate = `${current} ${word}`.trim();
    if (candidate.length <= maxChars) {
      current = candidate;
    } else {
      if (current) lines.push(current);
      current = word;
    }
  }
  if (current) lines.push(current);
  return lines;
}

interface CardData {
  issueNo: number;
  mode: Mode;
  usedGuesses: number;
  totalGuesses: number;
  clueText: string;
}

export function generateShareCardSvg(data: CardData): string {
  const { issueNo, mode, usedGuesses, totalGuesses, clueText } = data;
  const barColor = MODE_COLORS[mode];
  const modeLabel = mode.charAt(0).toUpperCase() + mode.slice(1);
  const lines = wrapText(`"${clueText}"`, 70);
  const lineHeight = 16;

  const clueLines = lines
    .map(
      (line, i) =>
        `      <tspan x="300" dy="${i === 0 ? 0 : lineHeight}">${escapeXml(line)}</tspan>`,
    )
    .join("\n");

  return `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="315" viewBox="0 0 600 315">
  <defs>
    <filter id="grain" x="0" y="0" width="600" height="315">
      <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="4" result="noise"/>
      <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.04 0" in="noise" result="coloredNoise"/>
      <feBlend in="SourceGraphic" in2="coloredNoise" mode="multiply"/>
    </filter>
  </defs>

  <rect width="600" height="315" fill="#f2ede4" filter="url(#grain)"/>
  <rect x="8" y="8" width="584" height="299" fill="none" stroke="#d4c8a8" stroke-width="0.5"/>

  <text x="300" y="50" text-anchor="middle" font-family="'Playfair Display', Georgia, serif" font-size="22" font-weight="700" fill="#2a2418" letter-spacing="4">THE NEW HERALD</text>
  <text x="300" y="70" text-anchor="middle" font-family="'DM Sans', Helvetica, sans-serif" font-size="9" fill="#8a7e65" letter-spacing="3">ISSUE #${issueNo}</text>

  <line x1="180" y1="86" x2="420" y2="86" stroke="#c8b890" stroke-width="0.5"/>

  <rect x="135" y="108" width="330" height="36" rx="2" fill="${barColor}"/>

  <text x="300" y="178" text-anchor="middle" font-family="'DM Sans', Helvetica, sans-serif" font-size="14" font-weight="700" fill="#4a3c28" letter-spacing="1.5">${escapeXml(modeLabel)} · ${usedGuesses}/${totalGuesses}</text>

  <text x="300" y="218" text-anchor="middle" font-family="'DM Sans', Helvetica, sans-serif" font-size="11" fill="#5a4c38">
${clueLines}
  </text>

  <line x1="180" y1="268" x2="420" y2="268" stroke="#c8b890" stroke-width="0.5"/>
  <text x="300" y="295" text-anchor="middle" font-family="'DM Sans', Helvetica, sans-serif" font-size="8" fill="#9a8e75" letter-spacing="2">INDYER.OTAGERA.XYZ</text>
</svg>`;
}

function escapeXml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");
}

export function normalize(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^\w\s]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

export function levenshtein(a: string, b: string): number {
  const alen = a.length;
  const blen = b.length;
  const matrix: number[][] = [];

  for (let i = 0; i <= alen; i++) {
    matrix[i] = [i];
  }
  for (let j = 0; j <= blen; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= alen; i++) {
    for (let j = 1; j <= blen; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,
        matrix[i][j - 1] + 1,
        matrix[i - 1][j - 1] + cost,
      );
    }
  }

  return matrix[alen][blen];
}

export function fuzzyMatch(input: string, acceptedAnswers: string[]): boolean {
  const normalized = normalize(input);
  return acceptedAnswers.some((answer) => {
    const na = normalize(answer);
    return normalized === na || levenshtein(normalized, na) <= 2;
  });
}

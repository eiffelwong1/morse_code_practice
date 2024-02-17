import { textToMorse } from "./translation";

export function WpmToTimeUnit(wpm: number): number {
  return 60 / (50 * wpm);
}

export function TimeUnitToWpm(timeUnit: number): number {
  return 60 / (50 * timeUnit);
}

export function CharScore(char: string): number {
  console.log("char: ", char)
  const morse = textToMorse[char];
  if (!morse) return 0;
  let score = 0;
  for (const c of morse) {
    if (c === ".") {
      score += 2;
    } else if (c === "-") {
      score += 4;
    }
  }
  score += 2;
  return score;
}

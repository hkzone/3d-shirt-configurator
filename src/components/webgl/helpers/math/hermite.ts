import lerp from './lerp';

export default function hermite(start: number, end: number, value: number): number {
  return lerp(start, end, value * value * (3 - 2 * value));
}

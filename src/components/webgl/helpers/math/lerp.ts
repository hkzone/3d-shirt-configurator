// https://en.wikipedia.org/wiki/Linear_interpolation
export default function lerp(x: number, y: number, t: number) {
  return (1 - t) * x + t * y;
}

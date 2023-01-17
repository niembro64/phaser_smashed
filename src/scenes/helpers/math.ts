import { Position } from '../interfaces';

export function normalRandom(mean: number = 0, stdev: number = 1) {
  let u, v, s;
  do {
    u = 2 * Math.random() - 1;
    v = 2 * Math.random() - 1;
    s = u * u + v * v;
  } while (s >= 1 || s === 0);
  s = Math.sqrt((-2 * Math.log(s)) / s);
  return mean + stdev * u * s;
}

export function getDistanceFromOrigin(end: Position, start: Position): number {
  return Math.sqrt(Math.pow(end.x - start.x, 2) + Math.pow(end.y - start.y, 2));
}

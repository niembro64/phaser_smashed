import { Vector } from 'matter';
import Game from '../Game';
import { getNormalizedVector } from './damage';

export function updateChompSpriteDirection(game: Game): void {
  let c = game.chomp;

  if (c.sprite.body.velocity.x > 0) {
    c.sprite.flipX = false;
  } else if (c.sprite.body.velocity.x < 0) {
    c.sprite.flipX = true;
  }
}

export function updateChompVelocity(game: Game): void {
  let c = game.chomp;
  let b = c.sprite.body;
  let x = c.originX;
  let y = c.originY;
  let r = c.radius;

  let spriteX = c.sprite.x;
  let spriteY = c.sprite.y;

  if (!isChompInsideCircle(game)) {
    let { x: xNew, y: yNew } = getNormalizedVector(spriteX, spriteY, x, y);

    b.setVelocityX(xNew * 200);
    b.setVelocityY(yNew * 200);
    return;
  }

  if (Math.random() * 100 > 1) {
    return;
  }

  let randomX = Math.random() * r * 2 - r + x;
  let randomY = getCircleYfromX(randomX, game);

  // console.log('randomX: ', randomX, 'randomY: ', randomY);

  let { x: xNew, y: yNew } = getNormalizedVector(
    spriteX,
    spriteY,
    randomX,
    randomY
  );

  console.log('xNew: ', xNew, 'yNew: ', yNew, '');

  if (isChompInsideCircle(game)) {
    b.setVelocityX(xNew * 200);
    if (b.touching.down) {
      b.setVelocityY(-1 * Math.abs(yNew) * 1000);
    }
  }
}

export function isChompInsideCircle(game: Game): boolean {
  let c = game.chomp;
  let x = c.sprite.x;
  let y = c.sprite.y;
  let originX = c.originX;
  let originY = c.originY;
  let radius = c.radius;

  let distance = Math.sqrt(
    (x - originX) * (x - originX) + (y - originY) * (y - originY)
  );

  return distance < radius;
}

export function getCircleYfromX(x: number, game: Game): number {
  let c = game.chomp;
  let originX = c.originX;
  let originY = c.originY;
  let radius = c.radius;
  let y;

  // set y to the y value of the circle at x
  y = Math.sqrt(radius * radius - (x - originX) * (x - originX)) + originY;

  return y;
}

export function updateChomp(game: Game): void {
  updateChompSpriteDirection(game);
  updateChompVelocity(game);
}

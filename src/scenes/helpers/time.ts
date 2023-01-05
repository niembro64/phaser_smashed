import Game from '../Game';

export function setMotionSlow(game: Game, speed: number = 2): void {
  game.tweens.timeScale = speed;
  game.physics.world.timeScale = speed;
  game.time.timeScale = speed;
}

export function setMotionNormal(game: Game): void {
  game.tweens.timeScale = 1;
  game.physics.world.timeScale = 1;
  game.time.timeScale = 1;
}

export function updateMotionSpeed(game: Game): void {
  if (isAnyExplosionActive(game)) {
    setMotionSlow(game);
  } else {
    setMotionNormal(game);
  }
}

export function isAnyExplosionActive(game: Game): boolean {
  let found = false;
  game.chomp.darknessMoments.explosions.forEach((e, eIndex) => {
    if (e.sprite.anims.isPlaying) {
      found = true;
    }
  });
  return found;
}

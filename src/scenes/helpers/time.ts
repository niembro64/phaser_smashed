import Game from '../Game';

export function updateTimeSlowdown(game: Game): void {
  if (!game.debug.SlowMoExplosions) {
    return;
  }

  let actualSlowdown: number;
  if (game.motionSlowdown > 3) {
    actualSlowdown = 3;
  } else {
    actualSlowdown = game.motionSlowdown;
  }

  game.tweens.timeScale = actualSlowdown;
  game.physics.world.timeScale = actualSlowdown;
  game.time.timeScale = actualSlowdown;

  game.motionSlowdown = game.motionSlowdown * 0.95 + 0.05;
  // console.log('game.motionSlowdown', game.motionSlowdown);
  // console.log('actualSlowdown', actualSlowdown);
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

export function addToMotionSlowdown(amount: number, game: Game): void {
  game.motionSlowdown *= amount;
}

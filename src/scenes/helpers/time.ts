import Game from '../Game';

export function updateTimeSlowdown(game: Game): void {
  game.tweens.timeScale = game.motionSlowdown;
  game.physics.world.timeScale = game.motionSlowdown;
  game.time.timeScale = game.motionSlowdown;

  game.motionSlowdown = game.motionSlowdown * 0.9 + 0.1;
  // console.log('game.motionSlowdown', game.motionSlowdown);
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

import Game from '../Game';
import {
  Player,
  PowerStateCharacterName,
  PowerStateChompName,
  xyVector,
} from '../interfaces';

// export function setPowerDarkToPlayer(
//   player: Player,
//   playerIndex: number,
//   game: Game
// ): void {
//   game.chomp.emitterDark.active = false;
//   // game.chomp.emitterDark.on = false;

//   game.players.forEach((pj, pjIndex) => {
//     if (pjIndex === playerIndex) {
//       pj.emitterDark.active = true;
//       // pj.emitterDark.on = true;
//     } else {
//       pj.emitterDark.active = false;
//       // pj.emitterDark.on = false;
//     }
//   });
// }

// export function setPowerDarkToChomp(game: Game): void {
//   game.chomp.emitterDark.active = true;
//   game.chomp.emitterDark.on = true;

//   game.players.forEach((p, pIndex) => {
//     p.emitterDark.active = false;
//     p.emitterDark.on = false;
//   });
// }

export function setPlayerPowerState(
  stateName: PowerStateCharacterName,
  player: Player,
  game: Game
): void {
  let p = player;
  let curr = p.char.powerStateCurr;
  let prev = p.char.powerStatePrev;

  if (stateName === curr.name) {
    return;
  }

  // console.log(player.char.name, 'curr.name', curr.name, 'prev.name', prev.name);

  prev.name = curr.name;
  prev.gameStamp = curr.gameStamp;

  curr.name = stateName;
  curr.gameStamp = game.gameNanoseconds;

  switch (curr.name) {
    case 'none':
      if (!getDoesAPlayerHaveDark(game)) {
        setChompPowerState('dark', game);
      }
      // p.emitterDark.active = false;
      // p.emitterDark.on = false;
      p.emitterDark.visible = false;
      break;
    case 'dark':
      // p.emitterDark.active = true;
      // p.emitterDark.on = true;
      p.emitterDark.visible = true;
      game.chomp.darknessMoments.passed = game.gameNanoseconds;
      break;
    case 'light':
      // p.emitterDark.active = false;
      // p.emitterDark.on = false;
      p.emitterDark.visible = false;
      break;
  }
}
export function setChompPowerState(
  stateName: PowerStateChompName,
  game: Game
): void {
  let c = game.chomp;
  let curr = c.powerStateCurr;
  let prev = c.powerStatePrev;

  if (stateName === curr.name) {
    return;
  }

  prev.name = curr.name;
  prev.gameStamp = curr.gameStamp;

  curr.name = stateName;
  curr.gameStamp = game.gameNanoseconds;

  switch (curr.name) {
    case 'none':
      // c.emitterDark.active = false;
      // c.emitterDark.on = false;
      c.emitterDark.visible = false;

      c.darknessMoments.chomp = game.gameNanoseconds;
      c.sprite.play('chompanimation_walking');

      break;
    case 'dark':
      // c.emitterDark.active = true;
      // c.emitterDark.on = true;
      c.emitterDark.visible = true;

      c.darknessMoments.chomp = game.gameNanoseconds;
      c.sprite.play('chompanimation_chomping');
      break;
  }
}

export function getDoesAPlayerHaveDark(game: Game): boolean {
  let found = false;

  game.players.forEach((player, playerIndex) => {
    if (player.char.powerStateCurr.name === 'dark') {
      found = true;
    }
  });

  return found;
}

export function getHasBeenGameDurationSinceMoment(
  durationNano: number,
  moment: number,
  game: Game
): boolean {
  // console.log(
  //   "duration",
  //   durationNano,
  //   "moment",
  //   moment,
  //   "gameTime",
  //   game.gameNanoseconds
  // );
  if (game.gameNanoseconds > moment + durationNano) {
    return true;
  }
  return false;
}

export function updatePlayerDarknessEvents(game: Game): void {
  game.players.forEach((player, playerIndex) => {
    if (player.char.powerStateCurr.name === 'dark') {
      let s = player.char.sprite;
      let b = player.char.sprite.body;
      let pj = game.chomp.darknessMoments.PERCENT_DARKNESS_JUMP;

      // player.char.damage += 1 / 120;

      if (Math.random() > 1 - pj) {
        playNextExplosion(s.x, s.y, game);

        let amount =
          400 +
          Math.pow(
            game.gameNanoseconds - game.chomp.darknessMoments.chomp,
            0.7
          ) *
            Math.pow(Math.random(), 0.4);

        // console.log('amount', amount);
        let { x, y } = getRandomUnitVector();
        // game.SOUND_HIT.play();

        player.char.damage += amount / 200;
        b.setVelocityX(b.velocity.x + x * amount);
        b.setVelocityY(b.velocity.y + y * amount);
      }
    }
  });
}

export function playNextExplosion(x: number, y: number, game: Game): void {
  let c = game.chomp;
  let eIndex = c.darknessMoments.explosionsIndex;
  let eArr = c.darknessMoments.explosions;

  game.chomp.darknessMoments.explosionsIndex = (eIndex + 1) % eArr.length;

  eArr[eIndex].sprite.x = x;
  eArr[eIndex].sprite.y = y;

  // eArr[eIndex].sprite.anims.stop();
  eArr[eIndex].sprite.anims.play('explsionanimation');
  eArr[eIndex].sound.play();
}

export function getRandomUnitVector(): xyVector {
  let xPositive = Math.random() > 0.5 ? 1 : -1;
  let yPositive = Math.random() > 0.5 ? 1 : -1;

  let randX = xPositive * Math.random();

  let randY = Math.sqrt(1 - randX * randX) * yPositive;

  return { x: randX, y: randY };
}

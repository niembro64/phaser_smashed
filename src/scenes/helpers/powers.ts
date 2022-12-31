import Game from "../Game";
import {
  Player,
  PowerStateCharacter,
  PowerStateCharacterName,
  PowerStateChompName,
} from "../interfaces";

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

  console.log(player.char.name, "curr.name", curr.name, "prev.name", prev.name);

  prev.name = curr.name;
  prev.gameStamp = curr.gameStamp;

  curr.name = stateName;
  curr.gameStamp = game.gameNanoseconds;

  switch (curr.name) {
    case "none":
      if (!getDoesAPlayerHaveDark(game)) {
        setChompPowerState("dark", game);
      }
      // p.emitterDark.active = false;
      // p.emitterDark.on = false;
      p.emitterDark.visible = false;
      break;
    case "dark":
      // p.emitterDark.active = true;
      // p.emitterDark.on = true;
      p.emitterDark.visible = true;
      game.chomp.darknessMoments.passed = game.gameNanoseconds;
      break;
    case "light":
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
    case "none":
      // c.emitterDark.active = false;
      // c.emitterDark.on = false;
      c.emitterDark.visible = false;

      c.darknessMoments.chomp = game.gameNanoseconds;
      break;
    case "dark":
      // c.emitterDark.active = true;
      // c.emitterDark.on = true;
      c.emitterDark.visible = true;

      c.darknessMoments.chomp = game.gameNanoseconds;
      break;
  }
}

export function getDoesAPlayerHaveDark(game: Game): boolean {
  let found = false;

  game.players.forEach((player, playerIndex) => {
    if (player.char.powerStateCurr.name === "dark") {
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
  console.log(
    "duration",
    durationNano,
    "moment",
    moment,
    "gameTime",
    game.gameNanoseconds
  );
  if (game.gameNanoseconds > moment + durationNano) {
    return true;
  }
  return false;
}
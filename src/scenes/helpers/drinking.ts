import { BooleanLiteral } from "typescript";
import Game from "../Game";
import { Player } from "../interfaces";
import { playerGrabAttackEnergy } from "./pad";

export function isScreenClear(game: Game): boolean {
// is there three people currently dead
  let numPlayersDied = 0;
  let temp = 0;
  for (let i = 0; i < game.PLAYER_CHOICES.length; i++) {
    for (let j = 0; j < game.PLAYER_CHOICES.length; j++) {
      temp += game.numberKilledByMatrix[i][j];
    }
    if (temp > 0) {
      numPlayersDied++;
    }
    temp = 0;
  }

  if (isAnyPlayerCurrentlyDead(game) && numPlayersDied === 1) {
    return true;
  }

  return false;
}
export function isFirstBlood(game: Game): boolean {
  // is there only one player who has died
  let numPlayersDied = 0;
  let temp = 0;
  for (let i = 0; i < game.PLAYER_CHOICES.length; i++) {
    for (let j = 0; j < game.PLAYER_CHOICES.length; j++) {
      temp += game.numberKilledByMatrix[i][j];
    }
    if (temp > 0) {
      numPlayersDied++;
    }
    temp = 0;
  }

  if (isAnyPlayerCurrentlyDead(game) && numPlayersDied === 1) {
    return true;
  }

  return false;
}

export function isAnyPlayerCurrentlyDead(game: Game): boolean {
  for (let i = 0; i < game.PLAYER_CHOICES.length; i++) {
    if (game.players[i].state.name === "dead") {
      return true;
    }
  }
  return false;
}

export function addToShotsMatrix(
  player: Player,
  playerIndex: number,
  game: Game
): void {
  if (player.state.name !== "dead") {
    return;
  }
  let hit: boolean = false;
  game.players.forEach((pj, j) => {
    if (game.wasLastHitByMatrix[playerIndex][j]) {
      game.numberShotsTakenByMatrix[playerIndex][j]++;
      hit = true;
    }
  });
  if (!hit) {
    game.numberShotsTakenByMatrix[playerIndex][playerIndex]++;
  }
}

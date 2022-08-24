import { BooleanLiteral } from "typescript";
import Game from "../Game";
import { Player } from "../interfaces";

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
  return numPlayersDied === 1 ? true : false;
}

export function updateShotsMatrix(
  player: Player,
  playerIndex: number,
  game: Game
): void {}

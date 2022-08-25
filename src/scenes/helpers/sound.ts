import Game from "../Game";
import { longEnoughTime } from "./state";

export function pauseWiiMusic(game: Game): void {
  game.SOUND_MII.pause();
}
export function playWiiMusic(game: Game): void {
  if (game.SOUND_MII.isPlaying) {
    return;
  }
  if (longEnoughTime(game.DURATION_GAME_PAUSE_MUSIC, game)) {
    game.SOUND_MII.play();
  }
}

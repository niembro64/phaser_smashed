import Game from "../Game";
import { longEnoughTime } from "./state";

export function pauseWiiMusic(game: Game): void {
  game.SOUND_PAUSED.pause();
}
export function playWiiMusic(game: Game): void {
  // if (game.SOUND_MII.isPlaying()) {
  //   return;
  // }
  if (longEnoughTime(game.DURATION_GAME_PAUSE_MUSIC, game)) {
    game.SOUND_PAUSED.play();
  }
}
export function pauseBGMusic(game: Game): void {
  game.SOUND_BGM.pause();
}
export function playBGMusic(game: Game): void {
  // if (game.SOUND_MII.isPlaying()) {
  //   return;
  // }
  game.SOUND_BGM.play();
}
export function resumeBGMusic(game: Game): void {
  // if (game.SOUND_MII.isPlaying()) {
  //   return;
  // }
  game.SOUND_BGM.resume();
}

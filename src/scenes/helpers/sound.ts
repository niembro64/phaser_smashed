import Game from "../Game";
import { longEnoughTime } from "./state";

export function pauseWiiMusic(game: Game): void {
  game.SOUND_PAUSED.pause();
}
export function playWiiMusic(game: Game): void {
  if (game.SOUND_PAUSED.isPlaying) {
    return;
  }
  console.log(
    "ENOUGH TIME",
    longEnoughTime(game.DURATION_GAME_PAUSE_MUSIC_SHORT, game)
  );
  if (longEnoughTime(game.DURATION_GAME_PAUSE_MUSIC_SHORT, game)) {
    game.SOUND_PAUSED.play();
  }
}
export function playWiiMusicWait(game: Game): void {
  if (game.SOUND_PAUSED.isPlaying) {
    return;
  }

  if (longEnoughTime(game.DURATION_GAME_PAUSE_MUSIC_LONG, game)) {
    game.SOUND_PAUSED.play();
  }
}
export function pauseMusic(game: Game): void {
  game.SOUND_BGM.pause();
}
export function playBGMusic(game: Game): void {
  // if (game.SOUND_MII.isPlaying()) {
  //   return;
  // }
  game.SOUND_BGM.play();
}
export function resumeMusic(game: Game): void {
  // if (game.SOUND_MII.isPlaying()) {
  //   return;
  // }
  game.SOUND_BGM.resume();
}
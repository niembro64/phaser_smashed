import Game from "../Game";
import { Player } from "../interfaces";
import { getLongEnoughTimeDuration } from "./state";

export function setSoundDiePlay(game: Game): void {
  game.SOUND_DIE.play();
}
export function setSoundFinishPlay(game: Game): void {
  game.ENERJA_FINISH.play();
}
export function setSoundFirstBloodPlay(game: Game): void {
  game.SOUND_FIRST_BLOOD.play();
}
export function setSoundProfoundPlay(game: Game): void {
  game.SOUND_INTRO.play();
}
export function setSoundSquishPlay(game: Game): void {
  game.SOUND_SQUISH.play();
}
export function setSoundEnerjaPlay(game: Game): void {
  game.ENERJA_SMASHED.play();
}
export function setSoundStartPlayLiquid(game: Game): void {
  game.SOUND_START_LIQUID.play();
}
export function setSoundStartPlay(game: Game): void {
  if (game.timeSecondsClock > 0) {
    game.SOUND_START.play();
  }
}
export function setPauseWiiMusic(game: Game): void {
  game.SOUND_PAUSED.pause();
}
export function playWiiMusic(game: Game): void {
  if (game.SOUND_PAUSED.isPlaying) {
    return;
  }
  game.SOUND_PAUSED.play();
}
export function setPlayWiiMusicWaitShort(game: Game): void {
  if (game.SOUND_PAUSED.isPlaying) {
    return;
  }
  console.log(
    "ENOUGH TIME",
    getLongEnoughTimeDuration(game.DURATION_GAME_PAUSE_MUSIC_SHORT, game)
  );
  if (getLongEnoughTimeDuration(game.DURATION_GAME_PAUSE_MUSIC_SHORT, game)) {
    game.SOUND_PAUSED.play();
  }
}
export function setPlayWiiMusicWaitLong(game: Game): void {
  if (game.SOUND_PAUSED.isPlaying) {
    return;
  }

  if (getLongEnoughTimeDuration(game.DURATION_GAME_PAUSE_MUSIC_LONG, game)) {
    game.SOUND_PAUSED.play();
  }
}
export function setMusicPause(game: Game): void {
  game.SOUND_BGM.pause();
}
export function setMusicPlay(game: Game): void {
  // if (game.SOUND_MII.isPlaying()) {
  //   return;
  // }
  game.SOUND_BGM.play();
}
export function setMusicResume(game: Game): void {
  // if (game.SOUND_MII.isPlaying()) {
  //   return;
  // }
  game.SOUND_BGM.resume();
}

export function playReadySound(game: Game): void {
  if (!game.SOUND_READY_REPEAT.isPlaying) {
    game.SOUND_READY_REPEAT.play();
  }
}

export function pauseReadySound(game: Game): void {
  if (game.SOUND_READY_REPEAT.isPlaying) {
    game.SOUND_READY_REPEAT.pause();
  }
}
export function playReadySoundPlayer(player: Player): void {
  // console.log("PLAY READY SOUND ", player.playerId);
  if (!player.playerReadySound.isPlaying) {
    player.playerReadySound.play();
  }
}

export function pauseReadySoundPlayer(player: Player): void {
  // console.log("PLAY READY SOUND ", player.playerId);
  if (player.playerReadySound.isPlaying) {
    player.playerReadySound.pause();
  }
}

export function setPauseAllReadySounds(game: Game): void {
  game.players.forEach((player, playerIndex) => {
    pauseReadySoundPlayer(player);
  });
}

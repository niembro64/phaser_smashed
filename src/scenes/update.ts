import Game from "./Game";
import { updateCamera } from "./helpers/camera";
import {
  controllerMovement,
  controllerSetFast,
  updatePadPrevious,
  assignGamePadsConnected,
  attackEnergy,
  updateAttackEnergyFrictionGroundRotation,
  updateAttackEnergyFrictionWall,
  updateAttackEnergyFrictionGroundMovement,
} from "./helpers/pad";
import {
  jump,
  frictionGroundX,
  frictionAirX,
  frictionAirY,
  frictionWallY,
  updateWallTouchArray,
  updateLastDirectionTouched,
  updateKeepOnScreenLREnergyAttack,
  setRespawn,
  hitThenFly,
  isPlayerOffscreen,
} from "./helpers/movement";
import { setSpriteOpaque, updateSpritesLR } from "./helpers/sprites";
import { goToState, isPlayerHit, resetAllHitboxes } from "./helpers/state";
import { updateText } from "./helpers/text";
import { Player } from "./interfaces";
import { setSpriteTransparent } from "./helpers/sprites";

export function update(game: Game): void {
  // game.text = game.timer.actualFps;
  // console.log(game.timer);
  // console.log(game.players[0].state);

  // BEFORE PLAYERS
  assignGamePadsConnected(game);
  updateWallTouchArray(game);
  updateCamera(game);
  updateSpritesLR(game);
  updateText(game);
  updateAttackEnergyFrictionGroundRotation(game);
  updateAttackEnergyFrictionGroundMovement(game);
  updateAttackEnergyFrictionWall(game);
  updateKeepOnScreenLREnergyAttack(game);
  // updateEnergyAttacksScreenWrap(game);

  // PLAYERS
  updatePlayers(game);

  // AFTER PLAYERS
  updatePadPrevious(game);
  console.log(game.hitboxOverlap[0]);
  resetAllHitboxes(game);
}

export function updatePlayers(game: Game): void {
  // for (let i = 0; i < 4; i++) {
  //   for (let j = 0; j < 4; j++) {
  //     if (game.hitboxOverlap[i][j] === true) {
  //       console.log(game.hitboxOverlap);
  //     }
  //   }
  // }

  // printAllPadsActive(player, game);
  game.players.forEach((player, playerIndex) => {
    // if (playerIndex === 0) {
    //   console.log(player.playerNumber, player.char.name, player.state);
    // }
    switch (player.state) {
      case "start":
        ////////////////////////////////
        ///////// WHILE IN LOOP
        ////////////////////////////////
        setSpriteTransparent(player);

        ////////////////////////////////
        ///////// timeout => dead
        ////////////////////////////////
        setTimeout(() => {
          player.char.sprite.body.allowGravity = true;
          setSpriteOpaque(player);
          goToState(player, "alive");
        }, game.START_DELAY_DURATION);

        break;
      case "alive":
        ////////////////////////////////
        ///////// WHILE IN LOOP
        ////////////////////////////////
        setSpriteOpaque(player);
        player.char.sprite.body.allowGravity = true;

        attackEnergy(player, game);
        updateLastDirectionTouched(player);
        controllerSetFast(player, game);
        frictionGroundX(player, game);
        frictionAirX(player, game);
        frictionWallY(player, game);
        frictionAirY(player, game);
        jump(player, game);

        controllerMovement(player, game);
        if (isPlayerHit(playerIndex, game)) {
          console.log("HIT", player.char.name);
          player.char.sprite.body.allowGravity = false;
          hitThenFly(player, game);
          goToState(player, "hurt");
        }
        ////////////////////////////////
        ///////// timeout => air
        ////////////////////////////////
        if (isPlayerOffscreen(player, game)) {
          setSpriteTransparent(player);
          goToState(player, "dead");
          setRespawn(player, game);
        }

        break;
      case "hurt":
        ////////////////////////////////
        ///////// WHILE IN LOOP
        ////////////////////////////////

        ////////////////////////////////
        ///////// timeout => alive
        ////////////////////////////////

        ////////////////////////////////
        ///////// offscreen => dead
        ////////////////////////////////
        setTimeout(() => {
          if (isPlayerOffscreen(player, game)) {
            setSpriteTransparent(player);
            setRespawn(player, game);
            goToState(player, "dead");
          } else {
            setSpriteOpaque(player);
            player.char.sprite.body.allowGravity = true;
            goToState(player, "alive");
          }
        }, game.HURT_DURATION);

        break;
      case "dead":
        ////////////////////////////////
        ///////// WHILE IN LOOP
        ////////////////////////////////

        ////////////////////////////////
        ///////// timeout => alive
        ////////////////////////////////
        setTimeout(() => {
          player.char.sprite.body.allowGravity = true;
          goToState(player, "alive");
        }, game.DEAD_DURATION);

        break;
    }
  });
}

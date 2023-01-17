import Game, { SCREEN_DIMENSIONS } from '../Game';
import { Debug, Player, Position, Velocity } from '../interfaces';
import { getDistanceFromOrigin } from './math';

export class Bullet extends Phaser.Physics.Arcade.Sprite {
  constructor(game: Game, x: number, y: number, key: string, rotation: number) {
    super(game, x, y, key);

    // let ae = player.char.attackEnergy;
    // this.setScale(0.3);
    // this.setScale(ae.scale);
    this.setRotation(rotation);

    // game.physics.add.collider(this, game.PLATFORMS);

    // for (let i = 0; i < game.players.length; i++) {
    //   game.physics.add.collider(this, game.players[i].char.sprite);
    //   game.physics.add.collider(this, game.players[i].char.attackEnergy.sprite);
    //   game.physics.add.collider(
    //     this,
    //     game.players[i].char.attackPhysical.sprite
    //   );
    // }

    // game.physics.add.collider(this, game.chomp.sprite);
    // game.physics.add.collider(this, game.TABLE);
    this.screen = SCREEN_DIMENSIONS;
    this.debug = game.debug;
  }

  screen: any = null;
  debug: Debug | null = null;

  shootGameStamp: number = 0;

  Y_RANDOM: number = -50;
  Y_ADDER: number = -10;
  floatVelocityY: number = 0;
  timeAlive: number = 0;
  initialPosition: Position = { x: 0, y: 0 };

  fire(pos: Position, vel: Velocity, game: Game): void {
    this.initialPosition = { x: pos.x, y: pos.y };
    this.timeAlive = 0;
    this.body.reset(pos.x, pos.y);
    this.floatVelocityY = this.Y_ADDER + this.Y_RANDOM * Math.random();
    // this.floatVelocityY = this.FLOAT_VELOCITY_Y * normalRandom(0.5, 0.2);

    this.body.bounce.set(1);
    this.setActive(true);
    this.setVisible(true);

    this.setVelocityY(vel.y);
    this.setVelocityX(vel.x);
  }

  preUpdate(time: number, delta: number): void {
    super.preUpdate(time, delta);

    this.timeAlive += delta;
    // this.setScale((500 - this.timeAlive) / 500);

    // if (
    //   this.y <= 0 ||
    //   this.y >= sd.HEIGHT ||
    //   this.x <= 0 ||
    //   this.x >= sd.WIDTH
    // ) {
    //   this.body.bounce.set(0);
    //   this.setActive(false);
    //   this.setVisible(false);
    //   this.x = -100;
    //   this.y = -100;
    //   this.setVelocityX(0);
    //   this.setVelocityY(0);
    // }

    let distance = getDistanceFromOrigin(
      { x: this.x, y: this.y },
      this.initialPosition
    );

    // console.log('distance', distance);

    if (this.debug?.BulletsFullScreen) {
      if (
        this.x > this.screen.WIDTH ||
        this.x < 0 ||
        this.y > this.screen.HEIGHT ||
        this.y < 0
      ) {
        this.body.bounce.set(0);
        this.setActive(false);
        this.setVisible(false);
        this.x = -100;
        this.y = -100;
        this.setVelocityX(0);
        this.setVelocityY(0);
      }
      return;
    }

    // if (this.timeAlive > 500) {
    // if (this.timeAlive > 1000 || distance > 200) {
    if (distance > 350) {
      this.body.bounce.set(0);
      this.setActive(false);
      this.setVisible(false);
      this.x = -100;
      this.y = -100;
      this.setVelocityX(0);
      this.setVelocityY(0);
    }
  }
}

export class Bullets extends Phaser.Physics.Arcade.Group {
  constructor(game: Game, player: Player) {
    super(game.physics.world, game);

    let ae = player.char.attackEnergy;

    this.createMultiple({
      frameQuantity: ae.attackBullets?.NUMBER_BULLETS || 10,
      key: ae.srcImage,
      active: false,
      visible: false,
      classType: Bullet,
      setRotation: ae.rotation,
    });

    // game.physics.add.collider(this, game.PLATFORMS);

    // for (let i = 0; i < game.players.length; i++) {
    //   game.physics.add.collider(this, game.players[i].char.sprite);
    //   game.physics.add.collider(this, game.players[i].char.attackEnergy.sprite);
    //   game.physics.add.collider(
    //     this,
    //     game.players[i].char.attackPhysical.sprite
    //   );
    // }

    // game.physics.add.collider(this, game.chomp.sprite);
    // game.physics.add.collider(this, game.TABLE);
  }

  numSkip = 0;

  fireBullet(
    pos: Position,
    vel: Velocity,
    player: Player,
    firstFire: boolean,
    game: Game
  ): void {
    if (firstFire) {
      this.numSkip = 0;
    }
    if (this.numSkip !== 0) {
      this.numSkip--;
      return;
    }

    let pbs = player.char.attackEnergy.attackBullets;

    this.numSkip = 3;

    let bullet = this.getFirstDead(false);
    if (bullet) {
      // bullet.bouncePlatforms = true;
      // bullet.bounceWorldBounds = false;
      // bullet.bounceX = 1;
      // bullet.bounceY = 1;

      bullet.fire(pos, vel, game);
      if (pbs?.soundB1) {
        if (Math.random() > 0.5) {
          pbs.soundB1.rate = 1 + 0.03 * Math.random();
          pbs.soundB1.play();
        } else {
          pbs.soundB2.rate = 1 + 0.03 * Math.random();
          pbs.soundB2.play();
        }

        if (Math.random() > 0.5) {
          pbs.soundP1.rate = 1 + 0.03 * Math.random();
          pbs.soundP1.play();
        } else {
          pbs.soundP2.rate = 1 + 0.03 * Math.random();
          pbs.soundP2.play();
        }
      }
    }
  }
}

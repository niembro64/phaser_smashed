import Game from '../Game';
import { Player, Position, Velocity } from '../interfaces';

export class Bullet extends Phaser.Physics.Arcade.Sprite {
  constructor(game: Game, x: number, y: number) {
    super(game, x, y, 'mirror');

    // this.setScale(0.3);

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

  shootGameStamp: number = 0;

  Y_RANDOM: number = -50;
  Y_ADDER: number = -10;
  floatVelocityY: number = 0;
  timeAlive: number = 0;
  initialPosition: Position = { x: 0, y: 0 };

  fire(pos: Position, vel: Velocity): void {
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

    if (this.timeAlive > 1000 || distance > 200) {
    // if (distance > 200) {
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

export function getDistanceFromOrigin(end: Position, start: Position): number {
  return Math.sqrt(Math.pow(end.x - start.x, 2) + Math.pow(end.y - start.y, 2));
}

export class Bullets extends Phaser.Physics.Arcade.Group {
  constructor(game: Game, player: Player) {
    super(game.physics.world, game);

    this.createMultiple({
      frameQuantity: player.char.attackEnergy.bullets?.NUMBER_BULLETS || 10,
      key: 'bullet',
      active: false,
      visible: false,
      classType: Bullet,
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

  // numSkip = 3;

  fireBullet(pos: Position, vel: Velocity): void {
    // if (this.numSkip !== 0) {
    //   this.numSkip--;
    //   return;
    // }

    // this.numSkip = 10;

    let bullet = this.getFirstDead(false);
    if (bullet) {
      // bullet.bouncePlatforms = true;
      // bullet.bounceWorldBounds = false;
      // bullet.bounceX = 1;
      // bullet.bounceY = 1;

      bullet.fire(pos, vel);
    }
  }
}

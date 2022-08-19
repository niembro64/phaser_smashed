import { Key } from "react";

export interface Location {
  x: number;
  y: number;
  zoom: number;
}

export interface CameraHelper {
  helper: any;
  helperState: Location | any;
}

export interface Player {
  playerNumber: number;
  text: string | any;
  state: string;
  keyboard_static: Keyboard;
  char: Char;
  keyboard: Keyboard | any;
  pad: Gamepad | any;
  padPrev: padStatePrevious;
}

export interface Color {
  primary: string;
  secondary: string;
  dark: string;
  light: string;
}
export interface Camera {
  char: CameraChar;
}

export interface CameraChar {
  name: string;
  src: string;
  sprite: any | Phaser.GameObjects.Sprite;
  zoom: number;
}

export interface padStatePrevious {
  up: boolean;
  down: boolean;
  left: boolean;
  right: boolean;
  A: boolean;
  B: boolean;
  X: boolean;
  Y: boolean;
}

export interface Keyboard {
  up: Key;
  down: Key;
  left: Key;
  right: Key;
  fast: Key;
  jump: Key;
}

export interface Char {
  name: string;
  color: Color;
  src: string;
  sprite: any | Phaser.GameObjects.Sprite;
  zoom: number;
  vel: { x: number; y: number };
  pos: { x: number; y: number };
  jumps: number[];
  jumpPower: number;
  jumpIndex: number;
  damage: number;
  speed: number;
  fast: number;
  friction_ground: number;
  friction_air: number;
  wallTouchArray: boolean[];
  lastDirectionTouched: "up" | "down" | "left" | "right" | "camera" | null;
  attackEnergy: AttackEnergy;
  initializeCharPosition: InitializeCharPosition;
}

export interface InitializeCharPosition {
  lookingRight: boolean;
  x: number;
  y: number;
}

export interface AttackPhysical {
  sprite: any | Phaser.GameObjects.Sprite;
  damage: number;
}

export interface AttackEnergyRotation {
  initial: number;
  speed: number;
}

export interface Velocity {
  x: number;
  y: number;
}
export interface PosFromCenter {
  x: number;
  y: number;
}
export interface AttackEnergyFriction {
  air: number;
  ground: number;
  stickWall: boolean;
}
export interface AttackEnergy {
  sprite: any | Phaser.GameObjects.Sprite;
  posFromCenter: PosFromCenter;
  friction: AttackEnergyFriction;
  vel: Velocity;
  srcImage: string;
  bounceY: number;
  bounceX: number;
  gravity: boolean;
  walls: boolean;
  damage: number;
  scale: number;
  mass: number;
  allowVelocityY: boolean;
  rotation: AttackEnergyRotation;
}
// export interface Keyboard_Static {
//     up: typeof Phaser.Input.Keyboard.Key | any;
//     down: typeof Phaser.Input.Keyboard.Key | any;
//     left: typeof Phaser.Input.Keyboard.Key | any;
//     right: typeof Phaser.Input.Keyboard.Key | any;
//     fast: typeof Phaser.Input.Keyboard.Key | any;
//     jump: typeof Phaser.Input.Keyboard.Key | any;
// }

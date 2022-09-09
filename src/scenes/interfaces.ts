import { Key } from 'react';

export interface Clock {
  minutes: number;
  seconds: number;
}

export interface Loc {
  x: number;
  y: number;
  zoom: number;
}

export interface CameraHelper {
  helper: any;
  helperState: Loc | any;
}

export interface Player {
  playerNumber: number;
  shotGlass: any | Phaser.GameObjects.Sprite;
  scoreBoardUpper: string | any;
  scoreBoardLower: string | any;
  scoreBoardReady: string | any;
  state: State;
  keyboard_static: Keyboard;
  char: Char;
  keyboard: Keyboard | any;
  pad: Gamepad | any;
  padPrev: PadStatePrevious;
  padDebounced: PadStateDebounced;
  particles: any;
  emitterLight: any;
  emitterDark: any;
  emitterPlayer: any;
  emitterHurt: any;
  killCount: number;
  deathCount: number;
  shotCount: number;
  playerReadySound: any;
}

export interface Char {
  name: string;
  color: Color;
  colorFilter: boolean;
  src: string;
  scale: number; 
  sprite: any | Phaser.GameObjects.Sprite;
  shield: Shield | null;
  zoom: number;
  vel: { x: number; y: number };
  pos: { x: number; y: number };
  jumps: number[];
  jumpPower: number;
  jumpIndex: number;
  upB: UpB;
  damage: number;
  speed: number;
  fast: number;
  friction_ground: number;
  friction_air: number;
  wallTouchArray: boolean[];
  lastDirectionTouched: 'up' | 'down' | 'left' | 'right' | null;
  attackEnergy: AttackEnergy;
  initializeCharPosition: InitializeCharPosition;
}

export interface Shield {
  circle: Circle;
}

export interface Circle {
  graphic: any;
  colorNumber: number;
  colorString: string;
}

export interface State {
  name: string;
  gameStamp: number;
  timeStamp: number;
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

export interface PadStatePrevious {
  up: boolean;
  down: boolean;
  left: boolean;
  right: boolean;
  A: boolean;
  B: boolean;
  X: boolean;
  Y: boolean;
}

export interface PadStateDebounced {
  up: number;
  down: number;
  left: number;
  right: number;
  A: number;
  B: number;
  X: number;
  Y: number;
}

export interface Keyboard {
  up: Key;
  down: Key;
  left: Key;
  right: Key;
  fast: Key;
  jump: Key;
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

export interface UpB {
  canUse: boolean;
  y: number;
  x: number;
}

export interface Splash {
  text: any;
  name: string;
  size: string;
  word: string;
  color: string;
  backgroundColor: string;
  strokeThickness: number;
  src: string;
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
  wallInvertRotation: boolean;
  wallInvertSprite: boolean;
}
export interface AttackEnergy {
  sprite: any | Phaser.GameObjects.Sprite;
  state: 'held' | 'released';
  timestampThrow: number;
  durationBetweenThrows: number;
  posFromCenter: PosFromCenter;
  friction: AttackEnergyFriction;
  vel: Velocity;
  srcImage: string;
  bounceY: number;
  bounceX: number;
  gravity: boolean;
  walls: boolean;
  damage: number;
  hitback: Hitback;
  scale: number;
  mass: number;
  allowVelocityY: boolean;
  rotation: AttackEnergyRotation;
}

export interface Hitback {
  x: number;
  y: number;
}
// export interface Keyboard_Static {
//     up: typeof Phaser.Input.Keyboard.Key | any;
//     down: typeof Phaser.Input.Keyboard.Key | any;
//     left: typeof Phaser.Input.Keyboard.Key | any;
//     right: typeof Phaser.Input.Keyboard.Key | any;
//     fast: typeof Phaser.Input.Keyboard.Key | any;
//     jump: typeof Phaser.Input.Keyboard.Key | any;
// }

export interface Debug {
  level: number;
  useCameras: boolean;
  seeCameras: boolean;
  setCollidePlayerPlayers: boolean;
  setCollidePlayerEnergyAttacks: boolean;
  energyAttackWrapScreen: boolean;
  seePlayerCircles: boolean;
  playShotsWiiBGM: boolean;
  wallJumps: boolean;
  useBGM: boolean;
  BGMNumber: number;
  statsInit: boolean;
  useDefaultAttackDamage: boolean;
  useDefaultAttackHitback: boolean;
  useCircleColorsFilterCharacters: boolean;
  useReadySound: boolean;
}

export interface NormalizedVector {
  x: number;
  y: number;
}

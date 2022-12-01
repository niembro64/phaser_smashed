export type GameState =
  | 'game-state-start'
  | 'game-state-play'
  | 'game-state-paused'
  | 'game-state-first-blood'
  | 'game-state-screen-clear'
  | 'game-state-finished';

export type PlayerState =
  | 'player-state-start'
  | 'player-state-alive'
  | 'player-state-dead'
  | 'player-state-hurt';
export type AttackState =
  | 'attackphysical-state-on'
  | 'attackphysical-state-cooldown'
  | 'attackphysical-state-off';

export type SplashName =
  | 'splash-black'
  | 'splash-none'
  | 'splash-start'
  | 'splash-paused'
  | 'splash-first-blood'
  | 'splash-screen-clear'
  | 'splash-cool-down'
  | 'splash-finished';

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

export type InputType = 'wasd' | 'arrows' | 'snes' | 's-wired' | 's-pro';

export interface Player {
  playerId: number;
  shotGlass: any | Phaser.GameObjects.Sprite;
  scoreBoardUpper: string | any;
  scoreBoardLower: string | any;
  scoreBoardReady: string | any;
  scoreBoardController: string | any;
  state: PlayerStateWithTime;
  char: Char;
  inputType: InputType | any;
  keyboard: keyboard | any;
  gamepad: Gamepad | any;
  padCurr: GamepadData;
  padPrev: GamepadData;
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
  circleOffset: number;
}

export interface Char {
  name: string;
  color: Color;
  colorFilter: boolean;
  src: string;
  scaleCharSpriteImage: number;
  scaleCharSpriteReality: number;
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
  attackPhysical: AttackPhysical;
  attackEnergy: AttackEnergy;
  initializeCharPosition: InitializeCharPosition;
}

export interface Shield {
  circle: ColorCircle;
}

export interface ColorCircle {
  text: string;
  graphic: any;
  colorNumber: number;
  colorString: string;
}

export interface AttackStateWithTime {
  name: AttackState;
  gameStamp: number;
  timeStamp: number;
}
export interface PlayerStateWithTime {
  name: PlayerState;
  gameStamp: number;
  timeStamp: number;
}
export interface GameStateWithTime {
  name: GameState;
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

export interface GamepadData {
  up: boolean;
  down: boolean;
  left: boolean;
  right: boolean;
  A: boolean;
  B: boolean;
  X: boolean;
  Y: boolean;
  R: boolean;
  L: boolean;
  start: boolean;
  select: boolean;
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
  L: number;
  R: number;
  start: number;
  select: number;
}

// export interface Keyboard {
//   up: Key;
//   down: Key;
//   left: Key;
//   right: Key;
//   fast: Key;
//   jump: Key;
// }

export interface InitializeCharPosition {
  // lookingRight: boolean;
  x: number;
  y: number;
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

export interface SplashRules {
  text: any;
  name: SplashName;
  size: string;
  word: string;
  color: string;
  backgroundColor: string;
  shadowColor: string;
  strokeThickness: number;
  src: string;
}
export interface SplashEndData {
  textTitle: any;
  textCircles: any;
  textData: any;
  name: string;
  emoji: string;
  vertical: number;
  size: string;
  words: string[];
  color: string;
  backgroundColor: string;
  strokeThickness: number;
  blur: number;
  offsetY: number;
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

export interface AttackPhysical {
  sprite: any | Phaser.GameObjects.Sprite;
  state: AttackStateWithTime;
  durationAttack: number;
  durationCooldown: number;
  posFromCenter: PosFromCenter;
  damage: number;
  hitback: Hitback;
  srcImage: string;
  mass: number;
  scale: number;
  audio: any;
}

export interface AttackEnergy {
  sprite: any | Phaser.GameObjects.Sprite;
  state: 'held' | 'released' | 'returned';
  timestampThrow: number;
  durationCooldown: number;
  posFromCenter: PosFromCenter;
  friction: AttackEnergyFriction;
  vel: Velocity;
  srcImage: string;
  bounceY: number;
  bounceX: number;
  gravity: boolean;
  bouncePlatforms: boolean;
  damage: number;
  hitback: Hitback;
  scale: number;
  mass: number;
  allowVelocityY: boolean;
  rotation: AttackEnergyRotation;
  followOnOffscreen: boolean;
  followOnOffscreenOffset: { x: number; y: number };
  offscreenCurr: boolean;
  offscreenPrev: boolean;
  findAndFollowAcceleration: FindAndFollowAcceleration;
}

export interface FindAndFollowAcceleration {
  x: number;
  y: number;
}
export interface AttackEnergyFriction {
  air: number;
  ground: number;
  wallInvertRotation: boolean;
  wallInvertSprite: boolean;
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

// export interface Debug {
//   setLevel: number;
//   setDurationMinutes: number;
//   setMusicNumber: number;
//   setMusicActive: boolean;
//   setUpdateLoopsNumSkip: number;
//   setFrictionAirActive: boolean;
//   setCamerasActive: boolean;
//   setCamerasVisible: boolean;
//   setCollidersPvP: boolean;
//   setCollidersPvAttackPhysical: boolean;
//   setCollidersPvAttackEnergy: boolean;
//   setCollidersAEvAE: boolean;
//   setCollidersAEvAP: boolean;
//   setAEWrapScreen: boolean;
//   setPlayerIdVisible: boolean;
//   setPlayerIdFiltersActive: boolean;
//   setWallJumpsActive: boolean;
//   setDefaultDamage: boolean;
//   setDefaultHitback: boolean;
//   setReadySoundActive: boolean;
//   setHealthInverted: boolean;
//   setMatricesAlwaysVisible: boolean;
//   setPrintControllerButtonsConsole: boolean;
//   setPrintControllerConnectedConsole: boolean;
// }

export interface Vector {
  x: number;
  y: number;
}

export interface keyboard {
  up: any;
  down: any;
  left: any;
  right: any;
  A: any;
  B: any;
  X: any;
  Y: any;
  L: any;
  R: any;
  start: any;
  select: any;
}

//////////////////
// VIEW INTERFACES
//////////////////

export type CharacterId = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export type CharacterName =
  | 'Mario'
  | 'Link'
  | 'Pikachu'
  | 'Kirby'
  | 'Chez'
  | 'BlackChez'
  | 'GreenKoopa'
  | 'RedKoopa';

export interface SmashConfig {
  players: PlayerConfig[];
}

export interface PlayerConfig {
  name: CharacterName;
  characterId: CharacterId;
  scale: number;
}

export type WebState = 'start' | 'play';

export interface Quote {
  name: string;
  text: string;
}

export interface Debug {
  setLevel: number;
  setDurationMinutes: number;
  setMusicNumber: number;
  setMusicActive: boolean;
  setUpdateLoopsNumSkip: number;
  setFrictionAirActive: boolean;
  setCamerasActive: boolean;
  setCamerasVisible: boolean;
  setCollidersPvP: boolean;
  setCollidersPvAttackPhysical: boolean;
  setCollidersPvAttackEnergy: boolean;
  setCollidersAEvAE: boolean;
  setCollidersAEvAP: boolean;
  setAEWrapScreen: boolean;
  setPlayerIdVisible: boolean;
  setPlayerColorFilterStateNormalActive: boolean;
  setWallJumpsActive: boolean;
  setDefaultDamage: boolean;
  setDefaultHitback: boolean;
  setReadySoundActive: boolean;
  setHealthInverted: boolean;
  setMatricesAlwaysVisible: boolean;
  setPrintControllerButtonsConsole: boolean;
  setPrintControllerConnectedConsole: boolean;
  setLoadTimeExtra: boolean;
  setChezSecret: boolean;
  setIsDevMode: boolean;
}

export interface ButtonOnOff {
  state: boolean;
}

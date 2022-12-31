export interface CharacterMove {
  button: string;
  move: string;
  status: string;
}

export type ButtonName =
  | "See Other Projects"
  | "Back"
  | "ReStart"
  | "Controls"
  | "Controllers"
  | "Rules"
  | "Rules-N64"
  | "About"
  | "History"
  | "Options";

export type GameState =
  | "game-state-start"
  | "game-state-play"
  | "game-state-paused"
  | "game-state-first-blood"
  | "game-state-screen-clear"
  | "game-state-finished";

export type PlayerState =
  | "player-state-start"
  | "player-state-alive"
  | "player-state-dead"
  | "player-state-hurt";
export type AttackState =
  | "attackphysical-state-on"
  | "attackphysical-state-cooldown"
  | "attackphysical-state-off";

export type SplashName =
  | "splash-black"
  | "splash-none"
  | "splash-start"
  | "splash-paused"
  | "splash-first-blood"
  | "splash-screen-clear"
  | "splash-cool-down"
  | "splash-finished";

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
  playerId: number;
  shotGlass: any | Phaser.GameObjects.Sprite;
  scoreBoardUpper: string | any;
  scoreBoardLower: string | any;
  scoreBoardReady: string | any;
  scoreBoardController: string | any;
  state: PlayerStateWithTime;
  char: Char;
  inputType: InputType;
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
  shotsNow: number;
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
  lastDirectionTouched: "up" | "down" | "left" | "right" | null;
  attackPhysical: AttackPhysical;
  attackEnergy: AttackEnergy;
  initializeCharPosition: InitializeCharPosition;
  powerStateCurr: PowerStateCharacter;
  powerStatePrev: PowerStateCharacter;
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
  speedMultiplier: number;
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

export interface Acceleration {
  x: number;
  y: number;
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
  state: "held" | "released" | "returned";
  timestampThrow: number;
  durationCooldown: number;
  posFromCenter: PosFromCenter;
  friction: AttackEnergyFriction;
  VEL: Velocity;
  velPrevX: number;
  velPrevY: number;
  accX: number;
  accY: number;
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
  ON_SCREEN_PREVENT_ATTACK_PHYSICAL: boolean;
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

export interface xyVector {
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

export type CharacterType = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
export type InputType = 0 | 1 | 2;

export type CharacterName =
  | "Mario"
  | "Link"
  | "Pikachu"
  | "Kirby"
  | "Chez"
  | "BlackChez"
  | "GreenKoopa"
  | "RedKoopa"
  | "BlueKoopa";

export interface SmashConfig {
  players: PlayerConfig[];
}

export interface PlayerConfig {
  name: CharacterName;
  characterId: CharacterType;
  scale: number;
  input?: InputType;
}

export type WebState = "start" | "play";

export interface Quote {
  name: string;
  text: string;
}

export interface Debug {
  Level: number;
  ModeInfinity: boolean;
  TimeMinutes: number;
  InfinityShots: number;
  MusicNumber: number;
  MusicActive: boolean;
  UpdateLoopsNumSkip: number;
  FrictionAirActive: boolean;
  Camera: boolean;
  CamerasVisible: boolean;
  CollidersPvP: boolean;
  CollidersPvAP: boolean;
  CollidersPvAE: boolean;
  CollidersAEvAE: boolean;
  CollidersAEvAP: boolean;
  AEWrapScreen: boolean;
  PlayerIdVisible: boolean;
  CharacterTinted: boolean;
  WallJumpsActive: boolean;
  DefaultDamage: boolean;
  DefaultHitback: boolean;
  ReadySoundActive: boolean;
  HealthInverted: boolean;
  MatricesAlways: boolean;
  ConsoleLogButtons: boolean;
  ConsoleLogConnected: boolean;
  LoadTimeExtra: boolean;
  AllowCharsChez: boolean;
  AllowCharsExtended: boolean;
  DevMode: boolean;
}

export interface Flag {
  powerStateCurr: PowerStateFlag;
  powerStatePrev: PowerStateFlag;
  emitterLight: any;
  particles: any;
}

export interface Chomp {
  sprite: any | Phaser.GameObjects.Sprite;
  state: ChompState;
  originX: number;
  originY: number;
  radius: number;
  percentFramesJump: number;
  PERCENT_FRAMES_WALK: number;
  NUM_LINKS: number;
  MASS: number;
  links: ChompLink[];
  block: ChompBlock;
  soundAttack: any;
  powerStateCurr: PowerStateChomp;
  powerStatePrev: PowerStateChomp;
  particles: any;
  emitterDark: any;
  darknessMoments: DarknessMoments;
}
export interface ChompBlock {
  sprite: any | Phaser.GameObjects.Sprite;
  x: number;
  y: number;
}

export interface ChompLink {
  sprite: any | Phaser.GameObjects.Sprite;
}

export type ChompState = "idle" | "chomping" | "dead";

export const emoji = {
  keyboardBlack: "⌨",
  keyboardWhite: "⌨️",
  gamepad: "🎮",
  greenCheck: "✔️",
  caution: "🚧",
  redX: "❌",
  gear: "⚙️",
  cloud: "☁",
  cloudWhite: "☁️",
  beer: "🍺",
  star: "⭐",
  skullAndCrossbones: "☠️",
  skull: "💀",
  punch: "👊",
  brokenHeart: "💔",
  back: "🔙",
  forward: "🔜",
  restart: "🔄",
  waiting: "⏳",
};

//🥃⭐🔫⚪​🍺​🍻​🥂​🍾​🥃

export type Keydown = "a" | "s" | "d" | "f" | "j" | "k" | "l" | ";" | "x";

export type PowerStateCharacterName = "dark" | "light" | "none";

export type PowerStateChompName = "dark" | "none";
export type PowerStateFlagName = "light" | "none";
export interface PowerStateCharacter {
  name: PowerStateCharacterName;
  gameStamp: number;
}

export interface PowerStateChomp {
  name: PowerStateChompName;
  gameStamp: number;
}
export interface PowerStateFlag {
  name: PowerStateFlagName;
  gameStamp: number;
}

export interface DarknessMoments {
  chomp: number;
  passed: number;
}

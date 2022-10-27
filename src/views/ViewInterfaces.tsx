export type CharacterId = 0 | 1 | 2 | 3 | 4 | 5;

export type CharacterName =
  | "Mario"
  | "Link"
  | "Pikachu"
  | "Kirby"
  | "Chez"
  | "BlackChez";

export interface SmashConfig {
  players: PlayerConfig[];
}

export interface PlayerConfig {
  name: CharacterName;
  characterId: CharacterId;
  scale: number;
}

export type WebState = "start" | "play";

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
  setPlayerIdFiltersActive: boolean;
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
}

export interface ButtonOnOff {
  state: boolean;
}

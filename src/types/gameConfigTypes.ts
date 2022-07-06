import { TMultiplayerBotConfig, TMultiplayerBotConfigField } from "./eventTypes";
import { TFormFieldBoolean, TFormFieldNumber, TFormFieldNumberArray,
  TFormFieldString, TFormFieldStringArray } from "./formFields";

export type TOverridablePlatformGameModeData = {
  displayName: string;
  imageDataList: TImageData[];
  gameSpecificParams: string;
  gameColor: string;
  roundCount: number;
  duration: number;
  playerCountPreferences: number[];
  // rulesText: string;
  // socialConfig: string;
  botsEnabled: null | boolean;
  botConfig: TBotConfig;
  difficultyMinLevel: number;
  difficultyMaxLevel: number;
  bannerRulesText: {};
};

export type TUserModerationResponse ={
  id: number;
  userId: string;
  appId: string;
  deviceId: number;
  banState: string;
  privateNote: string;
  publicNote: string;
  moderationType: string;
  expiresAt: string;
  extraInfo: string;
  isRevoked: boolean;
  createdAt: string;
  updatedAt: string;
};

export type TUserModerationRequest ={
  id: number;
  userId: string;
  appId: string;
  deviceId: number;
  banState: string;
  privateNote: string;
  publicNote: string;
  moderationType: string;
  expiresAt: string;
  extraInfo: string;
  isRevoked: boolean;
};

export type TImageData = {
  type: string;
  url: string;
  aspectRatio: string;
};

export type TImageDataField = {
  // todo <select> options for type:
  // square
  // rectangle
  // banner
  // bw_rectangle
  // img_1x3
  // img_5x4
  // banner_pvt
  type: TFormFieldString;
  url: TFormFieldString;
  aspectRatio: TFormFieldString;
};

export type TOverridablePlatformGameModeDataField = {
  displayName: TFormFieldString;
  imageDataList: TImageDataField[];
  gameSpecificParams: TFormFieldString;
  gameColor: TFormFieldString;
  roundCount: TFormFieldNumber;
  duration: TFormFieldNumber;
  playerCountPreferences: TFormFieldNumberArray;
  // rulesText: string;
  // socialConfig: string;
  botsEnabled: { value: null | boolean; error: string; required: boolean; };
  botConfig: TBotConfigFields;
  difficultyMinLevel: TFormFieldNumber;
  difficultyMaxLevel: TFormFieldNumber;
  bannerRulesText: { value: any; error: string; required: boolean; };
};

export enum EEngineTypes { 
  WEB = 'WEB',
  UNITY = 'UNITY',
};

export enum EBotLogics {
  SINGLE_PLAYER = 'SINGLE_PLAYER',
  MULTI_PLAYER_AI = 'MULTI_PLAYER_AI',
};

export type TGameModeData = {
  gameMode: EGameModes;
  releaseState: EReleaseStates;
  overridablePlatformGameModeData: TOverridablePlatformGameModeData;
  enabledPlatforms: EPlatforms[];
};

export type TGameModeDataField = {
  gameMode: { value: EGameModes; error: string; required: boolean; };
  releaseState: { value: EReleaseStates; error: string; required: boolean; };
  overridablePlatformGameModeData: TOverridablePlatformGameModeDataField;
  enabledPlatforms: { value: EPlatforms[]; error: string; required: boolean; };
};

type TPlatformField = {
  value: EPlatforms;
  error: string;
  required: boolean;
};

export type TPlatformData = {
  platform: EPlatforms;
  minAppVersion: string;
  maxAppVersion: string;
  shrinkSize: number[];
  webViewResolution: number[];
  shrinkShape: EShrinkShape;
};

export type TPlatformDataField = {
  platform: TPlatformField;
  minAppVersion: TFormFieldString;
  maxAppVersion: TFormFieldString;
  shrinkSize: TFormFieldNumberArray;
  webViewResolution: TFormFieldNumberArray;
  shrinkShape: { value: EShrinkShape; error: string; required: boolean; }
};

export type TEngineDataNone = {
  engineType: 'None';
};

export type TEngineDataNoneField = {
  engineType: {
    value: 'None';
    error: string;
    required: boolean;
  }
};

export type TEngineDataWeb = {
  engineType: 'Web';
  url: string;
};

type TEngineDataWebField = {
  engineType: {
    value: 'Web';
    error: string;
    required: boolean;
  };
  url: TFormFieldString;
};

export type TEngineDataUnity = {
  engineType: 'UNITY';
  iosUrl: string;
  androidUrl: string;
  version: number;
  addressableName: string;
  // addressableLabels: string[];
};

type TEngineDataUnityField = {
  engineType: {
    value: 'UNITY';
    error: string;
    required: boolean;
  };
  iosUrl: TFormFieldString;
  androidUrl: TFormFieldString;
  version: TFormFieldNumber;
  addressableName: TFormFieldString;
  // addressableLabels: string[];
};

export enum EOrientations {
  PORTRAIT = 'PORTRAIT',
  LANDSCAPE = 'LANDSCAPE',
}
export enum ETutorialTypes {
  None = 'None',
  Slide = 'Slide',
  InGame = 'InGame',
}
export enum EVersions {
  DRAFT = 'DRAFT',
  PREVIEW_LIVE = 'PREVIEW_LIVE',
  LIVE = 'LIVE',
  LAST_LIVE = 'LAST_LIVE',
}
export enum EScoringTypes {
  TIMER = 'TIMER',
  SCORE = 'SCORE',
}
export enum EPlatforms {
  iOS = 'iOS',
  Android = 'Android',
}
export enum EGameSessionType {
  InHouse = 'InHouse',
  Remote = 'Remote',
}
export enum EShrinkShape {
  RECTANGLE = 'RECTANGLE',
  CIRCLE = 'CIRCLE',
}
export enum EGameModes {
  SINGLE_PLAYER = 'SINGLE_PLAYER',
  PVP_FREE = 'PVP_FREE',
  BATTLE = 'BATTLE',
  CONTEST = 'CONTEST',
  PRIVATE_GAME = 'PRIVATE_GAME',
}
export enum EReleaseStates {
  LIVE = 'LIVE',
  BETA = 'BETA',
  ADMIN = 'ADMIN',
  DISABLED = 'DISABLED',
}
export type TBotConfigFields = undefined | null | {
  botLogic: { value: EBotLogics; error: string; required: boolean; };
  botsWithTrueSkills: TFormFieldBoolean;
  botMaxLevel: TFormFieldNumber;
  botMinLevel: TFormFieldNumber;
  multiPlayerBotConfig: TMultiplayerBotConfigField;
  trueSkillLevels: TFormFieldNumberArray;
};
export type TBotConfig = undefined | null | {
  botLogic: EBotLogics;
  botsWithTrueSkills: boolean;
  botMaxLevel: number;
  botMinLevel: number;
  multiPlayerBotConfig: TMultiplayerBotConfig;
  trueSkillLevels: number[];
};

export type TGameConfigForm = {
  _isFormValid: boolean;
  _isFormTouched: boolean;
  _isSubmittedOnce: boolean;
  _validationErrors: string [];  // use this for errors which involve multiple fields
  id?: number;
  gameId: TFormFieldString;
  enabledCountryCodes: TFormFieldStringArray;
  // todo
  // engineData: TEngineDataNoneField | TEngineDataWebField | TEngineDataUnityField;
  engineData: {
    engineType: {
      value: 'WEB' | 'UNITY';
      error: string;
      required: boolean;
    };
    url?: null | TFormFieldString;  // include this field for engineType == 'WEB'
    assetData: null | {
      iosUrl?: { value: string | null | undefined; error: string; required: boolean };
      androidUrl?: { value: string | null | undefined; error: string; required: boolean };
      version?: { value: number | null | undefined; error: string; required: boolean };
      addressableName?: { value: string | null | undefined; error: string; required: boolean };
    }
  };
  orientation: { value: EOrientations; error: string; required: boolean; };
  gameControlParams: {
    tutorialData: {
      tutorialType: { value: ETutorialTypes; error: string; required: boolean; };
      slideUrls: TFormFieldStringArray;
    };
    maxRankForWinner: TFormFieldNumber;
    isNonScoreGame: TFormFieldBoolean;
    // showScoreInResult: TFormFieldBoolean;
    canWinAfterAbandon: TFormFieldBoolean;
    startingScore: TFormFieldNumber;
    // hideFromPgLeaderboard: TFormFieldBoolean;
    showResultForAbandoned: TFormFieldBoolean;
    showEqualAlignmentOnResultScreen: TFormFieldBoolean;
    // showWinLooseStatusOnResultScreen: TFormFieldBoolean;
    // canAbandonPlayerContinuePlaying: TFormFieldBoolean;
    scoringType: { value: EScoringTypes; error: string; required: boolean; };
    // defaultPlayerCount: TFormFieldNumber;
    autoStartGamePlay: TFormFieldBoolean;
    // enableInGameResultPopup: TFormFieldBoolean;
    updateScoreOnCallback: TFormFieldBoolean;
    resetAtStart: TFormFieldBoolean;
    // scoreToCompleteFue: TFormFieldNumber;
    // shouldHideMuteButton: TFormFieldBoolean;
    shouldHidePlayerInfoInNativeCode: TFormFieldBoolean;
    gameSessionType: { value: EGameSessionType; error: string; required: boolean; };
    acceptablePauseTime: TFormFieldNumber;
    disconnectionBufferTime: TFormFieldNumber;
    imageDataList: TImageDataField[];
  };
  matchMakingConfig: {
    matchMakingTime: TFormFieldNumber;
  };
  appId: TFormFieldString;
  version: { value: EVersions; error: string; required: boolean; };
  // modifiedBy: string;
  supportedPlayerCounts: TFormFieldNumberArray;
  gameModeDataList: TGameModeDataField[];
  platformDataSet: TPlatformDataField[];
  skillConfig: {
    defaultSkillRating: TFormFieldNumber;
    flatSkillThreshold: TFormFieldNumber;
    numGamesSkillRating: TFormFieldNumber;
    minMultiplier: TFormFieldNumber;
    diffMulMap: any;
  };
  botConfig: TBotConfigFields;
};

export type TGameConfigPayload = {
  id?: number;
  gameId: string;
  enabledCountryCodes: string[];
  // engineData: any // todo TEngineDataNone | TEngineDataWeb | TEngineDataUnity;
  engineData: {
    engineType: 'WEB' | 'UNITY';
    url?: null | string;  // include this field for engineType == 'WEB'
    assetData: null | {
      iosUrl?: string | null | undefined;
      androidUrl?: string | null | undefined;
      version?: number | null | undefined;
      addressableName?: string | null | undefined;
    }
  }
  orientation: EOrientations;
  gameControlParams: {
    tutorialData: {
      tutorialType: ETutorialTypes;
      slideUrls: string[];
    };
    maxRankForWinner: number;
    isNonScoreGame: boolean;
    // showScoreInResult: boolean;
    canWinAfterAbandon: boolean;
    startingScore: number;
    // hideFromPgLeaderboard: boolean;
    showResultForAbandoned: boolean;
    showEqualAlignmentOnResultScreen: boolean;
    // showWinLooseStatusOnResultScreen: boolean;
    // canAbandonPlayerContinuePlaying: boolean;
    scoringType: EScoringTypes;
    // defaultPlayerCount: number;
    autoStartGamePlay: boolean;
    // enableInGameResultPopup: boolean;
    updateScoreOnCallback: boolean;
    resetAtStart: boolean;
    // scoreToCompleteFue: number;
    // shouldHideMuteButton: boolean;
    shouldHidePlayerInfoInNativeCode: boolean;
    gameSessionType: EGameSessionType;
    acceptablePauseTime: number;
    disconnectionBufferTime: number;
    imageDataList: TImageData[];
  };
  matchMakingConfig: {
    matchMakingTime: number;
  };
  appId: string;
  version: EVersions;
  // modifiedBy: string;
  supportedPlayerCounts: number[];
  gameModeDataList: TGameModeData[];
  platformDataSet: TPlatformData[];
  skillConfig: {
    defaultSkillRating: number;
    flatSkillThreshold: number;
    numGamesSkillRating: number;
    minMultiplier: number;
    diffMulMap: any;
  };
  botConfig: TBotConfig;
};

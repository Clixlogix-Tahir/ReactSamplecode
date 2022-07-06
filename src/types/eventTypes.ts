import { TMutateModes } from "../common/common-types";
import { TJsonLogicResult } from "../common/utils";
import { EChallengeTask, TChallengeKey, TChallengeKeyFields } from "../pages/challenges/challenges-types";
import { TFormFieldBoolean, TFormFieldNumber, TFormFieldNumberArray, TFormFieldString, TFormFieldStringArray } from "./formFields";
import { EBotLogics, TImageData, TImageDataField } from "./gameConfigTypes";

export enum USER_ROLE {
  'PREVIEW' = 'PREVIEW',
  'REGULAR' = 'REGULAR',
}

export enum ECost {
  EMPTY = '',
  CASH = 'CASH',
  KEY = 'KEY',
  COIN = 'COIN',
  NONE = 'NONE',
  TICKET = 'TICKET',
  TCOIN = 'TCOIN',
  TENNIS = 'TENNIS',
  BATTLER = 'BATTLER',
  SHEEP = 'SHEEP',
  WCOIN = 'WCOIN',
  BCOIN = 'BCOIN',
  TANK = 'TANK',
  MCOIN = 'MCOIN',
  BUBBLE = 'BUBBLE',
  MMCOIN = 'MMCOIN',
}

export enum EPlacementLocation {
  PGBlitzMode = 'PGBlitzMode',
  PGBottom = 'PGBottom',
  PGKlondikePower = 'PGKlondikePower',
  PGLiveEvents = 'PGLiveEvents',
  PGPractice = 'PGPractice',
  PGTop = 'PGTop',
  PGTopSection = 'PGTopSection',
  PGTournaments = 'PGTournaments',
  ContestPvpBattle = 'ContestPvpBattle',
  ContestPvp = 'ContestPvp',
  ContestFeatured = 'ContestFeatured',
  ContestSpecialEvents = 'ContestSpecialEvents',
  ContestKlondikePower = 'ContestKlondikePower',
  ContestBlitzMode = 'ContestBlitzMode',
  ContestLiveEvents = 'ContestLiveEvents',
  ContestPractice = 'ContestPractice',
  Tournament = 'Tournament',
  PGSBElimination = 'PGSBElimination',
  ContestSBElimination = 'ContestSBElimination',
  Regular = 'Regular',
  Blitz = 'Blitz',
  LightningBlitz = 'LightningBlitz',
  SpecialEvents = 'SpecialEvents',
  _1vs1 = '_1vs1',
  _1vsMany = '_1vsMany',
  Featured = 'Featured',
  LimitedTime = 'LimitedTime',
  FreeRoll = 'FreeRoll',
  Practice = 'Practice',
  Cash = 'Cash',
  PGSpecialEvents = 'PGSpecialEvents',
  Arena = 'Arena',
}

// provides human readable placements supported by a given app
export const placementHumanReadable: any = {
  'onclixlogix-samplecode.solitaire': {  // todo make enum for app ids
    [EPlacementLocation.PGBlitzMode]: 'PG 1 vs 1',
    [EPlacementLocation.PGKlondikePower]: 'PG Klondike Power',
    [EPlacementLocation.PGLiveEvents]: 'PG Live Events',
    [EPlacementLocation.PGPractice]: 'PG Practice',
    [EPlacementLocation.PGTopSection]: 'PG Top Section',
    [EPlacementLocation.PGTournaments]: 'PG 1 vs Many',
    [EPlacementLocation.ContestBlitzMode]: 'Contest 1 vs 1',
    [EPlacementLocation.ContestKlondikePower]: 'Contest Klondike Power',
    [EPlacementLocation.ContestLiveEvents]: 'Contest Live Events',
    [EPlacementLocation.ContestPractice]: 'Contest Practice',
    [EPlacementLocation.ContestSpecialEvents]: 'Contest Special Events',
    [EPlacementLocation.Tournament]: 'Contest 1 vs Many',
    [EPlacementLocation.PGSBElimination]: 'PGSBElimination',
    [EPlacementLocation.ContestSBElimination]: 'ContestSBElimination',
    [EPlacementLocation.PGSpecialEvents]: 'PG Special Events',
  },
  'onclixlogix-samplecode.jrxsolitaireblitz': { 
    [EPlacementLocation.PGBlitzMode]: 'PG 1 vs 1',
    [EPlacementLocation.PGKlondikePower]: 'PG Klondike Power',
    [EPlacementLocation.PGLiveEvents]: 'PG Live Events',
    [EPlacementLocation.PGPractice]: 'PG Practice',
    [EPlacementLocation.PGTopSection]: 'PG Top Section',
    [EPlacementLocation.PGTournaments]: 'PG 1 vs Many',
    [EPlacementLocation.ContestBlitzMode]: 'Contest 1 vs 1',
    [EPlacementLocation.ContestKlondikePower]: 'Contest Klondike Power',
    [EPlacementLocation.ContestLiveEvents]: 'Contest Live Events',
    [EPlacementLocation.ContestPractice]: 'Contest Practice',
    [EPlacementLocation.ContestSpecialEvents]: 'Contest Special Events',
    [EPlacementLocation.Tournament]: 'Contest 1 vs Many',
    [EPlacementLocation.PGSBElimination]: 'PGSBElimination',
    [EPlacementLocation.ContestSBElimination]: 'ContestSBElimination',
    [EPlacementLocation.PGSpecialEvents]: 'PG Special Events',
  },
  'onclixlogix-samplecode.trivia': {
    [EPlacementLocation.Regular]: 'Regular',
    [EPlacementLocation.Blitz]: 'Blitz',
    [EPlacementLocation.LightningBlitz]: 'Lightning Blitz',
    [EPlacementLocation.Tournament]: 'Tournament',
    [EPlacementLocation.SpecialEvents]: 'Special Events',
    [EPlacementLocation._1vs1]: '1 vs 1',
    [EPlacementLocation._1vsMany]: '1 vs Many',
    [EPlacementLocation.Featured]: 'Featured',
    [EPlacementLocation.LimitedTime]: 'Limited Time',
    [EPlacementLocation.FreeRoll]: 'Free Roll',
    [EPlacementLocation.Practice]: 'Practice',
    [EPlacementLocation.Cash]: 'Cash',
  },
  common: {
    [EPlacementLocation.PGBlitzMode]: 'PG 1 vs 1',
    [EPlacementLocation.PGBottom]: 'PG Bottom',
    [EPlacementLocation.PGKlondikePower]: 'PG Klondike Power',
    [EPlacementLocation.PGLiveEvents]: 'PG Live Events',
    [EPlacementLocation.PGTop]: 'PG Top',
    [EPlacementLocation.PGTopSection]: 'PG Top Section',
    [EPlacementLocation.PGTournaments]: 'PG 1 vs Many',
    [EPlacementLocation.ContestBlitzMode]: 'Contest 1 vs 1',
    [EPlacementLocation.ContestFeatured]: 'Contest Featured',
    [EPlacementLocation.ContestKlondikePower]: 'Contest Klondike Power',
    [EPlacementLocation.ContestLiveEvents]: 'Contest Live Events',
    [EPlacementLocation.ContestPvp]: 'Contest PvP',
    [EPlacementLocation.ContestPvpBattle]: 'Contest PvP Battle',
    [EPlacementLocation.ContestSpecialEvents]: 'Contest Special Events',
    [EPlacementLocation.Tournament]: 'Contest 1 vs Many',
    [EPlacementLocation.PGSBElimination]: 'PGSBElimination',
    [EPlacementLocation.ContestSBElimination]: 'ContestSBElimination',
    [EPlacementLocation.Regular]: 'Regular',
    [EPlacementLocation.Blitz]: 'Blitz',
    [EPlacementLocation.LightningBlitz]: 'LightningBlitz',
    [EPlacementLocation.SpecialEvents]: 'SpecialEvents',
    [EPlacementLocation._1vs1]: '1vs1',
    [EPlacementLocation._1vsMany]: '1vsMany',
    [EPlacementLocation.Featured]: 'Featured',
    [EPlacementLocation.LimitedTime]: 'LimitedTime',
    [EPlacementLocation.FreeRoll]: 'FreeRoll',
    [EPlacementLocation.Practice]: 'Practice',
    [EPlacementLocation.Cash]: 'Cash',
    [EPlacementLocation.PGSpecialEvents]: 'PG Special Events',
    [EPlacementLocation.Arena]: 'Arena',
  },
};

export enum ECryptoCurrency {
  RLY = 'RLY',
  JRX = 'JRX',
}

export enum ECurrency {
  NOT_AVAILABLE = 'NOT_AVAILABLE',
  JRX = 'JRX',
  RLY = 'RLY',
  // AED = 'AED',
  // AFN = 'AFN',
  // ALL = 'ALL',
  // AMD = 'AMD',
  // ANG = 'ANG',
  // AOA = 'AOA',
  // ARS = 'ARS',
  // AUD = 'AUD',
  // AWG = 'AWG',
  // AZN = 'AZN',
  // BAM = 'BAM',
  // BBD = 'BBD',
  // BDT = 'BDT',
  // BGN = 'BGN',
  // BHD = 'BHD',
  // BIF = 'BIF',
  // BMD = 'BMD',
  // BND = 'BND',
  // BOB = 'BOB',
  BRL = 'BRL',
  // BSD = 'BSD',
  // BTN = 'BTN',
  // BWP = 'BWP',
  // BYN = 'BYN',
  // BZD = 'BZD',
  // CAD = 'CAD',
  // CDF = 'CDF',
  // CHF = 'CHF',
  // CLP = 'CLP',
  // CNY = 'CNY',
  // COP = 'COP',
  // CRC = 'CRC',
  // CUC = 'CUC',
  // CUP = 'CUP',
  // CVE = 'CVE',
  // CZK = 'CZK',
  // DJF = 'DJF',
  // DKK = 'DKK',
  // DOP = 'DOP',
  // DZD = 'DZD',
  // EGP = 'EGP',
  // ERN = 'ERN',
  // ETB = 'ETB',
  EUR = 'EUR',
  // FJD = 'FJD',
  // FKP = 'FKP',
  // GBP = 'GBP',
  // GEL = 'GEL',
  GGP = 'GGP',
  // GHS = 'GHS',
  // GIP = 'GIP',
  // GMD = 'GMD',
  // GNF = 'GNF',
  // GTQ = 'GTQ',
  // GYD = 'GYD',
  // HKD = 'HKD',
  // HNL = 'HNL',
  // HRK = 'HRK',
  // HTG = 'HTG',
  // HUF = 'HUF',
  // IDR = 'IDR',
  // ILS = 'ILS',
  // IMP = 'IMP',
  INR = 'INR',
  // IQD = 'IQD',
  // IRR = 'IRR',
  // ISK = 'ISK',
  // JEP = 'JEP',
  // JMD = 'JMD',
  // JOD = 'JOD',
  // JPY = 'JPY',
  // KES = 'KES',
  // KGS = 'KGS',
  // KHR = 'KHR',
  // KID = 'KID',
  // KMF = 'KMF',
  // KPW = 'KPW',
  // KRW = 'KRW',
  // KWD = 'KWD',
  // KYD = 'KYD',
  // KZT = 'KZT',
  // LAK = 'LAK',
  // LBP = 'LBP',
  // LKR = 'LKR',
  // LRD = 'LRD',
  // LSL = 'LSL',
  // LYD = 'LYD',
  // MAD = 'MAD',
  // MDL = 'MDL',
  // MGA = 'MGA',
  // MKD = 'MKD',
  // MMK = 'MMK',
  // MNT = 'MNT',
  // MOP = 'MOP',
  // MRU = 'MRU',
  // MUR = 'MUR',
  // MVR = 'MVR',
  // MWK = 'MWK',
  // MXN = 'MXN',
  // MYR = 'MYR',
  // MZN = 'MZN',
  // NAD = 'NAD',
  // NGN = 'NGN',
  // NIO = 'NIO',
  // NOK = 'NOK',
  // NPR = 'NPR',
  // NZD = 'NZD',
  // OMR = 'OMR',
  // PAB = 'PAB',
  // PEN = 'PEN',
  // PGK = 'PGK',
  PHP = 'PHP',
  // PKR = 'PKR',
  // PLN = 'PLN',
  // PRB = 'PRB',
  // PYG = 'PYG',
  // QAR = 'QAR',
  // RON = 'RON',
  // RSD = 'RSD',
  // RUB = 'RUB',
  // RWF = 'RWF',
  // SAR = 'SAR',
  // SBD = 'SBD',
  // SCR = 'SCR',
  // SDG = 'SDG',
  // SEK = 'SEK',
  // SGD = 'SGD',
  // SHP = 'SHP',
  // SLL = 'SLL',
  // SLS = 'SLS',
  // SOS = 'SOS',
  // SRD = 'SRD',
  // SSP = 'SSP',
  // STN = 'STN',
  // SYP = 'SYP',
  // SZL = 'SZL',
  // THB = 'THB',
  // TJS = 'TJS',
  // TMT = 'TMT',
  // TND = 'TND',
  // TOP = 'TOP',
  // TRY = 'TRY',
  // TTD = 'TTD',
  // TVD = 'TVD',
  // TWD = 'TWD',
  // TZS = 'TZS',
  // UAH = 'UAH',
  // UGX = 'UGX',
  USD = 'USD',
  // UYU = 'UYU',
  // UZS = 'UZS',
  // VES = 'VES',
  // VND = 'VND',
  // WST = 'WST',
  // XAF = 'XAF',
  // XCD = 'XCD',
  // XOF = 'XOF',
  // XPF = 'XPF',
  // YER = 'YER',
  // ZAR = 'ZAR',
  // ZMW = 'ZMW',
  // ZWB = 'ZWB',
}

export enum EEventCategory {
  ALL = 'ALL',
  BATTLE = 'BATTLE',
  TOURNAMENT = 'TOURNAMENT',
  MULTI_ENTRY_TOURNAMENT = 'MULTI_ENTRY_TOURNAMENT',
  SALE = 'SALE',
  ELIMINATION = 'ELIMINATION',
  CHALLENGE_LEADERBOARD = 'CHALLENGELEADERBOARD',
}

export enum ECountryCode {
  IN = 'IN',
  US = 'US',
  BR = 'BR',
  PH = 'PH',
}

export enum EDefaultIconsImages {
  coin = 'https://jrx-assets.s3.amazonaws.com/social_challenges_default_icons/coin.png',
  invite = 'https://jrx-assets.s3.amazonaws.com/social_challenges_default_icons/invite.png',
  JRX = 'https://jrx-assets.s3.amazonaws.com/social_challenges_default_icons/JRX.png',
  mastery = 'https://jrx-assets.s3.amazonaws.com/social_challenges_default_icons/mastery.png',
  neatSolve = 'https://jrx-assets.s3.amazonaws.com/social_challenges_default_icons/NeatSolve.png',
  powerUp = 'https://jrx-assets.s3.amazonaws.com/social_challenges_default_icons/power-up.png',
  talonFlips = 'https://jrx-assets.s3.amazonaws.com/social_challenges_default_icons/TalonFlips.png',
  win = 'https://jrx-assets.s3.amazonaws.com/social_challenges_default_icons/Win.png',
  winStreak = 'https://jrx-assets.s3.amazonaws.com/social_challenges_default_icons/WinStreak.png',
}

export enum EImageUploadType {
  DEFAULT = 'Default',
  CDN = 'CDN',
  URL = 'URL',
}

export enum EWinScoreLogic {
  NA = 'NA',
  BEST = 'BEST',
  RECENT = 'RECENT',
}

export enum ESubCategory {
  CASH_PRODUCT_NUDGE = 'CASH_PRODUCT_NUDGE',
}

// todo use this
export const countryToCurrency = {
  IN: ECurrency.INR,
  US: ECurrency.USD,
  BR: ECurrency.BRL,
  PH: ECurrency.PHP,
}

export enum ERepetitionType {
  ONE_TIME = 'ONE_TIME',
  INTERVAL_BASED = 'INTERVAL_BASED',
  CALENDAR_BASED = 'CALENDAR_BASED',
}

export enum EbanStateType {
  CompleteBan = 'Complete Ban',
  ShadowBan = 'Shadow Ban',
}

export enum EbanDurationType {
  PERMANENT = 'Permanent',
  EXPIRING = 'Expiring',
}

export enum EbanDurations {
  ONE_DAY = '1 day',
  THREE_DAYS = '3 days',
  ONE_WEEK = '1 week',
  TWO_WEEKS = '2 weeks',
  ONE_MONTH = '1 month',
  ONE_YEAR = '1 year',
  HUNDRED_YEARS = '100 years',
}

export enum EmoderationType {
  CHAT = 'Chat',
  BROADCAST = 'Broadcast',
  AUDITION = 'Audition',
  ACCOUNT = 'Account',
  CASH_REWARD = 'Cash Reward',
  CASH_REWARD_GAME_SPECIFIC = 'Cash Reward Game Specific',
}

export enum ECashProductType {
  NORMAL = 'NORMAL',
  STARTER_FEATURED = 'STARTER_FEATURED',
  FEATURED = 'FEATURED',
}

export enum ECmsRoles {
  jrx_super_admin = 'JRX Super Admin',
  jrx_manager = 'JRX Manager',
  jrx_team_member = 'JRX Team member',
  jrx_view_only_access = 'JRX view only access',
  // LIVE_OPS_MANAGER = 'Live Ops Manager',
  // DEVELOPER = 'Developer',
  // ANALYST = 'Analyst',
}

export enum ECmsRoleIdentifier {
  jrx_super_admin = 'jrx_super_admin',
  jrx_manager = 'jrx_manager',
  jrx_team_member = 'jrx_team_member',
  jrx_view_only_access = 'jrx_view_only_access',
}

export enum EEntryType {
  CASH = 'cash',
  COIN = 'coin',
  TICKET = 'ticket',
  JRX = 'JRX',
  FREE = 'free',
  PASSIVE = 'passive',
};

export enum EGroupType {
  PRACTICE = 'Practice',
  PREMIUM = 'Premium',
  LIVE = 'Live',
  UPCOMING = 'Upcoming',
  GLOBAL = 'Global',
  NONE = 'None',
};

export type TOverridableBotConfig = {
  botLogic: EBotLogics;
  botsWithTrueSkills: boolean;
  botMaxLevel: number;
  botMinLevel: number;
  multiPlayerBotConfig: TMultiplayerBotConfig;
  trueSkillLevels: number[];
};

export type TGameModeDataOptional = {
  displayName?: string;
  imageDataList?: TImageData[];
  gameSpecificParams?: string;
  gameColor?: string;
  roundCount?: number;
  duration?: number;
  playerCountPreferences?: number[];
  // rulesText?: string;
  // socialConfig?: string;
  botsEnabled?: null | boolean;
  difficultyMinLevel?: number;
  difficultyMaxLevel?: number;
  botConfig?: TOverridableBotConfig;
  bannerRulesText?: any;
  winQualificationJson?: string;
};

export type TMultiplayerBotConfig = {
  [key: number]: number;
};

export type TMultiplayerBotConfigField = {
  [key: number]: TFormFieldNumber;
};

export type TOverridableBotConfigFields = {
  botLogic: { value: EBotLogics; error: string; required: boolean; }
  botsWithTrueSkills: TFormFieldBoolean;
  botMaxLevel: TFormFieldNumber;
  botMinLevel: TFormFieldNumber;
  multiPlayerBotConfig: TMultiplayerBotConfigField;
  trueSkillLevels: TFormFieldNumberArray;
};

export type TGameModeDataOptionalFields = {
  // this type is to be used for events only
  _showDisplayName: boolean;
  _showImageDataList: boolean;
  _showRoundCount: boolean;
  _showGameSpecificParams: boolean;
  _showGameColor: boolean;
  _showDuration: boolean;
  _showPlayerCountPreferences: boolean;
  _showBotsEnabled: boolean;
  _showDifficultyMinLevel: boolean;
  _showDifficultyMaxLevel: boolean;
  _showBotConfig: boolean;
  _showBannerRulesText: boolean;
  _showWinQualificationJson: boolean;
  displayName?: TFormFieldString;
  imageDataList?: TImageDataField[];
  gameSpecificParams?: TFormFieldString;
  gameColor?: TFormFieldString;
  roundCount?: TFormFieldNumber;
  duration?: TFormFieldNumber;
  playerCountPreferences?: TFormFieldNumberArray;
  // rulesText?: string;
  // socialConfig?: string;
  botsEnabled?: { value: null | boolean; error: string; required: boolean; };
  difficultyMinLevel?: TFormFieldNumber;
  difficultyMaxLevel?: TFormFieldNumber;
  botConfig?: TOverridableBotConfigFields;
  bannerRulesText?: TFormFieldString;
  winQualificationJson?: TFormFieldString;
};

export type TRealAmount = {
  amount: number;
  currency: ECurrency | ECryptoCurrency;
};

export type TRealAmountFields = {
  amount: TFormFieldNumber;
  currency: { value: ECurrency | ECryptoCurrency; error: string; required: boolean; };
};

export type TVirtualReward = {
  amount: number;
  currencyType: ECost;
};

export type TVirtualRewardFields = {
  amount: TFormFieldNumber;
  currencyType: { value: ECost; error: string; required: boolean; };
};

export type TRealReward = {
  winningAmount: TRealAmount;
  bonusAmount: TRealAmount;
};

export type TRealRewardFields = {
  winningAmount: TRealAmountFields;
  bonusAmount: TRealAmountFields;
};

export type TRangedReward = {
  minRank: number;
  maxRank: number;
  realReward?: TRealReward;
  virtualRewards?: TVirtualAmount[];
};

export type TRangedRewardFields = {
  minRank: TFormFieldNumber;
  maxRank: TFormFieldNumber;
  realReward?: TRealRewardFields;
  virtualRewards?: TVirtualRewardFields[];
};

// export type TRangedRewardList = {
//   minRank: number;
//   maxRank: number;
//   realReward?: {
//     winningAmount: TRealReward;
//     bonusAmount: TRealReward;
//   };
//   virtualRewards?: TVirtualReward[];
// };

export type TRepititionKeyValueMap = {
  Start: number;
  End: number;
  StartTimeGapInSec?: number;
  MonthInYear?: number;
  DayInMonth?: number;
  DayInWeek?: number;
  TimeInDay?: number;
  Duration?: number;
};

export type TRepititionKeyValueMapFields = {
  // todo segregate fields appropriately; use a union
  Start: TFormFieldString;
  End: TFormFieldString;
  StartTimeGapInSec?: TFormFieldNumber;
  MonthInYear?: TFormFieldNumber;
  DayInMonth?: TFormFieldNumber;
  DayInWeek?: TFormFieldNumber;
  TimeInDay?: TFormFieldNumber;
  Duration?: TFormFieldNumber;
};

type TDeductibleRealAmount = {
  amount: number;
  currency: ECurrency | ECryptoCurrency;
  maxBonusCutPercentage: number;
  maxWinningsCutPercentage: number;
};

type TDeductibleRealAmountFields = {
  amount: TFormFieldNumber;
  currency: { value: ECurrency | ECryptoCurrency; error: string; required: boolean; };
  maxBonusCutPercentage: TFormFieldNumber;
  maxWinningsCutPercentage: TFormFieldNumber;
};

type TVirtualAmount = {
  amount: number;
  currencyType: ECost;
};

type TVirtualAmountFields = {
  amount: TFormFieldNumber;
  currencyType: { value: ECost; error: string; required: boolean; };
};

export type TEntryFee = {
  // one of the fields is required
  realAmount?: TDeductibleRealAmount;
  virtualAmountList?: TVirtualAmount[];
};

export type TEntryFeeFields = {
  // one of the fields is required
  realAmount?: TDeductibleRealAmountFields;
  virtualAmountList?: TVirtualAmountFields[];
};

export type TEventForm = {
  _isFormValid: boolean;
  _isSubmittedOnce: boolean;
  _validationErrors: string [];  // use this for errors which involve multiple fields
  id: TFormFieldNumber;
  groupId: null | TFormFieldString;
  description: TFormFieldString;
  extraTimeBeforeStart: TFormFieldNumber;
  extraTimeAfterEnd: TFormFieldNumber;
  enabledCountryCodes: TFormFieldStringArray;
  jsonLogicFilters: TFormFieldString;
  unlockLogic: TFormFieldString;
  eventCategory: { value: EEventCategory; error: string; required: boolean; };
  forceInvisible: TFormFieldBoolean;
  appId: TFormFieldString;
  repetitions: {
    _type: ERepetitionType;
    repetitionId: TFormFieldNumber;
    repetitionKeyValueMap: TRepititionKeyValueMapFields;
  }[];
};

export interface IEventBattleForm extends TEventForm {
  additionalParams: TBattleAdditionalParamsFields;
}

export interface IEventNudgeForm extends TEventForm {
  additionalParams: TNudgeAdditionalParamsFields;
}


const newDate = new Date().toJSON();
// const newStartDate = new Date(parseInt((newDate.getTime() / 1000) + '') * 1000)
//   .toISOString()
//   .substr(0, newDate.toISOString().length - 1);
export const defaultRepetitions = {
  ONE_TIME: {
    Start: { value: newDate /*parseInt(Date.now() / 1000 + '')*/, error: '', required: true },
    End: { value: newDate /* parseInt((Date.now() / 1000) + 60 * 60 + '') */, error: '', required: true },
  },
  INTERVAL_BASED: {
    Start: { value: newDate /*parseInt(Date.now() / 1000 + '')*/, error: '', required: true },
    End: { value: newDate /* parseInt((Date.now() / 1000) + 60 * 60 + '') */, error: '', required: true },
    Duration: { value: 60, error: '', required: true },
    StartTimeGapInSec: { value: 80, error: '', required: true },
  },
  CALENDAR_BASED: {
    Start: { value: newDate /*parseInt(Date.now() / 1000 + '')*/, error: '', required: true },
    End: { value: newDate /* parseInt((Date.now() / 1000) + 60 * 60 + '') */, error: '', required: true },
    Duration: { value: 60, error: '', required: true },
    DayInMonth: { value: 1, error: '', required: true },
    DayInWeek: { value: 1, error: '', required: true },
    TimeInDay: { value: 1, error: '', required: true },
  },
};


export type TBattleAdditionalParams = {
  gameIdToGameDataMap: {
    [key: string]: TGameModeDataOptional;
  };
  displayName: string;
  placementDataList: {
    placementLocation: string;
    placementPriority: number;
    showOnCollapse: boolean;
    prerequisiteJsonLogic: string;
  }[];
  /**
   * @deprecated use entryFeeList instead
   */
  entryFee: null | TDeductibleRealAmount,
  /**
   * @deprecated use entryFeeList instead
   */
  virtualEntryFees: TVirtualAmount[];
  tier: number;
  confirmationPopupTitle: string;
  confirmationPopupText: string;
  confirmationCTA: string;
  confirmationCTASubtitle: string;
  matchMakingTime: number;
  maxMatchMakingDuration: number;
  isFue: boolean;
  isAsyncEnabled: boolean;
  asyncBotMatchEnabled: boolean;
  forcedAsyncPlayerCount: null | number;
  forcedAsyncMinPlayerCount: null | number;
  winScoreLogic: EWinScoreLogic;
  resultDelayDuration: number;
  /**
   * @deprecated use playerCountToRewardList instead
   */
  playerCountToRealRewardMap?: {
    [key: string]: TRealReward;
  };
  /**
   * @deprecated use playerCountToRewardList instead
   */
  playerCountToVirtualRewardMap?: {
    [key: string]: TVirtualReward[];
  };
  playerCountToRewardList: {
    [key: string]: TRangedReward[] | undefined;
  };
  mltData?: null | {
    maxPlayTime: number;
    type: 'SingleElimAsync';
  };
  hideEndTime: boolean;
  showOnCollapse: boolean;
  // contest only fields start
  imageUrl: string;
  entryDescription: string;
  retakeDescription: string;
  maxEntryCount: number;
  // contest only fields end

  walletCurrency?: ECurrency  | ECryptoCurrency;
  groupType?: EGroupType;
  challengeName?: string;
  challengeDescription?: string;
  entryType?: EEntryType;
  cdnIcon?: string;
  maxEntries?: number;
  minEntries?: number;
  challengeKey?: TChallengeKey;
  rewardList?: TRangedReward[];
  entryFeeList?: TEntryFee[];
};

type TBattleAdditionalParamsFields = {
  gameIdToGameDataMap: {
    [key: string]: TGameModeDataOptionalFields;
  };
  displayName: TFormFieldString;
  placementDataList: {
    placementLocation: TFormFieldString;
    placementPriority: TFormFieldNumber;
    showOnCollapse: TFormFieldBoolean;
    prerequisiteJsonLogic: TFormFieldString;
  }[],
  /**
   * @deprecated use entryFeeList instead
   */
  entryFee: null | TDeductibleRealAmountFields,
  /**
   * @deprecated use entryFeeList instead
   */
  virtualEntryFees: TVirtualAmountFields[];
  tier: TFormFieldNumber;
  confirmationPopupTitle: TFormFieldString;
  confirmationPopupText: TFormFieldString;
  confirmationCTA: TFormFieldString;
  confirmationCTASubtitle: TFormFieldString;
  matchMakingTime: TFormFieldNumber;
  maxMatchMakingDuration: TFormFieldNumber;
  isFue: TFormFieldBoolean;
  forcedAsyncPlayerCount: null | TFormFieldNumber;
  forcedAsyncMinPlayerCount: null | TFormFieldNumber;
  winScoreLogic: { value: EWinScoreLogic; error: string; required: boolean; };
  resultDelayDuration: TFormFieldNumber;
  isAsyncEnabled: TFormFieldBoolean;
  asyncBotMatchEnabled: TFormFieldBoolean;
  /**
   * @deprecated use playerCountToRewardList instead
   */
  playerCountToRealRewardMap?: {
    [key: string]: TRealRewardFields;
  };
  /**
   * @deprecated use playerCountToRewardList instead
   */
   playerCountToVirtualRewardMap?: {
    [key: string]: TVirtualRewardFields[];
  };
  playerCountToRewardList: {
    [key: string]: TRangedRewardFields[];
  };
  mltData?: null | {
    maxPlayTime: TFormFieldNumber;
    type: { value: 'SingleElimAsync'; error: string; required: boolean; };
  };
  hideEndTime: TFormFieldBoolean;
  showOnCollapse: TFormFieldBoolean;
  // contest only fields start
  imageUrl: TFormFieldString;
  entryDescription: TFormFieldString;
  retakeDescription: TFormFieldString;
  maxEntryCount: TFormFieldNumber;
  // contest only fields end

  walletCurrency: { value: ECurrency  | ECryptoCurrency; error: string; required: boolean; };
  groupType: { value: EGroupType; error: string; required: boolean; };
  challengeName: TFormFieldString;
  challengeDescription: TFormFieldString;
  maxEntries: TFormFieldNumber;
  minEntries: TFormFieldNumber;
  entryType: { value: EEntryType; error: string; required: boolean; };
  cdnIcon: TFormFieldString;
  challengeKey: TChallengeKeyFields;
  rewardList: TRangedRewardFields[];
  entryFeeList: TEntryFeeFields[];
};


export type TEventPayload = {
  _parseDsi?: {
    operator: string;
    value: number;
  };
  _parseUnlockLogic?: TJsonLogicResult;
  id: number;
  groupId: null | string;
  isLiveOrVisible?: boolean;
  description: string;
  extraTimeBeforeStart: number;
  extraTimeAfterEnd: number;
  enabledCountryCodes: string[];
  jsonLogicFilters: string;
  unlockLogic?: string;
  eventCategory: EEventCategory;
  // additionalParams: TBattleEventDto;
  forceInvisible: boolean;
  appId: string;
  repetitions: {
    repetitionId: number;
    repetitionKeyValueMap: TRepititionKeyValueMap;
  }[];
};

type TNudgeAdditionalParams = {
  subcategory: ESubCategory;
  productIds: string[];
  extraVCPercent: {
    [key: string]: number;
  },
  extraRCPercent: number;
  nudgeCountOnSessionChange: number;
  nudgeDisplayCount: number;
  nudgeCooldownDay: number;
  nudgeCooldownHours: number;
  bgGradient: string[],
  title: string;
  centerGraphicDimension?: {
    w: number;
    h: number;
  },
  centerGraphicTexts: string[];
};

type TNudgeAdditionalParamsFields = {
  subcategory: { value: ESubCategory; error: string; required: boolean; };
  productIds: TFormFieldStringArray;
  extraVCPercent: {
    [key: string]: TFormFieldNumber;
  },
  extraRCPercent: TFormFieldNumber;
  nudgeCountOnSessionChange: TFormFieldNumber;
  nudgeDisplayCount: TFormFieldNumber;
  nudgeCooldownDay: TFormFieldNumber;
  nudgeCooldownHours: TFormFieldNumber;
  bgGradient: TFormFieldStringArray,
  title: TFormFieldString;
  centerGraphicDimension: {
    w: TFormFieldNumber;
    h: TFormFieldNumber;
  },
  centerGraphicTexts: TFormFieldStringArray;
};

export interface IEventBattlePayload extends TEventPayload {
  additionalParams: TBattleAdditionalParams;
}

export interface IEventNudgePayload extends TEventPayload {
  additionalParams: TNudgeAdditionalParams;
}

export type TCashProduct = {
  id: number;
  readableId: string;
  name: string;
  highlightLabel: string;
  currency: ECurrency;
  amount: number;
  offerPercent: number;
  appId: string;
  type: ECashProductType;
  offerAmount: number;
};

export type TCashProductForm = {
  id: TFormFieldNumber;
  readableId: TFormFieldString;
  name: TFormFieldString;
  highlightLabel: TFormFieldString;
  currency: { value: ECurrency; error: string; required: boolean; };
  amount: TFormFieldNumber;
  offerPercent: TFormFieldNumber;
  appId: TFormFieldString;
  type: { value: ECashProductType; error: string; required: boolean; };
  offerAmount: TFormFieldNumber;
};

export type TEventFormControls = {
  value?: string | number;
  error: string;
  checked?: boolean;
  disabled?: boolean;
  render?: boolean;
  onChange?: (event: React.ChangeEvent<{ value: unknown}>, gameId? : string | number | undefined) => void;
};

export type TEventFormControlsFunctional = {
  value: (gameId : string) => string | undefined;
  error: (gameId : string) => string;
  checked?: boolean;
  disabled?: boolean;
  render?: (gameId : string) => boolean;
  onChange?: (event: React.ChangeEvent<{ value: unknown}>, gameId? : string | number | undefined) => void;
};

export type TEventFormControlsBoolean = {
  value?: string | number;
  error: string;
  checked?: boolean;
  disabled?: boolean;
  render?: boolean;
  onChange?: (event: React.ChangeEvent<{ value: unknown, checked: boolean }>, gameId? : string | number | undefined) => void;
};

export type TEventFormControlsBooleanFunctional = {
  value?: string | number;
  error: string;
  checked: (gameId : string) => boolean;
  disabled?: boolean;
  render?: boolean;
  onChange?: (event: React.ChangeEvent<{ value: unknown, checked: boolean }>, gameId? : string | number | undefined) => void;
};

export type TCreateEventPresentationalProps = {
  dataFields: {
    maxExtraTimeBeforeStart: number;
    eventCategory: EEventCategory;
    shouldShowPlaceholder: boolean;
    mutateMode: TMutateModes;
    formSubmit: Function;
    gameIdToGameDataMap: {
      [key: string]: TGameModeDataOptionalFields;
    };
    noAppPlaceholderImageUrl: string;
    noAppPlaceholderText: string;
  };

  formControls: {
    noAppPlaceholder: TEventFormControls;
    id: TEventFormControls;
    groupIdCheckBox: TEventFormControlsBoolean;
    groupIdTextBox: TEventFormControls;
    description: TEventFormControls;
    extraTimeBeforeStart: TEventFormControls;
    extraTimeAfterEnd: TEventFormControls;
    enabledCountryCodes: TEventFormControls;
    walletCurrency: TEventFormControls;
    groupType: TEventFormControls;
    challengeName: TEventFormControls;
    challengeDescription: TEventFormControls;
    challengeKey: TEventFormControls;
    cashFlag: TEventFormControls;
    tournamentNameId : TEventFormControls;
    enableTournamentNameId : TEventFormControlsBoolean;
    secondaryScoreIndex : TEventFormControls;
    tournamentType : TEventFormControls;
    jsonLogicFilters: TEventFormControls;
    unlockLogic: TEventFormControls;
    bannerRulesTextCheckBox: TEventFormControlsBooleanFunctional;
    bannerRulesTextTextBox: TEventFormControlsFunctional;
    gameModeFields: TEventFormControls;
    battleFields: TEventFormControls;
    nudgeFields: TEventFormControls;
  };
};

export type TMutateProps = {
  mutateMode: TMutateModes;
};


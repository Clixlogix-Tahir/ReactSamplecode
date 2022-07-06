import { ECost, ECryptoCurrency, ECurrency, EPlacementLocation } from "../../types/eventTypes";
import { TFormFieldBoolean, TFormFieldNumber, TFormFieldString } from "../../types/formFields";

export enum ESeasonChallengeType {
  SEASON_CHALLENGE = 'seasonChallenge',
  ARENA_CHALLENGE = 'arenaChallenge',
};

export enum ESeasonChallengeStatus {
  notStartedInVisible = 'notStartedInVisible',
  notStartedVisible = 'notStartedVisible',
  started = 'started',
  endedPartially = 'endedPartially',
  endedFully = 'endedFully',
  endedToBeHidden = 'endedToBeHidden',
};

export enum EChallengeType {
  regular = 'regular',
  premium = 'premium',
};

export enum EChallengeTask {
  wager = 'wager',
  play = 'play',
  win = 'win',
  winstreak = 'winstreak',
  primaryScore = 'primaryScore',
  secondaryScore = 'secondaryScore',
  completeChallenge = 'completeChallenge',
  dailyCheckIn = 'dailyCheckIn',
  deposit = 'deposit',
  depositNTimes = 'depositNTimes',
  invite = 'invite',
  inviteXAndDeposit = 'inviteXAndDeposit',
  inviteAndDepositX = 'inviteAndDepositX',
  xpPoint = 'xpPoint',
  xpLevel = 'xpLevel',
  winning = 'winning',
  inviteAndPlay = 'inviteAndPlay',
  inviteAndLevelUp = 'inviteAndLevelUp',
};

export enum EChallengeCashFlag {
  all = 'all',
  cash = 'cash',
  coin = 'coin',
  ticket = 'ticket',
};

export enum EChallengeCashFlagForCrypto {
  all = 'all',
  JRX = 'JRX',
  jrx = 'coin',
  ticket = 'ticket',
};

export enum EChallengeTournamentType {
  all = 'all',
  bracketTournament = 'bracketTournament',
  asyncPlay = 'asyncPlay',
  syncPlay = 'syncPlay',
  asyncFFASinglePlayer = 'asyncFFASinglePlayer',
  multiEntry = 'multiEntry',
  asyncFFAWithWinQualifier = 'asyncFFAWithWinQualifier',
  singlePlay = 'singlePlay',
};

export enum EChallengeGiftBox {
  silver = 'silver',
  gold = 'gold',
  none = 'none',
};

export enum EChallengeDailyRewardType {
  NoReward = 'NoReward',
  VirtualCurrency = 'VirtualCurrency',
  DepositCurrency = 'DepositCurrency',
  BonusCurrency = 'BonusCurrency',
  AbsoluteXP = 'AbsoluteXP',
  PercentXP = 'PercentXP',
  XPMultiplier = 'XPMultiplier',
  CPPoints = 'CPPoints',
  VirtualCurrencyMultiplier = 'VirtualCurrencyMultiplier',
};

export type TChallengeKey = {
  challengeTask: EChallengeTask;
  cashFlag: EChallengeCashFlag;
  tournamentNameId: null | number;
  secondaryScoreIndex: null | number;
  tournamentType: EChallengeTournamentType;
  gameModeOnly?: boolean;
};

export type TChallengeKeyFields = {
  challengeTask: { value: EChallengeTask; error: string; required: true; };
  cashFlag: { value: EChallengeCashFlag; error: string; required: true; };
  tournamentNameId: null | TFormFieldNumber;
  secondaryScoreIndex: null | TFormFieldNumber;
  tournamentType: { value: EChallengeTournamentType; error: string; required: true; };
  gameModeOnly?: { value: boolean; error: string; required: true; };
};

export type TChallengeReward = {
  dailyRewardType: EChallengeDailyRewardType;
  amount: number;
  currencyCode: ECurrency | ECryptoCurrency;
  currencyType: ECost | string;
  duration: number;
};

export type TChallengeRewardFields = {
  dailyRewardType: { value: EChallengeDailyRewardType; error: string; required: true; };
  amount: TFormFieldNumber;
  currencyCode: { value: ECurrency | ECryptoCurrency ; error: string; required: true; };
  currencyType: { value: ECost | string ; error: string; required: true; };
  duration: TFormFieldNumber;
};

export type TChallengeLevels = {
  id?: number;
  parameter: number;
  giftbox: EChallengeGiftBox;
  rewardsList: TChallengeReward[];
};

type TChallengeLevelsFields = {
  id: TFormFieldNumber;
  parameter: TFormFieldNumber;
  giftbox: { value: EChallengeGiftBox; error: string; required: true; };
  rewardsList: TChallengeRewardFields[];
};

export type TChallengeDetails = {
  id?: number;
  challengeType: EChallengeType;
  challengeName: string;
  challengeDescription: string;
  challengeKey: TChallengeKey;
  heroChallenge: boolean;
  dailyChallengeId: null | number;
  challengeLevelsList: TChallengeLevels[];
  heroChallengeData?: {
    heroChallengeTitle: string;
    heroChallengeDescription: string;
    heroChallengeColumnName: string;
  };
  challengeRedirection?: EPlacementLocation | '';
};

export type TChallengeDetailsFields = {
  id: TFormFieldNumber;
  challengeType: { value: EChallengeType; error: string; required: true; };
  challengeName: TFormFieldString;  // editable only for live challenges
  challengeDescription: TFormFieldString;  // editable only for live challenges
  challengeKey: TChallengeKeyFields;
  heroChallenge: TFormFieldBoolean;
  dailyChallengeId: null | TFormFieldNumber;
  challengeLevelsList: TChallengeLevelsFields[];
  heroChallengeData?: {
    heroChallengeTitle: TFormFieldString;
    heroChallengeDescription: TFormFieldString;
    heroChallengeColumnName: TFormFieldString;
  };
  challengeRedirection?: { value: EPlacementLocation | ''; error: string; required: boolean; };
};

export type TChallengeMilestoneRewards = {
  milestone: number;
  id: number;
  requiredCPPoints: number;
  rewardsTier: EChallengeType;
  giftbox: EChallengeGiftBox;
  rewardsList: TChallengeReward[];
};

export type TChallengeMilestoneRewardsFields = {
  milestone: TFormFieldNumber;
  id: TFormFieldNumber;
  requiredCPPoints: TFormFieldNumber;
  rewardsTier: { value: EChallengeType; error: string; required: boolean; };
  giftbox: { value: EChallengeGiftBox; error: string; required: boolean; };
  rewardsList: TChallengeRewardFields[];
};

export enum ESeasonCardType {
  new_season = 'new_season',
  new_challenge = 'new_challenge',
  coming_soon = 'coming_soon',
  season_complete = 'season_complete',
  all_challenge_complete = 'all_challenge_complete',
  claim_reward = 'claim_reward',
};

export type TSeasonCardType = {
  seasonCardType: ESeasonCardType;
  title: string;
  description: string;
};

export type TSeasonCardTypeFields = {
  seasonCardType: { value: ESeasonCardType; error: string; required: boolean; };
  title: TFormFieldString;
  description: TFormFieldString;
};

export type TChallenge = {
  id: number;
  seasonChallengeName: string;
  startAt: number;
  duration: number;
  extraTimeBeforeStart: number;
  extraTimeAfterEnd: number;
  rewardsCollectionBuffer: number;
  appId: string;
  currency: ECurrency | ECryptoCurrency;
  seasonChallengeStatus: null | ESeasonChallengeStatus;
  dailyChallengeList: TChallengeDetails[][];
  seasonChallengeList: TChallengeDetails[];
  rewardsDashboard: TChallengeMilestoneRewards[];
  nextStartAt: number;
  ticketExpiryBuffer: number;
  enableTicketExpiry: boolean;
  seasonCardDataList?: TSeasonCardType[];
  seasonChallengeType: ESeasonChallengeType;
};


export type TChallengeForm = {
  id: TFormFieldNumber;
  seasonChallengeName: TFormFieldString;  // editable only for live challenges
  startAt: TFormFieldNumber;
  duration: TFormFieldNumber;
  extraTimeBeforeStart: TFormFieldNumber;
  extraTimeAfterEnd: TFormFieldNumber;
  rewardsCollectionBuffer: TFormFieldNumber;
  appId: TFormFieldString;
  currency: { value: ECurrency  | ECryptoCurrency; error: string; required: boolean; }
  seasonChallengeStatus: null | { value: ESeasonChallengeStatus; error: string; required: boolean; }
  dailyChallengeList: TChallengeDetailsFields[][];
  seasonChallengeList: TChallengeDetailsFields[];
  rewardsDashboard: TChallengeMilestoneRewardsFields[];
  nextStartAt: TFormFieldNumber;
  ticketExpiryBuffer: TFormFieldNumber;
  enableTicketExpiry: TFormFieldBoolean;
  seasonCardDataList?: TSeasonCardTypeFields[] | null;
  seasonChallengeType: { value: ESeasonChallengeType; error: string; required: boolean; };
};

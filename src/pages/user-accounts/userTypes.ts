import { ECost, ECurrency } from "../../types/eventTypes";
import { EPlatforms } from "../../types/gameConfigTypes";

export enum ERegisteredUserRole {
  REGULAR = 'REGULAR',
  PREVIEW = 'PREVIEW',
  ADMIN = 'ADMIN',
};

export enum EBannedState {
  UNBANNED = 'UNBANNED',
  BANNED = 'BANNED',
}

export type TInstalledApp = {
  appId: string;
  appVersion: string;
  currentUserId: string;
  device: {
    banState: EBannedState;
    bannedApps: null | string;
    deviceModel: string;
    id: number;
    idForAdvertiser: string;
    idForVendor: string;
    osId: string;
    platform: EPlatforms;
  }
  firstUserId: string;
  utmCampaign: string;
  utmContent: string;
  utmMedium: string;
  utmSource: string;
};

export type TUser = {
  user: {
    id: string;
    phone: string;
    email: null | string;
    countryIsoCode: string;
    refreshToken: string;
    role: ERegisteredUserRole;
    userName: null | string;
    firstName: null | string;
    lastName: null | string;
    profileImage: null | string;
    birthDate: null | string;
    gender: null | string;
    userCompositeFlag: number;
    referralCode: null | string;
    isNew: boolean;
    createdAt: number;
  };
  appId: string;
  deviceId: number;
  // referralCode: null | string;  this field has been moved to user now... check line no 51 above...
  userCompositeFlag: number;
  languageCode: string;
  isNew: boolean;
  isGuestUserConversion: boolean;
  createdAt: number;
  combinedCompositeFlag: string;
};

export type TUserResponse = {
  appUserDto: TUser;
  installedAppDto: TInstalledApp;
  userWinCount: number;
  level: number;
}

export enum EWalletActions {
  CREDIT = 'CREDIT',
  DEBIT = 'DEBIT',
};

export enum EVirtualCurrencyPlatform {
  GOOGLE_BILLING = 'GOOGLE_BILLING', //source for cash deposits when done using Google Play Billing
  JR_REWARDS = 'JR_REWARDS', 
  JR_GAMES = 'JR_GAMES',
  JR_CMS = 'JR_CMS',
  TAPJOY = 'TAPJOY',
  JR_SPIN = 'JR_SPIN',
};

export type TWalletLedger = {
  // amount: number;
  // walletType: string; // todo use enum
  // timestamp: number;
  action: EWalletActions;
  appId: string;
  bonusAmount: number;
  createdAt: string;
  currencyCode: ECurrency;
  depositAmount: number;
  description: string;
  deviceId: string;
  id: number;
  isReverted: boolean;
  originalBonusAmount: number;
  originalCurrencyCode: ECurrency;
  originalDepositAmount: number;
  originalWinningsAmount: number;
  softDeletedId: number;
  source: ECurrencyPlatform;
  transactionId: string;
  transactionInfo: string;
  updatedAt: string;
  userId: string;
  winningsAmount: number;
};

export type TVirtualWalletLedger = {
  id: number;
  appId: string;
  userId: string;
  amount: number; 
  currencyType: string;
  platform: EVirtualCurrencyPlatform;
  clientPlatform: EPlatforms;
  action: EWalletActions;
  transactionId: string;
  description: string; 
  transactionInfo: string;
  isReverted: boolean;
  deviceId: string;
  updatedAt: string;
  createdAt: string;
};

export type TRewardStats = {
  bonus: number;
  currencyCode: ECurrency;
  deposit: number;
  pendingWithdrawals: number;
  total: number;
  totalWithdrawalsThisYear: number;
  walletCurrencyCode: ECurrency;
  winnings: number;
};

export enum ECurrencyPlatform {
  PAYPAL = 'PAYPAL',
  STRIPE = 'STRIPE',
  PAYTM = 'PAYTM',
  GOOGLE_BILLING = 'GOOGLE_BILLING',
  JR_CMS = 'JR_CMS',
  JR_REWARDS = 'JR_REWARDS',
  JR_BATTLES = 'JR_BATTLES',
  PAY_LOCKED = 'PAY_LOCKED',
  WITHDRAW = 'WITHDRAW',
  PAYMENT_BLOCKED = 'PAYMENT_BLOCKED',
  JR_BONUS = 'JR_BONUS',
  JR_GAMES = 'JR_GAMES',
};

export type TVirtualWallet = {
  amount: number;
  appId: string;
  createdAt: null | number;
  currencyType: ECost;
  id: number;
  softDeletedId: number;
  updatedAt: null | number;
  userId: string;
};

export type TUserWalletTotalAmounts = {
  depositAmt: number;
  bonusAmt: number;
  winningsAmt: number;
};

export type TUserTrueSkill = {
  userId: string;
  appId: number;
  gameId: number;
  cashMeanSkill: number;
  cashStandardDeviation: number;
  nonCashMeanSkill: number;
  nonCashStandardDeviation: number;
};

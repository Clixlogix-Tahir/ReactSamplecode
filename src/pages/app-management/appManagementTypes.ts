import { TFormFieldNumber, TFormFieldString } from "../../types/formFields";
import { XHR_STATE } from "../../common/constants";
import { ECost, ECryptoCurrency, ECurrency } from "../../types/eventTypes";
import { ERewardTypesForDropDown } from "./constants";
import { TVirtualCurrencyDetails } from "../game-config/gameConfigApi";

export type TUserSlice = {
  getAppSummaries: {
    apps: null | TAppSummary[];
    loading: XHR_STATE;
    error: string;
  };
  getAppDetails: {
    app: null | TAppDetails,
    loading: XHR_STATE;
    error: string;
  };
  updateAppDetails: {
    loading: XHR_STATE;
    error: string;
    showDialog: boolean;
  };
  userXpInfo: {
    info: null | TUserXpInfo;
    loading: XHR_STATE;
    error: string;
  },
  levelRewards: {
    rewards: TLevelReward[];
    loading: XHR_STATE;
    error: string;
  },
  creatingLevelRewards: {
    reward: null | TLevelReward;
    loading: XHR_STATE;
    error: string;
  },
  updatingLevelRewards: {
    reward: null | TLevelReward;
    loading: XHR_STATE;
    error: string;
  },
  deletingLevelRewards: {
    loading: XHR_STATE;
    error: string;
  },
  deleteAllLevelRewardsForALevel: {
    loading: XHR_STATE;
    error: string;
  },
  allDailyCheckinRewardSets: {
    rewardSets : TDailyCheckinRewardSet[],
    loading: XHR_STATE,
    error: string,
  },
  updatingDailyCheckinRewardSet: {
    loading: XHR_STATE,
    error: string,
  },
  creatingDailyCheckinRewardSet: {
    loading: XHR_STATE,
    error: string,
  },
  deletingDailyCheckinRewardSet: {
    loading: XHR_STATE,
    error: string,
  },
};

export type TAppSummary = {
  id: number;
  displayName: string;
  orgName: string;
  appGroup: string;
  appName: string;
  appId: string;
  biAppId: string;
  biAppToken: string;
  serverParams: {
    // todo this is also a part of TApp; refactor to use only one
    appParamUrl: string;
    'virtual.currency': TVirtualCurrencyDetails[];
    realCryptoCurrency: string[];
    // additionalProp1: any;
    // additionalProp2: any;
    // additionalProp3: any;
  }
};

export type TAppDetails = {
  appId: string;
  currencies: string[];
  firebaseProjectId: string;
  biTestAppId: string;
  biTestAppToken: string;
  appParamUrl: string;
  appDisplayName: string;
  companyId: number;
  currencyDisplayNames: string[];
  biAppId: string;
  biAppToken: string;
  releasedAs: string;
  tapjoyAndroidAppId: string;
  tapjoyIOSAppId: string;
  tapjoySecretIOS: string;
  tapjoySecretAndroid: string;
  screenOrientation: string;
  gameURL: string;
  domainAddress: string;
  appleStoreName: string;
  appleId: string;
  moengageAppIdDataApiId: string;
  moengageApiSecret: string;
  dataApiKey: string;
  adjustAppToken: string;
  branchAppId: string;
  branchKey: string;
  branchSecret: string;
  biManagementURL: string;
  zeplinURL: string;
  basicAuthenticationHeaderGenerator: string;
  androidApkLink: string;
  facebookPixelId: string;
  snapchatPixelId: string;
  urls: TUrls;
  [key: string]: number | string | string[] | TUrls;
};

export type TUrls = {
  virtualCurrencyImage: string;
  ticketImage: string;
  realCurrencyImage: string;
  virtualCurrencyMultiplierIconImage: string;
  xpIconImage: string;
  xpMultiplierIconImage: string;
}

export type TAppDetailsRequest = {
  appId: string;
  firebaseProjectId: string;
  biTestAppId: string;
  biTestAppToken: string;
  appParamUrl: string;
  appDisplayName: string;
  companyId: number;
  biAppId: string;
  biAppToken: string;
  releasedAs: string;
  tapjoyAndroidAppId: string;
  tapjoyIOSAppId: string;
  tapjoySecretIOS: string;
  tapjoySecretAndroid: string;
  screenOrientation: string;
  gameURL: string;
  domainAddress: string;
  appleStoreName: string;
  appleId: string;
  moengageAppIdDataApiId: string;
  moengageApiSecret: string;
  dataApiKey: string;
  adjustAppToken: string;
  branchAppId: string;
  branchKey: string;
  branchSecret: string;
  biManagementURL: string;
  zeplinURL: string;
  basicAuthenticationHeaderGenerator: string;
  androidApkLink: string;
  facebookPixelId: string;
  snapchatPixelId: string;
  urls: TUrls;
};

export type TAppForm = {
  appId: TFormFieldString;
  //currency: TFormFieldString;
  firebaseProjectId: TFormFieldString;
  biTestAppId: TFormFieldString;
  biTestAppToken: TFormFieldString;
  appParamUrl: TFormFieldString;
  appDisplayName: TFormFieldString;
  companyId: TFormFieldNumber;
  //currencyDisplayName: TFormFieldString;
  biAppId: TFormFieldString;
  biAppToken: TFormFieldString;
  releasedAs: TFormFieldString;
  tapjoyAndroidAppId: TFormFieldString;
  tapjoyIOSAppId: TFormFieldString;
  tapjoySecretIOS: TFormFieldString;
  tapjoySecretAndroid: TFormFieldString;
  screenOrientation: TFormFieldString;
  gameURL: TFormFieldString;
  domainAddress: TFormFieldString;
  appleStoreName: TFormFieldString;
  appleId: TFormFieldString;
  moengageAppIdDataApiId: TFormFieldString;
  moengageApiSecret: TFormFieldString;
  dataApiKey: TFormFieldString;
  adjustAppToken: TFormFieldString;
  branchAppId: TFormFieldString;
  branchKey: TFormFieldString;
  branchSecret: TFormFieldString;
  biManagementURL: TFormFieldString;
  zeplinURL: TFormFieldString;
  basicAuthenticationHeaderGenerator: TFormFieldString;
  androidApkLink: TFormFieldString;
  facebookPixelId: TFormFieldString;
  snapchatPixelId: TFormFieldString;

  //urls : TUrls ( below fields are part of a single object : TUrls )
  virtualCurrencyImage: TFormFieldString;
  ticketImage: TFormFieldString;
  realCurrencyImage: TFormFieldString;
  virtualCurrencyMultiplierIconImage: TFormFieldString;
  xpIconImage: TFormFieldString;
  xpMultiplierIconImage: TFormFieldString;

  [key: string]: TFormFieldString | TFormFieldNumber;
};

export type TUserXpInfo = {
  start: number;
  increment: number;
  minSessionDurationToGiveXpInSecs: number;
  minIncreaseXp: number;
  maxIncreaseXp: number;
  timeBonus: number;
  winBonusMultiplier: number;
  cashGameBonusPivotAmount: number;
  cashGameBonusMultiplierBelowPivot: number;
  cashGameBonusMultiplierAbovePivot: number;
  privateGameBonusMultiplier: number;
  rematchBonusMinMultiplier: number;
  rematchBonusStepMultiplier: number;
  rematchBonusMaxMultiplier: number;
  firstGameForDayMultiplier: number;
}

export type TLevelReward = {
  id: number;
  appId: string;
  level: number;
  rewardType: ERewardType;
  virtualAmount: number;
  multiplierAmount: number;
  depositAmount: number;
  bonusAmount: number;
  currencyCode: ECurrency | ECryptoCurrency;
  currencyType: ECost | ERewardTypesForDropDown;
  title: string;
  subTitle: string;
  image: string;
  duration: number;
  _formTouched?: boolean;
  _isNew?: boolean;
}

export enum ERewardType {
  EVENT_UNLOCK = 'EVENT_UNLOCK',
  VIRTUAL_CURRENCY = 'VIRTUAL_CURRENCY',
  REAL_CURRENCY = 'REAL_CURRENCY',
  FEATURE_UNLOCK = 'FEATURE_UNLOCK',
  XP_MULTIPLIER = 'XP_MULTIPLIER',
  VIRTUAL_CURRENCY_MULTIPLIER = 'VIRTUAL_CURRENCY_MULTIPLIER',
}

export type TFileUploadResponse = {
  message: string;
  url: string;
}

export enum EDailyRewardType {
  NONE = 'None',
  NO_REWARD = 'NoReward',
  VIRTUAL_CURRENCY = 'VirtualCurrency',
  DEPOSIT_CURRENCY = 'DepositCurrency',
  BONUS_CURRENCY = 'BonusCurrency',
  ABSOLUTE_XP = 'AbsoluteXP',
  PERCENT_XP = 'PercentXP',
  XP_MULTIPLIER = 'XPMultiplier',
  CP_POINTS = 'CPPoints',
  VIRTUAL_CURRENCY_MULTIPLIER = 'VirtualCurrencyMultiplier',
}

export type TDailyReward ={
  dailyRewardType : EDailyRewardType;
  amount: number;
  currencyCode: ECurrency | ECryptoCurrency;
  currencyType: string;
  duration: number;
}

export type TSlot = {
  dailyRewards: TDailyReward[];
}

export type TDailyCheckinRewardSet = {
  index: number;
  id: number | null;
  appId: string;
  rewardSetNum: number;
  slots: TSlot[];
  duration: number;
  uiFlag: boolean;
  active: boolean;
};

export type TRewardSetProps = {
  rewardSet: TDailyCheckinRewardSet;
  rewardSetIndex: number;
  addNewSlot: Function;
  updateSet: Function;
  updateReward: Function;
  save: Function;
  isRecurring: boolean;
  checkForDuplicatePriority: Function;
}

export type TSlotProps = {
  rewardSetIndex: number;
  slotIndex: number;
  slot: TSlot;
  isEditing: boolean;
  updateReward: Function;
  addError: Function;
}

export type TDailyRewardProps = {
  rewardSetIndex: number;
  slotIndex: number;
  slot: TSlot;
  dailyRewardIndex: number;
  dailyReward: TDailyReward;
  isEditing: boolean;
  updateReward: Function;
  usedRewardTypes: Set<EDailyRewardType>;
  addError: Function;
}

export type TActiveSetsPriorityComparision = {
  rewardSets: TDailyCheckinRewardSet[];
}
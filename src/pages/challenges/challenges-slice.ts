import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { TMutateModes } from "../../common/common-types";
import { XHR_STATE } from "../../common/constants";
import { ECost, ECryptoCurrency, ECurrency } from "../../types/eventTypes";
import { TFormFieldBoolean, TFormFieldNumber, TFormFieldString } from "../../types/formFields";
import { TDispatcherOptions } from "../../types/types";
import { ChallengesApi } from "./challenges-api";
import {
  EChallengeCashFlag,
  EChallengeDailyRewardType,
  EChallengeGiftBox,
  EChallengeTask,
  EChallengeTournamentType,
  EChallengeType,
  ESeasonCardType,
  ESeasonChallengeType,
  TChallenge,
  TChallengeDetailsFields,
  TChallengeForm,
  TChallengeMilestoneRewardsFields,
  TChallengeRewardFields,
  TSeasonCardTypeFields
} from "./challenges-types";

type TChallengesState = {
  mutateMode: TMutateModes;
  challenge: TChallengeForm;
  challenges: {
    challengesList: TChallenge[];
    loading: XHR_STATE;
    error: string;
  }
  creatingChallenge: {
    response: null | TChallenge;
    loading: XHR_STATE;
    error: string;
  }
  updatingChallenge: {
    response: null | TChallenge;
    loading: XHR_STATE;
    error: string;
  }
  deletingChallenge: {
    loading: XHR_STATE;
    error: string;
  }
};

const numberField: TFormFieldNumber = { value: 0, error: '', required: true };
const booleanField: TFormFieldBoolean = { value: false, error: '', required: true };
const stringField: TFormFieldString = { value: 'str', error: '', required: true };
const defaultRewardsFields = (defaultVCurrency: string, defaultRealCurrency = ECurrency.USD): TChallengeRewardFields => { return {
  dailyRewardType: { value: EChallengeDailyRewardType.NoReward, error: '', required: true },
  amount: { ...numberField },
  currencyCode: { value: defaultRealCurrency, error: '', required: true },
  currencyType: { value: defaultVCurrency || ECost.EMPTY, error: '', required: true },
  duration: { ...numberField },
}
};

const defaultRewardsFieldsForCrypto = (vCurr = 'COIN2', rCurr = ECurrency.RLY): TChallengeRewardFields => {
  return {
    ...defaultRewardsFields(vCurr, rCurr),
    currencyCode: { value: rCurr, error: '', required: true },
  };
};

type TChallengeDefaults = {
  challengeDetails: TChallengeDetailsFields;
  reward: TChallengeRewardFields;
  rewardsDash: TChallengeMilestoneRewardsFields;
  seasonCardDataList: TSeasonCardTypeFields;
}
export const challengeDefaults = (defaultVCurrency: string, defaultRealCurrency = ECurrency.RLY): TChallengeDefaults => { return {
  reward: defaultRewardsFields(defaultVCurrency, defaultRealCurrency),
  challengeDetails: {
    id: { ...numberField },
    challengeType: { value: EChallengeType.regular, error: '', required: true },
    challengeName: { ...stringField },
    challengeDescription: { ...stringField },
    challengeKey: {
      challengeTask: { value: EChallengeTask.wager, error: '', required: true },
      cashFlag: { value: EChallengeCashFlag.coin, error: '', required: true },
      tournamentNameId: null,
      secondaryScoreIndex: null,
      tournamentType: { value: EChallengeTournamentType.all, error: '', required: true },
      gameModeOnly: { value: false, error: '', required: true },
    },
    heroChallenge: { value: false, error: '', required: true },
    heroChallengeData: {
      heroChallengeTitle: { value: '', error: '', required: true },
      heroChallengeDescription: { value: '', error: '', required: true },
      heroChallengeColumnName: { value: '', error: '', required: true },
    },
    dailyChallengeId: null,
    challengeLevelsList: [
      {
        id: { ...numberField },
        parameter: { ...numberField },
        giftbox: { value: EChallengeGiftBox.silver, error: '', required: true },
        rewardsList: [defaultRewardsFields(defaultVCurrency, defaultRealCurrency)]
      }
    ],
  },
  rewardsDash: {
    milestone: { ...numberField, value: 1 },
    id: { ...numberField },
    requiredCPPoints: { ...numberField },
    rewardsTier: { ...stringField, value: EChallengeType.regular },
    giftbox: { ...numberField, value: EChallengeGiftBox.silver },
    rewardsList: [defaultRewardsFields(defaultVCurrency, defaultRealCurrency)],
  },
  seasonCardDataList: {
    seasonCardType: { ...stringField, value: ESeasonCardType.all_challenge_complete },
    title: { ...stringField },
    description: { ...stringField },
  },
}
};

export const challengeDefaultsForCrypto = (vCurr = 'COIN2', defaultRealCurrency: ECurrency): TChallengeDefaults =>{
  return {
    ...challengeDefaults(vCurr, defaultRealCurrency),
    reward: { ...defaultRewardsFieldsForCrypto(vCurr, defaultRealCurrency) },
    challengeDetails: {
      ...challengeDefaults(vCurr, defaultRealCurrency).challengeDetails,
      challengeLevelsList: [
        {
          id: { ...numberField },
          parameter: { ...numberField },
          giftbox: { value: EChallengeGiftBox.silver, error: '', required: true },
          rewardsList: [{ ...defaultRewardsFieldsForCrypto(vCurr, defaultRealCurrency) }]
        }
      ]
    },
    rewardsDash: {
      ...challengeDefaults(vCurr, defaultRealCurrency).rewardsDash,
      rewardsList: [{ ...defaultRewardsFieldsForCrypto(vCurr, defaultRealCurrency) }],
    },
  }
};

export const defaultChallengeForm = (defaultVCurrency: string): TChallengeForm => { return {
  id: { ...numberField },
  seasonChallengeName: { ...stringField },
  startAt: { ...numberField, value: parseInt((Date.now() / 1000) + 86400 + '') },
  duration: { ...numberField, value: 172800 },
  extraTimeBeforeStart: { ...numberField },
  extraTimeAfterEnd: { ...numberField },
  rewardsCollectionBuffer: { ...numberField },
  appId: { ...numberField, value: '' },
  currency: { ...numberField, value: ECurrency.USD },
  seasonChallengeStatus: null,
  dailyChallengeList: [[challengeDefaults(defaultVCurrency).challengeDetails]],
  seasonChallengeList: [challengeDefaults(defaultVCurrency).challengeDetails],
  rewardsDashboard: [challengeDefaults(defaultVCurrency).rewardsDash],
  seasonCardDataList: [challengeDefaults(defaultVCurrency).seasonCardDataList],
  nextStartAt: { ...numberField },
  ticketExpiryBuffer: { ...numberField },
  enableTicketExpiry: { ...booleanField },
  seasonChallengeType: { value: ESeasonChallengeType.SEASON_CHALLENGE, error: '', required: true, },
}
};

export const defaultChallengeFormForCrypto = (vCurr = 'COIN2', rCurr = ECurrency.RLY): TChallengeForm => {
  const cdf = challengeDefaultsForCrypto(vCurr, rCurr);
  return {
    ...defaultChallengeForm(vCurr),
    currency: { ...numberField, value: rCurr },
    dailyChallengeList: [[{ ...cdf.challengeDetails }]],
    seasonChallengeList: [{ ...cdf.challengeDetails }],
    rewardsDashboard: [{ ...cdf.rewardsDash }],
  }
};

const challengesSlice = createSlice({
  name: 'challengesSlice',
  initialState: {
    mutateMode: 'View',
    challenge: defaultChallengeForm(ECost.EMPTY),  // create/edit form
    challenges: {
      challengesList: [],
      loading: XHR_STATE.ASLEEP,
      error: ''
    },
    creatingChallenge: {
      response: null,
      loading: XHR_STATE.ASLEEP,
      error: '',
    },
    updatingChallenge: {
      response: null,
      loading: XHR_STATE.ASLEEP,
      error: '',
    },
    deletingChallenge: {
      loading: XHR_STATE.ASLEEP,
      error: '',
    },
  } as TChallengesState,
  reducers: {
    setMutateMode: (state, action: PayloadAction<TMutateModes>) => {
      state.mutateMode = action.payload;
    },
    setChallengeForm: (state, action: PayloadAction<TChallengeForm>) => {
      state.challenge = action.payload;
    },

    getChallengesStart: (state, action) => {
      state.challenges.loading = XHR_STATE.IN_PROGRESS;
      state.challenges.error = '';
      state.challenges.challengesList = [];
    },
    getChallengesSuccess: (state, action: PayloadAction<TChallenge[]>) => {
      state.challenges.loading = XHR_STATE.COMPLETE;
      state.challenges.error = '';
      state.challenges.challengesList = action.payload;
    },
    getChallengesError: (state, action) => {
      state.challenges.loading = XHR_STATE.COMPLETE;
      state.challenges.error = action.payload ?
        action.payload.detail :
        'something went wrong while fetching challenges';
    },

    creatingChallengeStart: (state, action) => {
      state.creatingChallenge.loading = XHR_STATE.IN_PROGRESS;
      state.creatingChallenge.error = '';
    },
    creatingChallengeSuccess: (state, action: PayloadAction<TChallenge>) => {
      state.creatingChallenge.loading = XHR_STATE.COMPLETE;
      state.creatingChallenge.error = '';
      state.creatingChallenge.response = action.payload;
    },
    creatingChallengeError: (state, action) => {
      state.creatingChallenge.loading = XHR_STATE.COMPLETE;
      state.creatingChallenge.error = action.payload ?
        action.payload.detail :
        'something went wrong while creating challenge';
    },

    updatingChallengeStart: (state, action) => {
      state.updatingChallenge.loading = XHR_STATE.IN_PROGRESS;
      state.updatingChallenge.error = '';
    },
    updatingChallengeSuccess: (state, action) => {
      state.updatingChallenge.loading = XHR_STATE.COMPLETE;
      state.updatingChallenge.error = '';
    },
    updatingChallengeError: (state, action) => {
      state.updatingChallenge.loading = XHR_STATE.COMPLETE;
      state.updatingChallenge.error = action.payload ?
        action.payload.detail :
        'something went wrong while updating challenge';
    },

    deletingChallengeStart: (state, action) => {
      state.deletingChallenge.loading = XHR_STATE.IN_PROGRESS;
      state.deletingChallenge.error = '';
    },
    deletingChallengeSuccess: (state, action) => {
      state.deletingChallenge.loading = XHR_STATE.COMPLETE;
      state.deletingChallenge.error = '';
    },
    deletingChallengeError: (state, action) => {
      state.deletingChallenge.loading = XHR_STATE.COMPLETE;
      state.deletingChallenge.error = action.payload ?
        action.payload.detail :
        'something went wrong while updating challenge';
    },

    clearLoading: (state, action: PayloadAction<
      'creatingChallenge' |
      'updatingChallenge' |
      'deletingChallenge'
    >) => {
      state[action.payload].loading = XHR_STATE.ASLEEP;
    },
    clearError: (state, action: PayloadAction<
      'creatingChallenge' |
      'updatingChallenge' |
      'deletingChallenge'
    >) => {
      state[action.payload].loading = XHR_STATE.ASLEEP;
      state[action.payload].error = '';
    },
  },
});

const {
  getChallengesError, getChallengesStart, getChallengesSuccess,
  creatingChallengeError, creatingChallengeStart, creatingChallengeSuccess,
  updatingChallengeError, updatingChallengeStart, updatingChallengeSuccess,
  deletingChallengeError, deletingChallengeStart, deletingChallengeSuccess,
  clearLoading, clearError
} = challengesSlice.actions;

export const {
  setMutateMode,
  setChallengeForm,
} = challengesSlice.actions;

export const ChallengesDispatchers = {
  getChallengesSuccess,
  clearLoading,
  clearError,
  getChallenges: (appId: string, success?: Function) =>
  async (dispatch: any) => {
    try {
      dispatch(getChallengesStart(null));
      const data = await ChallengesApi.getChallenges(appId);
      dispatch(getChallengesSuccess(data));
      if (success) success(data);
    } catch (e) {
      dispatch(getChallengesError(e.response.data));
      console.error('something went wrong while creating event', e);
    }
  },

  createChallenge: (payload: TChallenge, appId: string, options?: TDispatcherOptions) =>
  async (dispatch: any) => {
    try {
      dispatch(creatingChallengeStart(payload));
      const data = await ChallengesApi.createChallenge(appId, payload);
      dispatch(creatingChallengeSuccess(data));
      if (options && options.success) options.success();
    } catch (e) {
      dispatch(creatingChallengeError(e.response.data));
      if (options && options.error) options.error();
      console.error('something went wrong while creating event', e.reponse && e.response.data);
    }
  },

  updateChallenge: (payload: TChallenge, appId: string, options?: TDispatcherOptions) =>
  async (dispatch: any) => {
    try {
      dispatch(updatingChallengeStart(payload));
      const data = await ChallengesApi.updateChallenge(appId, payload);
      dispatch(updatingChallengeSuccess(data));
      if (options && options.success) options.success();
    } catch (e) {
      dispatch(updatingChallengeError(e.response.data));
      if (options && options.error) options.error();
      console.error('something went wrong while updating event', e);
    }
  },

  deleteChallenge: (appId: string, eventId: number, options?: TDispatcherOptions) =>
  async (dispatch: any) => {
    try {
      dispatch(deletingChallengeStart({ appId, eventId }));
      const data = await ChallengesApi.deleteChallenge(appId, eventId);
      dispatch(deletingChallengeSuccess(data));
      if (options && options.success) options.success();
    } catch (e) {
      dispatch(deletingChallengeError(e.response.data || 'something went wrong while deleting event'));
      if (options && options.error) options.error();
      console.error('something went wrong while deleting event', e);
    }
  },
};

export default challengesSlice.reducer;

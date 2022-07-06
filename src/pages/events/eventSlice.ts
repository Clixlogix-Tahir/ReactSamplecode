import {
  createSlice,
  Dispatch,
  PayloadAction
} from "@reduxjs/toolkit";
import { CONSTANTS, XHR_STATE } from "../../common/constants";
import { findVarFromJsonLogic } from "../../common/utils";
import {
  ECost, ECountryCode, ECryptoCurrency, ECurrency, EEntryType, EEventCategory, EGroupType, EPlacementLocation,
  ERepetitionType, ESubCategory, EWinScoreLogic, IEventBattleForm, IEventBattlePayload, IEventNudgeForm, IEventNudgePayload, TCashProduct, TEventForm, TEventPayload, TOverridableBotConfigFields, TRangedRewardFields, TVirtualRewardFields
} from "../../types/eventTypes";
import { EBotLogics } from "../../types/gameConfigTypes";
import { TDispatcherOptions } from "../../types/types";
import { EChallengeCashFlag, EChallengeTask, EChallengeTournamentType } from "../challenges/challenges-types";
import { createEventXhr, deleteEventXhr, eventApi, getEventsXhr, updateEventXhr } from "./eventApi";

const numberField = { value: 0, error: '', required: false };
const stringField = { value: '', error: '', required: false };
const booleanField = { value: false, error: '', required: false };

export const getDateTimeForMuiField = (offsetInMillis = 0): string => {
  const newDate = new Date();
  const newStartDate = new Date(parseInt((newDate.getTime() / 1000) + '') * 1000 + offsetInMillis)
    .toISOString()
    .substr(0, newDate.toISOString().length - 1);
  return newStartDate;
};

export const ONE_DAY_IN_MILLIS = 1000 * 60 * 60 * 24;

export const initialRealRewardMap = {
  '2': {
    amount: { value: 0, error: '', required: true },
    currency: { value: ECurrency.USD, error: '', required: true }
  }
};

export const initialVirtualRewardMap = {
  '2': [{
    amount: { value: 0, error: '', required: true },
    currencyType: { value: ECost.KEY, error: '', required: true },
  }]
};

export const defaultBotLogic: TOverridableBotConfigFields = {
  botLogic: { value: EBotLogics.MULTI_PLAYER_AI, error: '', required: true },
  botsWithTrueSkills: { value: false, error: '', required: true },
  botMaxLevel: { value: 1, error: '', required: true },
  botMinLevel: { value: 1, error: '', required: true },
  multiPlayerBotConfig: {},
  trueSkillLevels: { value: '', error: '', required: false },
};

export const defaultBaseRewardField: TRangedRewardFields = {
  minRank: { ...numberField, value: 1 },
  maxRank: { ...numberField, value: 1 },
};

export const defaultVirtualReward: TVirtualRewardFields = {
  amount: { ...numberField, value: 1 },
  currencyType: { ...numberField, value: ECost.KEY },
};

export const defaultRewardFields: TRangedRewardFields = {
  ...defaultBaseRewardField,
  virtualRewards: [{ ...defaultVirtualReward }],
};

export const initialEventForm: TEventForm = {
  _isFormValid: true,
  _isSubmittedOnce: false,
  _validationErrors: [] as string[],
  id: { ...numberField },
  groupId: null,
  description: { ...stringField },
  extraTimeBeforeStart: { ...numberField },
  extraTimeAfterEnd: { ...numberField },
  enabledCountryCodes: { value: [ECountryCode.US], error: '', required: false },
  jsonLogicFilters: { ...stringField },
  unlockLogic: { ...stringField },
  eventCategory: { value: EEventCategory.BATTLE, error: '', required: false },
  forceInvisible: { ...booleanField },
  appId: { ...stringField },
  repetitions: [{
    _type: ERepetitionType.ONE_TIME,
    repetitionId: { ...numberField },
    repetitionKeyValueMap: {
      Start: { value: new Date().toJSON(), error: '', required: true },
      End: { value: new Date(new Date().getTime() + (ONE_DAY_IN_MILLIS)).toJSON(), error: '', required: true },
    },
  }],
};

export const initialBattleForm: IEventBattleForm = {
  ...initialEventForm,
  additionalParams: {
    gameIdToGameDataMap: {},
    displayName: { ...stringField, required: true },
    placementDataList: [{
      placementLocation: { ...stringField, value: EPlacementLocation.PGBottom },
      placementPriority: { ...numberField },
      showOnCollapse: { ...booleanField },
      prerequisiteJsonLogic: { ...stringField },
    }],
    entryFee: {
      amount: { ...numberField },
      currency: { ...stringField, value: ECurrency.USD },
      maxBonusCutPercentage: { ...numberField, value: NaN },
      maxWinningsCutPercentage: { ...numberField, value: NaN },  // currently hardcoded as 100 at backend
    },

    tier: { ...numberField },
    virtualEntryFees: [],
    confirmationPopupTitle: { ...stringField },
    confirmationPopupText: { ...stringField },
    confirmationCTA: { ...stringField },
    confirmationCTASubtitle: { ...stringField },
    matchMakingTime: { ...numberField },
    maxMatchMakingDuration: { ...numberField, value: 10 },
    isFue: { ...booleanField },
    isAsyncEnabled: { ...booleanField },
    asyncBotMatchEnabled: { ...booleanField },
    forcedAsyncPlayerCount: null,
    forcedAsyncMinPlayerCount: null,
    winScoreLogic: { ...numberField, value: EWinScoreLogic.NA },
    resultDelayDuration: { ...numberField },
    playerCountToRewardList: {
      // '0': [{ ...defaultRewardFields }],
    },
    hideEndTime: { ...stringField, value: false },
    showOnCollapse: { ...stringField, value: false },
    imageUrl: { ...stringField },
    entryDescription: { ...stringField },
    retakeDescription: { ...stringField },
    maxEntryCount: { ...numberField },

    groupType: { ...stringField, value: EGroupType.NONE },
    challengeName: { ...stringField },
    challengeDescription: { ...stringField },
    maxEntries: { ...numberField },
    minEntries: { ...numberField },
    entryType: { value: EEntryType.CASH, error: '', required: false, },
    cdnIcon: { ...stringField },
    challengeKey: {
      challengeTask: { value: EChallengeTask.wager, error: '', required: true },
      cashFlag: { value: EChallengeCashFlag.coin, error: '', required: true },
      tournamentNameId: null,
      secondaryScoreIndex: null,
      tournamentType: { value: EChallengeTournamentType.all, error: '', required: true },
    },
    rewardList: [],
    entryFeeList: [],
    walletCurrency: { ...stringField, value: ECryptoCurrency.RLY }, //here giving dummy value 'RLY', proper value can be set in the 
                                                                    //presentational component where we will be knowing whether 
                                                                    //the app is crypto supported or not
  },
};

export const initialNudgeForm: IEventNudgeForm = {
  ...initialEventForm,
  eventCategory: { ...stringField, value: EEventCategory.SALE },
  jsonLogicFilters: { ...stringField, value: JSON.stringify(JSON.parse('{"and":[{"<=":[0,{"var":["depositWinAmount"]}]},{">":[1,{"var":["depositWinAmount"]}]}]}'), null, '  ') },
  additionalParams: {
    subcategory: { ...stringField, value: ESubCategory.CASH_PRODUCT_NUDGE },
    productIds: { ...stringField, value: ["USD_30_30_bigBite"] },
    extraVCPercent: {
      KEY: { ...stringField, value: 0.0 }
    },
    extraRCPercent: { ...stringField, value: 0.0 },
    nudgeCountOnSessionChange: { ...stringField, value: 1 },
    nudgeDisplayCount: { ...stringField, value: 1 },
    nudgeCooldownDay: { ...stringField, value: 1 },
    nudgeCooldownHours: { ...stringField, value: 108 },
    bgGradient: { ...stringField, value: ["#FFFF00", "#FF0000"] },
    title: { ...stringField, value: "Big\nBite" },
    centerGraphicDimension: {
      w: { ...stringField, value: 254 },
      h: { ...stringField, value: 246 },
    },
    centerGraphicTexts: { ...stringField, value: [
      "Skillbased\nmatches",
      "Hasslefree\nwithdrawals",
      "Guaranteed\nfun"
    ]}
  }
};

type TEventState = {
  eventForm: IEventBattleForm;
  nudgeForm: IEventNudgeForm;
  creatingEvent: {
    loading: XHR_STATE;
    error: string;
  };
  events: {
    eventsList: IEventBattlePayload[];
    loading: XHR_STATE;
    error: string;
  };
  updatingEvent: {
    loading: XHR_STATE;
    error: string;
  };
  deletingEvent: {
    loading: XHR_STATE;
    error: string;
  };
  products: {
    productsList: TCashProduct[];
    loading: XHR_STATE;
    error: string;
  };
  createProduct: {
    createdProduct: null | TCashProduct;
    loading: XHR_STATE;
    error: string;
  }
};

const eventSlice = createSlice({
  name: 'eventSlice',
  initialState: {
    eventForm: { ...initialBattleForm },
    nudgeForm: { ...initialNudgeForm },
    creatingEvent: {
      loading: XHR_STATE.ASLEEP,
      error: '',
    },
    events: {
      eventsList: [] as IEventBattlePayload[],
      loading: XHR_STATE.ASLEEP,
      error: '',
    },
    updatingEvent: {
      loading: XHR_STATE.ASLEEP,
      error: '',
    },
    deletingEvent: {
      loading: XHR_STATE.ASLEEP,
      error: '',
    },
    products: {
      productsList: [],
      loading: XHR_STATE.ASLEEP,
      error: '',
    },
    createProduct: {
      createdProduct: null,
      loading: XHR_STATE.ASLEEP,
      error: '',
    },
  } as TEventState,
  reducers: {
    creatingEventStart: (state, action) => {
      state.creatingEvent.loading = XHR_STATE.IN_PROGRESS;
      state.creatingEvent.error = '';
    },
    creatingEventSuccess: (state, action) => {
      state.creatingEvent.loading = XHR_STATE.COMPLETE;
      state.creatingEvent.error = '';
    },
    creatingEventError: (state, action) => {
      state.creatingEvent.loading = XHR_STATE.COMPLETE;
      state.creatingEvent.error = 'something went wrong while creating event';
    },

    setEventForm: (state, action: PayloadAction<IEventBattleForm>) => {
      state.eventForm = action.payload;
    },
    setNudgeForm: (state, action: PayloadAction<IEventNudgeForm>) => {
      state.nudgeForm = action.payload;
    },

    getEventsStart: (state, action) => {
      state.events.loading = XHR_STATE.IN_PROGRESS;
      state.events.error = '';
    },
    getEventsSuccess: (state, action) => {
      state.events.loading = XHR_STATE.ASLEEP;
      state.events.error = '';
      state.events.eventsList = action.payload;
    },
    getEventsError: (state, action) => {
      console.info(state, action);
      state.events.loading = XHR_STATE.ASLEEP;
      state.events.error = 'something went wrong while fetching events';
    },

    updatingEventStart: (state, action) => {
      state.updatingEvent.loading = XHR_STATE.IN_PROGRESS;
      state.updatingEvent.error = '';
    },
    updatingEventSuccess: (state, action) => {
      state.updatingEvent.loading = XHR_STATE.COMPLETE;
      state.updatingEvent.error = '';
    },
    updatingEventError: (state, action) => {
      state.updatingEvent.loading = XHR_STATE.COMPLETE;
      state.updatingEvent.error = 'something went wrong while updating event';
    },

    deletingEventStart: (state, action) => {
      state.deletingEvent.loading = XHR_STATE.IN_PROGRESS;
      state.deletingEvent.error = '';
    },
    deletingEventSuccess: (state, action) => {
      state.deletingEvent.loading = XHR_STATE.COMPLETE;
      state.deletingEvent.error = '';
    },
    deletingEventError: (state, action) => {
      state.deletingEvent.loading = XHR_STATE.COMPLETE;
      state.deletingEvent.error = 'something went wrong while updating event';
    },

    getProductsStart: (state, action) => {
      state.products.productsList = [];
      state.products.loading = XHR_STATE.IN_PROGRESS;
      state.products.error = '';
    },
    getProductsSuccess: (state, action: PayloadAction<TCashProduct[]>) => {
      state.products.loading = XHR_STATE.COMPLETE;
      state.products.error = '';
      state.products.productsList = action.payload;
    },
    getProductsError: (state, action) => {
      state.products.loading = XHR_STATE.COMPLETE;
      state.products.error = 'something went wrong while updating event';
      state.products.productsList = [];
    },

    createProductStart: (state, action) => {
      state.createProduct.loading = XHR_STATE.IN_PROGRESS;
      state.createProduct.error = '';
    },
    createProductSuccess: (state, action: PayloadAction<TCashProduct>) => {
      state.createProduct.loading = XHR_STATE.COMPLETE;
      state.createProduct.error = '';
      state.createProduct.createdProduct = action.payload;
    },
    createProductError: (state, action) => {
      state.createProduct.loading = XHR_STATE.COMPLETE;
      state.createProduct.error = 'something went wrong while updating event';
      state.createProduct.createdProduct = null;
    },
  },
});

export const {
  creatingEventStart, creatingEventSuccess, creatingEventError,
  setEventForm, setNudgeForm,
  getEventsStart, getEventsSuccess, getEventsError,
  updatingEventStart, updatingEventSuccess, updatingEventError,
  deletingEventStart, deletingEventSuccess, deletingEventError,
  getProductsStart, getProductsSuccess, getProductsError,
  createProductStart, createProductSuccess, createProductError,
} = eventSlice.actions;


export const getParseDsi = (events: TEventPayload[]): TEventPayload[] => {
  return events.map(event => {
    let dsi = {
      found: false,
      varInfo: { operator: 'NA', value: -1 }
    };
    try {
      dsi = findVarFromJsonLogic(JSON.parse(event.jsonLogicFilters), 'dsi');
    } catch (e) {
      dsi.found = false;
      console.warn('couldnt parse dsi');
    }
    return {
      ...event,
      _parseDsi: {
        operator: dsi.varInfo.operator,
        value: dsi.varInfo.value,
      }
    };
  });
};

const getParsedUnlockLogic = (data: TEventPayload[]): TEventPayload[] => {
  return data.map(ev => {
    ev._parseUnlockLogic = findVarFromJsonLogic(
      JSON.parse(ev.unlockLogic || '{}'), CONSTANTS.JSON_LOGIC_KEYS.minXpLevel
    );
    return ev;
  });
};

export const eventApiDispatchers = {
  createEvent: (payload: IEventBattlePayload | IEventNudgePayload, appId: string, success?: Function) =>
  async (dispatch: any) => {
    try {
      dispatch(creatingEventStart(payload));
      const data = await createEventXhr(payload, appId);
      dispatch(creatingEventSuccess(data));
      if (success) {
        console.info(success);
        success();
      }
    } catch (e) {
      dispatch(creatingEventError(e));
      console.error('something went wrong while creating event', e.reponse && e.response.data);
    }
  },

  getEvents: (eventCategory: string, appId: string, success?: Function) =>
  async (dispatch: any) => {
    if (appId === CONSTANTS.MISC.SAMPLE_APP) {
      console.warn('getEvents: ignoring sample app');
      return;
    }
    try {
      dispatch(getEventsStart(eventCategory));
      let data = await getEventsXhr(eventCategory, appId, 3000, 0, 100000);
      data = getParseDsi(data);
      data = getParsedUnlockLogic(data);
      dispatch(getEventsSuccess(data));
      if (success) success(data);
    } catch (e) {
      dispatch(getEventsError(e));
      console.error('something went wrong while creating event', e);
    }
  },

  getAllEvents: (eventCategory: string, appId: string, success?: Function) =>
  async (dispatch: any) => {
    if (appId === CONSTANTS.MISC.SAMPLE_APP) {
      console.warn('getAllEvents: ignoring sample app');
      return;
    }
    try {
      dispatch(getEventsStart(eventCategory));
      const battlesAndTournaments = await getEventsXhr(EEventCategory.BATTLE, appId, 3000, 0, 100000);
      const nudges = await getEventsXhr(EEventCategory.SALE, appId, 3000, 0, 100000);
      let merged: TEventPayload[] = [];
      merged = getParseDsi([ ...battlesAndTournaments, ...nudges ]
        .sort((a, b) =>
          parseInt(a.repetitions[0].repetitionKeyValueMap.Start + '') +
          parseInt(b.repetitions[0].repetitionKeyValueMap.Start + ''))
      );
      merged = getParsedUnlockLogic([ ...battlesAndTournaments, ...nudges ]
        .sort((a, b) =>
          parseInt(a.repetitions[0].repetitionKeyValueMap.Start + '') +
          parseInt(b.repetitions[0].repetitionKeyValueMap.Start + ''))
      );
      dispatch(getEventsSuccess(merged));
      if (success) success();
    } catch (e) {
      dispatch(getEventsError(e));
      console.error('something went wrong while fetching events', e);
    }
  },

  updateEvent: (payload: IEventBattlePayload | IEventNudgePayload, appId: string, eventId: number, options?: TDispatcherOptions) =>
  async (dispatch: any) => {
    try {
      dispatch(updatingEventStart(payload));
      const data = await updateEventXhr(payload, appId, eventId);
      dispatch(updatingEventSuccess(data));
      if (options && options.success) options.success();
    } catch (e) {
      dispatch(updatingEventError);
      if (options && options.error) options.error();
      console.error('something went wrong while updating event', e);
    }
  },

  deleteEvent: (appId: string, eventId: number, options?: TDispatcherOptions) =>
  async (dispatch: any) => {
    try {
      dispatch(deletingEventStart({ appId, eventId }));
      const data = await deleteEventXhr(appId, eventId);
      dispatch(deletingEventSuccess(data));
      if (options && options.success) options.success();
    } catch (e) {
      dispatch(deletingEventError(e));
      if (options && options.error) options.error();
      console.error('something went wrong while deleting event', e);
    }
  },

  getCashProducts: (appId: string, options?: TDispatcherOptions) =>
  async (dispatch: Dispatch<any>) => {
    try {
      dispatch(getProductsStart({ appId }));
      const data : TCashProduct[] = await eventApi.getCashProductsXhr(appId);
      data.sort((a, b) => a.id - b.id);
      dispatch(getProductsSuccess(data));
      if (options && options.success) options.success();
    } catch (e) {
      dispatch(getProductsError(e));
      if (options && options.error) options.error();
      console.error('something went wrong while getCashProducts', e);
    }
  },

  createCashProduct: (appId: string, payload: TCashProduct, options?: TDispatcherOptions) =>
  async (dispatch: Dispatch<any>) => {
    try {
      dispatch(createProductStart({ appId }));
      const data = await eventApi.createCashProductXhr(appId, payload);
      dispatch(createProductSuccess(data));
      if (options && options.success) options.success(data);
    } catch (e) {
      dispatch(createProductError(e));
      if (options && options.error) options.error();
      console.error('something went wrong while createCashProduct', e);
    }
  },
};

export default eventSlice.reducer;

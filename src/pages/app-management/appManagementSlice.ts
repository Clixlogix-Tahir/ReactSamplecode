import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { XHR_STATE } from "../../common/constants";
import { TAppDetails, TAppDetailsRequest, TAppForm, TAppSummary, TDailyCheckinRewardSet, TLevelReward, TUserSlice } from "./appManagementTypes";
import { appManagementApi } from "./appManagementApi";
import { TFormFieldString } from "../../types/formFields";
import { TUserXpInfo } from "./appManagementTypes";
import { TDispatcherOptions } from "../../types/types";

const DEFAULT_ERROR_TEXT = 'Something went wrong. Please try again. 😵';

const stringField: TFormFieldString = {
  value: '',
  error: '',
  required: false,
};

export const defaultAppForm: TAppForm = {
  appId: { ...stringField },
  firebaseProjectId: { ...stringField },
  biTestAppId: { ...stringField },
  biTestAppToken: { ...stringField },
  appParamUrl: { ...stringField },
  appDisplayName: { ...stringField },
  companyId: { ...stringField, value: 0 },
  biAppId: { ...stringField },
  biAppToken: { ...stringField },
  releasedAs: { ...stringField },
  tapjoyAndroidAppId: { ...stringField },
  tapjoyIOSAppId: { ...stringField },
  tapjoySecretIOS: { ...stringField },
  tapjoySecretAndroid: { ...stringField },
  screenOrientation: { ...stringField },
  gameURL: { ...stringField },
  domainAddress: { ...stringField },
  appleStoreName: { ...stringField },
  appleId: { ...stringField },
  moengageAppIdDataApiId: { ...stringField },
  moengageApiSecret: { ...stringField },
  dataApiKey: { ...stringField },
  adjustAppToken: { ...stringField },
  branchAppId: { ...stringField },
  branchKey: { ...stringField },
  branchSecret: { ...stringField },
  biManagementURL: { ...stringField },
  zeplinURL: { ...stringField },
  basicAuthenticationHeaderGenerator: { ...stringField },
  androidApkLink: { ...stringField },
  facebookPixelId: { ...stringField },
  snapchatPixelId: { ...stringField },

  //urls
  virtualCurrencyImage: { ...stringField },
  ticketImage: { ...stringField },
  realCurrencyImage: { ...stringField },
  virtualCurrencyMultiplierIconImage: { ...stringField },
  xpIconImage: { ...stringField },
  xpMultiplierIconImage: { ...stringField }
};

const initialState: TUserSlice = {
  getAppSummaries: {
    // todo use this instead of gameConfigFormSlice.apps
    apps: [],
    loading: XHR_STATE.ASLEEP,
    error: '',
  },
  getAppDetails: {
    app: null,
    loading: XHR_STATE.ASLEEP,
    error: '',
  },
  updateAppDetails: {
    loading: XHR_STATE.ASLEEP,
    error: '',
    showDialog: false,
  },
  userXpInfo: {
    info: null,
    loading: XHR_STATE.ASLEEP,
    error: '',
  },
  levelRewards: {
    rewards: [],
    loading: XHR_STATE.ASLEEP,
    error: '',
  },
  creatingLevelRewards: {
    reward: null,
    loading: XHR_STATE.ASLEEP,
    error: '',
  },
  updatingLevelRewards: {
    reward: null,
    loading: XHR_STATE.ASLEEP,
    error: '',
  },
  deletingLevelRewards: {
    loading: XHR_STATE.ASLEEP,
    error: '',
  },
  deleteAllLevelRewardsForALevel: {
    loading: XHR_STATE.ASLEEP,
    error: '',
  },
  allDailyCheckinRewardSets: {
    rewardSets : [],
    loading: XHR_STATE.ASLEEP,
    error: '',
  },
  updatingDailyCheckinRewardSet: {
    loading: XHR_STATE.ASLEEP,
    error: '',
  },
  creatingDailyCheckinRewardSet: {
    loading: XHR_STATE.ASLEEP,
    error: '',
  },
  deletingDailyCheckinRewardSet: {
    loading: XHR_STATE.ASLEEP,
    error: '',
  },
};

const userSlice = createSlice({
  name: 'userSlice',
  initialState: initialState,
  reducers: {

    getAllDailyCheckinRewardSetsStart: (state, action) => {
      state.allDailyCheckinRewardSets.loading = XHR_STATE.IN_PROGRESS;
      state.allDailyCheckinRewardSets.error = '';
    },
    getAllDailyCheckinRewardSetsSuccess: (state, action: PayloadAction<TDailyCheckinRewardSet[]>) => {
      state.allDailyCheckinRewardSets.loading = XHR_STATE.COMPLETE;
      state.allDailyCheckinRewardSets.rewardSets = action.payload;
    },
    getAllDailyCheckinRewardSetsError: (state, action) => {
      state.allDailyCheckinRewardSets.loading = XHR_STATE.ASLEEP;
      state.allDailyCheckinRewardSets.error = (action.payload && action.payload.detail) ?
        `${action.payload.detail} 😵` :
        DEFAULT_ERROR_TEXT;
    },

    updateDailyCheckinRewardSetStart: (state, action) => {
      state.updatingDailyCheckinRewardSet.loading = XHR_STATE.IN_PROGRESS;
      state.updatingDailyCheckinRewardSet.error = '';
    },
    updateDailyCheckinRewardSetSuccess: (state, action) => {
      state.updatingDailyCheckinRewardSet.loading = XHR_STATE.COMPLETE;
    },
    updateDailyCheckinRewardSetError: (state, action) => {
      state.updatingDailyCheckinRewardSet.loading = XHR_STATE.ASLEEP;
      state.updatingDailyCheckinRewardSet.error = (action.payload && action.payload.detail) ?
        `${action.payload.detail} 😵` :
        DEFAULT_ERROR_TEXT;
    },

    createDailyCheckinRewardSetStart: (state, action) => {
      state.creatingDailyCheckinRewardSet.loading = XHR_STATE.IN_PROGRESS;
      state.creatingDailyCheckinRewardSet.error = '';
    },
    createDailyCheckinRewardSetSuccess: (state, action) => {
      state.creatingDailyCheckinRewardSet.loading = XHR_STATE.COMPLETE;
    },
    createDailyCheckinRewardSetError: (state, action) => {
      state.creatingDailyCheckinRewardSet.loading = XHR_STATE.ASLEEP;
      state.creatingDailyCheckinRewardSet.error = (action.payload && action.payload.detail) ?
        `${action.payload.detail} 😵` :
        DEFAULT_ERROR_TEXT;
    },

    deleteDailyCheckinRewardSetStart: (state, action) => {
      state.deletingDailyCheckinRewardSet.loading = XHR_STATE.IN_PROGRESS;
      state.deletingDailyCheckinRewardSet.error = '';
    },
    deleteDailyCheckinRewardSetSuccess: (state, action) => {
      state.deletingDailyCheckinRewardSet.loading = XHR_STATE.COMPLETE;
    },
    deleteDailyCheckinRewardSetError: (state, action) => {
      state.deletingDailyCheckinRewardSet.loading = XHR_STATE.ASLEEP;
      state.deletingDailyCheckinRewardSet.error = (action.payload && action.payload.detail) ?
        `${action.payload.detail} 😵` :
        DEFAULT_ERROR_TEXT;
    },

    getAppSummariesStart: (state, action) => {
      state.getAppSummaries.loading = XHR_STATE.IN_PROGRESS;
      state.getAppSummaries.error = '';
    },
    getAppSummariesSuccess: (state, action: PayloadAction<TAppSummary[]>) => {
      state.getAppSummaries.loading = XHR_STATE.ASLEEP;
      state.getAppSummaries.apps = action.payload;
    },
    getAppSummariesError: (state, action) => {
      state.getAppSummaries.loading = XHR_STATE.ASLEEP;
      state.getAppSummaries.error = (action.payload && action.payload.detail) ?
        `${action.payload.detail} 😵` :
        DEFAULT_ERROR_TEXT;
    },

    getAppDetailsStart: (state, action) => {
      state.getAppDetails.loading = XHR_STATE.IN_PROGRESS;
      state.getAppDetails.error = '';
    },
    getAppDetailsSuccess: (state, action: PayloadAction<TAppDetails>) => {
      state.getAppDetails.app = action.payload;
      state.getAppDetails.loading = XHR_STATE.COMPLETE;
      state.getAppDetails.error = '';
    },
    getAppDetailsError: (state, action) => {
      state.getAppDetails.loading = XHR_STATE.ASLEEP;
      state.getAppDetails.error = (action.payload && action.payload.detail) ?
        `${action.payload.detail} 😵` :
        DEFAULT_ERROR_TEXT;
    },

    updateAppDetailsStart: (state, action) => {
      state.updateAppDetails.loading = XHR_STATE.IN_PROGRESS;
      state.updateAppDetails.error = '';
    },
    updateAppDetailsSuccess: (state, action) => {
      state.updateAppDetails.loading = XHR_STATE.COMPLETE;
      state.updateAppDetails.error = '';
      state.updateAppDetails.showDialog = false;
    },
    updateAppDetailsError: (state, action) => {
      state.updateAppDetails.loading = XHR_STATE.ASLEEP;
      state.updateAppDetails.error = action.payload ?
        `${action.payload} 😵` :
        DEFAULT_ERROR_TEXT;
    },

    getUserXpInfoStart: (state, action) => {
      state.userXpInfo.info = null;
      state.userXpInfo.loading = XHR_STATE.IN_PROGRESS;
      state.userXpInfo.error = '';
    },
    getUserXpInfoSuccess: (state, action: PayloadAction<TUserXpInfo>) => {
      state.userXpInfo.info = action.payload;
      state.userXpInfo.loading = XHR_STATE.COMPLETE;
      state.userXpInfo.error = '';
    },
    getUserXpInfoError: (state, action) => {
      state.userXpInfo.loading = XHR_STATE.ASLEEP;
      state.userXpInfo.error = (action.payload && action.payload.detail) ?
        `${action.payload.detail} 😵` :
        DEFAULT_ERROR_TEXT;
    },

    getLevelRewardsStart: (state, action) => {
      state.levelRewards.rewards = [];
      state.levelRewards.loading = XHR_STATE.IN_PROGRESS;
      state.levelRewards.error = '';
    },
    getLevelRewardsSuccess: (state, action: PayloadAction<TLevelReward[]>) => {
      state.levelRewards.rewards = action.payload;
      state.levelRewards.loading = XHR_STATE.COMPLETE;
      state.levelRewards.error = '';
    },
    getLevelRewardsError: (state, action) => {
      state.levelRewards.loading = XHR_STATE.ASLEEP;
      state.levelRewards.error = (action.payload && action.payload.detail) ?
        `${action.payload.detail} 😵` :
        DEFAULT_ERROR_TEXT;
    },

    creatingLevelRewardsStart: (state, action) => {
      state.creatingLevelRewards.reward = null;
      state.creatingLevelRewards.loading = XHR_STATE.IN_PROGRESS;
      state.creatingLevelRewards.error = '';
    },
    creatingLevelRewardsSuccess: (state, action: PayloadAction<TLevelReward>) => {
      state.creatingLevelRewards.reward = action.payload;
      state.creatingLevelRewards.loading = XHR_STATE.COMPLETE;
      state.creatingLevelRewards.error = '';
    },
    creatingLevelRewardsError: (state, action) => {
      state.creatingLevelRewards.reward = null;
      state.creatingLevelRewards.loading = XHR_STATE.ASLEEP;
      state.creatingLevelRewards.error = (action.payload && action.payload.detail) ?
        `${action.payload.detail} 😵` :
        DEFAULT_ERROR_TEXT;
    },

    updatingLevelRewardsStart: (state, action) => {
      state.updatingLevelRewards.reward = null;
      state.updatingLevelRewards.loading = XHR_STATE.IN_PROGRESS;
      state.updatingLevelRewards.error = '';
    },
    updatingLevelRewardsSuccess: (state, action: PayloadAction<TLevelReward>) => {
      state.updatingLevelRewards.reward = action.payload;
      state.updatingLevelRewards.loading = XHR_STATE.COMPLETE;
      state.updatingLevelRewards.error = '';
    },
    updatingLevelRewardsError: (state, action) => {
      state.updatingLevelRewards.reward = null;
      state.updatingLevelRewards.loading = XHR_STATE.ASLEEP;
      state.updatingLevelRewards.error = (action.payload && action.payload.detail) ?
        `${action.payload.detail} 😵` :
        DEFAULT_ERROR_TEXT;
    },

    deletingLevelRewardsStart: (state, action) => {
      state.deletingLevelRewards.loading = XHR_STATE.IN_PROGRESS;
      state.deletingLevelRewards.error = '';
    },
    deletingLevelRewardsSuccess: (state, action) => {
      state.deletingLevelRewards.loading = XHR_STATE.COMPLETE;
      state.deletingLevelRewards.error = '';
    },
    deletingLevelRewardsError: (state, action) => {
      state.deletingLevelRewards.loading = XHR_STATE.ASLEEP;
      state.deletingLevelRewards.error = (action.payload && action.payload.detail) ?
        `${action.payload.detail} 😵` :
        DEFAULT_ERROR_TEXT;
    },

    deleteAllLevelRewardsForALevelStart: (state, action) => {
      state.deleteAllLevelRewardsForALevel.loading = XHR_STATE.IN_PROGRESS;
      state.deleteAllLevelRewardsForALevel.error = '';
    },
    deleteAllLevelRewardsForALevelSuccess: (state, action) => {
      state.deleteAllLevelRewardsForALevel.loading = XHR_STATE.COMPLETE;
      state.deleteAllLevelRewardsForALevel.error = '';
    },
    deleteAllLevelRewardsForALevelError: (state, action) => {
      state.deleteAllLevelRewardsForALevel.loading = XHR_STATE.ASLEEP;
      state.deleteAllLevelRewardsForALevel.error = (action.payload && action.payload.detail) ?
        `${action.payload.detail} 😵` :
        DEFAULT_ERROR_TEXT;
    },

    clearLoading: (state, action) => {
      state.deleteAllLevelRewardsForALevel.loading = XHR_STATE.ASLEEP;
    },

    clearError: (state, action) => {
      state.deleteAllLevelRewardsForALevel.loading = XHR_STATE.ASLEEP;
      state.deleteAllLevelRewardsForALevel.error = '';
    },
  }
});


export const appManagementDispatchers = {

  clearError: () =>
  async (dispatch: any) => {
    // todo this seems unused
    dispatch(clearError(null));
  },

  clearLoading: () =>
  async (dispatch: any) => {
    // todo this seems unused
    dispatch(clearLoading(null));
  },

  getAppSummaries: () =>
  async (dispatch: any) => {
    // todo this seems unused
    try {
      dispatch(getAppSummariesStart(null));
      const user = await appManagementApi.getListOfApps();
      dispatch(getAppSummariesSuccess(user));
    } catch (error) {
      console.error('error.response\n', (error as any).response);
      dispatch(getAppSummariesError(((error as any).response && (error as any).response.data) || null));
    }
  },

  getAllDailyCheckinRewardDispatcher: (appId: string, options?: TDispatcherOptions) =>
  async (dispatch: any) => {
    if (!appId) {
      console.warn('getAllDailyCheckinRewardDispatcher: appId is required');
      return;
    }
    try {
      dispatch(getAllDailyCheckinRewardSetsStart(null));
      const rewardSets = await appManagementApi.getDailyCheckinRewardsXHR(appId);
      dispatch(getAllDailyCheckinRewardSetsSuccess(rewardSets));
      if (options && options.success) options.success(rewardSets);
    } catch (error) {
      console.error('error.response\n', (error as any).response);
      dispatch(getAllDailyCheckinRewardSetsError(((error as any).response && (error as any).response.data) || null));
      if (options && options.error) options.error();
    }
  },

  updateDailyCheckinRewardDispatcher: (appId: string, set: TDailyCheckinRewardSet, options?: TDispatcherOptions) =>
  async (dispatch: any) => {
    if (!appId) {
      console.warn('getAllDailyCheckinRewardDispatcher: appId is required.');
      return;
    }
    try {
      dispatch(updateDailyCheckinRewardSetStart(set));
      const rewardSet = await appManagementApi.updateDailyCheckinRewardXHR(appId, set);
      dispatch(updateDailyCheckinRewardSetSuccess(rewardSet));
      if (options && options.success) options.success(rewardSet);
    } catch (error) {
      console.error('error.response\n', (error as any).response);
      dispatch(updateDailyCheckinRewardSetError(((error as any).response && (error as any).response.data) || null));
      if (options && options.error) options.error();
    }
  },

  createDailyCheckinRewardDispatcher: (appId: string, set: TDailyCheckinRewardSet, options?: TDispatcherOptions) =>
  async (dispatch: any) => {
    if (!appId) {
      console.warn('getAllDailyCheckinRewardDispatcher: appId is required.');
      return;
    }
    try {
      dispatch(updateDailyCheckinRewardSetStart(null));
      const rewardSet = await appManagementApi.createDailyCheckinRewardXHR(appId, set);
      dispatch(updateDailyCheckinRewardSetSuccess(rewardSet));
      if (options && options.success) options.success(rewardSet);
    } catch (error) {
      console.error('error.response\n', (error as any).response);
      dispatch(updateDailyCheckinRewardSetError(((error as any).response && (error as any).response.data) || null));
      if (options && options.error) options.error();
    }
  },

  deleteDailyCheckinRewardDispatcher: (appId: string, setNumber: number, options?: TDispatcherOptions) =>
  async (dispatch: any) => {
    if (!appId) {
      console.warn('deleteDailyCheckinRewardDispatcher: appId is required.');
      return;
    }
    try {
      dispatch(deleteDailyCheckinRewardSetStart(null));
      const rewardSet = await appManagementApi.deleteDailyCheckinRewardXHR(appId, setNumber);
      dispatch(deleteDailyCheckinRewardSetSuccess(rewardSet));
      if (options && options.success) options.success(rewardSet);
    } catch (error) {
      console.error('error.response\n', (error as any).response);
      dispatch(deleteDailyCheckinRewardSetError(((error as any).response && (error as any).response.data) || null));
      if (options && options.error) options.error();
    }
  },

  getAppDetails: (appId: string) =>
  async (dispatch: any) => {
    if (!appId) {
      console.warn('getAppDetails: appId is required');
      return;
    }
    try {
      dispatch(getAppDetailsStart({ appId }));
      const response = await appManagementApi.getAppDetails(appId);
      dispatch(getAppDetailsSuccess(response));
    } catch (error) {
      console.error('error.response\n', (error as any).response);
      dispatch(getAppDetailsError((error as any).response ? (error as any).response.data : null));
    }
  },

  updateAppDetails: (
    payload: TAppDetailsRequest,
    callbacks?: {
      success?: Function,
      error?: Function,
    },
  ) =>
  async (dispatch: any) => {
    try {
      dispatch(updateAppDetailsStart({ payload }));
      const response = await appManagementApi.updateAppDetails(payload);
      dispatch(updateAppDetailsSuccess(response));
      if (callbacks && callbacks.success) callbacks.success(response);
    } catch (error) {
      console.error('error.response\n', (error as any).response);
      dispatch(updateAppDetailsError((error as any).response ? (error as any).response.data : null));
      if (callbacks && callbacks.error) callbacks.error();
    }
  },

  getUserXpInfo: (appId: string) =>
  async (dispatch: any) => {
    if (!appId) {
      console.warn('getUserXpInfo: appId is required');
      return;
    }
    try {
      dispatch(getUserXpInfoStart({ appId }));
      const response = await appManagementApi.getUserSkillInfo(appId);
      dispatch(getUserXpInfoSuccess(response));
    } catch (error) {
      console.error('error.response\n', (error as any).response);
      dispatch(getUserXpInfoError((error as any).response ? (error as any).response.data : null));
    }
  },

  getLevelRewards: (appId: string) =>
  async (dispatch: any) => {
    if (!appId) {
      console.warn('getLevelRewards: appId is required');
      return;
    }
    try {
      dispatch(getLevelRewardsStart({ appId }));
      const rewards = await appManagementApi.getLevelRewards(appId);
      rewards.sort((r1, r2) => r1.level - r2.level );
      dispatch(getLevelRewardsSuccess(rewards));
    } catch (error) {
      console.error('error.response\n', (error as any).response);
      dispatch(getLevelRewardsError((error as any).response ? (error as any).response.data : null));
    }
  },

  createLevelReward: (appId: string, levelReward: TLevelReward, options?: TDispatcherOptions) =>
    async (dispatch: any) => {
      if (!appId) {
        console.warn('updateLevelReward: appId is required');
        return;
      }
      try {
        dispatch(creatingLevelRewardsStart({ appId }));
        const reward = await appManagementApi.createLevelReward(appId, levelReward);
        dispatch(creatingLevelRewardsSuccess(reward));
        if (options && options.success) options.success(reward);
      } catch (error) {
        console.error('error.response\n', (error as any).response);
        dispatch(creatingLevelRewardsError((error as any).response ? (error as any).response.data : null));
        if (options && options.error) options.error();
      }
    },

  updateLevelReward: (appId: string, levelReward: TLevelReward, options?: TDispatcherOptions) =>
    async (dispatch: any) => {
      if (!appId) {
        console.warn('updateLevelReward: appId is required');
        return;
      }
      try {
        dispatch(updatingLevelRewardsStart({ appId }));
        const reward = await appManagementApi.updateLevelReward(appId, levelReward);
        dispatch(updatingLevelRewardsSuccess(reward));
        if (options && options.success) options.success(reward);
      } catch (error) {
        console.error('error.response\n', (error as any).response);
        dispatch(updatingLevelRewardsError((error as any).response ? (error as any).response.data : null));
        if (options && options.error) options.error();
      }
    },

  deleteLevelReward: (appId: string, levelRewardId: number, options?: TDispatcherOptions) =>
    async (dispatch: any) => {
      if (!appId) {
        console.warn('deleteLevelReward: appId is required');
        return;
      }
      try {
        dispatch(deletingLevelRewardsStart({ appId }));
        const rewards = await appManagementApi.deleteLevelReward(appId, levelRewardId);
        dispatch(deletingLevelRewardsSuccess(rewards));
       if (options && options.success) options.success(rewards);
      } catch (error) {
        console.error('error.response\n', (error as any).response);
        dispatch(deletingLevelRewardsError((error as any).response ? (error as any).response.data : null));
       // if (options && options.error) options.error();
      }
    },

  deleteAllLevelRewardsForALevel: (appId: string, levelNumber: string, options?: TDispatcherOptions) =>
    async (dispatch: any) => {
      if (!appId) {
        console.warn('deleteLevelReward: appId is required');
        return;
      }
      try {
        dispatch(deleteAllLevelRewardsForALevelStart({ appId }));
        const rewards = await appManagementApi.deleteAllLevelRewardsForALevel(appId, levelNumber);
        dispatch(deleteAllLevelRewardsForALevelSuccess(rewards));
        if (options && options.success) options.success(rewards);
      } catch (error) {
        console.error('error.response\n', (error as any).response);
        dispatch(deleteAllLevelRewardsForALevelError((error as any).response ? (error as any).response.data : null));
        if (options && options.error) options.error();
      }
    }
};


const {
  getAppSummariesStart, getAppSummariesSuccess, getAppSummariesError,
  getAppDetailsStart, getAppDetailsSuccess, getAppDetailsError,
  updateAppDetailsStart, updateAppDetailsSuccess, updateAppDetailsError,
  getUserXpInfoStart, getUserXpInfoSuccess, getUserXpInfoError,
  getLevelRewardsStart, getLevelRewardsError,
  creatingLevelRewardsStart, creatingLevelRewardsSuccess, creatingLevelRewardsError,
  updatingLevelRewardsStart, updatingLevelRewardsSuccess, updatingLevelRewardsError,
  deletingLevelRewardsStart, deletingLevelRewardsSuccess, deletingLevelRewardsError,
  deleteAllLevelRewardsForALevelStart, deleteAllLevelRewardsForALevelSuccess, deleteAllLevelRewardsForALevelError,
  clearError, clearLoading,
  getAllDailyCheckinRewardSetsStart, getAllDailyCheckinRewardSetsError,
  updateDailyCheckinRewardSetStart, updateDailyCheckinRewardSetSuccess, updateDailyCheckinRewardSetError,
  createDailyCheckinRewardSetStart, createDailyCheckinRewardSetSuccess, createDailyCheckinRewardSetError,
  deleteDailyCheckinRewardSetStart, deleteDailyCheckinRewardSetSuccess, deleteDailyCheckinRewardSetError,
} = userSlice.actions;

export const {
  getLevelRewardsSuccess,
  getAllDailyCheckinRewardSetsSuccess,
} = userSlice.actions;

export default userSlice.reducer;

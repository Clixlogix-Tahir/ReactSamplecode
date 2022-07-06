import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CONSTANTS, XHR_STATE } from "../../common/constants";
import { TFormFieldBoolean, TFormFieldNumber, TFormFieldNumberArray, TFormFieldString } from "../../types/formFields";
import { EBotLogics, EGameModes, EGameSessionType, EOrientations, EPlatforms, EReleaseStates, EScoringTypes,
  EShrinkShape, ETutorialTypes, EVersions, TBotConfigFields, TGameConfigForm, TGameConfigPayload, TUserModerationResponse
} from "../../types/gameConfigTypes";
import { createOrEditGameConfigXhr, deleteGameXhr, getAppsListXhr, getGameDataXhr,
  revertFromLastLiveXhr, TApp, upgradeFromDraftToLiveXhr, upgradeFromTestToLiveXhr,
  upgradeToPreviewLiveXhr, fetchUserModerationXhr, fetchAllUserModerationXhr
} from "./gameConfigApi";
import { isExpired } from "../user-accounts/user-moderation"
import { TDispatcherOptions } from "../../types/types";
import { TAppSummary } from "../app-management/appManagementTypes";

const jsonField = {
  value: {},
  error: '',
  required: true,
};

const stringField:TFormFieldString = {
  value: '',
  error: '',
  required: true,
};

const numberField:TFormFieldNumber = {
  value: 1,
  error: '',
  required: true,
};

const numberArrayField:TFormFieldNumberArray = {
  value: '1',
  error: '',
  required: true,
};

const booleanField:TFormFieldBoolean = {
  value: false,
  error: '',
  required: true,
};

export const defaultIOSPlatformData = {
  platform: { value: EPlatforms.iOS, error: '', required: true },
  minAppVersion: { value: '3.9.3', error: '', required: true },
  maxAppVersion: { value: '99.99.0', error: '', required: true },
  shrinkSize: { ...numberArrayField },
  webViewResolution: { ...numberArrayField },
  shrinkShape: { value: EShrinkShape.CIRCLE, error: '', required: true },
};
export const defaultAndroidPlatformData = {
  platform: { value: EPlatforms.Android, error: '', required: true },
  minAppVersion: { value: '4.1.7', error: '', required: true },
  maxAppVersion: { value: '99.99.0', error: '', required: true },
  shrinkSize: { ...numberArrayField },
  webViewResolution: { ...numberArrayField },
  shrinkShape: { value: EShrinkShape.CIRCLE, error: '', required: true },
}

export const defaultBotConfigField: TBotConfigFields = {
  botLogic: { ...stringField, value:EBotLogics.MULTI_PLAYER_AI },
  botsWithTrueSkills: { ...numberField, value: false },
  botMaxLevel: { ...numberField },
  botMinLevel: { ...numberField },
  multiPlayerBotConfig: {},
  trueSkillLevels: { ...numberArrayField, value: '' },
};

export const defaultGameConfigForm: TGameConfigForm = {
  _isFormValid: true,
  _isFormTouched: false,
  _isSubmittedOnce: false,
  _validationErrors: [],
  gameId: { ...stringField },
  enabledCountryCodes: { value: ["US"], error: '', required: true },  // todo check value
  engineData: {
    engineType: {
      value: 'UNITY',
      error: '',
      required: true
    },
    url: { ...stringField },
    assetData: {
      iosUrl: { ...stringField },
      androidUrl: { ...stringField },
      version: { ...numberField },
      addressableName: { ...stringField },
    },
  },
  orientation: { value: EOrientations.PORTRAIT, error: '', required: true },
  gameControlParams: {
    tutorialData: {
      tutorialType: { value: ETutorialTypes.None, error: '', required: true },
      slideUrls: { value: [''], error: '', required: false },
    },
    maxRankForWinner: { ...numberField },
    isNonScoreGame: { ...booleanField },
    canWinAfterAbandon: { ...booleanField },
    startingScore: { ...numberField },
    showResultForAbandoned: { ...booleanField, value: true },
    showEqualAlignmentOnResultScreen: { ...booleanField },
    scoringType: { value: EScoringTypes.SCORE, error: '', required: true },
    autoStartGamePlay: { ...booleanField },
    updateScoreOnCallback: { ...booleanField, value: true },
    resetAtStart: { ...booleanField, value: true },
    shouldHidePlayerInfoInNativeCode: { ...booleanField, value: true },
    gameSessionType: { value: EGameSessionType.InHouse, error: '', required: true },
    acceptablePauseTime: { ...numberField },
    disconnectionBufferTime: { ...numberField },
    imageDataList: [{
      type: { ...stringField },
      url: { ...stringField },
      aspectRatio: { ...stringField },
    }],
  },
  matchMakingConfig: {
    matchMakingTime: { ...numberField },
  },
  appId: { ...stringField },
  version: { value: EVersions.DRAFT, error: '', required: true },
  supportedPlayerCounts: { ...numberArrayField },
  gameModeDataList: [
    {
      gameMode: { value: EGameModes.SINGLE_PLAYER, error: '', required: true },
      releaseState: { value: EReleaseStates.BETA, error: '', required: true },
      overridablePlatformGameModeData: {
        displayName: { ...stringField },
        imageDataList: [],
        gameSpecificParams: { ...stringField },
        duration: { ...numberField },
        playerCountPreferences: { ...numberArrayField },
        gameColor: { ...stringField },
        roundCount: { ...numberField },
        botsEnabled: { value: false, error: '', required: false },
        botConfig: defaultBotConfigField,
        difficultyMaxLevel: { ...numberField, value: 0 },
        difficultyMinLevel: { ...numberField, value: 0 },
        bannerRulesText: { ...jsonField },
      },
      enabledPlatforms: { value: [], error: '', required: true },
    }
  ],
  platformDataSet: [
    { ...defaultIOSPlatformData },
    { ...defaultAndroidPlatformData },
  ],
  skillConfig: {
    defaultSkillRating: { ...numberField },
    flatSkillThreshold: { ...numberField },
    numGamesSkillRating: { ...numberField },
    minMultiplier: { ...numberField },
    diffMulMap: {},
  },
  botConfig: { ...defaultBotConfigField },
};

const gameConfigFormSlice = createSlice({
  name: 'gameConfig',
  initialState: {
    selectedAppObj: {} as TAppSummary,
    isSelectedAppCrypto: false,
    selectedApp: CONSTANTS.MISC.SAMPLE_APP,
    selectedGame: CONSTANTS.MISC.SAMPLE_GAME,
    form: defaultGameConfigForm,
    creatingOrUpdating: XHR_STATE.ASLEEP,
    creatingOrUpdatingError: '',
    payload: null,
    showConfigNotFound: true,
    appChangedInDropdown: false,
    canBeDeployed: false,
    upgradeToLive: {
      loading: XHR_STATE.ASLEEP,
      error: '',
    },
    upgradeToPreviewLive: {
      loading: XHR_STATE.ASLEEP,
      error: '',
    },
    upgradeFromTestToLive: {
      loading: XHR_STATE.ASLEEP,
      error: '',
    },
    revertFromLastLive: {
      loading: XHR_STATE.ASLEEP,
      error: '',
    },
    deleteGame: {
      loading: XHR_STATE.ASLEEP,
      error: '',
    },
    apps: {
      // todo deprecate this and use getAppSummaries
      list: [] as TApp[],
      loading: XHR_STATE.IN_PROGRESS,
      error: '',
    },
    games: {
      gamesList: [],
      fetching: false,
      error: '',
    },
    gameData: {
      data: [] as TGameConfigPayload[],
      loading: XHR_STATE.IN_PROGRESS,
      error: '',
    },
    gamesFromAllApps: {
      data: [] as { appId: string, gameId: string }[],
      loading: XHR_STATE.IN_PROGRESS,
      error: '',
    },
    userModeration: {
      userModerationData: [] as TUserModerationResponse[],
      bannedApps: [] as string[],
      loading: XHR_STATE.ASLEEP,
      error: '',
    },
  },

  reducers: {
    setSelectedApp(state, action: PayloadAction<string>) {
      state.selectedApp = action.payload;
      if (state.apps) {
        const currentSelectedApp: TApp = state.apps.list.filter(app => app.appId.localeCompare(action.payload) === 0)[0];
        state.selectedAppObj = currentSelectedApp as any;
        if (currentSelectedApp) {
          state.isSelectedAppCrypto = currentSelectedApp.crypto;
        } 
      }
    },
    setSelectedAppCrypto(state, action: PayloadAction<boolean>) {
      state.isSelectedAppCrypto = action.payload;
    },
    setSelectedGame(state, action: PayloadAction<string>) {
      state.selectedGame = action.payload;
    },
    setAppChangedInDropdown(state, action: PayloadAction<boolean>) {
      state.appChangedInDropdown = action.payload;
    },
    setGameConfigCanBeDeployed(state, action: PayloadAction<boolean>) {
      state.canBeDeployed = action.payload;
    },
    setGameConfigForm(state, action: PayloadAction<TGameConfigForm>) {
      state.form = action.payload;
    },
    setCreatingOrUpdating(state, action: PayloadAction<XHR_STATE>) {
      state.creatingOrUpdating = action.payload;
    },

    // todo:
    // Looks like following 3 actions are user related.
    // If yes, relevant actions and state variables should be moved to userSlice.
    // creatingOrUpdatingError field is meant to be used with game config;
    // there can be side effects if used with users.
    fetchUserModerationStart: (state, action) => {
      state.userModeration.bannedApps = [];
      state.userModeration.userModerationData = [];
      state.userModeration.loading = XHR_STATE.IN_PROGRESS;
      state.userModeration.error = '';
    },

    fetchUserModerationSuccess: (state, action) => {
      if( action.payload !== null ){
        state.userModeration.userModerationData = action.payload;
      }
      
      if (state.userModeration.userModerationData.length > 0) {
        const listSortedOnCreatedAt = state.userModeration.userModerationData.sort((um1, um2) => um1.createdAt > um2.createdAt ? -1 : 1);
        let expiredUserModerations = listSortedOnCreatedAt.filter(um => isExpired(um.expiresAt));
        let liveUserModerations = listSortedOnCreatedAt.filter(um => !isExpired(um.expiresAt));
        state.userModeration.userModerationData = liveUserModerations.concat(expiredUserModerations);
      }
      state.userModeration.loading = XHR_STATE.COMPLETE;
      state.userModeration.error = '';
    },

    fetchAllUserModerationSuccess: (state, action) => {
      if( action.payload !== null ){
        state.userModeration.userModerationData = action.payload;
      }
      
      if (state.userModeration.userModerationData.length > 0) {
        const bannedApps = new Set<string>(state.userModeration.userModerationData.map(um => um.appId));
        state.userModeration.bannedApps = [];
        bannedApps.forEach(appId => state.userModeration.bannedApps.push(appId));
      }
      state.userModeration.loading = XHR_STATE.COMPLETE;
      state.userModeration.error = '';
    },

    fetchUserModerationError: (state, action) => {
      if(action.payload && action.payload.error ){
        console.error('fetchUserModerationError\n', action.payload.error, '\n', action.payload);
      }
      state.creatingOrUpdating = XHR_STATE.ASLEEP;
      if(action.payload && action.payload.detail ){
        state.creatingOrUpdatingError = action.payload.detail;
      }
      state.payload = null;
    },

    createOrEditStart(state, action) {
      state.creatingOrUpdating = XHR_STATE.IN_PROGRESS;
      state.creatingOrUpdatingError = '';
      state.payload = null;
    },
    createOrEditSuccess(state, action) {
      state.creatingOrUpdating = XHR_STATE.COMPLETE;
      state.creatingOrUpdatingError = '';
      state.payload = action.payload;
    },
    createOrEditError(state, action) {
      console.error('createOrEditError\n', action.payload);
      state.creatingOrUpdating = XHR_STATE.COMPLETE;
      state.creatingOrUpdatingError = '';
      if ((!action || !action.payload) && (!action.payload.detail && !action.payload.invalidParams)) {
        state.creatingOrUpdatingError = 'something went wrong';
      }
      if (action.payload && action.payload.detail) {
        state.creatingOrUpdatingError = action.payload.detail;
      }
      if (action.payload && action.payload.invalidParams) {
        state.creatingOrUpdatingError += action.payload.invalidParams
          .reduce((accumulator: string, currentValue: any) =>
            `⛔️ ${accumulator} ${currentValue.field}: ${currentValue.location}. ${currentValue.reason}`, '');
      }
      state.payload = null;
    },

    setShowConfigNotFound(state, action: PayloadAction<boolean>) {
      state.showConfigNotFound = action.payload;
    },

    upgradeToLiveStart(state, action) {
      state.upgradeToLive.loading = XHR_STATE.IN_PROGRESS;
      state.upgradeToLive.error = '';
    },
    upgradeToLiveSuccess(state, action) {
      state.upgradeToLive.loading = XHR_STATE.COMPLETE;
      state.upgradeToLive.error = '';
    },
    // todo add types for action argument
    upgradeToLiveError(state, action) {
      console.error('upgradeToLiveError\n', action.payload.error, '\n', action.payload);
      state.upgradeToLive.loading = XHR_STATE.COMPLETE;
      state.upgradeToLive.error = action.payload.error;
    },
    setUpgradeToLiveLoading(state, action: PayloadAction<XHR_STATE>) {
      state.upgradeToLive.loading = action.payload;
    },

    upgradeToPreviewLiveStart(state, action) {
      state.upgradeToPreviewLive.loading = XHR_STATE.IN_PROGRESS;
      state.upgradeToPreviewLive.error = '';
    },
    upgradeToPreviewLiveSuccess(state, action) {
      state.upgradeToPreviewLive.loading = XHR_STATE.COMPLETE;
      state.upgradeToPreviewLive.error = '';
    },
    upgradeToPreviewLiveError(state, action) {
      console.error('upgradeToPreviewLiveError\n', action.payload.error, '\n', action.payload);
      state.upgradeToPreviewLive.loading = XHR_STATE.COMPLETE;
      state.upgradeToPreviewLive.error = action.payload.error;
    },
    setUpgradeToPreviewLiveLoading(state, action: PayloadAction<XHR_STATE>) {
      state.upgradeToPreviewLive.loading = action.payload;
    },

    revertFromLastLiveStart(state, action) {
      state.revertFromLastLive.loading = XHR_STATE.IN_PROGRESS;
      state.revertFromLastLive.error = '';
    },
    revertFromLastLiveSuccess(state, action) {
      state.revertFromLastLive.loading = XHR_STATE.ASLEEP;
      state.revertFromLastLive.error = '';
    },
    revertFromLastLiveError(state, action) {
      console.error('revertFromLastLiveError\n', action.payload.error, '\n', action.payload);
      state.revertFromLastLive.loading = XHR_STATE.ASLEEP;
      state.revertFromLastLive.error = action.payload.error;
    },
    setRevertFromLastLiveLoading(state, action: PayloadAction<XHR_STATE>) {
      state.revertFromLastLive.loading = action.payload;
    },

    upgradeFromTestToLiveStart(state, action) {
      state.upgradeFromTestToLive.loading = XHR_STATE.IN_PROGRESS;
      state.upgradeFromTestToLive.error = '';
    },
    upgradeFromTestToLiveSuccess(state, action) {
      state.upgradeFromTestToLive.loading = XHR_STATE.COMPLETE;
      state.upgradeFromTestToLive.error = '';
    },
    upgradeFromTestToLiveError(state, action) {
      console.error('upgradeFromTestToLiveError\n', action.payload.error, '\n', action.payload);
      state.upgradeFromTestToLive.loading = XHR_STATE.COMPLETE;
      state.upgradeFromTestToLive.error = action.payload.error;
    },
    setUpgradeFromTestToLiveLoading(state, action: PayloadAction<XHR_STATE>) {
      state.upgradeFromTestToLive.loading = action.payload;
    },

    deleteGameStart(state, action) {
      state.deleteGame.loading = XHR_STATE.IN_PROGRESS;
      state.deleteGame.error = '';
    },
    deleteGameSuccess(state, action) {
      state.deleteGame.loading = XHR_STATE.ASLEEP;
      state.deleteGame.error = '';
    },
    deleteGameError(state, action) {
      console.error('deleteGameError\n', action.payload.error, '\n', action.payload);
      state.deleteGame.loading = XHR_STATE.ASLEEP;
      state.deleteGame.error = action.payload.error;
    },

    fetchAppsListStart(state, action) {
      state.apps.loading = XHR_STATE.IN_PROGRESS;
      state.apps.error = '';
      state.apps.list = [];
    },
    fetchAppsListSuccess(state, action: PayloadAction<TApp[]>) {
      state.apps.loading = XHR_STATE.ASLEEP;
      state.apps.error = '';
      state.apps.list = action.payload;
    },
    fetchAppsListError(state, action) {
      console.error('fetchAppsListError\n', action.payload.error, '\n', action.payload);
      state.apps.loading = XHR_STATE.ASLEEP;
      state.apps.error = action.payload;
      state.apps.list = [];
    },

    getGameDataStart(state, action) {
      state.gameData.loading = XHR_STATE.IN_PROGRESS;
      state.gameData.error = '';
      state.gameData.data = [];
    },
    getGameDataSuccess(state, action: PayloadAction<TGameConfigPayload[]>) {
      state.gameData.loading = XHR_STATE.ASLEEP;
      state.gameData.error = '';
      state.gameData.data = action.payload;
    },
    getGameDataError(state, action) {
      console.error('getGameDataError\n', action.payload.error, '\n', action.payload);
      state.gameData.loading = XHR_STATE.ASLEEP;
      state.gameData.error = action.payload;
      state.gameData.data = [];
    },

    setGamesFromAllApps(state, action: PayloadAction<{ appId: string; gameId: string; }[]>) {
      state.gamesFromAllApps.data = action.payload;
    },
  },
});

export const {
  setSelectedApp, setSelectedAppCrypto, setSelectedGame, setGameConfigForm, setCreatingOrUpdating,
  setAppChangedInDropdown, setGameConfigCanBeDeployed,
  createOrEditStart, createOrEditSuccess, createOrEditError, setShowConfigNotFound,
  upgradeToLiveStart, upgradeToLiveSuccess, upgradeToLiveError, setUpgradeToLiveLoading,
  upgradeToPreviewLiveStart, upgradeToPreviewLiveSuccess, upgradeToPreviewLiveError, setUpgradeToPreviewLiveLoading,
  upgradeFromTestToLiveStart, upgradeFromTestToLiveSuccess, upgradeFromTestToLiveError, setUpgradeFromTestToLiveLoading,
  revertFromLastLiveStart, revertFromLastLiveSuccess, revertFromLastLiveError, setRevertFromLastLiveLoading,
  deleteGameStart, deleteGameSuccess, deleteGameError,
  fetchAppsListStart, fetchAppsListSuccess, fetchAppsListError,
  getGameDataStart, getGameDataSuccess, getGameDataError,
  fetchUserModerationStart, fetchUserModerationSuccess, fetchAllUserModerationSuccess, fetchUserModerationError,
  setGamesFromAllApps
} = gameConfigFormSlice.actions;

export const createOrEditGameConfigDispatcher = (
  payload: {
    appId: string,
    config: TGameConfigPayload[],
    success?: () => void,
    error?: () => void
  }) => async (dispatch: any) => {
  try {
    dispatch(createOrEditStart(null));
    const data = await createOrEditGameConfigXhr(payload.appId, payload.config);
    dispatch(createOrEditSuccess(data));
    dispatch(getGameDataDispatcher(payload.appId));
    if (payload.success) payload.success();
  } catch (err) {
    console.error('createOrEditGameConfigDispatcher', (err as any).response.data, '\n', err);
    dispatch(createOrEditError((err as any).response.data));
    if (payload.error) payload.error();
  }
};

export const fetchUserModerationDispatcher = (appId: string, userId: string) =>
  async (dispatch: any) => {
    if (!userId) {
      console.warn('fetchWalletLedgerDispatcher: userId is required');
      return;
    }
    try {
      dispatch(fetchUserModerationStart({ appId, userId }));
      const moderations = await fetchUserModerationXhr(appId, userId);
      dispatch(fetchUserModerationSuccess(moderations));
    } catch (err) {
      console.error('error.response\n', (err as any).response);
      dispatch(fetchUserModerationError((err as any).response ? (err as any).response.data : null));
    }
};

export const fetchAllUserModerationDispatcher = (userId: string) =>
  async (dispatch: any) => {
    if (!userId) {
      console.warn('fetchWalletLedgerDispatcher: userId is required');
      return;
    }
    try {
      dispatch(fetchUserModerationStart({ userId }));
      const moderations = await fetchAllUserModerationXhr(userId);
      dispatch(fetchAllUserModerationSuccess(moderations));
    } catch (err) {
      console.error('error.response\n', (err as any).response);
      dispatch(fetchUserModerationError((err as any).response ? (err as any).response.data : null));
    }
};

export const upgradeToLiveDispatcher = (
  appId: string,
  gameId: string,
  onSuccess?: () => void
) => async (dispatch: any) => {
  try {
    dispatch(upgradeToLiveStart(null));
    const data = await upgradeFromDraftToLiveXhr(appId, gameId);
    dispatch(upgradeToLiveSuccess(data));
    if (onSuccess) onSuccess();
  } catch (err) {
    console.error('createOrEditGameConfigDispatcher', (err as any).response, '\n', err);
    dispatch(upgradeToLiveError('handle error'));
  }
};

export const upgradeFromTestToLiveDispatcher = (
  appId: string,
  gameId: string,
  onSuccess?: () => void
) => async (dispatch: any) => {
  try {
    dispatch(upgradeFromTestToLiveStart(null));
    const data = await upgradeFromTestToLiveXhr(appId, gameId);
    dispatch(upgradeFromTestToLiveSuccess(data));
    if (onSuccess) onSuccess();
  } catch (err) {
    console.error('upgradeFromTestToLiveDispatcher', (err as any).response, '\n', err);
    dispatch(upgradeFromTestToLiveError('handle error'));
  }
};

export const upgradeToPreviewLiveDispatcher = (
  appId: string,
  gameId: string,
  onSuccess?: () => void
) => async (dispatch: any) => {
  try {
    dispatch(upgradeToPreviewLiveStart(null));
    const data = await upgradeToPreviewLiveXhr(appId, gameId);
    dispatch(upgradeToPreviewLiveSuccess(data));
    if (onSuccess) onSuccess();
  } catch (err) {
    console.error('createOrEditGameConfigDispatcher', (err as any).response, '\n', err);
    dispatch(upgradeToPreviewLiveError('handle error'));
  }
};

export const revertFromLastLiveDispatcher = (appId: string, gameId: string, onSuccess?: () => void) => async (dispatch: any) => {
  try {
    dispatch(revertFromLastLiveStart(null));
    const data = await revertFromLastLiveXhr(appId, gameId);
    dispatch(revertFromLastLiveSuccess(data));
    if (onSuccess) onSuccess();
  } catch (err) {
    console.error('createOrEditGameConfigDispatcher', (err as any).response, '\n', err);
    dispatch(revertFromLastLiveError((err as any).response && (err as any).response.data ? (err as any).response.data : 'handle revertFromLastLiveError'));
  }
};

export const deleteGameDispatcher = (appId: string, gameId: string, onSuccess?: () => void) => async (dispatch: any) => {
  try {
    dispatch(deleteGameStart(null));
    const data = await deleteGameXhr(appId, gameId);
    dispatch(deleteGameSuccess(data));
    if (onSuccess) onSuccess();
  } catch (err) {
    console.error('deleteGameDispatcher', (err as any).response, '\n', err);
    dispatch(deleteGameError((err as any).response && (err as any).response.data ? (err as any).response.data : 'handle deleteGameError'));
  }
};

export const fetchAppsListDispatcher = (companyId: number, options?: TDispatcherOptions) => async (dispatch: any) => {
  try {
    dispatch(fetchAppsListStart(null));
    const data = await getAppsListXhr(companyId);
    dispatch(fetchAppsListSuccess(data));
    if (options && options.success) options.success(data);
  } catch (err) {
    console.error('fetchAppsListDispatcher\n', (err as any).response, '\n', err);
    dispatch(fetchAppsListError('handle error'));
    if (options && options.error) options.error();
  }
};

export const getGameDataDispatcher = (appId: string, onSuccess?: (data: TGameConfigPayload[]) => void) => async (dispatch: any) => {
  if (appId === CONSTANTS.MISC.SAMPLE_APP) {
    console.warn('getGameDataDispatcher: ignoring sample app');
    return;
  }
  try {
    dispatch(getGameDataStart(null));
    const data = await getGameDataXhr(appId);
    if( data.length > 0){
      dispatch(getGameDataSuccess(data));
    if (onSuccess) onSuccess(data);
    }
  } catch (err) {
    console.error('getGameDataDispatcher\n', (err as any).response, '\n', err);
    dispatch(getGameDataError('handle error'));
  }
};

export const getAllAppGameDataDispatcher = (appIds: string[], onSuccess?: (data: TGameConfigPayload[]) => void) => async (dispatch: any) => {
  try {
    const games3: { appId: string, gameId: string }[] = [];
    for (let i = 0; i < appIds.length; i++) {
      const data = await getGameDataXhr(appIds[i]);
      data.forEach(game => {
        const found = games3.find(gameInfo => gameInfo.appId === appIds[i] && gameInfo.gameId === game.gameId);
        if (!found) {
          games3.push({
            appId: appIds[i],
            gameId: game.gameId,
          });
        }
      });
      if (onSuccess) onSuccess(data);
    }
    dispatch(setGamesFromAllApps(games3));
  } catch (err) {
    console.error('getAllAppGameDataDispatcher\n', (err as any).response, '\n', err);
  }
};

export default gameConfigFormSlice.reducer;

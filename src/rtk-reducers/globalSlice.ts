import {
  createSlice,
  PayloadAction
} from '@reduxjs/toolkit';
import { TDefaultBi } from '../bi/types/types';
import { CONSTANTS } from '../common/constants';
import { TCmsUser } from '../pages/team-access-control-management/teamAccessControlTypes';
import { TUserGoogleProfile } from '../types/types';

export enum UI_MODULES {
  UNSET = 'UNSET',
  APP_MANAGEMENT = 'APP_MANAGEMENT',
  GAME_CONFIG = 'GAME_CONFIG',
  USER_ACCOUNTS = 'USER_ACCOUNTS',
  EVENTS = 'EVENTS',
};

type TChartInfo = {
  forceChartRefresh: boolean;
  chartPrefix: string;
};

// todo handle TUserGoogleProfile
type TGlobalSlice = {
  userGoogleProfile: null | TUserGoogleProfile | TCmsUser;
  defaultBi: null | TDefaultBi;
  companyIdCopy: number;
  // userGoogleProfile: null | TCmsUser;
  selectedAppChangeListener: UI_MODULES;
  chartInfo: TChartInfo;
};

const globalSlice = createSlice({
  name: 'globalSlice',
  initialState: {
    userGoogleProfile: null,
    companyIdCopy: -1,
    selectedAppChangeListener: UI_MODULES.UNSET,
    chartInfo: {
      forceChartRefresh: false,
      chartPrefix: '',
    },
  } as TGlobalSlice,
  reducers: {
    setUserGoogleProfile: (state, action: PayloadAction<null | TUserGoogleProfile | TCmsUser>) => {
      state.userGoogleProfile = action.payload;
      if (action.payload) {
        localStorage.setItem(
          CONSTANTS.LOCAL_STORAGE.GOOGLE_PROFILE,
          JSON.stringify(action.payload)
        );
      } else {
        localStorage.removeItem(CONSTANTS.LOCAL_STORAGE.GOOGLE_PROFILE);
      }
    },
    setDefaultBi: (state, action: PayloadAction<null | TDefaultBi>) => {
      state.defaultBi = action.payload;
      if (action.payload) {
        localStorage.setItem(
          CONSTANTS.LOCAL_STORAGE.DEFAULT_BI,
          JSON.stringify(action.payload)
        );
      } else {
        localStorage.removeItem(CONSTANTS.LOCAL_STORAGE.DEFAULT_BI);
      }
    },
    setCompanyIdCopy: (state, action: PayloadAction<number>) => {
      state.companyIdCopy = action.payload;
    },
    setSelectedAppChangeListener: (state, action: PayloadAction<UI_MODULES>) => {
      state.selectedAppChangeListener = action.payload;
    },
    setChartInfo: (state, action: PayloadAction<TChartInfo>) => {
      state.chartInfo = action.payload;
    },
  },
});

export const {
  setUserGoogleProfile,
  setDefaultBi,
  setCompanyIdCopy,
  setSelectedAppChangeListener,
  setChartInfo,
} = globalSlice.actions;

export default globalSlice.reducer;

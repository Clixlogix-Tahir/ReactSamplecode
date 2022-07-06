import { createSlice } from "@reduxjs/toolkit";
import { XHR_STATE } from "../../common/constants";
import { setUserGoogleProfile } from "../../rtk-reducers/globalSlice";
import { TDispatcherOptions } from "../../types/types";
import { customThemeControlApi } from "./customThemeControlAPI";
type customThemeSlice = {
  cmsCustomThemeAdd: {
    response: null | string;
    loading: XHR_STATE;
    error: string;
  };
  cmsCustomThemeGet: {
    response: null | string;
    loading: XHR_STATE;
    error: string;
  };
  cmsCustomThemeCurrent: {
    response: null | any;
    loading: XHR_STATE;
    error: string;
  },
  cmsCustomFileUpload: {
    response: null | any;
    loading: XHR_STATE;
    error: string;
  }
};

const DEFAULT_ERROR_TEXT = "Something went wrong. Please try again. 😵";

const initialState: customThemeSlice = {
  cmsCustomThemeAdd: {
    response: null,
    loading: XHR_STATE.ASLEEP,
    error: '',
  },
  cmsCustomThemeGet: {
    response: null,
    loading: XHR_STATE.ASLEEP,
    error: '',
  },
  cmsCustomThemeCurrent: {
    response: null,
    loading: XHR_STATE.ASLEEP,
    error: '',
  },
  cmsCustomFileUpload: {
    response: null,
    loading: XHR_STATE.ASLEEP,
    error: '',
  }
};

const customThemeSlice = createSlice({
  name: "customThemeSlice",
  initialState: initialState,
  reducers: {
    cmsCustomThemeAddStart: (state, action) => {
      state.cmsCustomThemeAdd.loading = XHR_STATE.IN_PROGRESS;
      state.cmsCustomThemeAdd.error = '';
    },

    cmsCustomThemeAddSuccess: (state, action) => {
      state.cmsCustomThemeAdd.loading = XHR_STATE.COMPLETE;
      state.cmsCustomThemeAdd.response = action.payload;
    },
    cmsCustomThemeAddError: (state, action) => {
      state.cmsCustomThemeAdd.loading = XHR_STATE.ASLEEP;
      state.cmsCustomThemeAdd.error = (action.payload && action.payload.detail) ?
      `${action.payload.detail} 😵` :
      DEFAULT_ERROR_TEXT;
    },
    cmsCustomThemeGetStart: (state, action) => {
      state.cmsCustomThemeGet.loading = XHR_STATE.IN_PROGRESS;
      state.cmsCustomThemeGet.error = '';
    },

    cmsCustomThemeGetSuccess: (state, action) => {
      state.cmsCustomThemeGet.loading = XHR_STATE.COMPLETE;
      state.cmsCustomThemeGet.response = action.payload;
    },
    cmsCustomThemeGetError: (state, action) => {
      state.cmsCustomThemeGet.loading = XHR_STATE.ASLEEP;
      state.cmsCustomThemeGet.error = (action.payload && action.payload.detail) ?
      `${action.payload.detail} 😵` :
      DEFAULT_ERROR_TEXT;
    },
    cmsCustomThemeCurrentStart: (state, action) => {
      state.cmsCustomThemeCurrent.loading = XHR_STATE.IN_PROGRESS;
      state.cmsCustomThemeCurrent.error = '';
    },

    cmsCustomThemeCurrentSuccess: (state, action) => {
      state.cmsCustomThemeCurrent.loading = XHR_STATE.COMPLETE;
      state.cmsCustomThemeAdd.response = action.payload;
    },
    cmsCustomThemeCurrentError: (state, action) => {
      state.cmsCustomThemeCurrent.loading = XHR_STATE.ASLEEP;
      state.cmsCustomThemeCurrent.error = (action.payload && action.payload.detail) ?
      `${action.payload.detail} 😵` :
      DEFAULT_ERROR_TEXT;
    },
    cmsCustomFileUploadStart: (state, action) => {
      state.cmsCustomFileUpload.loading = XHR_STATE.IN_PROGRESS;
      state.cmsCustomFileUpload.error = '';
    },

    cmsCustomFileUploadSuccess: (state, action) => {
      state.cmsCustomFileUpload.loading = XHR_STATE.COMPLETE;
      state.cmsCustomFileUpload.response = action.payload;
    },
    cmsCustomTFileUploadError: (state, action) => {
      state.cmsCustomFileUpload.loading = XHR_STATE.ASLEEP;
      state.cmsCustomFileUpload.error = (action.payload && action.payload.detail) ?
      `${action.payload.detail} 😵` :
      DEFAULT_ERROR_TEXT;
    },
    cmsClearAddReq: (state, action) => {
      state.cmsCustomThemeAdd.loading = XHR_STATE.ASLEEP;
      state.cmsCustomThemeAdd.response = null;
      state.cmsCustomThemeAdd.error = '';
    },
  },
});

export const customThemeAccessDispatchers = {
  cmsClearReqAdd: (
    options?: TDispatcherOptions
  )=> async (dispatch: any) => {
    let data = ''
      dispatch(cmsClearAddReq(data));
      
   
    },
  cmsCustomThemeAdd: (
    cmsCustomThemeAddDTo: string,
    appId: string,
    options?: TDispatcherOptions
  ) =>
    async (dispatch: any) => {
      try {
        dispatch(cmsCustomThemeAddStart(cmsCustomThemeAddDTo));
        const response = await customThemeControlApi.customThemeAdd(cmsCustomThemeAddDTo,appId);
        dispatch(cmsCustomThemeAddSuccess(response));
        if (options && options.success) options.success(response);
      } catch (error) {
        console.error('error.response\n', (error as any).response);
        dispatch(cmsCustomThemeAddError(((error as any).response && (error as any).response.data) || null));
        if (options && options.error) options.error();
      }
    },
    cmsCustomThemeGet: (
      appId: any,
      options?: TDispatcherOptions
    ) =>
      async (dispatch: any) => {
        try {
          dispatch(cmsCustomThemeGetStart(appId));
          const response = await customThemeControlApi.customThemeGet(appId);
          dispatch(cmsCustomThemeGetSuccess(response));
          if (options && options.success) options.success(response);
        } catch (error) {
          console.error('error.response\n', (error as any).response);
          dispatch(cmsCustomThemeGetError(((error as any).response && (error as any).response.data) || null));
          if (options && options.error) options.error();
        }
      },
      cmsCustomThemeCurrent: (
        cmsCustomThemeAddDTo: any,
        appId: any,
        options?: TDispatcherOptions
      ) =>
        async (dispatch: any) => {
          try {
            dispatch(cmsCustomThemeCurrentStart(cmsCustomThemeAddDTo));
            const response = await customThemeControlApi.customThemeAdd(cmsCustomThemeAddDTo,appId);
            dispatch(cmsCustomThemeCurrentSuccess(response));
            if (options && options.success) options.success(response);
          } catch (error) {
            console.error('error.response\n', (error as any).response);
            dispatch(cmsCustomThemeCurrentError(((error as any).response && (error as any).response.data) || null));
            if (options && options.error) options.error();
          }
    },
    cmsCustomThemeFileUpload: (
      cmsCustomThemeAddDTo: any,
      appId: any,
      options?: TDispatcherOptions
    ) =>
      async (dispatch: any) => {
        try {
          dispatch(cmsCustomThemeAddStart(cmsCustomThemeAddDTo));
          const response = await customThemeControlApi.customThemeAdd(cmsCustomThemeAddDTo,appId);
          dispatch(cmsCustomThemeAddSuccess(response));
          if (options && options.success) options.success(response);
        } catch (error) {
          console.error('error.response\n', (error as any).response);
          dispatch(cmsCustomThemeAddError(((error as any).response && (error as any).response.data) || null));
          if (options && options.error) options.error();
        }
      },
};

const {
  cmsCustomThemeAddStart, cmsCustomThemeAddSuccess, cmsCustomThemeAddError,
  cmsCustomThemeGetStart, cmsCustomThemeGetSuccess, cmsCustomThemeGetError,
  cmsCustomThemeCurrentStart, cmsCustomThemeCurrentSuccess, cmsCustomThemeCurrentError,
  cmsClearAddReq
} = customThemeSlice.actions;

export default customThemeSlice.reducer;

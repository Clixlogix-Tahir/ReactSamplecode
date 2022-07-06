import { createSlice } from "@reduxjs/toolkit";
import { XHR_STATE } from "../../common/constants";
import { setUserGoogleProfile } from "../../rtk-reducers/globalSlice";
import { TDispatcherOptions } from "../../types/types";
import { requestControlApi } from './requestControlAPI';
import { TReqAddDTo, TReqAddDataType, TReqListBasic, TReqListResp,TAddOrg, TAddOrgResp, TReqStatus, TReqList } from './requestsControlTypes';
type requestSlice = {
  cmsRequestAdd: {
    response: null | TReqAddDataType;
    loading: XHR_STATE;
    error: string;
  };
  cmsRequestList: {
    response: null | TReqListResp;
    loading: XHR_STATE;
    error: string;
  };
  cmsAddOrg: {
    response: null | TAddOrgResp;
    loading: XHR_STATE;
    error: string
  };
  cmsGetOrg: {
    response: null | TAddOrgResp;
    loading: XHR_STATE;
    error: string
  };
  cmsReqChange: {
    response: null | any;
    loading: XHR_STATE;
    error: string;
  };
  cmsNudgeFlag: {
    flag: boolean;
  };

};

const DEFAULT_ERROR_TEXT = 'Something went wrong. Please try again. 😵';

const initialState: requestSlice = {
  cmsRequestAdd: {
    response: null,
    loading: XHR_STATE.ASLEEP,
    error: '',
  },
  cmsRequestList: {
    response: null,
    loading: XHR_STATE.ASLEEP,
    error: '',
  },
  cmsAddOrg: {
    response: null,
    loading: XHR_STATE.ASLEEP,
    error: '',
  },
  cmsGetOrg: {
    response: null,
    loading: XHR_STATE.ASLEEP,
    error: '',
  },
  cmsReqChange: {
    response: null,
    loading: XHR_STATE.ASLEEP,
    error: '',
  },
  cmsNudgeFlag: {
    flag: false,
  }
  
};

const requestSlice = createSlice({
  name: 'requestSlice',
  initialState: initialState,
  reducers: {
    cmsAddRequestStart: (state, action) => {
      state.cmsRequestAdd.loading = XHR_STATE.IN_PROGRESS;
      state.cmsRequestAdd.error = '';
    },
    cmsNudgeFlagFalse: (state, action)=>{
      state.cmsNudgeFlag.flag = false;
    },
    cmsNudgeFlagTrue: (state, action)=>{
      state.cmsNudgeFlag.flag = true;
    },
    cmsAddRequestSuccess: (state, action) => {
      state.cmsRequestAdd.loading = XHR_STATE.COMPLETE;
      state.cmsRequestAdd.response = action.payload;
    },
    cmsAddRequestError: (state, action) => {
      state.cmsRequestAdd.loading = XHR_STATE.ASLEEP;
      state.cmsRequestAdd.error = (action.payload && action.payload.detail) ?
      `${action.payload.detail} 😵` :
      DEFAULT_ERROR_TEXT;
    },
    cmsClearAddReq: (state, action) => {
      state.cmsRequestAdd.loading = XHR_STATE.ASLEEP;
      state.cmsRequestAdd.response = null;
      state.cmsRequestAdd.error = '';
    },
    cmsRequestListStart: (state, action) => {
      state.cmsRequestList.loading = XHR_STATE.IN_PROGRESS;
      state.cmsRequestList.error = '';
    },

    cmsRequestListSuccess: (state, action) => {
      state.cmsRequestList.loading = XHR_STATE.COMPLETE;
      state.cmsRequestList.response = action.payload;
    },
    cmsRequestListError: (state, action) => {
      state.cmsRequestList.loading = XHR_STATE.ASLEEP;
      state.cmsRequestList.error = (action.payload && action.payload.detail) ?
      `${action.payload.detail} 😵` :
      DEFAULT_ERROR_TEXT;
    },

    setCmsReqList: (state, action) => {
      if (state.cmsRequestList.response) {
        state.cmsRequestList.response.appRequests = action.payload;
      }
    },

    cmsAddOrgStart: (state, action) => {
      state.cmsAddOrg.loading = XHR_STATE.IN_PROGRESS;
      state.cmsAddOrg.error = '';
    },
    cmsAddOrgSuccess: (state, action) => {
      state.cmsAddOrg.loading = XHR_STATE.IN_PROGRESS;
      state.cmsAddOrg.response = action.payload;
    },
    cmsAddOrgError: (state, action) => {
      state.cmsAddOrg.loading = XHR_STATE.IN_PROGRESS;
      state.cmsAddOrg.error = (action.payload && action.payload.detail) ?
      `${action.payload.detail} 😵` :
      DEFAULT_ERROR_TEXT;
    },

    cmsGetOrgStart: (state, action) => {
      state.cmsGetOrg.loading = XHR_STATE.IN_PROGRESS;
      state.cmsGetOrg.error = '';
    },
    cmsGetOrgSuccess: (state, action) => {
      state.cmsGetOrg.loading = XHR_STATE.IN_PROGRESS;
      state.cmsGetOrg.response = action.payload;
    },
    cmsGetOrgError: (state, action) => {
      state.cmsGetOrg.loading = XHR_STATE.IN_PROGRESS;
      state.cmsGetOrg.error = (action.payload && action.payload.detail) ?
      `${action.payload.detail} 😵` :
      DEFAULT_ERROR_TEXT;
    },
    cmsReqChangeStart: (state, action) => {
      state.cmsReqChange.loading = XHR_STATE.IN_PROGRESS;
      state.cmsReqChange.error = '';
    },
    cmsReqChangeSuccess: (state, action) => {
      state.cmsReqChange.loading = XHR_STATE.IN_PROGRESS;
      state.cmsReqChange.response = action.payload;
    },
    cmsReqChangeError: (state, action) => {
      state.cmsReqChange.loading = XHR_STATE.IN_PROGRESS;
      state.cmsReqChange.error = (action.payload && action.payload.detail) ?
      `${action.payload.detail} 😵` :
      DEFAULT_ERROR_TEXT;
    },

    

  }
});


export const requestAccessDispatchers = {
 
  
  cmsRequestAdd: (
    cmsReqDTo: TReqAddDTo,
    companyId: number,
    options?: TDispatcherOptions
  ) =>
    async (dispatch: any) => {
      try {
        dispatch(cmsAddRequestStart(cmsReqDTo));
        const response = await requestControlApi.requestAdd(cmsReqDTo, companyId);
        dispatch(cmsAddRequestSuccess(response));
        if (options && options.success) options.success(response);
      } catch (error) {
        console.error('error.response\n', (error as any).response);
        dispatch(cmsAddRequestError(((error as any).response && (error as any).response.data) || null));
        if (options && options.error) options.error();
      }
    },
  cmsClearReqAdd: (
    cmsReqDTo: TReqAddDTo,
    options?: TDispatcherOptions
  )=> async (dispatch: any) => {
   
      dispatch(cmsClearAddReq(cmsReqDTo));
      
   
    },
  cmsNudgeFlagFalse: () => async (dispatch: any) => {
    dispatch(cmsNudgeFlagFalse(false));
  },
  cmsNudgeFlagTrue: () => async (dispatch: any) => {
    dispatch(cmsNudgeFlagTrue(false));
  },

  cmsGetReqList: (
    cmsReqListDTo: TReqListBasic,
    companyId:number,
    options?: TDispatcherOptions
  ) => async (dispatch: any) => {
    try {
      dispatch(cmsRequestListStart(cmsReqListDTo));
      const response = await requestControlApi.getRequestList(cmsReqListDTo,companyId);
      dispatch(cmsRequestListSuccess(response));
      if (options && options.success) options.success(response);
    } catch (error) {
      console.error('error.response\n', (error as any).response);
      dispatch(cmsRequestListError(((error as any).response && (error as any).response.data) || null));
      if (options && options.error) options.error();
    }
    },
  cmsChangeReqStatus: (
    cmsChangeReqDTo: TReqStatus,
    companyId: number,
    appRequestId: number,
    options?:TDispatcherOptions
  ) => async (dispatch: any) => {
    try {
      dispatch(cmsReqChangeStart(cmsChangeReqDTo));
      const response = await requestControlApi.reqChange(cmsChangeReqDTo,companyId,appRequestId);
      dispatch(cmsReqChangeSuccess(response));
      if (options && options.success) options.success(response);
    } catch (error) {
      console.error('error.response\n', (error as any).response);
      dispatch(cmsReqChangeError(((error as any).response && (error as any).response.data) || null));
      if (options && options.error) options.error();
    }
  },
  setReqList: (
    list: TReqList[],
  ) => async (dispatch: any) => {
    dispatch(setCmsReqList(list));
  },
  cmsAddOrg: (
    cmsAddOrgDTo: TAddOrg,
    companyId:number,
    options?: TDispatcherOptions
  ) => async (dispatch: any) => {
    try {
      dispatch(cmsAddOrgStart(cmsAddOrgDTo));
      const response = await requestControlApi.addOrg(cmsAddOrgDTo,companyId);
      dispatch(cmsAddOrgSuccess(response));
      if (options && options.success) options.success(response);
    } catch (error) {
      console.error('error.response\n', (error as any).response);
      dispatch(cmsAddOrgError(((error as any).response && (error as any).response.data) || null));
      if (options && options.error) options.error();
    }
    },
    cmsClearAddOrg: (
      cmsAddOrgDTo: TAddOrg,
      options?: TDispatcherOptions
    ) => async (dispatch: any) => {
    
        dispatch(cmsAddOrgStart(cmsAddOrgDTo));
        
      },
  
    cmsGetOrg: (
      companyId:number,
      options?: TDispatcherOptions
    ) => async (dispatch: any) => {
      try {
        dispatch(cmsGetOrgStart(companyId));
        const response = await requestControlApi.getOrg(companyId);
        dispatch(cmsGetOrgSuccess(response));
        if (options && options.success) options.success(response);
      } catch (error) {
        console.error('error.response\n', (error as any).response);
        dispatch(cmsGetOrgError(((error as any).response && (error as any).response.data) || null));
        if (options && options.error) options.error();
      }
    },

};

const {
  cmsAddRequestStart, cmsAddRequestSuccess, cmsAddRequestError,cmsClearAddReq,
  cmsRequestListStart, cmsRequestListSuccess, cmsRequestListError,
  cmsReqChangeStart, cmsReqChangeSuccess,cmsReqChangeError,
  cmsAddOrgStart, cmsAddOrgSuccess, cmsAddOrgError,
  cmsGetOrgStart, cmsGetOrgSuccess, cmsGetOrgError,
  setCmsReqList,cmsNudgeFlagFalse, cmsNudgeFlagTrue
} = requestSlice.actions;



export default requestSlice.reducer;

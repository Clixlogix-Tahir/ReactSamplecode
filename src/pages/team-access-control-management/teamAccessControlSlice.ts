import { createSlice } from "@reduxjs/toolkit";
import Cookies from "universal-cookie";
import { ADMIN_USER_AUTH_TOKEN, XHR_STATE } from "../../common/constants";
import { setCompanyIdCopy, setUserGoogleProfile } from "../../rtk-reducers/globalSlice";
import { TDispatcherOptions } from "../../types/types";
import {
  teamAccessControlApi
} from "./teamAccessControlApi";
import { TCmsRole, TCmsSendEmailLinkDTo, TCmsUser, TCmsUserSignUpRequestDto, TCmsVerifyEmailDTo, TEditedCmsUser, TEmailInvite, TInvitedCmsUserResponse, TInvitedCmsUserSignUpRequestDto, TLoginDto, TStatusResponse } from "./teamAccessControlTypes";

const cookies = new Cookies();

type TUserSlice = {
  cmsSignUpUser: {
    user: null | TCmsUser;
    loading: XHR_STATE;
    error: string;
  };
  cmsEmailVerifyLink: {
    response: null | string;
    loading: XHR_STATE;
    error: string;
  }
  cmsEmailVerify: {
    response: null | string;
    loading: XHR_STATE;
    error: string;
  }
  cmsSignInUser: {
    user: null | TCmsUser;
    loading: XHR_STATE;
    error: string;
  };

  cmsUsers: {
    users: TCmsUser[];
    loading: XHR_STATE;
    error: string;
  };

  cmsRoles: {
    roles: TCmsRole[];
    loading: XHR_STATE;
    error: string;
  };

  invitedCmsUser: {
    user: TInvitedCmsUserResponse | null;
    loading: XHR_STATE;
    error: string;
  };

  cmsEmailInvite: {
    data: string;
    loading: XHR_STATE;
    error: string;
  };

  forgotPassword: {
    response: string;
    loading: XHR_STATE;
    error: string;
  };

  resetPassword: {
    response: string;
    loading: XHR_STATE;
    error: string;
  };

  updateCmsUser: {
    loading: XHR_STATE;
    error: string;
  };

  logoutCmsUser: {
    loading: XHR_STATE;
    error: string;
  };

};

const DEFAULT_ERROR_TEXT = 'Something went wrong. Please try again. 😵';

const initialState: TUserSlice = {

  cmsSignUpUser: {
    user: null,
    loading: XHR_STATE.ASLEEP,
    error: '',
  },
  cmsEmailVerifyLink: {
    response: null,
    loading: XHR_STATE.ASLEEP,
    error: '',
  },
  cmsEmailVerify: {
    response: null,
    loading: XHR_STATE.ASLEEP,
    error: '',
  },
  cmsSignInUser: {
    user: null,
    loading: XHR_STATE.ASLEEP,
    error: '',
  },

  cmsUsers: {
    users: [],
    loading: XHR_STATE.ASLEEP,
    error: '',
  },

  cmsRoles: {
    roles: [],
    loading: XHR_STATE.ASLEEP,
    error: '',
  },

  invitedCmsUser: {
    user: null,
    loading: XHR_STATE.ASLEEP,
    error: '',
  },

  cmsEmailInvite: {
    data: '',
    loading: XHR_STATE.ASLEEP,
    error: '',
  },

  forgotPassword: {
    response: '',
    loading: XHR_STATE.ASLEEP,
    error: '',
  },

  resetPassword: {
    response: '',
    loading: XHR_STATE.ASLEEP,
    error: '',
  },

  updateCmsUser: {
    loading: XHR_STATE.ASLEEP,
    error: '',
  },

  logoutCmsUser: {
    loading: XHR_STATE.ASLEEP,
    error: '',
  },
};

const userSlice = createSlice({
  name: 'userSlice',
  initialState: initialState,
  reducers: {

    cmsSignUpStart: (state, action) => {
      state.cmsSignUpUser.loading = XHR_STATE.IN_PROGRESS;
      state.cmsSignUpUser.error = '';
    },
    cmsSignUpSuccess: (state, action) => {
      state.cmsSignUpUser.loading = XHR_STATE.COMPLETE;
      state.cmsSignUpUser.user = action.payload;
    },
    cmsSignUpError: (state, action) => {
      state.cmsSignUpUser.loading = XHR_STATE.ASLEEP;
      state.cmsSignUpUser.error = (action.payload && action.payload.detail) ?
        `${action.payload.detail} 😵` :
        DEFAULT_ERROR_TEXT;
    },

    cmsEmailVerifyLinkRequest: (state, action) => {
      state.cmsEmailVerifyLink.loading = XHR_STATE.IN_PROGRESS;
      state.cmsEmailVerifyLink.error = '';
    },

    cmsEmailVerifyLinkSuccess: (state, action) => {
      state.cmsEmailVerifyLink.loading = XHR_STATE.COMPLETE;
      state.cmsEmailVerifyLink.response = action.payload;
    },

    cmsEmailVerifyLinkError: (state, action) => {
      state.cmsEmailVerifyLink.loading = XHR_STATE.ASLEEP;
      state.cmsEmailVerifyLink.error = (action.payload && action.payload.detail) ?
        `${action.payload.detail} 😵` :
        DEFAULT_ERROR_TEXT;
    },

    cmsEmailVerifyRequest: (state, action) => {
      state.cmsEmailVerify.loading = XHR_STATE.IN_PROGRESS;
      state.cmsEmailVerify.error = '';
    },

    cmsEmailVerifySuccess: (state, action) => {
      state.cmsEmailVerify.loading = XHR_STATE.COMPLETE;
      state.cmsEmailVerify.response = action.payload;
    },
    cmsEmailVerifyError: (state, action) => {
      state.cmsEmailVerify.loading = XHR_STATE.ASLEEP;
      state.cmsEmailVerify.error = (action.payload && action.payload.detail) ?
        `${action.payload.detail} 😵` :
        DEFAULT_ERROR_TEXT;
    },
    cmsSignInStart: (state, action) => {
      state.cmsSignInUser.loading = XHR_STATE.IN_PROGRESS;
      state.cmsSignInUser.error = '';
    },
    cmsSignInClear: (state, action) => {
      state.cmsSignInUser.loading = XHR_STATE.ASLEEP;
      state.cmsSignInUser.error = '';
      state.cmsSignInUser.user = null;
    },
    cmsSignInSuccess: (state, action) => {
      state.cmsSignInUser.loading = XHR_STATE.COMPLETE;
      state.cmsSignInUser.user = action.payload;
    },
    cmsSignInError: (state, action) => {
      state.cmsSignInUser.loading = XHR_STATE.ASLEEP;
      state.cmsSignInUser.error = (action.payload && action.payload.detail) ?
        `${action.payload.detail} 😵` :
        DEFAULT_ERROR_TEXT;
    },

    getCmsUsersStart: (state, action) => {
      state.cmsUsers.loading = XHR_STATE.IN_PROGRESS;
      state.cmsUsers.error = '';
    },
    getCmsUsersSuccess: (state, action) => {
      state.cmsUsers.loading = XHR_STATE.COMPLETE;
      state.cmsUsers.users = action.payload;
    },
    getCmsUsersError: (state, action) => {
      state.cmsUsers.loading = XHR_STATE.ASLEEP;
      state.cmsUsers.error = (action.payload && action.payload.detail) ?
        `${action.payload.detail} 😵` :
        DEFAULT_ERROR_TEXT;
    },

    getCmsRolesStart: (state, action) => {
      state.cmsRoles.loading = XHR_STATE.IN_PROGRESS;
      state.cmsRoles.error = '';
    },
    getCmsRolesSuccess: (state, action) => {
      state.cmsRoles.loading = XHR_STATE.COMPLETE;
      state.cmsRoles.roles = action.payload;
    },
    getCmsRolesError: (state, action) => {
      state.cmsRoles.loading = XHR_STATE.ASLEEP;
      state.cmsRoles.error = (action.payload && action.payload.detail) ?
        `${action.payload.detail} 😵` :
        DEFAULT_ERROR_TEXT;
    },

    updateCmsUserStart: (state, action) => {
      state.updateCmsUser.loading = XHR_STATE.IN_PROGRESS;
      state.updateCmsUser.error = '';
    },
    updateCmsUserSuccess: (state, action) => {
      state.updateCmsUser.loading = XHR_STATE.COMPLETE;
    },
    updateCmsUserError: (state, action) => {
      state.updateCmsUser.loading = XHR_STATE.ASLEEP;
      state.updateCmsUser.error = (action.payload && action.payload.detail) ?
        `${action.payload.detail} 😵` :
        DEFAULT_ERROR_TEXT;
    },

    getInvitedCmsUsersStart: (state, action) => {
      state.invitedCmsUser.loading = XHR_STATE.IN_PROGRESS;
      state.invitedCmsUser.error = '';
    },
    getInvitedCmsUsersSuccess: (state, action) => {
      state.invitedCmsUser.loading = XHR_STATE.COMPLETE;
      state.invitedCmsUser.user = action.payload;
    },
    getInvitedCmsUsersError: (state, action) => {
      state.invitedCmsUser.loading = XHR_STATE.ASLEEP;
      state.invitedCmsUser.error = (action.payload && action.payload.detail) ?
        `${action.payload.detail} 😵` :
        DEFAULT_ERROR_TEXT;
    },

    getCmsEmailInviteStart: (state, action) => {
      state.cmsEmailInvite.loading = XHR_STATE.IN_PROGRESS;
      state.cmsEmailInvite.error = '';
    },
    getCmsEmailInviteSuccess: (state, action) => {
      state.cmsEmailInvite.loading = XHR_STATE.COMPLETE;
      state.cmsEmailInvite.data = action.payload;
    },
    getsCmsEmailInviteError: (state, action) => {
      state.cmsEmailInvite.loading = XHR_STATE.ASLEEP;
      state.cmsEmailInvite.error = (action.payload && action.payload.detail) ?
        `${action.payload.detail} 😵` :
        DEFAULT_ERROR_TEXT;
    },

    forgotPasswordStart: (state, action) => {
      state.forgotPassword.loading = XHR_STATE.IN_PROGRESS;
      state.forgotPassword.error = '';
    },
    forgotPasswordSuccess: (state, action) => {
      state.forgotPassword.loading = XHR_STATE.COMPLETE;
      state.forgotPassword.response = action.payload;
    },
    forgotPasswordError: (state, action) => {
      state.forgotPassword.loading = XHR_STATE.COMPLETE;
      state.forgotPassword.error = (action.payload && action.payload.detail) ?
        `${action.payload.detail} 😵` :
        DEFAULT_ERROR_TEXT;
    },

    resetPasswordStart: (state, action) => {
      state.resetPassword.loading = XHR_STATE.IN_PROGRESS;
      state.resetPassword.error = '';
    },
    resetPasswordSuccess: (state, action) => {
      state.resetPassword.loading = XHR_STATE.COMPLETE;
      state.resetPassword.response = action.payload;
    },
    resetPasswordError: (state, action) => {
      state.resetPassword.loading = XHR_STATE.COMPLETE;
      state.resetPassword.error = (action.payload && action.payload.detail) ?
        `${action.payload.detail} 😵` :
        DEFAULT_ERROR_TEXT;
    },

    logoutStart: (state, action) => {
      state.logoutCmsUser.loading = XHR_STATE.IN_PROGRESS;
      state.logoutCmsUser.error = '';
    },
    logoutSuccess: (state, action) => {
      state.logoutCmsUser.loading = XHR_STATE.COMPLETE;
      state.logoutCmsUser.error = '';
    },
    logoutError: (state, action) => {
      state.logoutCmsUser.loading = XHR_STATE.COMPLETE;
      state.logoutCmsUser.error = (action.payload && action.payload.detail) ?
        `${action.payload.detail} 😵` :
        DEFAULT_ERROR_TEXT;
    },

  }
});


export const teamAccessDispatchers = {
  getCmsUsers: (
    companyId: number,
    pn: number,
    ps: number
  ) =>
    async (dispatch: any) => {
      try {
        dispatch(getCmsUsersStart(companyId));
        const user = await teamAccessControlApi.getCmsUsersXhr(companyId, pn, ps);
        dispatch(getCmsUsersSuccess(user));
      } catch (error) {
        console.error('error.response\n', (error as any).response);
        dispatch(getCmsUsersError(((error as any).response && (error as any).response.data) || null));
        
      }
    },
  clearSignIn: (
    loginDto: TLoginDto,
    options?: TDispatcherOptions
  ) => async (dispatch: any) => {
    dispatch(cmsSignInClear(loginDto))
    
  },

  getCmsRoles: () =>
    async (dispatch: any) => {
      try {
        dispatch(getCmsRolesStart(null));
        const roles = await teamAccessControlApi.getCmsRolesXhr();
        dispatch(getCmsRolesSuccess(roles));
      } catch (error) {
        console.error('error.response\n', (error as any).response);
        dispatch(getCmsRolesError(((error as any).response && (error as any).response.data) || null));
      }
    },

  updateCmsUser: (user: TEditedCmsUser, companyId: number, userId: number) =>
    async (dispatch: any) => {
      try {
        dispatch(getCmsRolesStart(null));
        const roles = await teamAccessControlApi.updateCmsUserXhr(user, companyId, userId);
        dispatch(getCmsRolesSuccess(roles));
      } catch (error) {
        console.error('error.response\n', (error as any).response);
        dispatch(getCmsRolesError(((error as any).response && (error as any).response.data) || null));
      }
    },

  getInvitedCmsUser: (
    key: string
  ) =>
    async (dispatch: any) => {
      try {
        dispatch(getInvitedCmsUsersStart(key));
        const user = await teamAccessControlApi.getInvitedCmsUsersXhr(key);
        dispatch(getInvitedCmsUsersSuccess(user));
      } catch (error) {
        console.error('error.response\n', (error as any).response);
        dispatch(getInvitedCmsUsersError(((error as any).response && (error as any).response.data) || null));
      }
    },

  cmsSignUpUser: (
    cmsSignUpDto: TCmsUserSignUpRequestDto,
    options?: TDispatcherOptions
  ) =>
    async (dispatch: any) => {
      try {
        dispatch(cmsSignUpStart(cmsSignUpDto));
        const user = await teamAccessControlApi.signUpXhr(cmsSignUpDto);
        dispatch(cmsSignUpSuccess(user));
        //since we are navigating to verification so setting profile not needed
        /*dispatch(setUserGoogleProfile({
          id: user.id,
          name: user.name,
          email: user.email,
          companyId: user.companyId,
          companyName: user.companyName,
          userRoles: user.userRoles,
        }));*/
        if (options && options.success) options.success(user);
      } catch (error) {
        console.error('error.response\n', (error as any).response);
        dispatch(cmsSignUpError(((error as any).response && (error as any).response.data) || null));
        if (options && options.error) options.error();
      }
    },
  
    invitedCmsSignUpUser: (
      cmsSignUpDto: TInvitedCmsUserSignUpRequestDto,
      options?: TDispatcherOptions
    ) =>
      async (dispatch: any) => {
        try {
          dispatch(cmsSignUpStart(cmsSignUpDto));
          const user = await teamAccessControlApi.invitedSignUpXhr(cmsSignUpDto);
          dispatch(cmsSignUpSuccess(user));
          //since we are navigating to verification so setting profile not needed
          dispatch(setUserGoogleProfile({
            id: user.id,
            name: user.name,
            email: user.email,
            companyId: user.companyId,
            companyName: user.companyName,
            userRoles: user.userRoles,
            phone: user.phone,
            lastLoggedInTime: user.lastLoggedInTime,
            twoFAEnabled: user.twoFAEnabled,
            blocked: user.blocked,
          }));
          if (options && options.success) options.success(user);
        } catch (error) {
          console.error('error.response\n', (error as any).response);
          dispatch(cmsSignUpError(((error as any).response && (error as any).response.data) || null));
          if (options && options.error) options.error();
        }
      },
  
  cmsSendVerifyMail: (
    cmsSendEmailLink: TCmsSendEmailLinkDTo,
    options?: TDispatcherOptions
  ) => 
    async (dispatch: any) => {
      try {
        dispatch(cmsEmailVerifyLinkRequest(cmsSendEmailLink));
        const response = await teamAccessControlApi.sendEmailXhr(cmsSendEmailLink);
        console.log("response",response)
        dispatch(cmsEmailVerifyLinkSuccess(response));
        if (options && options.success) options.success(response);
      }
      catch (error) {
        console.error('error.response\n', (error as any).response);
        dispatch(cmsEmailVerifyLinkError(((error as any).response && (error as any).response.data) || null));
        if (options && options.error) options.error();
      }
    },
  
  
  cmsVerifyMail: (
    cmsVerifyMail: TCmsVerifyEmailDTo,
    options?: TDispatcherOptions
  ) => async (dispatch: any) => {
    try {
      dispatch(cmsEmailVerifyRequest(cmsVerifyMail));
      const response = await teamAccessControlApi.verifyEmailXhr(cmsVerifyMail);
      dispatch(cmsEmailVerifySuccess(response));
      if (options && options.success) options.success(response);
    }
    catch (error) {
      console.error('error.response\n', (error as any).response);
      dispatch(cmsEmailVerifyError(((error as any).response && (error as any).response.data) || null));
      if (options && options.error) options.error();
    }
  },

  

  getCmsLogin: (
    loginDto: TLoginDto,
    options?: TDispatcherOptions
  ) =>
    async (dispatch: any) => {
      try {
        dispatch(cmsSignInStart(loginDto));
        const user : TCmsUser = await teamAccessControlApi.signInXhr(loginDto);
        dispatch(cmsSignInSuccess(user));
        if (cookies.get(ADMIN_USER_AUTH_TOKEN)) {
          dispatch(setUserGoogleProfile({
            id: user.id,
            name: user.name,
            email: user.email,
            companyId: user.companyId,
            companyName: user.companyName,
            userRoles: user.userRoles,
            phone: user.phone,
            lastLoggedInTime: user.lastLoggedInTime,
            twoFAEnabled: user.twoFAEnabled,
            blocked: user.blocked,
          }));
        }
        dispatch(setCompanyIdCopy(user.companyId));
        if (options && options.success) options.success(user);
      } catch (error) {
        console.error('getCmsLoginDispatcher error\n', error);
        dispatch(cmsSignInError(((error as any).response && (error as any).response.data) || null));
        if (options && options.error) options.error();
      }
    },

  sendEmailInvited: (
    emailInviteDto: TEmailInvite,
    options?: TDispatcherOptions
  ) =>
    async (dispatch: any) => {
      try {
        dispatch(getCmsEmailInviteStart(emailInviteDto));
        const data: TStatusResponse = await teamAccessControlApi.sendEmailInviteXhr(emailInviteDto);
        if (data.status === 'success') {
          dispatch(getCmsEmailInviteSuccess(data));
        } else {
          dispatch(getsCmsEmailInviteError(data));
        }
        if (options && options.success) {
          options.success();
        }
      } catch (error) {
        console.error('error.response\n', (error as any).response);
        dispatch(getsCmsEmailInviteError(((error as any).response && (error as any).response.data) || null));
        if (options && options.error) {
          options.error();
        }
      }
    },

  forgotPassword: (email: string, options?: TDispatcherOptions) =>
    async (dispatch: any) => {
      try {
        dispatch(forgotPasswordStart(email));
        const data = await teamAccessControlApi.forgotPassword(email);
        dispatch(forgotPasswordSuccess(data));
        if (options && options.success) {
          options.success();
        }
      } catch (error) {
        dispatch(forgotPasswordError(((error as any).response && (error as any).response.data) || null));
        if (options && options.error) {
          options.error();
        }
        console.error('something went wrong forgotPassword', error);
      }
    },

  resetPassword: (
    email: string,
    password: string,
    resetKey: string,
    options?: TDispatcherOptions
  ) =>
    async (dispatch: any) => {
      try {
        dispatch(resetPasswordStart(email));
        const data = await teamAccessControlApi.resetPassword(email, password, resetKey);
        dispatch(resetPasswordSuccess(data));
        if (options && options.success) {
          options.success();
        }
      } catch (error) {
        dispatch(resetPasswordError(((error as any).response && (error as any).response.data) || null));
        if (options && options.error) {
          options.error();
        }
        console.error('something went wrong forgotPassword', error);
      }
    },

  logout: (
    options?: TDispatcherOptions
  ) =>
    async (dispatch: any) => {
      try {
        dispatch(logoutStart(null));
        const data = await teamAccessControlApi.logoutXhr();
        dispatch(logoutSuccess(data));
        if (options && options.success) {
          options.success();
        }
      } catch (error) {
        dispatch(logoutError(((error as any).response && (error as any).response.data) || null));
        if (options && options.error) {
          options.error();
        }
        console.error('something went wrong logout', error);
      }
    },

};

const {
  getCmsUsersStart, getCmsUsersSuccess, getCmsUsersError,
  cmsSignUpStart, cmsSignUpSuccess, cmsSignUpError,
  cmsEmailVerifyLinkRequest,cmsEmailVerifyLinkSuccess,cmsEmailVerifyLinkError,
  cmsEmailVerifyRequest,cmsEmailVerifySuccess,cmsEmailVerifyError,
  cmsSignInStart, cmsSignInSuccess, cmsSignInError,cmsSignInClear,
  getInvitedCmsUsersStart, getInvitedCmsUsersSuccess, getInvitedCmsUsersError,
  getCmsEmailInviteStart, getCmsEmailInviteSuccess, getsCmsEmailInviteError,
  forgotPasswordStart, forgotPasswordError,
  resetPasswordStart, resetPasswordSuccess, resetPasswordError,
  getCmsRolesStart, getCmsRolesSuccess, getCmsRolesError,
  updateCmsUserStart, updateCmsUserSuccess, updateCmsUserError,
  logoutStart, logoutSuccess, logoutError,
} = userSlice.actions;

export const {
  forgotPasswordSuccess
} = userSlice.actions;

export default userSlice.reducer;

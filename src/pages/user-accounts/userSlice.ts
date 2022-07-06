import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { XHR_STATE } from "../../common/constants";
import { AppDispatch } from "../../rtk-reducers";
import { ECost } from "../../types/eventTypes";
import { TUserModerationRequest } from "../../types/gameConfigTypes";
import {
  creditVirtualCurrencPayload,
  creditVirtualCurrencyToUserXhr,
  fetchVirtualWalletXhr,
  fetchWalletLedgerXhr,
  fetchVirtualWalletLedgerXhr,
  fetchWalletRewardStatsXhr,
  markAmountPendingFromWinningXhr,
  markPendingAsPaidXhr,
  revertPaymentXhr,
  userSearchByCriteriaXhr,
  udpateDisplayNameXhr,
  udpateUserIdXhr,
  udpateUserNameXhr,
  udpateUserRoleXhr,
  userApi,
  fetchUserWalletTotalAmountsXhr,
  submitUserModerationFormDataXhr,
  revokeBanXhr,
  fetchUserTrueSkillXhr,
} from "./userApi";
import { ERegisteredUserRole, TRewardStats, TUserResponse, TVirtualWallet, TWalletLedger, TUserWalletTotalAmounts, TUserTrueSkill, TVirtualWalletLedger } from "./userTypes";

type TUserSlice = {
  searchByCriteria: {
    user: null | TUserResponse;
    loading: XHR_STATE;
    error: string;
  };
  fetchWalletLedger: {
    wallet: TWalletLedger[],
    loading: XHR_STATE;
    error: string;
  };
  fetchVirtualWalletLedger: {
    wallet: TVirtualWalletLedger[],
    loading: XHR_STATE;
    error: string;
  };
  creditVirtualCurrency: {
    loading: XHR_STATE;
    error: string;
    showDialog: boolean;
    selectedCurrency: ECost;
    selectedKeyCount: number;
  };
  updateUserId: {
    loading: XHR_STATE;
    error: string;
    newUserId: string;
    showDialog: boolean;
  };
  updateUserName: {
    loading: XHR_STATE;
    error: string;
    newUserName: string;
    showDialog: boolean;
  };
  updateUserRole: {
    loading: XHR_STATE;
    error: string;
    newUserRole: ERegisteredUserRole;
    showDialog: boolean;
  };
  updateDisplayName: {
    loading: XHR_STATE;
    error: string;
    newFirstName: string;
    newLastName: string;
    showDialog: boolean;
  };
  markAmountPendingFromWinning: {
    loading: XHR_STATE;
    error: string;
  };
  markPendingAsPaid: {
    loading: XHR_STATE;
    error: string;
  };
  walletRewardStats: {
    rewardStats: null | TRewardStats;
    loading: XHR_STATE;
    error: string;
  };
  revertPayment: {
    loading: XHR_STATE;
    error: string;
  };
  virtualWallet: {
    loading: XHR_STATE;
    error: string;
    vWallet: TVirtualWallet[];
  };
  deleteUser: {
    loading: XHR_STATE;
    error: string;
  };
  resetProfilePic: {
    loading: XHR_STATE;
    error: string;
  };
  userWalletTotalAmounts: {
    amounts: null | TUserWalletTotalAmounts;
    loading: XHR_STATE;
    error: string;
  };
  userTrueSkill: {
    skillData: TUserTrueSkill[];
    loading: XHR_STATE;
    error: string;
  };
};

const DEFAULT_ERROR_TEXT = 'Something went wrong. Please try again. 😵';

const initialState: TUserSlice = {
  searchByCriteria: {
    user: null,
    loading: XHR_STATE.ASLEEP,
    error: '',
  },
  fetchWalletLedger: {
    wallet: [],
    loading: XHR_STATE.ASLEEP,
    error: '',
  },
  fetchVirtualWalletLedger: {
    wallet: [],
    loading: XHR_STATE.ASLEEP,
    error: '',
  },
  creditVirtualCurrency: {
    loading: XHR_STATE.ASLEEP,
    error: '',
    showDialog: false,
    selectedCurrency: ECost.NONE,
    selectedKeyCount: 0,
  },
  updateUserId: {
    loading: XHR_STATE.ASLEEP,
    error: '',
    newUserId: '',
    showDialog: false,
  },
  updateUserName: {
    loading: XHR_STATE.ASLEEP,
    error: '',
    newUserName: '',
    showDialog: false,
  },
  updateUserRole: {
    loading: XHR_STATE.ASLEEP,
    error: '',
    newUserRole: ERegisteredUserRole.REGULAR,
    showDialog: false,
  },
  updateDisplayName: {
    loading: XHR_STATE.ASLEEP,
    error: '',
    newFirstName: '',
    newLastName: '',
    showDialog: false,
  },
  markAmountPendingFromWinning: {
    loading: XHR_STATE.ASLEEP,
    error: '',
  },
  markPendingAsPaid: {
    loading: XHR_STATE.ASLEEP,
    error: '',
  },
  walletRewardStats: {
    rewardStats: null,
    loading: XHR_STATE.IN_PROGRESS,
    error: '',
  },
  revertPayment: {
    loading: XHR_STATE.ASLEEP,
    error: '',
  },
  virtualWallet: {
    loading: XHR_STATE.ASLEEP,
    error: '',
    vWallet: [],
  },
  deleteUser: {
    loading: XHR_STATE.ASLEEP,
    error: '',
  },
  resetProfilePic: {
    loading: XHR_STATE.ASLEEP,
    error: '',
  },
  userWalletTotalAmounts: {
    amounts: null,
    loading: XHR_STATE.ASLEEP,
    error: '',
  },
  userTrueSkill: {
    skillData: [],
    loading: XHR_STATE.ASLEEP,
    error: '',
  },
};

const userSlice = createSlice({
  name: 'userSlice',
  initialState: initialState,
  reducers: {
    searchByCriteriaStart: (state, action) => {
      state.searchByCriteria.loading = XHR_STATE.IN_PROGRESS;
      state.searchByCriteria.error = '';
    },
    searchByCriteriaSuccess: (state, action) => {
      state.searchByCriteria.loading = XHR_STATE.ASLEEP;
      state.searchByCriteria.user = action.payload;
    },
    searchByCriteriaError: (state, action) => {
      state.searchByCriteria.loading = XHR_STATE.ASLEEP;
      state.searchByCriteria.error = (action.payload && action.payload.detail) ?
        `${action.payload.detail} 😵` :
        DEFAULT_ERROR_TEXT;
    },

    fetchWalletLedgerStart: (state, action) => {
      state.fetchWalletLedger.loading = XHR_STATE.IN_PROGRESS;
      state.fetchWalletLedger.error = '';
    },
    fetchWalletLedgerSuccess: (state, action) => {
      state.fetchWalletLedger.wallet = action.payload;
      state.fetchWalletLedger.loading = XHR_STATE.ASLEEP;
      state.fetchWalletLedger.error = '';
    },
    fetchWalletLedgerError: (state, action) => {
      state.fetchWalletLedger.loading = XHR_STATE.ASLEEP;
      state.fetchWalletLedger.error = (action.payload && action.payload.detail) ?
        `${action.payload.detail} 😵` :
        DEFAULT_ERROR_TEXT;
    },

    fetchVirtualWalletLedgerStart: (state, action) => {
      state.fetchVirtualWalletLedger.loading = XHR_STATE.IN_PROGRESS;
      state.fetchVirtualWalletLedger.error = '';
    },
    fetchVirtualWalletLedgerSuccess: (state, action) => {
      state.fetchVirtualWalletLedger.wallet = action.payload;
      state.fetchVirtualWalletLedger.loading = XHR_STATE.ASLEEP;
      state.fetchVirtualWalletLedger.error = '';
    },
    fetchVirtualWalletLedgerError: (state, action) => {
      state.fetchVirtualWalletLedger.loading = XHR_STATE.ASLEEP;
      state.fetchVirtualWalletLedger.error = (action.payload && action.payload.detail) ?
        `${action.payload.detail} 😵` :
        DEFAULT_ERROR_TEXT;
    },

    fetchUserWalletTotalAmountsStart: (state, action) => {
      state.userWalletTotalAmounts.loading = XHR_STATE.IN_PROGRESS;
      state.userWalletTotalAmounts.error = '';
    },
    fetchUserWalletTotalAmountsSuccess: (state, action) => {
      state.userWalletTotalAmounts.amounts = action.payload;
      state.userWalletTotalAmounts.loading = XHR_STATE.COMPLETE;
      state.userWalletTotalAmounts.error = '';
    },
    fetchUserWalletTotalAmountsError: (state, action) => {
      state.userWalletTotalAmounts.loading = XHR_STATE.ASLEEP;
      state.userWalletTotalAmounts.error = (action.payload && action.payload.detail) ?
        `${action.payload.detail} 😵` :
        DEFAULT_ERROR_TEXT;
    },

    creditVirtualCurrencyStart: (state, action) => {
      state.creditVirtualCurrency.loading = XHR_STATE.IN_PROGRESS;
      state.creditVirtualCurrency.error = '';
    },
    creditVirtualCurrencySuccess: (state, action) => {
      state.creditVirtualCurrency.loading = XHR_STATE.COMPLETE;
      state.creditVirtualCurrency.error = '';
      state.creditVirtualCurrency.showDialog = false;
    },
    creditVirtualCurrencyError: (state, action) => {
      state.creditVirtualCurrency.loading = XHR_STATE.ASLEEP;
      state.creditVirtualCurrency.error = action.payload ?
        `${action.payload} 😵` :
        DEFAULT_ERROR_TEXT;
    },
    creditVirtualCurrencySetLoading: (state, action: PayloadAction<XHR_STATE>) => {
      state.creditVirtualCurrency.loading = action.payload;
    },
    creditVirtualCurrencySetError: (state, action: PayloadAction<string>) => {
      state.creditVirtualCurrency.error = action.payload;
    },
    creditVirtualCurrencySetShowDialog: (state, action: PayloadAction<boolean>) => {
      state.creditVirtualCurrency.showDialog = action.payload;
    },
    creditVirtualCurrencySetSelectedCurrency: (state, action: PayloadAction<ECost>) => {
      state.creditVirtualCurrency.selectedCurrency = action.payload;
    },
    creditVirtualCurrencySetSelectedKeyCount: (state, action: PayloadAction<number>) => {
      state.creditVirtualCurrency.selectedKeyCount = action.payload;
    },

    updateUserIdStart: (state, action) => {
      state.updateUserId.loading = XHR_STATE.IN_PROGRESS;
      state.updateUserId.error = '';
    },
    updateUserIdSuccess: (state, action) => {
      state.updateUserId.loading = XHR_STATE.COMPLETE;
      state.updateUserId.error = '';
      state.updateUserId.newUserId = '';
      state.updateUserId.showDialog = false;
    },
    updateUserIdError: (state, action) => {
      state.updateUserId.loading = XHR_STATE.ASLEEP;
      state.updateUserId.error = action.payload ?
        `${action.payload.detail} 😵` :
        DEFAULT_ERROR_TEXT;
    },
    updateUserIdSetLoading: (state, action: PayloadAction<XHR_STATE>) => {
      state.updateUserId.loading = action.payload;
    },
    updateUserIdSetError: (state, action: PayloadAction<string>) => {
      state.updateUserId.error = action.payload;
    },
    updateUserIdSetShowDialog: (state, action: PayloadAction<boolean>) => {
      state.updateUserId.showDialog = action.payload;
    },
    updateUserIdSetNewUserId: (state, action: PayloadAction<string>) => {
      state.updateUserId.newUserId = action.payload;
    },

    updateUserRoleStart: (state, action) => {
      state.updateUserRole.loading = XHR_STATE.IN_PROGRESS;
      state.updateUserRole.error = '';
    },
    updateUserRoleSuccess: (state, action) => {
      state.updateUserRole.loading = XHR_STATE.COMPLETE;
      state.updateUserRole.error = '';
      state.updateUserRole.showDialog = false;
    },
    updateUserRoleError: (state, action) => {
      state.updateUserRole.loading = XHR_STATE.ASLEEP;
      state.updateUserRole.error = action.payload ?
        `${action.payload.detail} 😵` :
        DEFAULT_ERROR_TEXT;
    },
    updateUserRoleSetLoading: (state, action: PayloadAction<XHR_STATE>) => {
      state.updateUserRole.loading = action.payload;
    },
    updateUserRoleSetError: (state, action: PayloadAction<string>) => {
      state.updateUserRole.error = action.payload;
    },
    updateUserRoleSetShowDialog: (state, action: PayloadAction<boolean>) => {
      state.updateUserRole.showDialog = action.payload;
    },
    updateUserRoleSetNewUserRole: (state, action: PayloadAction<ERegisteredUserRole>) => {
      state.updateUserRole.newUserRole = action.payload;
    },

    updateUserNameStart: (state, action) => {
      state.updateUserName.loading = XHR_STATE.IN_PROGRESS;
      state.updateUserName.error = '';
    },
    updateUserNameSuccess: (state, action) => {
      state.updateUserName.loading = XHR_STATE.COMPLETE;
      state.updateUserName.error = '';
      state.updateUserName.newUserName = '';
      state.updateUserName.showDialog = false;
    },
    updateUserNameError: (state, action) => {
      state.updateUserName.loading = XHR_STATE.ASLEEP;
      state.updateUserName.error = action.payload ?
        `${action.payload.detail} 😵` :
        DEFAULT_ERROR_TEXT;
    },
    updateUserNameSetLoading: (state, action: PayloadAction<XHR_STATE>) => {
      state.updateUserName.loading = action.payload;
    },
    updateUserNameSetError: (state, action: PayloadAction<string>) => {
      state.updateUserName.error = action.payload;
    },
    updateUserNameSetShowDialog: (state, action: PayloadAction<boolean>) => {
      state.updateUserName.showDialog = action.payload;
    },
    updateUserNameSetUserName: (state, action: PayloadAction<string>) => {
      state.updateUserName.newUserName = action.payload;
    },

    updateDisplayNameStart: (state, action) => {
      state.updateDisplayName.loading = XHR_STATE.IN_PROGRESS;
      state.updateDisplayName.error = '';
    },
    updateDisplayNameSuccess: (state, action) => {
      state.updateDisplayName.loading = XHR_STATE.COMPLETE;
      state.updateDisplayName.error = '';
      state.updateDisplayName.showDialog = false;
    },
    updateDisplayNameError: (state, action) => {
      state.updateDisplayName.loading = XHR_STATE.ASLEEP;
      state.updateDisplayName.error = action.payload ?
        `${action.payload.detail} 😵` :
        DEFAULT_ERROR_TEXT;
    },
    updateDisplayNameSetLoading: (state, action: PayloadAction<XHR_STATE>) => {
      state.updateDisplayName.loading = action.payload;
    },
    updateDisplayNameSetError: (state, action: PayloadAction<string>) => {
      state.updateDisplayName.error = action.payload;
    },
    updateDisplayNameSetShowDialog: (state, action: PayloadAction<boolean>) => {
      state.updateDisplayName.showDialog = action.payload;
    },
    updateDisplayNameSetFirstName: (state, action: PayloadAction<string>) => {
      state.updateDisplayName.newFirstName = action.payload;
    },
    updateDisplayNameSetLastName: (state, action: PayloadAction<string>) => {
      state.updateDisplayName.newLastName = action.payload;
    },
    
    markAmountPendingFromWinningStart: (state, action) => {
      state.markAmountPendingFromWinning.loading = XHR_STATE.IN_PROGRESS;
      state.markAmountPendingFromWinning.error = '';
    },
    markAmountPendingFromWinningSuccess: (state, action) => {
      state.markAmountPendingFromWinning.loading = XHR_STATE.ASLEEP;
      state.markAmountPendingFromWinning.error = '';
    },
    markAmountPendingFromWinningError: (state, action) => {
      state.markAmountPendingFromWinning.loading = XHR_STATE.ASLEEP;
      state.markAmountPendingFromWinning.error = (action.payload && action.payload.detail) ?
        `${action.payload.detail} 😵` :
        DEFAULT_ERROR_TEXT;
    },
    markAmountPendingFromWinningSetError: (state, action) => {
      state.markAmountPendingFromWinning.error = action.payload;
    },

    markPendingAsPaidStart: (state, action) => {
      state.markPendingAsPaid.loading = XHR_STATE.IN_PROGRESS;
      state.markPendingAsPaid.error = '';
    },
    markPendingAsPaidSuccess: (state, action) => {
      state.markPendingAsPaid.loading = XHR_STATE.ASLEEP;
      state.markPendingAsPaid.error = '';
    },
    markPendingAsPaidError: (state, action) => {
      state.markPendingAsPaid.loading = XHR_STATE.ASLEEP;
      state.markPendingAsPaid.error = (action.payload && action.payload.detail) ?
        `${action.payload.detail} 😵` :
        DEFAULT_ERROR_TEXT;
    },
    markPendingAsPaidSetError: (state, action) => {
      state.markPendingAsPaid.error = action.payload;
    },

    fetchWalletRewardStatsStart: (state, action) => {
      state.walletRewardStats.loading = XHR_STATE.IN_PROGRESS;
      state.walletRewardStats.error = '';
    },
    fetchWalletRewardStatsSuccess: (state, action) => {
      state.walletRewardStats.loading = XHR_STATE.ASLEEP;
      state.walletRewardStats.error = '';
      state.walletRewardStats.rewardStats = action.payload;
    },
    fetchWalletRewardStatsError: (state, action) => {
      state.walletRewardStats.loading = XHR_STATE.ASLEEP;
      state.walletRewardStats.error = (action.payload && action.payload.detail) ?
        `${action.payload.detail} 😵` :
        DEFAULT_ERROR_TEXT;
    },

    revertPaymentStart: (state, action) => {
      state.revertPayment.loading = XHR_STATE.IN_PROGRESS;
      state.revertPayment.error = '';
    },
    revertPaymentSuccess: (state, action) => {
      state.revertPayment.loading = XHR_STATE.ASLEEP;
      state.revertPayment.error = '';
    },
    revertPaymentError: (state, action) => {
      state.revertPayment.loading = XHR_STATE.ASLEEP;
      state.revertPayment.error = (action.payload && action.payload.detail) ?
        `${action.payload.detail} 😵` :
        DEFAULT_ERROR_TEXT;
    },
    revertPaymentSetError: (state, action) => {
      state.revertPayment.error = action.payload;
    },

    virtualWalletStart: (state, action) => {
      state.virtualWallet.loading = XHR_STATE.IN_PROGRESS;
      state.virtualWallet.error = '';
    },
    virtualWalletSuccess: (state, action) => {
      state.virtualWallet.loading = XHR_STATE.ASLEEP;
      state.virtualWallet.error = '';
      state.virtualWallet.vWallet = action.payload;
    },
    virtualWalletError: (state, action) => {
      state.virtualWallet.loading = XHR_STATE.ASLEEP;
      state.virtualWallet.error = (action.payload && action.payload.detail) ?
        `${action.payload.detail} 😵` :
        DEFAULT_ERROR_TEXT;
    },
    virtualWalletSetError: (state, action) => {
      state.revertPayment.error = action.payload;
    },

    deleteUserStart: (state, action) => {
      state.deleteUser.loading = XHR_STATE.IN_PROGRESS;
      state.deleteUser.error = '';
    },
    deleteUserSuccess: (state, action) => {
      state.deleteUser.loading = XHR_STATE.ASLEEP;
    },
    deleteUserError: (state, action) => {
      state.deleteUser.loading = XHR_STATE.ASLEEP;
      state.deleteUser.error = (action.payload && action.payload.detail) ?
        `${action.payload.detail} 😵` :
        DEFAULT_ERROR_TEXT;
    },
    setDeleteUserSlice: (state, action: PayloadAction<typeof initialState.deleteUser>) => {
      state.deleteUser = action.payload;
    },

    resetProfilePicStart: (state, action) => {
      state.resetProfilePic.loading = XHR_STATE.IN_PROGRESS;
      state.resetProfilePic.error = '';
    },
    resetProfilePicSuccess: (state, action) => {
      state.resetProfilePic.loading = XHR_STATE.ASLEEP;
      state.resetProfilePic.error = '';
    },
    resetProfilePicError: (state, action) => {
      state.resetProfilePic.loading = XHR_STATE.ASLEEP;
      state.resetProfilePic.error = (action.payload && action.payload.detail) ?
        `${action.payload.detail} 😵` :
        DEFAULT_ERROR_TEXT;
    },

    fetchUserTrueSkillStart: (state, action) => {
      state.userTrueSkill.loading = XHR_STATE.IN_PROGRESS;
      state.userTrueSkill.error = '';
    },
    fetchUserTrueSkillSuccess: (state, action) => {
      state.userTrueSkill.loading = XHR_STATE.COMPLETE;
      state.userTrueSkill.error = '';
      state.userTrueSkill.skillData = action.payload;
    },
    fetchUserTrueSkillError: (state, action) => {
      state.userTrueSkill.loading = XHR_STATE.ASLEEP;
      state.userTrueSkill.error = (action.payload && action.payload.detail) ?
        `${action.payload.detail} 😵` :
        DEFAULT_ERROR_TEXT;
    },
  }
});

export const searchByCriteraDispatcher = (
  appId: string,
  searchCriteria: string,
  searchTerm: string
) =>
  async (dispatch: any) => {
    try {
      dispatch(searchByCriteriaStart(searchTerm));
      const user = await userSearchByCriteriaXhr(appId, searchCriteria, searchTerm);
      dispatch(searchByCriteriaSuccess(user));
    } catch (error) {
      console.error('error.response\n', error.response);
      dispatch(searchByCriteriaError((error.response && error.response.data) || null));
    }
  };

export const fetchWalletLedgerDispatcher = (appId: string, userId: string) =>
  async (dispatch: any) => {
    if (!appId || !userId) {
      console.warn('fetchWalletLedgerDispatcher: appId and userId are required');
      return;
    }
    try {
      dispatch(fetchWalletLedgerStart({ appId, userId}));
      const response = await fetchWalletLedgerXhr(appId, userId);
      dispatch(fetchWalletLedgerSuccess(response));
    } catch (error) {
      console.error('error.response\n', error.response);
      dispatch(fetchWalletLedgerError(error.response ? error.response.data : null));
    }
  };

export const fetchVirtualWalletLedgerDispatcher = (appId: string, userId: string) =>
  async (dispatch: any) => {
    if (!appId || !userId) {
      console.warn('fetchVirtualWalletLedgerDispatcher: appId and userId are required');
      return;
    }
    try {
      dispatch(fetchVirtualWalletLedgerStart({ appId, userId }));
      const response = await fetchVirtualWalletLedgerXhr(appId, userId);
      dispatch(fetchVirtualWalletLedgerSuccess(response));
    } catch (error) {
      console.error('error.response\n', error.response);
      dispatch(fetchVirtualWalletLedgerError(error.response ? error.response.data : null));
    }
  };

export const fetchUserWalletTotalAmountsDispatcher = (userId: string) =>
  async (dispatch: any) => {
    if (!userId) {
      console.warn('fetchUserWalletTotalAmountsDispatcher: userId is required');
      return;
    }
    try {
      dispatch(fetchUserWalletTotalAmountsStart({ userId }));
      const amounts = await fetchUserWalletTotalAmountsXhr(userId);
      dispatch(fetchUserWalletTotalAmountsSuccess(amounts));
    } catch (error) {
      console.error('error.response\n', error.response);
      dispatch(fetchUserWalletTotalAmountsError(error.response ? error.response.data : null));
    }
  };

export const creditVirtualCurrencyDispatcher = (
  appId: string,
  userId: string,
  payload: creditVirtualCurrencPayload
) =>
  async (dispatch: any) => {
    try {
      dispatch(creditVirtualCurrencyStart({ appId, userId}));
      const response = await creditVirtualCurrencyToUserXhr(appId, userId, payload);
      dispatch(creditVirtualCurrencySuccess(response));
    } catch (error) {
      console.error('error.response\n', error.response);
      dispatch(creditVirtualCurrencyError(error.response ? error.response.data : null));
    }
  };

export const updateUserNameDispatcher = (
  userId: string,
  newUserName: string,
) =>
  async (dispatch: any) => {
    try {
      dispatch(updateUserNameStart({ newUserName }));
      const response = await udpateUserNameXhr(userId, newUserName);
      dispatch(updateUserNameSuccess(response));
    } catch (error) {
      console.error('error.response\n', error.response);
      dispatch(updateUserNameError(error.response ? error.response.data : null));
    }
  };

export const updateUserIdDispatcher = (
  userId: string,
  newUserId: string,
) =>
  async (dispatch: any) => {
    try {
      dispatch(updateUserIdStart({ newUserId }));
      const response = await udpateUserIdXhr(userId, newUserId);
      dispatch(updateUserIdSuccess(response));
    } catch (error) {
      console.error('error.response\n', error.response);
      dispatch(updateUserIdError(error.response ? error.response.data : null));
    }
  };

export const updateUserRoleDispatcher = (
  userId: string,
  newUserId: string,
  onSuccess?: () => void,
) =>
  async (dispatch: any) => {
    try {
      dispatch(updateUserRoleStart({ newUserId }));
      const response = await udpateUserRoleXhr(userId, newUserId);
      dispatch(updateUserRoleSuccess(response));
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error('error.response\n', error.response);
      dispatch(updateUserRoleError(error.response ? error.response.data : null));
    }
  };

export const updateDisplayNameDispatcher = (
  userId: string,
  firstName: string,
  lastName: string,
  onSuccess?: () => void,
) =>
  async (dispatch: any) => {
    try {
      dispatch(updateDisplayNameStart({ firstName, lastName }));
      const response = await udpateDisplayNameXhr(userId, firstName, lastName);
      dispatch(updateDisplayNameSuccess(response));
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error('error.response\n', error.response);
      dispatch(updateDisplayNameError(error.response ? error.response.data : null));
    }
  };

export const markAmountPendingFromWinningDispatcher = (
  appId: string,
  userId: string,
  amount: number,
  options?: {
    onSuccess?: () => void
    onError?: () => void
  }
) =>
  async (dispatch: any) => {
    if (!appId || !userId) {
      console.warn('markAmountPendingFromWinningDispatcher: appId and userId are required');
      return;
    }
    try {
      dispatch(markAmountPendingFromWinningStart({ appId, userId, amount }));
      const response = await markAmountPendingFromWinningXhr(appId, userId, amount);
      dispatch(markAmountPendingFromWinningSuccess(response));
      if (options && options.onSuccess) options.onSuccess();
    } catch (error) {
      console.error('error.response\n', error.response);
      dispatch(markAmountPendingFromWinningError((error.response && error.response.data) || null));
      if (options && options.onError) options.onError();
    }
  };

export const markPendingAsPaidDispatcher = (
  appId: string,
  userId: string,
  options?: {
    onSuccess?: () => void
    onError?: () => void
  }
) =>
  async (dispatch: any) => {
    if (!appId || !userId) {
      console.warn('markPendingAsPaidDispatcher: appId and userId are required');
      return;
    }
    try {
      dispatch(markPendingAsPaidStart({ appId, userId }));
      const response = await markPendingAsPaidXhr(appId, userId);
      dispatch(markPendingAsPaidSuccess(response));
      if (options && options.onSuccess) options.onSuccess();
    } catch (error) {
      console.error('error.response\n', error.response);
      dispatch(markPendingAsPaidError((error.response && error.response.data) || null));
      if (options && options.onError) options.onError();
    }
  };

export const fetchWalletRewardStatsDispatcher = (appId: string, userId: string) =>
  async (dispatch: any) => {
    if (!appId || !userId) {
      console.warn('fetchWalletRewardStatsDispatcher: appId and userId are required');
      return;
    }
    try {
      dispatch(fetchWalletRewardStatsStart({ appId, userId}));
      const rewardStats = await fetchWalletRewardStatsXhr(appId, userId);
      dispatch(fetchWalletRewardStatsSuccess(rewardStats));
    } catch (error) {
      console.error('error.response\n', error.response);
      dispatch(fetchWalletRewardStatsError((error.response && error.response.data) || null));
    }
  };

export const revertPaymentDispatcher = (
  appId: string,
  userId: string,
  id: number,
  options?: {
    onSuccess?: () => void
    onError?: () => void
  }
) =>
  async (dispatch: any) => {
    if (!appId || !userId) {
      console.warn('revertPaymentDispatcher: appId and userId are required');
      return;
    }
    try {
      dispatch(revertPaymentStart({ appId, userId, transactionId: id }));
      const rewardStats = await revertPaymentXhr(appId, userId, id);
      dispatch(revertPaymentSuccess(rewardStats));
      if (options && options.onSuccess) options.onSuccess();
    } catch (error) {
      console.error('error.response\n', error.response);
      dispatch(revertPaymentError((error.response && error.response.data) || null));
      if (options && options.onError) options.onError();
    }
  };

export const fetchVirtualWalletDispatcher = (appId: string, userId: string) =>
  async (dispatch: any) => {  // todo set type of dispatch in this and similar places
    if (!appId || !userId) {
      console.warn('fetchVirtualWalletDispatcher: appId and userId are required');
      return;
    }
    try {
      dispatch(virtualWalletStart({ appId, userId}));
      const virtualWallet = await fetchVirtualWalletXhr(appId, userId);
      dispatch(virtualWalletSuccess(virtualWallet));
    } catch (error) {
      console.error('error.response\n', error.response);
      dispatch(virtualWalletError((error.response && error.response.data) || null));
    }
  };


export const userApiDispatchers = {
  // todo move other dispatcher exports in this file to this object
  deleteUser: (
    userId: string,
    onSuccess?: () => void,
    onError?: () => void,
  ) =>
    async (dispatch: AppDispatch) => {
      if (!userId) {
        console.warn('deleteUser: userId are required');
        return;
      }
      try {
        dispatch(deleteUserStart({ userId }));
        await userApi.deleteUser(userId);
        dispatch(deleteUserSuccess(null));
        if (onSuccess) onSuccess();
      } catch (error) {
        console.error('deleteUser error.response\n', error.response);
        dispatch(deleteUserError((error.response && error.response.data) || null));
        if (onError) onError();
      }
    }
  ,
  resetProfilePic: (
    userId: string,
    onSuccess?: () => void,
    onError?: () => void,
  ) =>
    async (dispatch: AppDispatch) => {
      if (!userId) {
        console.warn('resetProfilePic: userId is required');
        return;
      }
      try {
        dispatch(resetProfilePicStart({ userId }));
        await userApi.resetProfilePic(userId);
        dispatch(resetProfilePicSuccess(null));
        if (onSuccess) onSuccess();
      } catch (error) {
        console.error('deleteUser error.response\n', error.response);
        dispatch(resetProfilePicError((error.response && error.response.data) || null));
        if (onError) onError();
      }
    }
  ,
};

export const fetchUserModerationFormDispatcher = (payload: TUserModerationRequest) =>
  async (dispatch: any) => {
    if (!payload.userId && !payload.appId) {
      console.warn('fetchUserModerationFormDispatcher: userId and appId are required');
      return;
    }
    try {
      await submitUserModerationFormDataXhr(payload);
    } catch (error) {
      console.error('error.response\n', error.response);
    }
};

export const fetchRevokeBanDispatcher = (banIdToBeRevoked: number) =>
  async (dispatch: any) => {
    try {
      await revokeBanXhr(banIdToBeRevoked);
    } catch (error) {
      console.error('error.response\n', error.response);
    }
};

export const fetchUserTrueSkillDispatcher = (userId: string, appId: string) =>
  async (dispatch: any) => {
    if (!appId || !userId) {
      console.warn('fetchUserTrueSkillDispatcher: appId and userId are required');
      return;
    }
    try {
      dispatch(fetchUserTrueSkillStart({ appId, userId}));
      const responseData = await fetchUserTrueSkillXhr(userId, appId);
      dispatch(fetchUserTrueSkillSuccess(responseData));
    } catch (error) {
      console.error('error.response\n', error.response);
      dispatch(fetchUserTrueSkillError((error.response && error.response.data) || null));
    }
};

// todo
// 1. there are some redundant exports
//    it will populate autocomplete dropdown with unnecessary options
// 2. some actions are too granular e.g. updateDisplayNameSetFirstName
export const {
  searchByCriteriaStart, searchByCriteriaSuccess, searchByCriteriaError,
  fetchWalletLedgerStart, fetchWalletLedgerSuccess, fetchWalletLedgerError,
  fetchVirtualWalletLedgerStart, fetchVirtualWalletLedgerSuccess, fetchVirtualWalletLedgerError,
  creditVirtualCurrencyStart, creditVirtualCurrencySuccess, creditVirtualCurrencyError,
  creditVirtualCurrencySetError, creditVirtualCurrencySetLoading, creditVirtualCurrencySetShowDialog,
  creditVirtualCurrencySetSelectedCurrency, creditVirtualCurrencySetSelectedKeyCount,
  updateUserNameStart, updateUserNameSuccess, updateUserNameError,
  updateUserNameSetError, updateUserNameSetLoading, updateUserNameSetShowDialog,
  updateUserNameSetUserName,
  updateUserIdStart, updateUserIdSuccess, updateUserIdError,
  updateUserIdSetError, updateUserIdSetLoading, updateUserIdSetNewUserId, updateUserIdSetShowDialog,
  updateUserRoleStart, updateUserRoleSuccess, updateUserRoleError,
  updateUserRoleSetError, updateUserRoleSetLoading, updateUserRoleSetNewUserRole,
  updateUserRoleSetShowDialog,
  updateDisplayNameStart, updateDisplayNameSuccess, updateDisplayNameError,
  updateDisplayNameSetError, updateDisplayNameSetLoading, updateDisplayNameSetShowDialog,
  updateDisplayNameSetFirstName, updateDisplayNameSetLastName,
  markAmountPendingFromWinningStart, markAmountPendingFromWinningSuccess, markAmountPendingFromWinningError, markAmountPendingFromWinningSetError,
  markPendingAsPaidStart, markPendingAsPaidSuccess, markPendingAsPaidError, markPendingAsPaidSetError,
  fetchWalletRewardStatsStart, fetchWalletRewardStatsSuccess, fetchWalletRewardStatsError,
  revertPaymentStart, revertPaymentSuccess, revertPaymentError, revertPaymentSetError,
  virtualWalletStart, virtualWalletSuccess, virtualWalletError, virtualWalletSetError,
  deleteUserStart, deleteUserSuccess, deleteUserError, setDeleteUserSlice,
  fetchUserWalletTotalAmountsStart, fetchUserWalletTotalAmountsSuccess, fetchUserWalletTotalAmountsError,
  fetchUserTrueSkillStart, fetchUserTrueSkillSuccess, fetchUserTrueSkillError,
  resetProfilePicStart, resetProfilePicSuccess, resetProfilePicError,
} = userSlice.actions;

export default userSlice.reducer;

import axios from "axios";
import { getJrDomain } from "../../common/utils";
import { ECost } from "../../types/eventTypes";
import { TUserModerationRequest } from "../../types/gameConfigTypes";
import { TRewardStats, TUserResponse, TUserTrueSkill, TUserWalletTotalAmounts, TVirtualWallet, TVirtualWalletLedger, TWalletLedger } from "./userTypes";

export const userSearchByCriteriaXhr = async (
  appId: string,
  searchCriteria: string,
  searchTerm: string
): Promise<TUserResponse> => {
  const { data } = await axios.get(
    `${getJrDomain()}user-management/admin-api/apps/${encodeURI(appId)}/users/${encodeURI(searchCriteria)}/${encodeURI(searchTerm)}`,
    { withCredentials: true }
  );
  return data;
};

export const fetchVirtualWalletLedgerXhr = async (appId: string, userId: string): Promise<TVirtualWalletLedger[]> => {
  const { data } = await axios.get(
    `${getJrDomain()}wallet/admin-api/apps/${appId}/users/${userId}/virtualWalletLedgerForAdmin`,
    { withCredentials: true }
  );
  return data;
}

export const fetchWalletLedgerXhr = async (appId: string, userId: string): Promise<TWalletLedger[]> => {
  const { data } = await axios.get(
    `${getJrDomain()}wallet/admin-api/apps/${appId}/users/${userId}/walletLedger?pn=0&ps=10000`,
    { withCredentials: true }
  );
  return data;
}

export type creditVirtualCurrencPayload = {
  resource: ECost;
  count: number;
};

export const creditVirtualCurrencyToUserXhr = async (
  appId: string,
  userId: string,
  payload: creditVirtualCurrencPayload
): Promise<any> => {
  const { data } = await axios.post(
    `${getJrDomain()}wallet/admin-api/apps/${appId}/users/${userId}/creditVirtualCurrency`,
    payload,
    { withCredentials: true }
  );
  return data;
};

export const udpateUserNameXhr = async (
  userId: string,
  userName: string,
): Promise<any> => {
  const { data } = await axios.post(
    `${getJrDomain()}user-management/admin-api/users/${userId}/updateUserName`,
    { userName },
    { withCredentials: true }
  );
  return data;
};

// todo
export const udpateUserIdXhr = async (
  userId: string,
  newUserId: string,
): Promise<any> => {
  const { data } = await axios.post(
    `${getJrDomain()}user-management/admin-api/users/${userId}/updateUserId/todo`,
    { userId: newUserId },
    { withCredentials: true }
  );
  return data;
};

export const udpateUserRoleXhr = async (
  userId: string,
  newUserRole: string,
): Promise<any> => {
  const { data } = await axios.post(
    `${getJrDomain()}user-management/admin-api/users/${userId}/updateUserRole`,
    { role: newUserRole },
    { withCredentials: true }
  );
  return data;
};

export const udpateDisplayNameXhr = async (
  userId: string,
  firstName: string,
  lastName: string,
): Promise<any> => {
  const { data } = await axios.post(
    `${getJrDomain()}user-management/admin-api/users/${userId}/updateDisplayName`,
    { firstName, lastName },
    { withCredentials: true }
  );
  return data;
};

export const markAmountPendingFromWinningXhr = async (appId: string, userId: string, amount: number): Promise<any> => {
  const { data } = await axios.post(
    `${getJrDomain()}wallet/admin-api/apps/${appId}/user/${userId}/prepareForWithDraw/${amount}`,
    null,
    { withCredentials: true }
  );
  return data;
}

export const markPendingAsPaidXhr = async (appId: string, userId: string): Promise<any> => {
  const { data } = await axios.post(
    `${getJrDomain()}wallet/admin-api/apps/${appId}/user/${userId}/markWithdrawalPaid`,
    null,
    { withCredentials: true }
  );
  return data;
}

export const fetchWalletRewardStatsXhr = async (appId: string, userId: string): Promise<TRewardStats> => {
  const { data } = await axios.get(
    `${getJrDomain()}wallet/admin-api/apps/${appId}/user/${userId}/rewardStats`,
    { withCredentials: true }
  );
  return data;
}

export const revertPaymentXhr = async (appId: string, userId: string, id: number): Promise<TRewardStats> => {
  const { data } = await axios.post(
    `${getJrDomain()}wallet/admin-api/apps/${appId}/user/${userId}/revert/${id}`,
    null,
    { withCredentials: true }
  );
  return data;
}

export const fetchVirtualWalletXhr = async (appId: string, userId: string): Promise<TVirtualWallet> => {
  const { data } = await axios.get(
    `${getJrDomain()}wallet/admin-api/apps/${appId}/user/${userId}/virtualWalletDetails`,
    { withCredentials: true }
  );
  return data;
}

export const userApi = {
  // todo move other API exports in this file to this object
  deleteUser: async (userId: string): Promise<any> => {
    const { data } = await axios.delete(
      `${getJrDomain()}user-management/admin-api/users/${userId}`,
      { withCredentials: true }
    );
    return data;
  },

  resetProfilePic: async (userId: string): Promise<any> => {
    const { data } = await axios.post(
      `${getJrDomain()}user-management/admin-api/users/${userId}/resetProfilePic`,
      { withCredentials: true }
    );
    return data;
  },
};

export const fetchUserWalletTotalAmountsXhr = async (userId: string): Promise<TUserWalletTotalAmounts> => {
  const { data } = await axios.get(
    `${getJrDomain()}wallet/admin-api/${userId}/totalDepositBonusWinningsAmt`,
    { withCredentials: true }
  );
  return data;
}

export const submitUserModerationFormDataXhr = async (payload: TUserModerationRequest): Promise<string> => {
  const { data } = await axios.post(
    `${getJrDomain()}user-management/admin-api/users/${payload.userId}/addUserModeration`, 
    payload, 
    { withCredentials: true }
  );
  return data;
}

export const revokeBanXhr = async (banIdToBeRevoked: number): Promise<string> => {
  const { data } = await axios.post(
    `${getJrDomain()}user-management/admin-api/users/${banIdToBeRevoked}/revokeBan`, 
    null,
    { withCredentials: true }
  );
  return data;
}

export const fetchUserTrueSkillXhr = async (userId: string, appId: string): Promise<TUserTrueSkill[]> => {
  const { data } = await axios.get(
    `${getJrDomain()}games/admin-api/apps/${appId}/user/${userId}/trueSkill`,
    { withCredentials: true }
  );
  return data;
}
import Axios from "axios";
import { getJrDomain } from "../../common/utils";
import { TGameConfigPayload, TUserModerationResponse } from "../../types/gameConfigTypes";

export async function createOrEditGameConfigXhr(appId: string, payload: TGameConfigPayload[]) {
  const { data } = await Axios.post(
    `${getJrDomain()}game-content/admin-api/apps/${appId}/gameData/saveAsDraft`,
    payload,
    { withCredentials: true } // todo move this to interceptor
  );
  return data;
}

export async function upgradeFromDraftToLiveXhr(appId: string, gameId: string) {
  const { data } = await Axios.post(
    `${getJrDomain()}game-content/admin-api/apps/${appId}/gameId/${gameId}/upgradeFromDraftToLive`,
    null,
    { withCredentials: true } // todo move this to interceptor
  );
  return data;
}

export async function upgradeFromTestToLiveXhr(appId: string, gameId: string) {
  const { data } = await Axios.post(
    `${getJrDomain()}game-content/admin-api/apps/${appId}/gameId/${gameId}/upgradeFromPreviewToLive`,
    null,
    { withCredentials: true } // todo move this to interceptor
  );
  return data;
}

export async function upgradeToPreviewLiveXhr(appId: string, gameId: string) {
  const { data } = await Axios.post(
    `${getJrDomain()}game-content/admin-api/apps/${appId}/gameId/${gameId}/upgradeToPreviewLive`,
    null,
    { withCredentials: true } // todo move this to interceptor
  );
  return data;
}

export async function revertFromLastLiveXhr(appId: string, gameId: string) {
  const { data } = await Axios.post(
    `${getJrDomain()}game-content/admin-api/apps/${appId}/gameId/${gameId}/revertFromLastLive`,
    null,
    { withCredentials: true } // todo move this to interceptor
  );
  return data;
}

export async function deleteGameXhr(appId: string, gameId: string) {
  const { data } = await Axios.delete(
    `${getJrDomain()}game-content/admin-api/apps/${appId}/gameId/${gameId}`,
    { withCredentials: true } // todo move this to interceptor
  );
  return data;
}

export type TVirtualCurrencyDetails = {
  currencyName: string;
  initialAmount: number;
  currencyBiName: string;
  displayName: string;
};

export type TApp = {
  id: number;
  biAppId: string;
  displayName: string;
  orgName: string;
  appGroup: string;
  appName: string;
  appId: string;
  crypto: boolean;
  serverParams: {
    appParamUrl: string;
    'virtual.currency': TVirtualCurrencyDetails[];
    realCryptoCurrency: string[];
  }
}

export async function getAppsListXhr(companyId: number):Promise<TApp[]> {
  if (isNaN(companyId) || companyId + '' === 'NaN') {
    console.warn('ignoring apps call as companyId is NaN');
    return [];
  }
  const { data } = await Axios.get(
    `${getJrDomain()}unclassified/admin-api/apps?companyId=${companyId}`,
    { withCredentials: true } // todo move this to interceptor
  );
  return data;
}

export async function getGameDataXhr(appId: string): Promise<TGameConfigPayload[]> {
  const { data } = await Axios.get(
    `${getJrDomain()}game-content/admin-api/apps/${appId}/gameData`,
    { withCredentials: true } // todo move this to interceptor
  );
  return data;
}

export const fetchUserModerationXhr = async (appId: string, userId: string): Promise<TUserModerationResponse> => {
  const { data } = await Axios.get(
    `${getJrDomain()}user-management/admin-api/apps/${appId}/users/${userId}/userModerationData`,
    { withCredentials: true }
  );
  return data;
}

export const fetchAllUserModerationXhr = async (userId: string): Promise<TUserModerationResponse> => {
  const { data } = await Axios.get(
    `${getJrDomain()}user-management/admin-api/users/${userId}/userActiveModerationData`,
    { withCredentials: true }
  );
  return data;
}

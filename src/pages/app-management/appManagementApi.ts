import axios from "axios";
import { getJrDomain } from "../../common/utils";
import { TAppDetails, TAppDetailsRequest, TAppSummary, TDailyCheckinRewardSet, TFileUploadResponse, TLevelReward, TUserXpInfo } from "./appManagementTypes";

export const appManagementApi = {

  getListOfApps: async (): Promise<TAppSummary[]> => {
    const { data } = await axios.get(
      `${getJrDomain()}unclassified/admin-api/apps`,
      { withCredentials: true } // todo move this to interceptor
    );
    return data;
  },

  getAppDetails: async (
    appId: string
  ): Promise<TAppDetails> => {
    const { data } = await axios.get(
      `${getJrDomain()}unclassified/admin-api/apps/${appId}`,
      { withCredentials: true } // todo move this to interceptor
    );
    return data;
  },

  updateAppDetails: async (
    payload: TAppDetailsRequest
  ): Promise<TAppDetails> => {
    const { data } = await axios.post(
      `${getJrDomain()}unclassified/admin-api/apps`,
      payload,
      { withCredentials: true } // todo move this to interceptor
    );
    return data;
  },

  getUserSkillInfo: async (
    appId: string
  ): Promise<TUserXpInfo> => {
    const { data } = await axios.get(
      `${getJrDomain()}xp/admin-api/apps/${appId}/userXpInfo`,
      { withCredentials: true } // todo move this to interceptor
    );
    return data;
  },

  getLevelRewards: async (
    appId: string
  ): Promise<TLevelReward[]> => {
    const { data } = await axios.get(
      `${getJrDomain()}wallet/admin-api/apps/${appId}/levelRewards`,
      { withCredentials: true } // todo move this to interceptor
    );
    return data;
  },

  createLevelReward: async (
    appId: string,
    levelReward: TLevelReward
  ): Promise<TLevelReward> => {
    const { data } = await axios.post(
      `${getJrDomain()}wallet/admin-api/apps/${appId}/levelRewards`,
      levelReward,
      { withCredentials: true } // todo move this to interceptor
    );
    return data;
  },

  updateLevelReward: async (
    appId: string,
    levelReward: TLevelReward
  ): Promise<TLevelReward> => {
    const { data } = await axios.put(
      `${getJrDomain()}wallet/admin-api/apps/${appId}/levelRewards/${levelReward.id}`,
      levelReward,
      { withCredentials: true } // todo move this to interceptor
    );
    return data;
  },

  deleteLevelReward: async (
    appId: string,
    levelRewardId: number
  ): Promise<TLevelReward> => {
    const { data } = await axios.delete(
      `${getJrDomain()}wallet/admin-api/apps/${appId}/levelRewards/${levelRewardId}`,
      { withCredentials: true } // todo move this to interceptor
    );
    return data;
  },

  deleteAllLevelRewardsForALevel: async (
    appId: string,
    levelNumber: string
  ): Promise<TLevelReward> => {
    const { data } = await axios.delete(
      `${getJrDomain()}wallet/admin-api/apps/${appId}/level/${levelNumber}`,
      { withCredentials: true } // todo move this to interceptor
    );
    return data;
  },

  uploadFile: async (
    payload: FormData
  ): Promise<TFileUploadResponse> => {
    const { data } = await axios.post(
      `${getJrDomain()}unclassified/admin-api/apps/upload`,
      payload,
      { withCredentials: true } // todo move this to interceptor
    );
    return data;
  },

  getDailyCheckinRewardsXHR: async (
    appId: string
  ): Promise<TDailyCheckinRewardSet[]> => {
    const { data } = await axios.get(
      `${getJrDomain()}wallet/admin-api/apps/${appId}/rewardSets/all`,
      { withCredentials: true }
    );
    for(var i = 0; i < data.length; i++){
      data[i].index = i;
    }
    return data;
  },

  updateDailyCheckinRewardXHR: async (
    appId: string,
    set: TDailyCheckinRewardSet
  ): Promise<TDailyCheckinRewardSet> => {
    const { data } = await axios.put(
      `${getJrDomain()}wallet/admin-api/apps/${appId}/rewardSets`,
      set,
      { withCredentials: true }
    );
    return data;
  },

  createDailyCheckinRewardXHR: async (
    appId: string,
    set: TDailyCheckinRewardSet
  ): Promise<TDailyCheckinRewardSet> => {
    const { data } = await axios.post(
      `${getJrDomain()}wallet/admin-api/apps/${appId}/rewardSets`,
      set,
      { withCredentials: true }
    );
    return data;
  },

  deleteDailyCheckinRewardXHR: async (
    appId: string,
    setNumber: number
  ): Promise<TDailyCheckinRewardSet> => {
    const { data } = await axios.delete(
      `${getJrDomain()}wallet/admin-api/apps/${appId}/rewardSets/${setNumber}`,
      { withCredentials: true }
    );
    return data;
  },

};

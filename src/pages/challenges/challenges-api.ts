import axios from "axios";
import { getJrDomain } from "../../common/utils";
import { EChallengeTask, EChallengeTournamentType, TChallenge } from "./challenges-types";

const sanitiseForEdit = (challenge: TChallenge): any => {
  const copy = { ...challenge } as any;
  // delete ids for all rewardsDashboard items
  challenge.rewardsDashboard.forEach((reward, rewardIndex) => {
    delete copy.rewardsDashboard[rewardIndex].id;
  });
  return copy;
};

const sanitiseForCreate = (challenge: TChallenge): any => {
  const copy = sanitiseForEdit(challenge);
  delete copy.id;
  delete copy.seasonChallengeStatus;
  challenge.dailyChallengeList.forEach((reward, rewardIndex) => {
    reward.forEach((cd, cdI) => {
      if (challenge.dailyChallengeList[rewardIndex][cdI].challengeKey.challengeTask !== EChallengeTask.secondaryScore) {
        delete copy.dailyChallengeList[rewardIndex][cdI].challengeKey.secondaryScoreIndex;
      }
      if (challenge.dailyChallengeList[rewardIndex][cdI].challengeKey.tournamentType !== EChallengeTournamentType.all) {
        delete copy.dailyChallengeList[rewardIndex][cdI].challengeKey.tournamentNameId;
      }
      delete copy.dailyChallengeList[rewardIndex][cdI].dailyChallengeId;
    });
  });
  challenge.seasonChallengeList.forEach((reward, rewardIndex) => {
    if (challenge.seasonChallengeList[rewardIndex].challengeKey.challengeTask !== EChallengeTask.secondaryScore) {
      delete copy.seasonChallengeList[rewardIndex].challengeKey.secondaryScoreIndex;
    }
    if (challenge.seasonChallengeList[rewardIndex].challengeKey.tournamentType !== EChallengeTournamentType.all) {
      delete copy.seasonChallengeList[rewardIndex].challengeKey.tournamentNameId;
    }
    delete copy.seasonChallengeList[rewardIndex].dailyChallengeId;
  });
  return copy;
};

export const ChallengesApi = {
  getChallenges: async(appId: string): Promise<TChallenge[]> => {
    const { data } = await axios.get(
      `${getJrDomain()}gamechallenge/admin-api/apps/${appId}/getChallenges`,
      { withCredentials: true },
    );
    return data;
  },

  createChallenge: async(appId: string, payload: TChallenge): Promise<TChallenge> => {
    const { data } = await axios.post(
      `${getJrDomain()}gamechallenge/admin-api/apps/${appId}/createChallenges`,
      sanitiseForCreate(payload),
      { withCredentials: true },
    );
    return data;
  },

  updateChallenge: async(appId: string, payload: TChallenge): Promise<TChallenge> => {
    const { data } = await axios.put(
      `${getJrDomain()}gamechallenge/admin-api/apps/${appId}/challenges/${payload.id}`,
      sanitiseForEdit(payload),
      { withCredentials: true },
    );
    return data;
  },

  deleteChallenge: async(appId: string, id: number): Promise<TChallenge> => {
    const { data } = await axios.delete(
      `${getJrDomain()}gamechallenge/admin-api/apps/${appId}/challenges/${id}`,
      { withCredentials: true },
    );
    return data;
  },
};

import { TValidationResonse } from "../../common/common-types";
import { ECost, ECurrency } from "../../types/eventTypes";
import { TFormFieldBoolean, TFormFieldNumber } from "../../types/formFields";
import { TVirtualCurrencyDetails } from "../game-config/gameConfigApi";
import { challengeDefaults } from "./challenges-slice";
import {
  EChallengeCashFlag,
  EChallengeDailyRewardType,
  EChallengeGiftBox,
  EChallengeTask,
  EChallengeTournamentType,
  EChallengeType,
  TChallenge,
  TChallengeDetails,
  TChallengeDetailsFields,
  TChallengeForm,
  TChallengeMilestoneRewards,
  TChallengeMilestoneRewardsFields,
  TChallengeReward,
  TChallengeRewardFields
} from "./challenges-types";

const numberField: TFormFieldNumber = { value: 0, error: '', required: true };
const booleanField: TFormFieldBoolean = { value: false, error: '', required: true };

const toChallengeDetailsFields = (
  challenges: TChallengeDetails[],
  defaultCurrency: string,
  supportedCurrencies?: TVirtualCurrencyDetails[]
): TChallengeDetailsFields[] => {
  const tempListOuter: TChallengeDetailsFields[] = [];
  challenges.forEach(list => {
    const field: TChallengeDetailsFields = {
      id: { value: list.id || 0, error: '', required: true },
      challengeType: { value: list.challengeType as EChallengeType, error: '', required: true },
      challengeName: { value: list.challengeName, error: '', required: true },
      challengeDescription: { value: list.challengeDescription, error: '', required: true },
      challengeKey: {
        challengeTask: { value: list.challengeKey.challengeTask as EChallengeTask, error: '', required: true },
        cashFlag: { value: list.challengeKey.cashFlag as EChallengeCashFlag, error: '', required: true },
        tournamentNameId: list.challengeKey.tournamentNameId !== null ? { value: list.challengeKey.tournamentNameId, error: '', required: true } : null,
        secondaryScoreIndex: list.challengeKey.secondaryScoreIndex !== null ? { value: list.challengeKey.secondaryScoreIndex, error: '', required: true } : null,
        tournamentType: { value: list.challengeKey.tournamentType as EChallengeTournamentType, error: '', required: true },
      },
      heroChallenge: { value: list.heroChallenge, error: '', required: true },
      dailyChallengeId: list.dailyChallengeId !== null ? { value: list.dailyChallengeId, error: '', required: true } : null,
      challengeLevelsList: list.challengeLevelsList.map(cll => {
        return {
          id: { value: cll.id || 0, error: '', required: true },
          parameter: { value: cll.parameter, error: '', required: true },
          giftbox: { value: cll.giftbox, error: '', required: true },
          rewardsList: toRewardsListFields(cll.rewardsList, defaultCurrency, supportedCurrencies),
        }
      }),
    };
    if (list.challengeKey.hasOwnProperty('gameModeOnly')) {
      field.challengeKey.gameModeOnly = { value: Boolean(list.challengeKey.gameModeOnly), error: '', required: true };
    } else {
      field.challengeKey.gameModeOnly = { value: false, error: '', required: true };
    }
    if (list.challengeRedirection) {
      field.challengeRedirection = { value: list.challengeRedirection, error: '', required: true };
    }
    const { heroChallengeData } = list;
    if (heroChallengeData) {
      field.heroChallengeData = {
        heroChallengeTitle: { value: heroChallengeData.heroChallengeTitle || '', error: '', required: true },
        heroChallengeDescription: { value: heroChallengeData.heroChallengeDescription || '', error: '', required: true },
        heroChallengeColumnName: { value: heroChallengeData.heroChallengeColumnName || '', error: '', required: true },
      };
    }
    if (list.heroChallenge && !heroChallengeData) {
      field.heroChallengeData = challengeDefaults(defaultCurrency).challengeDetails.heroChallengeData ?
        challengeDefaults(defaultCurrency).challengeDetails.heroChallengeData :
        undefined;;
    }
    tempListOuter.push(field);
  });
  return tempListOuter;
};

const toChallengeDetailsPayload = (
  challenges: TChallengeDetailsFields[],
  isCloning = false,
  defaultVCurrency: string
): TChallengeDetails[] => {
  const tempListOuter: TChallengeDetails[] = [];
  challenges.forEach(list => {
    const details: TChallengeDetails = {
      challengeType: list.challengeType.value,
      challengeName: list.challengeName.value,
      challengeDescription: list.challengeDescription.value,
      challengeKey: {
        challengeTask: list.challengeKey.challengeTask.value,
        cashFlag: list.challengeKey.cashFlag.value,
        tournamentNameId: list.challengeKey.tournamentNameId !== null ?
          parseInt(list.challengeKey.tournamentNameId.value + '') :
          null,
        secondaryScoreIndex: list.challengeKey.secondaryScoreIndex !== null ?
          parseInt(list.challengeKey.secondaryScoreIndex.value + '') :
          null,
        tournamentType: list.challengeKey.tournamentType.value,
      },
      heroChallenge: list.heroChallenge.value,
      dailyChallengeId: list.dailyChallengeId !== null ? list.dailyChallengeId.value : null,
      challengeLevelsList: list.challengeLevelsList.map(cll => {
        const newCll: any = {
          parameter: cll.parameter.value,
          giftbox: cll.giftbox.value,
          rewardsList: toRewardsListPayload(cll.rewardsList, defaultVCurrency),
        };
        if (!isCloning) {
          newCll.id = +cll.id.value;
        }
        return newCll;
      }),
    };
    if (list.challengeKey.hasOwnProperty('gameModeOnly')) {
      details.challengeKey.gameModeOnly = Boolean(list.challengeKey.gameModeOnly?.value);
    }
    if (!isCloning) {
      details.id = list.id.value;
    }
    if (list.challengeRedirection) {
      details.challengeRedirection = list.challengeRedirection.value;
    }
    const { heroChallengeData } = list;
    if (heroChallengeData) {
      details.heroChallengeData = {
        heroChallengeTitle: heroChallengeData.heroChallengeTitle.value,
        heroChallengeDescription: heroChallengeData.heroChallengeDescription.value,
        heroChallengeColumnName: heroChallengeData.heroChallengeColumnName.value,
      }
    };
    tempListOuter.push(details);
  });
  console.info(isCloning, tempListOuter);
  return tempListOuter;
};

const toRewardsListFields = (
  rewards: TChallengeReward[],
  defaultCurrency: string,
  supportedCurrencies?: TVirtualCurrencyDetails[]
): TChallengeRewardFields[] => {
  const rewardFields: TChallengeRewardFields[] = [];
  rewards.forEach(rew => {
    rewardFields.push({
      amount: { value: rew.amount as number, error: '', required: true },
      dailyRewardType: { value: rew.dailyRewardType as EChallengeDailyRewardType, error: '', required: true },
      currencyCode: { value: rew.currencyCode as ECurrency, error: '', required: true },
      // currencyType: { value: (rew.dailyRewardType === EChallengeDailyRewardType.AbsoluteXP || rew.dailyRewardType === EChallengeDailyRewardType.XPMultiplier ) ? ECost.EMPTY : rew.currencyType as ECost, error: '', required: true },
      currencyType: {
        value: supportedCurrencies && supportedCurrencies.find(curr => curr.currencyName === rew.currencyType) ? rew.currencyType as ECost : defaultCurrency,
        error: '',
        required: true
      },
      duration: { value: rew.duration as number, error: '', required: true },
    });
  });
  return rewardFields;
};

const toRewardsListPayload = (
  rewards: TChallengeRewardFields[],
  defaultVCurrency: string
): TChallengeReward[] => {
  const rewardFields: TChallengeReward[] = [];
  rewards.forEach(rew => {
    rewardFields.push({
      amount: +rew.amount.value,
      dailyRewardType: rew.dailyRewardType.value,
      currencyCode: rew.currencyCode.value,
      currencyType: rew.dailyRewardType.value === EChallengeDailyRewardType.VirtualCurrency || rew.dailyRewardType.value === EChallengeDailyRewardType.VirtualCurrencyMultiplier ?
        rew.currencyType.value : defaultVCurrency,
      duration: +rew.duration.value,
    });
  });
  return rewardFields;
};

export const toChallengeForm = (
  challenge: TChallenge,
  defaultCurrency: string,
  supportedCurrencies?: TVirtualCurrencyDetails[]
): TChallengeForm => {
  let form: TChallengeForm = {
    id: { ...numberField, value: challenge.id },
    seasonChallengeName: { ...numberField, value: challenge.seasonChallengeName },
    startAt: { ...numberField, value: challenge.startAt },
    duration: { ...numberField, value: challenge.duration },
    extraTimeBeforeStart: { ...numberField, value: challenge.extraTimeBeforeStart },
    extraTimeAfterEnd: { ...numberField, value: challenge.extraTimeAfterEnd },
    rewardsCollectionBuffer: { ...numberField, value: challenge.rewardsCollectionBuffer },
    appId: { ...numberField, value: challenge.appId },
    currency: { ...numberField, value: challenge.currency },
    seasonChallengeStatus: challenge.seasonChallengeStatus ? { ...numberField, value: challenge.seasonChallengeStatus } : null,
    dailyChallengeList: [],
    seasonChallengeList: [],
    rewardsDashboard: [],
    nextStartAt: { ...numberField, value: challenge.nextStartAt },
    ticketExpiryBuffer: { ...numberField, value: challenge.ticketExpiryBuffer },
    enableTicketExpiry: { ...booleanField, value: challenge.enableTicketExpiry },
    seasonChallengeType: { ...numberField, value: challenge.seasonChallengeType },
  };
  const { seasonCardDataList } = challenge;
  if (seasonCardDataList) {
    form.seasonCardDataList = seasonCardDataList.map(scd => {
      return {
        seasonCardType: { ...numberField, value: scd.seasonCardType },
        title: { ...numberField, value: scd.title },
        description: { ...numberField, value: scd.description },
      };
    });
  }

  const tempListOuter: TChallengeDetailsFields[][] = [];
  challenge.dailyChallengeList.forEach(list => {
    tempListOuter.push(toChallengeDetailsFields(list, defaultCurrency, supportedCurrencies));
  });
  form.dailyChallengeList = tempListOuter;

  challenge.dailyChallengeList.forEach((list, setIndex) => {
    list.forEach((c, challIndex) => {
      c.challengeLevelsList.forEach((chall, challLevelIndex) => {
        form.dailyChallengeList[setIndex][challIndex].challengeLevelsList[challLevelIndex].rewardsList =
          toRewardsListFields(chall.rewardsList, defaultCurrency, supportedCurrencies);
      });
    });
  });

  form.seasonChallengeList = toChallengeDetailsFields(challenge.seasonChallengeList, defaultCurrency, supportedCurrencies);

  const tempRewardsDash: TChallengeMilestoneRewardsFields[] = [];
  challenge.rewardsDashboard.forEach(reward => {
    tempRewardsDash.push({
      giftbox: { value: reward.giftbox as EChallengeGiftBox, error: '', required: true },
      milestone: { value: reward.milestone as number, error: '', required: true },
      id: { value: reward.id as number, error: '', required: true },
      requiredCPPoints: { value: reward.requiredCPPoints as number, error: '', required: true },
      rewardsTier: { value: reward.rewardsTier as EChallengeType, error: '', required: true },
      rewardsList: toRewardsListFields(reward.rewardsList, defaultCurrency, supportedCurrencies),
    });
  });
  form.rewardsDashboard = tempRewardsDash;

  return form;
};

export const toChallengePayload = (
  challenge: TChallengeForm,
  isCloning = false,
  defaultVCurrency: string,
): TChallenge => {
  const payload: TChallenge = {
    id: +challenge.id.value,
    seasonChallengeName: challenge.seasonChallengeName.value,
    startAt: +challenge.startAt.value - (+challenge.startAt.value % 60),
    duration: +challenge.duration.value,
    extraTimeBeforeStart: +challenge.extraTimeBeforeStart.value,
    extraTimeAfterEnd: +challenge.extraTimeAfterEnd.value,
    rewardsCollectionBuffer: +challenge.rewardsCollectionBuffer.value,
    appId: challenge.appId.value,
    currency: challenge.currency.value,
    seasonChallengeStatus: challenge.seasonChallengeStatus ? challenge.seasonChallengeStatus.value : null,
    dailyChallengeList: [],
    seasonChallengeList: [],
    rewardsDashboard: [],
    nextStartAt: +challenge.nextStartAt.value,
    ticketExpiryBuffer: challenge.ticketExpiryBuffer.value,
    enableTicketExpiry: challenge.enableTicketExpiry.value,
    seasonChallengeType: challenge.seasonChallengeType.value,
  };
  const { seasonCardDataList } = challenge;
  if (seasonCardDataList) {
    payload.seasonCardDataList = seasonCardDataList.map(scd => {
      return {
        seasonCardType: scd.seasonCardType.value,
        title: scd.title.value,
        description: scd.description.value,
      };
    });
  }

  const tempListOuter: TChallengeDetails[][] = [];
  challenge.dailyChallengeList.forEach(list => {
    tempListOuter.push(toChallengeDetailsPayload(list, isCloning, defaultVCurrency));
  });
  payload.dailyChallengeList = tempListOuter;

  challenge.dailyChallengeList.forEach((list, dailyChallengeIndex) => {
    list.forEach((c, cI) => {
      c.challengeLevelsList.forEach((chall, challI) => {
        payload.dailyChallengeList[dailyChallengeIndex][cI].challengeLevelsList[challI].rewardsList =
          toRewardsListPayload(chall.rewardsList, defaultVCurrency);
      });
    });
  });
  payload.seasonChallengeList = toChallengeDetailsPayload(challenge.seasonChallengeList, isCloning, defaultVCurrency);

  const tempRewardsDash: TChallengeMilestoneRewards[] = [];
  challenge.rewardsDashboard.forEach(reward => {
    tempRewardsDash.push({
      giftbox: reward.giftbox.value,
      milestone: reward.milestone.value,
      id: reward.id.value,
      requiredCPPoints: reward.requiredCPPoints.value,
      rewardsTier: reward.rewardsTier.value,
      rewardsList: toRewardsListPayload(reward.rewardsList, defaultVCurrency),
    });
  });
  payload.rewardsDashboard = tempRewardsDash;

  return payload;
};


const isChallengeDetailValid = (
  detail: TChallengeDetailsFields,
  allowedVirualCurrencies: undefined | TVirtualCurrencyDetails[],
  messagePrefix = '',
): TValidationResonse => {
  const errors: string[] = [];
  if (detail.challengeKey.challengeTask.value === EChallengeTask.wager && detail.challengeKey.cashFlag.value === EChallengeCashFlag.all) {
    errors.push(`${messagePrefix}Cash flag cannot be "all" for task "wager".`)
  }
  if (!detail.challengeLevelsList.length) {
    errors.push(`${messagePrefix}At least 1 level is required.`);
  }
  if (detail.challengeKey.tournamentNameId && detail.challengeKey.tournamentType.value !== EChallengeTournamentType.all) {
    errors.push(`${messagePrefix}Tournament type should be "all" if tournament name ID is provided.`);
  }
  const { challengeRedirection } = detail;
  if (challengeRedirection && !challengeRedirection.value) {
    errors.push(`${messagePrefix}Invalid value provided for challenge redirection.`);
  }
  const { heroChallengeData } = detail;
  if (detail.heroChallenge.value && !heroChallengeData) {
    errors.push(`${messagePrefix}Hero challenge data is required`);
  }
  if (detail.heroChallenge.value && heroChallengeData && !heroChallengeData.heroChallengeTitle.value) {
    // produce(detail, draft => {
    //   if (draft.heroChallengeData) {
    //     draft.heroChallengeData.heroChallengeTitle.error = 'required';
    //   }
    // });
    errors.push(`${messagePrefix}Hero challenge title is required`);
  }
  if (detail.heroChallenge.value && heroChallengeData && !heroChallengeData.heroChallengeDescription.value) {
    errors.push(`${messagePrefix}Hero challenge description is required`);
  }
  if (detail.heroChallenge.value && heroChallengeData && !heroChallengeData.heroChallengeColumnName.value) {
    errors.push(`${messagePrefix}Hero challenge column name is required`);
  }
  detail.challengeLevelsList.forEach((cl, clIndex) => {
    if (!cl.rewardsList.length) {
      errors.push(`${messagePrefix}At least 1 reward is needed in level #${clIndex}.`);
    }
    if (allowedVirualCurrencies) {
      cl.rewardsList.forEach((reward, index) => {
        if (!allowedVirualCurrencies.map(v => v.currencyName).includes(reward.currencyType.value)) {
          errors.push(`${messagePrefix}Currency type ${reward.currencyType.value} is not supported by current app for reward #${index + 1}.`);
        }
      });
    }
  });
  return { isValid: !Boolean(errors.length), errors };
};

export const isChallengesFormValid = (
  form: TChallengeForm,
  allowedVirualCurrencies: undefined | TVirtualCurrencyDetails[],
  isEditing?: boolean
): TValidationResonse => {
  let errors: string[] = [];

  if (!form.rewardsDashboard.length) {
    errors.push('At least 1 reward is required in "Rewards" section.');
  }
  if (!form.seasonChallengeList.length) {
    errors.push('At least 1 season is required.');
  }
  if (!isEditing && parseInt(form.startAt.value + '') <= parseInt((Date.now() / 1000) + '')) {
    errors.push('Start date/time should be in future.');
  }

  form.rewardsDashboard.forEach((reward, index) => {
    reward.rewardsList.forEach((reward2, index2) => {
      if (allowedVirualCurrencies && !allowedVirualCurrencies.map(v => v.currencyName).includes(reward2.currencyType.value)) {
        errors.push(`Reward ${index + 1} detail ${index2 + 1}: Invalid currencyType.`);
      }
    });
  });
  form.dailyChallengeList.forEach((set, index) => set.forEach(c => {
    const r = isChallengeDetailValid(c, allowedVirualCurrencies, `Daily Challenge Set ${index + 1}: `);
    errors = [ ...errors, ...r.errors ];
  }));
  form.seasonChallengeList.forEach((c, index) => {
    const r = isChallengeDetailValid(c, allowedVirualCurrencies, `Season Challenge ${index + 1}: `);
    errors = [ ...errors, ...r.errors ];
  });

  return { isValid: !Boolean(errors.length), errors };
}

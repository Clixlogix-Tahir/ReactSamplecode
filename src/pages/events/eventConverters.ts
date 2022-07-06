/* eslint-disable array-callback-return */
import {
  ECost, ECryptoCurrency, ECurrency, EEntryType, EEventCategory, EGroupType, ERepetitionType,
  IEventBattleForm, IEventBattlePayload, IEventNudgeForm, IEventNudgePayload, TCashProduct, TCashProductForm, TEntryFee, TEntryFeeFields,
  TEventForm,
  TEventPayload,
  TGameModeDataOptional,
  TGameModeDataOptionalFields,
  TOverridableBotConfig,
  TOverridableBotConfigFields,
  TRangedReward,
  TRangedRewardFields,
  TRepititionKeyValueMap,
  TRepititionKeyValueMapFields
} from "../../types/eventTypes";
import { TFormFieldNumber } from "../../types/formFields";
import { EBotLogics, TImageData } from "../../types/gameConfigTypes";
import { EChallengeCashFlag, EChallengeTask, EChallengeTournamentType } from "../challenges/challenges-types";
import { defaultRewardFields } from "./eventSlice";

const PLACE_HOLDER = '<<{{PLACE_HOLDER}}>>';

const liveJsonLogicWrapper = `{
	"and": [
		${PLACE_HOLDER},
		{
			"===": [
				"REGULAR",
				{
					"var": [
						"userRole"
					]
				}
			]
		}
	]
}`;

const testJsonLogicWrapper = `{
	"and": [
		${PLACE_HOLDER},
		{
			"===": [
				"PREVIEW",
				{
					"var": [
						"userRole"
					]
				}
			]
		}
	]
}`;

const onlyLiveJsonLogic = `{
  "===": [
    "REGULAR",
    {
      "var": [
        "userRole"
      ]
    }
  ]
}`;

const onlyTestJsonLogic = `{
  "===": [
    "PREVIEW",
    {
      "var": [
        "userRole"
      ]
    }
  ]
}`;

const numberField = {
  value: 0,
  error: '',
  required: true,
};

const getBaseEventPayloadFromForm = (
  form: IEventBattleForm | IEventNudgeForm,
  isLive = false,
  isAddingNew = false,
  isCloning = false,
): TEventPayload => {
  let jsonLogicFilters = form.jsonLogicFilters.value;
  if (!isCloning) {
    if (jsonLogicFilters && isAddingNew) {
      if (isLive) {
        jsonLogicFilters = liveJsonLogicWrapper.replace(PLACE_HOLDER, jsonLogicFilters);
      } else {
        jsonLogicFilters = testJsonLogicWrapper.replace(PLACE_HOLDER, jsonLogicFilters);
      }
    }
    if (!jsonLogicFilters && isAddingNew) {
      jsonLogicFilters = isLive ? onlyLiveJsonLogic : onlyTestJsonLogic;
    }
  } else {
    if (isLive) {
      jsonLogicFilters = jsonLogicFilters.replace('PREVIEW', 'REGULAR');
    } else {
      jsonLogicFilters = jsonLogicFilters.replace('REGULAR', 'PREVIEW');
    }
  }
  return {
    id: form.id.value,
    groupId: form.groupId ? form.groupId.value : null,
    description: form.description.value,
    extraTimeBeforeStart: parseInt(form.extraTimeBeforeStart.value + ''),
    extraTimeAfterEnd: parseInt(form.extraTimeAfterEnd.value + ''),
    enabledCountryCodes: form.enabledCountryCodes.value,
    jsonLogicFilters: jsonLogicFilters,
    unlockLogic: form.unlockLogic.value,
    // eventCategory: form.eventCategory.value,
    eventCategory: form.eventCategory.value === EEventCategory.TOURNAMENT ?
      EEventCategory.BATTLE :
      form.eventCategory.value,
    forceInvisible: form.forceInvisible.value,
    appId: form.appId.value,
    repetitions: form.repetitions.map(r => {
      const rkvMap: TRepititionKeyValueMap = {
        Start: parseInt((new Date(r.repetitionKeyValueMap.Start.value).getTime() / 1000) + ''),
        End: parseInt((new Date(r.repetitionKeyValueMap.End.value).getTime() / 1000) + ''),
      };
      if (r._type === ERepetitionType.INTERVAL_BASED) {
        rkvMap.Duration = r.repetitionKeyValueMap.Duration?.value;
        rkvMap.StartTimeGapInSec = r.repetitionKeyValueMap.StartTimeGapInSec?.value;
      }
      if (r._type === ERepetitionType.CALENDAR_BASED) {
        rkvMap.Duration = r.repetitionKeyValueMap.Duration?.value;
        rkvMap.DayInMonth = r.repetitionKeyValueMap.DayInMonth?.value;
        rkvMap.DayInWeek = r.repetitionKeyValueMap.DayInWeek?.value;
        rkvMap.TimeInDay = r.repetitionKeyValueMap.TimeInDay?.value;
      }
      return {
        repetitionId: r.repetitionId.value,
        repetitionKeyValueMap: rkvMap,
      };
    }),
  };
};

export const getEventPayloadFromForm = (
  form: IEventBattleForm,
  isLive = false,
  isAddingNew = false,
  isCloning = false,
): IEventBattlePayload => {
  const payload: IEventBattlePayload = {
    ...getBaseEventPayloadFromForm(form, isLive, isAddingNew, isCloning),
    additionalParams: {
      gameIdToGameDataMap: {},
      displayName: form.additionalParams.displayName.value,
      placementDataList: form.additionalParams.placementDataList.map(pdl => {
        return {
          placementLocation: pdl.placementLocation.value,
          placementPriority: pdl.placementPriority.value,
          showOnCollapse: pdl.showOnCollapse.value,
          prerequisiteJsonLogic: pdl.prerequisiteJsonLogic.value,
        };
      }),
      entryFee: null,
      virtualEntryFees: form.additionalParams.virtualEntryFees.map(vef => {
        return {
          amount: vef.amount.value,
          currencyType: vef.currencyType.value,
        };
      }),
      tier: form.additionalParams.tier.value,
      confirmationPopupTitle: form.additionalParams.confirmationPopupTitle.value,
      confirmationPopupText: form.additionalParams.confirmationPopupText.value,
      confirmationCTA: form.additionalParams.confirmationCTA.value,
      confirmationCTASubtitle: form.additionalParams.confirmationCTASubtitle.value,
      matchMakingTime: form.additionalParams.matchMakingTime.value,
      maxMatchMakingDuration: form.additionalParams.maxMatchMakingDuration.value,
      isFue: form.additionalParams.isFue.value,
      isAsyncEnabled: form.additionalParams.isAsyncEnabled.value,
      asyncBotMatchEnabled: form.additionalParams.asyncBotMatchEnabled.value,
      forcedAsyncPlayerCount: form.additionalParams.forcedAsyncPlayerCount ? form.additionalParams.forcedAsyncPlayerCount.value : null,
      forcedAsyncMinPlayerCount: form.additionalParams.forcedAsyncMinPlayerCount ? form.additionalParams.forcedAsyncMinPlayerCount.value : null,
      winScoreLogic: form.additionalParams.winScoreLogic.value,
      resultDelayDuration: form.additionalParams.resultDelayDuration.value,
      playerCountToRewardList: {},
      mltData: form.additionalParams.mltData ?
        {
          maxPlayTime: form.additionalParams.mltData.maxPlayTime.value,
          type: form.additionalParams.mltData.type.value,
        } :
        null,
      hideEndTime: form.additionalParams.hideEndTime.value,
      showOnCollapse: form.additionalParams.showOnCollapse.value,
      imageUrl: form.additionalParams.imageUrl.value,
      entryDescription: form.additionalParams.entryDescription.value,
      retakeDescription: form.additionalParams.retakeDescription.value,
      maxEntryCount: form.additionalParams.maxEntryCount.value,
      /* retakeFee: {
        amount: form.additionalParams.retakeFee.amount.value,
        currency: form.additionalParams.retakeFee.currency.value,
      },
      virtualRetakeFees: form.additionalParams.virtualRetakeFees.map(fee => {
        return {
          amount: fee.amount.value,
          currencyType: fee.currencyType.value,
        };
      }),
      realReward: {
        amount: form.additionalParams.realReward.amount.value,
        minAmountIfDynamic: form.additionalParams.realReward.minAmountIfDynamic.value,
        kiwiCutPercentage: form.additionalParams.realReward.kiwiCutPercentage.value,
        rewardBuckets: form.additionalParams.realReward.rewardBuckets.map(bucket => {
          return {
            minRank: bucket.minRank.value,
            maxRank: bucket.maxRank.value,
            totalRewardAmount: bucket.totalRewardAmount.value,
            minTotalEntry: bucket.minTotalEntry.value,
          };
        }),
      },
      virtualRewards: [], */

    },
  };

  if (form.eventCategory && form.eventCategory.value === EEventCategory.CHALLENGE_LEADERBOARD) {
    payload.additionalParams.entryFeeList = form.additionalParams.entryFeeList?.map(entryFee => {
      return {
        realAmount: {
          amount: entryFee.realAmount?.amount ? entryFee.realAmount?.amount.value : 0,
          currency: entryFee.realAmount?.currency ? entryFee.realAmount?.currency.value : ECurrency.USD,
          maxBonusCutPercentage: entryFee.realAmount?.maxBonusCutPercentage ? entryFee.realAmount?.maxBonusCutPercentage?.value : 0,
          maxWinningsCutPercentage: entryFee.realAmount?.maxWinningsCutPercentage ? entryFee.realAmount?.maxWinningsCutPercentage.value : 0,
        },
        virtualAmountList: entryFee.virtualAmountList?.map(va => {
          return {
            amount: va.amount?.value,
            currencyType: va.currencyType?.value,
          }
        }),
      }
    });
    payload.additionalParams.walletCurrency = form.additionalParams.walletCurrency?.value;
    payload.additionalParams.groupType = form.additionalParams.groupType?.value;
    payload.additionalParams.challengeName = form.additionalParams.challengeName?.value;
    payload.additionalParams.challengeDescription = form.additionalParams.challengeDescription?.value;
    payload.additionalParams.entryType = form.additionalParams.entryType?.value;
    payload.additionalParams.cdnIcon = form.additionalParams.cdnIcon?.value;
    payload.additionalParams.maxEntries = form.additionalParams.maxEntries?.value;
    payload.additionalParams.minEntries = form.additionalParams.minEntries?.value;
    payload.additionalParams.challengeKey = form.additionalParams.challengeKey ? {
      challengeTask: form.additionalParams.challengeKey.challengeTask.value,
      cashFlag: form.additionalParams.challengeKey.cashFlag.value,
      tournamentNameId: form.additionalParams.challengeKey.tournamentNameId !== null ?
        parseInt(form.additionalParams.challengeKey.tournamentNameId.value + '') :
        null,
      secondaryScoreIndex: form.additionalParams.challengeKey.secondaryScoreIndex !== null ?
        parseInt(form.additionalParams.challengeKey.secondaryScoreIndex.value + '') :
        null,
      tournamentType: form.additionalParams.challengeKey.tournamentType.value,
    } : undefined;
    payload.additionalParams.rewardList = form.additionalParams.rewardList?.map(reward => {
      const tReward: TRangedReward = {
        minRank: reward.minRank.value,
        maxRank: reward.maxRank.value,
      };
      if (reward.realReward) {
        tReward.realReward = {
          winningAmount: {
            amount: parseFloat(reward.realReward.winningAmount.amount.value + ''),
            currency: reward.realReward.winningAmount.currency.value,
          },
          bonusAmount: {
            amount: parseFloat(reward.realReward.bonusAmount.amount.value + ''),
            currency: reward.realReward.bonusAmount.currency.value,
          }
        }
      }
      if (reward.virtualRewards) {
        tReward.virtualRewards = reward.virtualRewards.map(vr => {
          return {
            amount: parseInt(vr.amount.value + ''),
            currencyType: vr.currencyType.value,
          };
        });
      }
      return tReward;
    });
  }

  const gameIdToGameDataMap: { [key: string]: TGameModeDataOptional } = {};
  Object.keys(form.additionalParams.gameIdToGameDataMap).forEach((gameId: string) => {
    gameIdToGameDataMap[gameId] = {};
    if ('displayName' in form.additionalParams.gameIdToGameDataMap[gameId]) {
      gameIdToGameDataMap[gameId].displayName = form.additionalParams.gameIdToGameDataMap[gameId].displayName?.value;
    }
    if ('imageDataList' in form.additionalParams.gameIdToGameDataMap[gameId]) {
      gameIdToGameDataMap[gameId].imageDataList = form.additionalParams.gameIdToGameDataMap[gameId].imageDataList?.map(idl => {
        return {
          type: idl.type.value,
          url: idl.url.value,
          aspectRatio: idl.aspectRatio.value,
        };
      });
    }
    if ('gameSpecificParams' in form.additionalParams.gameIdToGameDataMap[gameId]) {
      gameIdToGameDataMap[gameId].gameSpecificParams = form.additionalParams.gameIdToGameDataMap[gameId].gameSpecificParams?.value;
    }
    // gameColor: string;
    // roundCount: TFormFieldNumber;
    if ('duration' in form.additionalParams.gameIdToGameDataMap[gameId]) {
      gameIdToGameDataMap[gameId].duration = parseInt(form.additionalParams.gameIdToGameDataMap[gameId].duration?.value + '');
    }
    if ('playerCountPreferences' in form.additionalParams.gameIdToGameDataMap[gameId]) {
      gameIdToGameDataMap[gameId].playerCountPreferences = form.additionalParams.gameIdToGameDataMap[gameId].playerCountPreferences?.value
        .split(',')
        .map(p => p.trim())
        .map(p => parseInt(p));
    }
    // rulesText: string;
    // socialConfig: string;
    if ('botsEnabled' in form.additionalParams.gameIdToGameDataMap[gameId]) {
      gameIdToGameDataMap[gameId].botsEnabled = Boolean(form.additionalParams.gameIdToGameDataMap[gameId].botsEnabled?.value);
    }

    if ('roundCount' in form.additionalParams.gameIdToGameDataMap[gameId]) {
      gameIdToGameDataMap[gameId].roundCount = form.additionalParams.gameIdToGameDataMap[gameId].roundCount?.value;
    }

    if ('gameColor' in form.additionalParams.gameIdToGameDataMap[gameId]) {
      gameIdToGameDataMap[gameId].gameColor = form.additionalParams.gameIdToGameDataMap[gameId].gameColor?.value;
    }
    if ('difficultyMaxLevel' in form.additionalParams.gameIdToGameDataMap[gameId]) {
      gameIdToGameDataMap[gameId].difficultyMaxLevel = parseInt(form.additionalParams.gameIdToGameDataMap[gameId].difficultyMaxLevel?.value + '');
    }
    if ('difficultyMinLevel' in form.additionalParams.gameIdToGameDataMap[gameId]) {
      gameIdToGameDataMap[gameId].difficultyMinLevel = parseInt(form.additionalParams.gameIdToGameDataMap[gameId].difficultyMinLevel?.value + '');
    }
    if ('bannerRulesText' in form.additionalParams.gameIdToGameDataMap[gameId]) {
      gameIdToGameDataMap[gameId].bannerRulesText = JSON.parse(form.additionalParams.gameIdToGameDataMap[gameId].bannerRulesText?.value || '{}');
    }
    if ('winQualificationJson' in form.additionalParams.gameIdToGameDataMap[gameId]) {
      gameIdToGameDataMap[gameId].winQualificationJson = JSON.parse(form.additionalParams.gameIdToGameDataMap[gameId].winQualificationJson?.value || '{}');
    }
    const { botConfig } = form.additionalParams.gameIdToGameDataMap[gameId];
    if (botConfig) {
      const newConfig = {
        botLogic: botConfig.botLogic.value || EBotLogics.MULTI_PLAYER_AI,
        botsWithTrueSkills: botConfig.botsWithTrueSkills.value || false,
        botMaxLevel: parseInt(botConfig.botMaxLevel.value + '') || 1,
        botMinLevel: parseInt(botConfig.botMinLevel.value + '') || 1,
        multiPlayerBotConfig: {},
        trueSkillLevels: botConfig.trueSkillLevels.value
          .split(',')
          .map(s => s.trim())
          .map(s => parseInt(s)) ||
          1,
      } as TOverridableBotConfig;
      if (botConfig.multiPlayerBotConfig) {
        const map: { [key: number]: number } = {};
        Object.keys(form.additionalParams.gameIdToGameDataMap[gameId].botConfig?.multiPlayerBotConfig || {}).forEach((k) => {
          const value = form.additionalParams.gameIdToGameDataMap[gameId].botConfig?.multiPlayerBotConfig[parseInt(k)].value;
          map[parseInt(k)] = (value !== undefined && value !== null) ? value : -1;
        });
        newConfig.multiPlayerBotConfig = map;
      }
      gameIdToGameDataMap[gameId].botConfig = newConfig;
    }
  });
  payload.additionalParams.gameIdToGameDataMap = gameIdToGameDataMap;

  if (form.additionalParams.entryFee) {
    payload.additionalParams.entryFee = {
      amount: form.additionalParams.entryFee.amount.value,
      currency: form.additionalParams.entryFee.currency.value,
      maxBonusCutPercentage: form.additionalParams.entryFee.maxBonusCutPercentage.value,
      maxWinningsCutPercentage: form.additionalParams.entryFee.maxWinningsCutPercentage.value,
    };
  }

  if (form.additionalParams.entryFeeList) {
    const newEntries = form.additionalParams.entryFeeList.map(ef => {
      const fee: TEntryFee = {};
      if (ef.realAmount) {
        fee.realAmount = {
          amount: parseFloat(ef.realAmount.amount.value + ''),
          currency: ef.realAmount.currency.value,
          maxBonusCutPercentage: parseInt(ef.realAmount.maxBonusCutPercentage.value + ''),
          maxWinningsCutPercentage: parseInt(ef.realAmount.maxWinningsCutPercentage.value + ''),
        }
      }
      if (ef.virtualAmountList) {
        fee.virtualAmountList = ef.virtualAmountList.map(vef => {
          return {
            amount: parseInt(vef.amount.value + ''),
            currencyType: vef.currencyType.value,
          }
        });
      }
      return fee;
    });
    payload.additionalParams.entryFeeList = newEntries as TEntryFee[];
  }

  if (form.additionalParams.playerCountToRewardList) {
    const playerCountToRewardList = {} as typeof payload.additionalParams.playerCountToRewardList;
    Object.keys(form.additionalParams.playerCountToRewardList).forEach(key => {
      const items = form.additionalParams.playerCountToRewardList[key];
      playerCountToRewardList[key] = items ? items.map(item => {
        const reward: TRangedReward = {
          minRank: parseInt(item.minRank.value + ''),
          maxRank: parseInt(item.maxRank.value + ''),
        };
        if (item.realReward) {
          reward.realReward = {
            winningAmount: {
              amount: parseFloat(item.realReward.winningAmount.amount.value + ''),
              currency: item.realReward.winningAmount.currency.value,
            },
            bonusAmount: {
              amount: parseFloat(item.realReward.bonusAmount.amount.value + ''),
              currency: item.realReward.bonusAmount.currency.value,
            }
          }
        }
        if (item.virtualRewards) {
          reward.virtualRewards = item.virtualRewards.map(vr => {
            return {
              amount: parseInt(vr.amount.value + ''),
              currencyType: vr.currencyType.value,
            };
          });
        }
        return reward;
      }) : [];
    });
    payload.additionalParams.playerCountToRewardList = playerCountToRewardList;
  }

  // console.info('payload', payload);
  return payload;
};

export const getNudgePayloadFromForm = (
  form: IEventNudgeForm,
  isLive = false,
  isAddingNew = false,
  isCloning = false,
): IEventNudgePayload => {
  return {
    ...getBaseEventPayloadFromForm(form, isLive, isAddingNew, isCloning),
    additionalParams: {
      subcategory: form.additionalParams.subcategory.value,
      productIds: form.additionalParams.productIds.value,
      extraVCPercent: {}, // todo
      extraRCPercent: parseInt(form.additionalParams.extraRCPercent.value + ''),
      nudgeCountOnSessionChange: parseInt(form.additionalParams.nudgeCountOnSessionChange.value + ''),
      nudgeDisplayCount: parseInt(form.additionalParams.nudgeDisplayCount.value + ''),
      nudgeCooldownDay: parseInt(form.additionalParams.nudgeCooldownDay.value + ''),
      nudgeCooldownHours: parseInt(form.additionalParams.nudgeCooldownHours.value + ''),
      bgGradient: form.additionalParams.bgGradient.value,
      title: form.additionalParams.title.value,
      centerGraphicDimension: {
        w: parseInt(form.additionalParams.centerGraphicDimension.w.value + ''),
        h: parseInt(form.additionalParams.centerGraphicDimension.h.value + ''),
      },
      centerGraphicTexts: form.additionalParams.centerGraphicTexts.value,
    },
  };
};

const getBaseEventFormFromPayload = (payload: IEventBattlePayload | IEventNudgePayload): TEventForm => {
  return {
    _isFormValid: true,
    _isSubmittedOnce: false,
    _validationErrors: [],
    id: { value: payload.id, error: '', required: false },
    groupId: payload.groupId ? { value: payload.groupId, error: '', required: false } : null,
    description: { value: payload.description, error: '', required: false },
    extraTimeBeforeStart: { value: payload.extraTimeBeforeStart, error: '', required: false },
    extraTimeAfterEnd: { value: payload.extraTimeAfterEnd, error: '', required: false },
    enabledCountryCodes: { value: payload.enabledCountryCodes, error: '', required: false },
    jsonLogicFilters: { value: payload.jsonLogicFilters, error: '', required: false },
    unlockLogic: { value: payload.unlockLogic || '', error: '', required: false },
    eventCategory: { value: payload.eventCategory, error: '', required: false },
    forceInvisible: { value: payload.forceInvisible, error: '', required: false },
    appId: { value: payload.appId, error: '', required: false },
    repetitions: payload.repetitions.map(r => {
      const startDate = new Date(parseInt((r.repetitionKeyValueMap.Start * 1000) + '')).toJSON();
      // const startDateStr = startDate
      //   .toISOString()
      //   .substr(0, startDate.toISOString().length - 1);
      const endDate = new Date(parseInt((r.repetitionKeyValueMap.End * 1000) + '')).toJSON();
      // const endDateStr = endDate
      //   .toISOString()
      //   .substr(0, endDate.toISOString().length - 1);
      let _type = ERepetitionType.ONE_TIME;
      const rkvMap: TRepititionKeyValueMapFields = {
        Start: { value: startDate, error: '', required: false },
        End: { value: endDate, error: '', required: false },
      };
      if ('StartTimeGapInSec' in r.repetitionKeyValueMap) {
        _type = ERepetitionType.INTERVAL_BASED;
        rkvMap.Duration = { value: r.repetitionKeyValueMap.Duration || -1, error: '', required: false };
        rkvMap.StartTimeGapInSec = { value: r.repetitionKeyValueMap.StartTimeGapInSec || -1, error: '', required: false };
      } else if ('DayInMonth' in r.repetitionKeyValueMap) {
        _type = ERepetitionType.CALENDAR_BASED;
        rkvMap.Duration = { value: r.repetitionKeyValueMap.Duration || -1, error: '', required: false };
        rkvMap.DayInMonth = { value: r.repetitionKeyValueMap.DayInMonth || -1, error: '', required: false };
        rkvMap.DayInWeek = { value: r.repetitionKeyValueMap.DayInWeek || -1, error: '', required: false };
        rkvMap.MonthInYear = { value: r.repetitionKeyValueMap.MonthInYear || -1, error: '', required: false };
      }
      return {
        _type: _type,
        repetitionId: { value: r.repetitionId, error: '', required: false },
        repetitionKeyValueMap: rkvMap,
      };
    }),
  } as TEventForm;
};

export const getEventFormFromPayload = (payload: IEventBattlePayload): IEventBattleForm => {
  const eventForm: IEventBattleForm = {
    ...getBaseEventFormFromPayload(payload),
    additionalParams: {
      gameIdToGameDataMap: {},
      displayName: { value: payload.additionalParams.displayName, error: '', required: false },
      placementDataList: payload.additionalParams.placementDataList.map(pdl => {
        return {
          placementLocation: { value: pdl.placementLocation, error: '', required: false },
          placementPriority: { value: pdl.placementPriority, error: '', required: false },
          showOnCollapse: { value: pdl.showOnCollapse, error: '', required: false },
          prerequisiteJsonLogic: { value: pdl.prerequisiteJsonLogic, error: '', required: false },
        };
      }),
      entryFee: null,
      virtualEntryFees: Array.isArray(payload.additionalParams.virtualEntryFees) ? payload.additionalParams.virtualEntryFees.map(vef => {
        return {
          amount: { value: vef.amount, error: '', required: false },
          currencyType: { value: vef.currencyType as ECost, error: '', required: false }
        };
      }) : [],
      tier: { value: payload.additionalParams.tier || 0, error: '', required: false },
      confirmationPopupTitle: { value: payload.additionalParams.confirmationPopupTitle, error: '', required: false },
      confirmationPopupText: { value: payload.additionalParams.confirmationPopupText, error: '', required: false },
      confirmationCTA: { value: payload.additionalParams.confirmationCTA, error: '', required: false },
      confirmationCTASubtitle: { value: payload.additionalParams.confirmationCTASubtitle, error: '', required: false },
      matchMakingTime: { value: payload.additionalParams.matchMakingTime, error: '', required: false },
      maxMatchMakingDuration: { value: payload.additionalParams.maxMatchMakingDuration, error: '', required: false },
      isFue: { value: payload.additionalParams.isFue, error: '', required: false },
      isAsyncEnabled: { value: payload.additionalParams.isAsyncEnabled, error: '', required: false },
      asyncBotMatchEnabled: { value: payload.additionalParams.asyncBotMatchEnabled, error: '', required: false },
      forcedAsyncPlayerCount: (payload.additionalParams.forcedAsyncPlayerCount !== null && payload.additionalParams.forcedAsyncPlayerCount !== undefined) ?
        { value: payload.additionalParams.forcedAsyncPlayerCount, error: '', required: false } :
        null,
      forcedAsyncMinPlayerCount: (payload.additionalParams.forcedAsyncMinPlayerCount !== null && payload.additionalParams.forcedAsyncMinPlayerCount !== undefined) ?
        { value: payload.additionalParams.forcedAsyncMinPlayerCount, error: '', required: false } :
        null,
      winScoreLogic: { value: payload.additionalParams.winScoreLogic, error: '', required: false },
      resultDelayDuration: { value: payload.additionalParams.resultDelayDuration, error: '', required: false },
      playerCountToRewardList: {},
      mltData: payload.additionalParams.mltData ?
        {
          maxPlayTime: { value: payload.additionalParams.mltData.maxPlayTime, error: '', required: true },
          type: { value: payload.additionalParams.mltData.type, error: '', required: true },
        } :
        null,
      hideEndTime: { value: payload.additionalParams.hideEndTime, error: '', required: false },
      showOnCollapse: { value: payload.additionalParams.showOnCollapse, error: '', required: false },
      imageUrl: { value: payload.additionalParams.imageUrl, error: '', required: false },
      entryDescription: { value: payload.additionalParams.entryDescription, error: '', required: false },
      retakeDescription: { value: payload.additionalParams.retakeDescription, error: '', required: false },
      maxEntryCount: { value: payload.additionalParams.maxEntryCount, error: '', required: false },


      walletCurrency: {
        value: payload.additionalParams.walletCurrency ?
          payload.additionalParams.walletCurrency as ECurrency | ECryptoCurrency : ECurrency.USD, error: '', required: false
      },

      groupType: {
        value: payload.additionalParams.groupType ?
          payload.additionalParams.groupType as EGroupType : EGroupType.NONE, error: '', required: false
      },

      challengeName: {
        value: payload.additionalParams.challengeName ?
          payload.additionalParams.challengeName : '', error: '', required: false
      },

      challengeDescription: {
        value: payload.additionalParams.challengeDescription ?
          payload.additionalParams.challengeDescription : '', error: '', required: false
      },

      entryType: {
        value: payload.additionalParams.entryType ?
          payload.additionalParams.entryType as EEntryType : EEntryType.FREE, error: '', required: false
      },

      cdnIcon: { value: payload.additionalParams.cdnIcon ? payload.additionalParams.cdnIcon : '', error: '', required: false },

      maxEntries: { value: payload.additionalParams.maxEntries ? payload.additionalParams.maxEntries : 0, error: '', required: false },

      minEntries: { value: payload.additionalParams.minEntries ? payload.additionalParams.minEntries : 0, error: '', required: false },

      challengeKey: payload.additionalParams.challengeKey ? {
        challengeTask: { value: payload.additionalParams.challengeKey.challengeTask as EChallengeTask, error: '', required: true },
        cashFlag: { value: payload.additionalParams.challengeKey.cashFlag as EChallengeCashFlag, error: '', required: true },
        tournamentNameId: payload.additionalParams.challengeKey.tournamentNameId ?
          { value: payload.additionalParams.challengeKey.tournamentNameId, error: '', required: true } : null,
        secondaryScoreIndex: payload.additionalParams.challengeKey.secondaryScoreIndex ?
          { value: payload.additionalParams.challengeKey.secondaryScoreIndex, error: '', required: true } : null,
        tournamentType: { value: payload.additionalParams.challengeKey.tournamentType as EChallengeTournamentType, error: '', required: true },
      } :
        {
          challengeTask: { value: EChallengeTask.completeChallenge, error: '', required: true },
          cashFlag: { value: EChallengeCashFlag.all, error: '', required: true },
          tournamentNameId: null,
          secondaryScoreIndex: null,
          tournamentType: { value: EChallengeTournamentType.all, error: '', required: true },
        },

      entryFeeList: payload.additionalParams.entryFeeList ?
        payload.additionalParams.entryFeeList.map(entryFee => {
          return {
            realAmount: {
              amount: { value: entryFee.realAmount?.amount ? entryFee.realAmount?.amount : 0, error: '', required: false },
              currency: { value: entryFee.realAmount?.currency ? entryFee.realAmount?.currency : ECurrency.USD, error: '', required: false },
              maxBonusCutPercentage: { value: entryFee.realAmount?.maxBonusCutPercentage ? entryFee.realAmount?.maxBonusCutPercentage : 0, error: '', required: false },
              maxWinningsCutPercentage: { value: entryFee.realAmount?.maxWinningsCutPercentage ? entryFee.realAmount?.maxWinningsCutPercentage : 0, error: '', required: false },
            },
            virtualAmountList: entryFee.virtualAmountList?.map(va => {
              return {
                amount: { value: va.amount, error: '', required: false },
                currencyType: { value: va.currencyType, error: '', required: false },
              }
            }),
          }
        }) : [],
      rewardList: payload.additionalParams.rewardList ?
        payload.additionalParams.rewardList?.map(item => {
          const fields: TRangedRewardFields = {
            minRank: { ...numberField, value: item.minRank },
            maxRank: { ...numberField, value: item.maxRank },
          };
          if (item.realReward) {
            fields.realReward = {
              winningAmount: item.realReward.winningAmount ?
                {
                  amount: { ...numberField, value: parseFloat(item.realReward.winningAmount.amount + '') },
                  currency: { ...numberField, value: item.realReward.winningAmount.currency },
                } :
                {
                  amount: { ...numberField, value: 0 },
                  currency: {
                    ...numberField,
                    value: item.realReward.bonusAmount ?
                      item.realReward.bonusAmount.currency :
                      ECurrency.USD
                  },
                },
              bonusAmount: item.realReward.bonusAmount ?
                {
                  amount: { ...numberField, value: parseFloat(item.realReward.bonusAmount.amount + '') },
                  currency: { ...numberField, value: item.realReward.bonusAmount.currency },
                } :
                {
                  amount: { ...numberField, value: 0 },
                  currency: {
                    ...numberField,
                    value: item.realReward.winningAmount ?
                      item.realReward.winningAmount.currency :
                      ECurrency.USD
                  },
                }
            };
          }
          if (item.virtualRewards) {
            fields.virtualRewards = item.virtualRewards.map(vr => {
              return {
                amount: { ...numberField, value: vr.amount },
                currencyType: { ...numberField, value: vr.currencyType },
              };
            });
          }
          return fields;
        }) : [],
        
    },
  };

  const gameIdToGameDataMap: {[key: string]: TGameModeDataOptionalFields} = {};
  Object.keys(payload.additionalParams.gameIdToGameDataMap).forEach((gameId: string) => {
    gameIdToGameDataMap[gameId] = {
      _showDisplayName: 'displayName' in payload.additionalParams.gameIdToGameDataMap[gameId],
      _showImageDataList: 'imageDataList' in payload.additionalParams.gameIdToGameDataMap[gameId],
      _showRoundCount: 'roundCount' in payload.additionalParams.gameIdToGameDataMap[gameId],
      _showGameSpecificParams: 'gameSpecificParams' in payload.additionalParams.gameIdToGameDataMap[gameId],
      _showGameColor: 'gameColor' in payload.additionalParams.gameIdToGameDataMap[gameId],
      _showDuration: 'duration' in payload.additionalParams.gameIdToGameDataMap[gameId],
      _showPlayerCountPreferences: 'playerCountPreferences' in payload.additionalParams.gameIdToGameDataMap[gameId],
      _showBotsEnabled: 'botsEnabled' in payload.additionalParams.gameIdToGameDataMap[gameId],
      _showDifficultyMaxLevel: 'difficultyMaxLevel' in payload.additionalParams.gameIdToGameDataMap[gameId],
      _showDifficultyMinLevel: 'difficultyMinLevel' in payload.additionalParams.gameIdToGameDataMap[gameId],
      _showBotConfig: 'botConfig' in payload.additionalParams.gameIdToGameDataMap[gameId],
      _showBannerRulesText: 'bannerRulesText' in payload.additionalParams.gameIdToGameDataMap[gameId],
      _showWinQualificationJson: 'winQualificationJson' in payload.additionalParams.gameIdToGameDataMap[gameId],
    };
    if ('displayName' in payload.additionalParams.gameIdToGameDataMap[gameId]) {
      gameIdToGameDataMap[gameId].displayName = {
        value: payload.additionalParams.gameIdToGameDataMap[gameId].displayName as string,
        error: '',
        required: true,
      };
    }
    if ('imageDataList' in payload.additionalParams.gameIdToGameDataMap[gameId]) {
      gameIdToGameDataMap[gameId].imageDataList = payload.additionalParams.gameIdToGameDataMap[gameId].imageDataList?.map((idl: TImageData) => {
        return {
          type: { value: idl.type, error: '', required: true },
          url: { value: idl.url, error: '', required: true },
          aspectRatio: { value: idl.aspectRatio, error: '', required: true },
        }
      });
    }
    if ('gameSpecificParams' in payload.additionalParams.gameIdToGameDataMap[gameId]) {
      gameIdToGameDataMap[gameId].gameSpecificParams = {
        value: payload.additionalParams.gameIdToGameDataMap[gameId].gameSpecificParams as string,
        error: '',
        required: true,
      };
    }
      // gameColor: string;
      // roundCount: TFormFieldNumber;
    if ('duration' in payload.additionalParams.gameIdToGameDataMap[gameId]) {
      gameIdToGameDataMap[gameId].duration = {
        value: parseInt(payload.additionalParams.gameIdToGameDataMap[gameId].duration + ''),
        error: '',
        required: true,
      };
    }
    if ('playerCountPreferences' in payload.additionalParams.gameIdToGameDataMap[gameId]) {
      gameIdToGameDataMap[gameId].playerCountPreferences = {
        value: payload.additionalParams.gameIdToGameDataMap[gameId].playerCountPreferences?.join(', ') || '',
        error: '',
        required: true,
      };
    }
    if ('difficultyMaxLevel' in payload.additionalParams.gameIdToGameDataMap[gameId]) {
      gameIdToGameDataMap[gameId].difficultyMaxLevel = {
        value: parseInt(payload.additionalParams.gameIdToGameDataMap[gameId].difficultyMaxLevel + ''),
        error: '',
        required: true,
      };
    }
    if ('difficultyMinLevel' in payload.additionalParams.gameIdToGameDataMap[gameId]) {
      gameIdToGameDataMap[gameId].difficultyMinLevel = {
        value: parseInt(payload.additionalParams.gameIdToGameDataMap[gameId].difficultyMinLevel + ''),
        error: '',
        required: true,
      };
    }
      // rulesText: string;
      // socialConfig: string;
    if ('botsEnabled' in payload.additionalParams.gameIdToGameDataMap[gameId]) {
      gameIdToGameDataMap[gameId].botsEnabled = {
        value: Boolean(payload.additionalParams.gameIdToGameDataMap[gameId].botsEnabled),
        error: '',
        required: true
      };
    }
    if ('roundCount' in payload.additionalParams.gameIdToGameDataMap[gameId]) {
      gameIdToGameDataMap[gameId].roundCount = {
        value: payload.additionalParams.gameIdToGameDataMap[gameId].roundCount as number,
        error: '',
        required: true,
      };
    }
    if ('gameColor' in payload.additionalParams.gameIdToGameDataMap[gameId]) {
      gameIdToGameDataMap[gameId].gameColor = {
        value: payload.additionalParams.gameIdToGameDataMap[gameId].gameColor as string,
        error: '',
        required: true,
      };
    }
    if ('botConfig' in payload.additionalParams.gameIdToGameDataMap[gameId]) {
      const { botConfig } = payload.additionalParams.gameIdToGameDataMap[gameId];
      if (botConfig) {
        const newBotConfig: TOverridableBotConfigFields = {
          botLogic: {
            value: botConfig?.botLogic || EBotLogics.MULTI_PLAYER_AI,
            error: '',
            required: true,
          },
          botsWithTrueSkills: {
            value: botConfig?.botsWithTrueSkills || false,
            error: '',
            required: true,
          },
          botMaxLevel: {
            value: botConfig?.botMaxLevel || 1,
            error: '',
            required: true,
          },
          botMinLevel: {
            value: botConfig?.botMinLevel || 1,
            error: '',
            required: true,
          },
          multiPlayerBotConfig: {},
          trueSkillLevels: {
            value: botConfig?.trueSkillLevels?.join(', ') || '',
            error: '',
            required: true,
          },
        }
        const map: {[key: number]: TFormFieldNumber} = {};
        Object.keys(botConfig?.multiPlayerBotConfig || {}).forEach(k => {
          map[parseInt(k)] = {
            value: !isNaN(botConfig?.multiPlayerBotConfig[parseInt(k)]) ? botConfig?.multiPlayerBotConfig[parseInt(k)] : -1,
            error: '',
            required: true,
          }
        });
        newBotConfig.multiPlayerBotConfig = map;
        gameIdToGameDataMap[gameId].botConfig = newBotConfig;
      }
    }
    if ('bannerRulesText' in payload.additionalParams.gameIdToGameDataMap[gameId]) {
      gameIdToGameDataMap[gameId].bannerRulesText = {
        value: JSON.stringify(payload.additionalParams.gameIdToGameDataMap[gameId].bannerRulesText || '{}', null, 2),
        error: '',
        required: true,
      };
    }
    if ('winQualificationJson' in payload.additionalParams.gameIdToGameDataMap[gameId]) {
      gameIdToGameDataMap[gameId].winQualificationJson = {
        value: JSON.stringify(payload.additionalParams.gameIdToGameDataMap[gameId].winQualificationJson || '{}', null, 2),
        error: '',
        required: true,
      };
    }
  });
  eventForm.additionalParams.gameIdToGameDataMap = gameIdToGameDataMap;

  if (payload.additionalParams.entryFee) {
    eventForm.additionalParams.entryFee = {
      amount: { value: payload.additionalParams.entryFee.amount, error: '', required: true },
      currency: { value: payload.additionalParams.entryFee.currency, error: '', required: true },
      maxBonusCutPercentage: {
        value: typeof payload.additionalParams.entryFee.maxBonusCutPercentage === 'number'
          ? payload.additionalParams.entryFee.maxBonusCutPercentage
          : NaN,
        error: '',
        required: true,
      },
      maxWinningsCutPercentage: {
        value: typeof payload.additionalParams.entryFee.maxWinningsCutPercentage === 'number'
          ? payload.additionalParams.entryFee.maxWinningsCutPercentage
          : NaN,
        error: '',
        required: true,
      },
    };
  }

  if (payload.additionalParams.entryFeeList) {
    const newEntries = payload.additionalParams.entryFeeList.map(ef => {
      const fee: TEntryFeeFields = {};
      if (ef.realAmount) {
        fee.realAmount = {
          amount: { ...numberField, value: ef.realAmount.amount },
          currency: { ...numberField, value: ef.realAmount.currency },
          maxBonusCutPercentage: { ...numberField, value: ef.realAmount.maxBonusCutPercentage },
          maxWinningsCutPercentage: { ...numberField, value: ef.realAmount.maxWinningsCutPercentage },
        }
      }
      if (ef.virtualAmountList) {
        fee.virtualAmountList = ef.virtualAmountList.map(vef => {
          return {
            amount: { ...numberField, value: vef.amount },
            currencyType: { ...numberField, value: vef.currencyType },
          }
        });
      }
      return fee;
    });
    eventForm.additionalParams.entryFeeList = newEntries as TEntryFeeFields[];
  } else {
    if (payload.additionalParams.entryFee) {
      const { entryFee } = payload.additionalParams;
      eventForm.additionalParams.entryFeeList = [{
        realAmount: {
          amount: { ...numberField, value: entryFee.amount },
          currency: { ...numberField, value: entryFee.currency },
          maxBonusCutPercentage: { ...numberField, value: entryFee.maxBonusCutPercentage },
          maxWinningsCutPercentage: { ...numberField, value: entryFee.maxWinningsCutPercentage },
        }
      }];
    } if (payload.additionalParams.virtualEntryFees && payload.additionalParams.virtualEntryFees.length) {
      const { virtualEntryFees } = payload.additionalParams;
      eventForm.additionalParams.entryFeeList = [{
        virtualAmountList: virtualEntryFees.map(vef => {
          return {
            amount: { ...numberField, value: vef.amount },
            currencyType: { ...numberField, value: vef.currencyType },
          }
        })
      }];
    }
  }
  console.info(eventForm.additionalParams.entryFeeList);

  // populate reward fields
  if (payload.additionalParams.playerCountToRewardList) {
    const playerCountToRewardList = {} as typeof eventForm.additionalParams.playerCountToRewardList;
    Object.keys(payload.additionalParams.playerCountToRewardList).forEach(key=> {
      const items = payload.additionalParams.playerCountToRewardList[key];
      playerCountToRewardList[key] = items ? items.map(item => {
        const fields: TRangedRewardFields = {
          minRank: { ...numberField, value: item.minRank },
          maxRank: { ...numberField, value: item.maxRank },
        };
        if (item.realReward) {
          fields.realReward = {
            winningAmount: item.realReward.winningAmount ?
              {
                amount: { ...numberField, value: parseFloat(item.realReward.winningAmount.amount + '') },
                currency: { ...numberField, value: item.realReward.winningAmount.currency },
              } :
              {
                amount: { ...numberField, value: 0 },
                currency: {
                  ...numberField,
                  value: item.realReward.bonusAmount ?
                    item.realReward.bonusAmount.currency :
                    ECurrency.USD
                },
              },
            bonusAmount: item.realReward.bonusAmount ?
              {
                amount: { ...numberField, value: parseFloat(item.realReward.bonusAmount.amount + '') },
                currency: { ...numberField, value: item.realReward.bonusAmount.currency },
              } :
              {
                amount: { ...numberField, value: 0 },
                currency: {
                  ...numberField,
                  value: item.realReward.winningAmount ?
                    item.realReward.winningAmount.currency :
                    ECurrency.USD
                },
              }
          };
        }
        if (item.virtualRewards) {
          fields.virtualRewards = item.virtualRewards.map(vr => {
            return {
              amount: { ...numberField, value: vr.amount },
              currencyType: { ...numberField, value: vr.currencyType },
            };
          });
        }
        return fields;
      }) : [];
    });
    eventForm.additionalParams.playerCountToRewardList = playerCountToRewardList;
  } else {
    if (payload.additionalParams.playerCountToRealRewardMap) {
      // handle real reward deprecated fields
      Object.keys(payload.additionalParams.playerCountToRealRewardMap).map(playerCount => {
        if (payload.additionalParams.playerCountToRealRewardMap) {
          const oldReward = payload.additionalParams.playerCountToRealRewardMap[playerCount];
          if (oldReward) {
            const rewards: TRangedRewardFields[] = [{
              minRank: { ...numberField, value: 1 },
              maxRank: { ...numberField, value: 1 },
              realReward: {
                winningAmount: {
                  amount: { ...numberField, value: oldReward.winningAmount.amount },
                  currency: { ...numberField, value: oldReward.winningAmount.currency },
                },
                bonusAmount: {
                  amount: { ...numberField, value: oldReward.bonusAmount.amount },
                  currency: { ...numberField, value: oldReward.bonusAmount.currency },
                },
              },
            }];
            eventForm.additionalParams.playerCountToRewardList = {
              [playerCount]: rewards
            };
          }
        }
      });
    } else if (payload.additionalParams.playerCountToVirtualRewardMap) {
      // handle virtual reward deprecated fields
      Object.keys(payload.additionalParams.playerCountToVirtualRewardMap).map(playerCount => {
        if (payload.additionalParams.playerCountToVirtualRewardMap) {
          const oldReward = payload.additionalParams.playerCountToVirtualRewardMap[playerCount];
          if (oldReward) {
            const rewards: TRangedRewardFields[] = [{
              minRank: { ...numberField, value: 1 },
              maxRank: { ...numberField, value: 1 },
              virtualRewards: oldReward.map(or => {
                return {
                  amount: { ...numberField, value: or.amount },
                  currencyType: { ...numberField, value: or.currencyType },
                };
              }),
            }];
            eventForm.additionalParams.playerCountToRewardList = {
              [playerCount]: rewards
            };
          }
        }
      });
    } else {
      eventForm.additionalParams.playerCountToRewardList = {
        '0': [{ ...defaultRewardFields }],
      };
    }
  }

  return eventForm;
};

export const getNudgeFormFromPayload = (payload: IEventNudgePayload): IEventNudgeForm => {
  return {
    ...getBaseEventFormFromPayload(payload),
    additionalParams: {
      subcategory: { value: payload.additionalParams.subcategory, error: '', required: true },
      productIds: { value: payload.additionalParams.productIds, error: '', required: true },
      extraVCPercent: {}, // todo
      extraRCPercent: { value: payload.additionalParams.extraRCPercent, error: '', required: true },
      nudgeCountOnSessionChange: { value: payload.additionalParams.nudgeCountOnSessionChange, error: '', required: true },
      nudgeDisplayCount: { value: payload.additionalParams.nudgeDisplayCount, error: '', required: true },
      nudgeCooldownDay: { value: payload.additionalParams.nudgeCooldownDay, error: '', required: true },
      nudgeCooldownHours: { value: payload.additionalParams.nudgeCooldownHours, error: '', required: true },
      bgGradient: { value: payload.additionalParams.bgGradient, error: '', required: true },
      title: { value: payload.additionalParams.title, error: '', required: true },
      centerGraphicDimension: {
        w: { value: payload.additionalParams.centerGraphicDimension?.w || 0.0, error: '', required: true },
        h: { value: payload.additionalParams.centerGraphicDimension?.h || 0.0, error: '', required: true },
      },
      centerGraphicTexts: { value: payload.additionalParams.centerGraphicTexts, error: '', required: true },
    },
  };
};


export const getProductPayloadFromForm = (payload: TCashProductForm): TCashProduct => {
  return {
    id: payload.id.value,
    readableId: payload.readableId.value,
    name: payload.name.value,
    highlightLabel: payload.highlightLabel.value,
    currency: payload.currency.value,
    amount: parseFloat(payload.amount.value + ''),
    offerPercent: parseInt(payload.offerPercent.value + ''),
    appId: payload.appId.value,
    type: payload.type.value,
    offerAmount: parseFloat(payload.offerAmount.value + ''),
  };
};

import produce from "immer";
import { ECost, EEntryType, EEventCategory, IEventBattleForm, placementHumanReadable, TRangedRewardFields } from "../../types/eventTypes";
import { TFormFieldNumber, TFormFieldNumberArray, TFormFieldString } from "../../types/formFields";
import { EVersions, TGameConfigPayload, TImageDataField } from "../../types/gameConfigTypes";
import { APP_ID } from "../../types/types";
import { TApp } from "../game-config/gameConfigApi";
import { getPlayerCountKey, MAX_EXTRA_TIME_AFTER_END, MAX_EXTRA_TIME_BEFORE_START } from "./create/event/create-event-container";

export const isEventFormValid = (
  form: IEventBattleForm,
  isProduction: boolean,
  gameData: TGameConfigPayload[], // todo use a hook to get this data
  eventCategoryFromUrl: null | string,
  apps: TApp[],
  isSelectedAppCrypto: boolean,
  selectedApp: string,
): IEventBattleForm => { // todo IEventBattleForm | IEventNudgeForm
  let formCopy: IEventBattleForm = {
    ...form,
    _validationErrors: [],
  };

  // validate displayName
  if (!formCopy.additionalParams.displayName.value) {
    formCopy = {
      ...formCopy,
      _validationErrors: [ ...formCopy._validationErrors, 'Display name is mandatory.' ],
      additionalParams: {
        ...formCopy.additionalParams,
        displayName: {
          ...formCopy.additionalParams.displayName,
          error: 'mandatory field'
        }
      }
    };
  }

  // validate challenge name
  if (eventCategoryFromUrl === EEventCategory.CHALLENGE_LEADERBOARD) {
    if (!formCopy.additionalParams.challengeName.value) {
      formCopy = {
        ...formCopy,
        _validationErrors: [...formCopy._validationErrors, 'challenge name is mandatory.'],
        additionalParams: {
          ...formCopy.additionalParams,
          challengeName: {
            ...formCopy.additionalParams.challengeName,
            error: 'mandatory field'
          }
        }
      };
    }
  }

  // validate wallet currency
  if (eventCategoryFromUrl === EEventCategory.CHALLENGE_LEADERBOARD) {
    if (!formCopy.additionalParams.walletCurrency.value) {
      formCopy = {
        ...formCopy,
        _validationErrors: [...formCopy._validationErrors, 'wallet currency is mandatory.'],
        additionalParams: {
          ...formCopy.additionalParams,
          walletCurrency: {
            ...formCopy.additionalParams.walletCurrency,
            error: 'mandatory field'
          }
        }
      };
    }
  }

  // validate challenge description
  if (eventCategoryFromUrl === EEventCategory.CHALLENGE_LEADERBOARD) {
    if (!formCopy.additionalParams.challengeDescription.value) {
      formCopy = {
        ...formCopy,
        _validationErrors: [...formCopy._validationErrors, 'Challenge Description is mandatory.'],
        additionalParams: {
          ...formCopy.additionalParams,
          challengeDescription: {
            ...formCopy.additionalParams.challengeDescription,
            error: 'mandatory field'
          }
        }
      };
    }
  }

  // validate extraTimeBeforeStart
  if (formCopy.extraTimeBeforeStart.value < 0 || formCopy.extraTimeBeforeStart.value > MAX_EXTRA_TIME_BEFORE_START) {
    formCopy = {
      ...formCopy,
      extraTimeBeforeStart: {
        ...formCopy.extraTimeBeforeStart,
        error: 'value must be in between 0 - 86400'
      }
    };
  }

  // validate extraTimeAfterEnd
  if (formCopy.extraTimeAfterEnd.value < 0 || formCopy.extraTimeAfterEnd.value > MAX_EXTRA_TIME_AFTER_END) {
    formCopy = {
      ...formCopy,
      extraTimeAfterEnd: {
        ...formCopy.extraTimeAfterEnd,
        error: 'value must be in between 0 - 86400'
      }
    };
  }

  // validate additionalParams.gameIdToGameDataMap
  if(eventCategoryFromUrl !== EEventCategory.CHALLENGE_LEADERBOARD) {
    if (!Object.keys(formCopy.additionalParams.gameIdToGameDataMap).length) {
      formCopy = {
        ...formCopy,
        _validationErrors: [
          ...formCopy._validationErrors,
          'at least one game should be added to "Game Mode Data List"'
        ]
      }
    }
    Object.keys(formCopy.additionalParams.gameIdToGameDataMap).forEach(gameId => {
      if ('displayName' in formCopy.additionalParams.gameIdToGameDataMap[gameId]) {
        const field = formCopy.additionalParams.gameIdToGameDataMap[gameId].displayName as TFormFieldString;
        if (!field.value) {
          formCopy = {
            ...formCopy,
            additionalParams: {
              ...formCopy.additionalParams,
              gameIdToGameDataMap: {
                ...formCopy.additionalParams.gameIdToGameDataMap,
                [gameId]: {
                  ...formCopy.additionalParams.gameIdToGameDataMap[gameId],
                  displayName: {
                    ...field,
                    error: 'mandatory field'
                  }
                }
              }
            }
          }
        }
      }
      if ('imageDataList' in formCopy.additionalParams.gameIdToGameDataMap[gameId]) {
        const field = formCopy.additionalParams.gameIdToGameDataMap[gameId].imageDataList as TImageDataField[];
        if (!field.length) {
          formCopy = {
            ...formCopy,
            _validationErrors: [
              ...formCopy._validationErrors,
              'at least 1 image data needed'
            ]
          }
        }
      }
      const { botConfig } = formCopy.additionalParams.gameIdToGameDataMap[gameId];
      if (botConfig) {
        if (botConfig.botsWithTrueSkills.value && !botConfig.trueSkillLevels.value) {
          formCopy = produce(formCopy, draftForm => {
            draftForm._validationErrors.push('If overriden botsWithTrueSkills is enabled, true skill levels is required.')
          });
        }
        if (parseInt(botConfig.botMaxLevel.value + '') < parseInt(botConfig.botMinLevel.value + '')) {
          formCopy = produce(formCopy, draftForm => {
            draftForm._validationErrors.push('Overriden bot min level should be less than or equal to bot max level.')
          });
        }
      }
      if ('gameSpecificParams' in formCopy.additionalParams.gameIdToGameDataMap[gameId]) {
        const field = formCopy.additionalParams.gameIdToGameDataMap[gameId].gameSpecificParams as TFormFieldString;
        if (!field.value) {
          formCopy = {
            ...formCopy,
            additionalParams: {
              ...formCopy.additionalParams,
              gameIdToGameDataMap: {
                ...formCopy.additionalParams.gameIdToGameDataMap,
                [gameId]: {
                  ...formCopy.additionalParams.gameIdToGameDataMap[gameId],
                  gameSpecificParams: {
                    ...field,
                    error: 'mandatory field'
                  }
                }
              }
            }
          }
        }
      }
      if ('gameColor' in formCopy.additionalParams.gameIdToGameDataMap[gameId]) {
        const field = formCopy.additionalParams.gameIdToGameDataMap[gameId].gameColor as TFormFieldString;
        if (!field.value) {
          formCopy = {
            ...formCopy,
            additionalParams: {
              ...formCopy.additionalParams,
              gameIdToGameDataMap: {
                ...formCopy.additionalParams.gameIdToGameDataMap,
                [gameId]: {
                  ...formCopy.additionalParams.gameIdToGameDataMap[gameId],
                  gameColor: {
                    ...field,
                    error: 'mandatory field'
                  }
                }
              }
            }
          }
        }
      }
      if ('roundCount' in formCopy.additionalParams.gameIdToGameDataMap[gameId]) {
        const field = formCopy.additionalParams.gameIdToGameDataMap[gameId].roundCount as TFormFieldNumber;
        if (isNaN(field.value) || field.value < 0 || field.value > 20) {
          formCopy = {
            ...formCopy,
            additionalParams: {
              ...formCopy.additionalParams,
              gameIdToGameDataMap: {
                ...formCopy.additionalParams.gameIdToGameDataMap,
                [gameId]: {
                  ...formCopy.additionalParams.gameIdToGameDataMap[gameId],
                  roundCount: {
                    ...field,
                    error: 'mandatory field; value should be min 0 and max 20'
                  }
                }
              }
            }
          }
        }
      }
      if ('duration' in formCopy.additionalParams.gameIdToGameDataMap[gameId]) {
        const field = formCopy.additionalParams.gameIdToGameDataMap[gameId].duration as TFormFieldNumber;
        if (isNaN(field.value) || field.value < 0 || field.value > 86400) {
          formCopy = {
            ...formCopy,
            additionalParams: {
              ...formCopy.additionalParams,
              gameIdToGameDataMap: {
                ...formCopy.additionalParams.gameIdToGameDataMap,
                [gameId]: {
                  ...formCopy.additionalParams.gameIdToGameDataMap[gameId],
                  duration: {
                    ...field,
                    error: 'mandatory field; value should be min 0 and max 86400'
                  }
                }
              }
            }
          }
        }
      }
      if ('playerCountPreferences' in formCopy.additionalParams.gameIdToGameDataMap[gameId] &&
        (!formCopy.additionalParams.gameIdToGameDataMap[gameId].playerCountPreferences?.value.length ||
          (formCopy.additionalParams.gameIdToGameDataMap[gameId].playerCountPreferences?.value.length === 1 &&
            formCopy.additionalParams.gameIdToGameDataMap[gameId].playerCountPreferences?.value === null))) {
        const field = formCopy.additionalParams.gameIdToGameDataMap[gameId].playerCountPreferences as TFormFieldNumberArray;
        const prefs = field.value.split(',').map(v => v.trim()).map(v => parseInt(v));
        if (!prefs.length || (prefs.length === 1 && isNaN(prefs[1]))) {
          formCopy = {
            ...formCopy,
            additionalParams: {
              ...formCopy.additionalParams,
              gameIdToGameDataMap: {
                ...formCopy.additionalParams.gameIdToGameDataMap,
                [gameId]: {
                  ...formCopy.additionalParams.gameIdToGameDataMap[gameId],
                  playerCountPreferences: {
                    ...field,
                    error: 'mandatory field; each comma separated value should be min 0 and max 20'
                  }
                }
              }
            }
          }
        }
      }
    });
  }

  // validations for FFA tournaments
  if (eventCategoryFromUrl === EEventCategory.TOURNAMENT) {
    const valErrs: string[] = [];
    if (formCopy.additionalParams.forcedAsyncPlayerCount === null ||
      formCopy.additionalParams.forcedAsyncPlayerCount.value === null ||
      formCopy.additionalParams.forcedAsyncPlayerCount.value < 1) {
      valErrs.push('forcedAsyncPlayerCount should be greater than 0.');
    }
    Object.keys(formCopy.additionalParams.gameIdToGameDataMap).forEach(gameId => {
      const bannerRulesText = formCopy.additionalParams.gameIdToGameDataMap[gameId].bannerRulesText;
      if (bannerRulesText) {
        try {
          JSON.parse(bannerRulesText.value);
        }catch (e) {
          valErrs.push(`banner rules are invalid for game "${gameId}"`);
          console.error(`unable to parse banner rules JSON for "${gameId}"\n`, e);
        }
      } else {
        valErrs.push(`banner rules are required for game "${gameId}"`);
        return;
      }
    });
    formCopy = {
      ...formCopy,
      _validationErrors: [ ...formCopy._validationErrors, ...valErrs ]
    };
  }

  // validations for battle and FFA tournaments
  if (eventCategoryFromUrl === EEventCategory.BATTLE ||
    eventCategoryFromUrl === EEventCategory.TOURNAMENT) {
    const valErrs: string[] = [];
    if (!formCopy.additionalParams.entryFeeList ||
      formCopy.additionalParams.entryFeeList.length !== 1) {
      valErrs.push(`only 1 entry is allowed for ${eventCategoryFromUrl}`);
    }
    formCopy = {
      ...formCopy,
      _validationErrors: [ ...formCopy._validationErrors, ...valErrs ]
    };
  }

  if (eventCategoryFromUrl === EEventCategory.CHALLENGE_LEADERBOARD) {
    const valErrs: string[] = [];
    if ((!formCopy.additionalParams.entryFeeList ||
      formCopy.additionalParams.entryFeeList.length !== 1) && 
      formCopy.additionalParams.entryType.value === EEntryType.CASH) {
      valErrs.push(`At least 1 entry should be added ${eventCategoryFromUrl}`);
    }
    formCopy = {
      ...formCopy,
      _validationErrors: [ ...formCopy._validationErrors, ...valErrs ]
    };
  }

  // validations for FFA tournaments
  if (eventCategoryFromUrl === EEventCategory.MULTI_ENTRY_TOURNAMENT) {
    const valErrs: string[] = [];
    if (selectedApp === APP_ID.TENNIS_CHAMPS) {
      if (formCopy.additionalParams.entryFeeList.length < 1) {
        valErrs.push('At least 1 entry should be added;');
      }
    } else {
      if (formCopy.additionalParams.entryFeeList.length <= 1) {
        valErrs.push('At least 2 entries should be added;');
      }
    }
    
    if (!formCopy.additionalParams.resultDelayDuration) {
      valErrs.push('Result delay duration should be at least 1.');
    }
    formCopy = {
      ...formCopy,
      _validationErrors: [ ...formCopy._validationErrors, ...valErrs ]
    };
  }

  if (formCopy.additionalParams.forcedAsyncMinPlayerCount && formCopy.additionalParams.forcedAsyncPlayerCount) {
    const valErrs: string[] = [];
    if (eventCategoryFromUrl === EEventCategory.MULTI_ENTRY_TOURNAMENT && selectedApp === APP_ID.TENNIS_CHAMPS) {
      if (formCopy.additionalParams.forcedAsyncMinPlayerCount.value < 1) {
        valErrs.push('Min value for \'Forced Async Min Player Count\' can be 1');
      }
      if (formCopy.additionalParams.forcedAsyncPlayerCount.value < 1) {
        valErrs.push('Min value for \'Forced Async Player Count\' can be 1');
      }
    } else {
      if (formCopy.additionalParams.forcedAsyncMinPlayerCount.value < 3) {
        valErrs.push('Min value for \'Forced Async Min Player Count\' can be 3');
      }
      if (formCopy.additionalParams.forcedAsyncPlayerCount.value < 3) {
        valErrs.push('Min value for \'Forced Async Player Count\' can be 3');
      }
    }

    formCopy = {
      ...formCopy,
      _validationErrors: [...formCopy._validationErrors, ...valErrs]
    };
  }

  if (isProduction) {
    Object.keys(form.additionalParams.gameIdToGameDataMap).forEach(gameId => {
      const liveVersionExists = gameData.find(gd => gd.gameId === gameId && gd.version === EVersions.LIVE);
      if (!liveVersionExists) {
        formCopy = {
          ...formCopy,
          _validationErrors: [
            ...formCopy._validationErrors,
            `Production Event can be created only for games which are saved as Live. Please check "${gameId}".`
          ]
        };
      }
    });
  } else {
    Object.keys(form.additionalParams.gameIdToGameDataMap).forEach(gameId => {
      if (!gameData.find(gd => gd.gameId === gameId && gd.version !== EVersions.DRAFT)) {
        formCopy = {
          ...formCopy,
          _validationErrors: [
            ...formCopy._validationErrors,
            `Test Event can be created only for games which are saved as Test, Live or Last Live. Please check "${gameId}".`
          ]
        };
      }
    });
  }

  if (eventCategoryFromUrl === EEventCategory.ELIMINATION) {
    const forcedAsyncPlayerCount = parseInt(form.additionalParams.forcedAsyncPlayerCount?.value + '') || 3;
    const rewardValidationErrors: string[] = [];
    if (forcedAsyncPlayerCount < 4 ||
      Math.ceil(Math.log2(forcedAsyncPlayerCount)) !== Math.floor(Math.log2(forcedAsyncPlayerCount))) {
      formCopy = {
        ...formCopy,
        _validationErrors: [
          ...formCopy._validationErrors,
          "\"Forced async player count\" must be a power of 2 and at least 4."
        ]
      };
    }
    form.additionalParams.playerCountToRewardList[getPlayerCountKey(eventCategoryFromUrl)]
      .forEach((reward, rewardIndex) => {
        const minRank = parseInt(reward.minRank.value + '');
        const maxRank = parseInt(reward.maxRank.value + '');
        if (rewardIndex === 0 || rewardIndex === 1) {
          if (minRank !== rewardIndex + 1 || maxRank !== rewardIndex + 1) {
            rewardValidationErrors.push(`minRank and maxRank should be ${rewardIndex + 1} for reward #${rewardIndex + 1}`);
          }
        } else {
          const lastMinRank = parseInt(form.additionalParams.playerCountToRewardList[getPlayerCountKey(eventCategoryFromUrl)][rewardIndex - 1].minRank.value + '');
          const lastMaxRank = parseInt(form.additionalParams.playerCountToRewardList[getPlayerCountKey(eventCategoryFromUrl)][rewardIndex - 1].maxRank.value + '');
          if (minRank !== (2 * lastMinRank) - 1) {
            rewardValidationErrors.push(`min rank for nth reward should be ${(2 * lastMinRank) - 1}`);
          }
          if (maxRank !== (2 * lastMaxRank)) {
            rewardValidationErrors.push(`max rank for nth reward should be ${2 * lastMinRank}`);
          }
        }
      });
    formCopy = {
      ...formCopy,
      _validationErrors: [ ...formCopy._validationErrors, ...rewardValidationErrors ]
    };
  }

  // validations for all event types start -------------------------
  // entry validations
  const { entryFeeList } = formCopy.additionalParams;
  if (entryFeeList) {
    const entryErrors: string[] = [];
    let avoidDupes: string[] = [];
    entryFeeList.forEach((entry, entryIndex) => {
      const { realAmount, virtualAmountList } = entry;
      if (!virtualAmountList && !realAmount) {
        entryErrors.push(`Either virtual or real entry should be added for entry #${entryIndex + 1}.`)
      }
      if (virtualAmountList) {
        const usedCurrencies: ECost[] = [];
        virtualAmountList.forEach((vFee, vFeeIndex) => {
          if (usedCurrencies.includes(vFee.currencyType.value)
            && !avoidDupes.includes(`${entryIndex}-${vFeeIndex}`)) {
            entryErrors.push(`${vFee.currencyType.value} cannot be used multiple times for entry #${entryIndex + 1}.`);
          } else {
            usedCurrencies.push(vFee.currencyType.value);
            avoidDupes.push(`${entryIndex}-${vFeeIndex}`)
          }
          if (vFee.amount.value + '' === '' || parseInt(vFee.amount.value + '') <= 0) {
            entryErrors.push(`Amount should be greater than 0 for entry #${entryIndex + 1} virtual fee #${vFeeIndex + 1}.`)
          }
        });
        if (realAmount && parseFloat(realAmount.amount.value + '') <= 0 &&
          eventCategoryFromUrl !== EEventCategory.MULTI_ENTRY_TOURNAMENT) {
          entryErrors.push(`Real amount should be greater than 0 for entry #${entryIndex + 1}.`);
        }
      }
      if (realAmount) {
        if (realAmount.amount.value + '' === '' || parseFloat(realAmount.amount.value + '') < 0) {
          entryErrors.push(`Real amount should be greater than or equal to 0 for entry #${entryIndex + 1}.`);
        }
        if (realAmount.maxBonusCutPercentage.value + '' === '' || parseInt(realAmount.maxBonusCutPercentage.value + '') < 0) {
          entryErrors.push(`Max bonus cut % should be at least 0 for entry #${entryIndex}.`)
        }
      }
    });
    formCopy = {
      ...formCopy,
      _validationErrors: [ ...formCopy._validationErrors, ...entryErrors ]
    };
  }

  // reward validations
  if(eventCategoryFromUrl !== EEventCategory.CHALLENGE_LEADERBOARD){
    const { playerCountToRewardList } = formCopy.additionalParams;
  if (playerCountToRewardList) {
    const validationErrors: string[] = [];
    Object.keys(playerCountToRewardList).forEach(playerCount => {
      const playerRewards = playerCountToRewardList[playerCount];
      playerRewards.forEach((rl: TRangedRewardFields, rlIndex) => {
        const maxRank = parseInt(rl.maxRank.value + '');
        const minRank = parseInt(rl.minRank.value + '');
        const { realReward, virtualRewards } = rl;
        if (rlIndex) {
          if (minRank !== parseInt(playerRewards[rlIndex - 1].maxRank.value + '') + 1) {
            validationErrors.push(`Min rank for reward #${rlIndex + 1} should be greater than max rank for reward #${rlIndex}.`);
          }
        } else {
          if (minRank !== 1) {
            validationErrors.push('First min rank should be 1.');
          }
        }
        if (maxRank < minRank) {
          validationErrors.push(`Max Rank of reward #${rlIndex + 1} should be greater than or equal to it's min rank.`);
        }
        if (eventCategoryFromUrl !== EEventCategory.CHALLENGE_LEADERBOARD) {
          if (formCopy.additionalParams.forcedAsyncPlayerCount === null) {
            if (maxRank > 2 || minRank > 2) {
              validationErrors.push(`Max rank and min rank cannot exceed 2 for reward #${rlIndex + 1}.`);
            }
          }
        }
        
        if (!virtualRewards && !realReward) {
          validationErrors.push(`Either virtual or real reward(s) should be added for reward #${rlIndex + 1}.`);
        }
        if (virtualRewards) {
          virtualRewards.forEach((vReward, vRewardIndex) => {
            const usedCurrencies: ECost[] = [];

            // TODO : this is a temporary fix for the issue : (TCJ-552 Bullseye - Feature to support zero rewards)
            // if (vReward.amount.value + '' === '' || parseInt(vReward.amount.value + '') <= 0) {
            //   validationErrors.push(`Virtual currency amount should be greater than 0 for reward #${rlIndex + 1} virtual reward #${vRewardIndex + 1}.`);
            // }
            if (usedCurrencies.includes(vReward.currencyType.value)) {
              validationErrors.push(`${vReward.currencyType.value} cannot be used multiple times for reward #${rlIndex + 1}.`);
            } else {
              usedCurrencies.push(vReward.currencyType.value);
            }
            if (!vReward.currencyType.value) {
              validationErrors.push(`Currency is required for reward #${rlIndex + 1} virtual reward #${vRewardIndex + 1}`);
            } else if (!apps.find(app => app.appId === formCopy.appId.value)
                ?.serverParams['virtual.currency']
                .map(vc => vc.currencyName)
                .includes(vReward.currencyType.value)) {
                  validationErrors.push(`Currency is invalid for reward #${rlIndex + 1} virtual reward #${vRewardIndex + 1}`);
            }
          });
        }
        if (realReward) {
          const winningAmount = parseFloat(realReward.winningAmount.amount.value + '');
          const bonusAmount = parseFloat(realReward.bonusAmount.amount.value + '');

          // TODO : this is a temporary fix for the issue : (TCJ-552 Bullseye - Feature to support zero rewards)
          // if (!isSelectedAppCrypto && ((winningAmount === 0 && bonusAmount === 0) ||
          //   realReward.winningAmount.amount.value + '' === '' ||
          //   realReward.bonusAmount.amount.value + '' === '')) {
          //   validationErrors.push(`Real or bonus reward amount should be greater than 0 for reward #${rlIndex + 1}.`);
          // }
          // if (isSelectedAppCrypto && (winningAmount === 0  || realReward.winningAmount.amount.value + '' === '')) {
          //   validationErrors.push(`Real rew  ard amount should be greater than 0 for reward #${rlIndex + 1}.`);
          // }
          if (winningAmount < 0) {
            validationErrors.push(`Real reward amount cannot be less than 0 for reward #${rlIndex + 1}.`);
          }
          if (bonusAmount < 0) {
            validationErrors.push(`Bonus reward amount cannot be less than 0 for reward #${rlIndex + 1}.`);
          }
        }
      });
    });
    formCopy = {
      ...formCopy,
      _validationErrors: [
        ...formCopy._validationErrors,
        ...validationErrors
      ]
    };
  }
  }
  

  if (eventCategoryFromUrl === EEventCategory.CHALLENGE_LEADERBOARD) {
    const { rewardList } = formCopy.additionalParams;
    if (rewardList) {
      const validationErrors: string[] = [];
      rewardList.forEach((rl: TRangedRewardFields, rlIndex) => {
        const maxRank = parseInt(rl.maxRank.value + '');
        const minRank = parseInt(rl.minRank.value + '');
        const { realReward, virtualRewards } = rl;
        if (rlIndex) {
          if (minRank !== parseInt(rewardList[rlIndex - 1].maxRank.value + '') + 1) {
            validationErrors.push(`Min rank for reward #${rlIndex + 1} should be greater than max rank for reward #${rlIndex}.`);
          }
        } else {
          if (minRank !== 1) {
            validationErrors.push('First min rank should be 1.');
          }
        }
        if (maxRank < minRank) {
          validationErrors.push(`Max Rank of reward #${rlIndex + 1} should be greater than or equal to it's min rank.`);
        }
        // if (formCopy.additionalParams.forcedAsyncPlayerCount === null) {
        //   if (maxRank > 2 || minRank > 2) {
        //     validationErrors.push(`Max rank and min rank cannot exceed 2 for reward #${rlIndex + 1}.`);
        //   }
        // }
        if (!virtualRewards && !realReward) {
          validationErrors.push(`Either virtual or real reward(s) should be added for reward #${rlIndex + 1}.`);
        }
        if (virtualRewards) {
          virtualRewards.forEach((vReward, vRewardIndex) => {
            const usedCurrencies: ECost[] = [];
            if (vReward.amount.value + '' === '' || parseInt(vReward.amount.value + '') <= 0) {
              validationErrors.push(`Virtual currency amount should be greater than 0 for reward #${rlIndex + 1} virtual reward #${vRewardIndex + 1}.`);
            }
            if (usedCurrencies.includes(vReward.currencyType.value)) {
              validationErrors.push(`${vReward.currencyType.value} cannot be used multiple times for reward #${rlIndex + 1}.`);
            } else {
              usedCurrencies.push(vReward.currencyType.value);
            }
            if (!vReward.currencyType.value) {
              validationErrors.push(`Currency is required for reward #${rlIndex + 1} virtual reward #${vRewardIndex + 1}`);
            } else if (!apps.find(app => app.appId === formCopy.appId.value)
              ?.serverParams['virtual.currency']
              .map(vc => vc.currencyName)
              .includes(vReward.currencyType.value)) {
              validationErrors.push(`Currency is invalid for reward #${rlIndex + 1} virtual reward #${vRewardIndex + 1}`);
            }
          });
        }
        if (realReward) {
          const winningAmount = parseFloat(realReward.winningAmount.amount.value + '');
          const bonusAmount = parseFloat(realReward.bonusAmount.amount.value + '');
          if (!isSelectedAppCrypto && ((winningAmount === 0 && bonusAmount === 0) ||
            realReward.winningAmount.amount.value + '' === '' ||
            realReward.bonusAmount.amount.value + '' === '')) {
            validationErrors.push(`Real or bonus reward amount should be greater than 0 for reward #${rlIndex + 1}.`);
          }
          if (isSelectedAppCrypto && (winningAmount === 0 || realReward.winningAmount.amount.value + '' === '')) {
            validationErrors.push(`Real reward amount should be greater than 0 for reward #${rlIndex + 1}.`);
          }
          if (winningAmount < 0) {
            validationErrors.push(`Real reward amount cannot be less than 0 for reward #${rlIndex + 1}.`);
          }
          if (bonusAmount < 0) {
            validationErrors.push(`Bonus reward amount cannot be less than 0 for reward #${rlIndex + 1}.`);
          }
        }
      });
      formCopy = {
        ...formCopy,
        _validationErrors: [
          ...formCopy._validationErrors,
          ...validationErrors
        ]
      };
    }
  }


  const { placementDataList } = form.additionalParams;
  if (!placementDataList.length) {
    formCopy = {
      ...formCopy,
      _validationErrors: [...formCopy._validationErrors, 'at least 1 placement is needed']
    };
  }
  placementDataList.forEach((p, pIndex) => {
    if (formCopy.appId.value in placementHumanReadable &&
      !Object.keys(placementHumanReadable[formCopy.appId.value]).includes(p.placementLocation.value)) {
      formCopy = {
        ...formCopy,
        _validationErrors: [...formCopy._validationErrors, `invalid location "${p.placementLocation.value}" for placement #${pIndex + 1}.`]
      };
    }
  });
  Object.keys(form.additionalParams.gameIdToGameDataMap).forEach(id => {
    const errs: string[] = [];
    const { difficultyMaxLevel } = form.additionalParams.gameIdToGameDataMap[id];
    const { difficultyMinLevel } = form.additionalParams.gameIdToGameDataMap[id];
    if (difficultyMaxLevel && !difficultyMinLevel) {
      errs.push('If difficultyMaxLevel is overriden, difficultyMinLevel also should be overriden.');
    }
    if (!difficultyMaxLevel && difficultyMinLevel) {
      errs.push('If difficultyMinLevel is overriden, difficultyMaxLevel also should be overriden.');
    }
    if ((difficultyMaxLevel && difficultyMinLevel) && parseInt(difficultyMaxLevel.value + '') < parseInt(difficultyMinLevel.value + '')) {
      errs.push('difficultyMinLevel should be less than or equal to difficultyMaxLevel.');
    }
    if (errs.length) {
      formCopy = {
        ...formCopy,
        _validationErrors: [...formCopy._validationErrors, ...errs ]
      };
    }
  });
  // validations for all event types end --------------------------

  return {
    ...formCopy,
    _isFormValid: !Boolean(formCopy._validationErrors.length)
  };
};

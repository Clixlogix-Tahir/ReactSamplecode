import {
  getCommaSeparatedNumberArray,
  getStringFromNumberArray
} from "../../common/utils";
import { TFormFieldNumber } from "../../types/formFields";
import {
  EBotLogics,
  TGameConfigForm,
  TGameConfigPayload,
  TGameModeData,
  TGameModeDataField
} from "../../types/gameConfigTypes";

export const toGameConfigPayload = (
  form: TGameConfigForm,
  selectedApp: string
): TGameConfigPayload => {
  const payload: TGameConfigPayload = {
    gameId: form.gameId.value,
    enabledCountryCodes: form.enabledCountryCodes.value,
    engineData: {
      engineType: form.engineData.engineType.value,
      assetData: null,
    },
    orientation: form.orientation.value,
    gameControlParams: {
      tutorialData: {
        tutorialType: form.gameControlParams.tutorialData.tutorialType.value,
        slideUrls: form.gameControlParams.tutorialData.slideUrls.value,
      },
      maxRankForWinner: form.gameControlParams.maxRankForWinner.value,
      isNonScoreGame: form.gameControlParams.isNonScoreGame.value,
      canWinAfterAbandon: form.gameControlParams.canWinAfterAbandon.value,
      startingScore: form.gameControlParams.startingScore.value,
      showResultForAbandoned: form.gameControlParams.showResultForAbandoned.value,
      showEqualAlignmentOnResultScreen: form.gameControlParams.showEqualAlignmentOnResultScreen.value,
      scoringType: form.gameControlParams.scoringType.value,
      autoStartGamePlay: form.gameControlParams.autoStartGamePlay.value,
      updateScoreOnCallback: form.gameControlParams.updateScoreOnCallback.value,
      resetAtStart: form.gameControlParams.resetAtStart.value,
      shouldHidePlayerInfoInNativeCode: form.gameControlParams.shouldHidePlayerInfoInNativeCode.value,
      gameSessionType: form.gameControlParams.gameSessionType.value,
      acceptablePauseTime: form.gameControlParams.acceptablePauseTime.value,
      disconnectionBufferTime: form.gameControlParams.disconnectionBufferTime.value,
      imageDataList: form.gameControlParams.imageDataList.map(imageData => {
        return {
          type: imageData.type.value,
          url: imageData.url.value,
          aspectRatio: imageData.aspectRatio.value,
        };
      })
    },
    matchMakingConfig: {
      matchMakingTime: form.matchMakingConfig.matchMakingTime.value,
    },
    appId: selectedApp,
    version: form.version.value,
    supportedPlayerCounts: getCommaSeparatedNumberArray(form.supportedPlayerCounts.value),
    gameModeDataList: form.gameModeDataList.map(gameMode => {
      const mode: TGameModeData = {
        gameMode: gameMode.gameMode.value,
        releaseState: gameMode.releaseState.value,
        overridablePlatformGameModeData: {
          displayName: gameMode.overridablePlatformGameModeData.displayName.value,
          imageDataList: gameMode.overridablePlatformGameModeData.imageDataList.map(imageData => {
            return {
              type: imageData.type.value,
              url: imageData.url.value,
              aspectRatio: imageData.aspectRatio.value,
            };
          }),
          gameSpecificParams: gameMode.overridablePlatformGameModeData.gameSpecificParams.value,
          duration: gameMode.overridablePlatformGameModeData.duration.value,
          playerCountPreferences: getCommaSeparatedNumberArray(gameMode.overridablePlatformGameModeData.playerCountPreferences.value),
          roundCount: gameMode.overridablePlatformGameModeData.roundCount.value,
          gameColor: gameMode.overridablePlatformGameModeData.gameColor.value,
          botsEnabled: gameMode.overridablePlatformGameModeData.botsEnabled.value,
          botConfig: null,
          difficultyMaxLevel: gameMode.overridablePlatformGameModeData.difficultyMaxLevel.value,
          difficultyMinLevel: gameMode.overridablePlatformGameModeData.difficultyMinLevel.value,
          bannerRulesText: gameMode.overridablePlatformGameModeData.bannerRulesText.value,
        },
        enabledPlatforms: gameMode.enabledPlatforms.value,
      };
      if (gameMode.overridablePlatformGameModeData.botConfig) {
        const newMap: { [key: number]: number } = {};
        Object.keys(gameMode.overridablePlatformGameModeData.botConfig.multiPlayerBotConfig).forEach((k) => {
          if (gameMode.overridablePlatformGameModeData.botConfig) {
            const key = parseInt(k);
            newMap[key] = gameMode.overridablePlatformGameModeData.botConfig.multiPlayerBotConfig[key].value;
          }
        });
        mode.overridablePlatformGameModeData.botConfig = {
          botLogic: gameMode.overridablePlatformGameModeData.botConfig.botLogic.value,
          botsWithTrueSkills: gameMode.overridablePlatformGameModeData.botConfig.botsWithTrueSkills.value,
          botMaxLevel: gameMode.overridablePlatformGameModeData.botConfig.botMaxLevel.value,
          botMinLevel: gameMode.overridablePlatformGameModeData.botConfig.botMinLevel.value,
          multiPlayerBotConfig: newMap,
          trueSkillLevels: gameMode.overridablePlatformGameModeData.botConfig ?
            gameMode.overridablePlatformGameModeData.botConfig.trueSkillLevels.value
              .split(',')
              .map(s => s.trim())
              .map(s => parseInt(s)) :
            [],
        };
      }
      return mode;
    }),
    platformDataSet: form.platformDataSet.map(platformData => {
      return {
        platform: platformData.platform.value,
        minAppVersion: platformData.minAppVersion.value,
        maxAppVersion: platformData.maxAppVersion.value,
        shrinkSize: getCommaSeparatedNumberArray(platformData.shrinkSize.value),
        webViewResolution: getCommaSeparatedNumberArray(platformData.webViewResolution.value),
        shrinkShape: platformData.shrinkShape.value,
      };
    }),
    skillConfig: {
      defaultSkillRating: form.skillConfig.defaultSkillRating.value,
      flatSkillThreshold: form.skillConfig.flatSkillThreshold.value,
      numGamesSkillRating: form.skillConfig.numGamesSkillRating.value,
      minMultiplier: form.skillConfig.minMultiplier.value,
      diffMulMap: {},
    },
    botConfig: {
      botLogic: form.botConfig ? form.botConfig.botLogic.value : EBotLogics.MULTI_PLAYER_AI,
      botsWithTrueSkills: form.botConfig ? form.botConfig.botsWithTrueSkills.value : false,
      botMaxLevel: form.botConfig ? parseInt(form.botConfig.botMaxLevel.value + '') : 1,
      botMinLevel: form.botConfig ? parseInt(form.botConfig.botMinLevel.value + '') : 1,
      multiPlayerBotConfig: {},
      trueSkillLevels: form.botConfig ?
        form.botConfig.trueSkillLevels.value
          .split(',')
          .map(s => s.trim())
          .map(s => parseInt(s)) :
        [],
    },
  };
  if (form.botConfig && payload.botConfig) {
    const newMap: { [key: number]: number } = {};
    Object.keys(form.botConfig.multiPlayerBotConfig).forEach((k) => {
      if (form.botConfig) {
        const key = parseInt(k);
        newMap[key] = form.botConfig.multiPlayerBotConfig[key].value;
      }
    });
    payload.botConfig.multiPlayerBotConfig = newMap;
  }
  if (form.engineData.url) payload.engineData.url = form.engineData.url.value;
  if (form.engineData.assetData) {
    if (!payload.engineData.assetData) payload.engineData.assetData = {};
    if (form.engineData.assetData.iosUrl) payload.engineData.assetData.iosUrl = form.engineData.assetData.iosUrl.value;
    if (form.engineData.assetData.androidUrl) payload.engineData.assetData.androidUrl = form.engineData.assetData.androidUrl.value;
    if (form.engineData.assetData.version) payload.engineData.assetData.version = form.engineData.assetData.version.value;
    if (form.engineData.assetData.addressableName) payload.engineData.assetData.addressableName = form.engineData.assetData.addressableName.value;
  }
  if (form.id) {
    payload.id = form.id;
  }
  return payload;
};


export const toGameConfigForm = (foundGame: TGameConfigPayload): TGameConfigForm => {
  const parsedForm: TGameConfigForm = {
    _isFormValid: true,
    _isFormTouched: false,
    _isSubmittedOnce: false,
    _validationErrors: [],
    id: foundGame.id,
    gameId: {value: foundGame.gameId, error: '', required: false },
    enabledCountryCodes: { value: foundGame.enabledCountryCodes, error: '', required: false },
    engineData: {
      engineType: { value: foundGame.engineData.engineType, error: '', required: false },
      assetData: null,
    },
    orientation: { value: foundGame.orientation, error: '', required: false },
    gameControlParams: {
      tutorialData: {
        tutorialType: { value: foundGame.gameControlParams.tutorialData.tutorialType, error: '', required: false },
        slideUrls: { value: foundGame.gameControlParams.tutorialData.slideUrls, error: '', required: false },
      },
      maxRankForWinner: { value: foundGame.gameControlParams.maxRankForWinner, error: '', required: false },
      isNonScoreGame: { value: foundGame.gameControlParams.isNonScoreGame, error: '', required: false },
      canWinAfterAbandon: { value: foundGame.gameControlParams.canWinAfterAbandon, error: '', required: false },
      startingScore: { value: foundGame.gameControlParams.startingScore, error: '', required: false },
      showResultForAbandoned: { value: foundGame.gameControlParams.showResultForAbandoned, error: '', required: false },
      showEqualAlignmentOnResultScreen: { value: foundGame.gameControlParams.showEqualAlignmentOnResultScreen, error: '', required: false },
      scoringType: { value: foundGame.gameControlParams.scoringType, error: '', required: false },
      autoStartGamePlay: { value: foundGame.gameControlParams.autoStartGamePlay, error: '', required: false },
      updateScoreOnCallback: { value: foundGame.gameControlParams.updateScoreOnCallback, error: '', required: false },
      resetAtStart: { value: foundGame.gameControlParams.resetAtStart, error: '', required: false },
      shouldHidePlayerInfoInNativeCode: { value: foundGame.gameControlParams.shouldHidePlayerInfoInNativeCode, error: '', required: false },
      gameSessionType: { value: foundGame.gameControlParams.gameSessionType, error: '', required: false },
      acceptablePauseTime: { value: foundGame.gameControlParams.acceptablePauseTime, error: '', required: false },
      disconnectionBufferTime: { value: foundGame.gameControlParams.disconnectionBufferTime, error: '', required: false },
      imageDataList: foundGame.gameControlParams.imageDataList.map(imageData => {
        return {
          type: { value: imageData.type, error: '', required: false },
          url: { value: imageData.url, error: '', required: false },
          aspectRatio: { value: imageData.aspectRatio, error: '', required: false },
        };
      })
    },
    matchMakingConfig: {
      matchMakingTime: { value: foundGame.matchMakingConfig.matchMakingTime, error: '', required: false },
    },
    appId: { value: foundGame.appId, error: '', required: false },
    version: { value: foundGame.version, error: '', required: false },
    supportedPlayerCounts: { value: getStringFromNumberArray(foundGame.supportedPlayerCounts), error: '', required: false },
    gameModeDataList: foundGame.gameModeDataList.map(gameMode => {
      const mode: TGameModeDataField = {
        gameMode: { value: gameMode.gameMode, error: '', required: false },
        releaseState: { value: gameMode.releaseState, error: '', required: false },
        overridablePlatformGameModeData: {
          displayName: { value: gameMode.overridablePlatformGameModeData.displayName, error: '', required: false },
          imageDataList: gameMode.overridablePlatformGameModeData.imageDataList.map(imageData => {
            return {
              type: { value: imageData.type, error: '', required: false },
              url: { value: imageData.url, error: '', required: false },
              aspectRatio: { value: imageData.aspectRatio, error: '', required: false },
            };
          }),
          gameSpecificParams: { value: gameMode.overridablePlatformGameModeData.gameSpecificParams, error: '', required: false },
          duration: { value: gameMode.overridablePlatformGameModeData.duration, error: '', required: false },
          playerCountPreferences: { value: getStringFromNumberArray(gameMode.overridablePlatformGameModeData.playerCountPreferences), error: '', required: false },
          gameColor: { value: gameMode.overridablePlatformGameModeData.gameColor, error: '', required: false },
          roundCount: { value: gameMode.overridablePlatformGameModeData.roundCount, error: '', required: false },
          botsEnabled: { value: gameMode.overridablePlatformGameModeData.botsEnabled, error: '', required: false },
          botConfig: null,
          difficultyMaxLevel: { value: gameMode.overridablePlatformGameModeData.difficultyMaxLevel, error: '', required: false },
          difficultyMinLevel: { value: gameMode.overridablePlatformGameModeData.difficultyMinLevel, error: '', required: false },
          bannerRulesText: { value: gameMode.overridablePlatformGameModeData.bannerRulesText, error: '', required: false },
        },
        enabledPlatforms: { value: gameMode.enabledPlatforms, error: '', required: false },
      };
      if (gameMode.overridablePlatformGameModeData.botConfig) {
        mode.overridablePlatformGameModeData.botConfig = {
          botLogic: { value: gameMode.overridablePlatformGameModeData.botConfig.botLogic, error: '', required: true },
          botsWithTrueSkills: { value: gameMode.overridablePlatformGameModeData.botConfig.botsWithTrueSkills, error: '', required: false },
          botMaxLevel: { value: gameMode.overridablePlatformGameModeData.botConfig.botMaxLevel, error: '', required: true },
          botMinLevel: { value: gameMode.overridablePlatformGameModeData.botConfig.botMinLevel, error: '', required: true },
          multiPlayerBotConfig: {},
          trueSkillLevels: { value: gameMode.overridablePlatformGameModeData.botConfig.trueSkillLevels?.join(', ') || '', error: '', required: false },
        };
        if (gameMode.overridablePlatformGameModeData.botConfig.multiPlayerBotConfig) {
          const bcMap: { [key: number]: TFormFieldNumber } = {};
          Object.keys(gameMode.overridablePlatformGameModeData.botConfig.multiPlayerBotConfig).forEach(k => {
            if (gameMode.overridablePlatformGameModeData.botConfig) {
              bcMap[parseInt(k)] = { value: gameMode.overridablePlatformGameModeData.botConfig.multiPlayerBotConfig[parseInt(k)], error: '', required: true };
            } else {
              console.warn('botConfig not found while populating multiPlayerBotConfig');
            }
          });
          mode.overridablePlatformGameModeData.botConfig.multiPlayerBotConfig = bcMap;
        }
      }
      return mode;
    }),
    platformDataSet: foundGame.platformDataSet.map(platformData => {
      return {
        platform: { value: platformData.platform, error: '', required: false },
        minAppVersion: { value: platformData.minAppVersion, error: '', required: false },
        maxAppVersion: { value: platformData.maxAppVersion, error: '', required: false },
        shrinkSize: { value: getStringFromNumberArray(platformData.shrinkSize), error: '', required: false },
        webViewResolution: { value: getStringFromNumberArray(platformData.webViewResolution), error: '', required: false },
        shrinkShape: { value: platformData.shrinkShape, error: '', required: false },
      };
    }),
    skillConfig: {
      defaultSkillRating: { value: foundGame.skillConfig.defaultSkillRating, error: '', required: false },
      flatSkillThreshold: { value: foundGame.skillConfig.flatSkillThreshold, error: '', required: false },
      numGamesSkillRating: { value: foundGame.skillConfig.numGamesSkillRating, error: '', required: false },
      minMultiplier: { value: foundGame.skillConfig.minMultiplier, error: '', required: false },
      diffMulMap: { value: foundGame.skillConfig.diffMulMap, error: '', required: false },
    },
    botConfig: {
      botLogic: {
        value: foundGame.botConfig ? foundGame.botConfig.botLogic : EBotLogics.MULTI_PLAYER_AI,
        error: '',
        required: false,
      },
      botsWithTrueSkills: {
        value: foundGame.botConfig ? foundGame.botConfig.botsWithTrueSkills : false,
        error: '',
        required: false,
      },
      botMaxLevel: {
        value: foundGame.botConfig ? foundGame.botConfig.botMaxLevel : 1,
        error: '',
        required: false,
      },
      botMinLevel: {
        value: foundGame.botConfig ? foundGame.botConfig.botMinLevel : 1,
        error: '',
        required: false,
      },
      multiPlayerBotConfig: {},
      trueSkillLevels: {
        value: foundGame.botConfig ? foundGame.botConfig.trueSkillLevels?.join(', ') || '' : '',
        error: '',
        required: false,
      },
    },
  };
  if (foundGame.botConfig && foundGame.botConfig.multiPlayerBotConfig && parsedForm.botConfig) {
    const bcMap: { [key: number]: TFormFieldNumber } = {};
    Object.keys(foundGame.botConfig.multiPlayerBotConfig).forEach(k => {
      if (foundGame.botConfig) {
        bcMap[parseInt(k)] = { value: foundGame.botConfig.multiPlayerBotConfig[parseInt(k)], error: '', required: true };
      } else {
        console.warn('botConfig not found while populating multiPlayerBotConfig 2');
      }
    });
    parsedForm.botConfig.multiPlayerBotConfig = bcMap;
  }
  if (foundGame.engineData.url) parsedForm.engineData.url = { value: foundGame.engineData.url, error: '', required: false };
  if (foundGame.engineData.assetData) {
    parsedForm.engineData.assetData = {};
    parsedForm.engineData.assetData.iosUrl = { value: foundGame.engineData.assetData.iosUrl, error: '', required: false };
    parsedForm.engineData.assetData.androidUrl = { value: foundGame.engineData.assetData.androidUrl, error: '', required: false };
    parsedForm.engineData.assetData.version = { value: foundGame.engineData.assetData.version, error: '', required: false };
    parsedForm.engineData.assetData.addressableName = { value: foundGame.engineData.assetData.addressableName, error: '', required: false };
  }

  return parsedForm;
};

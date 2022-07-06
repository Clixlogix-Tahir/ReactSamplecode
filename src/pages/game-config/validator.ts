import { TGameConfigForm } from "../../types/gameConfigTypes";

export const isGameConfigFormValid = (form: TGameConfigForm): TGameConfigForm => {
  let _isFormValid = true;
  const _validationErrors: string[] = [];

  if (!form.gameId.value) {
    _isFormValid = false;
    _validationErrors.push('Game ID is required.');
  }

  if (form.botConfig && form.botConfig.botMinLevel.value > form.botConfig.botMaxLevel.value) {
    _isFormValid = false;
    _validationErrors.push('Bot min level should not be greater than bot max level in "General Configuration" section.');
  }

  form.gameModeDataList.forEach(gm => {
    const { botConfig } = gm.overridablePlatformGameModeData;
    if (botConfig && botConfig.botMinLevel.value > botConfig.botMaxLevel.value) {
      _isFormValid = false;
      _validationErrors.push('Bot min level should not be greater than bot max level in "Game Mode Data List" section.');
    }
    if (gm.overridablePlatformGameModeData.difficultyMinLevel.value > gm.overridablePlatformGameModeData.difficultyMaxLevel.value) {
      _isFormValid = false;
      _validationErrors.push('Difficulty min level should not be greater than difficulty max level in "Game Mode Data List" section.');
    }
    if (botConfig && botConfig.botsWithTrueSkills.value && !botConfig.trueSkillLevels.value) {
      _isFormValid = false;
      _validationErrors.push('If botsWithTrueSkills is enabled, true skill levels is required.');
    }
  });

  return {
    ...form,
    _isFormTouched: true,
    _isFormValid,
    _isSubmittedOnce: true,
    _validationErrors,
  };
};

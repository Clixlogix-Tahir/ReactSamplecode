/* eslint-disable react-hooks/exhaustive-deps */
import styled from "styled-components";
import {
  Button as MuiButton,
  Checkbox,
  FormControl,
  FormControlLabel,
  IconButton,
  Input,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography as MuiTypography
} from '@material-ui/core';
import {
  spacing,
  display
} from "@material-ui/system";
import React, {
  Fragment,
  useEffect,
  useState
} from 'react';
import {
  useRouteMatch
} from 'react-router';
import {
  ROUTES
} from '../../common/constants';
import {
  defaultBotConfigField,
  defaultGameConfigForm,
  setGameConfigForm
} from './gameConfigSlice';
import DeleteIcon from '@material-ui/icons/Delete';
import AddIcon from '@material-ui/icons/Add';
import {
  EGameModes,
  EPlatforms,
  EReleaseStates,
  TBotConfigFields,
  TGameConfigForm,
  TGameModeDataField
} from '../../types/gameConfigTypes';
import globalStyles from "../../theme/globalStyles";
import {
  TMultiplayerBotConfigField
} from "../../types/eventTypes";
import {
  useAppDispatch,
  useAppSelector
} from "../../common/hooks";

const Button = styled(MuiButton)(spacing);
const Typography = styled(MuiTypography)`${spacing}; ${display}`;
const InlineFormControl = styled(FormControl)`
  width: 50% !important;
  margin-bottom: 0 !important;
`;

function GameModeFields(props: any) {
  const dispatch = useAppDispatch();
  const routeMatch = useRouteMatch();
  const classes = globalStyles();

  type TBotConfigForm = {
    percentage: number;
    nth: number;
    error: string;
  };
  const defaultBotConfigForm: TBotConfigForm = {
    percentage: 0,
    nth: 0,
    error: '',
  };
  const [botConfigForms, setBotConfigForms] = useState<TBotConfigForm[]>([]);
  // const [multiPlayerBotConfig_percentage, setMultiPlayerBotConfig_percentage] = useState(0);
  // const [multiPlayerBotConfig_nth, setMultiPlayerBotConfig_nth] = useState(0);
  // const [multiPlayerBotConfig_error, setMultiPlayerBotConfig_error] = useState('');
  const [multiplayerNthBotMap, setMultiplayerNthBotMap] = useState<{ [key: number]: boolean }>({});

  const {
    form
  } = useAppSelector(state => state.gameConfigForm);

  useEffect(() => {
    if (!botConfigForms.length && form.gameModeDataList.length) {
      const newForms: TBotConfigForm[] = [];
      form.gameModeDataList.forEach(mode => newForms.push({ ...defaultBotConfigForm }));
      setBotConfigForms(newForms);
    }
  }, [form.gameModeDataList]);

  const deleteGameMode = (gameModeIndex: number) => {
    if (form.gameModeDataList.length === 1) {
      // at least 1 item should be present
      return;
    }
    const gameModeCopy = [...form.gameModeDataList];
    gameModeCopy.splice(gameModeIndex, 1);
    dispatch(setGameConfigForm({
      ...form,
      _isFormTouched: true,
      gameModeDataList: [...gameModeCopy]
    }));
    setBotConfigForms([ ...botConfigForms.splice(gameModeIndex, 1) ]);
  };

  const addGameMode = () => {
    const gameModeCopy = [...form.gameModeDataList];
    gameModeCopy.push({ ...defaultGameConfigForm.gameModeDataList[0] });
    dispatch(setGameConfigForm({
      ...form,
      _isFormTouched: true,
      gameModeDataList: [...gameModeCopy]
    }));
    setBotConfigForms([ ...botConfigForms, { ...defaultBotConfigForm } ]);
  };

  const deleteImageData = (gameModeIndex: number, imageDataIndex: number) => {
    const gameModeCopy = [...form.gameModeDataList];
    const newMode = {...gameModeCopy[gameModeIndex]};
    const imageDataCopy = [...gameModeCopy[gameModeIndex].overridablePlatformGameModeData.imageDataList];
    imageDataCopy.splice(imageDataIndex, 1);
    newMode.overridablePlatformGameModeData = {
      ...gameModeCopy[gameModeIndex].overridablePlatformGameModeData,
      imageDataList: [...imageDataCopy]
    }
    gameModeCopy.splice(gameModeIndex, 1);
    gameModeCopy.splice(gameModeIndex, 0, newMode);
    dispatch(setGameConfigForm({
      ...form,
      _isFormTouched: true,
      gameModeDataList: [...gameModeCopy]
    }));
  };

  const addImageData = (gameModeIndex: number) => {
    const gameModeCopy = [...form.gameModeDataList];
    const newMode = {...gameModeCopy[gameModeIndex]};
    const imageDataCopy = [...gameModeCopy[gameModeIndex].overridablePlatformGameModeData.imageDataList];
    imageDataCopy.push({
      type: { value: '', error: '', required: false },
      url: { value: '', error: '', required: false },
      aspectRatio: { value: '', error: '', required: false },
    });
    newMode.overridablePlatformGameModeData = {
      ...gameModeCopy[gameModeIndex].overridablePlatformGameModeData,
      imageDataList: [...imageDataCopy]
    }
    gameModeCopy.splice(gameModeIndex, 1);
    gameModeCopy.splice(gameModeIndex, 0, newMode);
    // console.info(gameModeCopy);
    dispatch(setGameConfigForm({
      ...form,
      _isFormTouched: true,
      gameModeDataList: [...gameModeCopy]
    }));
  };

  const fieldChange = (updateIndex: number, updatedMode: TGameModeDataField) => {
    const gameModeCopy = [...form.gameModeDataList];
    gameModeCopy.splice(updateIndex, 1);
    gameModeCopy.splice(updateIndex, 0, updatedMode);
    dispatch(setGameConfigForm({
      ...form,
      _isFormTouched: true,
      gameModeDataList: [...gameModeCopy]
    }));
  };

  const dispatchMultiplayerBotConfigUpdate = (gameModeIndex: number, mapCopy: TMultiplayerBotConfigField) => {
    const existingBotConfig: TBotConfigFields = form.gameModeDataList[gameModeIndex].overridablePlatformGameModeData.botConfig;
    if (existingBotConfig) {
      const gameModeCopy = [...form.gameModeDataList];
      gameModeCopy.splice(gameModeIndex, 1);
      gameModeCopy.splice(gameModeIndex, 0, {
        ...form.gameModeDataList[gameModeIndex],
        overridablePlatformGameModeData: {
          ...form.gameModeDataList[gameModeIndex].overridablePlatformGameModeData,
          // botConfig: null
          botConfig: {
            ...existingBotConfig,
            multiPlayerBotConfig: mapCopy
          }
        }
      });
      const newForm: TGameConfigForm = {
        ...form,
        _isFormTouched: true,
        gameModeDataList: gameModeCopy
      };
      dispatch(setGameConfigForm(newForm));
    } else {
      // todo check delete or set null/undefined cases
      console.warn('botConfig not found');
      return;
    }
  };

  const validateMPBots = (
    gameModeIndex: number,
    mpBotPercent: number,
    mpBotNth: number,
    multiPlayerBotConfig: TMultiplayerBotConfigField,
    multiplayerNthBotMap: { [key: number]: boolean },
    botConfigForms: TBotConfigForm[]
  ) => {
    let errors = '';
    if (Object.keys(multiPlayerBotConfig)
      .includes(mpBotPercent + '')) {
      errors = 'Percentage already added.';
    }
    if (mpBotNth in multiplayerNthBotMap) {
      errors = 'Nth player already added.';
    }
    if (isNaN(mpBotPercent)) {
      errors = 'Percentage is required.';
    }
    if (isNaN(mpBotNth)) {
      errors = 'Nth player is required.';
    }
    const newForms: TBotConfigForm[] = [ ...botConfigForms ];
    newForms.splice(gameModeIndex, 1);
    newForms.splice(gameModeIndex, 0, {
      ...botConfigForms[gameModeIndex],
      error: errors
    });
    // setBotConfigForms(newForms);
  };

  const addMultiplayerBotConfigEntry = (gameModeIndex: number, multiPlayerBotConfig: TMultiplayerBotConfigField) => {
    const mapCopy = {
      ...multiPlayerBotConfig,
      [botConfigForms[gameModeIndex].percentage]: {
        value: botConfigForms[gameModeIndex].nth,
        error: '',
        required: true,
      }
    };
    dispatchMultiplayerBotConfigUpdate(gameModeIndex, mapCopy);
    const nthBotMapCopy = { ...multiplayerNthBotMap };
    nthBotMapCopy[botConfigForms[gameModeIndex].nth] = true;
    setMultiplayerNthBotMap(nthBotMapCopy);
    validateMPBots(
      gameModeIndex,
      botConfigForms[gameModeIndex].percentage,
      botConfigForms[gameModeIndex].nth,
      mapCopy,
      nthBotMapCopy,
      botConfigForms
    );
  };

  const removeMultiplayerBotConfigEntry = (gameModeIndex: number, percentKey: string, multiPlayerBotConfig: TMultiplayerBotConfigField) => {
    const mapCopy = { ...multiPlayerBotConfig };
    const nthBotMapCopy = { ...multiplayerNthBotMap };
    delete nthBotMapCopy[mapCopy[parseInt(percentKey)].value];
    setMultiplayerNthBotMap(nthBotMapCopy);
    delete mapCopy[parseInt(percentKey)];
    dispatchMultiplayerBotConfigUpdate(gameModeIndex, mapCopy);
    validateMPBots(
      gameModeIndex,
      botConfigForms[gameModeIndex].percentage,
      botConfigForms[gameModeIndex].nth,
      mapCopy,
      nthBotMapCopy,
      botConfigForms
    );
  };

  return (
    <Fragment>
      <Typography variant="h2">Game Mode Data List</Typography>
      <Typography variant="body2">These fields can be overwritten from Events.</Typography>
      {form.gameModeDataList.map((gameModeData, gameModeIndex) =>
        <div className="indent" key={gameModeIndex}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography variant="h4" my={4}>Game Mode {gameModeIndex + 1}</Typography>
            {form.gameModeDataList.length > 1 &&
              (routeMatch.path === ROUTES.GAME_CONFIG_CREATE || routeMatch.path === ROUTES.GAME_CONFIG_DRAFT) &&
              <IconButton color="primary"
                onClick={e => deleteGameMode(gameModeIndex)}
              >
                <DeleteIcon />
              </IconButton>
            }
          </div>
          <FormControl>
          <InputLabel htmlFor="game-mode-field">Game mode</InputLabel>
          <Select
            input={<Input name="game-mode-f" id={`game-mode-field-${gameModeIndex}`} />}
            value={gameModeData.gameMode.value}
            error={gameModeData.gameMode.error !== ''}
            disabled={routeMatch.path !== ROUTES.GAME_CONFIG_CREATE && !routeMatch.path.endsWith('draft')}
            onChange={(e: React.ChangeEvent<{ value: unknown }>) => {
              fieldChange(gameModeIndex, {
                ...form.gameModeDataList[gameModeIndex],
                gameMode: {
                  ...form.gameModeDataList[gameModeIndex].gameMode,
                  value: e.target.value as EGameModes,
                }
              });
            }}
          >
            {Object.keys(EGameModes).map(mode =>
              <MenuItem value={mode} key={mode}>{mode}</MenuItem>
            )}
          </Select>
        </FormControl>
        {gameModeData.gameMode.error &&
          <div>{gameModeData.gameMode.error}</div>
        }
        <FormControl>
          <InputLabel htmlFor="release-state-field">Release state</InputLabel>
          <Select
            input={<Input name="release-state-f" id={`release-state-field-${gameModeIndex}`} />}
            value={gameModeData.releaseState.value}
            error={gameModeData.releaseState.error !== ''}
            disabled={routeMatch.path !== ROUTES.GAME_CONFIG_CREATE && !routeMatch.path.endsWith('draft')}
            onChange={(e: React.ChangeEvent<{ value: unknown }>) => {
              fieldChange(gameModeIndex, {
                ...form.gameModeDataList[gameModeIndex],
                releaseState: {
                  ...form.gameModeDataList[gameModeIndex].releaseState,
                  value: e.target.value as EReleaseStates,
                }
              });
            }}
          >
            {Object.keys(EReleaseStates).map(releaseState =>
              <MenuItem value={releaseState} key={releaseState}>{releaseState}</MenuItem>
            )}
          </Select>
        </FormControl>
        {gameModeData.releaseState.error &&
          <div>{gameModeData.releaseState.error}</div>
        }
        <FormControlLabel
          label="botsEnabled"
          control={
            <Checkbox
              id={`botsEnabled-field-${gameModeIndex}`}
              name="botsEnabled-f"
              inputProps={{ 'aria-label': 'botsEnabled?' }}
              checked={Boolean(gameModeData.overridablePlatformGameModeData.botsEnabled.value)}
              disabled={routeMatch.path !== ROUTES.GAME_CONFIG_CREATE && !routeMatch.path.endsWith('draft')}
              onChange={(e: React.ChangeEvent<{ value: unknown, checked: boolean }>) => {
                fieldChange(gameModeIndex, {
                  ...form.gameModeDataList[gameModeIndex],
                  overridablePlatformGameModeData: {
                    ...form.gameModeDataList[gameModeIndex].overridablePlatformGameModeData,
                    botsEnabled: {
                      ...form.gameModeDataList[gameModeIndex].overridablePlatformGameModeData.botsEnabled,
                      value: e.target.checked as boolean,
                    }
                  }
                });
              }}
            />
          }
        />
          <label htmlFor="gm-ios-field">Enabled platforms</label>
          {Object.keys(EPlatforms).map(platform =>
            <FormControlLabel
              key={platform}
              label={platform}
              control={
                <Checkbox
                  id={`gm-${platform}-field-${gameModeIndex}`}
                  name="gm-android-f"
                  inputProps={{ 'aria-label': platform }}
                  checked={gameModeData.enabledPlatforms.value.includes(platform as EPlatforms)}
                  disabled={routeMatch.path !== ROUTES.GAME_CONFIG_CREATE && !routeMatch.path.endsWith('draft')}
                  onChange={(e: React.ChangeEvent<{ value: unknown, checked: boolean }>) => {
                    const checked = e.target.checked;
                    const value = [...form.gameModeDataList[gameModeIndex].enabledPlatforms.value];
                    if (checked && !value.includes(platform as EPlatforms)) {
                      value.push(platform as EPlatforms);
                    } else if (value.includes(platform as EPlatforms)) {
                      value.splice(value.indexOf(platform as EPlatforms), 1);
                    }
                    fieldChange(gameModeIndex, {
                      ...form.gameModeDataList[gameModeIndex],
                      enabledPlatforms: {
                        ...form.gameModeDataList[gameModeIndex].enabledPlatforms,
                        value,
                      }
                    });
                  }}
                />
              }
            />
          )}
          <FormControl>
            <TextField
              id={`display-name${gameModeIndex}`}
              name="game-display-name"
              label="Display name"
              value={gameModeData.overridablePlatformGameModeData.displayName.value}
              error={gameModeData.overridablePlatformGameModeData.displayName.error !== ''}
              helperText={gameModeData.overridablePlatformGameModeData.displayName.error}
              onChange={e => {
                const newMode = { ...gameModeData };
                newMode.overridablePlatformGameModeData = {
                  ...newMode.overridablePlatformGameModeData,
                  displayName: {
                    ...newMode.overridablePlatformGameModeData.displayName,
                    value: e.target.value as string
                  }
                }
                fieldChange(gameModeIndex, newMode);
              }}
              disabled={routeMatch.path !== ROUTES.GAME_CONFIG_CREATE && !routeMatch.path.endsWith('draft')}
            />
          </FormControl>
          <FormControl>
            <TextField
              id={`game-specific-params-${gameModeIndex}`}
              name="game-specific-params"
              label="Game Specific Params"
              value={gameModeData.overridablePlatformGameModeData.gameSpecificParams.value}
              error={gameModeData.overridablePlatformGameModeData.gameSpecificParams.error !== ''}
              helperText={gameModeData.overridablePlatformGameModeData.gameSpecificParams.error}
              onChange={e => {
                const newMode = { ...gameModeData };
                newMode.overridablePlatformGameModeData = {
                  ...newMode.overridablePlatformGameModeData,
                  gameSpecificParams: {
                    ...newMode.overridablePlatformGameModeData.gameSpecificParams,
                    value: e.target.value as string
                  }
                }
                fieldChange(gameModeIndex, newMode);
              }}
              disabled={routeMatch.path !== ROUTES.GAME_CONFIG_CREATE && !routeMatch.path.endsWith('draft')}
              multiline rowsMax={5}
            />
          </FormControl>
          <FormControl>
            <TextField
              id={`duration-${gameModeIndex}`}
              name="duration"
              label="Duration"
              value={gameModeData.overridablePlatformGameModeData.duration.value}
              error={gameModeData.overridablePlatformGameModeData.duration.error !== ''}
              helperText={gameModeData.overridablePlatformGameModeData.duration.error}
              InputProps={{
                endAdornment: <InputAdornment position="end">seconds</InputAdornment>
              }}
              onChange={(e: React.ChangeEvent<{ value: unknown }>) => {
                const newMode = { ...gameModeData };
                newMode.overridablePlatformGameModeData = {
                  ...newMode.overridablePlatformGameModeData,
                  duration: {
                    ...newMode.overridablePlatformGameModeData.duration,
                    value: e.target.value as number
                  }
                }
                fieldChange(gameModeIndex, newMode);
              }}
              type="number"
              inputProps={{ min: 1 }}
              disabled={routeMatch.path !== ROUTES.GAME_CONFIG_CREATE && !routeMatch.path.endsWith('draft')}
            />
          </FormControl>
          <FormControl>
            <TextField
              id={`player-count-pref-${gameModeIndex}`}
              name="player-count-pref"
              label="Player count"
              value={gameModeData.overridablePlatformGameModeData.playerCountPreferences.value}
              error={gameModeData.overridablePlatformGameModeData.playerCountPreferences.error !== ''}
              helperText={gameModeData.overridablePlatformGameModeData.playerCountPreferences.error}
              onChange={(e: React.ChangeEvent<{ value: unknown }>) => {
                const newMode = {...gameModeData};
                newMode.overridablePlatformGameModeData = {
                  ...newMode.overridablePlatformGameModeData,
                  playerCountPreferences: {
                    ...newMode.overridablePlatformGameModeData.playerCountPreferences,
                    value: e.target.value as string
                  }
                }
                fieldChange(gameModeIndex, newMode);
              }}
              disabled={routeMatch.path !== ROUTES.GAME_CONFIG_CREATE && !routeMatch.path.endsWith('draft')}
            />
          </FormControl>
          <FormControl>
            <TextField
              id={`o-round-count-${gameModeIndex}`}
              name="o-round-count"
              label="Round count"
              value={gameModeData.overridablePlatformGameModeData.roundCount.value}
              error={gameModeData.overridablePlatformGameModeData.roundCount.error !== ''}
              helperText={gameModeData.overridablePlatformGameModeData.roundCount.error}
              onChange={(e: React.ChangeEvent<{ value: unknown }>) => {
                const value = parseInt(e.target.value as string);
                const newMode = {...gameModeData};
                newMode.overridablePlatformGameModeData = {
                  ...newMode.overridablePlatformGameModeData,
                  roundCount: {
                    ...newMode.overridablePlatformGameModeData.roundCount,
                    value: value,
                    error: isNaN(value) || value < 0 || value > 20 ? 'mandatory field; value should be min 0 and max 20' : '',
                  }
                }
                fieldChange(gameModeIndex, newMode);
              }}
              type="number"
              inputProps={{ min: 0, max: 20 }}
              disabled={routeMatch.path !== ROUTES.GAME_CONFIG_CREATE && !routeMatch.path.endsWith('draft')}
            />
          </FormControl>
          <FormControl>
            <TextField
              id={`o-game-color-${gameModeIndex}`}
              name="o-game-color"
              label="Game color"
              value={gameModeData.overridablePlatformGameModeData.gameColor.value}
              error={gameModeData.overridablePlatformGameModeData.gameColor.error !== ''}
              helperText={gameModeData.overridablePlatformGameModeData.gameColor.error}
              onChange={(e: React.ChangeEvent<{ value: unknown }>) => {
                const value = e.target.value as string;
                const newMode = {...gameModeData};
                newMode.overridablePlatformGameModeData = {
                  ...newMode.overridablePlatformGameModeData,
                  gameColor: {
                    ...newMode.overridablePlatformGameModeData.gameColor,
                    value: value,
                    error: !value ? 'mandatory field' : '',
                  }
                }
                fieldChange(gameModeIndex, newMode);
              }}
              disabled={routeMatch.path !== ROUTES.GAME_CONFIG_CREATE && !routeMatch.path.endsWith('draft')}
            />
          </FormControl>
          <div style={{ display: 'flex' }}>
            <InlineFormControl>
              <TextField
                id="o-difficulty-min-level"
                name="o-difficulty-min-level"
                label="Difficulty min. level"
                value={gameModeData.overridablePlatformGameModeData.difficultyMinLevel.value}
                error={gameModeData.overridablePlatformGameModeData.difficultyMinLevel.error !== ''}
                helperText={gameModeData.overridablePlatformGameModeData.difficultyMinLevel.error}
                onChange={(e: React.ChangeEvent<{ value: unknown }>) => {
                  const value = e.target.value as number;
                  const newMode = {...gameModeData};
                  newMode.overridablePlatformGameModeData = {
                    ...newMode.overridablePlatformGameModeData,
                    difficultyMinLevel: {
                      ...newMode.overridablePlatformGameModeData.difficultyMinLevel,
                      value: value,
                      error: !value ? 'mandatory field' : '',
                    }
                  }
                  fieldChange(gameModeIndex, newMode);
                }}
                type="number"
                inputProps={{ min: 0 }}
                disabled={routeMatch.path !== ROUTES.GAME_CONFIG_CREATE && !routeMatch.path.endsWith('draft')}
              />
            </InlineFormControl>
            <InlineFormControl>
              <TextField
                id="o-difficulty-max-level"
                name="o-difficulty-max-level"
                label="Difficulty max. level"
                value={gameModeData.overridablePlatformGameModeData.difficultyMaxLevel.value}
                error={gameModeData.overridablePlatformGameModeData.difficultyMaxLevel.error !== ''}
                helperText={gameModeData.overridablePlatformGameModeData.difficultyMaxLevel.error}
                onChange={(e: React.ChangeEvent<{ value: unknown }>) => {
                  const value = e.target.value as number;
                  const newMode = {...gameModeData};
                  newMode.overridablePlatformGameModeData = {
                    ...newMode.overridablePlatformGameModeData,
                    difficultyMaxLevel: {
                      ...newMode.overridablePlatformGameModeData.difficultyMaxLevel,
                      value: value,
                      error: !value ? 'mandatory field' : '',
                    }
                  }
                  fieldChange(gameModeIndex, newMode);
                }}
                type="number"
                inputProps={{ min: 0 }}
                disabled={routeMatch.path !== ROUTES.GAME_CONFIG_CREATE && !routeMatch.path.endsWith('draft')}
              />
            </InlineFormControl>
          </div>
          <Typography variant="h5" mb={4}>Bot Config</Typography>
          {gameModeData.overridablePlatformGameModeData.botConfig &&
            <Fragment>
              <div className="indent" style={{ display: 'flex' }}>
                <FormControlLabel
                  label="botsWithTrueSkills"
                  control={
                    <Checkbox
                      id={`botsWithTrueSkills-field-${gameModeIndex}`}
                      name="botsWithTrueSkills-f"
                      inputProps={{ 'aria-label': 'botsWithTrueSkills?' }}
                      checked={Boolean(gameModeData.overridablePlatformGameModeData.botConfig.botsWithTrueSkills.value)}
                      disabled={routeMatch.path !== ROUTES.GAME_CONFIG_CREATE && !routeMatch.path.endsWith('draft')}
                      onChange={(e: React.ChangeEvent<{ value: unknown, checked: boolean }>) => {
                        const value = e.target.value as number;
                        const gameModeCopy = [...form.gameModeDataList];
                        const newMode = {...gameModeData};
                        if (newMode.overridablePlatformGameModeData.botConfig) {
                          newMode.overridablePlatformGameModeData = {
                            ...newMode.overridablePlatformGameModeData,
                            botConfig: {
                              ...newMode.overridablePlatformGameModeData.botConfig,
                              botsWithTrueSkills: {
                                ...newMode.overridablePlatformGameModeData.botConfig.botsWithTrueSkills,
                                value: e.target.checked,
                              }
                            }
                          }
                          gameModeCopy.splice(gameModeIndex, 1);
                          gameModeCopy.splice(gameModeIndex, 0, newMode);
                          dispatch(setGameConfigForm({
                            ...form,
                            _isFormTouched: true,
                            gameModeDataList: gameModeCopy
                          }));
                        } else {
                          console.warn('botsWithTrueSkills is null/undefined');
                        }
                      }}
                    />
                  }
                />
                {gameModeData.overridablePlatformGameModeData.botConfig.botsWithTrueSkills.value &&
                <InlineFormControl>
                  <TextField
                    id="o-true-skill-levels"
                    name="o-true-skill-levels"
                    label="True skill levels"
                    style={{ marginBottom: 0 }}
                    value={gameModeData.overridablePlatformGameModeData.botConfig.trueSkillLevels.value}
                    error={gameModeData.overridablePlatformGameModeData.botConfig.trueSkillLevels.error !== ''}
                    helperText={'enter comma separated list of numbers' || gameModeData.overridablePlatformGameModeData.botConfig.trueSkillLevels.error}
                    onChange={(e: React.ChangeEvent<{ value: unknown }>) => {
                      const value = e.target.value as string;
                      const gameModeCopy = [...form.gameModeDataList];
                      const newMode = {...gameModeData};
                      if (newMode.overridablePlatformGameModeData.botConfig) {
                        newMode.overridablePlatformGameModeData = {
                          ...newMode.overridablePlatformGameModeData,
                          botConfig: {
                            ...newMode.overridablePlatformGameModeData.botConfig,
                            trueSkillLevels: {
                              ...newMode.overridablePlatformGameModeData.botConfig.trueSkillLevels,
                              value: value,
                            }
                          }
                        }
                        gameModeCopy.splice(gameModeIndex, 1);
                        gameModeCopy.splice(gameModeIndex, 0, newMode);
                        dispatch(setGameConfigForm({
                          ...form,
                          _isFormTouched: true,
                          gameModeDataList: gameModeCopy
                        }));
                      } else {
                        console.warn('trueSkillLevels is null/undefined');
                      }
                    }}
                    inputProps={{ min: 0 }}
                    disabled={routeMatch.path !== ROUTES.GAME_CONFIG_CREATE && !routeMatch.path.endsWith('draft')}
                  />
                </InlineFormControl>}
              </div>
              <div className="indent" style={{ display: 'flex' }}>
                <InlineFormControl>
                  <TextField
                    id={`o-bot-min-level-${gameModeIndex}`}
                    name="o-bot-min-level"
                    label="Bot min. level"
                    value={gameModeData.overridablePlatformGameModeData.botConfig.botMinLevel.value}
                    error={gameModeData.overridablePlatformGameModeData.botConfig.botMinLevel.error !== ''}
                    helperText={gameModeData.overridablePlatformGameModeData.botConfig.botMinLevel.error}
                    onChange={(e: React.ChangeEvent<{ value: unknown }>) => {
                      const value = e.target.value as number;
                      const gameModeCopy = [...form.gameModeDataList];
                      const newMode = {...gameModeData};
                      if (newMode.overridablePlatformGameModeData.botConfig) {
                        newMode.overridablePlatformGameModeData = {
                          ...newMode.overridablePlatformGameModeData,
                          botConfig: {
                            ...newMode.overridablePlatformGameModeData.botConfig,
                            botMinLevel: {
                              ...newMode.overridablePlatformGameModeData.botConfig.botMinLevel,
                              value: value,
                              error: isNaN(value) || value < 0 ? 'mandatory field; should be >= 0' : '',
                            }
                          }
                        }
                        gameModeCopy.splice(gameModeIndex, 1);
                        gameModeCopy.splice(gameModeIndex, 0, newMode);
                        dispatch(setGameConfigForm({
                          ...form,
                          _isFormTouched: true,
                          gameModeDataList: gameModeCopy
                        }));
                      } else {
                        console.warn('botConfig is null/undefined');
                      }
                    }}
                    type="number"
                    inputProps={{ min: 0 }}
                    disabled={routeMatch.path !== ROUTES.GAME_CONFIG_CREATE && !routeMatch.path.endsWith('draft')}
                  />
                </InlineFormControl>
                <InlineFormControl>
                  <TextField
                    id={`o-bot-max-level-${gameModeIndex}`}
                    name="o-bot-max-level"
                    label="Bot max. level"
                    value={gameModeData.overridablePlatformGameModeData.botConfig.botMaxLevel.value}
                    error={gameModeData.overridablePlatformGameModeData.botConfig.botMaxLevel.error !== ''}
                    helperText={gameModeData.overridablePlatformGameModeData.botConfig.botMaxLevel.error}
                    onChange={(e: React.ChangeEvent<{ value: unknown }>) => {
                      const value = e.target.value as number;
                      const gameModeCopy = [...form.gameModeDataList];
                      const newMode = {...gameModeData};
                      if (newMode.overridablePlatformGameModeData.botConfig) {
                        newMode.overridablePlatformGameModeData = {
                          ...newMode.overridablePlatformGameModeData,
                          botConfig: {
                            ...newMode.overridablePlatformGameModeData.botConfig,
                            botMaxLevel: {
                              ...newMode.overridablePlatformGameModeData.botConfig.botMaxLevel,
                              value: value,
                              error: isNaN(value) || value < 0 ? 'mandatory field; should be >= 0' : '',
                            }
                          }
                        }
                        gameModeCopy.splice(gameModeIndex, 1);
                        gameModeCopy.splice(gameModeIndex, 0, newMode);
                        dispatch(setGameConfigForm({
                          ...form,
                          _isFormTouched: true,
                          gameModeDataList: gameModeCopy
                        }));
                      } else {
                        console.warn('botConfig is null/undefined');
                      }
                    }}
                    type="number"
                    inputProps={{ min: 0 }}
                    disabled={routeMatch.path !== ROUTES.GAME_CONFIG_CREATE && !routeMatch.path.endsWith('draft')}
                  />
                </InlineFormControl>
              </div>
            </Fragment>
          }
          {(gameModeData.overridablePlatformGameModeData.botConfig === null ||
            gameModeData.overridablePlatformGameModeData.botConfig === undefined) &&
            <Button
              variant="outlined"
              color="primary"
              disabled={!routeMatch.path.endsWith('draft')}
              onClick={e => {
                const newMode = {...gameModeData};
                newMode.overridablePlatformGameModeData = {
                  ...newMode.overridablePlatformGameModeData,
                  botConfig: defaultBotConfigField
                }
                fieldChange(gameModeIndex, newMode);
              }}
            >
              Add Bot Config
            </Button>
          }
          {gameModeData.overridablePlatformGameModeData.botConfig && botConfigForms.length > 0 &&
          <div className="indent">
            <Typography variant="h5">Multiplayer bot config</Typography>
            <ul>
              {Object.keys(gameModeData.overridablePlatformGameModeData.botConfig?.multiPlayerBotConfig || {})
                .map(percentKey =>
                  <li key={percentKey}>
                    percent: {percentKey};&nbsp;
                    nth player:&nbsp;
                    {gameModeData.overridablePlatformGameModeData.botConfig?.multiPlayerBotConfig[parseInt(percentKey)].value}
                    <IconButton
                      onClick={e => removeMultiplayerBotConfigEntry(
                        gameModeIndex,
                        percentKey,
                        gameModeData.overridablePlatformGameModeData.botConfig?.multiPlayerBotConfig || {}
                      )}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </li>
              )}
            </ul>
            <FormControl>
              <TextField
                key={gameModeIndex}
                id={`gc-multiPlayerBotConfig-seconds-${gameModeIndex}`}
                name="gc-game-multiPlayerBotConfig-seconds"
                label="Percentage"
                value={botConfigForms[gameModeIndex].percentage}
                error={isNaN(botConfigForms[gameModeIndex].percentage) ||
                  botConfigForms[gameModeIndex].percentage < 0 ||
                  botConfigForms[gameModeIndex].percentage > 100}
                helperText="Percent of 1 minute after which bot should be found"
                type="number"
                inputProps={{ min: 0 }}
                onChange={(e: React.ChangeEvent<{ value: unknown }>) => {
                  const newValue = parseInt(e.target.value as string);
                  let error = '';
                  if (Object.keys(gameModeData.overridablePlatformGameModeData.botConfig?.multiPlayerBotConfig || {})
                  .includes(newValue + '')) {
                    error = 'this entry exists';
                  } else if (newValue <= 0 || newValue > 100) {
                    error = 'percentage should be > 0 & <= 100';
                  }
                  let newForms: TBotConfigForm[] = [ ...botConfigForms ];
                  newForms.splice(gameModeIndex, 1, {
                    ...botConfigForms[gameModeIndex],
                    error,
                    percentage: newValue
                  });
                  setBotConfigForms(newForms);
                  validateMPBots(
                    gameModeIndex,
                    newValue,
                    botConfigForms[gameModeIndex].nth,
                    gameModeData.overridablePlatformGameModeData.botConfig?.multiPlayerBotConfig || {},
                    multiplayerNthBotMap,
                    newForms
                  );
                }}
              />
            </FormControl>
            <FormControl>
              <TextField
                key={gameModeIndex}
                id={`gc-multiPlayerBotConfig-nth-${gameModeIndex}`}
                name="gc-game-multiPlayerBotConfig-nth"
                label="Nth player"
                value={botConfigForms[gameModeIndex].nth}
                error={isNaN(botConfigForms[gameModeIndex].nth) ||
                  botConfigForms[gameModeIndex].nth < 0}
                helperText="Nth player"
                type="number"
                inputProps={{ min: 0 }}
                onChange={(e: React.ChangeEvent<{ value: unknown }>) => {
                  const newValue = parseInt(e.target.value as string);
                  let newForms: TBotConfigForm[] = [ ...botConfigForms ];
                  newForms.splice(gameModeIndex, 1, {
                    ...botConfigForms[gameModeIndex],
                    nth: newValue
                  });
                  setBotConfigForms([ ...newForms ]);
                  validateMPBots(
                    gameModeIndex,
                    botConfigForms[gameModeIndex].percentage,
                    newValue,
                    gameModeData.overridablePlatformGameModeData.botConfig?.multiPlayerBotConfig || {},
                    multiplayerNthBotMap,
                    newForms
                  );
                }}
              />
            </FormControl>
            {botConfigForms[gameModeIndex].error.length > 0 &&
              <p className={classes.fieldError}>{botConfigForms[gameModeIndex].error}</p>}
            <Button variant="outlined" color="primary"
              onClick={e => addMultiplayerBotConfigEntry(
                gameModeIndex,
                gameModeData.overridablePlatformGameModeData.botConfig?.multiPlayerBotConfig || {}
              )}
              disabled={(routeMatch.path !== ROUTES.GAME_CONFIG_CREATE && !routeMatch.path.endsWith('draft')) ||
                isNaN(botConfigForms[gameModeIndex].percentage) ||
                isNaN(botConfigForms[gameModeIndex].nth) ||
                botConfigForms[gameModeIndex].error.length > 0}
            >
              Add entry
            </Button>
          </div>}
          <Typography variant="h5" mt={8} mb={4}>Image Data List</Typography>
          {gameModeData.overridablePlatformGameModeData.imageDataList.map((imageData, index) =>
            <div className="indent" key={index}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Typography variant="h6" my={4}>Image Data {gameModeIndex + 1}{String.fromCharCode(index + 65)}</Typography>
                  {gameModeData.overridablePlatformGameModeData.imageDataList.length > 0 && routeMatch.path === ROUTES.GAME_CONFIG_CREATE &&
                    <IconButton color="primary"
                      onClick={e => deleteImageData(gameModeIndex, index)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  }
                </div>
              <FormControl>
                <TextField
                  id={`idl-type-${gameModeIndex}-${index}`}
                  name="idl-type"
                  label="Type"
                  value={imageData.type.value}
                  error={imageData.type.error !== ''}
                  helperText={imageData.type.error}
                  onChange={(e: React.ChangeEvent<{ value: unknown }>) => {
                    const imageDataCopy = [...form.gameModeDataList[gameModeIndex].overridablePlatformGameModeData.imageDataList];
                    imageDataCopy[index] = {
                      ...imageDataCopy[index],
                      type: {
                        ...imageDataCopy[index].type,
                        value: e.target.value as string
                      }
                    }
                    const gameModeCopy = [...form.gameModeDataList];
                    const newGameMode = {
                      ...gameModeCopy[gameModeIndex],
                      overridablePlatformGameModeData: {
                        ...gameModeCopy[gameModeIndex].overridablePlatformGameModeData,
                        imageDataList: [...imageDataCopy]
                      }
                    };
                    gameModeCopy.splice(gameModeIndex, 1);
                    gameModeCopy.splice(gameModeIndex, 0, newGameMode);
                    dispatch(setGameConfigForm({
                      ...form,
                      _isFormTouched: true,
                      gameModeDataList: [...gameModeCopy]
                    }));
                  }}
                  disabled={routeMatch.path !== ROUTES.GAME_CONFIG_CREATE && !routeMatch.path.endsWith('draft')}
                />
              </FormControl>
              <FormControl>
                <TextField
                  id={`idl-url-${gameModeIndex}-${index}`}
                  name="idl-url"
                  label="URL"
                  value={imageData.url.value}
                  error={imageData.url.error !== ''}
                  helperText={imageData.url.error}
                  onChange={(e: React.ChangeEvent<{ value: unknown }>) => {
                    const imageDataCopy = [...form.gameModeDataList[gameModeIndex].overridablePlatformGameModeData.imageDataList];
                    imageDataCopy[index] = {
                      ...imageDataCopy[index],
                      url: {
                        ...imageDataCopy[index].url,
                        value: e.target.value as string
                      }
                    }
                    const gameModeCopy = [...form.gameModeDataList];
                    const newGameMode = {
                      ...gameModeCopy[gameModeIndex],
                      overridablePlatformGameModeData: {
                        ...gameModeCopy[gameModeIndex].overridablePlatformGameModeData,
                        imageDataList: [...imageDataCopy]
                      }
                    };
                    gameModeCopy.splice(gameModeIndex, 1);
                    gameModeCopy.splice(gameModeIndex, 0, newGameMode);
                    dispatch(setGameConfigForm({
                      ...form,
                      _isFormTouched: true,
                      gameModeDataList: [...gameModeCopy]
                    }));
                  }}
                  disabled={routeMatch.path !== ROUTES.GAME_CONFIG_CREATE && !routeMatch.path.endsWith('draft')}
                />
              </FormControl>
              <FormControl>
                <TextField
                  id={`aspect-ratio-${gameModeIndex}-${index}`}
                  name="aspect-ratio"
                  label="Aspect ratio"
                  value={imageData.aspectRatio.value}
                  error={imageData.aspectRatio.error !== ''}
                  helperText={imageData.aspectRatio.error}
                  onChange={(e: React.ChangeEvent<{ value: unknown }>) => {
                    const imageDataCopy = [...form.gameModeDataList[gameModeIndex].overridablePlatformGameModeData.imageDataList];
                    imageDataCopy[index] = {
                      ...imageDataCopy[index],
                      aspectRatio: {
                        ...imageDataCopy[index].aspectRatio,
                        value: e.target.value as string
                      }
                    }
                    const gameModeCopy = [...form.gameModeDataList];
                    const newGameMode = {
                      ...gameModeCopy[gameModeIndex],
                      overridablePlatformGameModeData: {
                        ...gameModeCopy[gameModeIndex].overridablePlatformGameModeData,
                        imageDataList: [...imageDataCopy]
                      }
                    };
                    gameModeCopy.splice(gameModeIndex, 1);
                    gameModeCopy.splice(gameModeIndex, 0, newGameMode);
                    dispatch(setGameConfigForm({
                      ...form,
                      _isFormTouched: true,
                      gameModeDataList: [...gameModeCopy]
                    }));
                  }}
                  disabled={routeMatch.path !== ROUTES.GAME_CONFIG_CREATE && !routeMatch.path.endsWith('draft')}
                />
              </FormControl>
            </div>
          )}
          {(routeMatch.path === ROUTES.GAME_CONFIG_CREATE ||
            routeMatch.path === ROUTES.GAME_CONFIG_DRAFT) &&
            <Button variant="outlined" color="primary"
              onClick={e => addImageData(gameModeIndex)}
            >
              <AddIcon /> Add Image Data
            </Button>
          }
        </div>
      )}
      {(routeMatch.path === ROUTES.GAME_CONFIG_CREATE ||
        routeMatch.path === ROUTES.GAME_CONFIG_DRAFT) &&
        <Button variant="outlined" color="primary"
          onClick={e => addGameMode()}
        >
          <AddIcon /> Add Game Mode
        </Button>
      }
    </Fragment>
  );
}

export default GameModeFields;
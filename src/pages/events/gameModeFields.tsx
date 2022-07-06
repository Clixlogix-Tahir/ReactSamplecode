/* eslint-disable react-hooks/exhaustive-deps */
import {
  Button, Checkbox, FormControl, FormControlLabel, IconButton, Input,
  InputAdornment,
  InputLabel, MenuItem, Select, TextField,
  Typography as MuiTypography
} from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';
import { Alert } from '@material-ui/lab';
import { display, spacing } from '@material-ui/system';
import React, { Fragment, useEffect, useState } from 'react';
import styled from 'styled-components';
import { URL_SEARCH_KEY_EVENT_TYPE } from '../../common/constants';
import {
  useAppDispatch,
  useAppSelector,
  useUrlQuery
} from '../../common/hooks';
import { filterUniques } from '../../common/utils';
import globalStyles from '../../theme/globalStyles';
import { EEventCategory, IEventBattleForm, TMutateProps, TOverridableBotConfigFields } from '../../types/eventTypes';
import { TFormFieldNumber } from '../../types/formFields';
import { EBotLogics, EVersions, TImageDataField } from '../../types/gameConfigTypes';
import { toGameConfigForm } from '../game-config/converters';
import { defaultBotLogic, setEventForm } from './eventSlice';

const Typography = styled(MuiTypography)`${spacing}; ${display}`;

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const defaultWinQualificationJson =
`{
  "and": [
    {
      "<=": [
        "2",
        {"var": ["coreGameStats0"]}
      ]
    },
    {
      ">=": [
        "5",
        {"var": ["coreGameStats0"]}
      ]
    },
    {
      ">=": [
        "7",
        {"var": ["coreGameStats1"]}
      ]
    }
  ]
}`;

function GameModeFields({ mutateMode }: TMutateProps) {
  const dispatch = useAppDispatch();
  const classes = globalStyles();
  const searchQuery = useUrlQuery();
  const eventCategoryFromUrl: EEventCategory = searchQuery.get(URL_SEARCH_KEY_EVENT_TYPE) as EEventCategory ||
    EEventCategory.BATTLE;
  const { eventForm } = useAppSelector(state => state.eventSlice);
  const { gameData } = useAppSelector(state => state.gameConfigForm);
  const [selectedGame, setSelectedGame] = useState('');
  const [multiPlayerBotConfig_percentage, setMultiPlayerBotConfig_percentage] = useState(0);
  const [multiPlayerBotConfig_nth, setMultiPlayerBotConfig_nth] = useState(0);
  const [multiPlayerBotConfig_error, setMultiPlayerBotConfig_error] = useState('');
  const [multiplayerNthBotMap, setMultiplayerNthBotMap] = useState<{ [key: number]: boolean }>({});

  useEffect(() => {
    // todo selectedGame is being set incorrectly
    // causes overlap of game name with label
    setSelectedGame(Object.keys(eventForm.additionalParams.gameIdToGameDataMap)[0] || '');
  }, [gameData]);

  const updateImageDataList = (
    e: React.ChangeEvent<{ value: unknown }>,
    gameId: string,
    idlIndex: number,
    idlKey: 'type' | 'url' | 'aspectRatio'
  ) => {
    const idl = eventForm.additionalParams.gameIdToGameDataMap[gameId].imageDataList || [];
    const idlCopy = [...idl];
    const newIdl: TImageDataField = {
      ...idlCopy[idlIndex],
      [idlKey]: {
        ...idlCopy[idlIndex].type,
        value: e.target.value as string
      }
    };
    idlCopy.splice(idlIndex, 1);
    idlCopy.splice(idlIndex, 0, newIdl);
    dispatch(setEventForm({
      ...eventForm,
      additionalParams: {
        ...eventForm.additionalParams,
        gameIdToGameDataMap: {
          ...eventForm.additionalParams.gameIdToGameDataMap,
          [gameId]: {
            ...eventForm.additionalParams.gameIdToGameDataMap[gameId],
            imageDataList: idlCopy
          }
        }
      }
    }));
  };

  const addGame = (selectedGame: string) => {
    dispatch(setEventForm({
      ...eventForm,
      additionalParams: {
        ...eventForm.additionalParams,
        gameIdToGameDataMap: {
          // ...eventForm.additionalParams.gameIdToGameDataMap,
          // replace all existing games with current selected game
          // since only 1 game can be in the map
          [selectedGame]: {
            _showDisplayName: false,
            _showImageDataList: false,
            _showRoundCount: false,
            _showGameSpecificParams: false,
            _showGameColor: false,
            _showDuration: false,
            _showPlayerCountPreferences: false,
            _showBotsEnabled: false,
            _showBotConfig: false,
            _showDifficultyMaxLevel: false,
            _showDifficultyMinLevel: false,
            _showBannerRulesText: false,
            _showWinQualificationJson: false,
          }
        }
      }
    }));
  };

  const handleGameIdChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    const { value } = event.target as HTMLSelectElement;
    addGame(value);
    setSelectedGame(value as string);
  };

  const dispatchMultiplayerBotConfigUpdate = (gameId: string, mapCopy: { [key: number]: TFormFieldNumber }) => {
    dispatch(setEventForm({
      ...eventForm,
      additionalParams: {
        ...eventForm.additionalParams,
        gameIdToGameDataMap: {
          ...eventForm.additionalParams.gameIdToGameDataMap,
          [gameId]: {
            ...eventForm.additionalParams.gameIdToGameDataMap[gameId],
            botConfig: {
              ...eventForm.additionalParams.gameIdToGameDataMap[gameId].botConfig || defaultBotLogic,
              multiPlayerBotConfig: mapCopy,
            }
          }
        }
      }
    }));
  };

  const validateMPBots = (gameId: string, mpBotPercent: number, mpBotNth: number) => {
    let errors = '';
    if (Object.keys(eventForm.additionalParams.gameIdToGameDataMap[gameId].botConfig?.multiPlayerBotConfig || {})
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
    setMultiPlayerBotConfig_error(errors)
  };

  const addMultiplayerBotConfigEntry = (gameId: string) => {
    const mapCopy = {
      ...eventForm.additionalParams.gameIdToGameDataMap[gameId].botConfig?.multiPlayerBotConfig,
      [multiPlayerBotConfig_percentage]: {
        value: multiPlayerBotConfig_nth,
        error: '',
        required: true,
      }
    };
    dispatchMultiplayerBotConfigUpdate(gameId, mapCopy);
    multiplayerNthBotMap[multiPlayerBotConfig_nth] = true;
    validateMPBots(gameId, multiPlayerBotConfig_percentage, multiPlayerBotConfig_nth);
  };

  const removeMultiplayerBotConfigEntry = (gameId: string, percentKey: string) => {
    const mapCopy = { ...eventForm.additionalParams.gameIdToGameDataMap[gameId].botConfig?.multiPlayerBotConfig } || {};
    const nthBotMapCopy = { ...multiplayerNthBotMap };
    delete nthBotMapCopy[mapCopy[parseInt(percentKey)].value];
    setMultiplayerNthBotMap(nthBotMapCopy);
    delete mapCopy[parseInt(percentKey)];
    dispatchMultiplayerBotConfigUpdate(gameId, mapCopy);
  };

  return (
    <div>
      {Object.keys(eventForm.additionalParams.gameIdToGameDataMap).map((gameId, gameModeIndex) =>
        <div className="indent" key={gameModeIndex}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography variant="h5">Overrides for <mark>{gameId}</mark></Typography>
          </div>

          {eventCategoryFromUrl === EEventCategory.TOURNAMENT &&
            <FormControlLabel
              label="Override win qualification JSON"
              control={
                <Checkbox
                  id={`Override-winQualificationJson-field-${gameId}`}
                  name="Override-winQualificationJson-f"
                  inputProps={{ 'aria-label': 'winQualificationJson' }}
                  checked={eventForm.additionalParams.gameIdToGameDataMap[gameId]._showWinQualificationJson}
                  disabled={mutateMode === 'View'}
                  onChange={(e: React.ChangeEvent<{ value: unknown, checked: boolean }>) => {
                    let newForm: IEventBattleForm = {
                      ...eventForm,
                      additionalParams: {
                        ...eventForm.additionalParams,
                        gameIdToGameDataMap: {
                          ...eventForm.additionalParams.gameIdToGameDataMap,
                          [gameId]: {
                            ...eventForm.additionalParams.gameIdToGameDataMap[gameId],
                            _showWinQualificationJson: e.target.checked
                          },
                        }
                      }
                    };
                    if (e.target.checked) {
                      newForm = {
                        ...eventForm,
                        additionalParams: {
                          ...eventForm.additionalParams,
                          gameIdToGameDataMap: {
                            ...eventForm.additionalParams.gameIdToGameDataMap,
                            [gameId]: {
                              ...eventForm.additionalParams.gameIdToGameDataMap[gameId],
                              _showWinQualificationJson: e.target.checked,
                              winQualificationJson: {
                                value: defaultWinQualificationJson,
                                error: '',
                                required: true
                              }
                            },
                          }
                        }
                      }
                    } else {
                      delete newForm.additionalParams.gameIdToGameDataMap[gameId].winQualificationJson;
                    }
                    dispatch(setEventForm(newForm));
                  }}
                />
              }
            />
          }
          {eventForm.additionalParams.gameIdToGameDataMap[gameId]._showWinQualificationJson && <FormControl>
            <TextField
              id={`winQualificationJson-${gameModeIndex}`}
              name="winQualificationJson"
              label="Win qualification JSON"
              value={eventForm.additionalParams.gameIdToGameDataMap[gameId].winQualificationJson?.value}
              error={eventForm.additionalParams.gameIdToGameDataMap[gameId].winQualificationJson?.error !== ''}
              helperText={eventForm.additionalParams.gameIdToGameDataMap[gameId].winQualificationJson?.error}
              disabled={mutateMode === 'View'}
              onChange={(e: React.ChangeEvent<{ value: unknown }>) => {
                dispatch(setEventForm({
                  ...eventForm,
                  additionalParams: {
                    ...eventForm.additionalParams,
                    gameIdToGameDataMap: {
                      ...eventForm.additionalParams.gameIdToGameDataMap,
                      [gameId]: {
                        ...eventForm.additionalParams.gameIdToGameDataMap[gameId],
                        winQualificationJson: { value: e.target.value as string, error: '', required: false }
                      }
                    }
                  }
                }));
              }}
              multiline rows={10} rowsMax={20}
              inputProps={{ style: { background: 'rgba(0,0,0,0.05)', fontFamily: 'monospace' }}}
            />
          </FormControl>}

          <FormControlLabel
            label="Override botsEnabled"
            control={
              <Checkbox
                id={`Override-botsEnabled-field-${gameId}`}
                name="Override-botsEnabled-f"
                inputProps={{ 'aria-label': 'botsEnabled' }}
                checked={eventForm.additionalParams.gameIdToGameDataMap[gameId]._showBotsEnabled}
                disabled={mutateMode === 'View'}
                onChange={(e: React.ChangeEvent<{ value: unknown, checked: boolean }>) => {
                  let newForm: IEventBattleForm = {
                    ...eventForm,
                    additionalParams: {
                      ...eventForm.additionalParams,
                      gameIdToGameDataMap: {
                        ...eventForm.additionalParams.gameIdToGameDataMap,
                        [gameId]: {
                          ...eventForm.additionalParams.gameIdToGameDataMap[gameId],
                          _showBotsEnabled: e.target.checked
                        },
                      }
                    }
                  };
                  if (e.target.checked) {
                    // find corresponding live game
                    const liveGame = gameData.data.find(gd => gd.gameId === gameId && gd.version === EVersions.LIVE);
                    newForm = {
                      ...eventForm,
                      additionalParams: {
                        ...eventForm.additionalParams,
                        gameIdToGameDataMap: {
                          ...eventForm.additionalParams.gameIdToGameDataMap,
                          [gameId]: {
                            ...eventForm.additionalParams.gameIdToGameDataMap[gameId],
                            _showBotsEnabled: e.target.checked,
                            botsEnabled: {
                              value: liveGame ? liveGame.gameModeDataList[0].overridablePlatformGameModeData.botsEnabled : true,
                              error: '',
                              required: true
                            }
                          },
                        }
                      }
                    }
                  } else {
                    delete newForm.additionalParams.gameIdToGameDataMap[gameId].botsEnabled;
                  }
                  dispatch(setEventForm(newForm));
                }}
              />
            }
          />
          {eventForm.additionalParams.gameIdToGameDataMap[gameId]._showBotsEnabled && <FormControlLabel
            label="botsEnabled"
            control={
              <Checkbox
                id={`botsEnabled-field-${gameModeIndex}`}
                name="botsEnabled-f"
                inputProps={{ 'aria-label': 'botsEnabled?' }}
                checked={Boolean(eventForm.additionalParams.gameIdToGameDataMap[gameId].botsEnabled?.value)}
                disabled={mutateMode === 'View'}
                onChange={(e: React.ChangeEvent<{ value: unknown, checked: boolean }>) => {
                  dispatch(setEventForm({
                    ...eventForm,
                    additionalParams: {
                      ...eventForm.additionalParams,
                      gameIdToGameDataMap: {
                        ...eventForm.additionalParams.gameIdToGameDataMap,
                        [gameId]: {
                          ...eventForm.additionalParams.gameIdToGameDataMap[gameId],
                          botsEnabled: { value: e.target.checked, error: '', required: false }
                        }
                      }
                    }
                  }));
                }}
              />
            }
          />}

          <FormControlLabel
            label="Override bot config"
            control={
              <Checkbox
                id={`Override-multiPlayerBotConfig-field-${gameId}`}
                name="Override-multiPlayerBotConfig-f"
                inputProps={{ 'aria-label': 'multiPlayerBotConfig' }}
                checked={eventForm.additionalParams.gameIdToGameDataMap[gameId]._showBotConfig}
                disabled={mutateMode === 'View'}
                onChange={(e: React.ChangeEvent<{ value: unknown, checked: boolean }>) => {
                  let newForm: IEventBattleForm = {
                    ...eventForm,
                    additionalParams: {
                      ...eventForm.additionalParams,
                      gameIdToGameDataMap: {
                        ...eventForm.additionalParams.gameIdToGameDataMap,
                        [gameId]: {
                          ...eventForm.additionalParams.gameIdToGameDataMap[gameId],
                          _showBotConfig: e.target.checked
                        },
                      }
                    }
                  };
                  if (e.target.checked) {
                    // find corresponding live game and get it's botConfig
                    const liveGame = gameData.data.find(gd => gd.gameId === gameId && gd.version === EVersions.LIVE);
                    let newBotConfig: TOverridableBotConfigFields = {
                      ...eventForm.additionalParams.gameIdToGameDataMap[gameId].botConfig || defaultBotLogic,
                      multiPlayerBotConfig: {}
                    };
                    if (liveGame) {
                      // assuming gameModeDataList will have at least 1 item.
                      // using botConfig of 1st item.
                      newBotConfig = toGameConfigForm(liveGame).gameModeDataList[0].overridablePlatformGameModeData.botConfig ||
                        { ...newBotConfig };
                    }
                    newForm = {
                      ...eventForm,
                      additionalParams: {
                        ...eventForm.additionalParams,
                        gameIdToGameDataMap: {
                          ...eventForm.additionalParams.gameIdToGameDataMap,
                          [gameId]: {
                            ...eventForm.additionalParams.gameIdToGameDataMap[gameId],
                            _showBotConfig: e.target.checked,
                            botConfig: {
                              ...newBotConfig
                            }
                          },
                        }
                      }
                    }
                  } else {
                    delete newForm.additionalParams.gameIdToGameDataMap[gameId].botConfig;
                  }
                  dispatch(setEventForm(newForm));
                }}
              />
            }
          />
          {eventForm.additionalParams.gameIdToGameDataMap[gameId]._showBotConfig &&
            <div style={{ display: 'flex' }}>
              <FormControlLabel
                label="botsWithTrueSkills"
                control={
                  <Checkbox
                    id={`e-botsWithTrueSkills-field-${gameModeIndex}`}
                    name="e-botsWithTrueSkills-f"
                    inputProps={{ 'aria-label': 'botsWithTrueSkills?' }}
                    checked={Boolean(eventForm.additionalParams.gameIdToGameDataMap[gameId].botConfig?.botsWithTrueSkills.value)}
                    disabled={mutateMode === 'View'}
                    onChange={(e: React.ChangeEvent<{ checked: boolean }>) => {
                      dispatch(setEventForm({
                        ...eventForm,
                        additionalParams: {
                          ...eventForm.additionalParams,
                          gameIdToGameDataMap: {
                            ...eventForm.additionalParams.gameIdToGameDataMap,
                            [gameId]: {
                              ...eventForm.additionalParams.gameIdToGameDataMap[gameId],
                              botConfig: {
                                ...eventForm.additionalParams.gameIdToGameDataMap[gameId].botConfig || defaultBotLogic,
                                botsWithTrueSkills: {
                                  value: e.target.checked,
                                  error: '',
                                  required: true,
                                }
                              }
                            }
                          }
                        }
                      }));
                    }}
                  />
                }
              />
              {eventForm.additionalParams.gameIdToGameDataMap[gameId].botConfig?.botsWithTrueSkills.value &&
              <FormControl>
                <TextField
                  id="e-o-true-skill-levels"
                  name="e-o-true-skill-levels"
                  label="True skill levels"
                  style={{ marginBottom: 0 }}
                  value={eventForm.additionalParams.gameIdToGameDataMap[gameId].botConfig?.trueSkillLevels.value}
                  // error={eventForm.additionalParams.gameIdToGameDataMap[gameId].botConfig?.trueSkillLevels.value !== ''}
                  helperText={'enter comma separated list of numbers' ||
                    eventForm.additionalParams.gameIdToGameDataMap[gameId].botConfig?.trueSkillLevels.error}
                  disabled={mutateMode === 'View'}
                  onChange={(e: React.ChangeEvent<{ value: unknown }>) => {
                    dispatch(setEventForm({
                      ...eventForm,
                      additionalParams: {
                        ...eventForm.additionalParams,
                        gameIdToGameDataMap: {
                          ...eventForm.additionalParams.gameIdToGameDataMap,
                          [gameId]: {
                            ...eventForm.additionalParams.gameIdToGameDataMap[gameId],
                            botConfig: {
                              ...eventForm.additionalParams.gameIdToGameDataMap[gameId].botConfig || defaultBotLogic,
                              trueSkillLevels: {
                                value: e.target.value as string,
                                error: '',
                                required: true,
                              }
                            }
                          }
                        }
                      }
                    }));
                  }}
                />
              </FormControl>}
            </div>
          }
          {eventForm.additionalParams.gameIdToGameDataMap[gameId]._showBotConfig &&
            <div className="indent">
              <Typography variant="h4">Multiplayer bot config</Typography>
              {!Object.keys(eventForm.additionalParams.gameIdToGameDataMap[gameId].botConfig?.multiPlayerBotConfig || {}).length &&
                <Alert severity="warning">Empty</Alert>}
              <ul style={{ paddingLeft: '1rem' }}>
                {Object.keys(eventForm.additionalParams.gameIdToGameDataMap[gameId].botConfig?.multiPlayerBotConfig || {})
                  .map(percentKey =>
                    <li key={percentKey}>
                      percent: {percentKey};&nbsp;
                      nth player:&nbsp;
                      {eventForm.additionalParams.gameIdToGameDataMap[gameId].botConfig?.multiPlayerBotConfig[parseInt(percentKey)].value}
                      <IconButton
                        disabled={mutateMode === 'View'}
                        onClick={e => removeMultiplayerBotConfigEntry(gameId, percentKey)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </li>
                )}
              </ul>
              <FormControl>
                <TextField
                  id={`multiPlayerBotConfig-seconds-${gameModeIndex}`}
                  name="game-multiPlayerBotConfig-seconds"
                  label="Percentage"
                  value={multiPlayerBotConfig_percentage}
                  error={multiPlayerBotConfig_percentage < 0}
                  helperText="Percent of 1 minute after which bot should be found"
                  type="number"
                  inputProps={{ min: 0 }}
                  disabled={mutateMode === 'View'}
                  onChange={(e: React.ChangeEvent<{ value: unknown }>) => {
                    const newValue = parseInt(e.target.value as string);
                    if (Object.keys(eventForm.additionalParams.gameIdToGameDataMap[gameId].botConfig?.multiPlayerBotConfig || {})
                    .includes(newValue + '')) {
                      setMultiPlayerBotConfig_error('this entry exists');
                    } else if (newValue <= 0 || newValue > 100) {
                      setMultiPlayerBotConfig_error('percentage should be > 0 & <= 100');
                    } else {
                      setMultiPlayerBotConfig_error('');
                    }
                    setMultiPlayerBotConfig_percentage(newValue);
                    validateMPBots(gameId, newValue, multiPlayerBotConfig_nth);
                  }}
                />
              </FormControl>
              <FormControl>
                <TextField
                  id={`multiPlayerBotConfig-nth-${gameModeIndex}`}
                  name="game-multiPlayerBotConfig-nth"
                  label="nth bot"
                  value={multiPlayerBotConfig_nth}
                  error={multiPlayerBotConfig_nth < 0}
                  helperText="nth bot"
                  type="number"
                  inputProps={{ min: 0 }}
                  disabled={mutateMode === 'View'}
                  onChange={(e: React.ChangeEvent<{ value: unknown }>) => {
                    const newValue = parseInt(e.target.value as string);
                    setMultiPlayerBotConfig_nth(newValue);
                    validateMPBots(gameId, multiPlayerBotConfig_percentage, newValue);
                  }}
                />
              </FormControl>
              {multiPlayerBotConfig_error.length > 0 &&
                <p className={classes.fieldError}>{multiPlayerBotConfig_error}</p>}
              <Button variant="outlined" color="primary"
                onClick={e => addMultiplayerBotConfigEntry(gameId)}
                disabled={multiPlayerBotConfig_error.length > 0}
              >
                Add entry
              </Button>
            </div>
          }
          {eventForm.additionalParams.gameIdToGameDataMap[gameId]._showBotConfig && <FormControl>
            <InputLabel htmlFor="o-botLogic-field">Bot logic</InputLabel>
            <Select
              input={<Input name="o-botLogic-f" id="o-botLogic-field" />}
              value={eventForm.additionalParams.gameIdToGameDataMap[gameId].botConfig?.botLogic.value}
              disabled={mutateMode === 'View'}
              onChange={(e: React.ChangeEvent<{ value: unknown }>) => {
                dispatch(setEventForm({
                  ...eventForm,
                  additionalParams: {
                    ...eventForm.additionalParams,
                    gameIdToGameDataMap: {
                      ...eventForm.additionalParams.gameIdToGameDataMap,
                      [gameId]: {
                        ...eventForm.additionalParams.gameIdToGameDataMap[gameId],
                        botConfig: {
                          ...eventForm.additionalParams.gameIdToGameDataMap[gameId].botConfig || defaultBotLogic,
                          botLogic: {
                            value: e.target.value as EBotLogics,
                            error: '',
                            required: true,
                          }
                        }
                      }
                    }
                  }
                }));
              }}
              // renderValue={(selected) => (selected as string[]).join(', ')}
              MenuProps={MenuProps}
            >
              {Object.keys(EBotLogics)
                .map(botLogic =>
                <MenuItem value={botLogic} key={botLogic}>
                  {botLogic}
                </MenuItem>
              )}
            </Select>
          </FormControl>}
          {eventForm.additionalParams.gameIdToGameDataMap[gameId]._showBotConfig && <FormControl>
            <TextField
              id={`bot-min-level-${gameModeIndex}`}
              name="bot-min-level"
              label="Bot min level"
              value={eventForm.additionalParams.gameIdToGameDataMap[gameId].botConfig?.botMinLevel.value}
              error={eventForm.additionalParams.gameIdToGameDataMap[gameId].botConfig?.botMinLevel.error !== ''}
              disabled={mutateMode === 'View'}
              onChange={(e: React.ChangeEvent<{ value: unknown }>) => {
                dispatch(setEventForm({
                  ...eventForm,
                  additionalParams: {
                    ...eventForm.additionalParams,
                    gameIdToGameDataMap: {
                      ...eventForm.additionalParams.gameIdToGameDataMap,
                      [gameId]: {
                        ...eventForm.additionalParams.gameIdToGameDataMap[gameId],
                        botConfig: {
                          ...eventForm.additionalParams.gameIdToGameDataMap[gameId].botConfig || defaultBotLogic,
                          botMinLevel: {
                            value: e.target.value as number,
                            error: '',
                            required: true,
                          }
                        }
                      }
                    }
                  }
                }));
              }}
            />
          </FormControl>}
          {eventForm.additionalParams.gameIdToGameDataMap[gameId].botConfig?.botMinLevel.error &&
            <p className={classes.fieldError}>{eventForm.additionalParams.gameIdToGameDataMap[gameId].botConfig?.botMinLevel.error}</p>}
          {eventForm.additionalParams.gameIdToGameDataMap[gameId]._showBotConfig && <FormControl>
            <TextField
              id={`bot-max-level-${gameModeIndex}`}
              name="bot-max-level"
              label="Bot max level"
              value={eventForm.additionalParams.gameIdToGameDataMap[gameId].botConfig?.botMaxLevel.value}
              error={eventForm.additionalParams.gameIdToGameDataMap[gameId].botConfig?.botMaxLevel.error !== ''}
              type="number"
              inputProps={{ min: 1 }}
              disabled={mutateMode === 'View'}
              onChange={(e: React.ChangeEvent<{ value: unknown }>) => {
                dispatch(setEventForm({
                  ...eventForm,
                  additionalParams: {
                    ...eventForm.additionalParams,
                    gameIdToGameDataMap: {
                      ...eventForm.additionalParams.gameIdToGameDataMap,
                      [gameId]: {
                        ...eventForm.additionalParams.gameIdToGameDataMap[gameId],
                        botConfig: {
                          ...eventForm.additionalParams.gameIdToGameDataMap[gameId].botConfig || defaultBotLogic,
                          botMaxLevel: {
                            value: e.target.value as number,
                            error: '',
                            required: true,
                          }
                        }
                      }
                    }
                  }
                }));
              }}
            />
          </FormControl>}
          {eventForm.additionalParams.gameIdToGameDataMap[gameId].botConfig?.botMaxLevel.error &&
            <p className={classes.fieldError}>{eventForm.additionalParams.gameIdToGameDataMap[gameId].botConfig?.botMaxLevel.error}</p>}

          <FormControlLabel
            label="Override display name"
            control={
              <Checkbox
                id={`Override-displayName-field-${gameId}`}
                name="Override-displayName-f"
                inputProps={{ 'aria-label': 'displayName' }}
                checked={eventForm.additionalParams.gameIdToGameDataMap[gameId]._showDisplayName}
                disabled={mutateMode === 'View'}
                onChange={(e: React.ChangeEvent<{ value: unknown, checked: boolean }>) => {
                  let newForm: IEventBattleForm = {
                    ...eventForm,
                    additionalParams: {
                      ...eventForm.additionalParams,
                      gameIdToGameDataMap: {
                        ...eventForm.additionalParams.gameIdToGameDataMap,
                        [gameId]: {
                          ...eventForm.additionalParams.gameIdToGameDataMap[gameId],
                          _showDisplayName: e.target.checked
                        },
                      }
                    }
                  };
                  if (e.target.checked) {
                    // find corresponding live game
                    const liveGame = gameData.data.find(gd => gd.gameId === gameId && gd.version === EVersions.LIVE);
                    newForm = {
                      ...eventForm,
                      additionalParams: {
                        ...eventForm.additionalParams,
                        gameIdToGameDataMap: {
                          ...eventForm.additionalParams.gameIdToGameDataMap,
                          [gameId]: {
                            ...eventForm.additionalParams.gameIdToGameDataMap[gameId],
                            _showDisplayName: e.target.checked,
                            displayName: {
                              value: liveGame ? liveGame.gameModeDataList[0].overridablePlatformGameModeData.displayName : '',
                              error: '',
                              required: true
                            }
                          },
                        }
                      }
                    }
                  } else {
                    delete newForm.additionalParams.gameIdToGameDataMap[gameId].displayName;
                  }
                  dispatch(setEventForm(newForm));
                }}
              />
            }
          />
          {eventForm.additionalParams.gameIdToGameDataMap[gameId]._showDisplayName && <FormControl>
            <TextField
              id={`display-name${gameModeIndex}`}
              name="game-display-name"
              label="Display name"
              value={eventForm.additionalParams.gameIdToGameDataMap[gameId].displayName?.value}
              error={eventForm.additionalParams.gameIdToGameDataMap[gameId].displayName?.error !== ''}
              helperText={eventForm.additionalParams.gameIdToGameDataMap[gameId].displayName?.error}
              disabled={mutateMode === 'View'}
              onChange={(e: React.ChangeEvent<{ value: unknown }>) => {
                dispatch(setEventForm({
                  ...eventForm,
                  additionalParams: {
                    ...eventForm.additionalParams,
                    gameIdToGameDataMap: {
                      ...eventForm.additionalParams.gameIdToGameDataMap,
                      [gameId]: {
                        ...eventForm.additionalParams.gameIdToGameDataMap[gameId],
                        displayName: { value: e.target.value as string, error: '', required: false }
                      }
                    }
                  }
                }));
              }}
            />
          </FormControl>}

          <FormControlLabel
            label="Override game specific params JSON"
            control={
              <Checkbox
                id={`Override-gameSpecificParams-field-${gameId}`}
                name="Override-gameSpecificParams-f"
                inputProps={{ 'aria-label': 'gameSpecificParams' }}
                checked={eventForm.additionalParams.gameIdToGameDataMap[gameId]._showGameSpecificParams}
                disabled={mutateMode === 'View'}
                onChange={(e: React.ChangeEvent<{ value: unknown, checked: boolean }>) => {
                  let newForm: IEventBattleForm = {
                    ...eventForm,
                    additionalParams: {
                      ...eventForm.additionalParams,
                      gameIdToGameDataMap: {
                        ...eventForm.additionalParams.gameIdToGameDataMap,
                        [gameId]: {
                          ...eventForm.additionalParams.gameIdToGameDataMap[gameId],
                          _showGameSpecificParams: e.target.checked
                        },
                      }
                    }
                  };
                  if (e.target.checked) {
                    // find corresponding live game
                    const liveGame = gameData.data.find(gd => gd.gameId === gameId && gd.version === EVersions.LIVE);
                    newForm = {
                      ...eventForm,
                      additionalParams: {
                        ...eventForm.additionalParams,
                        gameIdToGameDataMap: {
                          ...eventForm.additionalParams.gameIdToGameDataMap,
                          [gameId]: {
                            ...eventForm.additionalParams.gameIdToGameDataMap[gameId],
                            _showGameSpecificParams: e.target.checked,
                            gameSpecificParams: {
                              value: liveGame ? liveGame.gameModeDataList[0].overridablePlatformGameModeData.gameSpecificParams : '',
                              error: '',
                              required: true
                            }
                          },
                        }
                      }
                    }
                  } else {
                    delete newForm.additionalParams.gameIdToGameDataMap[gameId].gameSpecificParams;
                  }
                  dispatch(setEventForm(newForm));
                }}
              />
            }
          />
          {eventForm.additionalParams.gameIdToGameDataMap[gameId]._showGameSpecificParams && <FormControl>
            <TextField
              id={`game-specific-params-${gameModeIndex}`}
              name="game-specific-params"
              label="Game Specific Params"
              value={eventForm.additionalParams.gameIdToGameDataMap[gameId].gameSpecificParams?.value}
              error={eventForm.additionalParams.gameIdToGameDataMap[gameId].gameSpecificParams?.error !== ''}
              helperText={eventForm.additionalParams.gameIdToGameDataMap[gameId].gameSpecificParams?.error}
              disabled={mutateMode === 'View'}
              onChange={e => {
                dispatch(setEventForm({
                  ...eventForm,
                  additionalParams: {
                    ...eventForm.additionalParams,
                    gameIdToGameDataMap: {
                      ...eventForm.additionalParams.gameIdToGameDataMap,
                      [gameId]: {
                        ...eventForm.additionalParams.gameIdToGameDataMap[gameId],
                        gameSpecificParams: { value: e.target.value as string, error: '', required: false }
                      }
                    }
                  }
                }));
              }}
              multiline rows={10} rowsMax={20}
              inputProps={{ style: { background: 'rgba(0,0,0,0.05)', fontFamily: 'monospace' }}}
            />
          </FormControl>}

          <FormControlLabel
            label="Override duration"
            control={
              <Checkbox
                id={`Override-duration-field-${gameId}`}
                name="Override-duration-f"
                inputProps={{ 'aria-label': 'duration' }}
                checked={eventForm.additionalParams.gameIdToGameDataMap[gameId]._showDuration}
                disabled={mutateMode === 'View'}
                onChange={(e: React.ChangeEvent<{ value: unknown, checked: boolean }>) => {
                  let newForm: IEventBattleForm = {
                    ...eventForm,
                    additionalParams: {
                      ...eventForm.additionalParams,
                      gameIdToGameDataMap: {
                        ...eventForm.additionalParams.gameIdToGameDataMap,
                        [gameId]: {
                          ...eventForm.additionalParams.gameIdToGameDataMap[gameId],
                          _showDuration: e.target.checked
                        },
                      }
                    }
                  };
                  if (e.target.checked) {
                    // find corresponding live game
                    const liveGame = gameData.data.find(gd => gd.gameId === gameId && gd.version === EVersions.LIVE);
                    newForm = {
                      ...eventForm,
                      additionalParams: {
                        ...eventForm.additionalParams,
                        gameIdToGameDataMap: {
                          ...eventForm.additionalParams.gameIdToGameDataMap,
                          [gameId]: {
                            ...eventForm.additionalParams.gameIdToGameDataMap[gameId],
                            _showDuration: e.target.checked,
                            duration: {
                              value: liveGame ? liveGame.gameModeDataList[0].overridablePlatformGameModeData.duration : 10,
                              error: '',
                              required: true
                            }
                          },
                        }
                      }
                    }
                  } else {
                    delete newForm.additionalParams.gameIdToGameDataMap[gameId].duration;
                  }
                  dispatch(setEventForm(newForm));
                }}
              />
            }
          />
          {eventForm.additionalParams.gameIdToGameDataMap[gameId]._showDuration && <FormControl>
            <TextField
              id={`duration-${gameModeIndex}`}
              name="duration"
              label="Duration"
              value={eventForm.additionalParams.gameIdToGameDataMap[gameId].duration?.value}
              error={eventForm.additionalParams.gameIdToGameDataMap[gameId].duration?.error !== ''}
              helperText={eventForm.additionalParams.gameIdToGameDataMap[gameId].duration?.error}
              InputProps={{
                endAdornment: <InputAdornment position="end">seconds</InputAdornment>
              }}
              disabled={mutateMode === 'View'}
              onChange={(e: React.ChangeEvent<{ value: unknown }>) => {
                dispatch(setEventForm({
                  ...eventForm,
                  additionalParams: {
                    ...eventForm.additionalParams,
                    gameIdToGameDataMap: {
                      ...eventForm.additionalParams.gameIdToGameDataMap,
                      [gameId]: {
                        ...eventForm.additionalParams.gameIdToGameDataMap[gameId],
                        duration: { value: e.target.value as number, error: '', required: false }
                      }
                    }
                  }
                }));
              }}
              type="number"
              inputProps={{ min: 1 }}
            />
          </FormControl>}

          <FormControlLabel
            label="Override player count"
            control={
              <Checkbox
                id={`Override-playerCountPreferences-field-${gameId}`}
                name="Override-playerCountPreferences-f"
                inputProps={{ 'aria-label': 'playerCountPreferences' }}
                checked={eventForm.additionalParams.gameIdToGameDataMap[gameId]._showPlayerCountPreferences}
                disabled={mutateMode === 'View'}
                onChange={(e: React.ChangeEvent<{ value: unknown, checked: boolean }>) => {
                  let newForm: IEventBattleForm = {
                    ...eventForm,
                    additionalParams: {
                      ...eventForm.additionalParams,
                      gameIdToGameDataMap: {
                        ...eventForm.additionalParams.gameIdToGameDataMap,
                        [gameId]: {
                          ...eventForm.additionalParams.gameIdToGameDataMap[gameId],
                          _showPlayerCountPreferences: e.target.checked
                        },
                      }
                    }
                  };
                  if (e.target.checked) {
                    // find corresponding live game
                    const liveGame = gameData.data.find(gd => gd.gameId === gameId && gd.version === EVersions.LIVE);
                    newForm = {
                      ...eventForm,
                      additionalParams: {
                        ...eventForm.additionalParams,
                        gameIdToGameDataMap: {
                          ...eventForm.additionalParams.gameIdToGameDataMap,
                          [gameId]: {
                            ...eventForm.additionalParams.gameIdToGameDataMap[gameId],
                            _showPlayerCountPreferences: e.target.checked,
                            playerCountPreferences: {
                              value: liveGame ? liveGame.gameModeDataList[0].overridablePlatformGameModeData.playerCountPreferences.join(', ') : '2',
                              error: '',
                              required: true
                            }
                          },
                        }
                      }
                    }
                  } else {
                    delete newForm.additionalParams.gameIdToGameDataMap[gameId].playerCountPreferences;
                  }
                  dispatch(setEventForm(newForm));
                }}
              />
            }
          />
          {eventForm.additionalParams.gameIdToGameDataMap[gameId]._showPlayerCountPreferences && <FormControl>
            <TextField
              id={`player-count-pref-${gameModeIndex}`}
              name="player-count-pref"
              label="Player count"
              value={eventForm.additionalParams.gameIdToGameDataMap[gameId].playerCountPreferences?.value}
              error={eventForm.additionalParams.gameIdToGameDataMap[gameId].playerCountPreferences?.error !== ''}
              helperText={eventForm.additionalParams.gameIdToGameDataMap[gameId].playerCountPreferences?.error}
              disabled={mutateMode === 'View'}
              onChange={(e: React.ChangeEvent<{ value: unknown }>) => {
                dispatch(setEventForm({
                  ...eventForm,
                  additionalParams: {
                    ...eventForm.additionalParams,
                    gameIdToGameDataMap: {
                      ...eventForm.additionalParams.gameIdToGameDataMap,
                      [gameId]: {
                        ...eventForm.additionalParams.gameIdToGameDataMap[gameId],
                        playerCountPreferences: { value: e.target.value as string, error: '', required: false }
                      }
                    }
                  }
                }));
              }}
            />
          </FormControl>}

          <FormControlLabel
            label="Override round count"
            control={
              <Checkbox
                id={`Override-round-count-field-${gameId}`}
                name="Override-round-count-f"
                inputProps={{ 'aria-label': 'round-count' }}
                checked={eventForm.additionalParams.gameIdToGameDataMap[gameId]._showRoundCount}
                disabled={mutateMode === 'View'}
                onChange={(e: React.ChangeEvent<{ value: unknown, checked: boolean }>) => {
                  let newForm: IEventBattleForm = {
                    ...eventForm,
                    additionalParams: {
                      ...eventForm.additionalParams,
                      gameIdToGameDataMap: {
                        ...eventForm.additionalParams.gameIdToGameDataMap,
                        [gameId]: {
                          ...eventForm.additionalParams.gameIdToGameDataMap[gameId],
                          _showRoundCount: e.target.checked
                        },
                      }
                    }
                  };
                  if (e.target.checked) {
                    // find corresponding live game
                    const liveGame = gameData.data.find(gd => gd.gameId === gameId && gd.version === EVersions.LIVE);
                    newForm = {
                      ...eventForm,
                      additionalParams: {
                        ...eventForm.additionalParams,
                        gameIdToGameDataMap: {
                          ...eventForm.additionalParams.gameIdToGameDataMap,
                          [gameId]: {
                            ...eventForm.additionalParams.gameIdToGameDataMap[gameId],
                            _showRoundCount: e.target.checked,
                            roundCount: {
                              value: liveGame ? liveGame.gameModeDataList[0].overridablePlatformGameModeData.roundCount : 0,
                              error: '',
                              required: true
                            }
                          },
                        }
                      }
                    }
                  } else {
                    delete newForm.additionalParams.gameIdToGameDataMap[gameId].roundCount;
                  }
                  dispatch(setEventForm(newForm));
                }}
              />
            }
          />
          {eventForm.additionalParams.gameIdToGameDataMap[gameId]._showRoundCount && <FormControl>
            <TextField
              id={`o-round-count-${gameModeIndex}`}
              name="o-round-count"
              label="Round count"
              value={eventForm.additionalParams.gameIdToGameDataMap[gameId].roundCount?.value}
              error={eventForm.additionalParams.gameIdToGameDataMap[gameId].roundCount?.error !== ''}
              helperText={eventForm.additionalParams.gameIdToGameDataMap[gameId].roundCount?.error}
              disabled={mutateMode === 'View'}
              onChange={(e: React.ChangeEvent<{ value: unknown }>) => {
                const value = parseInt(e.target.value as string);
                console.info(value, isNaN(value) ? 'mandatory field' : '')
                dispatch(setEventForm({
                  ...eventForm,
                  additionalParams: {
                    ...eventForm.additionalParams,
                    gameIdToGameDataMap: {
                      ...eventForm.additionalParams.gameIdToGameDataMap,
                      [gameId]: {
                        ...eventForm.additionalParams.gameIdToGameDataMap[gameId],
                        roundCount: {
                          value: value,
                          error: isNaN(value) || value < 0 || value > 20 ? 'mandatory field; value should be min 0 and max 20' : '',
                          required: true
                        }
                      }
                    }
                  }
                }));
              }}
              type="number"
              inputProps={{ min: 0, max: 20 }}
            />
          </FormControl>}

          <FormControlLabel
            label="Override game color"
            control={
              <Checkbox
                id={`Override-game-color-field-${gameId}`}
                name="Override-game-color-f"
                inputProps={{ 'aria-label': 'game-color' }}
                checked={eventForm.additionalParams.gameIdToGameDataMap[gameId]._showGameColor}
                disabled={mutateMode === 'View'}
                onChange={(e: React.ChangeEvent<{ value: unknown, checked: boolean }>) => {
                  let newForm: IEventBattleForm = {
                    ...eventForm,
                    additionalParams: {
                      ...eventForm.additionalParams,
                      gameIdToGameDataMap: {
                        ...eventForm.additionalParams.gameIdToGameDataMap,
                        [gameId]: {
                          ...eventForm.additionalParams.gameIdToGameDataMap[gameId],
                          _showGameColor: e.target.checked
                        },
                      }
                    }
                  };
                  if (e.target.checked) {
                    // find corresponding live game
                    const liveGame = gameData.data.find(gd => gd.gameId === gameId && gd.version === EVersions.LIVE);
                    newForm = {
                      ...eventForm,
                      additionalParams: {
                        ...eventForm.additionalParams,
                        gameIdToGameDataMap: {
                          ...eventForm.additionalParams.gameIdToGameDataMap,
                          [gameId]: {
                            ...eventForm.additionalParams.gameIdToGameDataMap[gameId],
                            _showGameColor: e.target.checked,
                            gameColor: {
                              value: liveGame ? liveGame.gameModeDataList[0].overridablePlatformGameModeData.gameColor : '',
                              error: '',
                              required: true
                            }
                          },
                        }
                      }
                    }
                  } else {
                    delete newForm.additionalParams.gameIdToGameDataMap[gameId].gameColor;
                  }
                  dispatch(setEventForm(newForm));
                }}
              />
            }
          />
          {eventForm.additionalParams.gameIdToGameDataMap[gameId]._showGameColor && <FormControl>
            <TextField
              id={`o-game-color-${gameModeIndex}`}
              name="o-game-color"
              label="Game color"
              value={eventForm.additionalParams.gameIdToGameDataMap[gameId].gameColor?.value}
              error={eventForm.additionalParams.gameIdToGameDataMap[gameId].gameColor?.error !== ''}
              helperText={eventForm.additionalParams.gameIdToGameDataMap[gameId].gameColor?.error}
              disabled={mutateMode === 'View'}
              onChange={(e: React.ChangeEvent<{ value: unknown }>) => {
                const value = e.target.value as string;
                dispatch(setEventForm({
                  ...eventForm,
                  additionalParams: {
                    ...eventForm.additionalParams,
                    gameIdToGameDataMap: {
                      ...eventForm.additionalParams.gameIdToGameDataMap,
                      [gameId]: {
                        ...eventForm.additionalParams.gameIdToGameDataMap[gameId],
                        gameColor: {
                          value: value,
                          error: !value ? 'mandatory field' : '',
                          required: true
                        }
                      }
                    }
                  }
                }));
              }}
            />
          </FormControl>}

          <FormControlLabel
            label="Override difficulty min. level"
            control={
              <Checkbox
                id={`Override-difficultyMinLevel-field-${gameId}`}
                name="Override-difficultyMinLevel-f"
                inputProps={{ 'aria-label': 'difficultyMinLevel' }}
                checked={eventForm.additionalParams.gameIdToGameDataMap[gameId]._showDifficultyMinLevel}
                disabled={mutateMode === 'View'}
                onChange={(e: React.ChangeEvent<{ value: unknown, checked: boolean }>) => {
                  let newForm: IEventBattleForm = {
                    ...eventForm,
                    additionalParams: {
                      ...eventForm.additionalParams,
                      gameIdToGameDataMap: {
                        ...eventForm.additionalParams.gameIdToGameDataMap,
                        [gameId]: {
                          ...eventForm.additionalParams.gameIdToGameDataMap[gameId],
                          _showDifficultyMinLevel: e.target.checked
                        },
                      }
                    }
                  };
                  if (e.target.checked) {
                    // find corresponding live game
                    const liveGame = gameData.data.find(gd => gd.gameId === gameId && gd.version === EVersions.LIVE);
                    newForm = {
                      ...eventForm,
                      additionalParams: {
                        ...eventForm.additionalParams,
                        gameIdToGameDataMap: {
                          ...eventForm.additionalParams.gameIdToGameDataMap,
                          [gameId]: {
                            ...eventForm.additionalParams.gameIdToGameDataMap[gameId],
                            _showDifficultyMinLevel: e.target.checked,
                            difficultyMinLevel: {
                              value: liveGame ? liveGame.gameModeDataList[0].overridablePlatformGameModeData.difficultyMinLevel : 0,
                              error: '',
                              required: true
                            }
                          },
                        }
                      }
                    }
                  } else {
                    delete newForm.additionalParams.gameIdToGameDataMap[gameId].difficultyMinLevel;
                  }
                  dispatch(setEventForm(newForm));
                }}
              />
            }
          />
          {eventForm.additionalParams.gameIdToGameDataMap[gameId]._showDifficultyMinLevel && <FormControl>
            <TextField
              id={`difficulty-min-level-${gameModeIndex}`}
              name="difficulty-min-level"
              label="Difficulty min level"
              value={eventForm.additionalParams.gameIdToGameDataMap[gameId].difficultyMinLevel?.value}
              error={eventForm.additionalParams.gameIdToGameDataMap[gameId].difficultyMinLevel?.error !== ''}
              disabled={mutateMode === 'View'}
              onChange={(e: React.ChangeEvent<{ value: unknown }>) => {
                dispatch(setEventForm({
                  ...eventForm,
                  additionalParams: {
                    ...eventForm.additionalParams,
                    gameIdToGameDataMap: {
                      ...eventForm.additionalParams.gameIdToGameDataMap,
                      [gameId]: {
                        ...eventForm.additionalParams.gameIdToGameDataMap[gameId],
                        difficultyMinLevel: {
                          value: e.target.value as number,
                          error: '',
                          required: false,
                        }
                      }
                    }
                  }
                }));
              }}
            />
          </FormControl>}
          {eventForm.additionalParams.gameIdToGameDataMap[gameId].difficultyMinLevel?.error &&
            <p className={classes.fieldError}>{eventForm.additionalParams.gameIdToGameDataMap[gameId].difficultyMinLevel?.error}</p>}

          <FormControlLabel
            label="Override difficulty max. level"
            control={
              <Checkbox
                id={`Override-difficultyMaxLevel-field-${gameId}`}
                name="Override-difficultyMaxLevel-f"
                inputProps={{ 'aria-label': 'difficultyMaxLevel' }}
                checked={eventForm.additionalParams.gameIdToGameDataMap[gameId]._showDifficultyMaxLevel}
                disabled={mutateMode === 'View'}
                onChange={(e: React.ChangeEvent<{ value: unknown, checked: boolean }>) => {
                  // todo use immutable.js to avoid too many spread operators
                  let newForm: IEventBattleForm = {
                    ...eventForm,
                    additionalParams: {
                      ...eventForm.additionalParams,
                      gameIdToGameDataMap: {
                        ...eventForm.additionalParams.gameIdToGameDataMap,
                        [gameId]: {
                          ...eventForm.additionalParams.gameIdToGameDataMap[gameId],
                          _showDifficultyMaxLevel: e.target.checked
                        },
                      }
                    }
                  };
                  if (e.target.checked) {
                    // find corresponding live game
                    const liveGame = gameData.data.find(gd => gd.gameId === gameId && gd.version === EVersions.LIVE);
                    newForm = {
                      ...eventForm,
                      additionalParams: {
                        ...eventForm.additionalParams,
                        gameIdToGameDataMap: {
                          ...eventForm.additionalParams.gameIdToGameDataMap,
                          [gameId]: {
                            ...eventForm.additionalParams.gameIdToGameDataMap[gameId],
                            _showDifficultyMaxLevel: e.target.checked,
                            difficultyMaxLevel: {
                              value: liveGame ? liveGame.gameModeDataList[0].overridablePlatformGameModeData.difficultyMaxLevel : 0,
                              error: '',
                              required: true
                            }
                          },
                        }
                      }
                    }
                  } else {
                    delete newForm.additionalParams.gameIdToGameDataMap[gameId].difficultyMaxLevel;
                  }
                  dispatch(setEventForm(newForm));
                }}
              />
            }
          />
          {eventForm.additionalParams.gameIdToGameDataMap[gameId]._showDifficultyMaxLevel && <FormControl>
            <TextField
              id={`difficulty-max-level-${gameModeIndex}`}
              name="difficulty-max-level"
              label="Difficulty max level"
              value={eventForm.additionalParams.gameIdToGameDataMap[gameId].difficultyMaxLevel?.value}
              error={eventForm.additionalParams.gameIdToGameDataMap[gameId].difficultyMaxLevel?.error !== ''}
              disabled={mutateMode === 'View'}
              onChange={(e: React.ChangeEvent<{ value: unknown }>) => {
                dispatch(setEventForm({
                  ...eventForm,
                  additionalParams: {
                    ...eventForm.additionalParams,
                    gameIdToGameDataMap: {
                      ...eventForm.additionalParams.gameIdToGameDataMap,
                      [gameId]: {
                        ...eventForm.additionalParams.gameIdToGameDataMap[gameId],
                        difficultyMaxLevel: {
                          value: e.target.value as number,
                          error: '',
                          required: false,
                        }
                      }
                    }
                  }
                }));
              }}
            />
          </FormControl>}
          {eventForm.additionalParams.gameIdToGameDataMap[gameId].botConfig?.botMinLevel.error &&
            <p className={classes.fieldError}>{eventForm.additionalParams.gameIdToGameDataMap[gameId].botConfig?.botMinLevel.error}</p>}

          <FormControlLabel
            label="Override image data list"
            control={
              <Checkbox
                id={`Override-imageDataList-field-${gameId}`}
                name="Override-imageDataList-f"
                inputProps={{ 'aria-label': 'imageDataList' }}
                checked={eventForm.additionalParams.gameIdToGameDataMap[gameId]._showImageDataList}
                disabled={mutateMode === 'View'}
                onChange={(e: React.ChangeEvent<{ value: unknown, checked: boolean }>) => {
                  let newForm: IEventBattleForm = {
                    ...eventForm,
                    additionalParams: {
                      ...eventForm.additionalParams,
                      gameIdToGameDataMap: {
                        ...eventForm.additionalParams.gameIdToGameDataMap,
                        [gameId]: {
                          ...eventForm.additionalParams.gameIdToGameDataMap[gameId],
                          _showImageDataList: e.target.checked
                        },
                      }
                    }
                  };
                  if (e.target.checked) {
                    // find corresponding live game
                    const liveGame = gameData.data.find(gd => gd.gameId === gameId && gd.version === EVersions.LIVE);
                    let idl: TImageDataField[] = [];
                    if (liveGame) {
                      const liveGameForm = toGameConfigForm(liveGame);
                      idl = liveGameForm.gameModeDataList[0].overridablePlatformGameModeData.imageDataList;
                    }
                    newForm = {
                      ...eventForm,
                      additionalParams: {
                        ...eventForm.additionalParams,
                        gameIdToGameDataMap: {
                          ...eventForm.additionalParams.gameIdToGameDataMap,
                          [gameId]: {
                            ...eventForm.additionalParams.gameIdToGameDataMap[gameId],
                            _showImageDataList: e.target.checked,
                            imageDataList: idl
                          },
                        }
                      }
                    }
                  } else {
                    delete newForm.additionalParams.gameIdToGameDataMap[gameId].imageDataList;
                  }
                  dispatch(setEventForm(newForm));
                }}
              />
            }
          />
          {eventForm.additionalParams.gameIdToGameDataMap[gameId]._showImageDataList &&
          <Fragment>
            <Typography variant="h4" mt={8}>Image Data List</Typography>
            {eventForm.additionalParams.gameIdToGameDataMap[gameId].imageDataList?.map((imageData: TImageDataField, idlIndex: number) =>
              <div className="indent" key={idlIndex}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Typography variant="h5">Image Data {gameModeIndex + 1}{String.fromCharCode(idlIndex + 65)}</Typography>
                  {/* {eventForm.additionalParams.gameIdToGameDataMap[gameId].imageDataList?.length > 0 && */}
                    <IconButton color="primary"
                      disabled={mutateMode === 'View'}
                      onClick={e => {
                        const idl = eventForm.additionalParams.gameIdToGameDataMap[gameId].imageDataList || [];
                        const idlCopy = [...idl];
                        idlCopy.splice(gameModeIndex, 1);
                        dispatch(setEventForm({
                          ...eventForm,
                          additionalParams: {
                            ...eventForm.additionalParams,
                            gameIdToGameDataMap: {
                              ...eventForm.additionalParams.gameIdToGameDataMap,
                              [gameId]: {
                                ...eventForm.additionalParams.gameIdToGameDataMap[gameId],
                                imageDataList: [...idlCopy]
                              },
                            }
                          }
                        }));
                      }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  {/* } */}
                </div>
              <FormControl>
                <TextField
                  id={`idl-type-${gameModeIndex}-${idlIndex}`}
                  name="idl-type"
                  label="Type"
                  value={imageData.type.value}
                  error={imageData.type.error !== ''}
                  helperText={imageData.type.error}
                  disabled={mutateMode === 'View'}
                  onChange={e => updateImageDataList(e, gameId, idlIndex, 'type')}
                />
              </FormControl>
              <FormControl>
                <TextField
                  id={`idl-url-${gameModeIndex}-${idlIndex}`}
                  name="idl-url"
                  label="URL"
                  value={imageData.url.value}
                  error={imageData.url.error !== ''}
                  helperText={imageData.url.error}
                  disabled={mutateMode === 'View'}
                  onChange={e => updateImageDataList(e, gameId, idlIndex, 'url')}
                />
              </FormControl>
              <FormControl>
                <TextField
                  id={`aspect-ratio-${gameModeIndex}-${idlIndex}`}
                  name="aspect-ratio"
                  label="Aspect ratio"
                  value={imageData.aspectRatio.value}
                  error={imageData.aspectRatio.error !== ''}
                  helperText={imageData.aspectRatio.error}
                  disabled={mutateMode === 'View'}
                  onChange={e => updateImageDataList(e, gameId, idlIndex, 'aspectRatio')}
                />
              </FormControl>
            </div>
          )}
          <Button variant="outlined" color="primary"
            disabled={mutateMode === 'View'}
            onClick={e => {
              const idlCopy = eventForm.additionalParams.gameIdToGameDataMap[gameId].imageDataList || [];
              dispatch(setEventForm({
                ...eventForm,
                additionalParams: {
                  ...eventForm.additionalParams,
                  gameIdToGameDataMap: {
                    ...eventForm.additionalParams.gameIdToGameDataMap,
                    [gameId]: {
                      ...eventForm.additionalParams.gameIdToGameDataMap[gameId],
                      imageDataList: [
                        ...idlCopy,
                        {
                          type: { value: '', error: '', required: false },
                          url: { value: '', error: '', required: false },
                          aspectRatio: { value: '', error: '', required: false },
                        }
                      ]
                    },
                  }
                }
              }));
            }}
          >
            <AddIcon /> Add Image Data
          </Button>
        </Fragment>}
        </div>
        )}

      <hr />
      <FormControl>
        {/* todo add a multi select here */}
        <InputLabel htmlFor="select-gmdl-field">Select game(s)</InputLabel>
        <Select
          input={<Input name="select-gmdl-f" id="select-gmdl-field" />}
          value={selectedGame}
          disabled={mutateMode === 'View'}
          onChange={handleGameIdChange}
          // renderValue={(selected) => (selected as string[]).join(', ')}
          MenuProps={MenuProps}
        >
          <MenuItem value="" />
          {gameData.data
            .map(gameConfig => gameConfig.gameId).filter(filterUniques).map(gameId =>
            <MenuItem value={gameId} key={gameId}
              disabled={!Boolean(gameData.data.find(gd => gd.version !== EVersions.DRAFT && gd.gameId === gameId))}
            >
              {`${gameId} ${Boolean(gameData.data.find(gd => gd.version !== EVersions.DRAFT && gd.gameId === gameId)) ? '' : '(draft)'}`}
            </MenuItem>
          )}
        </Select>
      </FormControl>
    </div>
  );
}

export default GameModeFields;

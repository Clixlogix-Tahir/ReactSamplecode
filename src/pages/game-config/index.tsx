/* eslint-disable react-hooks/exhaustive-deps */
import React, { Fragment, useEffect, useState } from "react";
import styled from "styled-components";

import { Helmet } from 'react-helmet';

import {
  CardContent,
  Grid,
  Button as MuiButton,
  Card as MuiCard,
  Typography as MuiTypography,
  Input,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Checkbox,
  FormControlLabel,
  Paper,
  Tabs,
  Tab,
  IconButton,
  InputAdornment,
  FormLabel,
  RadioGroup,
  Radio,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  useMediaQuery,
  useTheme
} from "@material-ui/core";
import DeleteIcon from '@material-ui/icons/Delete';
import { spacing, display } from "@material-ui/system";
import { defaultGameConfigForm, getGameDataDispatcher,
  setGameConfigForm, setSelectedGame, defaultAndroidPlatformData,
  defaultIOSPlatformData, deleteGameDispatcher, setShowConfigNotFound, setGameConfigCanBeDeployed,
  setAppChangedInDropdown,
} from "./gameConfigSlice";
import { EBotLogics, EOrientations, EPlatforms, EScoringTypes,
  ETutorialTypes, EVersions, TGameConfigPayload, EEngineTypes,
} from "../../types/gameConfigTypes";
import { Link, useRouteMatch } from "react-router-dom";
import { CONSTANTS, GAME_VERSION_FROM_ROUTE, ROUTES, URL_PART_GAME_ID, XHR_STATE } from "../../common/constants";
import { Alert } from "@material-ui/lab";
import globalStyles from "../../theme/globalStyles";
import { ECountryCode } from "../../types/eventTypes";
import { getGameConfigNewRoute } from "../../components/Header";
import GameModeFields from "./gameModeFields";
import {
  useAppDispatch,
  useAppRedirect,
  useAppSelector,
  useShouldShowPlaceholder
} from "../../common/hooks";
import LoaderPaper from "../../components/LoaderPaper";
import { toGameConfigForm } from "./converters";
import NoAppPlaceholder from "../../components/no-app-placeholder";
import produce from "immer";


const GameConfigPage = styled.div`
  // .MuiTypography-h3 {
  //   margin-top: 1rem;
  // }
  .MuiFormControlLabel-root {
    display: block;
  }
  .MuiFormControl-root {
    display: block;
    margin-bottom: 2rem;
  }
  .MuiInput-formControl {
    width: 100%;
  }
  .indent {
    padding: 8px 8px 8px 16px;
    margin-bottom: 8px;
    background-color: rgb(25 118 210 / 7%);
    border-radius: 4px;
  }
`;

const Card = styled(MuiCard)`
  ${spacing};

  box-shadow: none;
`;

const Shadow = styled.div`
  box-shadow: ${props => props.theme.shadows[1]};
`;

const Button = styled(MuiButton)(spacing);

// const Typography = styled(MuiTypography)(display);
const Typography = styled(MuiTypography)`${spacing}; ${display}`;

export const gameConfigRouteSuffixToFullRoute = (route: string): string => {
  if (route.endsWith('/current-live')) return ROUTES.GAME_CONFIG_CURRENT_LIVE;
  if (route.endsWith('/previous-live')) return ROUTES.GAME_CONFIG_PREVIOUS_LIVE;
  if (route.endsWith('/current-test')) return ROUTES.GAME_CONFIG_CURRENT_TEST;
  return ROUTES.GAME_CONFIG_DRAFT;
};

function GameConfig() {
  const { appChangedInDropdown, deleteGame, form, selectedApp, selectedGame,
    apps, gameData, showConfigNotFound,
  } = useAppSelector(state => state.gameConfigForm);
  const dispatch = useAppDispatch();
  const classes = globalStyles();
  const routeMatch = useRouteMatch();
  const redirectTo = useAppRedirect();
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const shouldShowPlaceholder = useShouldShowPlaceholder();
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [selectedTab, setSelectedTab] = useState('');

  useEffect(() => {
    if (routeMatch.path === ROUTES.GAME_CONFIG_CREATE) {
      dispatch(setGameConfigCanBeDeployed(false));
    }
  }, []);

  useEffect(() => {
    if (selectedGame !== CONSTANTS.MISC.GAME_TYPE_NEW_GAME && Array.isArray(gameData.data)) {
      const foundGame: undefined | TGameConfigPayload = gameData.data
      .find(
        game => game.gameId === selectedGame
        && game.version === GAME_VERSION_FROM_ROUTE[gameConfigRouteSuffixToFullRoute(routeMatch.path)]
        && game.appId === selectedApp
        );
      // console.info('foundGame', foundGame);
      dispatch(setShowConfigNotFound(foundGame ? false : true));
      if (foundGame) {
        const newForm = toGameConfigForm(foundGame);
        // check to ensure platFormDataSet contains both iOS and Android elements
        if (newForm.platformDataSet.length === 1) {
          if (newForm.platformDataSet[0].platform.value === EPlatforms.iOS) {
            newForm.platformDataSet.push(defaultAndroidPlatformData);
          } else if (newForm.platformDataSet[0].platform.value === EPlatforms.Android) {
            newForm.platformDataSet.push(defaultIOSPlatformData);
          }
        }
        dispatch(setGameConfigForm(newForm));
      } else {
        dispatch(setGameConfigForm({...defaultGameConfigForm}));
      }
    }
    if (selectedGame === CONSTANTS.MISC.GAME_TYPE_NEW_GAME) {
      dispatch(setGameConfigForm({...defaultGameConfigForm}));
    } else if (routeMatch.path.startsWith('/game-config') && selectedApp  && selectedGame) {
      redirectTo(getGameConfigNewRoute(routeMatch.path, selectedApp, selectedGame));
    }
  }, [selectedGame, selectedTab, gameData]);

  React.useEffect(() => {
    const ac = new AbortController();
    if (!gameData.data || !gameData.data.length) return;
    // populate options for select game dropdown
    const ids = gameData.data
      .filter((gd: any) => gd.appId === selectedApp)
      .map((gd: any) => gd.gameId)
      .filter((v: string, i: number, a: any) => a.indexOf(v) === i);  // find uniques
    // setGameIds(ids);
    if (ids.length && (!selectedGame || routeMatch.path !== ROUTES.GAME_CONFIG_CREATE)) {
      // set first game selected when gameIds are loaded
      const currentSelectedGame = (routeMatch.params as any).gameId !== URL_PART_GAME_ID ?
        (routeMatch.params as any).gameId :
        ids[0];
      if (selectedGame === CONSTANTS.MISC.GAME_TYPE_NEW_GAME) {
        dispatch(setSelectedGame(currentSelectedGame));
      }
      redirectTo(getGameConfigNewRoute(routeMatch.path, selectedApp, currentSelectedGame));
    }
    if (appChangedInDropdown) {
      dispatch(setSelectedGame(ids[0]));
      redirectTo(getGameConfigNewRoute(routeMatch.path, selectedApp, ids[0]));
      dispatch(setAppChangedInDropdown(false));
    }
    if (routeMatch.path === ROUTES.GAME_CONFIG_CREATE) {
      dispatch(setSelectedGame(CONSTANTS.MISC.GAME_TYPE_NEW_GAME));
    }
    return () => ac.abort();
  }, [gameData]);

  const handleTabChange = (event: React.ChangeEvent<{}>, newValue: string) => {
    setSelectedTab(newValue);
    redirectTo(getGameConfigNewRoute(newValue, selectedApp, selectedGame));
  };

  const deleteGame2 = () => {
    dispatch(deleteGameDispatcher(selectedApp, selectedGame, () => {
      dispatch(getGameDataDispatcher(selectedApp, (configs) => {
        setShowDeleteConfirmation(false);
        dispatch(setSelectedGame(CONSTANTS.MISC.GAME_TYPE_NEW_GAME));
        redirectTo(ROUTES.GAME_CONFIG_CREATE);
      }));
    }));
  };

  return (
    <GameConfigPage>
      <Helmet title={`${selectedGame} Config`} />

      {shouldShowPlaceholder && apps.loading !== XHR_STATE.IN_PROGRESS &&
        <NoAppPlaceholder
          imageUrl={'https://assets.onclixlogix-samplecode.com/website/img/icons/illustration-game-settings.svg'}
          text={'All the game configurations appear in this section, create an app, after the app is integrated game configuration can be accessed.'}
        />
      }

      {!shouldShowPlaceholder && <Fragment>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h1" gutterBottom>
          {selectedGame} Config
        </Typography>
        {selectedGame !== CONSTANTS.MISC.GAME_TYPE_NEW_GAME &&
          <div>
            <Button color="primary" variant="contained"
              onClick={e => setShowDeleteConfirmation(true)}
              style={{ marginRight: 8 }}
            >
              Delete Game
            </Button>
            <MuiButton color="primary" variant="contained"
              component={Link}
              to={ROUTES.GAME_CONFIG_CREATE}
              onClick={() => setSelectedGame(CONSTANTS.MISC.GAME_TYPE_NEW_GAME)}
            >
              Create Game
            </MuiButton>
          </div>
        }
      </div>

      <form
        noValidate
        // onSubmit={e => formSubmit(e)}
      >
        {routeMatch.path !== ROUTES.GAME_CONFIG_CREATE &&
        <Grid container spacing={6}>
          <Grid item xs={12}>
          <Paper className={classes.paperRoot}>
            <Tabs
              value={routeMatch.path}
              onChange={handleTabChange}
              indicatorColor="primary"
              textColor="primary"
              centered
            >
              <Tab value={ROUTES.GAME_CONFIG_DRAFT} label="Draft" />
              <Tab value={ROUTES.GAME_CONFIG_CURRENT_LIVE} label="Current Live"
                 disabled={selectedGame === CONSTANTS.MISC.GAME_TYPE_NEW_GAME}
              />
              <Tab value={ROUTES.GAME_CONFIG_PREVIOUS_LIVE} label="Previous Live"
                 disabled={selectedGame === CONSTANTS.MISC.GAME_TYPE_NEW_GAME}
              />
              <Tab value={ROUTES.GAME_CONFIG_CURRENT_TEST} label="Current Test"
                 disabled={selectedGame === CONSTANTS.MISC.GAME_TYPE_NEW_GAME}
              />
            </Tabs>
          </Paper>
          </Grid>
        </Grid>
        }

        {/* commenting below line because gameData.loading value is not being set/read correctly */}
        {/* {Boolean(apps.loading === XHR_STATE.IN_PROGRESS || gameData.loading === XHR_STATE.IN_PROGRESS) && <LoaderPaper />} */}
        {Boolean(apps.loading === XHR_STATE.IN_PROGRESS && gameData.loading === XHR_STATE.IN_PROGRESS) && <LoaderPaper />}

        {showConfigNotFound &&
          selectedGame !== CONSTANTS.MISC.GAME_TYPE_NEW_GAME &&
          <Alert severity="warning" style={{ marginTop: 24 }}>Config doesn't exist.</Alert>
        }

        {(!showConfigNotFound || routeMatch.path === ROUTES.GAME_CONFIG_CREATE) && <fieldset
          disabled={routeMatch.path !== ROUTES.GAME_CONFIG_CREATE && !routeMatch.path.endsWith('draft')} // disabled atrribute doesn't work
          style={{ border: 'none', padding: 0, marginTop: 24 }}
        >
        <Grid container spacing={6}>
          <Grid item xs={12} sm={6}>
            <Shadow>
              <Card px={6} py={6}>
                <CardContent>
                  <Typography variant="h2">General Configuration</Typography>
                  <FormControl>
                    <TextField
                      id="game-id"
                      label="Game ID"
                      value={form.gameId.value}
                      error={form.gameId.error !== ''}
                      helperText={form.gameId.error}
                      onChange={(e: React.ChangeEvent<{ value: unknown }>) => {
                        dispatch(setGameConfigForm({
                          ...form,
                          _isFormTouched: true,
                          gameId: {
                            ...form.gameId,
                            value: e.target.value as string,
                          },
                        }));
                      }}
                      disabled={routeMatch.path !== ROUTES.GAME_CONFIG_CREATE}
                      // m={2}
                    />
                  </FormControl>
                  <FormControl>
                    <InputLabel htmlFor="app-id">App</InputLabel>
                    <Select
                      input={<Input name="app-id-f" id="app-id" />}
                      value={form.appId.value}
                      error={form.appId.error !== ''}
                      onChange={(e: React.ChangeEvent<{ value: unknown }>) => {
                        dispatch(setGameConfigForm(produce(form, draft => {
                          draft.appId.value = e.target.value as string;
                        })));
                      }}
                      disabled={routeMatch.path !== ROUTES.GAME_CONFIG_CREATE}
                    >
                      {apps.list.map(v =>
                        <MenuItem value={v.appId} key={v.appId}>
                          {v.appName} ({v.appId})
                        </MenuItem>
                      )}
                    </Select>
                  </FormControl>
                  <FormControl>
                    <FormLabel htmlFor="game-enabled-country-codes-field" style={{ display: 'block' }}>
                      Enabled Country Codes
                    </FormLabel>
                    {Object.keys(ECountryCode).map(cCode => <FormControlLabel
                      key={cCode}
                      label={cCode}
                      style={{ display: 'inline-block', marginRight: '1.5rem' }}
                      control={
                        <Checkbox
                          id={`isNonScoreGame-field-${cCode}`}
                          name={`isNonScoreGame-f-${cCode}`}
                          inputProps={{ 'aria-label': 'isNonScoreGame' }}
                          checked={form.enabledCountryCodes.value.includes(cCode)}
                          disabled={routeMatch.path !== ROUTES.GAME_CONFIG_CREATE && !routeMatch.path.endsWith('draft')}
                          onChange={(e: React.ChangeEvent<{ value: unknown, checked: boolean }>) => {
                            const newCodes = [ ...form.enabledCountryCodes.value ];
                            if (e.target.checked) {
                              if (!newCodes.includes(cCode)) {
                                newCodes.push(cCode);
                              }
                            } else {
                              newCodes.splice(newCodes.indexOf(cCode), 1);
                            }
                            dispatch(setGameConfigForm({
                              ...form,
                              _isFormTouched: true,
                              enabledCountryCodes: {
                                ...form.enabledCountryCodes,
                                value: newCodes
                              }
                            }));
                          }}
                        />
                      }
                    />)}
                  </FormControl>
                  {form.version.error &&
                    <div>{form.version.error}</div>
                  }
                  <Typography variant="h4">Engine Data</Typography>
                  <div className="indent">
                    <FormControl component="fieldset">
                      <FormLabel component="legend">Engine Type</FormLabel>
                      <RadioGroup
                        style={{ display: 'inline-block', marginBottom: 0 }}
                        aria-label="gender" name="engine-type"
                        value={form.engineData.engineType.value}
                        // helperText={form.engineData.engineType.error}
                        onChange={(e: React.ChangeEvent<{ value: unknown }>) => {
                          const newEngineType = e.target.value as string;
                          const engineData = {
                            ...form.engineData,
                            engineType: {
                              ...form.engineData.engineType,
                              value: e.target.value as 'UNITY' | 'WEB',
                            }
                          };
                          if (newEngineType === 'WEB') {
                            engineData.url = { value: '', error: '', required: false }
                          }
                          if (newEngineType === 'UNITY') {
                            engineData.assetData = {
                              iosUrl: { value: '', error: '', required: false },
                              androidUrl: { value: '', error: '', required: false },
                              version: { value: -1, error: '', required: false },
                              addressableName: { value: '', error: '', required: false },
                            };
                          }
                          dispatch(setGameConfigForm({
                            ...form,
                            _isFormTouched: true,
                            engineData: { ...engineData }
                          }));
                        }}
                      >
                        {Object.keys(EEngineTypes).map(type =>
                          <FormControlLabel style={{ display: 'inline-block', marginBottom: 0 }} key={type} value={type} control={<Radio disabled={routeMatch.path !== ROUTES.GAME_CONFIG_CREATE && !routeMatch.path.endsWith('draft')} />} label={type} />
                        )}
                      </RadioGroup>
                    </FormControl>
                    {form.engineData.engineType.error !== '' &&
                      <span>{form.engineData.engineType.error}</span>
                    }
                  {form.engineData.engineType.value === 'WEB' &&
                    form.engineData.url &&
                    <FormControl>
                      <TextField
                        id="engine-url"
                        name="engine-url"
                        label="URL"
                        value={form.engineData.url.value}
                        onChange={(e: React.ChangeEvent<{ value: unknown }>) => {
                          dispatch(setGameConfigForm({
                            ...form,
                            _isFormTouched: true,
                            engineData: {
                              ...form.engineData,
                              url: {
                                value: e.target.value as string,
                                required: true,
                                error: '',
                              }
                            }
                          }));
                        }}
                        disabled={routeMatch.path !== ROUTES.GAME_CONFIG_CREATE && !routeMatch.path.endsWith('draft')}
                      />
                    </FormControl>
                  }
                  {form.engineData.engineType.value === 'UNITY' && form.engineData.assetData &&
                    <Fragment>
                      {form.engineData.assetData.iosUrl && <FormControl>
                        <TextField
                          id="engine-iosUrl"
                          name="engine-iosUrl"
                          label="iOS URL"
                          value={form.engineData.assetData.iosUrl.value}
                          onChange={(e: React.ChangeEvent<{ value: unknown }>) => {
                            let newAssetDataField = { value: e.target.value as string, error: '', required: false };
                            if (form.engineData.assetData?.iosUrl) {
                              newAssetDataField = {
                                ...form.engineData.assetData.iosUrl,
                                value: e.target.value as string
                              }
                            }
                            dispatch(setGameConfigForm({
                              ...form,
                              _isFormTouched: true,
                              engineData: {
                                ...form.engineData,
                                assetData: {
                                  ...form.engineData.assetData,
                                  iosUrl: newAssetDataField
                                }
                              }
                            }));
                          }}
                          disabled={routeMatch.path !== ROUTES.GAME_CONFIG_CREATE && !routeMatch.path.endsWith('draft')}
                        />
                      </FormControl>}
                      {form.engineData.assetData.androidUrl && <FormControl>
                        <TextField
                          id="engine-androidUrl"
                          name="engine-androidUrl"
                          label="Android URL"
                          value={form.engineData.assetData.androidUrl.value}
                          onChange={(e: React.ChangeEvent<{ value: unknown }>) => {
                            let newAssetDataField = { value: e.target.value as string, error: '', required: false };
                            if (form.engineData.assetData?.androidUrl) {
                              newAssetDataField = {
                                ...form.engineData.assetData.androidUrl,
                                value: e.target.value as string
                              }
                            }
                            dispatch(setGameConfigForm({
                              ...form,
                              _isFormTouched: true,
                              engineData: {
                                ...form.engineData,
                                assetData: {
                                  ...form.engineData.assetData,
                                  androidUrl: newAssetDataField
                                }
                              }
                            }));
                          }}
                          disabled={routeMatch.path !== ROUTES.GAME_CONFIG_CREATE && !routeMatch.path.endsWith('draft')}
                        />
                      </FormControl>}
                      {form.engineData.assetData.addressableName && <FormControl>
                        <TextField
                          id="engine-addressableName"
                          name="engine-addressableName"
                          label="Addressable name"
                          value={form.engineData.assetData.addressableName.value}
                          onChange={(e: React.ChangeEvent<{ value: unknown }>) => {
                            let newAssetDataField = { value: e.target.value as string, error: '', required: false };
                            if (form.engineData.assetData?.addressableName) {
                              newAssetDataField = {
                                ...form.engineData.assetData.addressableName,
                                value: e.target.value as string
                              }
                            }
                            dispatch(setGameConfigForm({
                              ...form,
                              _isFormTouched: true,
                              engineData: {
                                ...form.engineData,
                                assetData: {
                                  ...form.engineData.assetData,
                                  addressableName: newAssetDataField
                                }
                              }
                            }));
                          }}
                          disabled={routeMatch.path !== ROUTES.GAME_CONFIG_CREATE && !routeMatch.path.endsWith('draft')}
                        />
                      </FormControl>}
                    </Fragment>
                  }
                  </div>
                  <FormControl>
                    <InputLabel htmlFor="version-field">Version</InputLabel>
                    <Select
                      input={<Input name="version-f" id="version-field" />}
                      value={form.version.value}
                      error={form.version.error !== ''}
                      disabled
                    >
                      {Object.keys(EVersions).map(v =>
                        <MenuItem value={v} key={v}>{v}</MenuItem>
                      )}
                    </Select>
                  </FormControl>
                  {form.version.error &&
                    <div>{form.version.error}</div>
                  }
                  <FormControl>
                    <TextField
                      id="match-making-time"
                      name="match-making-time"
                      label="Match-making time"
                      value={form.matchMakingConfig.matchMakingTime.value}
                      InputProps={{
                        endAdornment: <InputAdornment position="end">seconds</InputAdornment>
                      }}
                      onChange={(e: React.ChangeEvent<{ value: unknown }>) => {
                        dispatch(setGameConfigForm({
                          ...form,
                          _isFormTouched: true,
                          matchMakingConfig: {
                            ...form.matchMakingConfig,
                            matchMakingTime: {
                              ...form.matchMakingConfig.matchMakingTime,
                              value: e.target.value as number,
                            }
                          }
                        }));
                      }}
                      type="number"
                      inputProps={{ min: 1 }}
                      disabled={routeMatch.path !== ROUTES.GAME_CONFIG_CREATE && !routeMatch.path.endsWith('draft')}
                      helperText={form.matchMakingConfig.matchMakingTime.error}
                    />
                  </FormControl>
                  {form.botConfig && <Fragment>
                  <FormControl>
                    <InputLabel htmlFor="bc-botLogic-field">Bot logic</InputLabel>
                    <Select
                      input={<Input name="version-f" id="bot-logic-hidden-field" />}
                      value={form.botConfig.botLogic.value}
                      error={form.botConfig.botLogic.error !== ''}
                      onChange={(e: React.ChangeEvent<{ value: unknown }>) => {
                        if (form.botConfig) {
                        dispatch(setGameConfigForm({
                          ...form,
                          _isFormTouched: true,
                          botConfig: {
                            ...form.botConfig,
                            botLogic: {
                              ...form.botConfig.botLogic,
                              value: e.target.value as EBotLogics,
                            }
                          },
                        }));
                        }
                      }}
                    >
                      {Object.keys(EBotLogics).map(botLogic =>
                        <MenuItem value={botLogic} key={botLogic}>{botLogic}</MenuItem>
                      )}
                    </Select>
                  </FormControl>
                  <FormControl>
                    <TextField
                      id="bot-min-level"
                      name="bot-min-level"
                      label="Bot min. level"
                      value={form.botConfig.botMinLevel.value}
                      error={form.botConfig.botMinLevel.error !== ''}
                      helperText={form.botConfig.botMinLevel.error}
                      onChange={(e: React.ChangeEvent<{ value: unknown }>) => {
                        if (form.botConfig) {
                        dispatch(setGameConfigForm({
                          ...form,
                          _isFormTouched: true,
                          botConfig: {
                            ...form.botConfig,
                          botMinLevel: {
                              ...form.botConfig.botMinLevel,
                              value: e.target.value as number,
                            }
                          },
                        }));
                        }
                      }}
                      disabled={routeMatch.path !== ROUTES.GAME_CONFIG_CREATE && !routeMatch.path.endsWith('draft')}
                    />
                  </FormControl>
                  <FormControl>
                    <TextField
                      id="bot-max-level"
                      name="bot-max-level"
                      label="Bot max. level"
                      value={form.botConfig.botMaxLevel.value}
                      error={form.botConfig.botMaxLevel.error !== ''}
                      helperText={form.botConfig.botMaxLevel.error}
                      onChange={(e: React.ChangeEvent<{ value: unknown }>) => {
                        if (form.botConfig) {
                        dispatch(setGameConfigForm({
                          ...form,
                          _isFormTouched: true,
                          botConfig: {
                            ...form.botConfig,
                            botMaxLevel: {
                              ...form.botConfig.botMaxLevel,
                              value: e.target.value as number,
                            }
                          },
                        }));
                        }
                      }}
                      disabled={routeMatch.path !== ROUTES.GAME_CONFIG_CREATE && !routeMatch.path.endsWith('draft')}
                    />
                  </FormControl>
                  </Fragment>}
                  <FormControl>
                    <InputLabel htmlFor="orientation-field">Orientation</InputLabel>
                    <Select
                      input={<Input name="orientation-f" id="orientation-field" />}
                      value={form.orientation.value}
                      error={form.orientation.error !== ''}
                      disabled={routeMatch.path !== ROUTES.GAME_CONFIG_CREATE && !routeMatch.path.endsWith('draft')}
                      onChange={(e: React.ChangeEvent<{ value: unknown }>) => {
                        dispatch(setGameConfigForm({
                          ...form,
                          _isFormTouched: true,
                          orientation: {
                            ...form.orientation,
                            value: e.target.value as EOrientations,
                          }
                        }));
                      }}
                    >
                      {Object.keys(EOrientations).map(o =>
                        <MenuItem value={o as EOrientations} key={o}>{o}</MenuItem>)
                      }
                    </Select>
                  </FormControl>
                  <FormControl>
                    <InputLabel htmlFor="tutorial-type-field">Tutorial type</InputLabel>
                    <Select
                      input={<Input name="tutorial-type-f" id="tutorial-type-field" />}
                      value={form.gameControlParams.tutorialData.tutorialType.value}
                      error={form.gameControlParams.tutorialData.tutorialType.error !== ''}
                      disabled={routeMatch.path !== ROUTES.GAME_CONFIG_CREATE && !routeMatch.path.endsWith('draft')}
                      onChange={(e: React.ChangeEvent<{ value: unknown }>) => {
                        dispatch(setGameConfigForm({
                          ...form,
                          _isFormTouched: true,
                          gameControlParams: {
                            ...form.gameControlParams,
                            tutorialData: {
                              ...form.gameControlParams.tutorialData,
                              tutorialType: {
                                ...form.gameControlParams.tutorialData.tutorialType,
                                value: e.target.value as ETutorialTypes
                              },
                              slideUrls: {
                                ...form.gameControlParams.tutorialData.slideUrls,
                                value: Array.isArray(form.gameControlParams.tutorialData.slideUrls.value) ?
                                  form.gameControlParams.tutorialData.slideUrls.value :
                                  [''],
                              }
                            }
                          }
                        }));
                      }}
                    >
                      {Object.keys(ETutorialTypes).map(type =>
                        <MenuItem value={type} key={type}>{type}</MenuItem>
                      )}
                    </Select>
                  </FormControl>
                  {form.gameControlParams.tutorialData.tutorialType.value === ETutorialTypes.Slide &&
                    <Fragment>
                      {(form.gameControlParams.tutorialData.slideUrls && form.gameControlParams.tutorialData.slideUrls.value) &&
                        form.gameControlParams.tutorialData.slideUrls.value.map((slideUrl, index) =>
                        <FormControl key={slideUrl + index}>
                          <InputLabel htmlFor={`slide-url-field${index}`}>Slide URL {index + 1}</InputLabel>
                          <Input
                            id={`slide-url-field${index}`}
                            name="slide-url-field"
                            value={slideUrl}
                            onChange={(e: React.ChangeEvent<{ value: unknown }>) => {
                              const newUrls = [...form.gameControlParams.tutorialData.slideUrls.value];
                              newUrls[index] = e.target.value as string;
                              dispatch(setGameConfigForm({
                                ...form,
                                _isFormTouched: true,
                                gameControlParams: {
                                  ...form.gameControlParams,
                                  tutorialData: {
                                    ...form.gameControlParams.tutorialData,
                                    slideUrls: {
                                      ...form.gameControlParams.tutorialData.slideUrls,
                                      value: newUrls
                                    }
                                  }
                                }
                              }));
                            }}
                            type="url"
                            disabled={routeMatch.path !== ROUTES.GAME_CONFIG_CREATE && !routeMatch.path.endsWith('draft')}
                            endAdornment={
                              <InputAdornment position="end">
                                <IconButton
                                  aria-label="delete slide url"
                                  disabled={form.gameControlParams.tutorialData.slideUrls.value.length <= 1 || routeMatch.path !== ROUTES.GAME_CONFIG_CREATE}
                                  onClick={e => {
                                    const newUrls = [...form.gameControlParams.tutorialData.slideUrls.value];
                                    newUrls.splice(index, 1);
                                    dispatch(setGameConfigForm({
                                      ...form,
                                      _isFormTouched: true,
                                      gameControlParams: {
                                        ...form.gameControlParams,
                                        tutorialData: {
                                          ...form.gameControlParams.tutorialData,
                                          slideUrls: {
                                            ...form.gameControlParams.tutorialData.slideUrls,
                                            value: [...newUrls]
                                          }
                                        }
                                      }
                                    }));
                                  }}
                                  // onMouseDown={handleMouseDownPassword}
                                >
                                  <DeleteIcon />
                                </IconButton>
                              </InputAdornment>
                            }
                          />
                        </FormControl>
                      )}
                      <Button
                        variant="outlined"
                        color="primary"
                        disabled={routeMatch.path !== ROUTES.GAME_CONFIG_CREATE && !routeMatch.path.endsWith('draft')}
                        onClick={e => {
                          dispatch(setGameConfigForm({
                            ...form,
                            _isFormTouched: true,
                            gameControlParams: {
                              ...form.gameControlParams,
                              tutorialData: {
                                ...form.gameControlParams.tutorialData,
                                slideUrls: {
                                  ...form.gameControlParams.tutorialData.slideUrls,
                                  value: [
                                    ...form.gameControlParams.tutorialData.slideUrls.value,
                                    ''
                                  ]
                                }
                              }
                            }
                          }));
                        }}
                      >
                        Add Slide URL
                      </Button>
                    </Fragment>
                  }

                  <Typography variant="h3" mt={8}>Platform Data</Typography>
                  {form.platformDataSet.map((platformData, index) =>
                    <div className="indent" key={index}>
                      <FormControl>
                        <InputLabel htmlFor="platform-field-">Platform</InputLabel>
                        <Select
                          input={<Input name="platform-f" id={`platform-field${index}`} />}
                          value={platformData.platform.value}
                          error={platformData.platform.error !== ''}
                          disabled
                          onChange={(e: React.ChangeEvent<{ value: unknown }>) => {
                            dispatch(setGameConfigForm({
                              ...form,
                              _isFormTouched: true,
                              platformDataSet: [
                                {
                                  ...platformData,
                                  platform: {
                                    ...platformData.platform,
                                    value: e.target.value as EPlatforms,
                                  }
                                }
                              ]
                            }));
                          }}
                        >
                          {Object.keys(EPlatforms).map(key =>
                            <MenuItem value={key} key={key}>{key}</MenuItem>
                          )}
                        </Select>
                      </FormControl>
                      <FormControl>
                        <TextField
                          id={`min-app-version-${index}`}
                          name="min-app-version"
                          label="Min. app version"
                          value={platformData.minAppVersion.value}
                          onChange={(e: React.ChangeEvent<{ value: unknown }>) => {
                            const pds = [...form.platformDataSet];
                            const newPlatformData = {
                              ...pds[index],
                              minAppVersion: {
                                ...pds[index].minAppVersion,
                                value: e.target.value as string,
                              }
                            };
                            pds.splice(index, 1);
                            pds.splice(index, 0, newPlatformData);
                            dispatch(setGameConfigForm({
                              ...form,
                              _isFormTouched: true,
                              platformDataSet: [...pds]
                            }));
                          }}
                          disabled={routeMatch.path !== ROUTES.GAME_CONFIG_CREATE && !routeMatch.path.endsWith('draft')}
                        />
                      </FormControl>
                      {platformData.maxAppVersion.error &&
                        <div>{platformData.maxAppVersion.error}</div>
                      }
                      <FormControl>
                        <TextField
                          id={`max-app-version-${index}`}
                          name="max-app-version"
                          label="Max. app version"
                          value={platformData.maxAppVersion.value}
                          onChange={(e: React.ChangeEvent<{ value: unknown }>) => {
                            const pds = [...form.platformDataSet];
                            const newPlatformData = {
                              ...pds[index],
                              maxAppVersion: {
                                ...pds[index].maxAppVersion,
                                value: e.target.value as string,
                              }
                            };
                            pds.splice(index, 1);
                            pds.splice(index, 0, newPlatformData);
                            dispatch(setGameConfigForm({
                              ...form,
                              _isFormTouched: true,
                              platformDataSet: [...pds]
                            }));
                          }}
                          disabled={routeMatch.path !== ROUTES.GAME_CONFIG_CREATE && !routeMatch.path.endsWith('draft')}
                        />
                      </FormControl>
                      {platformData.maxAppVersion.error &&
                        <div>{platformData.maxAppVersion.error}</div>
                      }
                  </div>
                )}
                </CardContent>
              </Card>
            </Shadow>

            <Shadow style={{ marginTop: 24 }}>
              <Card px={6} py={6}>
                <CardContent>
                  <Typography variant="h2">Game control configuration</Typography>
                  <div>
                    <FormControl>
                      <TextField
                        id="max-rank-winner"
                        name="max-rank-winner"
                        label="Max. rank for winner"
                        value={form.gameControlParams.maxRankForWinner.value}
                        error={form.gameControlParams.maxRankForWinner.error !== ''}
                        helperText={form.gameControlParams.maxRankForWinner.error}
                        onChange={(e: React.ChangeEvent<{ value: unknown }>) => {
                          dispatch(setGameConfigForm({
                            ...form,
                            _isFormTouched: true,
                            gameControlParams: {
                              ...form.gameControlParams,
                              maxRankForWinner: {
                                ...form.gameControlParams.maxRankForWinner,
                                value: e.target.value as number
                              }
                            }
                          }));
                        }}
                        type="number"
                        inputProps={{ min: 1 }}
                        disabled={routeMatch.path !== ROUTES.GAME_CONFIG_CREATE && !routeMatch.path.endsWith('draft')}
                      />
                    </FormControl>
                    <FormControl>
                      <TextField
                        id="starting-score"
                        name="starting-score"
                        label="Starting score"
                        value={form.gameControlParams.startingScore.value}
                        error={form.gameControlParams.startingScore.error !== ''}
                        helperText={form.gameControlParams.startingScore.error}
                        onChange={(e: React.ChangeEvent<{ value: unknown }>) => {
                          dispatch(setGameConfigForm({
                            ...form,
                            _isFormTouched: true,
                            gameControlParams: {
                              ...form.gameControlParams,
                              startingScore: {
                                ...form.gameControlParams.startingScore,
                                value: e.target.value as number
                              }
                            }
                          }));
                        }}
                        type="number"
                        inputProps={{ min: 1 }}
                        disabled={routeMatch.path !== ROUTES.GAME_CONFIG_CREATE && !routeMatch.path.endsWith('draft')}
                      />
                    </FormControl>
                    <FormControl>
                      <TextField
                        id="supported-player-count"
                        name="supported-player-count"
                        label="Supported player #"
                        value={form.supportedPlayerCounts.value}
                        error={form.supportedPlayerCounts.error !== ''}
                        helperText={form.supportedPlayerCounts.error || 'Enter comma separated numbers. e.g. 1, 2, 3'}
                        onChange={(e: React.ChangeEvent<{ value: unknown }>) => {
                          dispatch(setGameConfigForm({
                            ...form,
                            _isFormTouched: true,
                            supportedPlayerCounts: {
                              ...form.supportedPlayerCounts,
                              value: e.target.value as string,
                            },
                          }));
                        }}
                        disabled={routeMatch.path !== ROUTES.GAME_CONFIG_CREATE && !routeMatch.path.endsWith('draft')}
                      />
                    </FormControl>
                    <FormControl>
                      <TextField
                        id="acceptable-pause-time"
                        name="acceptable-pause-time"
                        label="Acceptable pause time"
                        value={form.gameControlParams.acceptablePauseTime.value}
                        error={form.gameControlParams.acceptablePauseTime.error !== ''}
                        helperText={form.gameControlParams.acceptablePauseTime.error}
                        onChange={(e: React.ChangeEvent<{ value: unknown }>) => {
                          dispatch(setGameConfigForm({
                            ...form,
                            _isFormTouched: true,
                            gameControlParams: {
                              ...form.gameControlParams,
                              acceptablePauseTime: {
                                ...form.gameControlParams.acceptablePauseTime,
                                value: e.target.value as number,
                              }
                            }
                          }));
                        }}
                        type="number"
                        inputProps={{ min: 1 }}
                        disabled={routeMatch.path !== ROUTES.GAME_CONFIG_CREATE && !routeMatch.path.endsWith('draft')}
                      />
                    </FormControl>
                    <FormControl>
                      <TextField
                        id="disconnection-buffer"
                        name="disconnection-buffer"
                        label="Disconnection buffer time"
                        value={form.gameControlParams.disconnectionBufferTime.value}
                        error={form.gameControlParams.disconnectionBufferTime.error !== ''}
                        helperText={form.gameControlParams.disconnectionBufferTime.error}
                        onChange={(e: React.ChangeEvent<{ value: unknown }>) => {
                          dispatch(setGameConfigForm({
                            ...form,
                            _isFormTouched: true,
                            gameControlParams: {
                              ...form.gameControlParams,
                              disconnectionBufferTime: {
                                ...form.gameControlParams.disconnectionBufferTime,
                                value: e.target.value as number,
                              }
                            }
                          }));
                        }}
                        type="number"
                        inputProps={{ min: 1 }}
                        disabled={routeMatch.path !== ROUTES.GAME_CONFIG_CREATE && !routeMatch.path.endsWith('draft')}
                      />
                    </FormControl>
                    <FormControl>
                      <TextField
                        id="app-id"
                        name="app-id"
                        label="App ID"
                        value={selectedApp}
                        error={selectedApp === ''}
                        helperText={selectedApp === '' && 'App ID is required'}
                        disabled
                      />
                    </FormControl>
                    <FormControl>
                      <InputLabel htmlFor="scoring-type-field">Scoring type</InputLabel>
                      <Select
                        input={<Input name="scoring-type-f" id="scoring-type-field" />}
                        value={form.gameControlParams.scoringType.value}
                        error={form.gameControlParams.scoringType.error !== ''}
                        disabled={routeMatch.path !== ROUTES.GAME_CONFIG_CREATE && !routeMatch.path.endsWith('draft')}
                        onChange={(e: React.ChangeEvent<{ value: unknown }>) => {
                          dispatch(setGameConfigForm({
                            ...form,
                            _isFormTouched: true,
                            gameControlParams: {
                              ...form.gameControlParams,
                              scoringType: {
                                ...form.gameControlParams.scoringType,
                                value: e.target.value as EScoringTypes,
                              }
                            }
                          }));
                        }}
                      >
                        {Object.keys(EScoringTypes).map(type =>
                          <MenuItem value={type} key={type}>{type}</MenuItem>
                        )}
                      </Select>
                    </FormControl>
                    {form.gameControlParams.scoringType.error &&
                      <div>{form.gameControlParams.scoringType.error}</div>
                    }
                    <FormControlLabel
                      label="isNonScoreGame"
                      control={
                        <Checkbox
                          id="isNonScoreGame-field"
                          name="isNonScoreGame-f"
                          inputProps={{ 'aria-label': 'isNonScoreGame' }}
                          checked={Boolean(form.gameControlParams.isNonScoreGame.value)}
                          disabled={routeMatch.path !== ROUTES.GAME_CONFIG_CREATE && !routeMatch.path.endsWith('draft')}
                          onChange={(e: React.ChangeEvent<{ value: unknown, checked: boolean }>) => {
                            dispatch(setGameConfigForm({
                              ...form,
                              _isFormTouched: true,
                              gameControlParams: {
                                ...form.gameControlParams,
                                isNonScoreGame: {
                                  ...form.gameControlParams.isNonScoreGame,
                                  value: e.target.checked,
                                }
                              }
                            }));
                          }}
                        />
                      }
                    />
                    <FormControlLabel
                      label="canWinAfterAbandon"
                      control={
                        <Checkbox
                          id="canWinAfterAbandon-field"
                          name="canWinAfterAbandon-f"
                          inputProps={{ 'aria-label': 'canWinAfterAbandon' }}
                          checked={Boolean(form.gameControlParams.canWinAfterAbandon.value)}
                          disabled={routeMatch.path !== ROUTES.GAME_CONFIG_CREATE && !routeMatch.path.endsWith('draft')}
                          onChange={(e: React.ChangeEvent<{ value: unknown, checked: boolean }>) => {
                            dispatch(setGameConfigForm({
                              ...form,
                              _isFormTouched: true,
                              gameControlParams: {
                                ...form.gameControlParams,
                                canWinAfterAbandon: {
                                  ...form.gameControlParams.canWinAfterAbandon,
                                  value: e.target.checked,
                                }
                              }
                            }));
                          }}
                        />
                      }
                    />
                    <FormControlLabel
                      label="showEqualAlignmentOnResultScreen"
                      control={
                        <Checkbox
                          id="showEqualAlignmentOnResultScreen-field"
                          name="showEqualAlignmentOnResultScreen-f"
                          inputProps={{ 'aria-label': 'showEqualAlignmentOnResultScreen' }}
                          checked={Boolean(form.gameControlParams.showEqualAlignmentOnResultScreen.value)}
                          disabled={routeMatch.path !== ROUTES.GAME_CONFIG_CREATE && !routeMatch.path.endsWith('draft')}
                          onChange={(e: React.ChangeEvent<{ value: unknown, checked: boolean }>) => {
                            dispatch(setGameConfigForm({
                              ...form,
                              _isFormTouched: true,
                              gameControlParams: {
                                ...form.gameControlParams,
                                showEqualAlignmentOnResultScreen: {
                                  ...form.gameControlParams.showEqualAlignmentOnResultScreen,
                                  value: e.target.checked,
                                }
                              }
                            }));
                          }}
                        />
                      }
                    />
                    <FormControlLabel
                      label="autoStartGamePlay"
                      control={
                        <Checkbox
                          id="autoStartGamePlay-field"
                          name="autoStartGamePlay-f"
                          inputProps={{ 'aria-label': 'autoStartGamePlay*' }}
                          checked={Boolean(form.gameControlParams.autoStartGamePlay.value)}
                          disabled={routeMatch.path !== ROUTES.GAME_CONFIG_CREATE && !routeMatch.path.endsWith('draft')}
                          onChange={(e: React.ChangeEvent<{ value: unknown, checked: boolean }>) => {
                            dispatch(setGameConfigForm({
                              ...form,
                              _isFormTouched: true,
                              gameControlParams: {
                                ...form.gameControlParams,
                                autoStartGamePlay: {
                                  ...form.gameControlParams.autoStartGamePlay,
                                  value: e.target.checked,
                                }
                              }
                            }));
                          }}
                        />
                      }
                    />
                  </div>
                </CardContent>
              </Card>
            </Shadow>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Shadow>
              <Card px={6} pt={6}>
              <CardContent>
                  <GameModeFields />
                </CardContent>
              </Card>
            </Shadow>
          </Grid>
        </Grid>
        </fieldset>}
      </form>

      </Fragment>}

      <Dialog
        open={showDeleteConfirmation}
        onClose={e => setShowDeleteConfirmation(false)}
        scroll="paper"
        aria-labelledby="dialog-delete-game-config-confirmation"
        aria-describedby="dialog-delete-game-config-confirmation"
        disableBackdropClick={true}
        fullScreen={fullScreen}
        // maxWidth="xl"
      >
        <DialogTitle id="dialog-delete-game-config-confirmation-title">
          Are You Sure You Want to Delete "{selectedGame}" Game?
        </DialogTitle>
        <DialogContent dividers={true}>
          This will delete configs for all versions (current test, current live, etc.) of the game.
        </DialogContent>
        <DialogActions>
          <Button onClick={e => setShowDeleteConfirmation(false)} color="primary"
            disabled={deleteGame.loading === XHR_STATE.IN_PROGRESS}
          >
            Cancel
          </Button>
          <Button
            onClick={e => deleteGame2()}
            disabled={deleteGame.loading === XHR_STATE.IN_PROGRESS}
            variant="contained" color="secondary">
            Delete Game
          </Button>
        </DialogActions>
      </Dialog>
    </GameConfigPage>
  );
}

export default GameConfig;

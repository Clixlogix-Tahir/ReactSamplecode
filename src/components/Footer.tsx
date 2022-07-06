/* eslint-disable react-hooks/exhaustive-deps */
import * as React from "react";
import styled from "styled-components";

import {
  Grid,
  Hidden,
  List,
  ListItem as MuiListItem,
  ListItemProps as MuiListItemProps,
  Button,
  Snackbar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from "@material-ui/core";
import { Link, useRouteMatch } from "react-router-dom";
import { EVersions } from "../types/gameConfigTypes";
import {
  createOrEditGameConfigDispatcher,
  upgradeToLiveDispatcher,
  upgradeToPreviewLiveDispatcher,
  setCreatingOrUpdating, 
  setUpgradeToLiveLoading,
  setUpgradeToPreviewLiveLoading,
  upgradeFromTestToLiveDispatcher,
  revertFromLastLiveDispatcher,
  setGameConfigCanBeDeployed,
  setGameConfigForm,
  setSelectedApp,
} from "../pages/game-config/gameConfigSlice";
import { ROUTES, URL_PART_APP_ID, URL_SEARCH_KEY_EVENT_TYPE, XHR_STATE } from "../common/constants";
import { Alert } from "@material-ui/lab";
import DiffPreview from "../pages/game-config/diffPreview";
import {
  eventApiDispatchers,
  setEventForm,
  setNudgeForm
} from "../pages/events/eventSlice";
import {
  getEventFormFromPayload,
  getEventPayloadFromForm,
  getNudgePayloadFromForm
} from "../pages/events/eventConverters";
import { isEventFormValid } from "../pages/events/eventValidations";
import { getEventCategoryFromPayload, VIEW_VALUES } from "../pages/events/index-events";
import { getGameConfigNewRoute } from "./Header";
import {
  useAppDispatch,
  useAppRedirect,
  useAppSelector,
  useUrlQuery
} from "../common/hooks";
import { EEventCategory, USER_ROLE } from "../types/eventTypes";
import { toGameConfigPayload } from "../pages/game-config/converters";
import { isNudgeFormValid } from "../pages/events/nudge-fields/validations";
import { isGameConfigFormValid } from "../pages/game-config/validator";
import { EVENT_URL_PARAMS } from "../common/common-types";
import ChallengesFooter from "../pages/challenges/footer";

interface ListItemProps extends MuiListItemProps {
  component?: string;
  href?: string;
  button: boolean | undefined;
};

const Wrapper = styled.footer`
  padding: ${props => props.theme.spacing(1) / 4}px
    ${props => props.theme.spacing(4)}px;
  background: ${props => props.theme.palette.common.white};
  position: sticky;
  bottom: 0;
  box-shadow: 0 0 14px 0 rgb(53 64 82 / 5%);
  min-height: 62px;
  display: flex;
  align-items: center;
  z-index: 90;
  a {
    color: ${props => props.theme.palette.primary.main};
    text-decoration: none;
    &.active { color: #000; }
  }
`;

const ListItem = styled(MuiListItem)<ListItemProps>`
  display: inline-block;
  width: auto;
  padding-left: ${props => props.theme.spacing(2)}px;
  padding-right: ${props => props.theme.spacing(2)}px;

  &,
  &:hover,
  &:active {
    color: #000;
  }
`;

const FooterButtons = styled.div`
  display: flex;
  align-items: center;
  & > * {
    margin: 0 8px;
  }
`;

function Footer() {
  const p = useRouteMatch();
  const dispatch = useAppDispatch();
  const redirectTo = useAppRedirect();
  const searchQuery = useUrlQuery();
  const { apps, form, selectedApp, creatingOrUpdating, creatingOrUpdatingError,
    upgradeToLive, upgradeToPreviewLive, selectedGame, gameData, showConfigNotFound,
    canBeDeployed, upgradeFromTestToLive, isSelectedAppCrypto
  } = useAppSelector(state => state.gameConfigForm);
  const {
    creatingEvent,
    eventForm,
    events,
    nudgeForm,
    updatingEvent
  } = useAppSelector(state => state.eventSlice);
  const [showDiff, setShowDiff] = React.useState(false);
  const [showTestToLiveDiff, setShowTestToLiveDiff] = React.useState(false);
  const [showDraftToTestDiff, setShowDraftToTestDiff] = React.useState(false);
  const [showDraftToLiveDiff, setShowDraftToLiveDiff] = React.useState(false);
  const [showEventDiff, setShowEventDiff] = React.useState(false);
  const [showLeaderboardDiff, setShowLeaderboardDiff] = React.useState(false);
  const [originalEventString, setOriginalEventString] = React.useState('');
  const [showEventCreateModal, setShowEventCreateModal] = React.useState(false);
  const [showLeaderboardCreateModal, setShowLeaderboardCreateModal] = React.useState(false);
  const [showCreateEventError, setShowCreateEventError] = React.useState(false);
  const [showGameConfigErrorModal, setShowGameConfigErrorModal] = React.useState(false);
  const modeFromUrl = searchQuery.get(EVENT_URL_PARAMS.mode);
  const redirectUrl = React.useMemo(
    () => ROUTES.EVENTS.replace(URL_PART_APP_ID, selectedApp) +
      '?view=' + (eventForm.jsonLogicFilters.value.includes(USER_ROLE.REGULAR) ? VIEW_VALUES.PROD : VIEW_VALUES.TEST) +
      '&' + URL_SEARCH_KEY_EVENT_TYPE + '=' + searchQuery.get(URL_SEARCH_KEY_EVENT_TYPE),
    [eventForm.jsonLogicFilters.value, selectedApp]
  );

  const saveDraft = () => {
    const validatedForm = isGameConfigFormValid(form);
    dispatch(setGameConfigForm(validatedForm));
    if (!validatedForm._isFormValid) {
      setShowGameConfigErrorModal(true);
      return;
    }
    dispatch(createOrEditGameConfigDispatcher({
      appId: form.appId.value,
      config: [toGameConfigPayload(form, form.appId.value)],
      success: () => {
        redirectTo(getGameConfigNewRoute(ROUTES.GAME_CONFIG_DRAFT, form.appId.value, form.gameId.value));
        dispatch(setGameConfigCanBeDeployed(true));
        dispatch(setSelectedApp(form.appId.value));
      },
      error: () => dispatch(setGameConfigCanBeDeployed(false)),
    }));
  };

  const deployToTest = () => {
    dispatch(upgradeToPreviewLiveDispatcher(form.appId.value, form.gameId.value, () => {
      redirectTo(ROUTES.GAME_CONFIG_CURRENT_TEST);
    }));
  };

  const deployToLive = () => {
    dispatch(upgradeToLiveDispatcher(form.appId.value, form.gameId.value, () => {
      redirectTo(ROUTES.GAME_CONFIG_CURRENT_LIVE);
    }));
  };

  const deployFromTestToLive = () => {
    dispatch(upgradeFromTestToLiveDispatcher(form.appId.value, selectedGame, () => {
      redirectTo(ROUTES.GAME_CONFIG_CURRENT_LIVE);
    }));
  };

  const rollback = () => {
    dispatch(revertFromLastLiveDispatcher(form.appId.value, selectedGame, () => {
      setShowDiff(false);
      redirectTo(ROUTES.GAME_CONFIG_CURRENT_LIVE);
    }));
  };

  const createEvent = (isLive = false, isAddingNew = false, isCloning = false) => {
    const newRedirectUrl =  ROUTES.EVENTS.replace(URL_PART_APP_ID, selectedApp) +
      '?view=' + (isLive ? VIEW_VALUES.PROD : VIEW_VALUES.TEST) +
      '&' + URL_SEARCH_KEY_EVENT_TYPE + '=' + searchQuery.get(URL_SEARCH_KEY_EVENT_TYPE);
    if (searchQuery.get(URL_SEARCH_KEY_EVENT_TYPE) === EEventCategory.SALE) {
      const validatedForm = isNudgeFormValid(nudgeForm);
      setShowCreateEventError(!validatedForm._isFormValid);
      if (!validatedForm._isFormValid) {
        dispatch(setNudgeForm({ ...validatedForm, _isSubmittedOnce: true }));
        setShowEventCreateModal(false);
        return;
      }
      dispatch(eventApiDispatchers.createEvent(
        getNudgePayloadFromForm(nudgeForm, isLive, isAddingNew, isCloning),
        selectedApp,
        () => {
          redirectTo(newRedirectUrl);
        }
      ));
    } else {
      const validatedForm = isEventFormValid(eventForm, isLive, gameData.data,
        searchQuery.get(URL_SEARCH_KEY_EVENT_TYPE), apps.list, isSelectedAppCrypto, selectedApp);
      setShowCreateEventError(!validatedForm._isFormValid);
      if (!validatedForm._isFormValid) {
        dispatch(setEventForm({ ...validatedForm, _isSubmittedOnce: true }));
        setShowEventCreateModal(false);
        return;
      }
      dispatch(eventApiDispatchers.createEvent(
        getEventPayloadFromForm(eventForm, isLive, isAddingNew, isCloning),
        selectedApp,
        () => {
          redirectTo(newRedirectUrl);
        }
      ));
    }
  };

  const createLeaderboard = (isLive = false, isAddingNew = false, isCloning = false) => {
    const newRedirectUrl = ROUTES.LEADERBOARDS.replace(URL_PART_APP_ID, selectedApp) +
      '?view=' + (isLive ? VIEW_VALUES.PROD : VIEW_VALUES.TEST);

    const validatedForm = isEventFormValid(eventForm, isLive, gameData.data,
      searchQuery.get(URL_SEARCH_KEY_EVENT_TYPE), apps.list, isSelectedAppCrypto, selectedApp);
    setShowCreateEventError(!validatedForm._isFormValid);
    if (!validatedForm._isFormValid) {
      dispatch(setEventForm({ ...validatedForm, _isSubmittedOnce: true }));
      setShowEventCreateModal(false);
      return;
    }
    dispatch(eventApiDispatchers.createEvent(
      getEventPayloadFromForm(eventForm, isLive, isAddingNew, isCloning),
      selectedApp,
      () => {
        redirectTo(newRedirectUrl);
      }
    ));
  };

  const updateEvent = () => {
    if (searchQuery.get(URL_SEARCH_KEY_EVENT_TYPE) === EEventCategory.SALE) {
      const validatedForm = isNudgeFormValid(nudgeForm);
      setShowCreateEventError(!validatedForm._isFormValid);
      if (!validatedForm._isFormValid) {
        dispatch(setNudgeForm({ ...validatedForm, _isSubmittedOnce: true }));
        setShowEventCreateModal(false);
        return;
      }
      dispatch(eventApiDispatchers.updateEvent(
        getNudgePayloadFromForm(nudgeForm),
        selectedApp,
        nudgeForm.id.value,
        {
          success: () => redirectTo(redirectUrl),
        }
      ));
    } else {
      // todo handle update production and test event
      const validatedForm = isEventFormValid(eventForm, false, gameData.data,
        searchQuery.get(URL_SEARCH_KEY_EVENT_TYPE), apps.list, isSelectedAppCrypto, selectedApp);
      setShowCreateEventError(!validatedForm._isFormValid);
      if (!validatedForm._isFormValid) {
        dispatch(setEventForm({ ...validatedForm, _isSubmittedOnce: true }));
        setShowEventCreateModal(false);
        return;
      }
      dispatch(eventApiDispatchers.updateEvent(
        getEventPayloadFromForm(eventForm),
        selectedApp,
        eventForm.id.value,
        {
          success: () => redirectTo(redirectUrl),
        }
      ));
    }
  };

  const updateLeaderboard = () => {
    const newRedirectUrl = ROUTES.LEADERBOARDS.replace(URL_PART_APP_ID, selectedApp) +
      '?view=' + VIEW_VALUES.PROD;

    const validatedForm = isEventFormValid(eventForm, false, gameData.data,
      searchQuery.get(URL_SEARCH_KEY_EVENT_TYPE), apps.list, isSelectedAppCrypto, selectedApp);
    setShowCreateEventError(!validatedForm._isFormValid);
    if (!validatedForm._isFormValid) {
      dispatch(setEventForm({ ...validatedForm, _isSubmittedOnce: true }));
      setShowEventCreateModal(false);
      return;
    }
    dispatch(eventApiDispatchers.updateEvent(
      getEventPayloadFromForm(eventForm),
      selectedApp,
      eventForm.id.value,
      {
        success: () => redirectTo(newRedirectUrl),
      }
    ));
  };

  const hideEventCreateModal = () => {
    setShowEventCreateModal(false);
  };

  const hideLeaderboardCreateModal = () => {
    setShowLeaderboardCreateModal(false);
  };

  return (
    <Wrapper>
      <Grid container spacing={0}>
        <Hidden smDown>
          <Grid container item xs={12} md={4}>
            <List>
              <ListItem button={true}>
                <Link to="/support">Support</Link>
              </ListItem>
            </List>
          </Grid>
        </Hidden>
        <Grid container item xs={12} md={8} justify="flex-end">
          {apps.list.length > 0 &&
          <FooterButtons>
            {(p.path.includes(ROUTES.EDIT_EVENT.replace(':id', '')) || p.path.endsWith(ROUTES.CREATE_EVENT)) &&
              <Button onClick={e => {
                redirectTo(
                  ROUTES.EVENTS.replace(URL_PART_APP_ID, selectedApp) +
                  `?${EVENT_URL_PARAMS.view}=` + (searchQuery.get(EVENT_URL_PARAMS.view) || VIEW_VALUES.PROD) +
                  '&' + URL_SEARCH_KEY_EVENT_TYPE + '=' + searchQuery.get(URL_SEARCH_KEY_EVENT_TYPE)
                );
              }}>
                Cancel
              </Button>
            }

            {(p.path.includes(ROUTES.EDIT_LEADERBOARD.replace(':id', '')) || p.path.endsWith(ROUTES.CREATE_LEADERBOARD)) &&
              <Button onClick={e => {
                redirectTo(
                  ROUTES.LEADERBOARDS.replace(URL_PART_APP_ID, selectedApp) +
                  `?${EVENT_URL_PARAMS.view}=` + (searchQuery.get(EVENT_URL_PARAMS.view) || VIEW_VALUES.PROD) +
                  '&' + URL_SEARCH_KEY_EVENT_TYPE + '=' + searchQuery.get(URL_SEARCH_KEY_EVENT_TYPE)
                );
              }}>
                Cancel
              </Button>
            }
            
            {(p.path.endsWith(ROUTES.GAME_CONFIG_CREATE) || p.path.endsWith('/draft')) &&
              <React.Fragment>
                <Button variant="contained" color="primary"
                  onClick={saveDraft}
                  disabled={!form._isFormTouched}
                >
                  Save Draft
                </Button>
                <Button variant="outlined" color="primary"
                  onClick={() => setShowDraftToTestDiff(true)}
                  disabled={!canBeDeployed}
                >
                  Deploy Draft to Test Env.
                </Button>
                <Button variant="outlined" color="primary"
                  onClick={() => setShowDraftToLiveDiff(true)}
                  disabled={!canBeDeployed}
                >
                  Deploy Draft to Live Env.
                </Button>
              </React.Fragment>
            }
            {p.path.endsWith(ROUTES.GAME_CONFIG_CURRENT_TEST) && !showConfigNotFound &&
              <React.Fragment>
                <Button variant="outlined" color="primary"
                  onClick={() => setShowTestToLiveDiff(true)}
                >
                  Deploy to Current Test to Live Env.
                </Button>
              </React.Fragment>
            }
            {p.path.endsWith(ROUTES.GAME_CONFIG_PREVIOUS_LIVE) && !showConfigNotFound &&
              <Button variant="contained" color="primary"
                onClick={() => setShowDiff(true)}
              >
                Rollback
              </Button>
            }
            {p.path.endsWith(ROUTES.CREATE_EVENT) &&
              <React.Fragment>
                <Button variant="contained" color="primary"
                  onClick={() => setShowEventCreateModal(true)}
                  disabled={creatingEvent.loading === XHR_STATE.IN_PROGRESS}
                >
                  Create Production Event
                </Button>
                <Button variant="contained" color="primary"
                  onClick={e => createEvent(false, true, Boolean(searchQuery.get('cloneId')))}
                  disabled={creatingEvent.loading === XHR_STATE.IN_PROGRESS}
                >
                  Create Test Event
                </Button>
              </React.Fragment>
            }
            {p.path.endsWith(ROUTES.CREATE_LEADERBOARD) &&
              <React.Fragment>
                <Button variant="contained" color="primary"
                  onClick={() => setShowLeaderboardCreateModal(true)}
                  disabled={creatingEvent.loading === XHR_STATE.IN_PROGRESS}
                >
                  Create Production Leaderboard
                </Button>
                <Button variant="contained" color="primary"
                  onClick={e => createLeaderboard(false, true, Boolean(searchQuery.get('cloneId')))}
                  disabled={creatingEvent.loading === XHR_STATE.IN_PROGRESS}
                >
                  Create Test Leaderboard
                </Button>
              </React.Fragment>
            }
            {p.path.includes(ROUTES.EDIT_EVENT.replace(':id', '')) &&
              modeFromUrl !== EVENT_URL_PARAMS.modeValue &&
              <Button variant="contained" color="primary"
                disabled={updatingEvent.loading === XHR_STATE.IN_PROGRESS}
                onClick={() => {
                  const found = events.eventsList.find(event => event.id === eventForm.id.value);
                  if (found) {
                    setOriginalEventString(JSON.stringify(
                      getEventPayloadFromForm(
                        getEventFormFromPayload(found)
                      ), null, 2
                    ));
                  }
                  setShowEventDiff(true);
                }}
              >
                Save Event
              </Button>
            }
            {p.path.includes(ROUTES.EDIT_LEADERBOARD.replace(':id', '')) &&
              modeFromUrl !== EVENT_URL_PARAMS.modeValue &&
              <Button variant="contained" color="primary"
                disabled={updatingEvent.loading === XHR_STATE.IN_PROGRESS}
                onClick={() => {
                  const found = events.eventsList.find(event => event.id === eventForm.id.value);
                  if (found) {
                    setOriginalEventString(JSON.stringify(
                      getEventPayloadFromForm(
                        getEventFormFromPayload(found)
                      ), null, 2
                    ));
                  }
                  setShowLeaderboardDiff(true);
                }}
              >
                Save Leaderboard
              </Button>
            }
            {p.path.includes(ROUTES.EDIT_EVENT.replace(':id', '')) &&
              modeFromUrl === EVENT_URL_PARAMS.modeValue &&
              <React.Fragment>
                <Button variant="contained" color="primary"
                  disabled={updatingEvent.loading === XHR_STATE.IN_PROGRESS}
                  onClick={() => {
                    const s = new URLSearchParams(searchQuery);
                    s.delete(EVENT_URL_PARAMS.mode);
                    redirectTo(window.location.pathname + '?' + s.toString());
                  }}
                >
                  Edit Event
                </Button>
                <Button variant="contained" color="primary"
                  disabled={updatingEvent.loading === XHR_STATE.IN_PROGRESS}
                  onClick={() => {
                    const s = new URLSearchParams(searchQuery);
                    s.delete(EVENT_URL_PARAMS.mode);
                    // redirectTo(`${window.location.pathname}?${s.toString()}&cloneId=${eventForm.id.value}`);
                    // console.info((p.params as any).id)
                    // return;
                    redirectTo(`${ROUTES.CREATE_EVENT}?cloneId=${(p.params as any).id}` +
                      `&${URL_SEARCH_KEY_EVENT_TYPE}=${getEventCategoryFromPayload(getEventPayloadFromForm(eventForm))}&`+
                      `${EVENT_URL_PARAMS.view}=${searchQuery.get(EVENT_URL_PARAMS.view)}`)
                  }}
                >
                  Clone Event
                </Button>
              </React.Fragment>
            }
            {p.path.includes(ROUTES.EDIT_LEADERBOARD.replace(':id', '')) &&
              modeFromUrl === EVENT_URL_PARAMS.modeValue &&
              <React.Fragment>
                <Button variant="contained" color="primary"
                  disabled={updatingEvent.loading === XHR_STATE.IN_PROGRESS}
                  onClick={() => {
                    const s = new URLSearchParams(searchQuery);
                    s.delete(EVENT_URL_PARAMS.mode);
                    redirectTo(window.location.pathname + '?' + s.toString());
                  }}
                >
                  Edit Leaderboard
                </Button>
                <Button variant="contained" color="primary"
                  disabled={updatingEvent.loading === XHR_STATE.IN_PROGRESS}
                  onClick={() => {
                    const s = new URLSearchParams(searchQuery);
                    s.delete(EVENT_URL_PARAMS.mode);
                    // redirectTo(`${window.location.pathname}?${s.toString()}&cloneId=${eventForm.id.value}`);
                    // console.info((p.params as any).id)
                    // return;
                    redirectTo(`${ROUTES.CREATE_LEADERBOARD}?cloneId=${(p.params as any).id}` +
                      `&${URL_SEARCH_KEY_EVENT_TYPE}=${getEventCategoryFromPayload(getEventPayloadFromForm(eventForm))}&`+
                      `${EVENT_URL_PARAMS.view}=${searchQuery.get(EVENT_URL_PARAMS.view)}`)
                  }}
                >
                  Clone Leaderboard
                </Button>
              </React.Fragment>
            }
            {(
                p.path.includes(ROUTES.CREATE_CHALLENGE) ||
                p.path.includes(ROUTES.EDIT_CHALLENGE)
              ) &&
              <ChallengesFooter />
            }
          </FooterButtons>
          }
        </Grid>
      </Grid>

      <DiffPreview
        open={showDiff}
        oldValue={JSON.stringify(gameData.data.find(gameData => gameData.appId === form.appId.value && gameData.gameId === selectedGame && gameData.version === EVersions.LIVE), null, 2)}
        newValue={JSON.stringify(gameData.data.find(gameData => gameData.appId === form.appId.value && gameData.gameId === selectedGame && gameData.version === EVersions.LAST_LIVE), null, 2)}
        splitView={true}
        handleClose={() => {setShowDiff(false)}}
        handleSecondaryClick={() => {setShowDiff(false)}}
        handlePrimaryClick={rollback}
        title="Preview differences between Live and Last Live configs"
        disableButtons={upgradeToLive.loading === XHR_STATE.IN_PROGRESS}
      />
      <DiffPreview
        open={showTestToLiveDiff}
        oldValue={JSON.stringify(gameData.data.find(gameData => gameData.appId === form.appId.value && gameData.gameId === selectedGame && gameData.version === EVersions.LIVE), null, 2)}
        newValue={JSON.stringify(gameData.data.find(gameData => gameData.appId === form.appId.value && gameData.gameId === selectedGame && gameData.version === EVersions.PREVIEW_LIVE), null, 2)}
        splitView={true}
        handleClose={() => {setShowTestToLiveDiff(false)}}
        handleSecondaryClick={() => {setShowTestToLiveDiff(false)}}
        handlePrimaryClick={deployFromTestToLive}
        disableButtons={upgradeFromTestToLive.loading === XHR_STATE.IN_PROGRESS}
        title="Preview differences between Live and Current Test configs"
        primaryButtonText="Deploy Current Test to Live"
      />
      <DiffPreview
        open={showDraftToTestDiff}
        oldValue={JSON.stringify(gameData.data.find(gameData => gameData.appId === form.appId.value && gameData.gameId === selectedGame && gameData.version === EVersions.PREVIEW_LIVE), null, 2)}
        newValue={JSON.stringify(gameData.data.find(gameData => gameData.appId === form.appId.value && gameData.gameId === selectedGame && gameData.version === EVersions.DRAFT), null, 2)}
        splitView={true}
        handleClose={() => {setShowDraftToTestDiff(false)}}
        handleSecondaryClick={() => {setShowDraftToTestDiff(false)}}
        handlePrimaryClick={deployToTest}
        disableButtons={upgradeFromTestToLive.loading === XHR_STATE.IN_PROGRESS}
        title="Preview differences between Draft and Current Test configs"
        primaryButtonText="Deploy Draft to Current Test"
      />
      <DiffPreview
        open={showDraftToLiveDiff}
        oldValue={JSON.stringify(gameData.data.find(gameData => gameData.appId === form.appId.value && gameData.gameId === selectedGame && gameData.version === EVersions.LIVE), null, 2)}
        newValue={JSON.stringify(gameData.data.find(gameData => gameData.appId === form.appId.value && gameData.gameId === selectedGame && gameData.version === EVersions.DRAFT), null, 2)}
        splitView={true}
        handleClose={() => {setShowDraftToLiveDiff(false)}}
        handleSecondaryClick={() => {setShowDraftToLiveDiff(false)}}
        handlePrimaryClick={deployToLive}
        disableButtons={upgradeFromTestToLive.loading === XHR_STATE.IN_PROGRESS}
        title="Preview differences between Draft and Current Live configs"
        primaryButtonText="Deploy Draft to Current Live"
      />
      <DiffPreview
        open={showEventDiff}
        oldValue={originalEventString}
        newValue={JSON.stringify(getEventPayloadFromForm(eventForm), null, 2)}
        splitView={true}
        handleClose={() => {setShowEventDiff(false)}}
        handleSecondaryClick={() => {setShowEventDiff(false)}}
        handlePrimaryClick={updateEvent}
        disableButtons={updatingEvent.loading === XHR_STATE.IN_PROGRESS}
        title="Preview differences to event"
        primaryButtonText="Save Event"
        leftTitle="Saved Event"
        rightTitle="Edited Event"
      />

      <DiffPreview
        open={showLeaderboardDiff}
        oldValue={originalEventString}
        newValue={JSON.stringify(getEventPayloadFromForm(eventForm), null, 2)}
        splitView={true}
        handleClose={() => {setShowLeaderboardDiff(false)}}
        handleSecondaryClick={() => {setShowLeaderboardDiff(false)}}
        handlePrimaryClick={updateLeaderboard}
        disableButtons={updatingEvent.loading === XHR_STATE.IN_PROGRESS}
        title="Preview differences to Leaderboard"
        primaryButtonText="Save Leaderboard"
        leftTitle="Saved Leaderboard"
        rightTitle="Edited Leaderboard"
      />

      {/* todo show dialogs instead of snackbar with response formatted as JSON in <pre> tag */}
      <Snackbar
        open={creatingOrUpdating === XHR_STATE.COMPLETE && !creatingOrUpdatingError}
        autoHideDuration={3000}
        onClose={() => dispatch(setCreatingOrUpdating(XHR_STATE.ASLEEP))}
      >
        <Alert onClose={() => dispatch(setCreatingOrUpdating(XHR_STATE.ASLEEP))} severity="success">
          Saved config for {form.appId.value} as draft.
        </Alert>
      </Snackbar>
      <Snackbar
        open={upgradeToLive.loading === XHR_STATE.COMPLETE && !upgradeToLive.error}
        autoHideDuration={3000}
        onClose={() => dispatch(setUpgradeToLiveLoading(XHR_STATE.ASLEEP))}
      >
        <Alert onClose={() => dispatch(setUpgradeToLiveLoading(XHR_STATE.ASLEEP))} severity="success">
          Saved config for {form.appId.value} in Live environment.
        </Alert>
      </Snackbar>
      <Snackbar
        open={upgradeToPreviewLive.loading === XHR_STATE.COMPLETE && !upgradeToPreviewLive.error}
        autoHideDuration={3000}
        onClose={() => dispatch(setUpgradeToPreviewLiveLoading(XHR_STATE.ASLEEP))}
      >
        <Alert onClose={() => dispatch(setUpgradeToPreviewLiveLoading(XHR_STATE.ASLEEP))} severity="success">
          Saved config for {form.appId.value} in Test environment.
        </Alert>
      </Snackbar>
      <Snackbar
        open={creatingOrUpdating === XHR_STATE.COMPLETE && creatingOrUpdatingError !== ''}
        autoHideDuration={4000}
        onClose={() => dispatch(setCreatingOrUpdating(XHR_STATE.ASLEEP))}
      >
        <Alert onClose={() => dispatch(setCreatingOrUpdating(XHR_STATE.ASLEEP))} severity="error">
          Failed to save config for {form.appId.value} as draft. {creatingOrUpdatingError}
        </Alert>
      </Snackbar>
      <Snackbar
        open={upgradeToLive.loading === XHR_STATE.COMPLETE && upgradeToLive.error !== ''}
        autoHideDuration={4000}
        onClose={() => dispatch(setUpgradeToLiveLoading(XHR_STATE.ASLEEP))}
      >
        <Alert onClose={() => dispatch(setUpgradeToLiveLoading(XHR_STATE.ASLEEP))} severity="error">
          Failed to deploy config for {form.appId.value} in Live environment. {creatingOrUpdatingError}
        </Alert>
      </Snackbar>
      <Snackbar
        open={upgradeToPreviewLive.loading === XHR_STATE.COMPLETE && upgradeToPreviewLive.error !== ''}
        autoHideDuration={4000}
        onClose={() => dispatch(setUpgradeToPreviewLiveLoading(XHR_STATE.ASLEEP))}
      >
        <Alert onClose={() => dispatch(setUpgradeToPreviewLiveLoading(XHR_STATE.ASLEEP))} severity="error">
          Failed to deploy config for {form.appId.value} in Test environment. {creatingOrUpdatingError}
        </Alert>
      </Snackbar>

      <Dialog
        open={showCreateEventError}
        onClose={() => setShowCreateEventError(false)}
        scroll="paper"
        aria-labelledby="create-event-dialog-title"
        aria-describedby="scroll-dialog-description"
        disableBackdropClick={true}
      >
        <DialogTitle id="create-event-dialog-title">
          Please check fields with invalid input
        </DialogTitle>
        <DialogContent dividers={true}>
          <Alert severity="error">
            {eventForm._validationErrors.length > 0 &&
              <ul>
                {eventForm._validationErrors.map((valError, index) =>
                  <li key={valError + index}>{valError}</li>)}
              </ul>
            }
            {nudgeForm._validationErrors.length > 0 &&
              <ul>
                {nudgeForm._validationErrors.map((valError, index) =>
                  <li key={valError + index}>{valError}</li>)}
              </ul>
            }
          </Alert>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => {
            setShowCreateEventError(false);
            setShowEventDiff(false);
          }} color="primary">
            OK
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={showEventCreateModal}
        onClose={hideEventCreateModal}
        scroll="paper"
        aria-labelledby="create-event-dialog-title"
        aria-describedby="scroll-dialog-description"
        disableBackdropClick={true}
      >
        <DialogTitle id="create-event-dialog-title">
          Are You Sure You Want to Create this Event?
        </DialogTitle>
        <DialogContent dividers={true}>
          The Event cannot be disabed once it is Live.
        </DialogContent>
        <DialogActions>
          <Button onClick={hideEventCreateModal} color="primary"
            disabled={creatingEvent.loading === XHR_STATE.IN_PROGRESS}
          >
            Cancel
          </Button>
          <Button
            onClick={e => createEvent(true, p.path.endsWith(ROUTES.CREATE_EVENT), Boolean(searchQuery.get('cloneId')))}
            disabled={creatingEvent.loading === XHR_STATE.IN_PROGRESS}
            variant="contained" color="primary">
            Create Live Event
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={showLeaderboardCreateModal}
        onClose={hideLeaderboardCreateModal}
        scroll="paper"
        aria-labelledby="create-Leaderboard-dialog-title"
        aria-describedby="scroll-dialog-description"
        disableBackdropClick={true}
      >
        <DialogTitle id="create-Leaderboard-dialog-title">
          Are You Sure You Want to Create this Leaderboard?
        </DialogTitle>
        <DialogContent dividers={true}>
          The Leaderboard cannot be disabed once it is Live.
        </DialogContent>
        <DialogActions>
          <Button onClick={hideLeaderboardCreateModal} color="primary"
            disabled={creatingEvent.loading === XHR_STATE.IN_PROGRESS}
          >
            Cancel
          </Button>
          <Button
            onClick={e => createLeaderboard(true, p.path.endsWith(ROUTES.CREATE_LEADERBOARD), Boolean(searchQuery.get('cloneId')))}
            disabled={creatingEvent.loading === XHR_STATE.IN_PROGRESS}
            variant="contained" color="primary">
            Create Live Leaderboard
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={showGameConfigErrorModal}
        onClose={() => setShowGameConfigErrorModal(false)}
        scroll="paper"
        aria-labelledby="gc-errors-dialog-title"
        aria-describedby="scroll-dialog-description"
        disableBackdropClick={true}
      >
        <DialogTitle id="gc-errors-dialog-title">
          Game Config Validation Errors
        </DialogTitle>
        <DialogContent dividers={true}>
          <Alert severity="warning">
            <ul>
              {form._validationErrors.map(err =>
                <li key={err}>{err}</li>)}
            </ul>
          </Alert>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setShowGameConfigErrorModal(false)}
            variant="contained" color="primary">
            Ok
          </Button>
        </DialogActions>
      </Dialog>
    </Wrapper>
  );
}

export default Footer;

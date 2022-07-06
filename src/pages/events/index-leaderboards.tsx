/* eslint-disable react-hooks/exhaustive-deps */
import {
  Button, Chip, createStyles, Dialog, DialogActions, DialogContent, DialogTitle, Grid, IconButton, makeStyles, Menu, MenuItem,
  Paper, Snackbar, Switch, Tab, Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow, Tabs, Theme, Typography, useMediaQuery, useTheme
} from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import React, { Fragment, useEffect, useState } from 'react';
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file
import {
  MoreHorizontal,
  Plus
} from 'react-feather';
import Helmet from 'react-helmet';
import { Link } from 'react-router-dom';
import styled from "styled-components";
import { EVENT_URL_PARAMS } from '../../common/common-types';
import { ROUTES, URL_PART_APP_ID, URL_SEARCH_KEY_CLONE_ID, URL_SEARCH_KEY_EVENT_TYPE, XHR_STATE } from '../../common/constants';
import {
  useAppDispatch,
  useAppRedirect,
  useAppSelector,
  useShouldShowPlaceholder,
  useUrlQuery
} from '../../common/hooks';
import LoaderPaper from '../../components/LoaderPaper';
import NoAppPlaceholder from '../../components/no-app-placeholder';
import globalStyles from '../../theme/globalStyles';
import { EEventCategory, IEventBattlePayload, IEventNudgePayload, TEventPayload, USER_ROLE } from '../../types/eventTypes';
import { eventApiDispatchers } from './eventSlice';

const GenericPage = styled.div`
  // .MuiTypography-h3 {
  //   margin-top: 1rem;
  // }
  .MuiFormControl-root,
  .MuiFormControlLabel-root {
    display: block;
    margin-bottom: 1rem;
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
  td > ol,
  td > ul {
    padding-left: 1.5rem;
    ul {
      padding-left: 1.5rem;
      list-style-type: square;
    }
  }
`;

const useStyles = makeStyles((theme: Theme) => createStyles({
  root: {
    flexGrow: 1,
    display: 'flex',
    justifyContent: 'space-between',
  },
  filtersBar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    '& div.MuiFormControl-root': {
      minWidth: 150,
      marginBottom: 0,
    },
  },
  typography: {
    padding: '1rem',  // theme.spacing(2),
  },
  popoverPaper: {
    width: 200,
    padding: '1rem',
  },
  eventsTableRoot: {
    height: `calc(100vh - 64px - 20px - 50px - 72px - 75px - 48px - 62px)`,
    position: 'relative',
    '& .MuiTableContainer-root': {
      position: 'absolute',
      height: '100%',
      width: '100%',
      left: 0,
      top: 0,
    },
  },
})
);

export enum VIEW_VALUES {
  TEST = 'TEST',
  PROD = 'PROD',
};

function Leaderboards(props: any) {
  const { selectedApp, apps, isSelectedAppCrypto } = useAppSelector(state => state.gameConfigForm);
  const classes = useStyles();
  const globalClasses = globalStyles();
  const dispatch = useAppDispatch();
  const searchQuery = useUrlQuery();
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const shouldShowPlaceholder = useShouldShowPlaceholder();
  const { events, creatingEvent, updatingEvent } = useAppSelector(state => state.eventSlice);
  const [isEnabling, setIsEnabling] = useState(false);
  const [enableDisableSuccess, setEnableDisableSuccess] = useState(false);
  const [enableDisableError, setEnableDisableError] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<IEventBattlePayload>();
  const [filteredEvents, setFilteredEvents] = useState([...events.eventsList]);
  const [anchorEl, setAnchorEl] = React.useState<{el: HTMLButtonElement | null}[]>([]);
  const [open, setOpen] = React.useState(false);
  enum TAB_VALUES {
    TEST = 1,
    PROD = 0,
  };
  const eventViewFromUrl = React.useMemo(() => searchQuery.get(EVENT_URL_PARAMS.view), []);
  //const eventCategoryFromUrl: EEventCategory = searchQuery.get(EVENT_URL_PARAMS.type) as EEventCategory || EEventCategory.ALL;
  const [view, setView] = React.useState(
    !eventViewFromUrl
      ? TAB_VALUES.PROD
      : (eventViewFromUrl === VIEW_VALUES.PROD ? TAB_VALUES.PROD : TAB_VALUES.TEST)
  );

  // const [filterPlacementPosition, setFilterPlacementPosition] = useState(searchQuery.get(EVENT_URL_PARAMS.placementPosition) || '');
  // const [filterPlacementPriority, setFilterPlacementPriority] = useState(parseInt(searchQuery.get(EVENT_URL_PARAMS.placementPriority) || 'NaN'));

  //const RANGE_KEY_DATE_FILTER = 'RANGE_KEY_DATE_FILTER';
  // const defaultDateRange = {
  //   startDate: new Date(
  //     parseInt(searchQuery.get(EVENT_URL_PARAMS.startTime) ||
  //     parseInt(new Date().getTime() / 1000 + '') + '')
  //     * 1000),
  //   endDate: new Date(
  //     parseInt(searchQuery.get(EVENT_URL_PARAMS.endTime) ||
  //     parseInt((new Date().getTime() / 1000) + 7 * ONE_DAY_IN_MILLIS + '') + '')
  //     * 1000),
  //   key: RANGE_KEY_DATE_FILTER,
  // };
  // const [selectionRange, setSelectionRange] = useState(defaultDateRange);
  // const [dateAnchorEl, setDateAnchorEl] = React.useState<HTMLButtonElement | null>(null);
  // const [placementAnchorEl, setPlacementAnchorEl] = React.useState<HTMLButtonElement | null>(null);
  // const [dsiAnchorEl, setDsiAnchorEl] = React.useState<HTMLButtonElement | null>(null);

  const [isDeleteModalVisible, setIsDeleteModalVisible] = React.useState(false);
  const [selectedEventForDelete, setSelectedEventForDelete] = React.useState<null | TEventPayload>(null);
  const [selectedEventIndexForDelete, setSelectedEventIndexForDelete] = React.useState(-1);
  const [showDeleteSnackbar, setShowDeleteSnackbar] = React.useState(false);

  const [isForceInvisibleModalVisible, setIsForceInvisibleModalVisible] = React.useState(false);
  const [selectedEventForForceInvisible, setSelectedEventForForceInvisible] = React.useState<null | IEventBattlePayload | IEventNudgePayload>(null);
  const [showForceInvisibleSnackbar, setShowForceInvisibleSnackbar] = React.useState(false);

  //const eventCategory = EEventCategory.CHALLENGE_LEADERBOARD;

  // const eventsViewPageUrl = React.useMemo(() => `${ROUTES.EVENTS.replace(URL_PART_APP_ID, selectedApp)}`, []);
  const eventsViewPageUrl = `${ROUTES.LEADERBOARDS.replace(URL_PART_APP_ID, selectedApp)}`;

  // useEffect(() => {
  //   filterEvents();
  // });

  useEffect(() => {
    if (selectedApp) {
      // if (!eventCategory) {
      //   searchQuery.set(EVENT_URL_PARAMS.type, EEventCategory.BATTLE);
      //   redirectToUrl(`${eventsViewPageUrl}?${searchQuery.toString()}`);
      // }
      if (!eventViewFromUrl) {
        searchQuery.set(EVENT_URL_PARAMS.view, VIEW_VALUES.PROD);
        redirectToUrl(`${eventsViewPageUrl}?${searchQuery.toString()}`);
      }
      dispatch(eventApiDispatchers.getEvents(EEventCategory.CHALLENGE_LEADERBOARD, selectedApp));
    }
  }, [selectedApp]);

  useEffect(() => {
    setAnchorEl(events.eventsList.map(e => { return { el: null }}));
  }, [events]);

  useEffect(() => {
    filterEvents();
  }, [
    events,
    view,
    selectedApp
  ]);

  const redirectToUrl = useAppRedirect();

  const getEventsFilteredByView = (events: IEventBattlePayload[]): IEventBattlePayload[] => {
    return events.filter(event => {
      if (view === TAB_VALUES.TEST && !event.jsonLogicFilters.includes(USER_ROLE.REGULAR)) return true;
      if (view === TAB_VALUES.PROD && event.jsonLogicFilters.includes(USER_ROLE.REGULAR)) return true;
      return false;
    });
  };

  const filterEvents = () => {
    // filter by test/prod
    let partiallyFilteredEvents = getEventsFilteredByView(events.eventsList);
    setFilteredEvents([...partiallyFilteredEvents]);
  };

  const handleClick = (index: number) => (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    const newAnchors = [...anchorEl];
    newAnchors.splice(index, 1);
    newAnchors.splice(index, 0, { el: event.currentTarget});
    setAnchorEl(newAnchors);
    // setOpen((prev) => !prev);
    setOpen(!open);
  };

  const handleClose = (index: number) => {
    const newAnchors = [...anchorEl];
    newAnchors.splice(index, 1);
    newAnchors.splice(index, 0, { el: null});
    setAnchorEl(newAnchors);
  };

  const deleteClick = (event: TEventPayload, eventIndex: number) => {
    setIsDeleteModalVisible(true);
    setSelectedEventForDelete(event);
    setSelectedEventIndexForDelete(eventIndex);
  };

  const hideDeleteModal = () => {
    setIsDeleteModalVisible(false);
  };

  const deleteProceed = () => {
    handleClose(selectedEventIndexForDelete);
    if (selectedEventForDelete) {
      dispatch(eventApiDispatchers.deleteEvent(
        selectedApp,
        selectedEventForDelete.id,
        {
          success: () => {
            dispatch(eventApiDispatchers.getEvents(EEventCategory.CHALLENGE_LEADERBOARD, selectedApp));
            setIsDeleteModalVisible(false);
            setShowDeleteSnackbar(true);
          },
        }
      ));
    }
  };

  const forceInvisibleClick = (event: IEventBattlePayload | IEventNudgePayload, eventIndex: number) => {
    setIsForceInvisibleModalVisible(true);
    setSelectedEventForForceInvisible(event);
  };

  const hideForceInvisibleModal = () => {
    setIsForceInvisibleModalVisible(false);
  };

  const forceInvisibleProceed = () => {
    if (selectedEventForForceInvisible) {
      dispatch(eventApiDispatchers.updateEvent(
        {
          ...selectedEventForForceInvisible,
          forceInvisible: true
        },
        selectedApp,
        selectedEventForForceInvisible.id,
        {
          success: () => {
            dispatch(eventApiDispatchers.getEvents(EEventCategory.CHALLENGE_LEADERBOARD, selectedApp));
            setIsForceInvisibleModalVisible(false);
            setShowForceInvisibleSnackbar(true);
          },
        }
      ));
    }
  };

  return (
    <GenericPage>
      <Helmet title="Game Config" />

      {shouldShowPlaceholder && apps.loading !== XHR_STATE.IN_PROGRESS &&
        <NoAppPlaceholder
          imageUrl={'https://assets.onclixlogix-samplecode.com/website/img/icons/illustration-calendar.svg'}
          text={'You can set up your Live-ops events here. To see the events create a new app.'}
        />
      }

      {!shouldShowPlaceholder &&

      <Fragment>

      <Typography variant="h1" gutterBottom>
        Social Leaderboards
      </Typography>

      <form
        noValidate
        // onSubmit={e => formSubmit(e)}
      >
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <Paper className={classes.root}>
              {creatingEvent.loading !== XHR_STATE.IN_PROGRESS && <Tabs
                value={view}
                onChange={(e: React.ChangeEvent<{}>, newValue: number) => {
                  searchQuery.set(EVENT_URL_PARAMS.view, newValue ? 'TEST' : 'PROD');
                  redirectToUrl(`${eventsViewPageUrl}?${searchQuery.toString()}`);
                  setView(newValue);
                }}
                indicatorColor="primary"
                textColor="primary"
                centered
              >
                <Tab value={0} label="Production Events" />
                <Tab value={1} label="Test Events" />
              </Tabs>}
              <Button
                variant="contained"
                color="primary"
                onClick={() => redirectToUrl(ROUTES.CREATE_LEADERBOARD.replace(URL_PART_APP_ID, selectedApp) + '?type=' + EEventCategory.CHALLENGE_LEADERBOARD)}
                style={{ borderRadius: 0 }}
              >
                <Plus style={{ marginRight: 10 }} /> Create
              </Button>
            </Paper>
          </Grid>
        </Grid>

        <Grid container style={{ margin: '12px 0' }}>
          <Grid item xs={12}>
            {filteredEvents.length > 0 && <Typography variant="subtitle2">Found {filteredEvents.length} Events</Typography>}
          </Grid>
        </Grid>

        {filteredEvents.length === 0 && creatingEvent.loading !== XHR_STATE.IN_PROGRESS &&
          <Alert severity="warning" style={{ margin: '12px 0' }}>No Events Found</Alert>
        }

        {events.error &&
          <Alert severity="error" style={{ margin: '12px 0' }}>
            {events.error}
          </Alert>
        }

        {(events.loading === XHR_STATE.IN_PROGRESS) && <LoaderPaper />}

        {/* {console.info(events.loading, XHR_STATE.ASLEEP, events.loading === XHR_STATE.ASLEEP)} */}
        {events.loading === XHR_STATE.ASLEEP && filteredEvents.length > 0 && <Grid container spacing={6}>
          <Grid item xs={12}>
            <Paper className={classes.eventsTableRoot}
            >
            <TableContainer className={globalClasses.customScrollbar}>
              <Table aria-label="Events table" size="small" stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell>Entry Fee</TableCell>
                    {/* todo disabled this column temporarily due to error on QA env */}
                    <TableCell>Winning Amount</TableCell>
                    <TableCell>Start Time</TableCell>
                    <TableCell>End Time</TableCell>
                    <TableCell>Description</TableCell>
                    <TableCell>Actions</TableCell>
                    <TableCell>Disable/Enable</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {/* todo implement pagination */}
                  {filteredEvents.map((event, eventIndex) =>
                    <TableRow key={event.id} hover>
                      <TableCell>
                        <Link
                          to={ROUTES.EDIT_LEADERBOARD.replace(URL_PART_APP_ID, selectedApp)
                            .replace(':id', event.id + '')
                            + `?${URL_SEARCH_KEY_EVENT_TYPE}=${EEventCategory.CHALLENGE_LEADERBOARD}`
                            + `&${EVENT_URL_PARAMS.view}=${searchQuery.get(EVENT_URL_PARAMS.view)}`
                            + `&${EVENT_URL_PARAMS.mode}=${EVENT_URL_PARAMS.modeValue}`}
                          title="View Event details"
                        >
                          {event.id}
                        </Link>
                      </TableCell>
                      <TableCell>{event.additionalParams.displayName}</TableCell>
                      <TableCell>
                        <ul>
                        {event.additionalParams.entryFeeList && event.additionalParams.entryFeeList.map((fee, feeIndex) =>
                          <li key={`fee-${eventIndex}-${feeIndex}`}>
                            {fee.realAmount &&
                              fee.realAmount.amount + fee.realAmount.currency
                            }
                            {fee.virtualAmountList &&
                              <ul>
                                {fee.virtualAmountList.map((va, vaIndex) =>
                                  <li key={`vfee-${eventIndex}-${feeIndex}-${vaIndex}`}>
                                    {va.amount}{va.currencyType}
                                  </li>
                                )}
                              </ul>
                            }
                          </li>
                        )}
                        </ul>
                        {!event.additionalParams.entryFeeList &&
                          <span style={{ fontStyle: 'italic' }}>
                            <span>(old) </span>
                            {event.additionalParams.entryFee ?
                              event.additionalParams.entryFee.amount + event.additionalParams.entryFee.currency : ''}
                            {Array.isArray(event.additionalParams.virtualEntryFees) && event.additionalParams.virtualEntryFees.length > 0 &&
                              event.additionalParams.virtualEntryFees.reduce((str, vef) => str + (str && ', ') + vef.amount + vef.currencyType, '')}
                          </span>
                        }
                      </TableCell>
                      <TableCell>
                        <ul>
                        {event.additionalParams.playerCountToRewardList && Object.keys(event.additionalParams.playerCountToRewardList)
                          .map(playerCount => event.additionalParams.playerCountToRewardList[playerCount]
                          ?.map((reward, rewardIndex) => <li key={`reward-${rewardIndex}`}>
                            {reward.realReward &&
                              (isSelectedAppCrypto ?
                                <Fragment>
                                  Real: {reward.realReward?.winningAmount?.amount}{reward.realReward?.winningAmount?.currency}
                                </Fragment>
                                :
                                <Fragment>
                                  Real: {reward.realReward?.winningAmount?.amount}{reward.realReward?.winningAmount?.currency},
                                  Bonus: {reward.realReward?.bonusAmount?.amount}{reward.realReward?.bonusAmount?.currency}
                                </Fragment>
                              )
                            }
                            {reward.virtualRewards?.map((vr, vri) =>
                              <div key={`vr-${vri}`}>{vr.amount}{vr.currencyType}</div>)}
                          </li>))}
                        </ul>
                      </TableCell>
                      <TableCell>
                        <span style={{ margin: 0 }}>
                        {event.repetitions.reduce((str, rep) =>
                          str + (str ? '\n' : '') +
                          new Date(rep.repetitionKeyValueMap.Start * 1000).toLocaleString(), '')}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span style={{ margin: 0 }}>
                        {event.repetitions.reduce((str, rep) =>
                          str + (str ? '\n' : '') +
                          new Date(rep.repetitionKeyValueMap.End * 1000).toLocaleString(), '')}
                        </span>
                      </TableCell>
                      <TableCell>{event.description}</TableCell>
                      <TableCell>
                        <IconButton
                          onClick={handleClick(eventIndex)}
                        >
                          <MoreHorizontal />
                        </IconButton>
                        <Menu
                          id="event-options-menu"
                          anchorEl={anchorEl[eventIndex] ? anchorEl[eventIndex].el : null}
                          // keepMounted
                          open={Boolean(anchorEl[eventIndex] ? anchorEl[eventIndex].el : false)}
                          onClose={e => handleClose(eventIndex)}
                          PaperProps={{ style: { boxShadow: 'rgba(0, 0, 0, 0.2) 0px 0px 20px' }}}
                        >
                          <MenuItem
                            component={Link}
                            to={ROUTES.EDIT_LEADERBOARD.replace(URL_PART_APP_ID, selectedApp)
                              .replace(':id', event.id + '')
                              + `?${URL_SEARCH_KEY_EVENT_TYPE}=${EEventCategory.CHALLENGE_LEADERBOARD}`
                              + `&${EVENT_URL_PARAMS.view}=${searchQuery.get(EVENT_URL_PARAMS.view)}`
                              + `&${EVENT_URL_PARAMS.mode}=${EVENT_URL_PARAMS.modeValue}`}
                          >
                            View
                          </MenuItem>
                          <MenuItem
                            component={Link}
                            to={ROUTES.EDIT_LEADERBOARD.replace(URL_PART_APP_ID, selectedApp)
                              .replace(':id', event.id + '')
                              + `?${URL_SEARCH_KEY_EVENT_TYPE}=${EEventCategory.CHALLENGE_LEADERBOARD}`
                              + `&${EVENT_URL_PARAMS.view}=${searchQuery.get(EVENT_URL_PARAMS.view)}`}
                          >
                            Edit
                          </MenuItem>
                          {
                            event.forceInvisible === false &&
                            <MenuItem
                              onClick={e => forceInvisibleClick(event, eventIndex)}
                            >
                              Force Invisible
                            </MenuItem>
                          }
                          <MenuItem
                            component={Link}
                            to={`${ROUTES.CREATE_LEADERBOARD.replace(URL_PART_APP_ID, selectedApp)}?${URL_SEARCH_KEY_CLONE_ID}=${event.id}` +
                              `&${URL_SEARCH_KEY_EVENT_TYPE}=${EEventCategory.CHALLENGE_LEADERBOARD}&`+
                              `${EVENT_URL_PARAMS.view}=${searchQuery.get(EVENT_URL_PARAMS.view)}`}
                          >
                            Clone
                          </MenuItem>
                          <MenuItem
                            onClick={e => deleteClick(event, eventIndex)}
                            // disabled={event.isLiveOrVisible}
                          >
                            Delete
                          </MenuItem>
                        </Menu>
                      </TableCell>
                      <TableCell>
                        {(!event.isLiveOrVisible || event.forceInvisible) &&
                        (event.repetitions.length && (event.repetitions[0].repetitionKeyValueMap.End * 1000 + event.extraTimeAfterEnd) > Date.now())
                        && <Switch
                          checked={!event.forceInvisible}
                          // disabled={event._isUpdating} todo
                          onChange={e => {
                            setSelectedEvent(event);
                            setIsEnabling(e.target.checked);
                            dispatch(eventApiDispatchers.updateEvent(
                              {
                                ...event,
                                forceInvisible: !e.target.checked
                              },
                              selectedApp,
                              event.id,
                              {
                                success: () => {
                                  setEnableDisableSuccess(true);
                                  setEnableDisableError(false);
                                  // todo optimisation use response of createEventDispatcher, instead of making below call
                                  dispatch(eventApiDispatchers.getEvents(EEventCategory.CHALLENGE_LEADERBOARD, selectedApp));
                                },
                                error: () => {
                                  setEnableDisableSuccess(false);
                                  setEnableDisableError(true);
                                },
                              }
                            ));
                          }}
                          name="checkedB"
                          color="primary"
                        />}
                        {event.isLiveOrVisible && !event.forceInvisible &&
                          <Chip color="primary" label="Live" />}
                        {event.repetitions
                          .filter(ev => ev.repetitionKeyValueMap.End * 1000 + event.extraTimeAfterEnd < Date.now())
                          .map(ev => <Chip key={ev.repetitionId} label="Expired" />
                        )}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
            </Paper>
          </Grid>
        </Grid>}
      </form>

      </Fragment>}

<Snackbar
        open={enableDisableSuccess}
        autoHideDuration={3000}
        onClose={() => setEnableDisableSuccess(false)}
      >
        <Alert onClose={() => {}} severity="success">
          { isEnabling ? 'Enabled' : 'Disable' } event "
          {selectedEvent?.additionalParams.displayName || selectedEvent?.description || selectedEvent?.id}" successfully.
        </Alert>
      </Snackbar>
      <Snackbar
        open={enableDisableError}
        autoHideDuration={3000}
        onClose={() => setEnableDisableError(false)}
      >
        <Alert onClose={() => {}} severity="error">
          Failed to { isEnabling ? 'enable' : 'disable' } event "
          {selectedEvent?.additionalParams.displayName || selectedEvent?.description || selectedEvent?.id}".
        </Alert>
      </Snackbar>
      <Snackbar
        open={showForceInvisibleSnackbar}
        autoHideDuration={3000}
        onClose={() => setShowForceInvisibleSnackbar(false)}
      >
        <Alert onClose={() => {}} severity="success">
          Made event with id "{selectedEventForForceInvisible && selectedEventForForceInvisible.id}" invisible successfully. 
          <span role="img" aria-label="done icon">✅</span>
        </Alert>
      </Snackbar>
      <Snackbar
        open={showDeleteSnackbar}
        autoHideDuration={3000}
        onClose={() => setShowDeleteSnackbar(false)}
      >
        <Alert onClose={() => {}} severity="success">
          Deleted event with id "{selectedEventForDelete && selectedEventForDelete.id}" successfully. 
          <span role="img" aria-label="done icon">✅</span>
        </Alert>
      </Snackbar>

      <Dialog
        open={isForceInvisibleModalVisible}
        onClose={hideForceInvisibleModal}
        scroll="paper"
        aria-labelledby="force invisible"
        aria-describedby="force invisible confirmation popup"
        disableBackdropClick={true}
      >
        <DialogTitle id="scroll-dialog-force-invisible">
          Are You Sure You Want to make this Leaderboard invisible?
        </DialogTitle>
        <DialogContent dividers={true}>
          The Leaderboard with id {selectedEventForForceInvisible && selectedEventForForceInvisible.id} will be made invisible.
        </DialogContent>
        <DialogActions>
          <Button onClick={hideForceInvisibleModal} color="primary"
            disabled={updatingEvent.loading === XHR_STATE.IN_PROGRESS}
          >
            Cancel
          </Button>
          <Button
            onClick={e => selectedEventForForceInvisible && forceInvisibleProceed()}
            disabled={updatingEvent.loading === XHR_STATE.IN_PROGRESS}
            variant="contained" color="primary">
            Make Force Invisible
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={isDeleteModalVisible}
        onClose={hideDeleteModal}
        scroll="paper"
        aria-labelledby="delete event"
        aria-describedby="delete event confirmation popup"
        disableBackdropClick={true}
        fullScreen={fullScreen}
        // maxWidth="xl"
      >
        <DialogTitle id="scroll-dialog-title">
          Are You Sure You Want to Delete this Event?
        </DialogTitle>
        <DialogContent dividers={true}>
          The Event with id {selectedEventForDelete && selectedEventForDelete.id} cannot be restored once it is deleted.
        </DialogContent>
        <DialogActions>
          <Button onClick={hideDeleteModal} color="primary"
            disabled={creatingEvent.loading === XHR_STATE.IN_PROGRESS}
          >
            Cancel
          </Button>
          <Button
            onClick={e => selectedEventForDelete && deleteProceed()}
            disabled={creatingEvent.loading === XHR_STATE.IN_PROGRESS}
            variant="contained" color="primary">
            Delete Event
          </Button>
        </DialogActions>
      </Dialog>
    </GenericPage>
  );
}

export default Leaderboards;

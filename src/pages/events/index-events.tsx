/* eslint-disable react-hooks/exhaustive-deps */
import { Button, Chip, createStyles, Dialog, DialogActions, DialogContent, DialogTitle,
  FormControl, Grid, IconButton, Input, InputLabel, makeStyles, Menu, MenuItem,
  Paper, Popover, Select, Snackbar, Switch, Tab, Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow, Tabs, TextField, Theme, Typography, useMediaQuery, useTheme
} from '@material-ui/core';
import React, { createRef, Fragment, useEffect, useState } from 'react';
import Helmet from 'react-helmet';
import { Link } from 'react-router-dom';
import styled from "styled-components";
import { ROUTES, URL_PART_APP_ID, URL_SEARCH_KEY_CLONE_ID, URL_SEARCH_KEY_EVENT_TYPE, XHR_STATE } from '../../common/constants';
import {
  MoreHorizontal,
  Plus,
  Search,
  X
} from 'react-feather';
import { eventApiDispatchers, ONE_DAY_IN_MILLIS } from './eventSlice';
import { EEventCategory, IEventBattlePayload, IEventNudgePayload,
  placementHumanReadable, TEventPayload, USER_ROLE
} from '../../types/eventTypes';
import { Alert } from '@material-ui/lab';
import { DateRangePicker } from 'react-date-range';
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file
import {
  useAppDispatch,
  useAppRedirect,
  useAppSelector,
  useShouldShowPlaceholder,
  useUrlQuery
} from '../../common/hooks';
import LoaderPaper from '../../components/LoaderPaper';
import globalStyles from '../../theme/globalStyles';
import { EVENT_URL_PARAMS } from '../../common/common-types';
import NoAppPlaceholder from '../../components/no-app-placeholder';

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

export const getActualEventCategory = (category: EEventCategory): EEventCategory => {
  return [
      EEventCategory.BATTLE,
      EEventCategory.TOURNAMENT,
      EEventCategory.MULTI_ENTRY_TOURNAMENT,
      EEventCategory.ELIMINATION
    ].includes(category) ?
    EEventCategory.BATTLE :
    category
};

export const getEventCategoryFromPayload = (event: IEventBattlePayload): EEventCategory => {
  if (
    event.eventCategory === EEventCategory.BATTLE &&
    (event.additionalParams.forcedAsyncPlayerCount === null || event.additionalParams.forcedAsyncPlayerCount === undefined) &&
    !event.additionalParams.mltData &&
    (!event.additionalParams.entryFeeList || event.additionalParams.entryFeeList.length === 1)
  ) {
    return EEventCategory.BATTLE;
  }
  if (
    event.additionalParams.forcedAsyncPlayerCount !== null &&
    event.additionalParams.forcedAsyncPlayerCount !== undefined &&
    (!event.additionalParams.entryFeeList || event.additionalParams.entryFeeList.length === 1)
  ) {
    return EEventCategory.TOURNAMENT;
  }
  if (
    event.additionalParams.entryFeeList !== null &&
    event.additionalParams.entryFeeList !== undefined &&
    event.additionalParams.entryFeeList.length > 1
  ) {
    return EEventCategory.MULTI_ENTRY_TOURNAMENT;
  }
  if (event.eventCategory === EEventCategory.SALE) {
    return EEventCategory.SALE;
  }
  if (Boolean(event.additionalParams.mltData)) {
    return EEventCategory.ELIMINATION;
  }
  return event.eventCategory;
};

function Events(props: any) {
  const { selectedApp, apps, isSelectedAppCrypto } = useAppSelector(state => state.gameConfigForm);
  const refParent: React.RefObject<HTMLInputElement> = createRef()
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
  const [filterDsiOperator, setFilterDsiOperator] = useState(searchQuery.get(EVENT_URL_PARAMS.dsiOperator) || '');
  const [filterDsiValue, setFilterDsiValue] = useState(parseInt(searchQuery.get(EVENT_URL_PARAMS.dsiValue) || '-1'));
  const [filteredEvents, setFilteredEvents] = useState([...events.eventsList]);
  const [searchNameQuery, setSearchNameQuery] = useState('');
  const [anchorEl, setAnchorEl] = React.useState<{el: HTMLButtonElement | null}[]>([]);
  const [open, setOpen] = React.useState(false);
  enum TAB_VALUES {
    TEST = 1,
    PROD = 0,
  };
  const eventViewFromUrl = React.useMemo(() => searchQuery.get(EVENT_URL_PARAMS.view), []);
  const eventCategoryFromUrl: EEventCategory = searchQuery.get(EVENT_URL_PARAMS.type) as EEventCategory || EEventCategory.ALL;
  const [view, setView] = React.useState(
    !eventViewFromUrl
      ? TAB_VALUES.PROD
      : (eventViewFromUrl === VIEW_VALUES.PROD ? TAB_VALUES.PROD : TAB_VALUES.TEST)
  );

  const [filterPlacementPosition, setFilterPlacementPosition] = useState(searchQuery.get(EVENT_URL_PARAMS.placementPosition) || '');
  const [filterPlacementPriority, setFilterPlacementPriority] = useState(parseInt(searchQuery.get(EVENT_URL_PARAMS.placementPriority) || 'NaN'));

  const RANGE_KEY_DATE_FILTER = 'RANGE_KEY_DATE_FILTER';
  const defaultDateRange = {
    startDate: new Date(
      parseInt(searchQuery.get(EVENT_URL_PARAMS.startTime) ||
      parseInt(new Date().getTime() / 1000 + '') + '')
      * 1000),
    endDate: new Date(
      parseInt(searchQuery.get(EVENT_URL_PARAMS.endTime) ||
      parseInt((new Date().getTime() / 1000) + 7 * ONE_DAY_IN_MILLIS + '') + '')
      * 1000),
    key: RANGE_KEY_DATE_FILTER,
  };
  const [selectionRange, setSelectionRange] = useState(defaultDateRange);
  const [dateAnchorEl, setDateAnchorEl] = React.useState<HTMLButtonElement | null>(null);
  const [placementAnchorEl, setPlacementAnchorEl] = React.useState<HTMLButtonElement | null>(null);
  const [dsiAnchorEl, setDsiAnchorEl] = React.useState<HTMLButtonElement | null>(null);

  const [isDeleteModalVisible, setIsDeleteModalVisible] = React.useState(false);
  const [selectedEventForDelete, setSelectedEventForDelete] = React.useState<null | TEventPayload>(null);
  const [selectedEventIndexForDelete, setSelectedEventIndexForDelete] = React.useState(-1);
  const [showDeleteSnackbar, setShowDeleteSnackbar] = React.useState(false);

  const [isForceInvisibleModalVisible, setIsForceInvisibleModalVisible] = React.useState(false);
  const [selectedEventForForceInvisible, setSelectedEventForForceInvisible] = React.useState<null | IEventBattlePayload | IEventNudgePayload>(null);
  const [showForceInvisibleSnackbar, setShowForceInvisibleSnackbar] = React.useState(false);

  
  useEffect(() => {
    const element = refParent.current?.parentElement;
   
    if (element) {
      element.style.removeProperty('padding');
      element.style.removeProperty('background');
      element.style.removeProperty('position');
    }
  }, []);
  const eventCategory = React.useMemo(() =>
    getActualEventCategory(eventCategoryFromUrl),
    [eventCategoryFromUrl]
  );
  // const eventsViewPageUrl = React.useMemo(() => `${ROUTES.EVENTS.replace(URL_PART_APP_ID, selectedApp)}`, []);
  const eventsViewPageUrl = `${ROUTES.EVENTS.replace(URL_PART_APP_ID, selectedApp)}`;

  useEffect(() => {
    if (selectedApp) {
      if (!eventCategory) {
        searchQuery.set(EVENT_URL_PARAMS.type, EEventCategory.BATTLE);
        redirectToUrl(`${eventsViewPageUrl}?${searchQuery.toString()}`);
      }
      if (!eventViewFromUrl) {
        searchQuery.set(EVENT_URL_PARAMS.view, VIEW_VALUES.PROD);
        redirectToUrl(`${eventsViewPageUrl}?${searchQuery.toString()}`);
      }
      if (eventCategory === EEventCategory.ALL) {
        dispatch(eventApiDispatchers.getAllEvents(EEventCategory.ALL, selectedApp));
      } else {
        dispatch(eventApiDispatchers.getEvents(eventCategory, selectedApp));
      }
    }
  }, [selectedApp]);
  useEffect(() => {
    setAnchorEl(events.eventsList.map(e => { return { el: null }}));
  }, [events]);
  useEffect(() => {
    filterEvents(eventCategoryFromUrl);
  }, [
    events,
    view,
    filterDsiOperator,
    filterPlacementPosition,
    filterPlacementPriority,
    filterDsiOperator,
    filterDsiValue,
    selectedApp
  ]);

  const redirectToUrl = useAppRedirect();

  const clearFilters = () => {
    setFilterDsiOperator('');
    clearDateFilter();
  };

  const toggleDateMenu = (e: React.MouseEvent<HTMLButtonElement | null>) => {
    setDateAnchorEl(e.currentTarget);
  };

  const togglePlacementMenu = (e: React.MouseEvent<HTMLButtonElement | null>) => {
    setPlacementAnchorEl(e.currentTarget);
  };

  const toggleDsiMenu = (e: React.MouseEvent<HTMLButtonElement | null>) => {
    setDsiAnchorEl(e.currentTarget);
  };

  const searchByName = (searchTerm: string) => {
    if (!searchTerm) {
      setFilteredEvents(getEventsFilteredByView(events.eventsList));
    }
    const found = getEventsFilteredByView(events.eventsList)
      .filter(event => event.additionalParams.displayName.toLowerCase().includes(searchTerm.toLowerCase()));
    clearFilters();
    setFilteredEvents(found ? found : []);
  };

  const filterBattles = (events: IEventBattlePayload[]): IEventBattlePayload[] => {
    return events.filter(event => {
      return (
        (event.additionalParams.forcedAsyncPlayerCount === null || event.additionalParams.forcedAsyncPlayerCount === undefined) &&
        !event.additionalParams.mltData &&
        (!event.additionalParams.entryFeeList || event.additionalParams.entryFeeList.length === 1) &&
        !event.additionalParams.mltData
      );
    });
  };

  const filterTournaments = (events: IEventBattlePayload[]): IEventBattlePayload[] => {
    return events.filter(event => {
      return (
        event.additionalParams.forcedAsyncPlayerCount !== null &&
        event.additionalParams.forcedAsyncPlayerCount !== undefined &&
        (!event.additionalParams.entryFeeList || event.additionalParams.entryFeeList.length === 1) &&
        !event.additionalParams.mltData
      );
    });
  };

  const filterEliminationTournaments = (events: IEventBattlePayload[]): IEventBattlePayload[] => {
    return events.filter(event => {
      return Boolean(event.additionalParams.mltData);
    });
  };

  const filterMultiTournaments = (events: IEventBattlePayload[]): IEventBattlePayload[] => {
    return events.filter(event => {
      return (
        event.additionalParams.entryFeeList !== null &&
        event.additionalParams.entryFeeList !== undefined &&
        event.additionalParams.entryFeeList.length > 1 &&
        !event.additionalParams.mltData
      );
    });
  };

  const getEventsFilteredByView = (events: IEventBattlePayload[]): IEventBattlePayload[] => {
    return events.filter(event => {
      if (view === TAB_VALUES.TEST && !event.jsonLogicFilters.includes(USER_ROLE.REGULAR)) return true;
      if (view === TAB_VALUES.PROD && event.jsonLogicFilters.includes(USER_ROLE.REGULAR)) return true;
      return false;
    });
  };

  const getEventsFilteredByDsi = (events: IEventBattlePayload[], filterDsiValue: number): IEventBattlePayload[] => {
    return events.filter(event => {
      if (event._parseDsi) {
        if (event._parseDsi.value === parseInt(filterDsiValue + '') && event._parseDsi.operator === filterDsiOperator) {
          return true;
        }
      }
      return false;
    });
  };

  const getEventsFilteredByTime = (events: IEventBattlePayload[]): IEventBattlePayload[] => {
    // Filter by start/end date time
    const startTime = parseInt(searchQuery.get(EVENT_URL_PARAMS.startTime) || '0') * 1000;
    const endTime = parseInt(searchQuery.get(EVENT_URL_PARAMS.endTime) || '0') * 1000;
    return events.filter(event => {
      let isInTimeRange = false;
      event.repetitions.forEach(r => {
        if (parseInt(r.repetitionKeyValueMap.Start + '') * 1000 >= startTime &&
          parseInt(r.repetitionKeyValueMap.End + '') * 1000 < endTime + ONE_DAY_IN_MILLIS) {
          isInTimeRange = true;
        }
      });
      return isInTimeRange;
    });
  };

  const getEventsFilteredByPlacement = (events: IEventBattlePayload[]): IEventBattlePayload[] => {
    return events.filter(event => {
      let isMatchingPlacement = false;
      event.additionalParams.placementDataList.forEach(pdl => {
        // console.info(pdl.placementLocation, filterPlacementPosition, pdl.placementPriority, filterPlacementPriority);
        if ((!filterPlacementPosition || (pdl.placementLocation.toLowerCase() === filterPlacementPosition.toLowerCase()))
          && (isNaN(filterPlacementPriority) || (pdl.placementPriority === filterPlacementPriority))) {
          isMatchingPlacement = true;
        }
      });
      return isMatchingPlacement;
    });
  };

  const filterEvents = (eventCategory: EEventCategory) => {
    // filter by test/prod
    let partiallyFilteredEvents = getEventsFilteredByView(events.eventsList);

    if (eventCategory === EEventCategory.TOURNAMENT) {
      partiallyFilteredEvents = filterTournaments(partiallyFilteredEvents);
    } else if (eventCategory === EEventCategory.MULTI_ENTRY_TOURNAMENT) {
      partiallyFilteredEvents = filterMultiTournaments(partiallyFilteredEvents);
    } else if (eventCategory === EEventCategory.BATTLE) {
      partiallyFilteredEvents = filterBattles(partiallyFilteredEvents);
    } else if (eventCategoryFromUrl === EEventCategory.ELIMINATION) {
      partiallyFilteredEvents = filterEliminationTournaments(partiallyFilteredEvents);
    }

    // filter by DSI
    if (filterDsiOperator) {
      partiallyFilteredEvents = getEventsFilteredByDsi(partiallyFilteredEvents, filterDsiValue);
    }

    // Filter by start/end date time
    const startTime = parseInt(searchQuery.get(EVENT_URL_PARAMS.startTime) || '0');
    const endTime = parseInt(searchQuery.get(EVENT_URL_PARAMS.endTime) || '0');
    if (startTime && endTime) {
      partiallyFilteredEvents = getEventsFilteredByTime(partiallyFilteredEvents);
    }

    // Filter by Placement
    if (searchQuery.has(EVENT_URL_PARAMS.placementPosition) && filterPlacementPosition.length > 2) {
      partiallyFilteredEvents = getEventsFilteredByPlacement(partiallyFilteredEvents);
    }

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

  const clearDateFilter = () => {
    searchQuery.delete(EVENT_URL_PARAMS.startTime);
    searchQuery.delete(EVENT_URL_PARAMS.endTime);
    redirectToUrl(`${eventsViewPageUrl}?${searchQuery.toString()}`);
    setSelectionRange(defaultDateRange);
    filterEvents(eventCategoryFromUrl);
  };

  const clearPlacementFilter = () => {
    setFilterPlacementPosition('');
    setFilterPlacementPriority(NaN);
    searchQuery.delete(EVENT_URL_PARAMS.placementPosition);
    searchQuery.delete(EVENT_URL_PARAMS.placementPriority);
    redirectToUrl(`${eventsViewPageUrl}?${searchQuery.toString()}`);
  };

  const clearDsiFilter = () => {
    setFilterDsiOperator('');
    setFilterDsiValue(-1);
    searchQuery.delete(EVENT_URL_PARAMS.dsiOperator);
    searchQuery.delete(EVENT_URL_PARAMS.dsiValue);
    redirectToUrl(`${eventsViewPageUrl}?${searchQuery.toString()}`);
  };

  const clearAllFilters = () => {
    clearDateFilter();
    clearPlacementFilter();
    clearDsiFilter();
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
            dispatch(eventApiDispatchers.getEvents(eventCategory, selectedApp));
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
            dispatch(eventApiDispatchers.getEvents(eventCategory, selectedApp));
            setIsForceInvisibleModalVisible(false);
            setShowForceInvisibleSnackbar(true);
          },
        }
      ));
    }
  };

  return (
    <GenericPage ref={refParent}>
      <Helmet title="Game Config" />

      {shouldShowPlaceholder && apps.loading !== XHR_STATE.IN_PROGRESS &&
        <NoAppPlaceholder
          imageUrl={'https://assets.onclixlogix-samplecode.com/website/img/icons/illustration-calendar.svg'}
          text={'You can set up your Live-ops events here. To see the events create a new app.'}
        />
      }

      {!shouldShowPlaceholder &&
  
      <Fragment  >

      <Typography variant="h1" gutterBottom>
        {selectedApp} Events
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
                onClick={() => redirectToUrl(ROUTES.EVENTS_CHOOSE_TYPE.replace(URL_PART_APP_ID, selectedApp))}
                style={{ borderRadius: 0 }}
              >
                <Plus style={{ marginRight: 10 }} /> Create
              </Button>
            </Paper>
          </Grid>
        </Grid>

        <Grid container spacing={6}>
          <Grid item xs={12}>
            <Paper className={`${classes.root} ${classes.filtersBar}`}>
              <Button
                onClick={toggleDateMenu}
              >
                Filter by date
              </Button>
              <Popover
                open={Boolean(dateAnchorEl)}
                anchorEl={dateAnchorEl}
                onClose={e => setDateAnchorEl(null)}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'left',
                }}
              >
                <DateRangePicker
                  months={2}
                  direction="horizontal"
                  ranges={[selectionRange]}
                  // onChange={(ranges: {[key: string]: { startDate: Date; endDate: Date; key: string; }}) => {
                  onChange={(ranges: any) => {
                    searchQuery.set(EVENT_URL_PARAMS.startTime, parseInt((ranges[RANGE_KEY_DATE_FILTER].startDate.getTime() / 1000) + '') + '');
                    searchQuery.set(EVENT_URL_PARAMS.endTime, parseInt((ranges[RANGE_KEY_DATE_FILTER].endDate.getTime() / 1000) + '') + '');
                    setSelectionRange({
                      ...selectionRange,
                      startDate: ranges[RANGE_KEY_DATE_FILTER].startDate,
                      endDate: ranges[RANGE_KEY_DATE_FILTER].endDate,
                    });
                    redirectToUrl(`${eventsViewPageUrl}?${searchQuery.toString()}`);
                    filterEvents(eventCategoryFromUrl);
                  }}
                />
              </Popover>
              <Button
                onClick={togglePlacementMenu}
                disabled={eventCategoryFromUrl === EEventCategory.SALE}
              >
                Filter by placement
              </Button>
              <Popover
                open={Boolean(placementAnchorEl)}
                anchorEl={placementAnchorEl}
                onClose={e => setPlacementAnchorEl(null)}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'left',
                }}
                PaperProps={{ className: classes.popoverPaper }}
              >
                <Fragment>
                  <FormControl>
                    <InputLabel htmlFor="events-filter-placement">Position</InputLabel>
                    <Select
                      id="events-filter-placement"
                      // native
                      value={filterPlacementPosition}
                      onChange={e => {
                        setFilterPlacementPosition(e.target.value as string);
                        searchQuery.set(EVENT_URL_PARAMS.placementPosition, e.target.value as string);
                        redirectToUrl(`${eventsViewPageUrl}?${searchQuery.toString()}`);
                      }}
                      style={{ minWidth: 150 }}
                    >
                      <option value=""></option>
                      {placementHumanReadable[selectedApp] && Object.keys(placementHumanReadable[selectedApp]).map(p =>
                        <MenuItem key={p} value={p}>{placementHumanReadable.common[p] || p}</MenuItem>)}
                    </Select>
                  </FormControl>
                  <TextField
                    id="events-filter-placement"
                    label="Priority"
                    type="number"
                    value={filterPlacementPriority}
                    onChange={(e: React.ChangeEvent<{ value: unknown }>) => {
                      setFilterPlacementPriority(parseInt(e.target.value as number + ''));
                      searchQuery.set(EVENT_URL_PARAMS.placementPriority, e.target.value as string);
                      redirectToUrl(`${eventsViewPageUrl}?${searchQuery.toString()}`);
                    }}
                  />
                </Fragment>
              </Popover>
              <Button
                onClick={toggleDsiMenu}
              >
                Filter by DSI
              </Button>
              <Popover
                open={Boolean(dsiAnchorEl)}
                anchorEl={dsiAnchorEl}
                onClose={e => setDsiAnchorEl(null)}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'left',
                }}
                // PaperProps={{ style: { width: 150 }}}
                PaperProps={{ className: classes.popoverPaper}}
              >
              <FormControl>
                <InputLabel htmlFor="events-filter-dsi">DSI Operator</InputLabel>
                <Select
                  id="events-filter-dsi"
                  native
                  value={filterDsiOperator}
                  onChange={e => {
                    setFilterDsiOperator(e.target.value as string);
                    searchQuery.set(EVENT_URL_PARAMS.dsiOperator, e.target.value as string);
                    redirectToUrl(`${eventsViewPageUrl}?${searchQuery.toString()}`);
                  }}
                  style={{ minWidth: 150 }}
                >
                  <option value=""></option>
                  <option value="<">&lt;</option>
                  <option value=">">&gt;</option>
                  <option value=">=">&gt;=</option>
                  <option value="<=">&lt;=</option>
                  <option value="==">==</option>
                  <option value="!=">!=</option>
                </Select>
              </FormControl>
              <FormControl>
                <TextField
                  id="events-filter-dsi"
                  label="DSI Value"
                  type="number"
                  value={filterDsiValue}
                  onChange={(e: React.ChangeEvent<{ value: unknown }>) => {
                    setFilterDsiValue(e.target.value as number);
                    searchQuery.set(EVENT_URL_PARAMS.dsiValue, (e.target.value as number + ''));
                    redirectToUrl(`${eventsViewPageUrl}?${searchQuery.toString()}`);
                  }}
                  style={{ minWidth: 150 }}
                  disabled={!filterDsiOperator}
                />
              </FormControl>
              </Popover>
              <FormControl>
                <InputLabel htmlFor="events-filter-event-type">Event Type</InputLabel>
                <Select
                  id="events-filter-event-type"
                  native
                  // value={currentEventCat}
                  value={eventCategoryFromUrl || EEventCategory.ALL}
                  onChange={e => {
                    const { value } = e.target;
                    searchQuery.set(EVENT_URL_PARAMS.type, value as EEventCategory);
                    redirectToUrl(`${eventsViewPageUrl}?${searchQuery.toString()}`);
                    if (value as EEventCategory === EEventCategory.ALL) {
                      dispatch(eventApiDispatchers.getAllEvents(EEventCategory.ALL, selectedApp));
                    } else {
                      dispatch(eventApiDispatchers.getEvents(getActualEventCategory(e.target.value as EEventCategory), selectedApp));
                    }
                  }}
                >
                  {Object.keys(EEventCategory).filter( category => category !== EEventCategory.CHALLENGE_LEADERBOARD).map(type =>
                    <option value={type} key={type}>{type}</option>)}
                </Select>
              </FormControl>
              <FormControl>
                <InputLabel>Search by name</InputLabel>
                <Input id="search-by-name"
                  startAdornment={<Search style={{ marginRight: 8 }} />}
                  endAdornment={
                    <X style={{ marginRight: '0 8px', cursor: 'pointer' }}
                      onClick={() => {
                        setSearchNameQuery('');
                        searchByName('');
                      }}
                    />
                  }
                  value={searchNameQuery}
                  onChange={(e: React.ChangeEvent<{ value: unknown }>) => {
                    const value = e.target.value as string;
                    setSearchNameQuery(value);
                    if (value.length > 2) {
                      searchByName(value);
                    } else if (!value.length) {
                      searchByName('');
                    }
                  }}
                />
              </FormControl>
            </Paper>
          </Grid>
        </Grid>

        <Grid container style={{ margin: '12px 0' }}>
          <Grid item xs={12}>
            {(searchQuery.has(EVENT_URL_PARAMS.startTime) && searchQuery.has(EVENT_URL_PARAMS.endTime)) &&
              <Chip
              style={{ marginRight: '1rem' }}
              label={`${new Date(parseInt(searchQuery.get(EVENT_URL_PARAMS.startTime) || '0') * 1000).toLocaleDateString()} - ${new Date(parseInt(searchQuery.get(EVENT_URL_PARAMS.endTime) || '0') * 1000).toLocaleDateString()}`}
              onDelete={clearDateFilter}
            />}

            {filterPlacementPosition &&
              <Chip
              style={{ marginRight: '1rem' }}
              label={`${filterPlacementPosition} ${isNaN(filterPlacementPriority) ? '' : '= ' + filterPlacementPriority}`}
              onDelete={clearPlacementFilter}
            />}

            {filterDsiOperator &&
              <Chip
              style={{ marginRight: '1rem' }}
              label={`${filterDsiOperator} ${filterDsiValue < 0 ? '' : filterDsiValue}`}
              onDelete={clearDsiFilter}
            />}
            
            {((searchQuery.has(EVENT_URL_PARAMS.startTime) && searchQuery.has(EVENT_URL_PARAMS.endTime))
              || filterPlacementPosition
              || filterDsiOperator) &&
              <Chip
                label="Clear all filters"
                onDelete={clearAllFilters}
              />}

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
                          to={ROUTES.EDIT_EVENT.replace(URL_PART_APP_ID, selectedApp)
                            .replace(':id', event.id + '')
                            + `?${URL_SEARCH_KEY_EVENT_TYPE}=${getEventCategoryFromPayload(event)}`
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
                            to={ROUTES.EDIT_EVENT.replace(URL_PART_APP_ID, selectedApp)
                              .replace(':id', event.id + '')
                              + `?${URL_SEARCH_KEY_EVENT_TYPE}=${getEventCategoryFromPayload(event)}`
                              + `&${EVENT_URL_PARAMS.view}=${searchQuery.get(EVENT_URL_PARAMS.view)}`
                              + `&${EVENT_URL_PARAMS.mode}=${EVENT_URL_PARAMS.modeValue}`}
                          >
                            View
                          </MenuItem>
                          <MenuItem
                            component={Link}
                            to={ROUTES.EDIT_EVENT.replace(URL_PART_APP_ID, selectedApp)
                              .replace(':id', event.id + '')
                              + `?${URL_SEARCH_KEY_EVENT_TYPE}=${getEventCategoryFromPayload(event)}`
                              + `&${EVENT_URL_PARAMS.view}=${searchQuery.get(EVENT_URL_PARAMS.view)}`}
                          >
                            Edit
                          </MenuItem>
                          <MenuItem
                            onClick={e => forceInvisibleClick(event, eventIndex)}
                          >
                            Force Invisible
                          </MenuItem>
                          <MenuItem
                            component={Link}
                            to={`${ROUTES.CREATE_EVENT.replace(URL_PART_APP_ID, selectedApp)}?${URL_SEARCH_KEY_CLONE_ID}=${event.id}` +
                              `&${URL_SEARCH_KEY_EVENT_TYPE}=${getEventCategoryFromPayload(event)}&`+
                              `${EVENT_URL_PARAMS.view}=${searchQuery.get(EVENT_URL_PARAMS.view)}`}
                          >
                            Clone
                          </MenuItem>
                          {/* <MenuItem
                            onClick={e => deleteClick(event, eventIndex)}
                            // disabled={event.isLiveOrVisible}
                          >
                            Delete
                          </MenuItem> */}
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
                                  dispatch(eventApiDispatchers.getEvents(eventCategory, selectedApp));
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
          Are You Sure You Want to make this Event invisible?
        </DialogTitle>
        <DialogContent dividers={true}>
          The Event with id {selectedEventForForceInvisible && selectedEventForForceInvisible.id} will be made invisible.
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

export default Events;

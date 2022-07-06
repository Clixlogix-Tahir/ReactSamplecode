/* eslint-disable react-hooks/exhaustive-deps */
import {
  Grid,
  Paper,
  Tab,
  Tabs,
} from '@material-ui/core';
import React, { Fragment, useEffect } from 'react';
import { ROUTES, URL_PART_APP_ID, XHR_STATE } from '../../common/constants';
import globalStyles from '../../theme/globalStyles';
import { setSelectedAppChangeListener, UI_MODULES } from '../../rtk-reducers/globalSlice';
import {
  useAppDispatch,
  useAppRedirect,
  useAppSelector,
  useShouldShowPlaceholder,
  useUrlQuery
} from '../../common/hooks';
import { useRouteMatch } from 'react-router-dom';
import NoAppPlaceholder from '../../components/no-app-placeholder';


const AppManagement: React.FC<React.ReactNode> = ({children}) => {
  const classes = globalStyles();
  const routeMatch = useRouteMatch();
  const params = routeMatch.params as { userId?: string, appId: string };
  const appId = params.appId;
  const dispatch = useAppDispatch();
  const changeRoute = useAppRedirect();
  const searchQuery = useUrlQuery();
  const shouldShowPlaceholder = useShouldShowPlaceholder();
  const { apps, selectedApp } = useAppSelector(state => state.gameConfigForm);

  useEffect(() => {
    const ac = new AbortController();
    dispatch(setSelectedAppChangeListener(UI_MODULES.APP_MANAGEMENT));
    return () => {
      dispatch(setSelectedAppChangeListener(UI_MODULES.UNSET));
      ac.abort();
    }
  }, []);

  useEffect(() => {
    if (selectedApp && routeMatch.path === ROUTES.APP_MANAGEMENT) {
      let url = ROUTES.APP_DETAILS.replace(URL_PART_APP_ID, selectedApp) + window.location.search;
      changeRoute(url);
    }
  }, [selectedApp]);

  useEffect(() => {
    const ac = new AbortController();
    dispatch(setSelectedAppChangeListener(UI_MODULES.APP_MANAGEMENT));
    return () => {
      dispatch(setSelectedAppChangeListener(UI_MODULES.UNSET));
      ac.abort();
    }
  }, [appId, apps]);

  const handleTabChange = (event: React.ChangeEvent<{}>, newValue: string) => {
    changeRoute(newValue.replace(URL_PART_APP_ID, selectedApp) + '?' + searchQuery.toString());
  };

  return (
    <div>
      {shouldShowPlaceholder &&
        apps.loading !== XHR_STATE.IN_PROGRESS &&
        <NoAppPlaceholder
          imageUrl={'https://assets.onclixlogix-samplecode.com/website/img/icons/illustration-app.svg'}
          text={'All the details with respect to the App appear here, create an App to populate the details in this section.'}
        />
      }
      {!shouldShowPlaceholder &&
        <Fragment>
          <Grid container style={{ marginTop: 2 }}>
            <Grid item xs={12}>
              <Paper className={classes.paperRoot}>
                <Tabs
                  value={routeMatch.path}
                  onChange={handleTabChange}
                  indicatorColor="primary"
                  textColor="primary"
                  // centered
                  variant="scrollable"
                  scrollButtons="auto"
                  aria-label="app management navigation tabs"
                >
                  <Tab defaultChecked value={ROUTES.APP_DETAILS} label="App Details" />
                  <Tab value={ROUTES.APP_XP_AND_REWARDS} label="XP and Rewards" />
                  <Tab value={ROUTES.APP_DAILY_CHECKINS} label="Daily Checkins" />
                </Tabs>
              </Paper>
            </Grid>
          </Grid>

          {children}

        </Fragment>
      }
    </div>
  );
};

export default AppManagement;

/* eslint-disable react-hooks/exhaustive-deps */
import { Button, FormControl, Grid, InputLabel, MenuItem, Paper, Select, Tab, Tabs, TextField
} from '@material-ui/core';
import React, { FormEvent, useEffect, useState, useMemo } from 'react';
import { useHistory, useRouteMatch } from 'react-router-dom';
import {
  ROUTES,
  URL_PART_APP_ID,
  URL_SEARCH_KEY_SEARCH_CRITERIA,
  URL_SEARCH_KEY_SEARCH_TERM,
  XHR_STATE
} from '../../common/constants';
import globalStyles from '../../theme/globalStyles';
import styled from 'styled-components';
import { searchByCriteraDispatcher } from './userSlice';
import { setSelectedAppChangeListener, UI_MODULES } from '../../rtk-reducers/globalSlice';
import {
  useAppDispatch,
  useAppRedirect,
  useAppSelector,
  useUrlQuery
} from '../../common/hooks';
import { isLoggedInUserJrxSuperAdminOrManager } from "../../common/utils";
import { TCmsRole } from '../team-access-control-management/teamAccessControlTypes';
import UnAuthenticatedAccess from '../components/unauthenticatedAccess';

const SearchBar = styled.form`
  display: flex;
  justify-content: space-between;
  padding: 10px;
`;

export enum USER_SEARCH_CRITERIA {
  EMAIL = 'byEmail',
  PHONE_NUMBER = 'byPhone',
  USER_ID = 'byUserId',
  USERNAME = 'byUserName',
};

const UserAccounts: React.FC<React.ReactNode> = ({children}) => {
  const classes = globalStyles();
  const routeMatch = useRouteMatch();
  const history = useHistory();
  const dispatch = useAppDispatch();
  const searchQuery = useUrlQuery();
  const { selectedApp } = useAppSelector(state => state.gameConfigForm);
  const { searchByCriteria } = useAppSelector(state => state.userSlice);
  const [searchCriteria, setSearchCriteria] = useState(
    searchQuery.get(URL_SEARCH_KEY_SEARCH_CRITERIA) || USER_SEARCH_CRITERIA.USER_ID
  );
  // todo following variables might be redundant
  const [searchTerm, setSearchTerm] = useState(searchQuery.get(URL_SEARCH_KEY_SEARCH_TERM) || '');
  const { userGoogleProfile } = useAppSelector(state => state.globalSlice);
  const loggedInUserRoles: TCmsRole[] | null = userGoogleProfile && 'userRoles' in userGoogleProfile ? userGoogleProfile.userRoles : null;
  const isLoggedInUserJrxAdminOrMngr = useMemo(() => isLoggedInUserJrxSuperAdminOrManager(loggedInUserRoles), [userGoogleProfile]);

  const changeRoute = useAppRedirect();

  useEffect(() => {
    const ac = new AbortController();
    dispatch(setSelectedAppChangeListener(UI_MODULES.USER_ACCOUNTS));
    return () => {
      dispatch(setSelectedAppChangeListener(UI_MODULES.UNSET));
      ac.abort();
    }
  }, []);

  useEffect(() => {
    if (selectedApp.length) {
      dispatchSearch();
    }
  }, [selectedApp]);

  const searchUser = (event?: FormEvent) => {
    event?.preventDefault();
    let url = ROUTES.USER_DETAILS.replace(URL_PART_APP_ID, selectedApp);
    searchQuery.set(URL_SEARCH_KEY_SEARCH_CRITERIA, encodeURI(searchCriteria));
    searchQuery.set(URL_SEARCH_KEY_SEARCH_TERM, encodeURI(searchTerm));
    url += '?' + searchQuery.toString();
    changeRoute(url);
    dispatchSearch();
  };

  const dispatchSearch = () => {
    const sc = searchQuery.get(URL_SEARCH_KEY_SEARCH_CRITERIA);
    const st = searchQuery.get(URL_SEARCH_KEY_SEARCH_TERM);
    if (sc && st) {
      dispatch(searchByCriteraDispatcher(selectedApp, sc, st));
    }
  };

  const handleTabChange = (event: React.ChangeEvent<{}>, newValue: string) => {
    history.push(newValue.replace(URL_PART_APP_ID, selectedApp) + '?' + searchQuery.toString());
  };

  return (
    isLoggedInUserJrxAdminOrMngr ? 
    <div>
      <Grid container>
        <Grid item xs={12}>
          <Paper className={classes.paperRoot} style={{ alignItems: 'center' }}>
            <SearchBar onSubmit={searchUser}>
              <FormControl style={{ minWidth: 150 }}>
                <InputLabel>Search by</InputLabel>
                <Select
                  value={searchCriteria}
                  onChange={e => {
                    const value = e.target.value as USER_SEARCH_CRITERIA;
                    searchQuery.set(URL_SEARCH_KEY_SEARCH_CRITERIA, value);
                    searchQuery.delete(URL_SEARCH_KEY_SEARCH_TERM);
                    setSearchTerm('');
                    // history.push(
                    //   ROUTES.USERS
                    //     .replace(URL_PART_APP_ID, selectedApp)
                    //     + '?' + searchQuery.toString()
                    // );
                    setSearchCriteria(value);
                  }}
                >
                  <MenuItem value={USER_SEARCH_CRITERIA.USER_ID}>User ID</MenuItem>
                  <MenuItem value={USER_SEARCH_CRITERIA.PHONE_NUMBER}>Phone number</MenuItem>
                  <MenuItem value={USER_SEARCH_CRITERIA.USERNAME}>Username</MenuItem>
                  <MenuItem value={USER_SEARCH_CRITERIA.EMAIL}>Email</MenuItem>
                </Select>
              </FormControl>
              <FormControl>
                <TextField
                  label="Query"
                  placeholder="+911234567890"
                  value={searchTerm}
                  name="userId"
                  style={{ minWidth: 320 }}
                  onChange={e => {
                    const value = e.target.value as string;
                    searchQuery.set(URL_SEARCH_KEY_SEARCH_TERM, value);
                    // history.push(
                    //   ROUTES.USERS
                    //     .replace(URL_PART_APP_ID, selectedApp)
                    //     + '?' + searchQuery.toString()
                    // );
                    setSearchTerm(value);
                  }}
                />
              </FormControl>
              <Button variant="contained" color="primary" type="submit"
                disabled={searchByCriteria.loading === XHR_STATE.IN_PROGRESS}
              >
                Search
              </Button>
            </SearchBar>
          </Paper>
        </Grid>
      </Grid>

      {routeMatch.path !== ROUTES.USERS && <Grid container style={{ marginTop: 24 }}>
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
              aria-label="user info navigation tabs"
            >
              <Tab value={ROUTES.USER_DETAILS} label="Details" />
              <Tab value={ROUTES.USER_WALLET} label="Wallet" />
              <Tab value={ROUTES.USER_CURRENCY} label="Virtual Currency" />
              <Tab value={ROUTES.USER_ACCESS} label="Access" />
              <Tab value={ROUTES.USERS_MANAGEMENT} label="Moderation" />
            </Tabs>
          </Paper>
        </Grid>
      </Grid>}

      {children}
    </div>
    
    :

      loggedInUserRoles &&
      <UnAuthenticatedAccess 
    loggedInUserRole={loggedInUserRoles[0].displayName}/>
    
  );
};

export default UserAccounts;
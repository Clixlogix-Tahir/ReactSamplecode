/* eslint-disable react-hooks/exhaustive-deps */
// import { GoogleLogout } from 'react-google-login';
import {
  AppBar as MuiAppBar, Avatar, Box, Button, FormControl, Grid,Chip,
  Hidden, IconButton as MuiIconButton, Input, InputAdornment, InputLabel, List, ListItem as MuIListItem, Menu, Select, Toolbar, Tooltip, Typography
} from "@material-ui/core";
import {
  KeyboardArrowDown as Down, Menu as MenuIcon, NotInterested
} from "@material-ui/icons";
import { darken } from "polished";
import * as React from "react";
import { Power } from "react-feather";
import { connect } from "react-redux";
import { NavLink, useLocation, useRouteMatch } from "react-router-dom";
import styled, { withTheme } from "styled-components";
import { logoutUser } from "../common/AxiosInterceptors";
import {
  CONSTANTS,
  ROUTES,
  URL_PART_APP_ID,
  URL_PART_GAME_ID
} from "../common/constants";
import {
  useAppDispatch,
  useAppRedirect,
  useAppSelector,
  useIsAdmin,
  useUrlQuery
} from "../common/hooks";
import { Eclixlogix-samplecodeEnvs, getclixlogix-samplecodeEnv, isLoggedInUserJrxSuperAdminOrManager } from "../common/utils";
import {
  fetchAppsListDispatcher,
  getAllAppGameDataDispatcher,
  getGameDataDispatcher,
  setSelectedApp,
  setSelectedGame
} from "../pages/game-config/gameConfigSlice";
import { requestAccessDispatchers } from "../pages/request/requestControlSlice";
import {
  TAddOrgResp,
  TReqListResp
} from "../pages/request/requestsControlTypes";
import { teamAccessDispatchers } from "../pages/team-access-control-management/teamAccessControlSlice";
import { TCmsRole, TCmsUser } from "../pages/team-access-control-management/teamAccessControlTypes";
import { setUserGoogleProfile } from "../rtk-reducers/globalSlice";
import headerStyles from "../theme/headerStyles";
import { APP_ID } from "../types/types";


const settings = [
  "My Information",
  "Organization Details",
  "Help & Support",
  "Sign Out",
];
const AppBar = styled(MuiAppBar)`
  background: ${(props) => props.theme.header.background};
  color: ${(props) => props.theme.header.color};
  box-shadow: ${(props) => props.theme.shadows[1]};
`;

const IconButton = styled(MuiIconButton)`
  svg {
    width: 22px;
    height: 22px;
  }
`;

/* const Indicator = styled(Badge)`
  .MuiBadge-badge {
    background: ${props => props.theme.header.indicator.background};
    color: ${props => props.theme.palette.common.white};
  }
`;*/

const Search = styled.div`
  border-radius: 2px;
  background-color: ${(props) => props.theme.header.background};
  // display: none;
  display: block;
  position: relative;
  width: 100%;

  &:hover {
    background-color: ${(props) => darken(0.05, props.theme.header.background)};
  }

  // ${(props) => props.theme.breakpoints.up("md")} {
  //   display: block;
  // }
`;

const ListItem = styled(MuIListItem)`
  a {
    color: ${(props) => props.theme.palette.primary.main};
    text-decoration: none;
    &.active {
      color: #000;
    }
  }
`;

/* const SearchIconWrapper = styled.div`
  width: 50px;
  height: 100%;
  position: absolute;
  pointer-events: none;
  display: flex;
  align-items: center;
  justify-content: center;

  svg {
    width: 22px;
    height: 22px;
  }
`;

const Input = styled(InputBase)`
  color: inherit;
  width: 100%;

  > input {
    color: ${props => props.theme.header.search.color};
    padding-top: ${props => props.theme.spacing(2.5)}px;
    padding-right: ${props => props.theme.spacing(2.5)}px;
    padding-bottom: ${props => props.theme.spacing(2.5)}px;
    padding-left: ${props => props.theme.spacing(12)}px;
    width: 160px;
  }
`;

const Flag = styled.img`
  border-radius: 50%;
  width: 22px;
  height: 22px;
`;

function LanguageMenu() {
  const [anchorMenu, setAnchorMenu] = React.useState<any>(null);

  const toggleMenu = (event: React.SyntheticEvent) => {
    setAnchorMenu(event.currentTarget);
  };

  const closeMenu = () => {
    setAnchorMenu(null);
  };

  return (
    <React.Fragment>
      <IconButton
        aria-owns={Boolean(anchorMenu) ? "menu-appbar" : undefined}
        aria-haspopup="true"
        onClick={toggleMenu}
        color="inherit"
      >
        <Flag src="/static/img/flags/us.png" alt="English" />
      </IconButton>
      <Menu
        id="menu-appbar"
        anchorEl={anchorMenu}
        open={Boolean(anchorMenu)}
        onClose={closeMenu}
      >
        <MenuItem onClick={closeMenu}>
          English
        </MenuItem>
        <MenuItem onClick={closeMenu}>
          French
        </MenuItem>
        <MenuItem onClick={closeMenu}>
          German
        </MenuItem>
        <MenuItem onClick={closeMenu}>
          Dutch
        </MenuItem>
      </Menu>
    </React.Fragment>
  )
} */

function UserMenu() {
  const [anchorMenu, setAnchorMenu] = React.useState<any>(null);
  const dispatch = useAppDispatch();

  const toggleMenu = (event: React.SyntheticEvent) => {
    setAnchorMenu(event.currentTarget);
  };

  const closeMenu = () => {
    setAnchorMenu(null);
  };

  const logout = () => {
    dispatch(
      teamAccessDispatchers.logout({
        success: () => {
          dispatch(setUserGoogleProfile(null));
          logoutUser();
        },
      })
    );
  };

  return (
    <React.Fragment>
      <IconButton
        aria-owns={Boolean(anchorMenu) ? "menu-appbar" : undefined}
        aria-haspopup="true"
        onClick={logout}
        color="inherit"
        title="Logout"
      >
        <Power />
      </IconButton>
      {/* <Menu
        id="menu-appbar"
        anchorEl={anchorMenu}
        open={Boolean(anchorMenu)}
        onClose={closeMenu}
      >
        <MenuItem onClick={logout}>
          Logout
          <GoogleLogout
            clientId="902254699324-v67cudjrj6r51qd23fpkam57c5sv5lso.apps.googleusercontent.com"
            buttonText="Logout"
            onLogoutSuccess={() => {
              dispatch(setUserGoogleProfile(null));
              logoutUser();
            }}
            render={renderProps => <span onClick={renderProps.onClick}>Logout</span>}
          /> 
        </MenuItem>
      </Menu> */}
    </React.Fragment>
  );
}

type HeaderProps = {
  theme: {};
  onDrawerToggle: React.MouseEventHandler<HTMLElement>;
};

export const getGameConfigNewRoute = (
  route: string,
  appId: string,
  gameId: string
): string => {
  return route
    .replace(URL_PART_APP_ID, appId)
    .replace(URL_PART_GAME_ID, gameId);
};

const Header: React.FC<HeaderProps> = ({ onDrawerToggle }) => {
  const headerClasses = headerStyles();
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(
    null
  );
  const nudgeRef: React.RefObject<HTMLInputElement> = React.createRef();
  const userProfile: any = JSON.parse(
    localStorage.getItem("userGoogleProfile") || "{}"
  );
  let companyId = userProfile.companyId;
  const [nudgeFlag, setNudgeFlag] = React.useState<boolean>(false);
  const [open, setOpen] = React.useState(false);
  const { apps, gamesFromAllApps, selectedApp, selectedGame } = useAppSelector(
    (state) => state.gameConfigForm
  );
  const { companyIdCopy, userGoogleProfile } = useAppSelector(
    (state) => state.globalSlice
  );
  const loggedInUserRoles: TCmsRole[] | null =
    userGoogleProfile && "userRoles" in userGoogleProfile
      ? userGoogleProfile.userRoles
      : null;
  const isLoggedInUserJrxAdminOrMngr = React.useMemo(
    () => isLoggedInUserJrxSuperAdminOrManager(loggedInUserRoles),
    [userGoogleProfile]
  );
  // const {
  //   userGoogleProfile
  // } = useAppSelector(state => state.globalSlice);
  const dispatch = useAppDispatch();
  const routeMatch = useRouteMatch();
  const params = routeMatch.params as { appId: string };
  const { appId } = params;
  const location = useLocation();
  const searchQuery = useUrlQuery();
  const redirectTo = useAppRedirect();
  const [reqList, setReqList] = React.useState<any>([]);
  const [org, setOrg] = React.useState<any>();
  const {cmsNudgeFlag} = useAppSelector((state)=> state.requestControlSlice)
  const skipHandle = () => {
    dispatch(requestAccessDispatchers.cmsNudgeFlagFalse());
  };
  let count = localStorage.getItem("count");
  let nudgeCount = localStorage.getItem("nudgeCount");
  const isAdmin = useIsAdmin();

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
    setOpen(false);
  };
  const handleCloseTip = () => {
    setOpen(false);
  };
  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };
  React.useEffect(() => {
    if (!isLoggedInUserJrxAdminOrMngr) {
      if (routeMatch.path.startsWith("/manage-request")) {
        redirectTo(ROUTES.OVERVIEW)
      }
    }
  },[])
  React.useEffect(() => {
    let cmsReqList = {
      pn: 0,
      ps: 10,
    };
    dispatch(
      requestAccessDispatchers.cmsGetReqList(cmsReqList, companyId, {
        success: (response: TReqListResp) => {
       
          if (response.appRequests.length === 0) {
            if (!count) {
              if (!userProfile.email.includes("@onclixlogix-samplecode.com")) {
                redirectTo(ROUTES.REQUEST_ADD_GAME_REQUEST);
                localStorage.setItem("count", "1");
              }
            }

            setReqList(response.appRequests);
          } else {
            if (!userProfile.email.includes("@onclixlogix-samplecode.com")) {
              dispatch(
                requestAccessDispatchers.cmsGetOrg(companyId, {
                  success: (response: TAddOrgResp) => {
            
                    if (response.name === null || undefined || "") {
             
                      if (nudgeCount === null) {
                
                        dispatch(requestAccessDispatchers.cmsNudgeFlagTrue())
                        localStorage.setItem('nudgeCount', "1")
                      }
                     
                    } else {
                      dispatch(requestAccessDispatchers.cmsNudgeFlagFalse())
                    }
                    
                  },
                })
              );
              
            }
          }
        },
      })
    );
   
  }, []);

  React.useEffect(() => {
    if (userGoogleProfile) {
      dispatch(
        fetchAppsListDispatcher((userGoogleProfile as TCmsUser).companyId)
      );
    }
  }, [userGoogleProfile]);

  const handleMenu = (setting: string) => {
    switch (setting) {
      case "My Information":
        redirectTo(ROUTES.VIEW_USER_PROFILE);
        break;
      case "Organization Details":
        redirectTo(ROUTES.ORGANIZATION_DETAILS);
        break;
      case "Sign Out":
        logoutUser();
        break;
      case "Help & Support":
        redirectTo("/support");
        break;
    }
  };

  /*const internalUser = React.useMemo(() => {
    let hasAccess = false;
    (userGoogleProfile as TCmsUser).userRoles.forEach(role => {
      // todo use enum
      if (role.roleIdentifier === 'jrx_super_admin' || role.roleIdentifier === 'jrx_manager') {
        hasAccess = true;
      }
    });
    return hasAccess;
  }, []);*/

  const remoteConfigUrlMemo = React.useMemo(() => {
    if (apps.list.find((a) => a.appId === selectedApp))
      return (
        apps.list.find((a) => a.appId === selectedApp)?.serverParams
          .appParamUrl || ""
      );
    return "";
  }, [selectedApp]);
  const clixlogix-samplecodeEnv = React.useMemo(getclixlogix-samplecodeEnv, []);
  const releaseUrl = React.useMemo(() => {
    if (!(selectedApp in CONSTANTS.BLITZ_APP)) {
      console.warn("selected app not found in CONSTANTS.BLITZ_APP");
      return;
    }
    const { id, subdomain, token } =
      CONSTANTS.BLITZ_APP[selectedApp as APP_ID][clixlogix-samplecodeEnv];
    return `https://${subdomain}.useblitz.com/app/${id}/views/apkReleases?blitzAppId=${id}&blitzAppToken=${token}`;
  }, [selectedApp]);

  React.useEffect(() => {
    if (selectedApp) {
      dispatch(getGameDataDispatcher(selectedApp));
    }
  }, [selectedApp]);

  React.useEffect(() => {
    dispatch(getAllAppGameDataDispatcher(apps.list.map((list) => list.appId)));
  }, [apps.list]);
  React.useEffect(() => {
    if (apps.list.length) {
      const newAppId =
        appId === URL_PART_APP_ID ? CONSTANTS.MISC.SAMPLE_APP : appId;
      redirectTo(
        routeMatch.url.replace(URL_PART_APP_ID, newAppId) +
          "?" +
          searchQuery.toString()
      );
      dispatch(setSelectedApp(newAppId));
    }
  }, [apps]);

  React.useEffect(() => {
    dispatch(
      setSelectedGame(
        selectedApp === CONSTANTS.MISC.SAMPLE_APP
          ? CONSTANTS.MISC.SAMPLE_GAME
          : gamesFromAllApps.data.find((g) => g.appId === selectedApp)
              ?.gameId || ""
      )
    );
  }, [gamesFromAllApps]);

  const resetCompanyId = () => {
    if (userGoogleProfile) {
      dispatch(
        setUserGoogleProfile({
          ...userGoogleProfile,
          companyId: companyIdCopy,
        })
      );
    }
  };
  const renderSelect = () => {
    return (
      <Grid item>
        <Search>
          {/* removing "Select App" dropdown as games from all apps
                are shown in "Select Game" dropdown */}
          {/*(routeMatch.path !== ROUTES.DOCS &&
              routeMatch.path !== ROUTES.TEAM_ACCESS_CONTROL_MANAGEMENT &&
              internalUser) &&
              <FormControl style={{ minWidth: 120, marginBottom: 0 }}>
                <InputLabel id="select-app-label">Select App</InputLabel>
                <Select
                  value={selectedApp}
                  onChange={(e: React.ChangeEvent<{value: unknown}>) => {
                    const newValue = e.target.value as string;
                    dispatch(setSelectedApp(newValue));
                    dispatch(setAppChangedInDropdown(true));
                    if (selectedAppChangeListener === UI_MODULES.USER_ACCOUNTS) {
                      searchQuery.delete(URL_SEARCH_KEY_SEARCH_TERM);
                      history.push(
                        ROUTES.USERS.replace(URL_PART_APP_ID, newValue)
                          + '?' + searchQuery.toString()
                      );
                    }
                  }}
                  disabled={apps.loading === XHR_STATE.IN_PROGRESS}
                >
                  <MenuItem value="" />
                  {(routeMatch.path === ROUTES.ANALYTICS || routeMatch.path === ROUTES.OVERVIEW)&&
                    <MenuItem value={PREDEFINED_BI_APP_ID.ALL}>All</MenuItem>
                  }
                  <MenuItem value={CONSTANTS.MISC.SAMPLE_APP}>Sample App</MenuItem>
                  {apps.list.map((app: TApp) =>
                    <MenuItem value={app.appId} key={app.id}>{app.displayName}</MenuItem>
                  )}
                </Select>
              </FormControl>} */}
          {isAdmin && (
            <FormControl style={{ marginRight: 10, width: 100 }}>
              <InputLabel
                style={{ color: "white" }}
                htmlFor="header-company-id"
              >
                Company ID
              </InputLabel>
              <Input
                id="header-company-id"
                value={(userGoogleProfile as TCmsUser).companyId}
                style={{
                  backgroundColor: "white",
                  color: "black",
                  borderRadius: "5px",
                  padding: "5px",
                }}
                onChange={(e: React.ChangeEvent<{ value: unknown }>) => {
                  if (userGoogleProfile) {
                    dispatch(
                      setUserGoogleProfile({
                        ...userGoogleProfile,
                        companyId: parseInt(e.target.value as string),
                      })
                    );
                  }
                }}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="reset company id"
                      onClick={resetCompanyId}
                      // onMouseDown={resetCompanyId}
                      edge="end"
                    >
                      <NotInterested />
                    </IconButton>
                  </InputAdornment>
                }
                type="number"
              />
            </FormControl>
          )}
          {routeMatch.path !== ROUTES.GAME_CONFIG_CREATE /* &&
                (
                  routeMatch.path.startsWith('/game-config') ||
                  routeMatch.path.startsWith('/overview') ||
                  routeMatch.path.startsWith('/analytics')
                ) */ && (
            <FormControl style={{ width: 140, marginBottom: 0 }}>
              <InputLabel id="select-game-label" style={{ color: "white" }}>
                Select Game
              </InputLabel>
              <Select
                native
                style={{
                  backgroundColor: "white",
                  color: "black",
                  borderRadius: "5px",
                  padding: "5px",
                }}
                value={`${selectedApp}::${selectedGame}`}
                onChange={(e: React.ChangeEvent<{ value: unknown }>) => {
                  const value = e.target.value as string;
                  const aId = value.split("::")[0];
                  const gId = value.split("::")[1];
                  dispatch(setSelectedGame(gId));
                  dispatch(
                    setSelectedApp(
                      gamesFromAllApps.data.find(
                        (g) => g.appId === aId && g.gameId === gId
                      )?.appId || ""
                    )
                  );
                  let route = ROUTES.GAME_CONFIG_DRAFT;
                  /** todo check if selectedApp replacement needs to be done below */
                  if (routeMatch.path.endsWith("/current-live"))
                    route = ROUTES.GAME_CONFIG_CURRENT_LIVE;
                  if (routeMatch.path.endsWith("/previous-live"))
                    route = ROUTES.GAME_CONFIG_PREVIOUS_LIVE;
                  if (routeMatch.path.endsWith("/current-test"))
                    route = ROUTES.GAME_CONFIG_CURRENT_TEST;
                  if (routeMatch.path.startsWith("/game-config")) {
                    redirectTo(
                      getGameConfigNewRoute(
                        route,
                        selectedApp,
                        e.target.value as string
                      )
                    );
                  }
                }}
                /* disabled={
                    gameData.loading === XHR_STATE.IN_PROGRESS ||
                    [
                      ROUTES.DOCS,
                      ROUTES.DOCS_STATIC,
                      ROUTES.SETTINGS,
                      ROUTES.TEAM_ACCESS_CONTROL_MANAGEMENT
                    ].includes(routeMatch.path)
                  } */
              >
                <option value="" />
                {gamesFromAllApps.data.map((id) => (
                  <option
                    value={`${id.appId}::${id.gameId}`}
                    key={`${id.appId}::${id.gameId}`}
                  >
                    {id.gameId} ({id.appId})
                  </option>
                ))}
                <option
                  value={`${CONSTANTS.MISC.SAMPLE_APP}::${CONSTANTS.MISC.SAMPLE_GAME}`}
                >
                  Sample Game
                </option>
              </Select>
            </FormControl>
          )}
          {/* <SearchIconWrapper>
                <SearchIcon />
              </SearchIconWrapper>
              <Input placeholder="Search topics" /> */}
        </Search>
      </Grid>
    );
  };
  return (
    <React.Fragment>
      <AppBar
        className={headerClasses.headerBg}
        position="sticky"
        elevation={0}
      >
        <Toolbar>
          <Grid container alignItems="center">
            <Hidden mdUp>
              <Grid item>
                <IconButton
                  color="inherit"
                  aria-label="Open drawer"
                  onClick={onDrawerToggle}
                >
                  <MenuIcon />
                </IconButton>
              </Grid>
            </Hidden>
            {!routeMatch.path.startsWith("/request") &&
            !routeMatch.path.startsWith("/add-game-request") &&
            !routeMatch.path.startsWith("/pending-game-request") &&
            !routeMatch.path.startsWith("/add-organization") &&
            !routeMatch.path.startsWith("/request-success") &&
            !routeMatch.path.startsWith("/manage-request") &&
            !routeMatch.path.startsWith("/view-user-profile") &&
            !routeMatch.path.startsWith("/organization-details")
              ? renderSelect()
              : null}

            <Grid item lg={4} md={3} xs={1} />

            <Grid item>
              <List style={{ display: "flex" }}>
                {(location.pathname.startsWith("/game-config") ||
                  location.pathname === ROUTES.GAME_CONFIG_CREATE) && (
                  <React.Fragment>
                    <ListItem button={true}>
                      <a
                        href={releaseUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Release Management
                      </a>
                    </ListItem>
                    {remoteConfigUrlMemo && (
                      <ListItem button={true}>
                        <a
                          href={remoteConfigUrlMemo}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Remote Config
                        </a>
                      </ListItem>
                    )}
                  </React.Fragment>
                )}
              </List>
            </Grid>
            <Grid item xs>
             
              
            </Grid>
            <Grid
              item
              xs={3}
              style={{ display: "flex", justifyContent: "end" }}
            >
              
              {/*clixlogix-samplecodeEnv !== Eclixlogix-samplecodeEnvs.PROD && (
                <Chip label={`${clixlogix-samplecodeEnv} Env`} color="secondary" />
              )}
              
              {/*<UserMenu />*/}
               {/*-----------Nudge here--------------------- */}
              {!routeMatch.path.startsWith("/add-organization") && cmsNudgeFlag.flag ? (
                <div className={headerClasses.headerNudge} ref={nudgeRef}>
                  Do you want to add an
                  <br />
                  Organization information?
                  <div className={headerClasses.nudgeBtn}>
                    <span onClick={() => skipHandle()}>Skip</span>
                    <Button
                      id="btn-id"
                      className={headerClasses.addOrgBtn}
                      onClick={() => redirectTo(ROUTES.RQUEST_ADD_ORGANIZATION)}
                    >
                      Add organization
                    </Button>
                  </div>
                </div>
              ) : null}
              <Tooltip
                title="Open settings"
                open={open}
                onMouseEnter={() => setOpen(true)}
              >
                <Box
                  className={headerClasses.profileDiv}
                  onMouseLeave={() => setOpen(false)}
                >
                  <Typography
                    className={headerClasses.profile}
                    onClick={(e) => {
                      handleOpenUserMenu(e);
                      handleCloseTip();
                    }}
                  >
                    <IconButton style={{ padding: 0 }}>
                      <Avatar
                        alt={userGoogleProfile?.name}
                        src="/static/images/avatar/2.jpg"
                        style={{ margin: "5px" }}
                      />
                    </IconButton>
                    {userGoogleProfile?.name} <Down />
                  </Typography>
                  <Menu
                    id="menu-appbar"
                    className="menu"
                    anchorEl={anchorElUser}
                    anchorOrigin={{
                      vertical: "top",
                      horizontal: "right",
                    }}
                    keepMounted
                    transformOrigin={{
                      vertical: "top",
                      horizontal: "right",
                    }}
                    open={Boolean(anchorElUser)}
                    onClose={handleCloseUserMenu}
                    style={{
                      top: "30px",
                      textAlign: "start",
                      textDecoration: "none",
                      display: "block",
                    }}
                  >
                    <NavLink
                      to={ROUTES.VIEW_USER_PROFILE}
                      activeClassName={headerClasses.activeClass}
                      className={headerClasses.menuItem}
                    >
                      My Information
                    </NavLink>
                    <NavLink
                      to={ROUTES.ORGANIZATION_DETAILS}
                      activeClassName={headerClasses.activeClass}
                      className={headerClasses.menuItem}
                    >
                      Organization Details
                    </NavLink>
                    <NavLink
                      to={"/support"}
                      activeClassName={headerClasses.activeClass}
                      className={headerClasses.menuItem}
                    >
                      Help & Support
                    </NavLink>

                    <Typography
                      className={headerClasses.menuItem}
                      onClick={() => logoutUser()}
                      style={{ cursor: "pointer" }}
                    >
                      Sign Out
                    </Typography>
                  </Menu>
                </Box>
              </Tooltip>
            </Grid>
          </Grid>
        </Toolbar>
      </AppBar>
    </React.Fragment>
  );
};

export default connect()(withTheme(Header));

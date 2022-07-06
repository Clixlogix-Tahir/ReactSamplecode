/* eslint-disable react-hooks/exhaustive-deps */
import React, { useMemo, useState } from "react";
import styled from "styled-components";
import { rgba } from "polished";
import {
  LinkProps,
  NavLink as RouterNavLink,
  withRouter,
  RouteComponentProps,
} from "react-router-dom";
import { darken } from "polished";
import { RouteInfoType, ChildElementType } from "./../types/types";
import PerfectScrollbar from "react-perfect-scrollbar";
import "../vendor/perfect-scrollbar.css";

import {
  Badge,
  Chip,
  Collapse,
  Drawer as MuiDrawer,
  List as MuiList,
  ListItem,
  ListItemText,
  Typography,
} from "@material-ui/core";

import { ExpandLess, ExpandMore } from "@material-ui/icons";

import { sidebarRoutes as routes } from "../routes/index";
import { useAppSelector } from "../common/hooks";
import {
  CONSTANTS,
  ROUTES,
  URL_PART_APP_ID,
  URL_PART_GAME_ID,
} from "../common/constants";
import { isLoggedInUserJrxSuperAdminOrManager } from "../common/utils";
import { TCmsRole } from "../pages/team-access-control-management/teamAccessControlTypes";

const NavLink = React.forwardRef<LinkProps, any>((props, ref) => (
  <RouterNavLink innerRef={ref} {...props} />
));

const Drawer = styled(MuiDrawer)`
  border-right: 0;

  > div {
    border-right: 0;
  }
`;

const Scrollbar = styled(PerfectScrollbar)`
  background-color: ${(props) => props.theme.sidebar.background};
  border-right: 1px solid rgba(0, 0, 0, 0.12);
`;

const List = styled(MuiList)`
  background-color: ${(props) => props.theme.sidebar.background};
`;

const Items = styled.div`
  padding-top: ${(props) => props.theme.spacing(2.5)}px;
  padding-bottom: ${(props) => props.theme.spacing(2.5)}px;
`;

const Brand = styled(ListItem)<{ button?: boolean }>`
  font-size: ${(props) => props.theme.typography.h5.fontSize};
  font-weight: ${(props) => props.theme.typography.fontWeightMedium};
  color: ${(props) => props.theme.sidebar.header.color};
  background-color: ${(props) => props.theme.sidebar.header.background};
  font-family: ${(props) => props.theme.typography.fontFamily};
  min-height: 56px;
  padding-left: ${(props) => props.theme.spacing(6)}px;
  padding-right: ${(props) => props.theme.spacing(6)}px;
  cursor: default;

  ${(props) => props.theme.breakpoints.up("sm")} {
    min-height: 64px;
  }

  &:hover {
    background-color: ${(props) => props.theme.sidebar.header.background};
  }
`;

type CategoryType = {
  activeClassName?: string;
  button?: boolean;
  onClick?: () => void;
  to?: string;
  component?: typeof NavLink;
  exact?: boolean;
};

const Category = styled(ListItem)<CategoryType>`
  padding-top: ${(props) => props.theme.spacing(3)}px;
  padding-bottom: ${(props) => props.theme.spacing(3)}px;
  padding-left: ${(props) => props.theme.spacing(6)}px;
  padding-right: ${(props) => props.theme.spacing(5)}px;
  font-weight: ${(props) => props.theme.typography.fontWeightRegular};

  svg {
    color: ${(props) => props.theme.sidebar.color};
    font-size: 20px;
    width: 20px;
    height: 20px;
    opacity: 0.5;
  }

  &:hover {
    background: ${(props) => props.theme.sidebar.header.background};
  }

  &.${(props) => props.activeClassName} {
    //background-color: ${(props) =>
      darken(0.05, props.theme.sidebar.background)};
    background-color: rgba(0, 0, 0, 0.2);

    span {
      color: ${(props) => props.theme.sidebar.color};
    }
  }
`;

const CategoryText = styled(ListItemText)`
  margin: 0;
  span {
    color: ${(props) => props.theme.sidebar.color};
    font-size: ${(props) => props.theme.typography.body1.fontSize}px;
    font-weight: ${(props) => props.theme.sidebar.category.fontWeight};
    padding: 0 ${(props) => props.theme.spacing(4)}px;
  }
`;

const CategoryIconLess = styled(ExpandLess)`
  color: ${(props) => rgba(props.theme.sidebar.color, 0.5)};
`;

const CategoryIconMore = styled(ExpandMore)`
  color: ${(props) => rgba(props.theme.sidebar.color, 0.5)};
`;

const Link = styled(ListItem)<{
  activeClassName: string;
  component: typeof NavLink;
  exact: boolean;
  to: string;
}>`
  padding-left: ${(props) => props.theme.spacing(15)}px;
  padding-top: ${(props) => props.theme.spacing(2)}px;
  padding-bottom: ${(props) => props.theme.spacing(2)}px;

  span {
    /* color: ${(props) => rgba(props.theme.sidebar.color, 0.7)}; */
  }

  &:hover span {
    color: ${(props) => rgba(props.theme.sidebar.color, 0.9)};
  }

  &.${(props) => props.activeClassName} {
    background-color: ${(props) => props.theme.header.background};
    //background-color: rgba(0,0,0,0.2);

    span {
      color: ${(props) => props.theme.sidebar.color};
    }
  }
`;

const LinkText = styled(ListItemText)`
  color: ${(props) => props.theme.sidebar.color};
  span {
    font-size: ${(props) => props.theme.typography.body1.fontSize}px;
  }
  margin-top: 0;
  margin-bottom: 0;
`;

const LinkBadge = styled(Chip)`
  font-size: 11px;
  font-weight: ${(props) => props.theme.typography.fontWeightBold};
  height: 20px;
  position: absolute;
  right: 12px;
  top: 8px;
  background: ${(props) => props.theme.sidebar.badge.background};

  span.MuiChip-label,
  span.MuiChip-label:hover {
    cursor: pointer;
    color: ${(props) => props.theme.sidebar.badge.color};
    padding-left: ${(props) => props.theme.spacing(2)}px;
    padding-right: ${(props) => props.theme.spacing(2)}px;
  }
`;

const CategoryBadge = styled(LinkBadge)`
  top: 12px;
`;

const SidebarSection = styled(Typography)`
  color: ${(props) => props.theme.sidebar.color};
  padding: ${(props) => props.theme.spacing(4)}px
    ${(props) => props.theme.spacing(6)}px
    ${(props) => props.theme.spacing(1)}px;
  opacity: 0.9;
  display: block;
`;

const SidebarFooter = styled.div`
  background-color: ${(props) =>
    props.theme.sidebar.footer.background} !important;
  padding: ${(props) => props.theme.spacing(2.75)}px
    ${(props) => props.theme.spacing(4)}px;
  border-right: 1px solid rgba(0, 0, 0, 0.12);
`;

const SidebarFooterText = styled(Typography)`
  color: ${(props) => props.theme.sidebar.footer.color};
  text-overflow: ellipsis;
  overflow: hidden;
  height: 1.2rem;
  white-space: nowrap;
  width: 100%;
`;

const SidebarFooterSubText = styled(Typography)`
  color: ${(props) => props.theme.sidebar.footer.color};
  text-overflow: ellipsis;
  overflow: hidden;
  height: 1.2rem;
  white-space: nowrap;
  width: 100%;
  font-size: 0.9;
`;

const StyledBadge = styled(Badge)`
  margin-right: ${(props) => props.theme.spacing(1)}px;

  span {
    background-color: ${(props) =>
      props.theme.sidebar.footer.online.background};
    border: 1.5px solid ${(props) => props.theme.palette.common.white};
    height: 12px;
    width: 12px;
    border-radius: 50%;
  }
`;

type SidebarCategoryPropsType = {
  name: string;
  icon: JSX.Element;
  classes?: string;
  isOpen?: boolean;
  isCollapsable: boolean;
  badge?: string | number;
  activeClassName?: string;
  button: true;
  onClick?: () => void;
  to?: string;
  component?: typeof NavLink;
  exact?: boolean;
  externalLink?: boolean;
};

const SidebarCategory: React.FC<SidebarCategoryPropsType> = ({
  name,
  icon,
  classes,
  isOpen,
  isCollapsable,
  badge,
  externalLink,
  ...rest
}) => {
  return (
    <Category
      /** @ts-ignore */
      onClick={e => {
        if (externalLink) {
          e.preventDefault();
          // open in new tab
          window.open(rest.to, '_blank');
        }
      }}
      {...rest}
    >
      {icon}
      <CategoryText>{name}</CategoryText>
      {isCollapsable ? (
        isOpen ? (
          <CategoryIconMore />
        ) : (
          <CategoryIconLess />
        )
      ) : null}
      {badge ? <CategoryBadge label={badge} /> : ""}
    </Category>
  );
};

type SidebarLinkPropsType = {
  name: string;
  to: string;
  badge?: string | number;
  icon?: JSX.Element;
};

const SidebarLink: React.FC<SidebarLinkPropsType> = ({
  name,
  to,
  badge,
  icon,
}) => {
  return (
    <Link
      button
      dense
      component={NavLink}
      exact
      to={to}
      activeClassName="active"
    >
      {icon}
      <LinkText>{name}</LinkText>
      {badge ? <LinkBadge label={badge} /> : ""}
    </Link>
  );
};

type SidebarPropsType = {
  classes?: string;
  staticContext: string;
  location: {
    pathname: string;
  };
  routes: Array<RouteInfoType>;
  PaperProps: {
    style: {
      width: number;
      backgroundImage: string;
    };
  };
  variant?: "permanent" | "persistent" | "temporary";
  open?: boolean;
  onClose?: () => void;
};

const Sidebar: React.FC<RouteComponentProps & SidebarPropsType> = ({
  classes,
  staticContext,
  location,
  ...rest
}) => {
  const { userGoogleProfile } = useAppSelector((state) => state.globalSlice);
  const { selectedApp, selectedGame } = useAppSelector(
    (state) => state.gameConfigForm
  );
  const loggedInUserRoles: TCmsRole[] | null =
    userGoogleProfile && "userRoles" in userGoogleProfile
      ? userGoogleProfile.userRoles
      : null;
  const isLoggedInUserJrxAdminOrMngr = useMemo(
    () => isLoggedInUserJrxSuperAdminOrManager(loggedInUserRoles),
    [userGoogleProfile]
  );

  type tplotOptions = {
    [key: number]: boolean;
  };

  const initOpenRoutes = (): tplotOptions => {
    /* Open collapse element that matches current url */
    const pathName = location.pathname;

    let _routes = {};

    routes.forEach((route: RouteInfoType, index) => {
      const isActive = pathName.indexOf(route.path) === 0;
      const isOpen = route.open;
      const isHome = route.containsHome && pathName === "/";
      const isChild = Boolean(
        route.children?.find((r) => r.path === pathName) ||
          route.childrenNotVisibleInSidebar?.find((r) => r.path === pathName)
      );

      _routes = Object.assign({}, _routes, {
        [index]: isActive || isOpen || isHome || isChild,
      });
    });

    return _routes;
  };

  const [openRoutes, setOpenRoutes] = useState(() => initOpenRoutes());

  const toggle = (index: number) => {
    // Collapse all elements
    Object.keys(openRoutes).forEach(
      (item) =>
        openRoutes[index] ||
        setOpenRoutes((openRoutes) =>
          Object.assign({}, openRoutes, { [item]: false })
        )
    );

    // Toggle selected element
    setOpenRoutes((openRoutes) =>
      Object.assign({}, openRoutes, { [index]: !openRoutes[index] })
    );
  };

  return (
    <Drawer variant="permanent" {...rest}>
      <Brand button>
        <img
          src="https://play.clixlogix-samplecode.video/static/img/favicon/android-chrome-192x192.png"
          alt="clixlogix-samplecode logo"
          width="40"
          height="40"
          style={{ marginRight: "1rem" }}
        />
        Dashboard
      </Brand>
      <Scrollbar>
        <List disablePadding>
          <Items>
            {routes
              // .filter(r => apps.list.length || (!apps.list.length && [
              //   ROUTES.DOCS,
              //   ROUTES.DOCS_STATIC,
              //   ROUTES.SETTINGS,
              //   ROUTES.TEAM_ACCESS_CONTROL_MANAGEMENT,
              // ].includes(r.path)))
              .filter((r) => {
                // hide Users link for non-clixlogix-samplecode users
                if (r.path === ROUTES.USERS && !isLoggedInUserJrxAdminOrMngr) {
                  return false;
                }
                return true;
              })
              .map((category: RouteInfoType, index) => (
                <React.Fragment key={index}>
                  {category.header ? (
                    <SidebarSection>{category.header}</SidebarSection>
                  ) : null}

                  {category.children && category.icon ? (
                    <React.Fragment key={index}>
                      <SidebarCategory
                        isOpen={!openRoutes[index]}
                        isCollapsable={true}
                        name={category.id}
                        icon={category.icon}
                        button={true}
                        onClick={() => toggle(index)}
                      />

                      <Collapse
                        in={openRoutes[index]}
                        timeout="auto"
                        unmountOnExit
                      >
                        {category.children.map(
                          (route: ChildElementType, index: number) => {
                            if (isLoggedInUserJrxAdminOrMngr) {
                              return (
                                <SidebarLink
                                  key={index}
                                  name={route.name}
                                  to={route.path
                                    .replace(
                                      URL_PART_APP_ID,
                                      selectedApp || CONSTANTS.MISC.SAMPLE_APP
                                    )
                                    .replace(URL_PART_GAME_ID, selectedGame)}
                                  icon={route.icon}
                                  badge={route.badge}
                                />
                              );
                            } else {
                              if (route.name !== "Request Management") {
                                return (
                                  <SidebarLink
                                    key={index}
                                    name={route.name}
                                    to={route.path
                                      .replace(
                                        URL_PART_APP_ID,
                                        selectedApp || CONSTANTS.MISC.SAMPLE_APP
                                      )
                                      .replace(URL_PART_GAME_ID, selectedGame)}
                                    icon={route.icon}
                                    badge={route.badge}
                                  />
                                );
                              }
                            }
                          }
                        )}
                      </Collapse>
                    </React.Fragment>
                  ) : category.icon ? (
                    <SidebarCategory
                      isCollapsable={false}
                      name={category.id}
                      to={category.path
                        .replace(
                          URL_PART_APP_ID,
                          selectedApp || CONSTANTS.MISC.SAMPLE_APP
                        )
                        .replace(URL_PART_GAME_ID, selectedGame)}
                      activeClassName="active"
                      component={NavLink}
                      exact
                      button={true}
                      icon={category.icon}
                      badge={category.badge}
                      externalLink={category.externalLink}
                    />
                  ) : null}
                </React.Fragment>
              ))}
          </Items>
        </List>
      </Scrollbar>
      {/*<SidebarFooter>
        <Grid container spacing={2}>
          <Grid item>
            <StyledBadge
              overlap="circle"
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
              variant="dot"
            >
              {/* {userGoogleProfile && <Avatar alt="Lucy Lavender" src={userGoogleProfile.imageUrl} />} //
              {userGoogleProfile &&
                <Avatar
                  alt={userGoogleProfile.name}
                  src={'imageUrl' in userGoogleProfile ? userGoogleProfile.imageUrl : ''}
                />
              }
            </StyledBadge>
          </Grid>
          <Grid item style={{ display: 'flex', alignItems: 'flex-start', maxWidth: 183, flexDirection: 'column' }}>
            <SidebarFooterText variant="body2">
              {userGoogleProfile && userGoogleProfile.name}
            </SidebarFooterText>
            <SidebarFooterSubText variant="caption">
              {userGoogleProfile?.email}
            </SidebarFooterSubText>
          </Grid>
        </Grid>
            </SidebarFooter>*/}
    </Drawer>
  );
};

export default withRouter(Sidebar);

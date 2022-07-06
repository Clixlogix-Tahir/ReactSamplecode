/* eslint-disable react-hooks/exhaustive-deps */
import * as React from "react";
import styled, { withTheme } from "styled-components";
import {
  connect
} from "react-redux";

import {
  Grid,
  Hidden,
  AppBar as MuiAppBar,
  IconButton as MuiIconButton,
  Toolbar,
  ListItem as MuIListItem,
  List,
  Drawer as MuiDrawer,
} from "@material-ui/core";
import globalSyles from '../theme/globalStyles';
import { Menu as MenuIcon } from "@material-ui/icons";

import { Link, NavLink } from "react-router-dom";

import { ReactComponent as clixlogix-samplecodeLogo } from '../custom-icons/clixlogix-samplecode.svg';
import { ROUTES } from "../common/constants";

const AppBar = styled(MuiAppBar)`
  box-shadow: inset 0 0 8px 0 rgba(0, 0, 0, 0.19);
  background-image: linear-gradient(274deg, #0e1975 100%, #040b48 47%, #000e83 0%);
  color: #fff;
  box-shadow: ${props => props.theme.shadows[1]};
  display: flex;
  flex-direction: column;
  .MuiListItem-button {
    display: inline-block;
    width: auto;
  }
  a {
    font-size: 24px;
  }
`;

const Drawer = styled(MuiDrawer)`
  .MuiDrawer-paperAnchorLeft {
    background-image: linear-gradient(314deg,#0e1975 100%,#040b48 49%,#000e83 3%);
    min-width: 250px;
  }
`;

const IconButton = styled(MuiIconButton)`
  svg {
    width: 22px;
    height: 22px;
  }
`;

const ListItem = styled(MuIListItem)`
  a {
    color: #fff;
    text-decoration: none;
    &.active { color: #ffe; }
    font-size:20px;
  }
`;

// const list = <h1>test</h1>
const list = <List>
  <ListItem button={true}>
    <NavLink
      to={ROUTES.DOCS_STATIC_NATIVE_HARNESS}
    >Doveloper docs</NavLink>
  </ListItem>
  <ListItem button={true}>
    <NavLink
      to={'/auth/sign-in'}
    >Login</NavLink>
  </ListItem>
  <ListItem button={true}>
    <NavLink
      to={'/auth/sign-up'}
    >Sign up</NavLink>
  </ListItem>
</List>;

type HeaderProps = {
  theme: {};
  onDrawerToggle: React.MouseEventHandler<HTMLElement>;
}

const Header: React.FC<HeaderProps> = ({ onDrawerToggle }) => {
  const globalClassess = globalSyles();

  const [anchorMenu, setAnchorMenu] = React.useState<any>(null);

  const toggleMenu = (event: React.SyntheticEvent) => {
    setAnchorMenu(event.currentTarget);
  };

  const closeMenu = () => {
    setAnchorMenu(null);
  };

  return (
  <React.Fragment>
    <AppBar position="sticky" elevation={0}>
      <Toolbar>
        <Grid container alignItems="center">
            <Grid item style={{ display: 'flex' }}>
              <a href="https://www.onclixlogix-samplecode.com/" >
                <clixlogix-samplecodeLogo />
              </a>
            </Grid>
          <Grid item xs />
          <Hidden xsDown>
            <Grid item>
              <List style={{ display: 'flex' }}>
                <ListItem button={true}>
                    <NavLink className="links"
                      activeClassName={globalClassess.activeLinks}
                    to={ROUTES.DOCS_STATIC_NATIVE_HARNESS}
                  >Developer docs</NavLink>
                </ListItem>
                <ListItem button={true}>
                  <NavLink className="links"
                      activeClassName={globalClassess.activeLinks}
                    to={ROUTES.LOGIN}
                  >Login</NavLink>
                </ListItem>
                <ListItem button={true}>
                  <NavLink className="links"
                      activeClassName={globalClassess.activeLinks}
                    to={ROUTES.SIGNUP}
                  >Sign up</NavLink>
                </ListItem>
              </List>
            </Grid>
          </Hidden>
          <Hidden smUp>
            <Grid item>
              <IconButton
                color="inherit"
                aria-label="Open drawer"
                // onClick={onDrawerToggle}
                onClick={toggleMenu}
              >
                <MenuIcon />
              </IconButton>
            </Grid>
          </Hidden>
        </Grid>
      </Toolbar>
    </AppBar>
    <Drawer
      id="menu-header-auth"
      // anchorEl={anchorMenu}
      open={Boolean(anchorMenu)}
      onClose={closeMenu}
    >
      {list}
    </Drawer>
  </React.Fragment>
  )
};

export default connect()(withTheme(Header));

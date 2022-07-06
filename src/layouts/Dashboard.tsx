/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import styled, { createGlobalStyle } from "styled-components";
import { GlobalStyleProps, RouteInfoType } from "./../types/types";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import Footer from "../components/Footer";

import { spacing } from "@material-ui/system";
import {
  Hidden,
  CssBaseline,
  Paper as MuiPaper,
  withWidth,
} from "@material-ui/core";

import { isWidthUp } from "@material-ui/core/withWidth";
import { useAppDispatch, useAppSelector } from "../common/hooks";
import { fetchAppsListDispatcher } from "../pages/game-config/gameConfigSlice";
import { TApp } from "../pages/game-config/gameConfigApi";

const drawerWidth = 260;

const GlobalStyle = createGlobalStyle<GlobalStyleProps>`
  html,
  body,
  #root {
    height: 100%;
  }

  body {
    background: ${(props) => props.theme.body.background};
  }

  .MuiCardHeader-action .MuiIconButton-root {
    padding: 4px;
    width: 28px;
    height: 28px;
  }
`;

const Root = styled.div`
  display: flex;
  min-height: 100vh;
`;

const Drawer = styled.div`
  ${(props) => props.theme.breakpoints.up("md")} {
    width: ${drawerWidth}px;
    flex-shrink: 0;
  }
`;

const AppContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const Paper = styled(MuiPaper)(spacing);

const MainContent = styled(Paper)`
  flex: 1;
  // background: ${(props) => props.theme.body.background};
  background-image: linear-gradient(to bottom, #f2f7ff, #bed7fc);
  background-attachment: fixed;

  @media all and (-ms-high-contrast: none), (-ms-high-contrast: active) {
    flex: none;
  }

  .MuiPaper-root .MuiPaper-root {
    box-shadow: none;
  }
`;

type DashboardPropsType = {
  routes: Array<RouteInfoType>;
  width: "md" | "xs" | "sm" | "lg" | "xl";
};

const Dashboard: React.FC<DashboardPropsType> = ({
  children,
  routes,
  width,
}) => {
  const dispatch = useAppDispatch();
  const { apps } = useAppSelector((state) => state.gameConfigForm);
  const { userGoogleProfile } = useAppSelector((state) => state.globalSlice);
  const companyId =
    userGoogleProfile && "companyId" in userGoogleProfile
      ? userGoogleProfile.companyId
      : 2;
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (!apps.list.length) {
      dispatch(
        fetchAppsListDispatcher(companyId, {
          success: (apps: TApp[]) => {
            // if (!apps.length && ![ROUTES.DOCS, ROUTES.TEAM_ACCESS_CONTROL_MANAGEMENT].includes(route.path)) {
            //   redirectTo(ROUTES.TEAM_ACCESS_CONTROL_MANAGEMENT);
            // }
          },
        })
      );
    }
  }, []);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <Root>
      <CssBaseline />
      <GlobalStyle />
      <Drawer>
        <Hidden mdUp implementation="js">
          <Sidebar
            routes={routes}
            PaperProps={{
              style: {
                width: drawerWidth,
                backgroundImage:
                  "linear-gradient(350deg, #0e1975 100%, #040b48 50%, #000e83 5%)",
              },
            }}
            variant="temporary"
            open={mobileOpen}
            onClose={handleDrawerToggle}
          />
        </Hidden>
        <Hidden smDown implementation="css">
          <Sidebar
            routes={routes}
            PaperProps={{
              style: {
                width: drawerWidth,
                backgroundImage:
                  "linear-gradient(350deg, #0e1975 100%, #040b48 50%, #000e83 5%)",
              },
            }}
          />
        </Hidden>
      </Drawer>
      <AppContent>
        <Header onDrawerToggle={handleDrawerToggle} />
        <MainContent
          p={isWidthUp("lg", width) ? 10 : 5}
          style={{ position: "relative" }}
        >
          {children}
        </MainContent>
        <Footer />
      </AppContent>
    </Root>
  );
};

export default withWidth()(Dashboard);

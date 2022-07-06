/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import styled, { createGlobalStyle } from "styled-components";
import { GlobalStyleProps, RouteInfoType } from './../types/types'
import {
  CssBaseline
} from "@material-ui/core";
import HeaderAuth from "../components/HeaderAuth";
import { BASE_URLs, ROUTES } from '../common/constants';
import { useAppRedirect, useAppSelector } from "../common/hooks";

const GlobalStyle = createGlobalStyle<GlobalStyleProps>`
  html,
  body,
  #root {
    height: 100%;
  }

  body {
    background: ${props => props.theme.body.background};
  }
`;

const Root = styled.div`
  display: flex;
  flex-direction: column;
  background-image: linear-gradient(to bottom, #f2f7ff, #bed7fc);
  background-attachment: fixed;
  position: relative;
`;

type TBeforeBgProps = {
  className?: string;
}

const BeforeBg = styled.div<TBeforeBgProps>`
  position: absolute;
  bottom: 0;
  left: 0;
  width: 60vh;
  height: 60vh;
  background-image: url(${BASE_URLs.assetPrefix}img/bg-dotted-off-white.png);
  background-size: 60vh;
  background-position: top right;
  z-index: 0;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  overflow: hidden;
  img {
    max-width: 70%;
  }
  &.after-bg {
    bottom: auto;
    left: auto;
    top: 0;
    right: 0;
    transform: rotate(180deg);
    img {
      transform: scaleY(-1);
    }
  }

  ${props => props.theme.breakpoints.down("md")} {
    width: 60vw;
    height: 60vw;
    background-size: 60vw;
    .after-bg {
      align-items: baseline;
    }
    :not(.after-bg) {
      align-items: end;
    }
  }
`;

type DashboardPropsType = {
  routes: Array<RouteInfoType>
  width: "md" | "xs" | "sm" | "lg" | "xl"
}

const Auth: React.FC<DashboardPropsType> = ({ children, routes, width }) => {
  const redirectTo = useAppRedirect();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { userGoogleProfile } = useAppSelector(state => state.globalSlice);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  useEffect(() => {
    // if user already logged, redirect them to default logged in page
    if (userGoogleProfile) {
      redirectTo(ROUTES.OVERVIEW);
    }
  }, []);

  return (
    <Root>
      <BeforeBg>
        <img
          src={`${BASE_URLs.assetPrefix}img/icons-clixlogix-samplecode-logo-filled.svg`}
          alt="clixlogix-samplecode logo"
        />
      </BeforeBg>
      <BeforeBg className="after-bg">
        <img
          src={`${BASE_URLs.assetPrefix}img/icons-clixlogix-samplecode-logo-filled.svg`}
          alt="clixlogix-samplecode logo"
        />
      </BeforeBg>
      <CssBaseline />
      <GlobalStyle />
      <HeaderAuth onDrawerToggle={handleDrawerToggle} />
      {children}
    </Root>
  );
}

export default Auth;

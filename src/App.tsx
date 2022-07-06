import React from "react";
import { connect, Provider } from "react-redux";
import { Helmet } from 'react-helmet';

import DateFnsUtils from "@date-io/date-fns";
import { ThemeProvider as MuiThemeProvider } from "@material-ui/core/styles";
import { MuiPickersUtilsProvider } from "@material-ui/pickers";
import { StylesProvider } from "@material-ui/styles";
import { ThemeProvider } from "styled-components";

import maTheme from "./theme";
import Routes from "./routes/Routes";
import { AppStateType } from "./redux/reducers";
import { ThemeInitialStateType } from "./redux/reducers/themeReducers";
import Store from "./rtk-reducers";
import AxiosInterceptors from "./common/AxiosInterceptors";

function App({ theme }: {theme: ThemeInitialStateType}) {
  return (
    <>
      <Helmet
        titleTemplate="%s | clixlogix-samplecode"
        defaultTitle="clixlogix-samplecode Dashboard"
      />
      <StylesProvider injectFirst>
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <MuiThemeProvider theme={maTheme[theme.currentTheme]}>
            <ThemeProvider theme={maTheme[theme.currentTheme]}>
              <Provider store={Store}>
                <Routes />
              </Provider>
            </ThemeProvider>
          </MuiThemeProvider>
        </MuiPickersUtilsProvider>
      </StylesProvider>
    </>
  );
}

export default connect((store: AppStateType) => ({ theme: store.themeReducer }))(
  AxiosInterceptors(App)
);

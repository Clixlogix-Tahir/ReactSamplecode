/* eslint-disable react-hooks/exhaustive-deps */
import {
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Tab,
  Tabs,
  Toolbar,
} from "@material-ui/core";
import React, { useState } from "react";
import Helmet from "react-helmet";
import {
  useAppDispatch,
  useAppRedirect,
  useAppSelector,
} from "../../common/hooks";
import globalStyles from "../../theme/globalStyles";
import { CONSTANTS, ROUTES, URL_PART_APP_ID } from "../../common/constants";
import { useRouteMatch } from "react-router";

import { Search } from "react-feather";
import { setChartInfo } from "../../rtk-reducers/globalSlice";

export enum PREDEFINED_BI_APP_ID {
  ALL = "10",
}

/** Provides analytics tabs and filter controls. */
function Analytics(props: any) {
  const routeMatch = useRouteMatch();
  const dispatch = useAppDispatch();
  const classes = globalStyles();
  const redirectTo = useAppRedirect();
  // const [selectedAppBiId, setSelectedAppBiId] = useState('');
  const [countryFilter, setCountryFilter] = useState("");
  const [sourceFilter, setSourceFilter] = useState("");
  const [platformFilter, setPlatformFilter] = useState("");
  const { selectedApp } = useAppSelector((state) => state.gameConfigForm);

  // useEffect(() => {
  //   if (selectedApp === PREDEFINED_BI_APP_ID.ALL) {
  //     setSelectedAppBiId(selectedApp);
  //     return;
  //   }
  //   setSelectedAppBiId(apps.list.find(app => app.appId === selectedApp)?.biAppId || '');
  // }, [selectedApp]);

  const handleTabChange = (event: React.ChangeEvent<{}>, newValue: string) => {
    // setSelectedTab(newValue);
    redirectTo(newValue);
  };

  return (
    // <div className={classes.fullIframe}>
    //   <Helmet title="Analytics" />

    //   {selectedAppBiId && <iframe
    //     title={`Analytics for app ${selectedApp}`}
    //     src={`https://analytics.useblitz.com/bi/blitzappsdashboard/tickers.jsp?app_id=9999${selectedAppBiId}&bqenabled=1`}
    //   />}

    //   {!selectedAppBiId && <Alert severity="warning">No app selected.</Alert>}
    // </div>
    <div>
      <Helmet title="Analytics">
        <script
          type="text/javascript"
          src="https://media.useblitz.com/assets/scripts/highstock-9.1.2.js"
        ></script>
      </Helmet>
      <Paper className={classes.paperRoot} style={{ marginBottom: 24 }}>
        <Tabs
          value={routeMatch.path}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          variant="scrollable"
          scrollButtons="auto"
          aria-label="scrollable auto tabs example"
          style={{ width: "calc(100vw - 80px - 260px)" }}
        >
          <Tab
            value={ROUTES.ANALYTICS.replace(URL_PART_APP_ID, selectedApp)}
            label="Overview"
          />
          <Tab
            value={ROUTES.ANALYTICS_volume.replace(
              URL_PART_APP_ID,
              selectedApp
            )}
            label="Volume"
          />
          <Tab
            value={ROUTES.ANALYTICS_app_performance.replace(
              URL_PART_APP_ID,
              selectedApp
            )}
            label="App Performance"
          />
          <Tab
            value={ROUTES.ANALYTICS_engagement.replace(
              URL_PART_APP_ID,
              selectedApp
            )}
            label="Engagement"
          />
          <Tab
            value={ROUTES.ANALYTICS_monetization.replace(
              URL_PART_APP_ID,
              selectedApp
            )}
            label="Monetization"
          />
          <Tab
            value={ROUTES.ANALYTICS_retention.replace(
              URL_PART_APP_ID,
              selectedApp
            )}
            label="Retention"
          />
          <Tab
            value={ROUTES.ANALYTICS_source_wise.replace(
              URL_PART_APP_ID,
              selectedApp
            )}
            label="Source-wise"
          />
          <Tab
            value={ROUTES.ANALYTICS_virtual_currency.replace(
              URL_PART_APP_ID,
              selectedApp
            )}
            label="Virtual Currency"
          />
          <Tab
            value={ROUTES.ANALYTICS_viral.replace(URL_PART_APP_ID, selectedApp)}
            label="Viral"
          />
          <Tab
            value={ROUTES.ANALYTICS_others.replace(
              URL_PART_APP_ID,
              selectedApp
            )}
            label="Others"
          />
        </Tabs>
      </Paper>

      <Paper style={{ marginBottom: 24 }}>
        <Toolbar variant="dense">
          <FormControl style={{ minWidth: 150 }}>
            <InputLabel>Country</InputLabel>
            <Select
              value={countryFilter}
              onChange={(e) => {
                const value = e.target.value as string;
                setCountryFilter(value);
              }}
            >
              {CONSTANTS.tickers.countries.map((c) => (
                <MenuItem value={c.value} key={c.label}>
                  {c.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl style={{ minWidth: 150 }}>
            <InputLabel>Source</InputLabel>
            <Select
              value={sourceFilter}
              onChange={(e) => {
                const value = e.target.value as string;
                setSourceFilter(value);
              }}
            >
              {CONSTANTS.tickers.sources.map((c) => (
                <MenuItem value={c.value} key={c.label}>
                  {c.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl style={{ minWidth: 150 }}>
            <InputLabel>Platform</InputLabel>
            <Select
              value={platformFilter}
              onChange={(e) => {
                const value = e.target.value as string;
                setPlatformFilter(value);
              }}
            >
              {CONSTANTS.tickers.platforms.map((c) => (
                <MenuItem value={c.value} key={c.label}>
                  {c.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            style={{ marginLeft: 24 }}
            onClick={() =>
              dispatch(
                setChartInfo({
                  forceChartRefresh: true,
                  chartPrefix: countryFilter + sourceFilter + platformFilter,
                })
              )
            }
          >
            <Search />
          </IconButton>
        </Toolbar>
      </Paper>
      {props.children}
    </div>
  );
}

export default Analytics;

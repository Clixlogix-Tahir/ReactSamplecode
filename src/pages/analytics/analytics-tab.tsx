/* eslint-disable react-hooks/exhaustive-deps */
import {
  Button, createStyles, Grid,
  Paper,
  Typography
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import React, { Fragment, useEffect, useMemo, useState } from 'react';
import { Plus } from 'react-feather';
import { useRouteMatch } from 'react-router';
import { Link } from 'react-router-dom';
import Analytics, { PREDEFINED_BI_APP_ID } from '.';
import { CONSTANTS, ROUTES } from '../../common/constants';
import tickers from '../../common/constants/charts';
import { useAppSelector } from '../../common/hooks';
import { Eclixlogix-samplecodeEnvs, getclixlogix-samplecodeEnv, jrUtils } from '../../common/utils';
import Chart from '../../components/Chart';
import globalStyles from '../../theme/globalStyles';

type TAnalyticsTab = {};

const useStyles = makeStyles((theme) => createStyles({
  containerImg: {
    maxWidth: '100%',
  },
  imgWrapper: {
    position: 'relative',
  },
  imgResponsive: {
    width: '100%',
    height: 'auto',
  },
  imgOverlay: {
    position: 'absolute',
    top: 0,
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  }
}));

/** @description Creates a grid layout with charts.
 * Charts are chosen depending upon route.
 */
function AnalyticsTab(props: TAnalyticsTab) {
  const routeMatch = useRouteMatch();
  const globalClasses = globalStyles();
  const classes = useStyles();
  const { apps, selectedApp, selectedGame } = useAppSelector(state => state.gameConfigForm);
  const { chartInfo } = useAppSelector(state => state.globalSlice);
  const [selectedAppBiId, setSelectedAppBiId] = useState('');
  const charts = useMemo(() => {
    if (!selectedAppBiId) return [];
    switch(routeMatch.path) {
      case ROUTES.ANALYTICS:
        return jrUtils.getChartsFilteredByInclusionOrExclusion(CONSTANTS.tickers.overviewCharts, selectedAppBiId);
      case ROUTES.ANALYTICS_engagement:
        return jrUtils.getChartsFilteredByInclusionOrExclusion(CONSTANTS.tickers.engagementCharts, selectedAppBiId);
      case ROUTES.ANALYTICS_app_performance:
        return jrUtils.getChartsFilteredByInclusionOrExclusion(CONSTANTS.tickers.appPerformanceCharts, selectedAppBiId);
      case ROUTES.ANALYTICS_monetization:
        return jrUtils.getChartsFilteredByInclusionOrExclusion(CONSTANTS.tickers.revenueCharts, selectedAppBiId);
      case ROUTES.ANALYTICS_retention:
        return jrUtils.getChartsFilteredByInclusionOrExclusion(CONSTANTS.tickers.retentionCharts, selectedAppBiId);
      case ROUTES.ANALYTICS_volume:
        return jrUtils.getChartsFilteredByInclusionOrExclusion(CONSTANTS.tickers.volumeCharts, selectedAppBiId);
      case ROUTES.ANALYTICS_source_wise:
        return jrUtils.getChartsFilteredByInclusionOrExclusion(CONSTANTS.tickers.sourceWiseCharts, selectedAppBiId);
      case ROUTES.ANALYTICS_virtual_currency:
        return jrUtils.getChartsFilteredByInclusionOrExclusion(CONSTANTS.tickers.virtualCurrencyCharts, selectedAppBiId);
      case ROUTES.ANALYTICS_viral:
        return jrUtils.getChartsFilteredByInclusionOrExclusion(CONSTANTS.tickers.viralCharts, selectedAppBiId);
      case ROUTES.ANALYTICS_others:
        return jrUtils.getChartsFilteredByInclusionOrExclusion(CONSTANTS.tickers.othersCharts, selectedAppBiId);
    }
  }, [selectedAppBiId]);

  useEffect(() => {
    if (selectedApp) {
      if (selectedApp === PREDEFINED_BI_APP_ID.ALL) {
        setSelectedAppBiId(selectedApp);
        return;
      }
      // todo disabled biAppId from API call as it doesn't work for test envs; using tempBiIdMap instead
      // setSelectedAppBiId(apps.list.find(app => app.appId === selectedApp)?.biAppId || '');
      setSelectedAppBiId([Eclixlogix-samplecodeEnvs.PROD, Eclixlogix-samplecodeEnvs.PROD_TESTNET].includes(getclixlogix-samplecodeEnv()) ?
        apps.list.find(app => app.appId === selectedApp)?.biAppId || '' :
        CONSTANTS.tempBiIdMap[selectedApp] || '');
    }
  }, [selectedApp]);

  return (
    <Analytics>
      <Grid container spacing={6}>
        {charts?.map((chart, index) =>
          <Grid item sm={6} key={`${chart.chartName}-${index}`}>
            <Paper className={globalClasses.paperRoot} style={{ minHeight: 350, padding: '1rem' }}>
              {selectedGame === CONSTANTS.MISC.SAMPLE_GAME && !chart.showForSampleApp ?
                <Fragment>
                  <Typography variant="h6">{chart.chartName}</Typography>

                  <div className={classes.imgWrapper}>
                    <img
                      src="https://assets.onclixlogix-samplecode.com/website/img/blurred-chart.jpeg"
                      alt="blurred chart"
                      className={classes.containerImg}
                    />
                    <div className={classes.imgOverlay}>
                      <Typography style={{ padding: '1rem', fontWeight: 'bold' }}>To view this chart add a new game</Typography>
                      <Link
                        style={{ color: '#fff', background: 'rgb(72, 144, 232)' }}
                        component={Button}
                        to={ROUTES.CREATE_APP}
                      >
                        <Plus style={{ marginRight: 8 }} />
                        Add New Game
                      </Link>
                    </div>
                  </div>

                </Fragment>
              :
                <Chart
                  gameId={selectedGame === CONSTANTS.MISC.SAMPLE_GAME ? 99999 : parseInt(`9999${selectedAppBiId}`)}
                  type={''}
                  tickerId={chart.tickerId}
                  refreshGraph={chart.refreshGraph}
                  chartName={chart.chartName}
                  chartTag={chart.chartTag}
                  divchartTag={chart.divchartTag}
                  isTopK={chart.isTopK}
                  tickerTags={chart.tickerTags}
                  tickerNames={chart.tickerNames}
                  prefix={chartInfo.chartPrefix}
                  multipliers={selectedGame === CONSTANTS.MISC.SAMPLE_GAME ? chart.sampleMultipliers : chart.multipliers}
                  axisdrifts={chart.axisdrifts}
                  decimals={chart.decimals !== undefined ? chart.decimals : 2}
                />
              }
            </Paper>
          </Grid>
        )}
        {routeMatch.path === ROUTES.ANALYTICS_others &&
          <Grid item sm={12}>
            <Paper className={globalClasses.paperRoot}>
              <ul>
                {tickers.othersTabLinks.map(link => (
                  <li key={link.link}>
                    <a href={link.link} target="_blank" rel="noopener noreferrer">{link.text}</a>
                  </li>
                ))}
              </ul>
            </Paper>
          </Grid>
        }
      </Grid>
    </Analytics>
  );
}

export default AnalyticsTab;

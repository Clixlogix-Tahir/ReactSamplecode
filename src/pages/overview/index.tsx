/* eslint-disable react-hooks/exhaustive-deps */
import {
  Button,
  Card as MuiCard,
  CardContent,
  Grid,
  Tooltip,
  Typography
} from '@material-ui/core';
import { spacing } from "@material-ui/system";
import React, { useEffect, useMemo, useState } from 'react';
import { Plus } from 'react-feather';
import Helmet from 'react-helmet';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { CONSTANTS, ROUTES, URL_PART_APP_ID } from '../../common/constants';
import {
  useAppDispatch,
  useAppRedirect,
  useAppSelector
} from '../../common/hooks';
import { jrUtils } from '../../common/utils';
import Chart from '../../components/Chart';
import { PREDEFINED_BI_APP_ID } from '../analytics';
import {
  setSelectedApp,
  setSelectedGame
} from '../game-config/gameConfigSlice';


const Card = styled(MuiCard)`
  ${spacing};

  box-shadow: none;
`;

const Shadow = styled.div`
  box-shadow: ${props => props.theme.shadows[1]};
`;

const GamesContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin-bottom: 2rem;
`;

const GameCard = styled(MuiCard)`
  ${spacing};
  align-items: center;
  justify-content: center;
  display: flex;
  //flex-grow: 1;
  //height: 20%;
  width: 32%;
  margin: 5px;
  border-radius: 5px;
  box-shadow: 0 2px 3px 0 rgba(0, 0, 0, 0.5) !important;
  border: solid 1px #9c9c9c;
`;

const CardContentFeatured = styled(CardContent)`
  display: flex;
  div {
    padding-left: 1rem;
  }
`;

type TOverviewProps = {};

function Overview(props: TOverviewProps) {
  const dispatch = useAppDispatch();
  const redirectTo = useAppRedirect();
  const {
    gamesFromAllApps,
    selectedApp,
    selectedGame
  } = useAppSelector(state => state.gameConfigForm);
  const [selectedAppBiId, setSelectedAppBiId] = useState('');
  const filteredCharts = useMemo(() =>
    jrUtils.getChartsFilteredByInclusionOrExclusion(CONSTANTS.tickers.overviewCharts, selectedAppBiId),
    [selectedAppBiId]
  );

  useEffect(() => {
    if (selectedApp) {
      if (selectedApp === PREDEFINED_BI_APP_ID.ALL) {
        setSelectedAppBiId(selectedApp);
        return;
      }
      // todo disabled biAppId from API call as it doesn't work for test envs; using tempBiIdMap instead
      // setSelectedAppBiId(apps.list.find(app => app.appId === selectedApp)?.biAppId || '');
      setSelectedAppBiId(selectedGame === CONSTANTS.MISC.SAMPLE_GAME ? CONSTANTS.tempBiIdMap['onclixlogix-samplecode.solitaire'] : CONSTANTS.tempBiIdMap[selectedApp] || '');
    }
  }, [selectedApp, selectedGame]);

  return (
    <div>
      <Helmet title="Overview">
        <script type="text/javascript" src="https://media.useblitz.com/assets/scripts/highstock-9.1.2.js"></script>
      </Helmet>
      <Shadow style={{ marginBottom: 24 }}>
        <Card px={6} py={6} style={{padding:"10px"}}>
          <CardContent>
            <Typography variant="h2">Your Games 123</Typography>
            <GamesContainer>
              <GameCard style={{ color: '#fff', background: 'rgb(72, 144, 232)', position: 'relative' }}>
                <CardContent>
                  <Link
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#fff',
                      textDecoration: 'none',
                      fontWeight: 'bold',
                    }}
                    to={ROUTES.CREATE_APP}
                  >
                    <Plus style={{ marginRight: 8 }} />
                    Add New Game
                  </Link>
                </CardContent>
              </GameCard>
              {gamesFromAllApps.data.map(gameInfo => 
                <GameCard key={`${gameInfo.appId}-${gameInfo.gameId}`}
                  style={{
                    borderColor: selectedGame === gameInfo.gameId && selectedApp === gameInfo.appId ?
                      'rgb(72, 144, 232)' : 'transparent',
                    borderWidth: 2,
                  }}
                >
                  <CardContent style={{ padding: 0, width: '100%' }}>
                    <Tooltip title={gameInfo.appId}>
                      <Button
                        style={{ width: '100%' }}
                        // disabled={gameData.loading === XHR_STATE.IN_PROGRESS}
                        onClick={e => {
                          dispatch(setSelectedApp(gameInfo.appId));
                          dispatch(setSelectedGame(gameInfo.gameId));
                          redirectTo(ROUTES.OVERVIEW.replace(URL_PART_APP_ID, gameInfo.appId));
                        }}
                      >
                        {gameInfo.gameId}
                      </Button>
                    </Tooltip>
                  </CardContent>
                </GameCard>
              )}
              <GameCard
                style={{
                  borderColor: selectedGame === CONSTANTS.MISC.SAMPLE_GAME ? 'rgb(72, 144, 232)' : 'transparent',
                  borderWidth: 2,
                }}
              >
                <CardContent style={{padding:0,paddingBottom:0,display:"block",height:"100%",width:"100%"}}>
                  <Button
                    style={{display:"block",height:"100%",width:"100%"}}
                    onClick={e => {
                      dispatch(setSelectedApp(CONSTANTS.MISC.SAMPLE_APP));
                      dispatch(setSelectedGame(CONSTANTS.MISC.SAMPLE_GAME));
                      redirectTo(ROUTES.OVERVIEW.replace(URL_PART_APP_ID, CONSTANTS.MISC.SAMPLE_APP));
                    }}
                  >
                    Sample Game
                  </Button>
                </CardContent>
              </GameCard>
            </GamesContainer>
          </CardContent>
        </Card>
      </Shadow>

      {(selectedAppBiId || selectedGame === CONSTANTS.MISC.SAMPLE_GAME) &&
        <Grid container spacing={6} style={{ marginBottom: 24 }}>
          {filteredCharts.map(chart =>
            <Grid item sm={6} key={chart.chartTag}>
              <Shadow>
                <Card px={6} py={6}>
                  <CardContent>
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
                      prefix={''}
                      multipliers={selectedGame === CONSTANTS.MISC.SAMPLE_GAME ? chart.sampleMultipliers : chart.multipliers}
                      axisdrifts={chart.axisdrifts}
                      decimals={chart.decimals !== undefined ? chart.decimals : 2}
                    />
                  </CardContent>
                </Card>
              </Shadow>
            </Grid>
          )}
        </Grid>
      }

      <Shadow style={{ marginBottom: 24 }}>
        <Card px={6} py={6}>
          <CardContent>
            <Typography variant="h2">Documentation</Typography>
            <a
              href={ROUTES.DOCS_NATIVE_HARNESS}
              target="_blank"
              rel="noopener noreferrer"
              style={{ fontWeight: 'bold', fontSize: '1.2rem', lineHeight: 3 }}
            >
              Unity Integration Guide
            </a>
          </CardContent>
        </Card>
      </Shadow>

      <Shadow>
        <Card px={6} py={6}>
          <CardContent>
            <Typography variant="h2">Best Real Examples</Typography>
            <Typography>Try out these successful clixlogix-samplecode games.</Typography>
            <GamesContainer>
              <GameCard>
                <a 
                href="https://www.onclixlogix-samplecode.com/games/solitaire-blitz" 
                target="_blank" 
                rel="noopener noreferrer"
                style={{display:"block",width:"100%"}}>
                  <CardContentFeatured>
                    <img
                      src="https://play.clixlogix-samplecode.video/static/images/solitaire-blitz-logo.png"
                      alt="Solitaire logo"
                      width="100" height="100"
                    />
                    <div>
                      <Typography variant="h5">Solitaire Blitz</Typography>
                      <Typography>Test your patience!</Typography>
                    </div>
                  </CardContentFeatured>
                </a>
              </GameCard>
            </GamesContainer>
          </CardContent>
        </Card>
      </Shadow>

    </div>
  );
}

export default Overview;
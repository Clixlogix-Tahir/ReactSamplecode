/* eslint-disable react-hooks/exhaustive-deps */
import { IconButton, Tooltip, Typography } from '@material-ui/core';
import axios from 'axios';
import React, { FC, useEffect, useState } from 'react';
import { RefreshCcw } from 'react-feather';
import styled from 'styled-components';
import Loader from './Loader';
import {
  useAppDispatch,
  useAppSelector
} from '../common/hooks';
import { setChartInfo } from '../rtk-reducers/globalSlice';
import { CONSTANTS } from '../common/constants';


const GraphContainer = styled.div`
  position: relative;
  &.show-watermark {
    overflow: hidden;
    &::before {
      content: 'Sample Data';
      position: absolute;
      top: 130px;
      right: 100px;
      font-size: 70px;
      z-index: 1;
      text-shadow: 0 0 20px white;
      color: rgb(0 0 0 / 20%);
      transform: rotate(-40deg);
    }
  }
`;

// todo move to API file
const getGraphTags = async (gameId: any, chartTag: any) => {
  try {
    const data = await axios.get(
      `https://analytics.useblitz.com/bi/blitzappsdashboard/getTickerDetails.jsp`
        + `?gameId=${gameId}&tickerId=${chartTag}`
    );
    return data;
  } catch (e) {
    throw e;
  }
};

const getGraphData = async (gameId: any, ticker: any) => {
  // console.info('ticker', ticker)
  try {
    const data = await axios.get(
      `https://analytics.useblitz.com/bi/getData.jsp`
        + `?gameId=${gameId}&ticker=${encodeURIComponent(ticker)}`
    );
    return data;
  } catch (e) {
    throw e;
  }
};

// todo move to constants file
const constants = {
  graph: {
    // colors: ['blue', 'red', 'green', 'orange'],
    colors: ['rgb(72, 144, 232)', 'red', 'rgb(72, 232, 129)', 'orange', 'blue', '#b9709f', '#218d8f', '#70cdbf','#000000', '#cf7d45', '#63741e', '#2a2014', '#120ba2', '#473287', '#cd093f', '#64bb35', '#1a559e', '#9e9c66', '#b18820', '#a1431c', '#b62e94', '#63abc2', '#546f33', '#e6c646', '#870ce0', '#3fcf71', '#67154c', '#a22db0', '#01c5f3', '#eca8ec'],
    exporting: {
      enabled: true
    },
    legend: {
      enabled: true
    },
    valueDecimals: 2,
    xAxis: {
      type: 'datetime',
      gridLineWidth: 0,
      ordinal: false
    },
    yAxis: {
      min: 0
    },
    rangeSelector: {
      selected: 8,
      // y: 40,
      inputEnabled: false,
      buttons: [
        {
          type : 'hour',
          count : 1,
          text : '1h'
        }, {
          type : 'hour',
          count : 6,
          text : '6h'
        }, {
          type : 'hour',
          count : 12,
          text : '12h'
        }, {
          type : 'day',
          count : 1,
          text : '1d'
        }, {
          type : 'day',
          count : 2,
          text : '2d'
        }, {
          type : 'day',
          count : 3,
          text : '3d'
        }, {
          type : 'week',
          count : 1,
          text : '1w'
        }, {
          type : 'week',
          count : 2,
          text : '2w'
        }, {
          type : 'month',
          count : 1,
          text : '1m'
        },{
          type : 'month',
          count : 2,
          text : 'all'
        },
        // {
        //   type : 'month',
        //   count : 3,
        //   text : '3m'
        // },
        // {
        //   type : 'month',
        //   count : 6,
        //   text : '6m'
        // },
        // {
        //   type : 'year',
        //   count : 1,
        //   text : '1y'
        // },
        // {
        //   type : 'all',
        //   text : 'All'
        // },
      ],
      buttonTheme: { // styles for the buttons
        fill: '#f7f7f7',
        stroke: 'none',
        'stroke-width': 0,
        r: 4,
        style: {
          color: '#000',
          fontWeight: 'bold',
        },
        states: {
          hover: {
          },
          select: {
            fill: 'rgb(72, 144, 232)',
            style: {
              color: 'white'
            }
          }
          // disabled: { ... }
        }
      },
      height: 40
    },
    credits: {
      enabled: false
    },
  },
}


interface IChart {
  type: string;
  gameId: number;
  chartName: string;
  chartTag: string;
  divchartTag: string;
  tickerId: number | string;
  refreshGraph?: boolean;
  isTopK: boolean;
  tickerNames: Array<string>;
  tickerTags: Array<string>;
  multipliers: Array<number>;
  axisdrifts: any;
  // axisdrifts: Array<number>;
  prefix: string;
  decimals?: number;
}

/** Makes API call and draws chart based on data passed by props. */
const Chart: FC<IChart> = ({
  type,
  gameId,
  tickerId,
  chartName,
  chartTag,
  divchartTag,
  refreshGraph,
  isTopK,
  tickerTags,
  tickerNames,
  multipliers,
  axisdrifts,
  prefix,
  decimals = 2
}) => {

  // acquires highchart's instance from window
  const Highcharts = (window as any).Highcharts;
  const [seriesData, setSeriesData] = useState<any>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [tickersObject, setTickersObject] = useState<any>({});
  const {selectedApp, selectedGame } = useAppSelector(state => state.gameConfigForm);

  const dispatch = useAppDispatch();
  const { chartInfo } = useAppSelector(state => state.globalSlice);

  useEffect(() => {
    populateDataGraphs();
  }, []);

  useEffect(() => {
    setSeriesData([]);
    setTickersObject({});
    setIsLoading(true);
    populateDataGraphs();
  }, [prefix, gameId, selectedGame]);

  useEffect(() => {
    if (chartInfo.forceChartRefresh) {
      dispatch(setChartInfo({ ...chartInfo, forceChartRefresh: false }));
      setSeriesData([]);
      setTickersObject({});
      setIsLoading(true);
      populateDataGraphs();
    }
  }, [chartInfo]);

  useEffect(() => {
    // console.info('tickersObject', tickersObject)
    if (Object.keys(tickersObject).length > 0) {
      Object.keys(tickersObject).map(tt => {
        callGetGraphData(gameId, tt);
      });
    }
  }, [tickersObject]);

  /**
   * Calling render Graph only once
   */
  useEffect(() => {
    if (
      seriesData.length !== 0
      && seriesData.length === Object.keys(tickersObject).length
    ) {
      renderGraph();
    }
  }, [seriesData])

  /**
   * Gets ticker tags and names from gameId and chart tag.
   */
  const populateDataGraphs = async () => {
    // console.info('prefix', prefix)
    try {
      setIsLoading(true);
      if (isTopK) {
        const { data: { tickerTags, tickerNames } } = await getGraphTags(gameId, chartTag.replace(/<pre>/g, prefix));
        if (tickerTags && tickerNames) {
          buildTickersObject(tickerTags, tickerNames, multipliers, axisdrifts);
        }
      }
      else {
        const object: any = {};
        for (let i = 0; i < tickerTags.length; i++) {
          let tagActual = tickerTags[i].replace(/<pre>/g, prefix)
          // console.info('tagActual', tagActual);
          object[tagActual] = {};
          object[tagActual].name = tickerNames[i];
          object[tagActual].multiplier = multipliers[i];
          object[tagActual].axisdrift = axisdrifts[i];
        }
        setTickersObject(object);
      }
    } catch (e) {
      setIsLoading(false);
      console.error(e);
    }
  };

  const buildTickersObject = (tickerTags: any, tickerNames: any, multipliers: any, axisdrifts: any) => {
    tickerTags = tickerTags.split(',');
    tickerNames = tickerNames.split(',');
    if (tickerTags.length !== tickerNames.length) {
      return {};
    }
    const object: any = {};
    for (let i = 0; i < tickerTags.length; i++) {
      object[tickerTags[i]] = {};
      object[tickerTags[i]].name = tickerNames[i];
      object[tickerTags[i]].multiplier = multipliers[i];
      object[tickerTags[i]].axisdrift = axisdrifts[i];
    }
    setTickersObject(object);
  };

  /**
   * Gets graph data for given game id and ticker
   * @param {number} gameId - game id
   * @param {string} ticker - ticker
   */
  const callGetGraphData = async (gameId: number, ticker: string) => {
    try {
      let { data } = await getGraphData(gameId, ticker);
      const september1 = 1630454400;
      const october31 = 1635724799;
      if (data && selectedGame === CONSTANTS.MISC.SAMPLE_GAME) {
        // filter data only for period 1/9/2021 - 31/10/2021 for sample app
        // console.info('pre', data);
        data = data
          .split('\n')
          .filter((line: string) => line.includes(','))
          .map((line: string) => line.split(','))
          .map((s: string[]) => s.map(ss => parseInt(ss)))
          .filter((a: number[]) => a[0] >= september1 && a[0] <= october31)
          .map((a: number[]) => a.join(','))
          .join('\n')
        // console.info('pos', data);
      }
      const lines = data.split('\n');
      let graphData: any = [];
      graphData = [...graphData, ...lines.map((line: string) => line.split(','))].sort();
      appendGraphData(graphData, ticker);
    } catch (e) {
      console.error(e);
    }
  };

  const appendGraphData = (graphData: any[], ticker: string) => {
    let modifiedData: any = [];
    graphData.forEach((point: string | any[]) => {
      if (point.length !== 1) {
        modifiedData.push([(point[0] - tickersObject[ticker].axisdrift ) * 1000, Number(point[1])* tickersObject[ticker].multiplier]);
      }
    });
    modifiedData = modifiedData.sort();
    const series = {
      name: tickersObject[ticker].name,
      data: modifiedData,
      tooltip: {
        valueDecimals: decimals
      }
    };
    setSeriesData((prevData: any) => [...prevData, series]);
  }

  const renderGraph = () => {
    setIsLoading(false);
    try {
    Highcharts.stockChart(`graph-container-${divchartTag}`, {
      chart: {
        type: type || 'spline',
        height: 500,
        borderWidth: 0,
        alignTicks: false,
        renderTo: divchartTag,
        // plotBackgroundColor: '#cccccc',
        style: {}
      },
      navigation: {
        menuStyle: {
          'background': '#000000'
        }
      },
      time: {
        useUTC: false
      },
      series: seriesData,
      ...constants.graph
    });
    } catch (e) {
      console.error('stockChart not available');
    }
  };

  const refresh = () => {
    if (refreshGraph) {
      setSeriesData([]);
      setTickersObject({});
      setIsLoading(true);
      populateDataGraphs();
    }
    return;
  };

  return (
    <div className="graph">
      <Typography variant="h6">{chartName}</Typography>
      <div className="center-items">
        {isLoading && <Loader />}
      </div>

      <div className='chart-wrapper'>
        <GraphContainer id={`graph-container-${divchartTag}`} className={`${selectedApp === CONSTANTS.MISC.SAMPLE_APP ? 'show-watermark' : ''}`} style={{ visibility: isLoading ? 'hidden' : 'visible'}}></GraphContainer>
      </div>
      <div className="flex center-items">
        {(refreshGraph && !isLoading) &&
          <Tooltip title="Refresh">
            <IconButton
              onClick={refresh}
            >
              <RefreshCcw />
            </IconButton>
          </Tooltip>
        }
      </div>
    </div>
  );
};

export default Chart;

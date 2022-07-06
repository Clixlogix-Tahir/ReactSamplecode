/* eslint-disable react-hooks/exhaustive-deps */
import {
  Grid,
  Card as MuiCard,
} from '@material-ui/core';
import styled from 'styled-components';
import { spacing } from "@material-ui/system";
import React from 'react';
import {
  useAppRedirect,
  useAppSelector
} from '../../../common/hooks';
import AppManagement from '..';
import XpConfig from './xp-config';
import LevelConfig from './level-config';
import { CONSTANTS, ROUTES, URL_PART_APP_ID } from '../../../common/constants';


const Card = styled(MuiCard)`
  ${spacing};
  box-shadow: none;
`;

const Shadow = styled.div`
  box-shadow: ${props => props.theme.shadows[1]};
`;


const AppXpAndRewards: React.FC<any> = () => {
  const changeRoute = useAppRedirect();
  const { selectedApp } = useAppSelector(state => state.gameConfigForm);

  React.useEffect(() => {
    if (selectedApp && selectedApp !== CONSTANTS.MISC.SAMPLE_APP) {
      let url = ROUTES.APP_XP_AND_REWARDS.replace(URL_PART_APP_ID, selectedApp) + window.location.search;
      changeRoute(url);
    }
  }, [selectedApp]);

  return (
    <AppManagement>

      <Grid container spacing={6} style={{ marginTop: 12 }}>
        <Grid item xs={12} sm={12}>
          <Shadow>
            <Card>
              <XpConfig />
            </Card>
          </Shadow>
        </Grid>
      </Grid>

      <Grid container spacing={6} style={{ marginTop: 12 }}>
        <Grid item xs={12} sm={12}>
          <Shadow>
            <Card>
              {<LevelConfig />}
            </Card>
          </Shadow>
        </Grid>
      </Grid>

    </AppManagement>
  );
}

export default AppXpAndRewards;

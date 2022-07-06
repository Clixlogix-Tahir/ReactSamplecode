import { Button, Typography } from '@material-ui/core';
import React from 'react';
import styled from 'styled-components';
import { ROUTES, URL_PART_APP_ID, XHR_STATE } from '../../common/constants';
import { useAppRedirect, useAppSelector, useShouldShowPlaceholder } from '../../common/hooks';
import NoAppPlaceholder from '../../components/no-app-placeholder';
import { EEventCategory } from '../../types/eventTypes';

const Container = styled.div`
  display: flex;
  min-height: calc(100vh - 64px - 62px - 40px);
  align-items: center;
  justify-content: center;
  text-align: center;
  & .MuiButton-root {
    width: 230px;
    margin: 1rem;
  }
  & .MuiButton-label {
    flex-direction: column;
    & div {
      font-weight: normal;
      text-align: center;
    }
  }
`;

function ChooseEventType(props: any) {
  const redirectTo = useAppRedirect();
  const shouldShowPlaceholder = useShouldShowPlaceholder();
  const { apps, selectedApp } = useAppSelector(state => state.gameConfigForm);

  return (
    <Container>
      {shouldShowPlaceholder &&
        apps.loading !== XHR_STATE.IN_PROGRESS &&
        <NoAppPlaceholder
          imageUrl={'https://assets.onclixlogix-samplecode.com/website/img/icons/illustration-calendar.svg'}
          text={'You can set up your Live-ops events here. To see the events create a new app.'}
        />
      }
      {!shouldShowPlaceholder &&
      <div className="btns-container">
        <Typography variant="h1">Choose Event Type</Typography>
        <Button
          variant="contained"
          color="primary"
          size="large"
          // component="a"
          onClick={e => redirectTo(ROUTES.CREATE_EVENT.replace(URL_PART_APP_ID, selectedApp) + '?type=' + EEventCategory.BATTLE)}
        >
          Battle
          <div>1 vs 1</div>
        </Button>
        <Button
          variant="contained"
          color="primary"
          size="large"
          // component="a"
          onClick={e => redirectTo(ROUTES.CREATE_EVENT.replace(URL_PART_APP_ID, selectedApp) + '?type=' + EEventCategory.TOURNAMENT)}
        >
          FFA Tournament
          <div>Free for All</div>
        </Button>
        <Button
          variant="contained"
          color="primary"
          size="large"
          // component="a"
          onClick={e => redirectTo(ROUTES.CREATE_EVENT.replace(URL_PART_APP_ID, selectedApp) + '?type=' + EEventCategory.MULTI_ENTRY_TOURNAMENT)}
        >
          Multi-entry Tournament
          <div>subtitle</div>
        </Button>
        <Button
          variant="contained"
          color="primary"
          size="large"
          // component="a"
          onClick={e => redirectTo(ROUTES.CREATE_EVENT.replace(URL_PART_APP_ID, selectedApp) + '?type=' + EEventCategory.SALE)}
        >
          Nudge
          <div>Sale popups, etc.</div>
        </Button>
        <Button
          variant="contained"
          color="primary"
          size="large"
          // component="a"
          onClick={e => redirectTo(ROUTES.CREATE_EVENT.replace(URL_PART_APP_ID, selectedApp) + '?type=' + EEventCategory.ELIMINATION)}
        >
          Elimination Bracket
          <div>subtitle</div>
        </Button>
      </div>
      }
    </Container>
  );
}

export default ChooseEventType;

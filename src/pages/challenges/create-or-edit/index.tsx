/* eslint-disable react-hooks/exhaustive-deps */
import {
  Card as MuiCard,
  CardContent,
  Grid,
  Typography
} from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import { spacing } from "@material-ui/system";
import produce from '@reduxjs/toolkit/node_modules/immer';
import React from 'react';
import { useParams, useRouteMatch } from 'react-router-dom';
import styled from 'styled-components';
import { EVENT_URL_PARAMS } from '../../../common/common-types';
import {
  CONSTANTS,
  ROUTES,
  URL_PART_APP_ID,
  XHR_STATE
} from '../../../common/constants';
import {
  useAppDispatch,
  useAppRedirect,
  useAppSelector,
  useDefaultRealCurrency,
  useDefaultVCurrency2,
  useUrlQuery,
  useValidVCurrencies
} from '../../../common/hooks';
import { GenericPage } from '../../../common/utils';
import Loader from '../../../components/Loader';
import {
  ChallengesDispatchers,
  defaultChallengeForm,
  defaultChallengeFormForCrypto,
  setChallengeForm,
  setMutateMode
} from '../challenges-slice';
import {
  TChallenge,
  TChallengeForm,
  TChallengeRewardFields
} from '../challenges-types';
import { toChallengeForm } from '../converter';
import ChallengesSnackbars from './challenges-snackbars';
import SectionChallengeBasicConfig from './section-challenge-basic-config';
import SectionChallengeDaily from './section-challenge-daily';
import SectionChallengeRewards from './section-challenge-rewards';
import SectionChallengeSeasons from './section-challenge-seasons';

type TChallengesProps = {
  challenge?: TChallenge
};

export const Card = styled(MuiCard)`
  ${spacing};

  box-shadow: none;
`;

export const Shadow = styled.div`
  box-shadow: ${props => props.theme.shadows[1]};
`;

function CreateOrEditChallenge(props : TChallengesProps) {
  const dispatch = useAppDispatch();
  const searchQuery = useUrlQuery();
  const route = useRouteMatch();
  const redirectTo = useAppRedirect();
  const { selectedApp, isSelectedAppCrypto } = useAppSelector(state => state.gameConfigForm);
  const {
    challenge,
    challenges,
    mutateMode
  } = useAppSelector(state => state.challengesSlice);
  // const [challenge, setChallenge] = React.useState<undefined | TChallenge>(undefined);
  // const [challenge, setChallenge] = React.useState<undefined | TChallengeForm>(undefined);
  const setChallenge = (form: TChallengeForm) => {
    dispatch(setChallengeForm(form));
  }
  const searchParams: { appId: string; challengeId: string } = useParams();
  const modeFromUrl = searchQuery.get(EVENT_URL_PARAMS.mode);
  const validVCurrencies = useValidVCurrencies(selectedApp);
  // const defaultVCurrency = useDefaultVCurrency(selectedApp);
  const defaultVCurrency = useDefaultVCurrency2();
  const defaultRealCurrency = useDefaultRealCurrency();
  console.info('defaultVCurrency', defaultVCurrency);
  const shouldBeDisabled = React.useMemo(() =>
    challenge &&
    mutateMode !== 'Create' &&
    (
      mutateMode === 'View' ||
      challenge.seasonChallengeStatus === null 
      // ||
      // (
      //   mutateMode === 'Edit' &&
      //   ![
      //     ESeasonChallengeStatus.endedFully,
      //     ESeasonChallengeStatus.notStartedInVisible
      //   ].includes(challenge.seasonChallengeStatus.value)
      // )
    )
  , [mutateMode, challenge]);

  React.useEffect(() => {
    if (selectedApp && selectedApp !== CONSTANTS.MISC.SAMPLE_APP) {
      dispatch(ChallengesDispatchers.getChallenges(selectedApp));
      if ((route.params as any).appId !== selectedApp) {
        redirectTo(`${(mutateMode === 'Edit' ? route.path : ROUTES.CREATE_CHALLENGE).replace(URL_PART_APP_ID, selectedApp)}?${searchQuery}`);
      }
    }
  }, [selectedApp]);

  React.useEffect(() => {
    dispatch(setMutateMode('Create'));
    let found: undefined | TChallenge = challenges.challengesList.find(c => c.id === parseInt(searchParams.challengeId));
    if (found) {
      dispatch(setMutateMode('Edit'));
    }
    if (modeFromUrl === EVENT_URL_PARAMS.modeValue) {
      dispatch(setMutateMode('View'));
    }
    if (searchQuery.get('cloneId')) {
      // find and set event for cloning
      found = challenges.challengesList.find(c => c.id === parseInt(searchQuery.get('cloneId') || '-1'));
      if (found) {
        setChallenge(toChallengeForm(found, defaultVCurrency, validVCurrencies));
      } else {
        console.warn('challenge not found for cloning; cloning default challenge');
        if( isSelectedAppCrypto ){
          setChallenge({ ...defaultChallengeFormForCrypto(defaultVCurrency, defaultRealCurrency) });
        } else {
          setChallenge(defaultChallengeForm(defaultVCurrency));
        }
      }
      dispatch(setMutateMode('Clone'));
    // } else if (route.path === ROUTES.CREATE_CHALLENGE.replace(URL_PART_APP_ID, selectedApp)) {
    } else if (route.path.startsWith('/create-challenge')) {
      dispatch(setMutateMode('Create'));
      setChallenge(produce( isSelectedAppCrypto ? defaultChallengeFormForCrypto(defaultVCurrency, defaultRealCurrency) : defaultChallengeForm(defaultVCurrency), copy => {
        copy.appId.value = selectedApp;
        const replace = (reward: unknown) => {
          (reward as TChallengeRewardFields).currencyType.value = defaultVCurrency;
        };
        copy.rewardsDashboard.forEach(rd => {
          rd.rewardsList.forEach(replace);
        });
        copy.dailyChallengeList.forEach(list => {
          list.forEach(list2 => {
            list2.challengeLevelsList.forEach(list3 => {
              list3.rewardsList.forEach(replace);
            });
          });
        });
        copy.seasonChallengeList.forEach(sc => {
          sc.challengeLevelsList.forEach(cll => {
            cll.rewardsList.forEach(replace);
          })
        });
      }));
    } else if (selectedApp && !challenges.challengesList.find(c => c.id === parseInt(searchParams.challengeId))) {
      console.warn('challenge not found for selected app');
    }
  }, [selectedApp, challenges.challengesList]);
  React.useEffect(() => {
    const found = challenges.challengesList.find(challenge => challenge.id === parseInt(searchParams.challengeId));
    if (found) {
      setChallenge(toChallengeForm(found, defaultVCurrency, validVCurrencies));
    }
  }, [challenges]);

  const formSubmit = (e: React.FormEvent) => {
    // todo
  };

  return (
    <div>
      <GenericPage>
        <Typography variant="h1">{mutateMode} Challenge</Typography>
        {challenges.loading === XHR_STATE.IN_PROGRESS && <Loader />}
        {(!challenge && challenges.loading !== XHR_STATE.IN_PROGRESS) &&
          <Alert severity="error">not found</Alert>
        }
        {challenge &&
          <form
            noValidate
            onSubmit={e => formSubmit(e)}
          >
            <Grid container spacing={6}>

              <Grid item xs={12} sm={6}>
                <Shadow>
                  <Card px={6} py={6}>
                    <CardContent>
                      <Typography variant="h2">Basic Configuration</Typography>
                      <SectionChallengeBasicConfig
                        shouldBeDisabled={shouldBeDisabled}
                        defaultVirtualCurrency={defaultVCurrency}
                      />
                    </CardContent>
                  </Card>
                </Shadow>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Shadow>
                  <Card px={6} py={6}>
                    <CardContent>
                      <Typography variant="h2">Rewards</Typography>
                      <SectionChallengeRewards
                        shouldBeDisabled={shouldBeDisabled}
                        defaultVirtualCurrency={defaultVCurrency}
                      />
                    </CardContent>
                  </Card>
                </Shadow>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Shadow style={{ marginTop: 24 }}>
                  <Card px={6} py={6}>
                    <CardContent>
                      <Typography variant="h2">Daily Challenges</Typography>
                      <SectionChallengeDaily
                        shouldBeDisabled={shouldBeDisabled}
                        defaultVirtualCurrency={defaultVCurrency}
                      />
                    </CardContent>
                  </Card>
                </Shadow>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Shadow style={{ marginTop: 24 }}>
                  <Card px={6} py={6}>
                    <CardContent>
                      <Typography variant="h2">Seasons</Typography>
                      <SectionChallengeSeasons
                        shouldBeDisabled={shouldBeDisabled}
                        defaultVirtualCurrency={defaultVCurrency}
                      />
                    </CardContent>
                  </Card>
                </Shadow>
              </Grid>

            </Grid>
          </form>
        }
      </GenericPage>
      <ChallengesSnackbars />
    </div>
  );
}

export default CreateOrEditChallenge;

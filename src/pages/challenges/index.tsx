/* eslint-disable react-hooks/exhaustive-deps */
import {
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography
} from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import React from 'react';
import { Plus } from 'react-feather';
import { CONSTANTS, ROUTES, URL_PART_APP_ID, XHR_STATE } from '../../common/constants';
import {
  useAppDispatch,
  useAppSelector,
  useAppRedirect,
  useShouldShowPlaceholder
} from '../../common/hooks';
import { HeightConstrainedSection } from '../../common/utils';
import globalStyles from '../../theme/globalStyles';
import ChallengeRow from './challenge-row';
import { ChallengesDispatchers } from './challenges-slice';
import ChallengesSnackbars from './create-or-edit/challenges-snackbars';
import NoAppPlaceholder from '../../components/no-app-placeholder';

type TChallengesProps = {
};

function Challenges(props : TChallengesProps) {
  const dispatch = useAppDispatch();
  const globalClasses = globalStyles();
  const redirectTo = useAppRedirect();
  const shouldShowPlaceholder = useShouldShowPlaceholder();
  const { apps, selectedApp } = useAppSelector(state => state.gameConfigForm);
  const { challenges } = useAppSelector(state => state.challengesSlice);
  const { challengesList } = challenges;

  React.useEffect(() => {
    if (selectedApp && selectedApp !== CONSTANTS.MISC.SAMPLE_APP) {
      dispatch(ChallengesDispatchers.getChallenges(selectedApp));

      redirectTo(ROUTES.CHALLENGES.replace(URL_PART_APP_ID, selectedApp));

    }
  }, [selectedApp]);

  return (
    <div>
      {shouldShowPlaceholder &&
        apps.loading !== XHR_STATE.IN_PROGRESS &&
        <NoAppPlaceholder
          imageUrl={'https://assets.onclixlogix-samplecode.com/website/img/icons/illustration-battle.svg'}
          text={'You can set up your Challenges here. To see the Challenges, create a new app.'}
        />
      }

      {!shouldShowPlaceholder &&
      <React.Fragment>

      <div className={globalClasses.spaceBetween}>
        <Typography variant="h1">Challenges</Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => redirectTo(ROUTES.CREATE_CHALLENGE.replace(URL_PART_APP_ID, selectedApp))}
          style={{ borderRadius: 0 }}
        >
          <Plus style={{ marginRight: 10 }} /> Create
        </Button>
      </div>
      <Paper>
        <HeightConstrainedSection>
          {challenges.challengesList &&
            <TableContainer className={globalClasses.customScrollbar}>
              <Table aria-label="Challenges table" size="small" stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell>Start</TableCell>
                    <TableCell>Next Start</TableCell>
                    <TableCell>Duration</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Currency</TableCell>
                    <TableCell>Daily Challenges</TableCell>
                    <TableCell>Season Challenges</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {/* todo implement pagination */}
                  {challenges.loading !== XHR_STATE.IN_PROGRESS && challengesList.length === 0 &&
                    <TableRow>
                      <TableCell colSpan={10}>
                        <Alert severity="info">No challenges yet.</Alert>
                      </TableCell>
                    </TableRow>
                  }
                  {challenges.loading === XHR_STATE.IN_PROGRESS &&
                    <TableRow>
                      <TableCell colSpan={10}>Loading...</TableCell>
                    </TableRow>
                  }
                  {challengesList.map(challenge =>
                    <ChallengeRow
                      key={`challenge-${challenge.id}`}
                      challenge={challenge}
                    />
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          }
        </HeightConstrainedSection>
      </Paper>
      <ChallengesSnackbars />
      </React.Fragment>
      }
    </div>
  );
}

export default Challenges;

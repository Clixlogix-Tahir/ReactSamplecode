import { Snackbar } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import React from 'react';
import { XHR_STATE } from '../../../common/constants';
import {
  useAppDispatch,
  useAppSelector
} from '../../../common/hooks';
import { ChallengesDispatchers } from '../challenges-slice';

type TChallengesSnackbarsProps = {};

function ChallengesSnackbars(props: TChallengesSnackbarsProps) {
  const dispatch = useAppDispatch();
  const {
    creatingChallenge,
    updatingChallenge,
    deletingChallenge
  } = useAppSelector(state => state.challengesSlice);

  const onGetSuccessClose = () => {
    dispatch(ChallengesDispatchers.clearLoading('creatingChallenge'));
  };

  const onGetErrorClose = () => {
    dispatch(ChallengesDispatchers.clearError('creatingChallenge'));
  };

  const onUpdateSuccessClose = () => {
    dispatch(ChallengesDispatchers.clearLoading('updatingChallenge'));
  };

  const onUpdateErrorClose = () => {
    dispatch(ChallengesDispatchers.clearError('updatingChallenge'));
  };

  const onDeleteSuccessClose = () => {
    dispatch(ChallengesDispatchers.clearLoading('deletingChallenge'));
  };

  const onDeleteErrorClose = () => {
    dispatch(ChallengesDispatchers.clearError('deletingChallenge'));
  };

  return (
    <React.Fragment>
      <Snackbar
        open={creatingChallenge.loading === XHR_STATE.COMPLETE && !creatingChallenge.error}
        autoHideDuration={3000}
        onClose={onGetSuccessClose}
      >
        <Alert severity="success"onClose={onGetSuccessClose}>Created challenge with ID <strong>{creatingChallenge.response?.id}</strong> successfully!</Alert>
      </Snackbar>
      <Snackbar
        open={Boolean(creatingChallenge.error)}
        autoHideDuration={4000}
        onClose={onGetErrorClose}
      >
        <Alert severity="error" onClose={onGetErrorClose}>
          Creating challenge failed.&nbsp;
          {creatingChallenge.error} <span role="img" aria-label="error emoji">😵</span>
        </Alert>
      </Snackbar>

      <Snackbar
        open={updatingChallenge.loading === XHR_STATE.COMPLETE && !updatingChallenge.error}
        autoHideDuration={3000}
        onClose={onUpdateSuccessClose}
      >
        <Alert severity="success"onClose={onUpdateSuccessClose}>Updated challenge successfully!</Alert>
      </Snackbar>
      <Snackbar
        open={Boolean(updatingChallenge.error)}
        autoHideDuration={4000}
        onClose={onUpdateErrorClose}
      >
        <Alert severity="error" onClose={onUpdateErrorClose}>
          Updating challenge failed.&nbsp;
          {updatingChallenge.error} <span role="img" aria-label="error emoji">😵</span>
        </Alert>
      </Snackbar>

      <Snackbar
        open={deletingChallenge.loading === XHR_STATE.COMPLETE && !deletingChallenge.error}
        autoHideDuration={3000}
        onClose={onDeleteSuccessClose}
      >
        <Alert severity="success"onClose={onDeleteSuccessClose}>Deleted challenge successfully!</Alert>
      </Snackbar>
      <Snackbar
        open={Boolean(deletingChallenge.error)}
        autoHideDuration={4000}
        onClose={onDeleteErrorClose}
      >
        <Alert severity="error" onClose={onDeleteErrorClose}>
          Deleting challenge failed.&nbsp;
          {deletingChallenge.error} <span role="img" aria-label="error emoji">😵</span>
        </Alert>
      </Snackbar>
    </React.Fragment>
  );
}

export default ChallengesSnackbars;

import {
  Button,
  Paper,
  Snackbar,
  Typography
} from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import React, {
  FormEvent,
  useState
} from 'react';
import { useHistory } from 'react-router';
import { ROUTES, URL_PART_APP_ID, XHR_STATE } from '../../common/constants';
import {
  useAppDispatch,
  useAppSelector
} from '../../common/hooks';
import HandyDialog from '../../components/HandyDialog';
import globalStyles from '../../theme/globalStyles';
import { userApiDispatchers } from './userSlice';

function DeleteUser(props: any) {
  const classes = globalStyles();
  // const pvtClasses = privateClasses();
  const dispatch = useAppDispatch();
  const history = useHistory();
  const userErrorText = 'User ID is required.';
  // const [userIdForDelete, setUserIdForDelete] = useState('');
  const [deleteUserError, setDeleteUserError] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showResetConfirmation, setShowResetConfirmation] = useState(false);
  const [showResetSuccess, setShowResetSuccess] = useState(false);
  const [showResetError, setShowResetError] = useState(false);
  const { searchByCriteria, resetProfilePic } = useAppSelector(state => state.userSlice);
  const { selectedApp } = useAppSelector(state => state.gameConfigForm);
  const { user } = searchByCriteria;

  const deleteUserClick = (event: FormEvent) => {
    event.preventDefault();
    if (!user?.appUserDto.user.id) {
      setDeleteUserError(userErrorText);
      return;
    }
    setShowConfirmation(true);
  };

  const resetProfilePicClick = (event: FormEvent) => {
    event.preventDefault();
    setShowResetConfirmation(true);
  };

  const deleteUserProceed = () => {
    if (user?.appUserDto.user.id) {
      dispatch(userApiDispatchers.deleteUser(
        user.appUserDto.user.id,
        () => {
          history.push(ROUTES.USERS.replace(URL_PART_APP_ID, selectedApp));
        }
      ));
    } else {
      console.warn('deleteUserProceed userId not found')
    }
  };

  const resetProfilePicProceed = () => {
    if (user?.appUserDto.user.id) {
      dispatch(userApiDispatchers.resetProfilePic(
        user.appUserDto.user.id,
        () => {
          setShowResetConfirmation(false);
          setShowResetSuccess(true);
        },
        () => {
          setShowResetError(true);
        }
      ));
    } else {
      console.warn('deleteUserProceed userId not found')
    }
  };

  return (
    <Paper className={classes.paperRoot} style={{ marginTop: 24 }}>
      <form>
        {/* <TextField
          id="user-id-for-delete"
          label="User ID"
          value={userIdForDelete}
          error={Boolean(deleteUserError)}
          helperText={deleteUserError}
          onChange={(e: React.ChangeEvent<{ value: unknown }>) => {
            setUserIdForDelete(e.target.value as string);
            setDeleteUserError(!e.target.value ? userErrorText : '')
          }}
        /> */}
        <Typography variant="body1" style={{ color: 'red' }}>{deleteUserError}</Typography>
        <Button
          variant="contained"
          color="primary"
          type="button"
          onClick={deleteUserClick}
          disabled={Boolean(deleteUserError)}
          style={{ marginRight: '1rem' }}
        >
          Delete User
        </Button>
        <Button
          variant="contained"
          color="primary"
          type="button"
          onClick={resetProfilePicClick}
          disabled={resetProfilePic.loading === XHR_STATE.IN_PROGRESS}
        >
          Reset Profile Pic
        </Button>
        {resetProfilePic.error && <p style={{ color: 'red' }}>resetProfilePic.error</p>}
      </form>

      <HandyDialog
        open={showConfirmation}
        title="Delete User Confirmation"
        content={
          <Typography>Are you sure you want to delete user with username <strong>{user?.appUserDto.user.userName}</strong>?</Typography>
        }
        onClose={() => setShowConfirmation(false)}
        onCancelClick={() => setShowConfirmation(false)}
        onOkClick={deleteUserProceed}
        cancelText="Go Back"
        okText="Delete User"
      />

      <HandyDialog
        open={showResetConfirmation}
        title="Reset Profile Pic Confirmation"
        content={
          <Typography>Are you sure you want to reset profile pic of username <strong>{user?.appUserDto.user.userName}</strong>?</Typography>
        }
        onClose={() => setShowResetConfirmation(false)}
        onCancelClick={() => setShowResetConfirmation(false)}
        onOkClick={resetProfilePicProceed}
        cancelText="Go Back"
        okText="Reset Profile Pic"
        okDisabled={resetProfilePic.loading === XHR_STATE.IN_PROGRESS}
        cancelDisabled={resetProfilePic.loading === XHR_STATE.IN_PROGRESS}
      />

      <Snackbar
        open={showResetSuccess}
        autoHideDuration={4000}
        onClose={() => setShowResetSuccess(false)}
      >
        <Alert severity="success">
          Reset profile pic for username {user?.appUserDto.user.userName} successfully!
        </Alert>
      </Snackbar>

      <Snackbar
        open={showResetError}
        autoHideDuration={4000}
        onClose={() => setShowResetError(false)}
      >
        <Alert severity="error">
          Reset profile pic for username {user?.appUserDto.user.userName} failed!
        </Alert>
      </Snackbar>
    </Paper>
  );
}

export default DeleteUser;
import { Snackbar } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import React, { Fragment } from 'react';
import { XHR_STATE } from '../../../common/constants';
import {
  useAppDispatch, useAppSelector
} from '../../../common/hooks';
import {
  creditVirtualCurrencySetError,
  creditVirtualCurrencySetLoading,
  updateDisplayNameError,
  updateDisplayNameSetLoading,
  updateUserIdSetError,
  updateUserNameSetError,
  updateUserNameSetLoading,
  updateUserRoleSetError,
  updateUserRoleSetLoading
} from '../userSlice';

function UserAccessSnackbars(props: any) {
  const dispatch = useAppDispatch();
  const {
    creditVirtualCurrency,
    updateDisplayName,
    updateUserId,
    updateUserName,
    updateUserRole,
  } = useAppSelector(state => state.userSlice);

  const onSuccessClose = (e: any) => {
    dispatch(creditVirtualCurrencySetLoading(XHR_STATE.ASLEEP));
  };

  const onErrorClose = (e: any) => {
    dispatch(creditVirtualCurrencySetError(''));
  };

  const onUpdateUserIdSuccessClose = () => {
    dispatch(updateUserNameSetLoading(XHR_STATE.ASLEEP));
  };

  const onUpdateUserIdErrorClose = (e: any) => {
    dispatch(updateUserIdSetError(''));
  };

  const onUpdateUserNameSuccessClose = () => {
    dispatch(updateUserNameSetLoading(XHR_STATE.ASLEEP));
  };

  const onUpdateUserNameErrorClose = (e: any) => {
    dispatch(updateUserNameSetError(''));
  };

  const onUpdateUserRoleSuccessClose = () => {
    dispatch(updateUserRoleSetLoading(XHR_STATE.ASLEEP));
  };

  const onUpdateUserRoleErrorClose = (e: any) => {
    dispatch(updateUserRoleSetError(''));
  };

  const onUpdateDisplayNameSuccessClose = () => {
    dispatch(updateDisplayNameSetLoading(XHR_STATE.ASLEEP));
  };

  const onUpdateDisplayNameErrorClose = (e: any) => {
    dispatch(updateDisplayNameError(''));
  };

  return (
    <Fragment>
      <Snackbar
        open={creditVirtualCurrency.loading === XHR_STATE.COMPLETE}
        autoHideDuration={3000}
        onClose={onSuccessClose}
      >
        <Alert severity="success"onClose={onSuccessClose}>Added keys successfully</Alert>
      </Snackbar>
      <Snackbar
        open={Boolean(creditVirtualCurrency.error)}
        autoHideDuration={4000}
        onClose={onErrorClose}
      >
        <Alert severity="error" onClose={onErrorClose}>
          {creditVirtualCurrency.error} <span role="img" aria-label="error emoji">😵</span>
        </Alert>
      </Snackbar>

      <Snackbar
        open={updateUserId.loading === XHR_STATE.COMPLETE}
        autoHideDuration={3000}
        onClose={onUpdateUserIdSuccessClose}
      >
        <Alert severity="success" onClose={onUpdateUserIdSuccessClose}>
          Transferred user successfully. <span role="img" aria-label="error emoji">💯</span>
        </Alert>
      </Snackbar>
      <Snackbar
        open={Boolean(updateUserId.error)}
        autoHideDuration={4000}
        onClose={onUpdateUserIdErrorClose}
      >
        <Alert severity="error" onClose={onUpdateUserIdErrorClose}>
          {updateUserId.error} <span role="img" aria-label="error emoji">😵</span>
        </Alert>
      </Snackbar>

      <Snackbar
        open={updateUserName.loading === XHR_STATE.COMPLETE}
        autoHideDuration={3000}
        onClose={onUpdateUserNameSuccessClose}
      >
        <Alert severity="success"onClose={onUpdateUserNameSuccessClose}>Up
        dated username successfully. <span role="img" aria-label="100 out of 100 emoji">💯</span>
      </Alert>
      </Snackbar>
      <Snackbar
        open={Boolean(updateUserName.error)}
        autoHideDuration={4000}
        onClose={onUpdateUserNameErrorClose}
      >
        <Alert severity="error" onClose={onUpdateUserNameErrorClose}>
          {updateUserName.error} <span role="img" aria-label="error emoji">😣</span>
        </Alert>
      </Snackbar>

      <Snackbar
        open={updateUserRole.loading === XHR_STATE.COMPLETE}
        autoHideDuration={3000}
        onClose={onUpdateUserRoleSuccessClose}
      >
        <Alert severity="success"onClose={onUpdateUserRoleSuccessClose}>Up
        dated user role successfully. <span role="img" aria-label="100 out of 100 emoji">💯</span>
      </Alert>
      </Snackbar>
      <Snackbar
        open={Boolean(updateUserRole.error)}
        autoHideDuration={4000}
        onClose={onUpdateUserRoleErrorClose}
      >
        <Alert severity="error" onClose={onUpdateUserRoleErrorClose}>
          {updateUserRole.error} <span role="img" aria-label="error emoji">😣</span>
        </Alert>
      </Snackbar>

      <Snackbar
        open={updateDisplayName.loading === XHR_STATE.COMPLETE}
        autoHideDuration={3000}
        onClose={onUpdateDisplayNameSuccessClose}
      >
        <Alert severity="success"onClose={onUpdateDisplayNameSuccessClose}>Up
        dated display name successfully. <span role="img" aria-label="done emoji">✅</span>
      </Alert>
      </Snackbar>
      <Snackbar
        open={Boolean(updateDisplayName.error)}
        autoHideDuration={4000}
        onClose={onUpdateDisplayNameErrorClose}
      >
        <Alert severity="error" onClose={onUpdateDisplayNameErrorClose}>
          {updateDisplayName.error} <span role="img" aria-label="error emoji">😣</span>
        </Alert>
      </Snackbar>
    </Fragment>
  );
}

export default UserAccessSnackbars;

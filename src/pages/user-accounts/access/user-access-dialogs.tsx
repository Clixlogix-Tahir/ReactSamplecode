import React, { Fragment } from 'react';
import { URL_SEARCH_KEY_SEARCH_CRITERIA, URL_SEARCH_KEY_SEARCH_TERM } from '../../../common/constants';
import {
  useAppDispatch,
  useAppSelector,
  useUrlQuery
} from '../../../common/hooks';
import HandyDialog from '../../../components/HandyDialog';
import {
  creditVirtualCurrencyDispatcher,
  creditVirtualCurrencySetShowDialog,
  searchByCriteraDispatcher,
  updateDisplayNameDispatcher,
  updateDisplayNameSetShowDialog,
  updateUserIdDispatcher,
  updateUserIdSetShowDialog,
  updateUserNameDispatcher,
  updateUserNameSetShowDialog,
  updateUserRoleDispatcher,
  updateUserRoleSetShowDialog
} from '../userSlice';

function UserAccessDialogs(props: any) {
  const dispatch = useAppDispatch();
  const searchQuery = useUrlQuery();
  const searchCriteria = searchQuery.get(URL_SEARCH_KEY_SEARCH_CRITERIA) || '';
  const searchTerm = searchQuery.get(URL_SEARCH_KEY_SEARCH_TERM) || '';
  const {
    selectedApp
  } = useAppSelector(state => state.gameConfigForm);
  const {
    creditVirtualCurrency,
    searchByCriteria,
    updateDisplayName,
    updateUserId,
    updateUserName,
    updateUserRole,
  } = useAppSelector(state => state.userSlice);
  const user = searchByCriteria.user?.appUserDto || null;

  const addKeys = () => {
    if (user) {
      dispatch(creditVirtualCurrencyDispatcher(
        selectedApp,
        user.user.id,
        {
          resource: creditVirtualCurrency.selectedCurrency,
          count: creditVirtualCurrency.selectedKeyCount,
        }
      ));
    }
  };

  const updateUserNameClick = () => {
    if (user) {
      dispatch(updateUserNameDispatcher(user.user.id, updateUserName.newUserName));
    }
  };

  const updateUserIdClick = () => {
    if (user) {
      dispatch(updateUserIdDispatcher(user.user.id, updateUserId.newUserId));
    }
  };

  const updateUserRoleClick = () => {
    if (user) {
      dispatch(updateUserRoleDispatcher(
        user.user.id,
        updateUserRole.newUserRole,
        () => {
          if (selectedApp && searchCriteria && searchTerm) {
            dispatch(searchByCriteraDispatcher(selectedApp, searchCriteria, searchTerm));
          } else {
            console.warn('cannot find user; search criteria missing');
          }
        }
      ));
    }
  };

  const updateDisplayNameClick = () => {
    if (user) {
      dispatch(updateDisplayNameDispatcher(
        user.user.id,
        updateDisplayName.newFirstName,
        updateDisplayName.newLastName,
        () => {
          if (selectedApp && searchCriteria && searchTerm) {
            dispatch(searchByCriteraDispatcher(selectedApp, searchCriteria, searchTerm));
          } else {
            console.warn('cannot update display name; search criteria missing');
          }
        }
      ));
    }
  };

  return (
    <Fragment>
      <HandyDialog
        open={creditVirtualCurrency.showDialog}
        title="Credit Virtual Currency Confirmation"
        content={
          `Are you sure you want to credit ${creditVirtualCurrency.selectedKeyCount} ${creditVirtualCurrency.selectedCurrency} to user ${user?.user.userName || user?.user.id}?`
        }
        onClose={() => dispatch(creditVirtualCurrencySetShowDialog(false))}
        onOkClick={addKeys}
        onCancelClick={() => dispatch(creditVirtualCurrencySetShowDialog(false))}
        cancelText="Go Back"
        okText="Proceed"
      />

      <HandyDialog
        open={updateUserName.showDialog}
        title="Update Username Confirmation"
        content={
          `Are you sure you want to update username for user ${user?.user.userName || user?.user.id} to ${updateUserName.newUserName}?`
        }
        onClose={() => dispatch(updateUserNameSetShowDialog(false))}
        onOkClick={updateUserNameClick}
        onCancelClick={() => dispatch(updateUserNameSetShowDialog(false))}
        cancelText="Go Back"
        okText="Proceed"
      />

      <HandyDialog
        open={updateUserId.showDialog}
        title="Transfer User Confirmation"
        content={
          `Are you sure you want to transfer user ${user?.user.userName || user?.user.id} to ${updateUserId.newUserId}?`
        }
        onClose={() => dispatch(updateUserIdSetShowDialog(false))}
        onOkClick={updateUserIdClick}
        onCancelClick={() => dispatch(updateUserIdSetShowDialog(false))}
        cancelText="Go Back"
        okText="Proceed"
      />

      <HandyDialog
        open={updateUserRole.showDialog}
        title="Confirmation for Changing User Role"
        content={
          `Are you sure you want to change role for user ${user?.user.userName || user?.user.id} to ${updateUserRole.newUserRole}?`
        }
        onClose={() => dispatch(updateUserRoleSetShowDialog(false))}
        onOkClick={updateUserRoleClick}
        onCancelClick={() => dispatch(updateUserRoleSetShowDialog(false))}
        cancelText="Go Back"
        okText="Proceed"
      />

      <HandyDialog
        open={updateDisplayName.showDialog}
        title="Confirmation for Changing Display Name"
        content={
          `Are you sure you want to change the first and last name for user ${user?.user.userName || user?.user.id}?`
        }
        onClose={() => dispatch(updateDisplayNameSetShowDialog(false))}
        onOkClick={updateDisplayNameClick}
        onCancelClick={() => dispatch(updateDisplayNameSetShowDialog(false))}
        cancelText="Go Back"
        okText="Proceed"
      />
    </Fragment>
  );
}

export default UserAccessDialogs;

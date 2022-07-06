/* eslint-disable react-hooks/exhaustive-deps */
import {
  Button,
  Container,
  createStyles,
  FormControl,
  Grid,
  Input,
  InputLabel,
  Paper,
  Select,
  TextField,
  Theme,
  Typography
} from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import React, { FormEvent, useEffect, useState } from 'react';
import UserAccounts from '..';
import {
  URL_SEARCH_KEY_SEARCH_CRITERIA,
  URL_SEARCH_KEY_SEARCH_TERM,
  XHR_STATE
} from '../../../common/constants';
import {
  useAppDispatch,
  useAppSelector,
  useUrlQuery
} from '../../../common/hooks';
import globalStyles from '../../../theme/globalStyles';
import { ECost } from '../../../types/eventTypes';
import {
  creditVirtualCurrencySetSelectedCurrency,
  creditVirtualCurrencySetSelectedKeyCount,
  creditVirtualCurrencySetShowDialog,
  fetchVirtualWalletDispatcher,
  searchByCriteraDispatcher,
  updateDisplayNameSetFirstName,
  updateDisplayNameSetLastName,
  updateDisplayNameSetShowDialog,
  updateUserIdSetNewUserId,
  updateUserIdSetShowDialog,
  updateUserNameSetShowDialog,
  updateUserNameSetUserName,
  updateUserRoleSetNewUserRole,
  updateUserRoleSetShowDialog
} from '../userSlice';
import { ERegisteredUserRole } from '../userTypes';
import UserAccessDialogs from './user-access-dialogs';
import UserAccessSnackbars from './user-access-snackbars';

const privateStyles = makeStyles((theme: Theme) =>
  createStyles({
    userAccessControls: {
      marginTop: 24,
      '& .MuiGrid-container': {
        alignItems: 'center',
      },
      '& .MuiContainer-root': {
        paddingTop: theme.spacing(8),
        paddingBottom: theme.spacing(8),
      },
      '& .MuiFormControl-root': {
        width: '100%',
      },
    },
  })
);

const UserAccess: React.FC<any> = () => {
  const classes = globalStyles();
  const dispatch = useAppDispatch();
  const privateClasses = privateStyles();
  const searchQuery = useUrlQuery();
  const searchCriteria = searchQuery.get(URL_SEARCH_KEY_SEARCH_CRITERIA) || '';
  const searchTerm = searchQuery.get(URL_SEARCH_KEY_SEARCH_TERM) || '';
  const [keyCounts, setKeyCounts] = useState<number[]>([]);
  const {
    selectedApp,
  } = useAppSelector(state => state.gameConfigForm);
  const {
    creditVirtualCurrency,
    searchByCriteria,
    updateDisplayName,
    updateUserId,
    updateUserName,
    updateUserRole,
    virtualWallet,
  } = useAppSelector(state => state.userSlice);
  const user = searchByCriteria.user?.appUserDto || null;

  useEffect(() => {
    if (selectedApp && searchCriteria && searchTerm) {
      dispatch(searchByCriteraDispatcher(selectedApp, searchCriteria, searchTerm));
    } else {
      console.warn('cannot find user; search criteria missing');
    }
  }, [selectedApp]);

  useEffect(() => {
    if (user) {
      dispatch(fetchVirtualWalletDispatcher(selectedApp, user.user.id));
      dispatch(updateDisplayNameSetFirstName(user?.user.firstName || ''));
      dispatch(updateDisplayNameSetLastName(user?.user.lastName || ''));
    } else {
      console.warn('user is missing');
    }
  }, [user]);

  useEffect(() => {
    setKeyCounts(virtualWallet.vWallet.map(w => 1));
  }, [virtualWallet]);

  const setKeyCountsHandler = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    index: number,
    vCurrency: ECost
  ) => {
    const countsCopy = [...keyCounts];
    const newValue = parseInt(e.target.value as string);
    countsCopy.splice(index, 1, newValue);
    setKeyCounts(countsCopy);
    dispatch(creditVirtualCurrencySetSelectedKeyCount(newValue));
    dispatch(creditVirtualCurrencySetSelectedCurrency(vCurrency));
  };

  const addKeys = (event: FormEvent, vCurrency: ECost) => {
    event.preventDefault();
    dispatch(creditVirtualCurrencySetSelectedCurrency(vCurrency));
    dispatch(creditVirtualCurrencySetShowDialog(true));
  };

  const updateUserNameField = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(updateUserNameSetUserName(e.target.value as string));
  };

  const updateUsername = (event: FormEvent) => {
    event.preventDefault();
    dispatch(updateUserNameSetShowDialog(true));
  };

  const updateUserIdField = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(updateUserIdSetNewUserId(e.target.value as string));
  };

  const transferUser = (event: FormEvent) => {
    event.preventDefault();
    dispatch(updateUserIdSetShowDialog(true));
  };

  const changeAdminStatus = (event: React.ChangeEvent<{ name?: string, value: unknown }>) => {
    dispatch(updateUserRoleSetNewUserRole(event.target.value as ERegisteredUserRole));
  };

  const changeAdminStatusSubmit = (event: FormEvent) => {
    event.preventDefault();
    dispatch(updateUserRoleSetShowDialog(true));
  };

  const changeFirstName = (event: React.ChangeEvent<{ name?: string, value: unknown }>) => {
    dispatch(updateDisplayNameSetFirstName(event.target.value as string));
  };

  const changeLastName = (event: React.ChangeEvent<{ name?: string, value: unknown }>) => {
    dispatch(updateDisplayNameSetLastName(event.target.value as string));
  };

  const updateDisplayNameSubmit = (event: FormEvent) => {
    event.preventDefault();
    dispatch(updateDisplayNameSetShowDialog(true));
  };

  return (
    <UserAccounts>
      <Paper className={`${classes.paperRoot} ${privateClasses.userAccessControls}`}>
        {virtualWallet.vWallet.map((wallet, walletIndex) =>
        <form onSubmit={e => addKeys(e, wallet.currencyType)} key={wallet.id}>
          <Container maxWidth="sm">
            <Grid container spacing={4}>
              <Grid item xs={6}>
                <TextField required type="number"
                  style={{ width: '100%' }}
                  inputProps={{ min: 1, max: 1000 }}
                  label={`Number of ${wallet.currencyType}`}
                  value={keyCounts[walletIndex]}
                  onChange={e => {
                    setKeyCountsHandler(e, walletIndex, wallet.currencyType);
                  }}
                />
              </Grid>
              <Grid item xs={6}>
                <Button type="submit"
                  variant="contained" color="primary"
                  disabled={creditVirtualCurrency.loading === XHR_STATE.IN_PROGRESS}
                >Add {wallet.currencyType}</Button>
              </Grid>
            </Grid>
          </Container>
        </form>)}

        <form onSubmit={updateUsername}>
          <Container maxWidth="sm">
            <Grid container spacing={4}>
              <Grid item xs={6}>
                <TextField required
                  label="Username"
                  value={updateUserName.newUserName}
                  onChange={updateUserNameField}
                />
              </Grid>
              <Grid item xs={6}>
                <Button type="submit"
                  variant="contained" color="primary"
                >Update Username</Button>
              </Grid>
            </Grid>
          </Container>
        </form>

        <form onSubmit={transferUser}>
          <Container maxWidth="sm">
            <Grid container spacing={4}>
              <Grid item xs={6}>
                <TextField required
                  label="New userId"
                  value={updateUserId.newUserId}
                  onChange={updateUserIdField}
                  disabled
                />
              </Grid>
              <Grid item xs={6}>
                <Button type="submit"
                  variant="contained" color="primary"
                  disabled
                >Transfer User</Button>
              </Grid>
            </Grid>
          </Container>
        </form>

        <Container maxWidth="sm"
          component="form"
          onSubmit={changeAdminStatusSubmit}
        >
          <Grid container spacing={4}>
            <Grid item xs={6}>
              <FormControl>
                <InputLabel>Choose New Role</InputLabel>
                <Select native
                  input={<Input name="choose-new-user-role-f" id="choose-new-user-role-field" />}
                  value={updateUserRole.newUserRole}
                  onChange={changeAdminStatus}
                >
                  <option value="" />
                  {Object.keys(ERegisteredUserRole).map(role =>
                    <option value={role} key={role} disabled={user?.user.role === role}>
                      {role}
                    </option>
                  )}
                </Select>
              </FormControl>
              <Typography variant="body1">Current role: {user?.user.role}</Typography>
            </Grid>
            <Grid item xs={6}>
              <Button type="submit"
                variant="contained" color="primary"
                disabled={user?.user.role === updateUserRole.newUserRole}
              >Change Role</Button>
            </Grid>
          </Grid>
        </Container>

        <Container maxWidth="md"
          component="form"
          onSubmit={updateDisplayNameSubmit}
        >
          <Grid container spacing={4}>
            <Grid item xs={6}
              style={{ display: 'flex', justifyContent: 'flex-end' }}
            >
              <TextField required
                style={{ display: 'inline-block', width: 160 }}
                label="First name"
                name="First name"
                value={updateDisplayName.newFirstName}
                onChange={changeFirstName}
              />
              <TextField required
                style={{ display: 'inline-block', width: 160 }}
                label="Last name"
                name="Last name"
                value={updateDisplayName.newLastName}
                onChange={changeLastName}
              />
            </Grid>
            <Grid item xs={6}>
              <Button type="submit"
                variant="contained" color="primary"
              >Upate Display Name</Button>
            </Grid>
          </Grid>
        </Container>
      </Paper>

      <UserAccessDialogs />
      <UserAccessSnackbars />

    </UserAccounts>
  );
};

export default UserAccess;

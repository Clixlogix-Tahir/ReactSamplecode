/* eslint-disable react-hooks/exhaustive-deps */
import {
  Button,
  Checkbox,
  Container,
  createStyles,
  FormControl,
  InputLabel,
  ListItemText,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Theme,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import React, { FormEvent, useEffect, useState } from 'react';
import UserAccounts from '.';
import {
  useAppDispatch,
  useAppSelector
} from '../../common/hooks';
import globalStyles from '../../theme/globalStyles';
import { EbanStateType, EbanDurationType, EbanDurations, EmoderationType } from '../../types/eventTypes';
import { fetchAppsListDispatcher, fetchUserModerationDispatcher, getGameDataDispatcher } from '../game-config/gameConfigSlice';
import DeleteUser from './delete-user';
import { fetchUserModerationFormDispatcher, fetchRevokeBanDispatcher} from './userSlice';
import { Alert } from '@material-ui/lab';

const privateClasses = makeStyles((theme: Theme) =>
  createStyles({
    userModControls: {
      marginTop: 24,
      paddingBottom: theme.spacing(6),
      '& form': {
        display: 'flex',
        flexDirection: 'column',
      },
      '& .MuiButton-root': {
        margin: '1rem auto',
      },
    },
    formControl: {
      minWidth: 150,
      width: '100%',
      margin: '1rem auto',
    },
  })
);

const UserModeration: React.FC<any> = () => {
  const classes = globalStyles();
  const pvtClasses = privateClasses();
  const dispatch = useAppDispatch();
  const { apps, userModeration, selectedApp, gameData } = useAppSelector(state => state.gameConfigForm);
  const { searchByCriteria } = useAppSelector(state => state.userSlice);
  const { userGoogleProfile } = useAppSelector(state => state.globalSlice);
  const companyId = userGoogleProfile && 'companyId' in userGoogleProfile ? userGoogleProfile.companyId : 2;
  const user = searchByCriteria.user?.appUserDto || null;
  
  //existing 'user moderations' data( to be shown in the table)
  const { userModerationData } = userModeration;

  //form controlled fields
  const [restrictionTypes] = useState(Object.entries(EbanStateType));
  const [selectedRestrictionType, setSelectedRestrictionType] = useState<string>('');
  const [moderationTypes] = useState(Object.entries(EmoderationType));
  const [selectedModerationType, setSelectedModerationType] = useState<string>('');
  const [durationTypes] = useState(Object.entries(EbanDurationType));
  const [selectedDurationType, setDurationType] = useState<string>('');
  const [banDurations] = useState(Object.entries(EbanDurations).filter(entry => entry[0] !== 'HUNDRED_YEARS'));
  const [selectedBanDuration, setBanDuration] = useState<string>('');
  const [appsForBan, setAppsForBan] = useState<string[]>(['ALL']);
  const [selectedAppsForBan, setSelectedAppsForBan] = useState<string[]>([]);
  const [displayAppsForBan, setDisplayAppsForBan] = useState<string[]>([]);
  const [gamesInSelectedApps, setGamesInSelectedApps] = useState<{ id: number, appId: string, gameId: string }[]>([]);
  const [selectedGamesForBan, setSelectedGamesForBan] = useState<string[]>([]);
  const [privateNote, setPrivateNote] = useState<string>('');
  const [publicNote, setPublicNote] = useState<string>('');
  const [extraInfo, setExtraInfo] = useState<string>('');

  //fields to disable/enable elements
  const [hideModerationType, setHideModerationType] = useState<boolean>(true);
  const [hideBanDurations, setHideBanDurations] = useState<boolean>(true);
  const [hideGames, setHideGames] = useState<boolean>(true);
  const [isFormValid, setIsFormValid] = useState<boolean>(false);
  const [openAlertDialog, setOpenAlertDialog] = useState<boolean>(false);

  useEffect(() => {
    if (user && selectedApp) {
      dispatch(fetchUserModerationDispatcher(selectedApp, user.user.id));
    }
  }, [user, selectedApp]);

  useEffect(() => {
    if (selectedApp) {
      setAppsForBan([...appsForBan, selectedApp]);
    }
  }, [selectedApp]);

  useEffect(() => {
    dispatch(fetchAppsListDispatcher(companyId));
  }, []);

  useEffect(() => {
    selectedAppsForBan.forEach(appId => dispatch(getGameDataDispatcher(appId)));
  }, [selectedAppsForBan]);

  useEffect(() => { 
    if (gameData.data.length) {
      setGamesInSelectedApps(gamesInSelectedApps => [
        ...gamesInSelectedApps.filter(game =>  selectedAppsForBan.includes(game.appId)),
        ...gameData.data.filter(game =>  selectedAppsForBan.includes(game.appId))
          .map(game => {
            return { id: game.id || -1, appId: game.appId, gameId: game.gameId }
          }).filter(game =>  !Boolean(gamesInSelectedApps.find(selectedGame => selectedGame.id === game.id)))
      ]);
    } else {
      setGamesInSelectedApps([]);
    }
  }, [gameData]);

  useEffect(() => {
    handleFormValidity();
  }, [selectedRestrictionType, selectedModerationType, selectedDurationType, selectedBanDuration, selectedAppsForBan, privateNote, publicNote]);

  const handleFormValidity = () => {

    if (selectedDurationType) {
      if (selectedDurationType === 'PERMANENT') {
        if (selectedRestrictionType && selectedModerationType && selectedAppsForBan && privateNote && publicNote) {
          setIsFormValid(true);
          return;
        }
      } else{
        if (selectedRestrictionType && selectedModerationType && selectedBanDuration && selectedAppsForBan && privateNote && publicNote) {
          setIsFormValid(true);
          return;
        }
      } 
    }
    setIsFormValid(false);
    //Add other form validations too
  }

  const handleRestrictionTypeChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setSelectedRestrictionType(event.target.value as string);
    if (event.target.value === 'CompleteBan') {
      setSelectedModerationType(Object.keys(EmoderationType).filter(key => key === 'ACCOUNT')[0]);
      setHideModerationType(true);
    }
    else {
      setHideModerationType(false);
      setSelectedModerationType('');
    }
  };

  const handleModerationTypeChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setSelectedModerationType(event.target.value as string);
    if( event.target.value === 'CASH_REWARD_GAME_SPECIFIC' ){
      setHideGames(false);
    } else {
      setHideGames(true);
    }
  };

  const handleDurationTypesChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setDurationType(event.target.value as string);
    if (event.target.value === 'PERMANENT') {
      setHideBanDurations(true);
    } else {
      setHideBanDurations(false);
    }
    setBanDuration('');
  };

  const handleBanDurationsChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setBanDuration(event.target.value as EbanDurations);
  };

  const handleAppSelectionChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    const selectedApps = event.target.value as string[];
    if (selectedApps.includes('ALL')) {
      setDisplayAppsForBan([selectedApp, 'ALL']);
      setSelectedAppsForBan(apps.list.map(app => app.appId));
    } else {
      setDisplayAppsForBan(selectedApps);
      setSelectedAppsForBan(selectedApps);
    }
    setSelectedGamesForBan([]);
  };

  const getRenderValueForApps = () => {
    if(selectedAppsForBan.length > 1){
      return (apps.list.map(app => app.appId) as string[]).join(', ')
    }else {
      return selectedApp;
    }
  }

  const handleGameSelectionChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setSelectedGamesForBan(event.target.value as string []);
  };

  const handlePrivateNoteChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setPrivateNote(event.target.value as string);
  };

  const handlePublicNoteChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setPublicNote(event.target.value as string);
  };

  const closeOpenAlertDialog = () => {
    setOpenAlertDialog(false);
  };

  const addDurationToCurrentDate = (duration: string): string => {
    var currentDate = new Date();

    switch (duration) {
      case 'ONE_DAY': {
        currentDate.setDate(currentDate.getDate() + 1);
        return currentDate.getTime().toString();
      }
      case 'THREE_DAYS': {
        currentDate.setDate(currentDate.getDate() + 3);
        return currentDate.getTime().toString();
      }
      case 'ONE_WEEK': {
        currentDate.setDate(currentDate.getDate() + 7);
        return currentDate.getTime().toString();
      }
      case 'TWO_WEEKS': {
        currentDate.setDate(currentDate.getDate() + 14);
        return currentDate.getTime().toString();
      }
      case 'ONE_MONTH': {
        currentDate.setMonth(currentDate.getMonth() + 1);
        return currentDate.getTime().toString();
      }
      case 'ONE_YEAR': {
        currentDate.setFullYear(currentDate.getFullYear() + 1);
        return currentDate.getTime().toString();
      }
      case 'HUNDRED_YEARS': {
        currentDate.setFullYear(2099);
        return currentDate.getTime().toString();
      }
      default: {
        return currentDate.getTime().toString();
      }
    }
  }

  // const convertDateToEpochTime = ( date : Date ) : string =>{
  //   return date.getTime().toString();
  // }

  const convertEpochTimeToDate = (epochTime: string): string => {
    var d = new Date(epochTime);
    return d.toLocaleString();
  }

  const banUser = (event: FormEvent) => {
    let duplicateUserModerations = userModerationData.filter(um => {
      return !isExpired(um.expiresAt) && um.moderationType === selectedModerationType
    });
    if (duplicateUserModerations.length > 0) {
      setOpenAlertDialog(true);
    } else {
      if (user?.user.id && user?.appId && user.deviceId) {
        dispatch(fetchUserModerationFormDispatcher({
          id: 0,
          userId: user?.user.id,
          appId: selectedAppsForBan.filter(app => app !== 'ALL').join(','),
          deviceId: user.deviceId,
          banState: selectedRestrictionType,
          privateNote: privateNote,
          publicNote: publicNote,
          moderationType: selectedModerationType,
          expiresAt: addDurationToCurrentDate(selectedBanDuration === '' ? 'HUNDRED_YEARS' : selectedBanDuration),
          extraInfo: extraInfo,
          isRevoked: false
        })).then(() => {
          if (user && selectedApp) {
            dispatch(fetchUserModerationDispatcher(selectedApp, user.user.id));
          }
        });
      }
    }

    event.preventDefault();
  };

  const revokeBan = (event: FormEvent, banIdToBeRevoked: number) => {
    dispatch(fetchRevokeBanDispatcher(banIdToBeRevoked)).then(() => {
      if (user && selectedApp) {
        dispatch(fetchUserModerationDispatcher(selectedApp, user.user.id));
      }
    });
    event.preventDefault();
  };

  return (
    <UserAccounts>

      {!searchByCriteria.error && <DeleteUser />}

      <Paper className={`${classes.paperRoot} ${pvtClasses.userModControls}`}>
        {searchByCriteria.error && <Alert severity="error">{searchByCriteria.error}</Alert>}
        {!searchByCriteria.error &&
          <Container maxWidth="xs">
          <form onSubmit={banUser}>
            <FormControl className={pvtClasses.formControl}>
              <InputLabel required>Restriction type</InputLabel>
              <Select
                required
                value={selectedRestrictionType}
                onChange={handleRestrictionTypeChange}>{
                  restrictionTypes.map((type, index) => (
                    <MenuItem value={type[0]} key={index + type[0]}>{type[1]}</MenuItem>
                  ))
                }
              </Select>
            </FormControl>
            <FormControl className={pvtClasses.formControl}>
              <InputLabel required >Moderation Type</InputLabel>
              <Select
                disabled={hideModerationType}
                required={!hideModerationType}
                value={selectedModerationType}
                onChange={handleModerationTypeChange}>{
                  moderationTypes.map((type, index) => (
                    type[0] === 'ACCOUNT' ?
                      <MenuItem value={type[0]} key={index + type[1]} disabled>{type[1]}</MenuItem> :
                      <MenuItem value={type[0]} key={index + type[1]}>{type[1]}</MenuItem>
                  ))}
              </Select>
            </FormControl>
            <FormControl className={pvtClasses.formControl}>
              <InputLabel required>Duration type</InputLabel>
              <Select
                required
                value={selectedDurationType}
                onChange={handleDurationTypesChange}>{
                  durationTypes.map((type, index) => (
                    <MenuItem value={type[0]} key={index + type[1]}>{type[1]}</MenuItem>
                  ))
                }
              </Select>
            </FormControl>
            <FormControl className={pvtClasses.formControl}>
              <InputLabel required>Duration</InputLabel>
              <Select
                disabled={hideBanDurations}
                required={!hideBanDurations}
                value={selectedBanDuration}
                onChange={handleBanDurationsChange}>{
                  banDurations.map((type, index) => (
                    <MenuItem value={type[0]} key={index + type[1]}>{type[1]}</MenuItem>
                  ))
                }
              </Select>
            </FormControl>
            <FormControl className={pvtClasses.formControl}>
              <InputLabel required >Select app(s)</InputLabel>
              <Select
                multiple
                value={displayAppsForBan}
                onChange={handleAppSelectionChange}
                renderValue={getRenderValueForApps}
              >
                {appsForBan.map(app =>
                  <MenuItem value={app} key={app}>
                    <Checkbox checked={displayAppsForBan.includes(app)} />
                    <ListItemText primary={app} />
                  </MenuItem>)}
              </Select>
            </FormControl>
            <FormControl className={pvtClasses.formControl}>
              <InputLabel>Select game(s)</InputLabel>
              <Select 
                multiple
                disabled={hideGames}
                required={!hideGames}
                value={selectedGamesForBan}
                onChange={handleGameSelectionChange}
              >
                {gamesInSelectedApps.map((game, index) =>
                  <MenuItem value={game.gameId} key={game.id}>{game.id} {game.gameId}</MenuItem>)}
              </Select>
            </FormControl>
            <FormControl className={pvtClasses.formControl}>
              <TextField required
                label="Private note"
                onChange={handlePrivateNoteChange}
              />
            </FormControl>
            <FormControl className={pvtClasses.formControl}>
              <TextField required
                label="Public note"
                onChange={handlePublicNoteChange}
              />
            </FormControl>
            <Button type="submit"
              disabled={!isFormValid}
              variant="contained" color="primary"
            >Ban User</Button>
            <Dialog
              open={openAlertDialog}
              onClose={() => setOpenAlertDialog(false)}
              aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description"
            >
              <DialogTitle id="alert-dialog-title">
                {"Attempt to create a duplicate user moderation"}
              </DialogTitle>
              <DialogContent>
                <DialogContentText id="alert-dialog-description">
                  A Live user moderation with the selected moderation type({selectedModerationType}) already exists.
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button onClick={closeOpenAlertDialog} color="primary">
                  Close
                </Button>
              </DialogActions>
            </Dialog>
          </form>
        </Container>}
      </Paper>

      {!searchByCriteria.error &&
      <Paper className={classes.paperRoot} style={{ marginTop: 24 }}>
        <TableContainer>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>Created On</TableCell>
                <TableCell>Expires On</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Restriction Type</TableCell>
                <TableCell>Moderation State</TableCell>
                <TableCell>Private Note</TableCell>
                <TableCell>Public Note</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {
                userModerationData &&
                userModerationData.map((data, index) =>
                (
                  <TableRow hover key={index}>
                    <TableCell key='0'>{convertEpochTimeToDate(data.createdAt)}</TableCell>
                    <TableCell key='1'>{convertEpochTimeToDate(data.expiresAt)}</TableCell>
                    <TableCell
                      key={'2' + data.expiresAt}
                      style={{ color: isExpired(data.expiresAt) ? (data.isRevoked?"blue":"black") : "green" }}>{
                        isExpired(data.expiresAt) ? (data.isRevoked?'Revoked':'Expired') : 'Live'}
                    </TableCell>
                    <TableCell key='3'>{data.banState}</TableCell>
                    <TableCell key='4'>{data.moderationType}</TableCell>
                    <TableCell key='6'>{data.privateNote}</TableCell>
                    <TableCell key='7'>{data.publicNote}</TableCell>
                    <TableCell key='8'>
                      {!isExpired(data.expiresAt) &&
                          <Button 
                            variant="contained" color="primary"
                            value={data.id}
                            onClick={(event) => revokeBan(event, data.id)}
                          >
                            Revoke Ban
                          </Button>
                      }
                    </TableCell>
                  </TableRow>
                ))
              }
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>}
    </UserAccounts>
  );
};

export default UserModeration;

export const isExpired = (expiryDate: string): boolean => {
  var currentDate = new Date();
  return currentDate.getTime() >= parseInt(expiryDate);
};

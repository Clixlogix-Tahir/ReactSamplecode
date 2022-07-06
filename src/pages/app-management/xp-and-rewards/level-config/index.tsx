/* eslint-disable react-hooks/exhaustive-deps */
import {
  Button,
  CircularProgress,
  Table,
  TableBody,
  TableContainer,
  Typography,
  Snackbar,
  TableHead,
  TableRow,
  TableCell
} from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import React from 'react';
import styled from 'styled-components';
import { XHR_STATE } from '../../../../common/constants';
import { appManagementDispatchers } from '../../appManagementSlice';
import { useAppDispatch, useAppSelector } from '../../../../common/hooks';
import globalStyles from '../../../../theme/globalStyles';
import { EEventCategory } from '../../../../types/eventTypes';
import { eventApiDispatchers } from '../../../events/eventSlice';
import LevelRow from './level-row';
import produce from 'immer';
import { ERewardTypesForDropDown } from '../../constants';

const HeightConstrainedSection = styled.div`
  @media (min-width: 1200px) {
    margin-top: 12px;
    height: calc(95vh - 450px);
    min-height: 250px;
    overflow: scroll;
    position: sticky;
    top: 400px;
  }
`;

const TableContainers = styled.div`
  padding: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  form {
    display: inline-block;
  }
`;

function LevelConfig(props: any) {
  // const globalClasses = useMemo(globalStyles, []);
  const globalClasses = globalStyles();
  const dispatch = useAppDispatch();
  const { selectedApp } = useAppSelector(state => state.gameConfigForm);
  const { levelRewards, creatingLevelRewards, updatingLevelRewards, getAppDetails} = useAppSelector(state => state.appManagementSlice);
  const { rewards } = levelRewards;
  const { app } = getAppDetails;
  const [collatedLevels, setCollatedLevels] = React.useState<{[key: string]: number[]}>({});
  const [showSnackBar, setShowSnackBar] = React.useState<boolean>(false);
  const [snackBarText, setSnackBarText] = React.useState<string>('');
  const [snackBarError, setSnackBarError] = React.useState<string>('');
  const [appIosVersion, setAppIosVersion] = React.useState('');
  const [appAndroidVersion, setAppAndroidVersion] = React.useState('');
  const defaultAppVersions = {
    appIosVersion: '',
    appAndroidVersion: '',
  };
  const [appVersions, setAppVersions] = React.useState({ ...defaultAppVersions });

  React.useEffect(() => {
    setCollatedLevels({});
    if (selectedApp) {
      dispatch(appManagementDispatchers.getAppDetails(selectedApp));
      dispatch(appManagementDispatchers.getLevelRewards(selectedApp));
      dispatch(eventApiDispatchers.getEvents(EEventCategory.BATTLE, selectedApp));
    }
  }, [selectedApp]);

  React.useEffect(() => {
    if (getAppDetails && getAppDetails.app && getAppDetails.loading === XHR_STATE.COMPLETE) {
      (ERewardTypesForDropDown as any).COIN = app?.currencies[0];
    }
  }, [getAppDetails]);

  React.useEffect(() => {
    if (creatingLevelRewards.reward !== null && creatingLevelRewards.error === '' && creatingLevelRewards.loading === XHR_STATE.COMPLETE) {
      setSnackBarText(`New level reward with id "${creatingLevelRewards.reward.id}" created successfully.`);
      setShowSnackBar(true);
    } else if (creatingLevelRewards.error !== '' && creatingLevelRewards.loading === XHR_STATE.ASLEEP) {
      setSnackBarError('Sorry, could not save the new level reward. ' + creatingLevelRewards.error);
    }
  }, [creatingLevelRewards]);


  React.useEffect(() => {
    if (updatingLevelRewards.reward && updatingLevelRewards.error === '' && updatingLevelRewards.loading === XHR_STATE.COMPLETE) {
      setSnackBarText(`Level reward with id "${updatingLevelRewards.reward.id}" updated successfully`);
      setShowSnackBar(true);
    }
    else if (updatingLevelRewards.error !== '' && updatingLevelRewards.loading === XHR_STATE.ASLEEP) {
      setSnackBarError('Sorry, could not update the level reward. ' + updatingLevelRewards.error);
    }
  }, [updatingLevelRewards]);

  // React.useEffect(() => {
  //   if (deletingLevelRewards.error === '' && deletingLevelRewards.loading === XHR_STATE.COMPLETE) {
  //     setSnackBarText('Level reward deleted successfully.');
  //     setShowSnackBar(true);
  //   }
  //   else if (deletingLevelRewards.error !== '' && deletingLevelRewards.loading === XHR_STATE.ASLEEP) {
  //     setSnackBarError('Sorry, could not delete the level reward. ' + deletingLevelRewards.error);
  //   }
  // }, [deletingLevelRewards]);

  // React.useEffect(() => {
  //   if (deleteAllLevelRewardsForALevel.error === '' && deleteAllLevelRewardsForALevel.loading === XHR_STATE.COMPLETE) {
  //     setSnackBarText('Deleted the level successfully.');
  //     setShowSnackBar(true);
  //   }
  //   else if (deleteAllLevelRewardsForALevel.error !== '' && deleteAllLevelRewardsForALevel.loading === XHR_STATE.ASLEEP) {
  //     setSnackBarError('Sorry, could not delete the level. ' + deleteAllLevelRewardsForALevel.error);
  //   }
  // }, [deletingLevelRewards]);

  const addNewLevel = (event: React.FormEvent) => {
    event.preventDefault();
    const len = Object.keys(collatedLevels).length + 1;
    setCollatedLevels(produce(collatedLevels, draftLevels => {
      draftLevels[len + ''] = [];
      draftLevels[len + 1 + ''] = [];
      draftLevels[len + 2 + ''] = [];
      draftLevels[len + 3 + ''] = [];
      draftLevels[len + 4 + ''] = [];
    }));
  };

  React.useEffect(() => {
    const newCollatedLevels: { [key: string]: number[] } = {};
    let maxLevel = 0;
    rewards.forEach((reward, rewardIndex) => {
      // if (reward.rewardType === ERewardType.REAL_CURRENCY || reward.rewardType === ERewardType.VIRTUAL_CURRENCY) {
      const levelKey = reward.level + 1 + '';
      maxLevel = Math.max(reward.level, maxLevel);
      if (levelKey in newCollatedLevels) {
        newCollatedLevels[levelKey].push(rewardIndex);
      } else {
        newCollatedLevels[levelKey] = [rewardIndex];
      }
      // }
    });
    // table should have at least 100 levels
    // if no rewards exist for a level, show empty table row
    const maxLevelInMap = Math.max(...Object.keys(collatedLevels).map(l => parseInt(l)));
    maxLevel = Math.max(maxLevelInMap < 100 ? 100 : maxLevelInMap, maxLevel);
    for (let level = 1; level <= maxLevel; level++) {
      if (!(level in newCollatedLevels)) {
        newCollatedLevels[level] = [];
      }
    };
    setCollatedLevels(newCollatedLevels);
  }, [levelRewards]);

  const handleAppIosVersionChange = (e: React.ChangeEvent<{ value: unknown }>) => {
    setAppIosVersion(e.target.value as string);
  };

  const handleAppAndroidVersionChange = (e: React.ChangeEvent<{ value: unknown }>) => {
    setAppAndroidVersion(e.target.value as string);
  };

  const applyVersionFilter = (ev: React.FormEvent) => {
    ev.preventDefault();
    setAppVersions({
      appIosVersion,
      appAndroidVersion,
    });
  };

  const clearFilter = () => {
    setAppIosVersion('');
    setAppAndroidVersion('');
    setAppVersions({ ...defaultAppVersions });
  };

  return (
    <React.Fragment>
      <TableContainers>
        <Typography variant="h3">XP Level-up Reward Configuration</Typography>
        {/* todo disabling temporarily */}
        {/* <div>
          <form onSubmit={applyVersionFilter}>
            <FormControl>
              <TextField
                label="appIosVersion"
                value={appIosVersion}
                onChange={handleAppIosVersionChange}
                // onBlur={handleAppIosVersionChange}
              />
            </FormControl>
            <FormControl>
              <TextField
                label="appAndroidVersion"
                value={appAndroidVersion}
                onChange={handleAppAndroidVersionChange}
                // onBlur={handleAppAndroidVersionChange}
              />
            </FormControl>
            <Button type="submit" variant="outlined">
              Apply Filter
            </Button>
          </form>
          <Button variant="outlined" onClick={clearFilter}>
            Clear Filter
          </Button>
        </div> */}
      </TableContainers>
      <div>
        <HeightConstrainedSection className={globalClasses.customScrollbar}>

          {(!rewards || !rewards.length) && levelRewards.loading !== XHR_STATE.IN_PROGRESS &&
            <Alert severity="warning">No level config found.</Alert>
          }
          {levelRewards.loading === XHR_STATE.IN_PROGRESS && <CircularProgress />}
          <TableContainer>
            <Table stickyHeader size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Level</TableCell>
                  <TableCell>Rewards</TableCell>
                  {/* <TableCell>Events</TableCell> */}
                </TableRow>
              </TableHead>
              <TableBody>
                {Object.keys(collatedLevels).map(levelKey =>
                  <LevelRow
                    key={`level-${levelKey}`}
                    levelNumber={levelKey}
                    currentLevelRewards={collatedLevels[levelKey]}
                    collatedLevels={collatedLevels}
                    setCollatedLevels={setCollatedLevels}
                    appIosVersion={appVersions.appIosVersion}
                    appAndroidVersion={appVersions.appAndroidVersion}
                  />
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </HeightConstrainedSection>
      </div>

      <form onSubmit={addNewLevel} noValidate
        style={{ marginTop: 0, backgroundColor: '#eee', padding: '1rem' }}
      >

        <Button
          variant="contained"
          color="primary"
          type="submit"
        >
          Add 5 levels
        </Button>
      </form>

      <Snackbar
        open={showSnackBar}
        autoHideDuration={3000}
        onClose={() => setShowSnackBar(false)}
      >
        <Alert onClose={() => console.log()} severity="success">
          {snackBarText}
        </Alert>
      </Snackbar>

      <Snackbar
        open={Boolean(snackBarError)}
        autoHideDuration={3000}
        onClose={() => setSnackBarError('')}
      >
        <Alert severity="error">
          {snackBarError}
        </Alert>
      </Snackbar>

    </React.Fragment>
  );
}

export default LevelConfig;

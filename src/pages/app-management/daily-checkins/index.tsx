/* eslint-disable react-hooks/exhaustive-deps */
import {
  Chip, Grid,
  IconButton
} from '@material-ui/core';
import { AddCircle } from '@material-ui/icons';
import produce from 'immer';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import AppManagement from '..';
import { CONSTANTS, ROUTES, URL_PART_APP_ID, XHR_STATE } from '../../../common/constants';
import { useAppDispatch, useAppRedirect, useAppSelector } from '../../../common/hooks';
import { TDispatcherOptions } from '../../../types/types';
import { appManagementDispatchers, getAllDailyCheckinRewardSetsSuccess } from '../appManagementSlice';
import { TDailyCheckinRewardSet, TDailyReward, TSlot } from '../appManagementTypes';
import { EVirtualCurrencyTypes } from '../../../types/types';
import { maxRewardSetsAllowed } from '../constants';
import ActiveSetsPriorityComparision from './activeSetsPriorityComparision';
import RewardSet from './rewardSet';

const Shadow = styled.div`
  box-shadow: ${props => props.theme.shadows[1]};
`;

const AppDailyCheckins: React.FC<any> = () => {
  const dispatch = useAppDispatch();
  const changeRoute = useAppRedirect();
  const { selectedApp } = useAppSelector(state => state.gameConfigForm);
  const { allDailyCheckinRewardSets, getAppDetails } = useAppSelector(state => state.appManagementSlice);
  const { app } = getAppDetails;
  const { rewardSets } = allDailyCheckinRewardSets;
  const [recurringSetIndex, setRecurringSetIndex] = useState<number | null>(null);

  useEffect(() => {
    if (selectedApp && selectedApp !== CONSTANTS.MISC.SAMPLE_APP) {
      dispatch(appManagementDispatchers.getAppDetails(selectedApp));
      dispatch(appManagementDispatchers.getAllDailyCheckinRewardDispatcher(selectedApp));
      let url = ROUTES.APP_DAILY_CHECKINS.replace(URL_PART_APP_ID, selectedApp) + window.location.search;
      changeRoute(url);
    }
  }, [selectedApp]);

  useEffect(() => {
    const index = getRecurringSetIndex();
    setRecurringSetIndex(index);
  }, [rewardSets]);

  useEffect(() => {
    if (getAppDetails && getAppDetails.app && getAppDetails.loading === XHR_STATE.COMPLETE) {
      (EVirtualCurrencyTypes as any).COIN = app?.currencies[0];
    }
  }, [getAppDetails]);

  const getRecurringSetIndex = (): number | null => {
    if( rewardSets.length === 0 ){
      return -1;
    }
    let recurringSetIndex = -1;
    for(var i = 0; i < rewardSets.length; i++){
      if( recurringSetIndex === -1){
        if( rewardSets[i].active === true){
          recurringSetIndex = i;
        }
      } else{
        if(rewardSets[i].active === true && rewardSets[i].rewardSetNum > rewardSets[recurringSetIndex].rewardSetNum){
          recurringSetIndex = i;
        }
      }
    }
    return recurringSetIndex;
  };

  const checkForDuplicatePriority = (setNumber: number, setIndex: number) : number => {
    const setWithDuplicatePriority = rewardSets.filter( set => set.id !== null && set.rewardSetNum=== setNumber && set.index!== setIndex);
    if ( setWithDuplicatePriority.length > 0){
      return setWithDuplicatePriority[0].index;
    }else{
      return -1;
    }
  }

  const updateReward = (rewardSetIndex: number, slotIndex: number, rewardIndex: number, reward?: TDailyReward) => {
    if (reward) {
      dispatch(getAllDailyCheckinRewardSetsSuccess(produce(rewardSets, draftRewardSets => {
        draftRewardSets[rewardSetIndex].slots[slotIndex].dailyRewards.splice(rewardIndex, 1, reward);
      })));
    } else {
      dispatch(getAllDailyCheckinRewardSetsSuccess(produce(rewardSets, draftRewardSets => {
        if (rewardSets[rewardSetIndex].slots[slotIndex].dailyRewards.length > 1) {
          draftRewardSets[rewardSetIndex].slots[slotIndex].dailyRewards.splice(rewardIndex, 1);
        } else {
          draftRewardSets[rewardSetIndex].slots.splice(slotIndex, 1);
        }
      })));
    }
  }

  const updateSet = (rewardSetIndex: number, set: TDailyCheckinRewardSet) => {
    dispatch(getAllDailyCheckinRewardSetsSuccess(produce(rewardSets, draftRewardSets => {
      draftRewardSets.splice(rewardSetIndex, 1, set);
    })));
  }

  const save = (rewardSetIndex: number) => {

    let rewardSet: TDailyCheckinRewardSet = {
      ...rewardSets[rewardSetIndex]
    };
    rewardSet = getNonEmptySlots(rewardSet);
    const dispatcherOptions1: TDispatcherOptions = {
      success: (rewards: TDailyCheckinRewardSet[]) => {
        // dispatch(getAllDailyCheckinRewardSetsSuccess(produce(rewardSets, draftRewardSets => {
        //   if( rewardSets[rewardSetIndex].slots.length === 0 ){
        //     draftRewardSets.splice(rewardSetIndex, 1);
        //   } else {
        //     draftRewardSets[rewardSetIndex] = rewardSet;
        //   }
        // })));
        //dispatch(appManagementDispatchers.getAllDailyCheckinRewardDispatcher(selectedApp));
        window.location.reload();
      },
    };

    if (rewardSet.id === null && rewardSet.slots.length !== 0) {
      dispatch(appManagementDispatchers.createDailyCheckinRewardDispatcher(selectedApp, rewardSet, dispatcherOptions1));
    } else if (rewardSet.id === null && rewardSet.slots.length === 0) {
      dispatch(appManagementDispatchers.getAllDailyCheckinRewardDispatcher(selectedApp));
    } else if (rewardSet.id !== null && rewardSet.slots.length === 0) {
      dispatch(appManagementDispatchers.deleteDailyCheckinRewardDispatcher(selectedApp, rewardSet.rewardSetNum, dispatcherOptions1));
    } else {
      dispatch(appManagementDispatchers.updateDailyCheckinRewardDispatcher(selectedApp, rewardSet, dispatcherOptions1));
    }
  };

  const getNonEmptySlots = (set: TDailyCheckinRewardSet): TDailyCheckinRewardSet => {
    let tempRewardSet: TDailyCheckinRewardSet = {
      ...set
    }
    tempRewardSet.slots = [];
    for (var i = 0; i < set.slots.length; i++) {
      if (set.slots[i].dailyRewards.length > 0) {
        tempRewardSet.slots.push(set.slots[i]);
      }
    }
    return tempRewardSet;
  };

  const getNextHighestPriority = () : number => {
    if( rewardSets.length === 0 ){
      return 0;
    }
    let nextHighestPriority = 0;
    for(let i = 0; i < rewardSets.length; i++){
      if( nextHighestPriority < rewardSets[i].rewardSetNum){
        nextHighestPriority = rewardSets[i].rewardSetNum;
      }
    }
    return nextHighestPriority + 1;
  }

  const addNewSet = () => {
    const nextHighestPriority = getNextHighestPriority();
    dispatch(getAllDailyCheckinRewardSetsSuccess(produce(rewardSets, draftRewardSets => {
      const newSet: TDailyCheckinRewardSet = {
        index: rewardSets.length,
        id: null,
        appId: selectedApp,
        rewardSetNum: nextHighestPriority,
        slots: [],
        duration: 10,
        uiFlag: true,
        active: true,
      }
      draftRewardSets.push(newSet);
    })));
  }

  const addNewSlot = (rewardSetIndex: number) => {
    dispatch(getAllDailyCheckinRewardSetsSuccess(produce(rewardSets, draftRewardSets => {
      const newSlot: TSlot = {
        dailyRewards: []
      }
      draftRewardSets[rewardSetIndex].slots.push(newSlot);
    })));
  };

  return (
    <AppManagement>

      <Grid container spacing={6} style={{ marginTop: 12 }}>
        <Grid item xs={12} sm={12}>
          <Shadow>

            <div style={{ marginBottom: 30 }}>
              <ActiveSetsPriorityComparision
                rewardSets={rewardSets}
              />
            </div>

            {
              rewardSets.map((rewardSet, index) => (
                <div style={{ marginBottom: 30, border: 'solid black 1px' }}>
                  <RewardSet
                    key={rewardSet.id}
                    rewardSet={rewardSet}
                    rewardSetIndex={index}
                    addNewSlot={addNewSlot}
                    updateSet={updateSet}
                    save={save}
                    updateReward={updateReward}
                    isRecurring={(recurringSetIndex !== null) ? ((index === recurringSetIndex) ? true : false) : false}
                    checkForDuplicatePriority={checkForDuplicatePriority}
                  />
                </div>
              ))
            }
          </Shadow>

          {
            rewardSets.length <= maxRewardSetsAllowed &&
            <>
              <IconButton title='Add new set' onClick={addNewSet}>
                <AddCircle style={{ color: 'green' }} />
              </IconButton>
              <Chip title='Add new set' onClick={addNewSet} style={{ backgroundColor: 'yellow', color: 'green', fontWeight: 'bold', padding: 20, margin: 5 }} label="Add new set" />
            </>
          }

        </Grid>
      </Grid>

    </AppManagement>
  );
}

export default AppDailyCheckins;

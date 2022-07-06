/* eslint-disable react-hooks/exhaustive-deps */
import {
  Card as MuiCard, createStyles, IconButton, TableCell, TableRow
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { AddCircle } from '@material-ui/icons';
import { spacing } from "@material-ui/system";
import produce from 'immer';
import React, { useState } from 'react';
import styled from 'styled-components';
import { useAppDispatch, useAppSelector, useDefaultRealCurrency } from '../../../common/hooks';
import { ECryptoCurrency, ECurrency } from '../../../types/eventTypes';
import { getAllDailyCheckinRewardSetsSuccess } from '../appManagementSlice';
import { EDailyRewardType, TDailyReward, TSlotProps } from '../appManagementTypes';
import DailyReward from './dailyReward';
import { EVirtualCurrencyTypes } from '../../../types/types';

const useStyles = makeStyles((theme) => createStyles({
  root: {
    width: '100%',
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: 'normal',
  },
  controls: {
    top: '-3rem',
    textAlign: 'right',
    right: 0,
    '& button + button': {
      marginLeft: '1rem',
    }
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 150,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
  numberInput: {
    width: 80,
    minWidth: 80,
  },
  rewardBox: {
    display: 'inline-flex',
    alignItems: 'center',
    marginRight: 5,
  },
  slot: {
    flexDirection: 'row',
  },
  errorText: {
    color: 'red',
    fontSize: '0.8rem',
    marginTop: 0,
  },
  newRewardButton: {
    //marginLeft: '1rem',
    //alignItems: 'center',
  },
}));

function Slot(props: TSlotProps) {
  const classes = useStyles();
  const { rewardSetIndex, slotIndex, slot, isEditing, updateReward, addError } = props;
  const dispatch = useAppDispatch();
  const { allDailyCheckinRewardSets } = useAppSelector(state => state.appManagementSlice);
  const { isSelectedAppCrypto } = useAppSelector(state => state.gameConfigForm);
  const { rewardSets } = allDailyCheckinRewardSets;
  const maxRewardsAllowedPerSlot = isSelectedAppCrypto ? 7 : ( Object.values(EDailyRewardType).length - 4 )  + 2 * ( Object.values(ECurrency).length - 1 ) ;
  const [usedRewardTypes, setUsedRewardTypes] = useState<Set<EDailyRewardType>>(new Set<EDailyRewardType>());
  const defaultRealCurrency = useDefaultRealCurrency();

  const addNewLevelReward = () => {
    dispatch(getAllDailyCheckinRewardSetsSuccess(produce(rewardSets, draftRewardSets => {
      const newReward: TDailyReward = {
        amount: 10,
        currencyCode: isSelectedAppCrypto ? defaultRealCurrency : ECurrency.NOT_AVAILABLE,
        dailyRewardType: EDailyRewardType.NONE,
        duration: 0,
        currencyType: EVirtualCurrencyTypes.COIN,
      }
      draftRewardSets[rewardSetIndex].slots[slotIndex].dailyRewards.push(newReward);
    })));
  }

  return (
    <React.Fragment>

      <TableRow hover>
        <TableCell width={130} style={{fontWeight:'bold'}}>
            Day {slotIndex+1}
        </TableCell>

        <TableCell>
          {/* <div style={{alignItems:'center'}}> */}
            {slot && Array.isArray(slot.dailyRewards) &&
              slot.dailyRewards.map((dailyReward, dailyRewardIndex) => (
                <DailyReward
                  rewardSetIndex={rewardSetIndex}
                  slotIndex={slotIndex}
                  slot={slot}
                  dailyRewardIndex={dailyRewardIndex}
                  dailyReward={dailyReward}
                  isEditing={isEditing}
                  updateReward={updateReward}
                  usedRewardTypes={usedRewardTypes}
                  addError={addError}
                />
              )
              )
            }

            {isEditing && slot.dailyRewards.length < maxRewardsAllowedPerSlot &&
              <IconButton title='Add a new reward' className={classes.newRewardButton} onClick={() => addNewLevelReward()}>
                <AddCircle style={{ color: 'green' }} />
              </IconButton>
            }
          {/* </div> */}
        </TableCell>

      </TableRow>

    </React.Fragment>
  );
}

export default Slot;
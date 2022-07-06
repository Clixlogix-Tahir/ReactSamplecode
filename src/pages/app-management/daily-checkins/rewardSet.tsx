/* eslint-disable react-hooks/exhaustive-deps */
import {
  Button, Card as MuiCard, Checkbox, Chip, createStyles, IconButton,
  Snackbar, Table, TableCell,
  TableContainer,
  TableRow, TextField, Typography
} from '@material-ui/core';
import Accordion from '@material-ui/core/Accordion';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import { makeStyles } from '@material-ui/core/styles';
import { AddCircle } from '@material-ui/icons';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { Alert } from '@material-ui/lab';
import { spacing } from "@material-ui/system";
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useAppDispatch, useAppSelector } from '../../../common/hooks';
import HandyDialog from '../../../components/HandyDialog';
import { TDailyCheckinRewardSet, TDailyReward, TRewardSetProps, TSlot } from '../appManagementTypes';
import { appManagementDispatchers } from '../appManagementSlice';
import * as CONSTANTS from '../constants';
import * as MESSAGE_CONSTANTS from './message';
import Slot from './slot';

const Card = styled(MuiCard)`
  ${spacing};
  box-shadow: none;
`;

const useStyles = makeStyles((theme) => createStyles({
  root: {
    width: '100%',
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: 'normal',
  },
  headerRow: {
    display: 'flex',
    flexDirection: 'row',
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
  errorText: {
    color: 'red',
    fontSize: '0.8rem',
    marginTop: 0,
  },
  titleRowChips: {
    backgroundColor: 'MediumSeaGreen', 
    color: 'white', 
    fontWeight: 'bold', 
    padding: 20, 
    margin: 5 
  }
}));

function RewardSet(props: TRewardSetProps) {
  const dispatch = useAppDispatch();
  const { selectedApp } = useAppSelector(state => state.gameConfigForm);
  const { rewardSet, rewardSetIndex, addNewSlot, isRecurring, updateSet, updateReward, save, checkForDuplicatePriority } = props;
  const { allDailyCheckinRewardSets, updatingDailyCheckinRewardSet } = useAppSelector(state => state.appManagementSlice);

  const [duration, setDuration] = useState<number>(rewardSet.duration);
  const [active, setActive] = useState<boolean>(rewardSet.active);
  const [showTimer, setShowTimer] = useState<boolean>(rewardSet.uiFlag);
  const [priority, setPriority] = useState<number>(rewardSet.rewardSetNum + 1);

  const [isEditing, setEditing] = React.useState(false);
  const [isFormEdited, setFormEdited] = React.useState(false);
  const [showConfirmSaveDialog, setShowConfirmSaveDialog] = useState<boolean>(false);
  const [showConfirmCancelDialog, setShowConfirmCancelDialog] = useState<boolean>(false);
  const classes = useStyles();
  const [originalUneditedSet, setOriginalUneditedSet] = useState<TDailyCheckinRewardSet>();
  const [durationErrorText, setDurationErrorText] = useState<string>('');
  const [priorityErrorText, setPriorityErrorText] = useState<string>('');

  const [snackbarSuccessText, setSnackbarSuccessText] = useState<string>('');
  const [snackbarErrorText, setSnackbarErrorText] = useState<string>('');
  const [noOfErrors, setNoOfErros] = useState<number>(0);
  const [accordion, setAccordion] = useState<boolean>(false);

  useEffect(() => {
    if (rewardSet) {
      setOriginalUneditedSet(rewardSet);
    }
  }, []);

  useEffect(() => {
    if (rewardSet && originalUneditedSet) {
      if (checkIfSetsHaveSameData(rewardSet, originalUneditedSet)) {
        setFormEdited(false);
      } else {
        setFormEdited(true);
      }
    }
  }, [rewardSet]);

  useEffect(() => {
    validateDuration();
  }, [duration]);

  useEffect(() => {
    validatePriority();
  }, [priority]);

  const addError = (numberToBeAdded: number) => {
    setNoOfErros(existingNoOfErrors => existingNoOfErrors + numberToBeAdded);
  }

  const validateDuration = () => {
    if (isNaN(duration)) {
      setDurationErrorText('Please enter the duration')
    } else if (!rewardSet.slots || (duration === 0 || duration < rewardSet.slots.length)) {
      setDurationErrorText('Duration must be greator than or equal to the number of slots')
    } else {
      setDurationErrorText('');
    }
  };

  const validatePriority = () => {
    if (isNaN(priority)) {
      setPriorityErrorText('Please enter the priority')
    } else if (priority <= 0 ) {
      setPriorityErrorText('Priority must be greator than 0')
    } else {
      setPriorityErrorText('');
    }
  };

  React.useEffect(() => {
    const newEditedSet: TDailyCheckinRewardSet = {
      ...rewardSet,
      rewardSetNum: priority-1 ,
      active: active,
      duration: duration as number,
      uiFlag: showTimer,
    }
    updateSet(rewardSetIndex, newEditedSet);
  }, [duration, active, showTimer, priority]);

  // React.useEffect(() => {
  //   if (updatingDailyCheckinRewardSet.error === '' && updatingDailyCheckinRewardSet.loading === XHR_STATE.COMPLETE) {
  //     setSnackbarSuccessText(`Daily checkin reward(s) updated successfully`);
  //   } else if (updatingDailyCheckinRewardSet.error !== '' && updatingDailyCheckinRewardSet.loading === XHR_STATE.ASLEEP) {
  //     setSnackbarErrorText('Sorry, could not update the daily checkin reward. ' + updatingDailyCheckinRewardSet.error);
  //   }
  // }, [updatingDailyCheckinRewardSet]);

  const handleSetDurationChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setDuration(parseInt(event.target.value as string) as number);
  };

  const handleIsActiveChange = (event: React.ChangeEvent<{ value: unknown, checked: boolean }>) => {
    setActive(event.target.checked as boolean);
  };

  const handleShowTimerChange = (event: React.ChangeEvent<{ value: unknown, checked: boolean }>) => {
    setShowTimer(event.target.checked as boolean);
  };

  const handlePriorityChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setPriority(parseInt(event.target.value as string) as number);
  };

  const checkIfSetsHaveSameData = (set1: TDailyCheckinRewardSet, set2: TDailyCheckinRewardSet): boolean => {
    if (set1 && set2) {
      if (set1.rewardSetNum !== set2.rewardSetNum || set1.appId !== set2.appId || set1.active !== set2.active || set1.duration !== set2.duration || set1.uiFlag !== set2.uiFlag || set1.slots.length !== set2.slots.length) {
        return false;
      }
      for (let i = 0; i < set1.slots.length; i++) {
        if (!checkIfSlotsHaveSameData(set1.slots[i], set2.slots[i])) {
          return false;
        }
      }
      return true;
    }
    return false;
  };


  const checkIfSlotsHaveSameData = (slot1: TSlot, slot2: TSlot): boolean => {
    if (slot1 && slot2) {
      if (slot1.dailyRewards.length !== slot2.dailyRewards.length) {
        return false;
      }
      for (let i = 0; i < slot1.dailyRewards.length; i++) {
        if (!checkIfDailyRewardsHaveSameData(slot1.dailyRewards[i], slot2.dailyRewards[i])) {
          return false;
        }
      }
      return true;
    }
    return false;
  };

  const checkIfDailyRewardsHaveSameData = (reward1: TDailyReward, reward2: TDailyReward): boolean => {
    if (reward1 && reward2) {
      if (reward1.dailyRewardType === reward2.dailyRewardType && reward1.amount === reward2.amount &&
        reward1.currencyCode === reward2.currencyCode && reward1.currencyType === reward2.currencyType &&
        reward1.duration === reward2.duration) {
        return true;
      } else {
        return false;
      }
    }
    return false;
  };

  const cancelChanges = () => {
    
    setShowConfirmCancelDialog(false);
    dispatch(appManagementDispatchers.getAllDailyCheckinRewardDispatcher(selectedApp));
    setEditing(isEditing => !isEditing);
  };

  const proceedForSave = () => {
    setShowConfirmSaveDialog(false);
    save(rewardSetIndex);
  }

  const toggleAccordion = () => {
    setAccordion(bool => !bool);
  };

  const getSaveDialogContent = (): string => {
    if (!rewardSet.slots || rewardSet.slots.length === 0) {
      return MESSAGE_CONSTANTS.SAVE_REWARD_SET_WITH_ZERO_SLOTS_CONFIRMATION;
    } else {
      const setIndexWithDuplicatePriority = checkForDuplicatePriority(rewardSet.rewardSetNum, rewardSet.index);
      if (setIndexWithDuplicatePriority !== -1) {
        return 'Set ' + setIndexWithDuplicatePriority + ' ' + MESSAGE_CONSTANTS.ALREADY_HAS_THE_SAME_PRIORITY + ' ' + priority + '. '+
        MESSAGE_CONSTANTS.PRIORITY_SWAP_WARNING +  " \n " + MESSAGE_CONSTANTS.SAVE_REWARD_SET_CONFIRMATION;
      } else {
        return MESSAGE_CONSTANTS.SAVE_REWARD_SET_CONFIRMATION;
      }
    }
  }

  return (
    <React.Fragment>
      <Card>
        <Accordion>
          <AccordionSummary
            onClick={toggleAccordion}
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <form noValidate className={classes.root}>
              <TableContainer>
                <Table stickyHeader size="small">
                  <TableRow>
                    <TableCell width={130}  >
                      <Typography component="h3" variant="h4" align="left" gutterBottom>
                        Set {rewardSetIndex}
                      </Typography>
                    </TableCell>

                    <TableCell>
                      <Typography style={{ color: '#1976d2' }} component="h6" variant="h6" align="left" gutterBottom>
                        <Chip className={classes.titleRowChips} label={`Priority = ${isNaN(rewardSet.rewardSetNum) ? '' : rewardSet.rewardSetNum + 1}`} />
                        &nbsp;&nbsp;&nbsp;
                        <Chip className={classes.titleRowChips} label={rewardSet.active === true ? 'Active' : 'Inactive'} />
                        &nbsp;&nbsp;&nbsp;
                        {isRecurring && 
                          <Chip className={classes.titleRowChips} label='Recurring enabled' />}
                      </Typography>
                    </TableCell>

                    {accordion &&
                      <TableCell >
                        <div className={classes.controls}>
                          {!isEditing &&
                            <Button variant="contained" color="primary"
                              onClick={e => {
                                e.stopPropagation();
                                // tood handle slots null
                                setEditing(isEditing => !isEditing);
                              }}
                            >
                              Edit
                            </Button>
                          }
                          {isEditing &&
                            <React.Fragment>
                              <Button variant="contained" color="default"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setShowConfirmCancelDialog(true);
                                }}
                                disabled={!isFormEdited}
                              >
                                Cancel
                              </Button>
                              <Button variant="contained" color="primary"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setShowConfirmSaveDialog(true);
                                }}
                                disabled={!isFormEdited || noOfErrors > 0 || priorityErrorText !== '' || durationErrorText != '' }
                              >
                                Save
                              </Button>
                            </React.Fragment>
                          }
                        </div>
                      </TableCell>
                    }

                  </TableRow>
                </Table>
              </TableContainer>
            </form>
          </AccordionSummary>

          <AccordionDetails>
            <TableContainer>

              <Table stickyHeader size="small" style={{ border: 'none' }}>
                {rewardSet && Array.isArray(rewardSet.slots) &&
                  rewardSet.slots.map((slot, slotIndex) => (
                    <Slot
                      rewardSetIndex={rewardSetIndex}
                      slot={slot}
                      slotIndex={slotIndex}
                      isEditing={isEditing}
                      updateReward={updateReward}
                      addError={addError}
                    />
                  ))
                }

              </Table>
              
              {
                isEditing && rewardSet.slots.length < CONSTANTS.maxSlotsAllowed &&
                <div style={{ display: 'flex', flexDirection: 'row', padding: 20 }}>
                  <IconButton title='Add new slot' onClick={() => addNewSlot(rewardSetIndex)}>
                    <AddCircle style={{ color: 'green' }} />
                  </IconButton>
                  <Chip title='Add new slot' onClick={() => addNewSlot(rewardSetIndex)} style={{ backgroundColor: 'yellow', color: 'green', fontWeight: 'bold', padding: 20, margin: 5, marginLeft: 0 }} label="Add new slot" />
                </div>
              }


              <Table stickyHeader size="small" style={{ border: 'none' }}>

                <TableRow hover>
                  <TableCell width={130} style={{ fontWeight: 'bold' }}>
                    Active Set
                  </TableCell>
                  <TableCell>
                    <Checkbox
                      style={{ paddingLeft: 0 }}
                      checked={rewardSet.active}
                      disabled={!isEditing}
                      onChange={handleIsActiveChange}
                    />
                  </TableCell>
                </TableRow>

                <TableRow hover>
                  <TableCell width={130} style={{ fontWeight: 'bold' }}>
                    Show Timer
                  </TableCell>
                  <TableCell>
                    <Checkbox
                      style={{ paddingLeft: 0 }}
                      checked={rewardSet.uiFlag}
                      disabled={!isEditing}
                      onChange={handleShowTimerChange}
                    />
                  </TableCell>
                </TableRow>

                <TableRow hover>
                  <TableCell width={130} style={{ fontWeight: 'bold' }}>
                    Set Duration
                  </TableCell>
                  <TableCell>
                    <TextField
                      className={classes.numberInput}
                      label='Day(s)'
                      value={rewardSet.duration}
                      onChange={handleSetDurationChange}
                      type="number"
                      error={durationErrorText !== ''}
                      disabled={!isEditing}
                    />
                    {durationErrorText && <p className={classes.errorText}>{durationErrorText}</p>}
                  </TableCell>
                </TableRow>

                <TableRow hover>
                  <TableCell width={130} style={{ fontWeight: 'bold' }}>
                    Priority
                  </TableCell>
                  <TableCell>
                    <TextField
                      className={classes.numberInput}
                      label=''
                      value={rewardSet.rewardSetNum+1}
                      onChange={handlePriorityChange}
                      type="number"
                      error={priorityErrorText !== ''}
                      disabled={!isEditing}
                    />
                    {priorityErrorText && <p className={classes.errorText}>{priorityErrorText}</p>}
                  </TableCell>
                </TableRow>

              </Table>


            </TableContainer>

            <HandyDialog
              open={showConfirmSaveDialog}
              title={!rewardSet.slots || rewardSet.slots.length === 0 ? 'Warning' : 'Confirmation'}
              content={getSaveDialogContent()}
              onClose={() => setShowConfirmSaveDialog(false)}
              onOkClick={() => proceedForSave()}
              onCancelClick={() => setShowConfirmSaveDialog(false)}
              okText="Proceed"
              cancelText="Cancel"
            />

            <HandyDialog
              open={showConfirmCancelDialog}
              title="Confirmation"
              content={'All unsaved progress will be lost, are you sure you want to cancel?'}
              onClose={() => setShowConfirmCancelDialog(false)}
              onOkClick={cancelChanges}
              onCancelClick={() => setShowConfirmCancelDialog(false)}
              okText="Proceed"
              cancelText="Cancel"
            />

            <Snackbar
              open={snackbarSuccessText !== ''}
              autoHideDuration={3000}
              onClose={() => setSnackbarSuccessText('')}
            >
              <Alert onClose={() => console.log()} severity="success">
                {snackbarSuccessText}
              </Alert>
            </Snackbar>

            <Snackbar
              open={Boolean(snackbarErrorText !== '')}
              autoHideDuration={3000}
              onClose={() => setSnackbarErrorText('')}
            >
              <Alert severity="error">
                {snackbarErrorText}
              </Alert>
            </Snackbar>


          </AccordionDetails>

        </Accordion>

      </Card>
    </React.Fragment>
  );
}

export default RewardSet;
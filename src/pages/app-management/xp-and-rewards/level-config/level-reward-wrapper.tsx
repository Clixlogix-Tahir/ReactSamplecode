/* eslint-disable react-hooks/exhaustive-deps */
import {
  Typography,
  MenuItem,
  Select,
  TextField,
  IconButton,
  createStyles,
} from '@material-ui/core';
import React, { useMemo } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import {
  RemoveCircle, CheckCircle
} from '@material-ui/icons';
import produce from 'immer';
import { useAppDispatch, useAppSelector, useDefaultRealCurrency, useUrlQuery } from '../../../../common/hooks';
import HandyDialog from '../../../../components/HandyDialog';
import { appManagementDispatchers, getLevelRewardsSuccess } from '../../appManagementSlice';
import { ERewardType, TLevelReward } from '../../appManagementTypes';
import { ECost } from '../../../../types/eventTypes';
import { ERewardTypesForDropDown } from '../../constants';
import { isNumericFieldsValid, isDecimalFieldsValid, rewardTypeForDropDownToRewardTypeConvertor } from '../../util';
import globalStyles from '../../../../theme/globalStyles';
import { XHR_STATE } from '../../../../common/constants';

export type TRewardFormProps = {
  index: number,  // rewardIndex
  levelNumber: string,
  levelReward: TLevelReward,
  collatedLevels: { [key: string]: number[] },
  setCollatedLevels: Function,
  currentLevelRewards: number[],
};

const useStyles = makeStyles(theme => createStyles({
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
    // '& .Mui-disabled': {
    //   opacity: 0.4,
    // },
  },
  errorText: {
    color: 'red',
    fontSize: '0.8rem',
    marginTop: 0,
  },
}));

function LevelRewardWrapper(props: TRewardFormProps) {
  const { index, levelNumber, levelReward, collatedLevels, setCollatedLevels, currentLevelRewards} = props;
  const dispatch = useAppDispatch();
  const classes = useStyles();
  const globalClasses = globalStyles();
  const searchParams = useUrlQuery();
  const debugMode = useMemo(() => searchParams.get('debug'), []);
  const {
    deletingLevelRewards,
    levelRewards,
    getAppDetails,
  } = useAppSelector(state => state.appManagementSlice);
  const { rewards } = levelRewards;
  const { selectedApp, isSelectedAppCrypto } = useAppSelector(state => state.gameConfigForm);
  const [showDeleteModal, setShowDeleteModal] = React.useState(false);
  const [rewardType, setRewardType] = React.useState<ERewardTypesForDropDown>(ERewardTypesForDropDown.NONE);
  const [rewardValue, setRewardValue] = React.useState<string>(levelReward.virtualAmount.toString());
  const [rewardValueError, setRewardValueError] = React.useState<boolean>(false);
  const [rewardValueErrorText, setRewardValueErrorText] = React.useState<string>('');
  const [isEdited, setEdited] = React.useState<boolean>(false);
  const [usedRewardTypes, setUsedRewardTypes] = React.useState<Set<ERewardTypesForDropDown>>(new Set<ERewardTypesForDropDown>());
  const defaultRealCurrency = useDefaultRealCurrency();

  React.useEffect(() => {
    if (levelReward) {
      if (levelReward._isNew) {
        setRewardType(ERewardTypesForDropDown.NONE);
        setRewardValue(levelReward.virtualAmount.toString());
      } else {
        switch (levelReward.rewardType) {
          case ERewardType.REAL_CURRENCY: {
            if (levelReward.depositAmount === 0) {
              setRewardType(ERewardTypesForDropDown.BONUS_CASH);
              setRewardValue(levelReward.bonusAmount.toString());
            }
            else {
              setRewardType(ERewardTypesForDropDown.DEPOSIT_CASH);
              setRewardValue(levelReward.depositAmount.toString());
            }
            break;
          }
          case ERewardType.VIRTUAL_CURRENCY: {
            if (levelReward.currencyType === ERewardTypesForDropDown.COIN) {
              setRewardType(ERewardTypesForDropDown.COIN);
            } else {
              setRewardType(ERewardTypesForDropDown.TICKET);
            }
            setRewardValue(levelReward.virtualAmount.toString());
            break;
          }
          default : {
            setRewardType(ERewardTypesForDropDown.NONE);
            setRewardValue('1');
          }
        }
      }
    }

    let set = new Set<ERewardTypesForDropDown>();
    currentLevelRewards.forEach(rewardIndex => {
      if(rewardIndex !== index){
        set.add(getRewardType(rewards[rewardIndex]));
      }
    });
    setUsedRewardTypes(set);

  }, []);

  React.useEffect(() => {
    checkValueFieldsValidity(rewardType, rewardValue);
  }, [rewardType, rewardValue]);

  const getRewardType = (levelReward: TLevelReward) : ERewardTypesForDropDown => {
    if( levelReward._isNew ){
      return ERewardTypesForDropDown.NONE;
    }
    switch (levelReward.rewardType) {
      case ERewardType.REAL_CURRENCY: {
        if (levelReward.depositAmount === 0) {
          return ERewardTypesForDropDown.BONUS_CASH;
        }
        else {
          return ERewardTypesForDropDown.DEPOSIT_CASH;
        }
      }
      case ERewardType.VIRTUAL_CURRENCY: {
        if (levelReward.currencyType === ERewardTypesForDropDown.COIN) {
          return ERewardTypesForDropDown.COIN;
        } else {
          return ERewardTypesForDropDown.TICKET;
        }
      }
      default : return ERewardTypesForDropDown.NONE;
    }
  };

  const createReward = () => {
    dispatch(appManagementDispatchers.createLevelReward(
      selectedApp, getLevelReward(),
      {
        success: (reward: TLevelReward) => {
          //window.location.reload(); // todo using temporary hack
          dispatch(getLevelRewardsSuccess(produce(rewards, draftRewards => {
            const index = draftRewards.map(reward => reward.id).indexOf(levelReward.id);
            if (index >= 0) {
              setCollatedLevels({
                ...collatedLevels,
                [index]: [ ...collatedLevels[index], reward.id ]
              });
              setEdited(false);
              draftRewards[index] = {
                ...levelReward,
                id: reward.id,
                _formTouched: false,
                _isNew: false,
              };
            }
          })));
        },
      }
    ));
  };

  /* const cancelCreate = () => {
    dispatch(getLevelRewardsSuccess(produce(levelRewards.rewards, draftRewards => {
      const index = draftRewards.map(reward => reward.id).indexOf(levelReward.id);
      if (index >= 0) {
        setCollatedLevels({});  // todo this causes expensive rerender
        draftRewards.splice(index, 1);
      }
    })));
  }; */

  const updateReward = () => {
    dispatch(appManagementDispatchers.updateLevelReward(
      selectedApp, getLevelReward(),
      {
        success: (reward: TLevelReward) => {
          //window.location.reload(); // todo using temporary hack
          dispatch(getLevelRewardsSuccess(produce(rewards, draftRewards => {
            const index = draftRewards.map(reward => reward.id).indexOf(levelReward.id);
            if (index >= 0) {
              setEdited(false);
              draftRewards[index] = {
                ...levelReward,
                _formTouched: false
              };
            }
          })));
        },
      }
    ));
  };

  const deleteReward = () => {
    // if (!levelReward) return;
    // const set = { ...usedRewardTypes };
    // set.delete(ERewardTypesForDropDown[levelReward.rewardType] as ERewardTypesForDropDown);
    // setUsedRewardTypes(set);
    if (levelReward._isNew) {
      const deletedR = rewards.findIndex(r => r.id === levelReward.id);
      const newLR: number[] = [ ...collatedLevels[levelNumber] ];
      newLR.splice(newLR.indexOf(deletedR), 1);
      setCollatedLevels({
        ...collatedLevels,
        [levelNumber]: newLR
      });
      dispatch(getLevelRewardsSuccess(produce(rewards, draftRewards => {
        if (deletedR >= 0) {
          draftRewards.splice(deletedR, 1);
        }
      })));
    } else {
      setShowDeleteModal(false);
      dispatch(appManagementDispatchers.deleteLevelReward(
      selectedApp,
      levelReward.id,
      {
        success: () => {
          window.location.reload();  // todo temporary hack
          
          // dispatch(getLevelRewardsSuccess(produce(levelRewards.rewards, draftRewards => {
          //   const index = draftRewards.map(reward => reward.id).indexOf(levelReward.id);
          //   if (index >= 0) {
          //     const newLR: number[] = [ ...collatedLevels[index] ];
          //     newLR.splice(collatedLevels[index].indexOf(levelReward.id), 1);
          //     setCollatedLevels({
          //       ...collatedLevels,
          //       [index]: newLR
          //     });
          //     draftRewards.splice(index, 1);
          //   }
          // })));

          // dispatch(getLevelRewardsSuccess(produce(levelRewards.rewards, draftRewards => {
          //   const level = levelReward.level + 1; // indexing in collatedLevels is 1 based
          //   const index = draftRewards.map(reward => reward.id).indexOf(levelReward.id);
          //   if (level >= 0) {
          //     const newLR: number[] = [ ...collatedLevels[level] ];
          //     newLR.splice(collatedLevels[level.toString()].indexOf(index), 1);
          //     setCollatedLevels({
          //       ...collatedLevels,
          //       [level.toString()]: newLR
          //     });
          //     draftRewards.splice(index, 1);
          //   }
          // })));
        }
      }
    ));
    }
  };

  const handleRewardTypeChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setRewardType(event.target.value as ERewardTypesForDropDown);
    setEdited(true);
  };

  const handleRewardValueChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setRewardValue(event.target.value as string);
    setEdited(true);
  };

  const checkValueFieldsValidity = (type: string, value: string) => {
    if (type === ERewardTypesForDropDown.COIN || type === ERewardTypesForDropDown.TICKET) {
      checkNumericFieldsValidity(value);
    } else if (type === ERewardTypesForDropDown.DEPOSIT_CASH || type === ERewardTypesForDropDown.BONUS_CASH) {
      checkDecimalFieldsValidity(value);
    }
  }

  const checkNumericFieldsValidity = (value: string) => {
    const error = isNumericFieldsValid(value);
    setRewardValueErrorText(error);
    setRewardValueError(error === '' ? false : true);
  }

  const checkDecimalFieldsValidity = (value: string) => {
    const error = isDecimalFieldsValid(value);
    setRewardValueErrorText(error);
    setRewardValueError(error === '' ? false : true);
  }

  const getLevelReward = () : TLevelReward => {
    const reward: TLevelReward = {
      ...levelReward,
      rewardType: rewardTypeForDropDownToRewardTypeConvertor(rewardType) as ERewardType,
      bonusAmount: rewardType === ERewardTypesForDropDown.BONUS_CASH ? parseFloat(rewardValue) : 0,
      depositAmount: rewardType === ERewardTypesForDropDown.DEPOSIT_CASH || defaultRealCurrency ? parseFloat(rewardValue) : 0,
      virtualAmount: (rewardType === ERewardTypesForDropDown.COIN || rewardType === ERewardTypesForDropDown.TICKET ) ? parseInt(rewardValue) : 0,
      currencyType: (rewardType === ERewardTypesForDropDown.TICKET ? ERewardTypesForDropDown.TICKET : rewardType === ERewardTypesForDropDown.COIN ? ERewardTypesForDropDown.COIN : ECost.EMPTY),
    };
    switch (rewardType) {
      case ERewardTypesForDropDown.DEPOSIT_CASH:
        if (isSelectedAppCrypto) {
          reward.title = '<num> Deposit Token';
        } else {
          reward.title = '$<num> Deposit Cash';
        }
        reward.image = '';
        break;
      case ERewardTypesForDropDown.BONUS_CASH:
        reward.image = '';
        reward.title = '$<num> Bonus Cash';
        break;
      case ERewardTypesForDropDown.COIN:
        reward.image = '';
        reward.title = '<num> Coins';
        break;
      case ERewardTypesForDropDown.TICKET:
        reward.image = '';  // todo use TICKET image
        reward.title = '<num> Tickets';
        break;
    }
    return reward;
  }

  return (
    <div className={`${globalClasses.indent} ${classes.rewardBox}`}>

      <div>
        {debugMode === '1' && `ID: ${levelReward.id}`}
        <FormControl className={classes.formControl}>
          <InputLabel id="demo-simple-select-label">Reward Type</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={rewardType}
            onChange={handleRewardTypeChange}
            disabled={!levelReward._isNew}
          >
            {
              ERewardTypesForDropDown.COIN &&
              <MenuItem disabled={usedRewardTypes.has(ERewardTypesForDropDown.COIN)}
                value={ERewardTypesForDropDown.COIN} >
                {ERewardTypesForDropDown.COIN}
              </MenuItem>
            }

            <MenuItem disabled={usedRewardTypes.has(ERewardTypesForDropDown.TICKET)}
                      value={ERewardTypesForDropDown.TICKET} >
                        Ticket
            </MenuItem>
            <MenuItem disabled value={ERewardTypesForDropDown.XX_COINS_15_MINUTES}>2x Coins for 15 min</MenuItem>
            <MenuItem disabled value={ERewardTypesForDropDown.XX_COINS_30_MINUTES}>2x Coins for 30 min</MenuItem>
            <MenuItem disabled={usedRewardTypes.has(ERewardTypesForDropDown.DEPOSIT_CASH)}
                      value={ERewardTypesForDropDown.DEPOSIT_CASH}>
                        Deposit Cash
            </MenuItem>
            {
              !isSelectedAppCrypto &&
              <MenuItem disabled={usedRewardTypes.has(ERewardTypesForDropDown.BONUS_CASH)}
                value={ERewardTypesForDropDown.BONUS_CASH} >
                Bonus Cash
              </MenuItem>
            }
            {/* <MenuItem disabled>XP Points</MenuItem> */}
            <MenuItem disabled value={ERewardTypesForDropDown.XX_XP_15_MINUTES}>2x XP for 15 min</MenuItem>
            <MenuItem disabled value={ERewardTypesForDropDown.XX_XP_30_MINUTES}>2x XP for 30 min</MenuItem>
          </Select>

        </FormControl>

        <FormControl className={`${classes.formControl} ${classes.numberInput}`}>
          <TextField
            // id="filled-error-helper-text"
            label=" "
            value={rewardValue}
            onChange={handleRewardValueChange}
            type="number"
            error={rewardValueError}
          />
        </FormControl>
        {rewardValueErrorText && <p className={classes.errorText}>{rewardValueErrorText}</p>}
      </div>

      {(isEdited || levelReward._isNew) &&
        <IconButton
          disabled={rewardValueError || !rewardType}
          onClick={() => levelReward._isNew ? createReward() : updateReward()}
        >
          <CheckCircle style={{ color: 'blue' }} />
        </IconButton>
      }

      <IconButton
        disabled={deletingLevelRewards.loading === XHR_STATE.IN_PROGRESS}
        onClick={() => levelReward._isNew ? deleteReward() : setShowDeleteModal(true)}
      >
        <RemoveCircle style={{ color: 'red' }} />
      </IconButton>

      <HandyDialog
        open={showDeleteModal}
        title="Delete Confirmation"
        content={
          <Typography>Are you sure you want to delete this level reward?</Typography>
        }
        onClose={() => setShowDeleteModal(false)}
        onOkClick={deleteReward}
        onCancelClick={() => setShowDeleteModal(false)}
      />
    </div>
  );
}

export default LevelRewardWrapper;

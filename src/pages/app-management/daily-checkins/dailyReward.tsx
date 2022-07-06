/* eslint-disable react-hooks/exhaustive-deps */
import {
  createStyles,
  IconButton, TextField
} from '@material-ui/core';
import FormControl from '@material-ui/core/FormControl';
import { makeStyles } from '@material-ui/core/styles';
import {
  RemoveCircle
} from '@material-ui/icons';
import React, { useEffect } from 'react';
import globalStyles from '../../../theme/globalStyles';
import { ECryptoCurrency, ECurrency } from '../../../types/eventTypes';
import { EDailyRewardType, TDailyReward, TDailyRewardProps } from '../appManagementTypes';
import { isDecimalFieldsValid, isNumericFieldsValid } from '../util';
import CurrencyTypeDropdown from './localFormComponents/currencyTypeDropdown';
import RewardTypeDropdown from './localFormComponents/rewardTypeDropdown';
import CurrencyCodeDropdown from './localFormComponents/currencyCodeDropdown';
import { useAppSelector, useDefaultRealCurrency } from '../../../common/hooks';
import { EVirtualCurrencyTypes } from '../../../types/types';

const useStyles = makeStyles((theme) => createStyles({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 100,
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
    marginRight: 4,
  },
  errorText: {
    color: 'red',
    fontSize: '0.8rem',
    marginTop: 0,
  },
}));

function DailyReward(props: TDailyRewardProps) {
  const globalClasses = globalStyles();
  const { isSelectedAppCrypto } = useAppSelector(state => state.gameConfigForm);
  const { rewardSetIndex, slotIndex, slot, dailyRewardIndex, dailyReward, isEditing, updateReward, addError } = props;
  const defaultRealCurrency = useDefaultRealCurrency();
  const [rewardType, setRewardType] = React.useState<EDailyRewardType>(EDailyRewardType.NONE);
  const [rewardValue, setRewardValue] = React.useState<number>(0);
  const [rewardDuration, setRewardDuration] = React.useState<number>(0);
  const [currencyCode, setCurrencyCode] = React.useState<ECurrency | ECryptoCurrency>(isSelectedAppCrypto ? defaultRealCurrency : ECurrency.NOT_AVAILABLE);
  const [currencyType, setCurrencyType] = React.useState<EVirtualCurrencyTypes>(EVirtualCurrencyTypes.COIN);

  const [rewardValueErrorText, setRewardValueErrorText] = React.useState<string>('');
  const [rewardDurationErrorText, setRewardDurationErrorText] = React.useState<string>('');
  const [rewardTypeErrorText, setRewardTypeErrorText] = React.useState<string>('');
  const [currencyTypeErrorText, setCurrencyTypeErrorText] = React.useState<string>('');
  const [currencyCodeErrorText, setCurrencyCodeErrorText] = React.useState<string>('');
  const classes = useStyles();

  useEffect(() => {
    if (dailyReward) {
      setRewardType(dailyReward.dailyRewardType);
      setRewardValue(dailyReward.amount);
      setRewardDuration(dailyReward.duration);
      setCurrencyCode(dailyReward.currencyCode);
      setCurrencyType(Object.values(EVirtualCurrencyTypes).filter(entry => entry === dailyReward.currencyType)[0]);
    }
  }, []);

  useEffect(() => {
    updateReward(rewardSetIndex, slotIndex, dailyRewardIndex, getCurrentRewardState());
    checkValueFieldValidity();
    if (rewardType && (rewardType === EDailyRewardType.XP_MULTIPLIER || rewardType === EDailyRewardType.VIRTUAL_CURRENCY_MULTIPLIER)) {
      checkDurationFieldValidity();
    }
  }, [rewardType, rewardValue, rewardDuration, currencyCode, currencyType]);

  const deleteReward = () => {
    resetAllErrors();
    updateReward(rewardSetIndex, slotIndex, dailyRewardIndex);
  };

  const resetAllErrors = () => {
    if( rewardValueErrorText !== ''){
      addError(-1);
    }
    if( rewardDurationErrorText !== ''){
      addError(-1);
    }
    if( rewardTypeErrorText !== ''){
      addError(-1);
    }
    if( currencyTypeErrorText !== ''){
      addError(-1);
    }
    if( currencyCodeErrorText !== ''){
      addError(-1);
    }
  }

  const getCurrentRewardState = (): TDailyReward => {
    return {
      dailyRewardType: rewardType,
      amount: rewardValue,
      duration: rewardDuration,
      currencyCode: currencyCode,
      currencyType: currencyType !== undefined ? currencyType.toString() : ''
    }
  }

  const handleRewardTypeChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setRewardType(event.target.value as EDailyRewardType);
    resetAllErrors();
    const type =  event.target.value as EDailyRewardType;
    if (type === EDailyRewardType.BONUS_CURRENCY || type === EDailyRewardType.DEPOSIT_CURRENCY) {
      setCurrencyCode(ECurrency.NOT_AVAILABLE);
    } else {
      setCurrencyCode( isSelectedAppCrypto ? defaultRealCurrency : ECurrency.USD);
    }
    setCurrencyType(EVirtualCurrencyTypes.COIN);
    setRewardDuration(0);
  };

  const handleRewardValueChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    if (rewardType === EDailyRewardType.DEPOSIT_CURRENCY || rewardType === EDailyRewardType.BONUS_CURRENCY) {
      setRewardValue(parseFloat(event.target.value as string) as number);
    } else {
      setRewardValue(parseInt(event.target.value as string) as number);
    }
  };

  const handleRewardDurationChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setRewardDuration(parseInt(event.target.value as string) as number);
  };

  const handleCurrencyTypeChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setCurrencyType(event.target.value as EVirtualCurrencyTypes);
  };

  const handleCurrencyCodeChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setCurrencyCode(event.target.value as ECurrency);
  };

  const checkValueFieldValidity = () => {
    let error = '';
    if (rewardType === EDailyRewardType.DEPOSIT_CURRENCY || rewardType === EDailyRewardType.BONUS_CURRENCY) {
      error = isDecimalFieldsValid(rewardValue.toString());
    } else {
      error = isNumericFieldsValid(rewardValue.toString());
    }
    setRewardValueErrorText(error);
    if (error) {
      if (rewardValueErrorText === '') {
        addError(1);
      }
    } else {
      if (rewardValueErrorText !== '') {
        addError(-1);
      }
    }
  };

  const checkDurationFieldValidity = () => {
    const error = isNumericFieldsValid(rewardDuration.toString());
    setRewardDurationErrorText(error);
    if (error) {
      if (rewardDurationErrorText === '') {
        addError(1);
      }
    } else {
      if (rewardDurationErrorText !== '') {
        addError(-1);
      }
    }
  };

  return (
    <div className={`${globalClasses.indent} ${classes.rewardBox}`}>
      <div>
        <RewardTypeDropdown
          dropdownValue={dailyReward.dailyRewardType}
          onChangeHandler={handleRewardTypeChange}
          disabledFlag={!isEditing}
          slot={slot}
          error={rewardTypeErrorText}
          setError={setRewardTypeErrorText}
          addError={addError}
        />

        <FormControl className={`${classes.formControl} ${classes.numberInput}`}>
          <TextField
            label='Value'
            value={dailyReward.amount}
            onChange={handleRewardValueChange}
            type="number"
            error={rewardValueErrorText !== ''}
            disabled={!isEditing}
          />
          {rewardValueErrorText && <p className={classes.errorText}>{rewardValueErrorText}</p>}
        </FormControl>

        {
          rewardType !== EDailyRewardType.NONE &&
          (dailyReward.dailyRewardType === EDailyRewardType.DEPOSIT_CURRENCY ||
            dailyReward.dailyRewardType === EDailyRewardType.BONUS_CURRENCY) &&

          <CurrencyCodeDropdown
            dropdownValue={currencyCode}
            onChangeHandler={handleCurrencyCodeChange}
            disabledFlag={!isEditing}
            slot={slot}
            rewardType={rewardType}
            error={currencyTypeErrorText}
            setError={setCurrencyTypeErrorText}
            addError={addError}
          />
        }

        {
          rewardType !== EDailyRewardType.NONE &&
          dailyReward.dailyRewardType === EDailyRewardType.VIRTUAL_CURRENCY &&

          <CurrencyTypeDropdown
            dropdownValue={Object.values(EVirtualCurrencyTypes).filter(currencyType => currencyType === dailyReward.currencyType)[0]}
            onChangeHandler={handleCurrencyTypeChange}
            disabledFlag={!isEditing}
            error={currencyTypeErrorText}
            setError={setCurrencyTypeErrorText}
            addError={addError}
          />
        }

        {
          rewardType !== EDailyRewardType.NONE &&
          (rewardType === EDailyRewardType.XP_MULTIPLIER ||
            rewardType === EDailyRewardType.VIRTUAL_CURRENCY_MULTIPLIER) &&
          <FormControl className={`${classes.formControl} ${classes.numberInput}`}>
            <TextField
              // id="filled-error-helper-text"
              label="Duration(sec)"
              value={dailyReward.duration}
              onChange={handleRewardDurationChange}
              type="number"
              error={rewardDurationErrorText !== ''}
              disabled={!isEditing}
            />
            {rewardDurationErrorText && <p className={classes.errorText}>{rewardDurationErrorText}</p>}
          </FormControl>

        }

      </div>

      {
        isEditing &&
        <IconButton
          title='Delete the reward'
          onClick={deleteReward}
        >
          <RemoveCircle style={{ color: 'red' }} />
        </IconButton>
      }

    </div>
  );
}

export default DailyReward;

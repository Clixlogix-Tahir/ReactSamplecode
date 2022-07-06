/* eslint-disable react-hooks/exhaustive-deps */
import {
  createStyles,
  MenuItem,
  Select
} from '@material-ui/core';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import { makeStyles } from '@material-ui/core/styles';
import React, { useEffect } from 'react';
import { useAppSelector } from '../../../../common/hooks';
import { ECryptoCurrency, ECurrency } from '../../../../types/eventTypes';
import { EDailyRewardType, TSlot } from '../../appManagementTypes';

const useStyles = makeStyles((theme) => createStyles({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 150,
  },
  errorText: {
    color: 'red',
    fontSize: '0.8rem',
    marginTop: 0,
  },
}));

type TCurrencyCodeDropdownProps = {
  dropdownValue: ECurrency | ECryptoCurrency;
  onChangeHandler: (event: React.ChangeEvent<{ name?: string | undefined; value: unknown; }>, child: React.ReactNode) => void;
  disabledFlag: boolean;
  slot: TSlot;
  rewardType: EDailyRewardType;
  error: string;
  setError: Function;
  addError: Function;
};

const CurrencyCodeDropdown: React.FC<TCurrencyCodeDropdownProps> = ({ dropdownValue, onChangeHandler, disabledFlag, error, setError, addError, slot, rewardType }) => {
  const classes = useStyles();
  const {
    isSelectedAppCrypto,
    selectedAppObj
  } = useAppSelector(state => state.gameConfigForm);

  useEffect(() => {
    if (dropdownValue && dropdownValue === ECurrency.NOT_AVAILABLE) {
      setError('Please select a currency code');
      addError(1);
    } else {
      if (error !== '') {
        setError('');
        addError(-1);
      }
    }
  }, [dropdownValue]);

  return (
    <FormControl className={classes.formControl}>
      <InputLabel id="demo-simple-select-label">Currency Code</InputLabel>
      {
        !isSelectedAppCrypto &&
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={dropdownValue}
          onChange={onChangeHandler}
          disabled={disabledFlag}
          error={error !== ''}
        >
          {/* {
            Object.values(ECurrency).filter(currencyCode => currencyCode !== ECurrency.NOT_AVAILABLE).map((currencyCode, index) => (
              <MenuItem
                value={currencyCode}
                disabled={slot.dailyRewards.filter(dailyReward => 
                  (dailyReward.dailyRewardType === EDailyRewardType.DEPOSIT_CURRENCY || dailyReward.dailyRewardType === EDailyRewardType.BONUS_CURRENCY ) 
                  && dailyReward.currencyCode === currencyCode).length > 1}
              >
                {currencyCode}
              </MenuItem>
              
            ))
          } */}

          <MenuItem
            value={ECurrency.USD}
            disabled={slot.dailyRewards.filter(dailyReward =>
              dailyReward.dailyRewardType === rewardType
              && dailyReward.currencyCode === ECurrency.USD).length > 0}
          >
            {ECurrency.USD}
          </MenuItem>

          <MenuItem
            value={ECurrency.INR}
            disabled={slot.dailyRewards.filter(dailyReward =>
              dailyReward.dailyRewardType === rewardType
              && dailyReward.currencyCode === ECurrency.INR).length > 0}
          >
            {ECurrency.INR}
          </MenuItem>

          <MenuItem
            value={ECurrency.BRL}
            disabled={slot.dailyRewards.filter(dailyReward =>
              dailyReward.dailyRewardType === rewardType
              && dailyReward.currencyCode === ECurrency.BRL).length > 0}
          >
            {ECurrency.BRL}
          </MenuItem>

          <MenuItem
            value={ECurrency.EUR}
            disabled={slot.dailyRewards.filter(dailyReward =>
              dailyReward.dailyRewardType === rewardType
              && dailyReward.currencyCode === ECurrency.EUR).length > 0}
          >
            {ECurrency.EUR}
          </MenuItem>

          <MenuItem
            value={ECurrency.GGP}
            disabled={slot.dailyRewards.filter(dailyReward =>
              dailyReward.dailyRewardType === rewardType
              && dailyReward.currencyCode === ECurrency.GGP).length > 0}
          >
            {ECurrency.GGP}
          </MenuItem>

          <MenuItem
            value={ECurrency.PHP}
            disabled={slot.dailyRewards.filter(dailyReward =>
              dailyReward.dailyRewardType === rewardType
              && dailyReward.currencyCode === ECurrency.PHP).length > 0}
          >
            {ECurrency.PHP}
          </MenuItem>
        </Select>

      }

      {
        isSelectedAppCrypto &&
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={dropdownValue}
          onChange={onChangeHandler}
          disabled={disabledFlag}
          error={error !== ''}
        >
          {selectedAppObj.serverParams.realCryptoCurrency.map(currency =>
            <MenuItem
              key={currency}
              value={currency}
              disabled={slot.dailyRewards.filter(dailyReward =>
                dailyReward.dailyRewardType === rewardType
                && dailyReward.currencyCode === currency).length > 0}
            >
              {currency}
            </MenuItem>
          )}
        </Select>

      }


      <p className={classes.errorText}>{error}</p>
    </FormControl>
  );
}

export default CurrencyCodeDropdown;

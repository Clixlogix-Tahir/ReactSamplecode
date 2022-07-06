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
import { ECurrency } from '../../../../types/eventTypes';
import { EDailyRewardType, TSlot } from '../../appManagementTypes';
import { useAppSelector } from '../../../../common/hooks';

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

type TRewardTypeDropdownProps = {
  dropdownValue: EDailyRewardType;
  onChangeHandler: (event: React.ChangeEvent<{ name?: string | undefined; value: unknown; }>, child: React.ReactNode) => void;
  disabledFlag: boolean;
  slot: TSlot;
  error: string;
  setError: Function;
  addError: Function;
};

const RewardTypeDropdown: React.FC<TRewardTypeDropdownProps> = ({ dropdownValue, onChangeHandler, disabledFlag, slot, error, setError, addError }) => {
  const classes = useStyles();
  const { isSelectedAppCrypto } = useAppSelector(state => state.gameConfigForm);
  //const [error, setError] = useState<string>('');

  useEffect(() => {
    if (dropdownValue === EDailyRewardType.NONE) {
      setError('Please select a reward type.');
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
      <InputLabel id="demo-simple-select-label">Reward Type</InputLabel>
      <Select
        labelId="demo-simple-select-label"
        id="demo-simple-select"
        value={dropdownValue}
        onChange={onChangeHandler}
        disabled={disabledFlag}
        error={error !== ''}
      >

        {
          !isSelectedAppCrypto &&
          <MenuItem
            disabled={slot.dailyRewards.filter(dailyReward =>
            (dailyReward.dailyRewardType !== dropdownValue &&
              dailyReward.dailyRewardType === EDailyRewardType.DEPOSIT_CURRENCY)).length >= Object.values(ECurrency).length - 1}
            value={EDailyRewardType.DEPOSIT_CURRENCY}
          >
            {EDailyRewardType.DEPOSIT_CURRENCY}
          </MenuItem>
        }

        {
          isSelectedAppCrypto &&
          <MenuItem
            disabled={slot.dailyRewards.filter(dailyReward => (dailyReward.dailyRewardType !== dropdownValue && dailyReward.dailyRewardType === EDailyRewardType.DEPOSIT_CURRENCY)).length > 0}
            value={EDailyRewardType.DEPOSIT_CURRENCY}
          >
            {EDailyRewardType.DEPOSIT_CURRENCY}
          </MenuItem>
        }


        {!isSelectedAppCrypto &&
          <MenuItem
            disabled={slot.dailyRewards.filter(dailyReward =>
            (dailyReward.dailyRewardType !== dropdownValue &&
              dailyReward.dailyRewardType === EDailyRewardType.BONUS_CURRENCY)).length >= Object.values(ECurrency).length - 1}
            value={EDailyRewardType.BONUS_CURRENCY}
          >
            {EDailyRewardType.BONUS_CURRENCY}
          </MenuItem>
        }

        <MenuItem
          disabled={slot.dailyRewards.filter(dailyReward => (dailyReward.dailyRewardType !== dropdownValue && dailyReward.dailyRewardType === EDailyRewardType.VIRTUAL_CURRENCY)).length > 1}
          value={EDailyRewardType.VIRTUAL_CURRENCY}
        >
          {EDailyRewardType.VIRTUAL_CURRENCY}
        </MenuItem>

        <MenuItem
          disabled={slot.dailyRewards.filter(dailyReward => (dailyReward.dailyRewardType !== dropdownValue && dailyReward.dailyRewardType === EDailyRewardType.ABSOLUTE_XP)).length > 0}
          value={EDailyRewardType.ABSOLUTE_XP}
        >
          {EDailyRewardType.ABSOLUTE_XP}
        </MenuItem>

        <MenuItem
          disabled={slot.dailyRewards.filter(dailyReward => (dailyReward.dailyRewardType !== dropdownValue && dailyReward.dailyRewardType === EDailyRewardType.XP_MULTIPLIER)).length > 0}
          value={EDailyRewardType.XP_MULTIPLIER}
        >
          {EDailyRewardType.XP_MULTIPLIER}
        </MenuItem>

        <MenuItem
          disabled={slot.dailyRewards.filter(dailyReward => (dailyReward.dailyRewardType !== dropdownValue && dailyReward.dailyRewardType === EDailyRewardType.VIRTUAL_CURRENCY_MULTIPLIER)).length > 0}
          value={EDailyRewardType.VIRTUAL_CURRENCY_MULTIPLIER}
        >
          {EDailyRewardType.VIRTUAL_CURRENCY_MULTIPLIER}
        </MenuItem>

        <MenuItem
          disabled={slot.dailyRewards.filter(dailyReward => (dailyReward.dailyRewardType !== dropdownValue && dailyReward.dailyRewardType === EDailyRewardType.CP_POINTS)).length > 0}
          value={EDailyRewardType.CP_POINTS}
        >
          {EDailyRewardType.CP_POINTS}
        </MenuItem>

      </Select>
      <p className={classes.errorText}>{error}</p>

    </FormControl>
  );
}

export default RewardTypeDropdown;

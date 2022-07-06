/* eslint-disable react-hooks/exhaustive-deps */
import {
  FormControl,
  IconButton,
  Input,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography
} from '@material-ui/core';
import React, { useMemo } from 'react';
import { Trash } from 'react-feather';
import {
  useAppSelector, useRealCryptoCurrencies
} from '../../../common/hooks';
import WithAddDelete from '../../../components/with-add-delete';
import globalStyles from '../../../theme/globalStyles';
import { ECurrency } from '../../../types/eventTypes';
import { EChallengeDailyRewardType, TChallengeRewardFields } from '../challenges-types';

type TChallengeRewardListOptions = {
  disabled?: boolean;
  onChange: (
    options: {
      event: React.ChangeEvent<{ value: unknown }>,
      rewardIndex: number,
    }
  ) => void;
};

export type TChallengeRewardListProps = {
  rewardsList: TChallengeRewardFields[];
  options: {
    dailyRewardType: TChallengeRewardListOptions;
    amount: TChallengeRewardListOptions;
    currencyCode: TChallengeRewardListOptions;
    currencyType: TChallengeRewardListOptions;
    duration: TChallengeRewardListOptions;
    addFn: () => void;
    deleteFn: (rewardIndex: number) => void;
  }
};

/**
 * @description generic rewardlist component
 */
function ChallengeRewardList({ rewardsList, options }: TChallengeRewardListProps) {
  const globalClasses = globalStyles();
  const {
    apps,
    selectedApp,
    isSelectedAppCrypto,
  } = useAppSelector(state => state.gameConfigForm);
  const realCryptoCurrencyMemo = useRealCryptoCurrencies();
  const memoizedVirtualCurrencies = useMemo(() => {
    return apps.list.find(app => app.appId === selectedApp)?.serverParams['virtual.currency'] || [];
  }, [selectedApp,apps]);

  return (
    <div>
      <Typography variant="h5">Reward Details</Typography>
      <WithAddDelete
        addDisabled={options.amount.disabled}
        nameOfResource="reward in level"
        addFn={() => {
          options.addFn();
        }}
        deleteFn={() => {
          // options.deleteFn(rewardIndex);
        }}
      >
        {rewardsList.map((reward, rewardIndex) =>
          <div className="indent" key={`reward-${rewardIndex}`}>
            <div className={globalClasses.spaceBetween}>
              <Typography variant="h6">Reward Detail {rewardIndex + 1}</Typography>
              <IconButton
                aria-label="delete"
                disabled={options.amount.disabled}
                onClick={e => options.deleteFn(rewardIndex)}
                // onMouseDown={handleMouseDownPassword}
              >
                <Trash />
              </IconButton>
            </div>
            <FormControl>
              <TextField
                id={`field-challenge-clr-rl-amount-${rewardIndex}`}
                label="Amount"
                helperText={reward.amount.error}
                type="number"
                inputProps={{ min: 0 }}
                value={reward.amount.value}
                error={reward.amount.error !== ''}
                disabled={options.amount.disabled}
                onChange={(event: React.ChangeEvent<{ value: unknown }>) => {
                  options.amount.onChange({ event, rewardIndex });
                }}
              />
            </FormControl>
            <FormControl>
              <TextField
                id={`field-challenge-clr-rl-duration-${rewardIndex}`}
                label="Duration"
                helperText={reward.duration.error}
                type="number"
                inputProps={{ min: 0 }}
                value={reward.duration.value}
                error={reward.duration.error !== ''}
                disabled={options.duration.disabled}
                onChange={(event: React.ChangeEvent<{ value: unknown }>) => {
                  options.duration.onChange({ event, rewardIndex });
                }}
              />
            </FormControl>
            <FormControl>
              <InputLabel htmlFor={`field-challenge-clr-rl-dailyRewardType-${rewardIndex}`}>
                Reward type
              </InputLabel>
              <Select
                input={
                  <Input name={`field-challenge-clr-rl-dailyRewardType-${rewardIndex}`}
                    id={`field-challenge-clr-rl-dailyRewardType-${rewardIndex}`} />
                }
                value={reward.dailyRewardType.value}
                error={reward.dailyRewardType.error !== ''}
                disabled={options.dailyRewardType.disabled}
                onChange={(event: React.ChangeEvent<{ value: unknown }>) => {
                  options.dailyRewardType.onChange({ event, rewardIndex });
                }}
              >
                {Object.values(EChallengeDailyRewardType)
                  .filter(type => !(isSelectedAppCrypto && type === EChallengeDailyRewardType.BonusCurrency))
                  .map(option =>
                  <MenuItem value={option} key={option}>{option}</MenuItem>)}
              </Select>
            </FormControl>
            <FormControl>
              <InputLabel htmlFor={`field-challenge-clr-rl-currencyCode-${rewardIndex}`}>
                Currency code
              </InputLabel>
              <Select
                input={
                  <Input name={`field-challenge-clr-rl-currencyCode-${rewardIndex}`}
                    id={`field-challenge-clr-rl-currencyCode-${rewardIndex}`} />
                }
                value={reward.currencyCode.value}
                error={reward.currencyCode.error !== ''}
                disabled={options.currencyCode.disabled}
                onChange={(event: React.ChangeEvent<{ value: unknown }>) => {
                  options.currencyCode.onChange({ event, rewardIndex });
                }}
              >
                {!isSelectedAppCrypto && Object.keys(ECurrency).filter(c => c !== ECurrency.NOT_AVAILABLE).map(option =>
                  <MenuItem value={option} key={option}>{option}</MenuItem>)}

                {isSelectedAppCrypto && realCryptoCurrencyMemo.map(currency =>
                  <MenuItem
                    key={currency}
                    value={currency}
                  >
                    {currency}
                  </MenuItem>
                )}

              </Select>
            </FormControl>
            {![
              EChallengeDailyRewardType.AbsoluteXP,
              EChallengeDailyRewardType.BonusCurrency,
              EChallengeDailyRewardType.CPPoints,
              EChallengeDailyRewardType.DepositCurrency,
              EChallengeDailyRewardType.NoReward,
              EChallengeDailyRewardType.XPMultiplier,
              EChallengeDailyRewardType.PercentXP,
            ].includes(reward.dailyRewardType.value) &&
              <FormControl>
                <InputLabel htmlFor={`field-challenge-clr-rl-currencyType-${rewardIndex}`}>
                  Currency type
                </InputLabel>
                <Select
                  input={
                    <Input name={`field-challenge-clr-rl-currencyType-${rewardIndex}`}
                      id={`field-challenge-clr-rl-currencyType-${rewardIndex}`} />
                  }
                  value={reward.currencyType.value}
                  error={reward.currencyType.error !== ''}
                  disabled={options.currencyType.disabled}
                  onChange={(event: React.ChangeEvent<{ value: unknown }>) => {
                    options.currencyType.onChange({ event, rewardIndex });
                  }}
                >
                {memoizedVirtualCurrencies.map(curr =>
                  <MenuItem value={curr.currencyName} key={curr.currencyName}>{curr.currencyName}</MenuItem>)}
                </Select>
              </FormControl>
            }
          </div>
        )}
      </WithAddDelete>
    </div>
  );
}

export default ChallengeRewardList;

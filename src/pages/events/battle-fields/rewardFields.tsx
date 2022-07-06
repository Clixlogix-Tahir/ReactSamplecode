/* eslint-disable react-hooks/exhaustive-deps */
import { Button, Checkbox, Divider, FormControl, FormControlLabel, IconButton, Input,
  InputLabel, MenuItem, Select, TextField, Typography
} from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import { Alert } from '@material-ui/lab';
import produce from 'immer';
import React, { Fragment, useMemo } from 'react';
import {
  useAppDispatch,
  useAppSelector,
  useDefaultRealCurrency,
  useRealCryptoCurrencies
} from '../../../common/hooks';
import { isInternalUser } from '../../../common/utils';
import { countryToCurrency, ECost, ECountryCode, ECurrency, TMutateProps, TVirtualRewardFields} from '../../../types/eventTypes';
import { setEventForm } from '../eventSlice';

function RewardFields({ mutateMode }: TMutateProps) {
  const dispatch = useAppDispatch();
  const { eventForm } = useAppSelector(state => state.eventSlice);
  const { userGoogleProfile } = useAppSelector(state => state.globalSlice);
  const {
    apps,
    selectedApp,
    isSelectedAppCrypto,
  } = useAppSelector(state => state.gameConfigForm);
  const numberField = { value: 0, error: '', required: false };
  // todo move defaultVirtualReward to slice
  const [defaultVirtualReward, setDefaultVirtualReward] = React.useState<TVirtualRewardFields>({
    amount: { ...numberField, value: 1 },
    currencyType: { ...numberField, value: apps.list.find(app => app.appId === selectedApp)?.serverParams['virtual.currency'][0].currencyName as ECost },
  });
  const defaultRealCurrency = useDefaultRealCurrency();
  const realCryptoCurrencyMemo = useRealCryptoCurrencies();
  const memoizedVirtualCurrencies = useMemo(() => {
    return apps.list.find(app => app.appId === selectedApp)?.serverParams['virtual.currency'] || [];
  }, [selectedApp, apps]);

  React.useEffect(() => {
    setDefaultVirtualReward({
      ...defaultVirtualReward,
      currencyType: {
        ...defaultVirtualReward.currencyType,
        value: memoizedVirtualCurrencies.length ?
          memoizedVirtualCurrencies[0].currencyName as ECost :
          ECost.NONE
      }
    });
  }, [memoizedVirtualCurrencies]);

  return (
    <Fragment>
      {userGoogleProfile && isInternalUser(userGoogleProfile.email) &&
      <div style={{ borderRadius: 3, border: 'solid 1px #ccc', padding: 8, marginBottom: '2rem' }}>
        <Typography variant="subtitle2">For Internal Users Only</Typography>
        {eventForm.additionalParams.playerCountToRewardList &&
          Object.keys(eventForm.additionalParams.playerCountToRewardList).map((rewardKey, rewardKeyIndex) =>
          <div className="indent" key={`playerCount-${rewardKey}`}>
            {!Object.keys(eventForm.additionalParams.playerCountToRewardList).length &&
              <Alert severity="info" style={{ marginBottom: '1rem' }}>No real rewards yet.</Alert>}
            {/* start inner reward */}
            {eventForm.additionalParams.playerCountToRewardList[rewardKey].map((reward, rInnerIndex) =>
              <div className="indent" key={`inner-reward-${rInnerIndex}`}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="subtitle2">{rInnerIndex + 1}. Reward for Rank Range</Typography>
                  <Button
                    variant="outlined"
                    size="small"
                    aria-label="delete reward for rank range"
                    disabled={mutateMode === 'View'}
                    onClick={e => {
                      dispatch(setEventForm(produce(eventForm, draftForm => {
                        draftForm.additionalParams.playerCountToRewardList[rewardKey].splice(rInnerIndex, 1);
                      })));
                    }}
                  >
                    <DeleteIcon />
                    Reward
                  </Button>
                </div>
                {/* reward type selection */}

                <div>
                  {/* min rank */}
                  <FormControl style={{ display: 'inline-block', marginBottom: 0 }}>
                    <TextField
                      style={{ width: 100, marginBottom: 0 }}
                      id={`field-min-rank-value-${rInnerIndex}`}
                      label="Min rank"
                      value={reward.minRank.value}
                      error={Boolean(reward.minRank.error)}
                      helperText={reward.minRank.error}
                      disabled={mutateMode === 'View'}
                      onChange={(e: React.ChangeEvent<{ value: unknown }>) => {
                        dispatch(setEventForm(produce(eventForm, draftForm => {
                          const { minRank } = draftForm.additionalParams.playerCountToRewardList[rewardKey][rInnerIndex];
                          minRank.value = e.target.value as number;
                          minRank.error =
                            parseInt(e.target.value as string) > parseInt(reward.minRank.value + '') ?
                            `Min rank should be less than or equal to max rank.` :
                            '';
                        })));
                      }}
                      type="number"
                      inputProps={{ min: 1 }}
                    />
                  </FormControl>
                  
                  {/* max rank */}
                  <FormControl style={{ display: 'inline-block', marginBottom: 0 }}>
                    <TextField
                      style={{ width: 100, marginBottom: 0 }}
                      id={`field-max-rank-${rInnerIndex}`}
                      label="Max rank"
                      // value={eventForm.additionalParams.playerCountToRewardList[playerCount][rrIndex].maxRank.value}
                      value={reward.maxRank.value}
                      error={Boolean(reward.maxRank.error)}
                      helperText={reward.maxRank.error}
                      disabled={mutateMode === 'View'}
                      onChange={(e: React.ChangeEvent<{ value: unknown }>) => {
                        dispatch(setEventForm(produce(eventForm, draftForm => {
                          const { maxRank } = draftForm.additionalParams.playerCountToRewardList[rewardKey][rInnerIndex];
                          maxRank.value = e.target.value as number;
                          maxRank.error =
                            parseInt(e.target.value as string) < parseInt(reward.minRank.value + '') ?
                            `Max rank should be greater than or equal to min rank.` :
                            '';
                        })));
                      }}
                      type="number"
                      inputProps={{ min: 1 }}
                    />
                  </FormControl>
                </div>
                {/* start real reward */}
                <FormControlLabel
                  labelPlacement="start"
                  control={
                    <Checkbox
                      inputProps={{ 'aria-label': 'hasRealReward' }}
                      checked={Boolean(eventForm.additionalParams.playerCountToRewardList[rewardKey][rInnerIndex].realReward)}
                      disabled={mutateMode === 'View'}
                      onChange={(e: React.ChangeEvent<{ checked: boolean }>) => {
                        if (eventForm.additionalParams.playerCountToRewardList[rewardKey][rInnerIndex].realReward) {
                          dispatch(setEventForm(produce(eventForm, draftForm => {
                            delete draftForm.additionalParams.playerCountToRewardList[rewardKey][rInnerIndex].realReward;
                          })));
                        } else {
                          dispatch(setEventForm(produce(eventForm, draftForm => {
                            draftForm.additionalParams.playerCountToRewardList[rewardKey][rInnerIndex].realReward = {
                              winningAmount: {
                                amount: { ...numberField },
                                currency: { error: '', required: true, value: isSelectedAppCrypto ? defaultRealCurrency : countryToCurrency[eventForm.enabledCountryCodes.value[0] as ECountryCode] }
                              },
                              bonusAmount: {
                                amount: { ...numberField },
                                currency: { error: '', required: true, value: isSelectedAppCrypto ? defaultRealCurrency : countryToCurrency[eventForm.enabledCountryCodes.value[0] as ECountryCode] }
                              },
                            };
                          })));
                        }
                      }}
                      name="hasRealReward"
                      color="primary"
                    />
                  }
                  label="Real reward"
                />
                {reward.realReward &&
                  <div className="indent">
                    <p>Winning:</p>
                    <FormControl style={{ display: 'inline-block', marginBottom: 0 }}>
                      <TextField
                        style={{ width: 100, marginBottom: 0 }}
                        id={`field-rr-amount-win`}
                        label="Amount"
                        value={reward.realReward?.winningAmount.amount.value}
                        error={reward.realReward?.winningAmount.amount.error !== ''}
                        disabled={mutateMode === 'View'}
                        onChange={(e: React.ChangeEvent<{ value: unknown }>) => {
                          dispatch(setEventForm(produce(eventForm, draftForm => {
                            const { realReward } = draftForm.additionalParams.playerCountToRewardList[rewardKey][rInnerIndex]
                            if (realReward) {
                              realReward.winningAmount.amount.value = e.target.value as number;
                            }
                          })));
                        }}
                        type="number"
                        inputProps={{ min: 0 }}
                      />
                    </FormControl>
                    <FormControl style={{ display: 'inline-block', marginBottom: 0 }}>
                      <InputLabel htmlFor={`event-real-reward-win-currency-${rInnerIndex}`}>Currency</InputLabel>
                      <Select
                        style={{ width: 100 }}
                        input={
                          <Input name={`event-real-reward-win-currency-${rInnerIndex}`}
                            id={`event-real-reward-win-currency-${rInnerIndex}`} />
                        }
                        value={reward.realReward?.winningAmount.currency.value}
                        error={reward.realReward?.winningAmount.currency.error !== ''}
                        disabled={mutateMode === 'View'}
                        onChange={(e: React.ChangeEvent<{ value: unknown }>) => {
                          dispatch(setEventForm(produce(eventForm, draftForm => {
                            const { realReward } = draftForm.additionalParams.playerCountToRewardList[rewardKey][rInnerIndex]
                            if (realReward) {
                              realReward.winningAmount.currency.value = e.target.value as ECurrency;
                            }
                          })));
                        }}
                      >
                      {!isSelectedAppCrypto && Object.keys(ECurrency).map(curr =>
                        <MenuItem value={curr} key={curr}>{curr}</MenuItem>)}
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
                  {
                    !isSelectedAppCrypto &&
                    <>
                      <p>Bonus:</p>
                      <FormControl style={{ display: 'inline-block', marginBottom: 0 }}>
                        <TextField
                          style={{ width: 100, marginBottom: 0 }}
                          id={`field-rr-amount-bonus-${rInnerIndex}`}
                          label="Amount"
                          value={reward.realReward?.bonusAmount.amount.value}
                          error={reward.realReward?.bonusAmount.amount.error !== ''}
                          disabled={mutateMode === 'View'}
                          onChange={(e: React.ChangeEvent<{ value: unknown }>) => {
                            dispatch(setEventForm(produce(eventForm, draftForm => {
                              const { realReward } = draftForm.additionalParams.playerCountToRewardList[rewardKey][rInnerIndex]
                              if (realReward) {
                                realReward.bonusAmount.amount.value = e.target.value as number;
                              }
                            })));
                          }}
                          type="number"
                          inputProps={{ min: 0 }}
                        />
                      </FormControl>
                      <FormControl style={{ display: 'inline-block', marginBottom: 0 }}>
                        <InputLabel htmlFor={`event-real-reward-win-currency`}>Currency</InputLabel>
                        <Select
                          style={{ width: 100 }}
                          input={
                            <Input name={`event-real-reward-win-currency`}
                              id={`event-real-reward-win-currency`} />
                          }
                          value={reward.realReward?.bonusAmount.currency.value}
                          error={reward.realReward?.bonusAmount.currency.error !== ''}
                          disabled={mutateMode === 'View'}
                          onChange={(e: React.ChangeEvent<{ value: unknown }>) => {
                            dispatch(setEventForm(produce(eventForm, draftForm => {
                              const { realReward } = draftForm.additionalParams.playerCountToRewardList[rewardKey][rInnerIndex]
                              if (realReward) {
                                realReward.bonusAmount.currency.value = e.target.value as ECurrency;
                              }
                            })));
                          }}
                        >
                          {Object.keys(ECurrency).map(curr =>
                            <MenuItem value={curr} key={curr}>{curr}</MenuItem>)}
                        </Select>
                      </FormControl>
                    </>
                  }
                  </div>
                }
                {/* end real reward */}

                <FormControlLabel
                  labelPlacement="start"
                  control={
                    <Checkbox
                      inputProps={{ 'aria-label': 'hasVirtualReward' }}
                      checked={Boolean(eventForm.additionalParams.playerCountToRewardList[rewardKey][rInnerIndex].virtualRewards)}
                      disabled={mutateMode === 'View'}
                      onChange={(e: React.ChangeEvent<{ checked: boolean }>) => {
                        if (eventForm.additionalParams.playerCountToRewardList[rewardKey][rInnerIndex].virtualRewards) {
                          dispatch(setEventForm(produce(eventForm, draftForm => {
                            delete draftForm.additionalParams.playerCountToRewardList[rewardKey][rInnerIndex].virtualRewards;
                          })));
                        } else {
                          dispatch(setEventForm(produce(eventForm, draftForm => {
                            draftForm.additionalParams.playerCountToRewardList[rewardKey][rInnerIndex].virtualRewards = [{ ...defaultVirtualReward }];
                          })));
                        }
                      }}
                      name="hasVirtualReward"
                      color="primary"
                    />
                  }
                  label="Virtual reward"
                />
                {/* start virtual reward */}
                {reward.virtualRewards &&
                reward.virtualRewards?.map((vReward, vrIndex) =>
                  <div className="indent" key={`virtualRewards-amount-field-${vrIndex}`}>
                    <Typography variant="subtitle2">{rInnerIndex + 1}.{vrIndex + 1} Virtual Reward {vrIndex}</Typography>
                    <FormControl style={{ display: 'inline-block', marginBottom: 0 }}>
                    <TextField
                      style={{ width: 100, marginBottom: 0 }}
                      id={`field-vr-amount-${rewardKeyIndex}`}
                      label="Amount"
                      value={vReward.amount.value}
                      error={vReward.amount.error !== ''}
                      helperText={vReward.amount.error}
                      disabled={mutateMode === 'View'}
                      onChange={(e: React.ChangeEvent<{ value: unknown }>) => {
                        dispatch(setEventForm(produce(eventForm, draftForm => {
                          const { virtualRewards } = draftForm.additionalParams.playerCountToRewardList[rewardKey][rInnerIndex]
                          if (virtualRewards) {
                            virtualRewards[vrIndex].amount.value = e.target.value as number;
                            // virtualRewards[vrIndex].amount.error =
                            //   parseInt(e.target.value as string) < 1 ? 'minimum should be 1' : '';
                          }
                        })));
                      }}
                      type="number"
                      inputProps={{ min: 1 }}
                    />
                  </FormControl>
                    <FormControl style={{ display: 'inline-block', marginBottom: 0 }}>
                      <InputLabel htmlFor={`event-virtual-reward-type-${vrIndex}`}>Reward type</InputLabel>
                      <Select
                        style={{ width: 100 }}
                        input={
                          <Input name={`event-virtual-reward-type-${vrIndex}`}
                            id={`event-virtual-reward-type-${vrIndex}`} />
                        }
                        value={vReward.currencyType.value}
                        error={vReward.currencyType.error !== ''}
                        disabled={mutateMode === 'View'}
                        onChange={(e: React.ChangeEvent<{ value: unknown }>) => {
                          dispatch(setEventForm(produce(eventForm, draftForm => {
                            const { virtualRewards } = draftForm.additionalParams.playerCountToRewardList[rewardKey][rInnerIndex]
                            if (virtualRewards) {
                              virtualRewards[vrIndex].currencyType.value = e.target.value as ECost;
                            }
                          })));
                        }}
                      >
                        {memoizedVirtualCurrencies.map(curr =>
                          <MenuItem value={curr.currencyName} key={curr.currencyName}>{curr.currencyName}</MenuItem>)}
                      </Select>
                    </FormControl>
                    <IconButton
                      aria-label="delete VR"
                      disabled={mutateMode === 'View'}
                      onClick={e => {
                        dispatch(setEventForm(produce(eventForm, draftForm => {
                          const { virtualRewards } = draftForm.additionalParams.playerCountToRewardList[rewardKey][rInnerIndex];
                          if (virtualRewards) virtualRewards.splice(vrIndex, 1);
                        })));
                      }}
                      // onMouseDown={handleMouseDownPassword}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </div>
                )
                }
                {reward.virtualRewards &&
                <Button
                  variant="outlined"
                  color="primary"
                  size="small"
                  disabled={mutateMode === 'View'}
                  onClick={e => {
                    dispatch(setEventForm(produce(eventForm, draftForm => {
                      const { virtualRewards } = draftForm.additionalParams.playerCountToRewardList[rewardKey][rInnerIndex];
                      if (virtualRewards) virtualRewards.push(defaultVirtualReward);
                    })));
                  }}
                >
                  Add VR
                </Button>
                }
                {/* end virtual reward */}
              </div>
            )}
            {/* end inner reward */}
            <Divider style={{ margin: '1rem 0' }} />
              {!isSelectedAppCrypto &&
                <Button
                  variant="outlined"
                  color="primary"
                  size="small"
                  disabled={mutateMode === 'View'}
                  onClick={e => {
                    dispatch(setEventForm(produce(eventForm, draftForm => {
                      const pc = eventForm.additionalParams.playerCountToRewardList[rewardKey];
                      draftForm.additionalParams.playerCountToRewardList[rewardKey] = [
                        ...draftForm.additionalParams.playerCountToRewardList[rewardKey],
                        {
                          minRank: { ...numberField, value: pc.length > 0 ? parseInt(pc[pc.length - 1].maxRank.value + '') + 1 : 1 },
                          maxRank: { ...numberField, value: pc.length > 0 ? parseInt(pc[pc.length - 1].maxRank.value + '') + 1 : 1 },
                        }
                      ];
                    })));
                  }}
                >
                  Add Reward
                </Button>}
              {
                isSelectedAppCrypto &&
                <Button
                  variant="outlined"
                  color="primary"
                  size="small"
                  disabled={mutateMode === 'View'}
                  onClick={e => {
                    dispatch(setEventForm(produce(eventForm, draftForm => {
                      const pc = eventForm.additionalParams.playerCountToRewardList[rewardKey];
                      draftForm.additionalParams.playerCountToRewardList[rewardKey] = [
                        ...draftForm.additionalParams.playerCountToRewardList[rewardKey],
                        {
                          minRank: { ...numberField, value: pc.length > 0 ? parseInt(pc[pc.length - 1].maxRank.value + '') + 1 : 1 },
                          maxRank: { ...numberField, value: pc.length > 0 ? parseInt(pc[pc.length - 1].maxRank.value + '') + 1 : 1 },
                          realReward: {
                            winningAmount: {
                              amount: { value: 0, error: '', required: true },
                              currency: { value: defaultRealCurrency, error: '', required: true }
                            },
                            bonusAmount: {
                              amount: { value: 0, error: '', required: true },
                              currency: { value: defaultRealCurrency, error: '', required: true }
                            }
                          }
                        },
                      ];
                    })));
                  }}
                >
                  Add Reward
                </Button>
              }
          </div>
        )}
      </div>
      }
    </Fragment>
  );
}

export default RewardFields;

/* eslint-disable react-hooks/exhaustive-deps */
import {
  Button,
  Checkbox,
  Divider,
  FormControl,
  FormControlLabel,
  IconButton,
  Input,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography
} from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import Alert from '@material-ui/lab/Alert';
import produce from 'immer';
import React from 'react';
import { EVENT_URL_PARAMS } from '../../../common/common-types';
import {
  useAppDispatch,
  useAppSelector,
  useDefaultRealCurrency,
  useRealCryptoCurrencies,
  useUrlQuery
} from '../../../common/hooks';
import { countryToCurrency, ECost, ECountryCode, ECurrency, EEntryType, EEventCategory, TMutateProps } from '../../../types/eventTypes';
import { TFormFieldNumber } from '../../../types/formFields';
import { setEventForm } from '../eventSlice';

function EntryFields({ mutateMode }: TMutateProps) {
  const dispatch = useAppDispatch();
  const searchQuery = useUrlQuery();
  const eventCategoryFromUrl = React.useMemo(() => searchQuery.get(EVENT_URL_PARAMS.type) as EEventCategory || EEventCategory.BATTLE, []);
  const { eventForm } = useAppSelector(state => state.eventSlice);
  const numberField: TFormFieldNumber = {
    value: 0, error: '', required: true,
  }
  const {
    apps,
    selectedApp,
    isSelectedAppCrypto,
  } = useAppSelector(state => state.gameConfigForm);
  const defaultCryptoCurrency = useDefaultRealCurrency();
  const realCryptoCurrencyMemo = useRealCryptoCurrencies();

  // React.useEffect(() => {
  //   if( isSelectedAppCrypto){
  //     eventForm.additionalParams.playerCountToRewardList.map(entry as string => {
  //       entry
  //     });
  //   }
  // },[selectedApp]);
  
  const defaultRealCurrency = React.useMemo(
    () => countryToCurrency[eventForm.enabledCountryCodes.value[0] as ECountryCode],
    [eventForm]
  );
  const defaultVirtualCurrency = React.useMemo(() => {
    return apps.list.find(app => app.appId === selectedApp)?.serverParams['virtual.currency'] || [];
  }, [selectedApp, apps]);

  return (
    <div>
      <Typography variant="h5">Entry Fee Details</Typography>
      {!eventForm.additionalParams.entryFeeList.length &&
      <Alert severity="warning" style={{ marginBottom: '1rem' }}>No entry info yet.</Alert>}
      {eventForm.additionalParams.entryFeeList.map((entryFee, index) =>
        <div className="indent" key={`real-fee-${index}`}>
          <Button
            variant="outlined"
            size="small"
            aria-label="delete entry"
            disabled={mutateMode === 'View'}
            onClick={e => {
              dispatch(setEventForm(produce(eventForm, draftForm => {
                draftForm.additionalParams.entryFeeList.splice(index, 1);
              })));
            }}
          >
            <DeleteIcon />
            Entry
          </Button>
          <FormControlLabel
            labelPlacement="start"
            control={
              <Checkbox
                inputProps={{ 'aria-label': 'hasRealEntry' }}
                checked={Boolean(entryFee.realAmount)}
                disabled={mutateMode === 'View'}
                onChange={(e: React.ChangeEvent<{ checked: boolean }>) => {
                  if (entryFee.realAmount) {
                    dispatch(setEventForm(produce(eventForm, draftForm => {
                      delete draftForm.additionalParams.entryFeeList[index].realAmount;
                    })));
                  } else {
                    dispatch(setEventForm(produce(eventForm, draftForm => {
                      draftForm.additionalParams.entryFeeList[index].realAmount = {
                        amount: { ...numberField },
                        currency: { ...numberField, value: (isSelectedAppCrypto ? defaultCryptoCurrency : defaultRealCurrency) },
                        maxBonusCutPercentage: { ...numberField },
                        maxWinningsCutPercentage: { ...numberField },
                      };
                    })));
                  }
                }}
                name="hasRealEntry"
                color="primary"
              />
            }
            label="Real entry"
          />
          {entryFee.realAmount &&
          <div className="indent">
            <FormControl style={{ display: 'inline-block', marginBottom: 0 }}>
              <TextField
                id="field-entryCostValue"
                label="Entry cost value"
                value={entryFee.realAmount.amount.value}
                error={entryFee.realAmount.amount.error !== ''}
                helperText={entryFee.realAmount.amount.error}
                disabled={mutateMode === 'View'}
                onChange={(e: React.ChangeEvent<{ value: unknown }>) => {
                  dispatch(setEventForm(produce(eventForm, draftForm => {
                    const { realAmount } = draftForm.additionalParams.entryFeeList[index];
                    if (realAmount) {
                      realAmount.amount.value = e.target.value as number;
                      draftForm.additionalParams.entryFeeList[index].realAmount = realAmount;
                    } else {
                      console.warn('realReward is absent');
                    }
                  })));
                }}
                type="number"
                inputProps={{ min: 1 }}
              />
            </FormControl>
            {
              !isSelectedAppCrypto && 
              <FormControl style={{ display: 'inline-block', marginBottom: 0}}>
              <InputLabel htmlFor="field-entryCurrency">Entry currency</InputLabel>
              <Select native
                input={<Input name="entry-currency"
                  id="field-entryCurrency" />}
                value={entryFee.realAmount.currency.value}
                error={entryFee.realAmount.currency.error !== ''}
                // helperText={form.gameId.error}
                disabled={mutateMode === 'View'}
                onChange={(e: React.ChangeEvent<{ value: unknown }>) => {
                  dispatch(setEventForm(produce(eventForm, draftForm => {
                    const { realAmount } = draftForm.additionalParams.entryFeeList[index];
                    if (realAmount) {
                      realAmount.currency.value = e.target.value as ECurrency;
                      draftForm.additionalParams.entryFeeList[index].realAmount = realAmount;
                    } else {
                      console.warn('realReward is absent');
                    }
                  })));
                }}
                inputProps={{ min: 1 }}
              >
                {Object.keys(ECurrency).map(currency =>
                  <option value={currency} key={currency}>{currency}</option>)}
              </Select>
            </FormControl>
            }
            {
              isSelectedAppCrypto && 
              <FormControl style={{ display: 'inline-block', marginBottom: 0, width:'10rem'}}>
              <InputLabel htmlFor="field-entryCurrency">Entry currency</InputLabel>
              <Select
                input={<Input name="entry-currency"
                  id="field-entryCurrency" />}
                value={entryFee.realAmount.currency.value}
                error={entryFee.realAmount.currency.error !== ''}
                // helperText={form.gameId.error}
                disabled={mutateMode === 'View'}
                onChange={(e: React.ChangeEvent<{ value: unknown }>) => {
                  dispatch(setEventForm(produce(eventForm, draftForm => {
                    const { realAmount } = draftForm.additionalParams.entryFeeList[index];
                    if (realAmount) {
                      realAmount.currency.value = e.target.value as ECurrency;
                      draftForm.additionalParams.entryFeeList[index].realAmount = realAmount;
                    } else {
                      console.warn('realReward is absent');
                    }
                  })));
                }}
                inputProps={{ min: 1 }}
              >
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
            }
            {
              !isSelectedAppCrypto &&
              <FormControl style={{ display: 'inline-block', marginBottom: 0 }}>
                <TextField
                  style={{ marginBottom: 0 }}
                  id="field-maxBonusCutPercentage"
                  label="Max bonus cut %"
                  value={entryFee.realAmount.maxBonusCutPercentage.value}
                  error={entryFee.realAmount.maxBonusCutPercentage.error !== ''}
                  type="number"
                  inputProps={{ min: 0 }}
                  helperText={entryFee.realAmount.maxBonusCutPercentage.error}
                  disabled={mutateMode === 'View'}
                  onChange={(e: React.ChangeEvent<{ value: unknown }>) => {
                    dispatch(setEventForm(produce(eventForm, draftForm => {
                      const { realAmount } = draftForm.additionalParams.entryFeeList[index];
                      if (realAmount) {
                        realAmount.maxBonusCutPercentage.value = e.target.value as number;
                        draftForm.additionalParams.entryFeeList[index].realAmount = realAmount;
                      } else {
                        console.warn('realReward is absent');
                      }
                    })));
                  }}
                />
              </FormControl>
            }
          </div>}

          <FormControlLabel
            labelPlacement="start"
            control={
              <Checkbox
                inputProps={{ 'aria-label': 'hasVirtualEntry' }}
                checked={Boolean(entryFee.virtualAmountList)}
                disabled={mutateMode === 'View'}
                onChange={(e: React.ChangeEvent<{ checked: boolean }>) => {
                  if (entryFee.virtualAmountList) {
                    dispatch(setEventForm(produce(eventForm, draftForm => {
                      delete draftForm.additionalParams.entryFeeList[index].virtualAmountList;
                    })));
                  } else {
                    dispatch(setEventForm(produce(eventForm, draftForm => {
                      draftForm.additionalParams.entryFeeList[index].virtualAmountList = [
                        {
                          amount: { ...numberField, value: 1 },
                          currencyType: { ...numberField, value: defaultVirtualCurrency[0].currencyName as ECost || ECost.KEY },
                        }
                      ];
                    })));
                  }
                }}
                name="hasRealEntry"
                color="primary"
              />
            }
            label="Virtual entry"
          />
          {entryFee.virtualAmountList && entryFee.virtualAmountList.map((vef, vefIndex) =>
          <div className="indent" key={`virtual-amount-${index}-${vefIndex}`}>
            <div>
              <FormControl style={{ display: 'inline-block', marginBottom: 0 }}>
                <TextField
                  style={{ marginBottom: 0 }}
                  id={`field-entryVCostValue-${vefIndex}`}
                  label="Entry cost value"
                  value={vef.amount.value}
                  error={vef.amount.error !== ''}
                  helperText={vef.amount.error}
                  disabled={mutateMode === 'View'}
                  onChange={(e: React.ChangeEvent<{ value: unknown }>) => {
                    dispatch(setEventForm(produce(eventForm, draftForm => {
                      const { virtualAmountList } = draftForm.additionalParams.entryFeeList[index];
                      if (virtualAmountList) {
                        virtualAmountList[vefIndex].amount.value = e.target.value as number;
                        // virtualAmountList[vefIndex].amount.error =
                        //   parseInt(e.target.value as string) < 1 ? 'minimum should be 1' : '';
                      } else {
                        console.warn('virtualAmountList is absent');
                      }
                    })));
                  }}
                  type="number"
                  inputProps={{ min: 1 }}
                />
              </FormControl>
              <FormControl style={{ display: 'inline-block', marginBottom: 0, minWidth: 110 }}>
                <InputLabel id="event-currency-type">Currency type</InputLabel>
                <Select
                  label="event-currency-type"
                  value={vef.currencyType.value}
                  error={vef.currencyType.error !== ''}
                  disabled={mutateMode === 'View'}
                  onChange={(e: React.ChangeEvent<{ value: unknown }>) => {
                    dispatch(setEventForm(produce(eventForm, draftForm => {
                      const { virtualAmountList } = draftForm.additionalParams.entryFeeList[index];
                      if (virtualAmountList) {
                        virtualAmountList[vefIndex].currencyType.value = e.target.value as ECost;
                      } else {
                        console.warn('virtualAmountList is absent');
                      }
                    })));
                  }}
                >
                  {defaultVirtualCurrency.map(curr =>
                    <MenuItem value={curr.currencyName} key={curr.currencyName}>{curr.currencyName}</MenuItem>)}
                </Select>
              </FormControl>
              <IconButton
                aria-label="delete entry"
                disabled={mutateMode === 'View'}
                onClick={e => {
                  dispatch(setEventForm(produce(eventForm, draftForm => {
                    draftForm.additionalParams.entryFeeList[index].virtualAmountList?.splice(vefIndex, 1);
                  })));
                }}
              >
                <DeleteIcon />
              </IconButton>
            </div>
            <Button
              variant="outlined"
              color="primary"
              size="small"
              disabled={mutateMode === 'View'}
              onClick={e => {
                dispatch(setEventForm(produce(eventForm, draftForm => {
                  draftForm.additionalParams.entryFeeList[index].virtualAmountList?.push({
                    amount: { ...numberField, value: 1 },
                    currencyType: { ...numberField, value: defaultVirtualCurrency[0].currencyName as ECost || ECost.KEY },
                  });
                })));
              }}
            >
              Add VR
            </Button>
          </div>)}
        </div>
      )}
      <Button
        variant="outlined"
        color="primary"
        size="small"
        disabled={
          mutateMode === 'View' ||
          (eventCategoryFromUrl !== EEventCategory.MULTI_ENTRY_TOURNAMENT &&
            eventForm.additionalParams.entryFeeList.length === 1) ||
          (eventCategoryFromUrl === EEventCategory.CHALLENGE_LEADERBOARD &&
            (eventForm.additionalParams.entryType.value === EEntryType.FREE ||
              eventForm.additionalParams.entryType.value === EEntryType.PASSIVE
            )
          )
        }
        onClick={e => {
          dispatch(setEventForm(produce(eventForm, draftForm => {
            draftForm.additionalParams.entryFeeList.push({});
          })));
        }}
      >
        Add Entry
      </Button>
      <Divider style={{ margin: '1rem 0' }} />
    </div>
  );
}

export default EntryFields;

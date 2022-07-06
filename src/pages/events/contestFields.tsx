import { Button, FormControl, IconButton, Input, InputAdornment,
  InputLabel, MenuItem, Select, TextField
} from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import React, { Fragment } from 'react';
import {
  useAppDispatch,
  useAppSelector
} from '../../common/hooks';
import { ECost, ECurrency, EPlacementLocation } from '../../types/eventTypes';
import { setEventForm } from './eventSlice';

function ContestFields(props: any) {
  const dispatch = useAppDispatch();
  const { eventForm } = useAppSelector(state => state.eventSlice);

  return (
    <Fragment>
      <FormControl>
        <TextField
          id="field-contest-displayName"
          label="displayName*"
          value={eventForm.additionalParams.displayName.value}
          error={eventForm.additionalParams.displayName.error !== ''}
          // helperText={form.gameId.error}
          onChange={(e: React.ChangeEvent<{ value: unknown }>) => {
            dispatch(setEventForm({
              ...eventForm,
              additionalParams: {
                ...eventForm.additionalParams,
                displayName: {
                  ...eventForm.additionalParams.displayName,
                  value: e.target.value as string
                }
              }
            }));
          }}
        />
      </FormControl>
      <FormControl>
        <InputLabel htmlFor="prizeType-field">prizeType*</InputLabel>
        <Select
          input={<Input name="prizeType-f" id="prizeType-field" />}
          // todo
          // value={eventForm.version.value}
          // error={form.version.error !== ''}
          // onClick={e => {
          //   dispatch(setEventForm({
          //     ...eventForm,
          //     additionalParams: {
          //       ...eventForm.additionalParams,
          //       placementDataList: [
          //         ...eventForm.additionalParams.placementDataList,
          //         {
          //           placementLocation: { value: EPlacementLocation.pgBottom, error: '', required: false },
          //           placementPriority: { value: 0, error: '', required: false },
          //         }
          //       ]
          //     }
          //   }));
          // }}
        >
          {Object.keys(ECost).map(cost =>
            <MenuItem value={cost} key={cost}>{cost}</MenuItem>
          )}
        </Select>
      </FormControl>
      <FormControl>
        <TextField
          id="field-contest-imageUrl"
          label="imageUrl*"
          value={eventForm.additionalParams.imageUrl.value}
          // error={form.gameId.error !== ''}
          // helperText={form.gameId.error}
          onChange={(e: React.ChangeEvent<{ value: unknown }>) => {
            dispatch(setEventForm({
              ...eventForm,
              additionalParams: {
                ...eventForm.additionalParams,
                imageUrl: {
                  ...eventForm.additionalParams.imageUrl,
                  value: e.target.value as string
                }
              }
            }));
          }}
        />
      </FormControl>
      {eventForm.additionalParams.entryFee &&
      <Fragment>
      <FormControl>
        <TextField
          name="contest-entryCost-f"
          id="entryCost-field"
          label="Entry cost"
          value={eventForm.additionalParams.entryFee.amount.value}
          error={eventForm.additionalParams.entryFee.amount.error !== ''}
          onChange={(e: React.ChangeEvent<{ value: unknown }>) => {
            if (!eventForm.additionalParams.entryFee) {
              console.warn('eventForm.additionalParams.entryFee is falsy');
              return;
            }
            dispatch(setEventForm({
              ...eventForm,
              additionalParams: {
                ...eventForm.additionalParams,
                entryFee: {
                  ...eventForm.additionalParams.entryFee,
                  amount: {
                    ...eventForm.additionalParams.entryFee.amount,
                    value: e.target.value as number
                  }
                }
              }
            }));
          }}
        />
      </FormControl>
      <FormControl>
        <InputLabel>entryCurrency*</InputLabel>
        <Select
          id="field-entryCurrency"
          value={eventForm.additionalParams.entryFee.currency.value}
          error={eventForm.additionalParams.entryFee.currency.error !== ''}
          // helperText={form.gameId.error}
          onChange={(e: React.ChangeEvent<{ value: unknown }>) => {
            if (!eventForm.additionalParams.entryFee) {
              console.warn('eventForm.additionalParams.entryFee is falsy');
              return;
            }
            dispatch(setEventForm({
              ...eventForm,
              additionalParams: {
                ...eventForm.additionalParams,
                entryFee: {
                  ...eventForm.additionalParams.entryFee,
                  currency: {
                    ...eventForm.additionalParams.entryFee.currency,
                    value: e.target.value as ECurrency
                  }
                }
              }
            }));
          }}
        >
          {Object.keys(ECurrency).map(currency =>
            <MenuItem value={currency} key={currency}>{ currency }</MenuItem>
          )}
        </Select>
      </FormControl>
      </Fragment>
      }
      <FormControl>
        <TextField
          id="field-contest-reward"
          label="reward*"
          // todo
          // value={eventForm.gameId.value}
          // error={form.gameId.error !== ''}
          // helperText={form.gameId.error}
          // onChange={(e: React.ChangeEvent<{ value: unknown }>) => {
          // }}
          type="number"
          inputProps={{ min: 1 }}
        />
      </FormControl>
      <FormControl>
        <TextField
          id="field-contest-entryDescription"
          label="entryDescription*"
          value={eventForm.additionalParams.entryDescription.value}
          error={eventForm.additionalParams.entryDescription.error !== ''}
          // helperText={form.gameId.error}
          onChange={(e: React.ChangeEvent<{ value: unknown }>) => {
            dispatch(setEventForm({
              ...eventForm,
              additionalParams: {
                ...eventForm.additionalParams,
                entryDescription: {
                  ...eventForm.additionalParams.entryDescription,
                  value: e.target.value as string
                }
              }
            }));
          }}
        />
      </FormControl>
      {/* {eventForm.additionalParams.realReward.rewardBuckets.map((bucket, rbIndex) =>
        <div className="indent" key={rbIndex}>
          <FormControl>
            <InputLabel>rewardDistribution min*</InputLabel>
            <Input
              id={`field-contest-rewardDistribution-min-${rbIndex}`}
              value={bucket.minRank.value}
              error={bucket.minRank.error !== ''}
              // helperText={form.gameId.error}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="delete placement data"
                    onClick={e => {
                      const newRewardBuckets = [...eventForm.additionalParams.realReward.rewardBuckets];
                      newRewardBuckets.splice(rbIndex, 1);
                      dispatch(setEventForm({
                        ...eventForm,
                        additionalParams: {
                          ...eventForm.additionalParams,
                          realReward: {
                            ...eventForm.additionalParams.realReward,
                            rewardBuckets: newRewardBuckets
                          }
                        }
                      }));
                    }}
                    // onMouseDown={handleMouseDownPassword}
                  >
                    <DeleteIcon />
                  </IconButton>
                </InputAdornment>
              }
              onChange={(e: React.ChangeEvent<{ value: unknown }>) => {
                const newRewardBuckets = [...eventForm.additionalParams.realReward.rewardBuckets];
                const newBucket = {
                  ...eventForm.additionalParams.realReward.rewardBuckets[rbIndex],
                  minRank: {
                    ...eventForm.additionalParams.realReward.rewardBuckets[rbIndex].minRank,
                    value: e.target.value as number
                  }
                };
                newRewardBuckets.splice(rbIndex, 1);
                newRewardBuckets.splice(rbIndex, 0, newBucket);
                dispatch(setEventForm({
                  ...eventForm,
                  additionalParams: {
                    ...eventForm.additionalParams,
                    realReward: {
                      ...eventForm.additionalParams.realReward,
                      rewardBuckets: newRewardBuckets
                    }
                  }
                }));
              }}
              type="number"
              inputProps={{ min: 1 }}
            />
          </FormControl>
          <FormControl>
            <TextField
              id={`field-contest-rewardDistribution-max-${rbIndex}`}
              label="rewardDistribution max*"
              value={bucket.maxRank.value}
              error={bucket.maxRank.error !== ''}
              // helperText={form.gameId.error}
              onChange={(e: React.ChangeEvent<{ value: unknown }>) => {
                const newRewardBuckets = [...eventForm.additionalParams.realReward.rewardBuckets];
                const newBucket = {
                  ...eventForm.additionalParams.realReward.rewardBuckets[rbIndex],
                  maxRank: {
                    ...eventForm.additionalParams.realReward.rewardBuckets[rbIndex].maxRank,
                    value: e.target.value as number
                  }
                };
                newRewardBuckets.splice(rbIndex, 1);
                newRewardBuckets.splice(rbIndex, 0, newBucket);
                dispatch(setEventForm({
                  ...eventForm,
                  additionalParams: {
                    ...eventForm.additionalParams,
                    realReward: {
                      ...eventForm.additionalParams.realReward,
                      rewardBuckets: newRewardBuckets
                    }
                  }
                }));
              }}
              type="number"
              inputProps={{ min: 1 }}
            />
          </FormControl>
          <FormControl>
            <TextField
              id="field-contest-rewardDistribution-value"
              label="rewardDistribution value*"
              value={bucket.totalRewardAmount.value}
              error={bucket.totalRewardAmount.error !== ''}
              // helperText={form.gameId.error}
              onChange={(e: React.ChangeEvent<{ value: unknown }>) => {
                const newRewardBuckets = [...eventForm.additionalParams.realReward.rewardBuckets];
                const newBucket = {
                  ...eventForm.additionalParams.realReward.rewardBuckets[rbIndex],
                  totalRewardAmount: {
                    ...eventForm.additionalParams.realReward.rewardBuckets[rbIndex].totalRewardAmount,
                    value: e.target.value as number
                  }
                };
                newRewardBuckets.splice(rbIndex, 1);
                newRewardBuckets.splice(rbIndex, 0, newBucket);
                dispatch(setEventForm({
                  ...eventForm,
                  additionalParams: {
                    ...eventForm.additionalParams,
                    realReward: {
                      ...eventForm.additionalParams.realReward,
                      rewardBuckets: newRewardBuckets
                    }
                  }
                }));
              }}
              type="number"
              inputProps={{ min: 1 }}
            />
          </FormControl>
        </div>
      )}
      <Button
        variant="outlined"
        color="primary"
        style={{ marginBottom: '2rem' }}
        onClick={e => {
          dispatch(setEventForm({
            ...eventForm,
            additionalParams: {
              ...eventForm.additionalParams,
              realReward: {
                ...eventForm.additionalParams.realReward,
                rewardBuckets: [
                  ...eventForm.additionalParams.realReward.rewardBuckets,
                  {
                    minRank: { value: 0, error: '', required: true },
                    maxRank: { value: 0, error: '', required: true },
                    totalRewardAmount: { value: 0, error: '', required: true },
                    minTotalEntry: { value: 0, error: '', required: true },
                  }
                ]
              }
            }
          }));
        }}
      >
        Add Reward Distribution
      </Button> */}
      {/* <FormControl>
        <TextField
          id="field-contest-bucketCountMinEntrantsMap*"
          label="bucketCountMinEntrantsMap*"
          // value={eventForm.gameId.value}
          // error={form.gameId.error !== ''}
          // helperText={form.gameId.error}
          // onChange={(e: React.ChangeEvent<{ value: unknown }>) => {
          // }}
          type="number"
          inputProps={{ min: 1 }}
        />
      </FormControl> */}
      {eventForm.additionalParams.placementDataList.map((pData, pdlIndex) =>
        <div className="indent" key={pdlIndex}>
          <FormControl>
            <InputLabel htmlFor={`field-placementLocation-${pdlIndex}`}>Placement location</InputLabel>
            <Select
              input={<Input name="placementLocation-f"
                id={`field-placementLocation-${pdlIndex}`} />}
              value={pData.placementLocation.value}
              error={pData.placementLocation.error !== ''}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="delete placement data"
                    onClick={e => {
                      const newPdList = [...eventForm.additionalParams.placementDataList];
                      newPdList.splice(pdlIndex, 1);
                      dispatch(setEventForm({
                        ...eventForm,
                        additionalParams: {
                          ...eventForm.additionalParams,
                          placementDataList: newPdList
                        }
                      }));
                    }}
                    // onMouseDown={handleMouseDownPassword}
                  >
                    <DeleteIcon />
                  </IconButton>
                </InputAdornment>
              }
              onChange={(e: React.ChangeEvent<{ value: unknown }>) => {
                const newPdList = [...eventForm.additionalParams.placementDataList];
                const newPd = {
                  ...eventForm.additionalParams.placementDataList[pdlIndex],
                  placementLocation: {
                    ...eventForm.additionalParams.placementDataList[pdlIndex].placementLocation,
                    value: e.target.value as EPlacementLocation
                  }
                };
                newPdList.splice(pdlIndex, 1);
                newPdList.splice(pdlIndex, 0, newPd);
                dispatch(setEventForm({
                  ...eventForm,
                  additionalParams: {
                    ...eventForm.additionalParams,
                    placementDataList: newPdList
                  }
                }));
              }}
            >
              {Object.keys(EPlacementLocation).map(location =>
                <MenuItem value={location} key={location}>{location}</MenuItem>
              )}
            </Select>
          </FormControl>
          <FormControl>
            <TextField
              id={`field-placementPriority-${pdlIndex}`}
              label="placementPriority*"
              value={pData.placementPriority.value}
              error={pData.placementPriority.error !== ''}
              // helperText={form.gameId.error}
              onChange={(e: React.ChangeEvent<{ value: unknown }>) => {
                const newPdList = [...eventForm.additionalParams.placementDataList];
                const newPd = {
                  ...eventForm.additionalParams.placementDataList[pdlIndex],
                  placementPriority: {
                    ...eventForm.additionalParams.placementDataList[pdlIndex].placementPriority,
                    value: e.target.value as number
                  }
                };
                newPdList.splice(pdlIndex, 1);
                newPdList.splice(pdlIndex, 0, newPd);
                dispatch(setEventForm({
                  ...eventForm,
                  additionalParams: {
                    ...eventForm.additionalParams,
                    placementDataList: newPdList
                  }
                }));
              }}
              type="number"
              inputProps={{ min: 1 }}
            />
          </FormControl>
        </div>
      )}
      <Button
        variant="outlined"
        color="primary"
        onClick={e => {
          dispatch(setEventForm({
            ...eventForm,
            additionalParams: {
              ...eventForm.additionalParams,
              placementDataList: [
                ...eventForm.additionalParams.placementDataList,
                {
                  placementLocation: { value: EPlacementLocation.PGBottom, error: '', required: false },
                  placementPriority: { value: 0, error: '', required: false },
                  showOnCollapse: { value: false, error: '', required: false },
                  prerequisiteJsonLogic: { value: '', error: '', required: false },
                }
              ]
            }
          }));
        }}
      >
        Add Placement Data
      </Button>
    </Fragment>
  );
}

export default ContestFields;
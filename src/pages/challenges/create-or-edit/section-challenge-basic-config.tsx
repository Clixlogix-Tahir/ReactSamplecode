import {
  Button,
  FormControl,
  FormLabel,
  IconButton,
  Input,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  FormControlLabel,
  Checkbox,
  Typography,
} from '@material-ui/core';
import produce from '@reduxjs/toolkit/node_modules/immer';
import moment from 'moment';
import React from 'react';
import Datetime from 'react-datetime';
import {
  Plus,
  Trash
} from 'react-feather';
import {
  useAppDispatch,
  useAppSelector,
  useDefaultVCurrency
} from '../../../common/hooks';
import WithAddDelete from '../../../components/with-add-delete';
import globalStyles from '../../../theme/globalStyles';
import {
  ECryptoCurrency,
  ECurrency
} from '../../../types/eventTypes';
import {
  challengeDefaults as cDefaults,
  setChallengeForm
} from '../challenges-slice';
import {
  ESeasonCardType, ESeasonChallengeStatus, ESeasonChallengeType, TChallengeForm
} from '../challenges-types';
import SeasonCardData from './season-card-data';

export type TSectionChallengeProps = {
  shouldBeDisabled: boolean;
  defaultVirtualCurrency: string;
};

function SectionChallengeBasicConfig({
  shouldBeDisabled
}: TSectionChallengeProps) {
  const globalClasses = globalStyles();
  const dispatch = useAppDispatch();
  const {
    challenge,
    mutateMode
  } = useAppSelector(state => state.challengesSlice);
  const { selectedApp } = useAppSelector(state => state.gameConfigForm);
  const defaultVCurrency = useDefaultVCurrency(selectedApp);
  const challengeDefaults = cDefaults(defaultVCurrency);

  const { isSelectedAppCrypto } = useAppSelector(state => state.gameConfigForm);

  const setChallenge = (form: TChallengeForm) => {
    dispatch(setChallengeForm(form));
  };

  const initSeasonChallenge = (event: React.MouseEvent) => {
    event.preventDefault();
    setChallenge(produce(challenge, draft => {
      draft.seasonCardDataList = [{ ...challengeDefaults.seasonCardDataList }];
    }));
  }

  const deleteSeasonCardData = (event: React.MouseEvent, index: number) => {
    event.preventDefault();
    setChallenge(produce(challenge, draft => {
      if (draft.seasonCardDataList) {
        if( draft.seasonCardDataList.length === 1){
          draft.seasonCardDataList = null;
        } else {
          draft.seasonCardDataList.splice(index, 1);
        }
      }
    }));
  };

  return (
    <div>
      <FormControl>
        <TextField
          id="field-challenge-id"
          label="ID"
          value={challenge.id.value}
          disabled
        />
      </FormControl>
      <FormControl>
        <TextField
          id="field-seasonChallengeName"
          label="Season challenge name"
          value={challenge.seasonChallengeName.value}
          error={challenge.seasonChallengeName.error !== ''}
          helperText={challenge.seasonChallengeName.error}
          disabled={mutateMode === 'View'}
          onChange={(event: React.ChangeEvent<{ value: unknown }>) => {
            const { value } = event.target;
            setChallenge(produce(challenge, draft => {
              draft.seasonChallengeName.value = value as string;
            }));
          }}
        />
      </FormControl>
      <FormControl>
        <FormLabel
          // disabled={}
        >Start</FormLabel>
        <Datetime
          // todo improve new Date()
          value={new Date(parseInt(challenge.startAt.value + '') * 1000)}
          inputProps={{
            className: 'MuiInputBase-input MuiInput-input',
            disabled: shouldBeDisabled,
            style: {
              borderBottom: shouldBeDisabled ? 'dotted 1px rgba(0, 0, 0, 0.42)' : '1px solid rgba(0, 0, 0, 0.42)',
              color: shouldBeDisabled ? 'rgba(0, 0, 0, 0.38)' : 'inherit',
            },
            onKeyUp: (e: any) => console.info(e.target.selectionStart)
          }}
          onChange={event => {
            setChallenge(produce(challenge, draft => {
              draft.startAt.value = parseInt((moment(event).seconds(0).toDate().getTime() / 1000) + '');
            }));
          }}
        />
      </FormControl>
      <FormControl>
        <TextField
          id="field-duration"
          label="Duration"
          value={challenge.duration.value}
          error={challenge.duration.error !== ''}
          helperText={challenge.duration.error}
          disabled={shouldBeDisabled}
          type="number"
          inputProps={{ min: 0 }}
          onChange={(event: React.ChangeEvent<{ value: unknown }>) => {
            const { value } = event.target;
            setChallenge(produce(challenge, draft => {
              draft.duration.value = value as number;
              draft.duration.error = parseInt(value as string) < 0 ? 'minimum can be 0' : '';
            }));
          }}
        />
      </FormControl>
      <FormControl>
        <TextField
          id="field-extraTimeBeforeStart"
          label="Extra time before start"
          value={challenge.extraTimeBeforeStart.value}
          error={challenge.extraTimeBeforeStart.error !== ''}
          helperText={challenge.extraTimeBeforeStart.error}
          disabled={shouldBeDisabled}
          type="number"
          inputProps={{ min: 0 }}
          onChange={(event: React.ChangeEvent<{ value: unknown }>) => {
            const { value } = event.target;
            setChallenge(produce(challenge, draft => {
              draft.extraTimeBeforeStart.value = value as number;
              draft.extraTimeBeforeStart.error = parseInt(value as string) < 0 ? 'minimum can be 0' : '';
            }));
          }}
        />
      </FormControl>
      <FormControl>
        <TextField
          id="field-extraTimeAfterEnd"
          label="Extra time after end"
          value={challenge.extraTimeAfterEnd.value}
          error={challenge.extraTimeAfterEnd.error !== ''}
          helperText={challenge.extraTimeAfterEnd.error}
          disabled={shouldBeDisabled}
          type="number"
          inputProps={{ min: 0 }}
          onChange={(event: React.ChangeEvent<{ value: unknown }>) => {
            const { value } = event.target;
            setChallenge(produce(challenge, draft => {
              draft.extraTimeAfterEnd.value = value as number;
              draft.extraTimeAfterEnd.error = parseInt(value as string) < 0 ? 'minimum can be 0' : '';
            }));
          }}
        />
      </FormControl>
      <FormControl>
        <TextField
          id="field-rewardsCollectionBuffer"
          label="Rewards collection buffer"
          value={challenge.rewardsCollectionBuffer.value}
          error={challenge.rewardsCollectionBuffer.error !== ''}
          helperText={challenge.rewardsCollectionBuffer.error}
          disabled={shouldBeDisabled}
          type="number"
          inputProps={{ min: 0 }}
          onChange={(event: React.ChangeEvent<{ value: unknown }>) => {
            const { value } = event.target;
            setChallenge(produce(challenge, draft => {
              draft.rewardsCollectionBuffer.value = value as number;
              draft.rewardsCollectionBuffer.error = parseInt(value as string) < 0 ? 'minimum can be 0' : '';
            }));
          }}
        />
      </FormControl>

      <FormControl>
        <InputLabel htmlFor={`field-challenge-currency`}>Currency</InputLabel>
        <Select
          input={
            <Input name={`field-challenge-currency`}
              id={`field-challenge-currency`} />
          }
          value={challenge.currency.value}
          error={challenge.currency.error !== ''}
          disabled={shouldBeDisabled}
          onChange={(event: React.ChangeEvent<{ value: unknown }>) => {
            const { value } = event.target;
            setChallenge(produce(challenge, draft => {
              draft.currency.value = value as ECurrency;
              // todo validation
            }));
          }}
        >
          { !isSelectedAppCrypto && 
          Object.keys(ECurrency).filter(c => c !== ECurrency.NOT_AVAILABLE).map(curr =>
            <MenuItem value={curr} key={curr}>{curr}</MenuItem>)}

          { isSelectedAppCrypto && 
          Object.keys(ECryptoCurrency).map(curr =>
            <MenuItem value={curr} key={curr}>{curr}</MenuItem>)}

        </Select>
      </FormControl>
      {challenge.currency.error &&
        <p style={{ color: 'red' }}>{challenge.currency.error}</p>
      }
      {challenge.seasonChallengeStatus &&
        <React.Fragment>
          <FormControl>
            <InputLabel htmlFor={`field-challenge-seasonChallengeStatus`}>
              Season challenge status
            </InputLabel>
            <Select
              input={
                <Input name={`field-challenge-seasonChallengeStatus`}
                  id={`field-challenge-seasonChallengeStatus`} />
              }
              value={challenge.seasonChallengeStatus.value}
              error={challenge.seasonChallengeStatus.error !== ''}
              disabled
            >
              {Object.keys(ESeasonChallengeStatus).map(option =>
                <MenuItem value={option} key={option}>{option}</MenuItem>)}
            </Select>
          </FormControl>
          {challenge.seasonChallengeStatus.error &&
            <p style={{ color: 'red' }}>{challenge.seasonChallengeStatus.error}</p>
          }
        </React.Fragment>
      }

      <FormControl>
        <TextField
          id="field-ticketExpiryBuffer"
          label="Ticket Expiry Buffer"
          value={challenge.ticketExpiryBuffer.value}
          error={challenge.ticketExpiryBuffer.error !== ''}
          helperText={challenge.ticketExpiryBuffer.error}
          disabled={mutateMode === 'View' || (challenge.seasonChallengeStatus !== null &&
            (challenge.seasonChallengeStatus.value === ESeasonChallengeStatus.endedFully ||
              challenge.seasonChallengeStatus.value === ESeasonChallengeStatus.endedPartially ||
              challenge.seasonChallengeStatus.value === ESeasonChallengeStatus.endedToBeHidden))}
          type="number"
          inputProps={{ min: 0 }}
          onChange={(event: React.ChangeEvent<{ value: unknown }>) => {
            const { value } = event.target;
            setChallenge(produce(challenge, draft => {
              draft.ticketExpiryBuffer.value = value as number;
              draft.ticketExpiryBuffer.error = parseInt(value as string) < 0 ? 'minimum can be 0' : '';
            }));
          }}
        />
      </FormControl>

      <FormControl>
        <InputLabel htmlFor={`field-challenge-seasonChallengeType`}>Season challenge type</InputLabel>
        <Select
          input={
            <Input name={`field-challenge-seasonChallengeType`}
              id={`field-challenge-seasonChallengeType`} />
          }
          value={challenge.seasonChallengeType.value}
          error={challenge.seasonChallengeType.error !== ''}
          disabled={shouldBeDisabled}
          onChange={(event: React.ChangeEvent<{ value: unknown }>) => {
            const { value } = event.target;
            setChallenge(produce(challenge, draft => {
              draft.seasonChallengeType.value = value as ESeasonChallengeType;
              // todo validation
            }));
          }}
        >
          {
            Object.entries(ESeasonChallengeType).map(type =>
              <MenuItem value={type[1]} key={type[1]}>{type[0]}</MenuItem>)
          }

        </Select>
      </FormControl>

      <FormControlLabel
        label="Enable Ticket Expiry"
        control={
          <Checkbox
            id="field-enableTicketExpiry"
            name="field-enableTicketExpiry"
            //inputProps={{ 'aria-label': 'enableTicketExpiry' }}
            checked={challenge.enableTicketExpiry.value}
            disabled={mutateMode === 'View' || (challenge.seasonChallengeStatus !== null &&
              (challenge.seasonChallengeStatus.value === ESeasonChallengeStatus.endedFully ||
                challenge.seasonChallengeStatus.value === ESeasonChallengeStatus.endedPartially ||
                challenge.seasonChallengeStatus.value === ESeasonChallengeStatus.endedToBeHidden))}
            onChange={(event: React.ChangeEvent<{ value: unknown, checked: boolean }>) => {
              const { checked } = event.target;
            setChallenge(produce(challenge, draft => {
              draft.enableTicketExpiry.value = checked;
            }));
            }}
          />
        }
      />

      {mutateMode !== 'View' && 
        (!challenge.seasonCardDataList || challenge.seasonCardDataList.length === 0 ) &&
        <Button
          variant="outlined"
          //disabled={mutateMode === 'View'}
          onClick={initSeasonChallenge}
        >
          <Plus /> Add Season Card
        </Button>
      }
      {challenge.seasonCardDataList &&
        challenge.seasonCardDataList.map((cardData, cdIndex) =>
          <WithAddDelete
            addDisabled={mutateMode === 'View' || (challenge.seasonCardDataList != null && challenge.seasonCardDataList && cdIndex < challenge.seasonCardDataList.length-1)}
            nameOfResource="seasonCardData"
            key={`challengeList-${cdIndex}`}
            addFn={event => {
              event.preventDefault();
              setChallenge(produce(challenge, draft => {
                if (draft.seasonCardDataList) {
                  draft.seasonCardDataList.push({ ...challengeDefaults.seasonCardDataList });
                }
              }));
            }}
            deleteFn={event => {
              event.preventDefault();
            }}
          >
            <div style={{marginTop:'1rem'}} className="indent-outlined" key={`cardData-${cdIndex}`}>
              <div className={globalClasses.spaceBetween}>
                <Typography variant="h4">Season Card {cdIndex + 1}</Typography>
                <IconButton
                  aria-label="delete"
                  disabled={mutateMode === 'View'}
                  onClick={e => deleteSeasonCardData(e, cdIndex)}
                  // onMouseDown={handleMouseDownPassword}
                >
                  <Trash />
                </IconButton>
              </div>
              <SeasonCardData
                cdIndex={cdIndex}
                seasonCard={cardData}
                options={{
                  deleteSeasonCard: (seasonCardIndex: number) => {},
                  seasonCardType: {
                    disabled: mutateMode === 'View',
                    onChange: (
                      event: React.ChangeEvent<{ value: unknown }>
                    ) => {
                      const { value } = event.target;
                      setChallenge(produce(challenge, draft => {
                        if (draft.seasonCardDataList) {
                          draft.seasonCardDataList[cdIndex].seasonCardType.value = value as ESeasonCardType;
                        }
                      }));
                    },
                  },
                  title: {
                    disabled: mutateMode === 'View',
                    onChange: (
                      event: React.ChangeEvent<{ value: unknown }>
                    ) => {
                      const { value } = event.target;
                      setChallenge(produce(challenge, draft => {
                        if (draft.seasonCardDataList) {
                          draft.seasonCardDataList[cdIndex].title.value = value as string;
                        }
                      }));
                    },
                  },
                  description: {
                    disabled: mutateMode === 'View',
                    onChange: (
                      event: React.ChangeEvent<{ value: unknown }>
                    ) => {
                      const { value } = event.target;
                      setChallenge(produce(challenge, draft => {
                        if (draft.seasonCardDataList) {
                          draft.seasonCardDataList[cdIndex].description.value = value as string;
                        }
                      }));
                    },
                  },
                }}
              />
            </div>
          </WithAddDelete>
        )
      }
    </div>
  );
}

export default SectionChallengeBasicConfig;

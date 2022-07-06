import {
  FormControl,
  FormControlLabel,
  FormLabel,
  IconButton,
  Radio,
  RadioGroup,
  TextField,
  Typography
} from '@material-ui/core';
import {
  Alert
} from '@material-ui/lab';
import produce from '@reduxjs/toolkit/node_modules/immer';
import React, { useMemo } from 'react';
import {
  Trash
} from 'react-feather';
import {
  useAppDispatch,
  useAppSelector,
  useDefaultRealCurrency,
  useDefaultVCurrency
} from '../../../common/hooks';
import WithAddDelete from '../../../components/with-add-delete';
import globalStyles from '../../../theme/globalStyles';
import { ECurrency } from '../../../types/eventTypes';
import {
  challengeDefaults as cDefaults,
  challengeDefaultsForCrypto,
  setChallengeForm
} from '../challenges-slice';
import {
  EChallengeDailyRewardType,
  EChallengeGiftBox,
  EChallengeType,
  TChallengeForm
} from '../challenges-types';
import ChallengeRewardList from './challenge-reward-list';
import {
  TSectionChallengeProps
} from './section-challenge-basic-config';

function SectionChallengeRewards({
  shouldBeDisabled,
  defaultVirtualCurrency
}: TSectionChallengeProps) {

  const dispatch = useAppDispatch();
  const globalClasses = globalStyles();
  const {
    challenge,
  } = useAppSelector(state => state.challengesSlice);
  const { isSelectedAppCrypto, selectedApp } = useAppSelector(state => state.gameConfigForm);
  const defaultVCurrency = useDefaultVCurrency(selectedApp);
  const defaultRealCurrency = useDefaultRealCurrency();
  const challengeDefaults = cDefaults(defaultVCurrency, defaultRealCurrency);
  const challengeDefaultsForC = useMemo(() => challengeDefaultsForCrypto(defaultVCurrency, defaultRealCurrency),
    [defaultVCurrency, defaultRealCurrency]);

  const setChallenge = (form: TChallengeForm) => {
    dispatch(setChallengeForm(form));
  };

  const deleteRewardsDash = (event: React.MouseEvent, index: number) => {
    event.preventDefault();
    setChallenge(produce(challenge, draft => {
      if (draft) {
        draft.rewardsDashboard.splice(index, 1);
      }
    }));
  };

  return (
    <React.Fragment>
      <WithAddDelete
        addDisabled={shouldBeDisabled}
        nameOfResource="reward"
        addFn={() => {
          setChallenge(produce(challenge, draft => {
            let rewardsDash = challengeDefaults.rewardsDash;
            let nextMilestoneValue : number = 1;
            if( challenge.rewardsDashboard && challenge.rewardsDashboard.length > 0 ){
              nextMilestoneValue =  challenge.rewardsDashboard[challenge.rewardsDashboard.length-1].milestone.value + 1;
            } 
            rewardsDash.milestone = { value: nextMilestoneValue, error: '', required: true };
            draft.rewardsDashboard.push({ ...rewardsDash });
          }));
        }}
        deleteFn={() => {}}
      >
        {challenge.rewardsDashboard.map((reward, rewardIndex) =>
          <div className="indent" key={`reward-${challenge.id}-${rewardIndex}`}>
            <div className={globalClasses.spaceBetween}>
              <Typography variant="h4">Reward {rewardIndex + 1}</Typography>
              <IconButton
                aria-label="delete"
                disabled={shouldBeDisabled}
                onClick={e => deleteRewardsDash(e, rewardIndex)}
                // onClick={e => deleteFn(e, index)}
                // onMouseDown={handleMouseDownPassword}
              >
                <Trash />
              </IconButton>
            </div>
            <FormControl>
              <TextField
                id={`reward-${challenge.id}-${rewardIndex}-id`}
                label="ID"
                value={reward.id.value}
                error={reward.id.error !== ''}
                helperText={reward.id.error}
                disabled
                type="number"
              />
            </FormControl>
            <FormControl component="fieldset">
              <FormLabel component="legend">Gift box</FormLabel>
              <RadioGroup
                style={{ display: 'inline-block', marginBottom: 0 }}
                aria-label="Recurrence type" name="recurrence-type"
                value={reward.giftbox.value}
                onChange={(event: React.ChangeEvent<{ value: unknown }>) => {
                  const { value } = event.target;
                  setChallenge(produce(challenge, draft => {
                    draft.rewardsDashboard[rewardIndex].giftbox.value = value as EChallengeGiftBox;
                  }));
                }}
              >
                {Object.keys(EChallengeGiftBox).map(option =>
                  <FormControlLabel style={{ display: 'inline-block', marginBottom: 0 }}
                    label={option} value={option} key={option}
                    control={
                      <Radio disabled={shouldBeDisabled} />
                    }
                  />
                )}
              </RadioGroup>
            </FormControl>
            <p style={{ color: 'red' }}>{reward.giftbox.error}</p>
            <FormControl>
              <TextField
                id={`reward-${challenge.id}-${rewardIndex}-milestone`}
                label="Milestone"
                value={reward.milestone.value}
                error={reward.milestone.error !== ''}
                helperText={reward.milestone.error}
                disabled={shouldBeDisabled}
                type="number"
                inputProps={{ min: 0 }}
                onChange={(event: React.ChangeEvent<{ value: unknown }>) => {
                  const { value } = event.target;
                  setChallenge(produce(challenge, draft => {
                    draft.rewardsDashboard[rewardIndex].milestone.value = parseInt(value as string) as number;
                  }));
                }}
              />
            </FormControl>
            <FormControl>
              <TextField
                id={`reward-${challenge.id}-${rewardIndex}-requiredCPPoints`}
                label="Required CP points"
                value={reward.requiredCPPoints.value}
                error={reward.requiredCPPoints.error !== ''}
                helperText={reward.requiredCPPoints.error}
                disabled={shouldBeDisabled}
                type="number"
                inputProps={{ min: 0 }}
                onChange={(event: React.ChangeEvent<{ value: unknown }>) => {
                  const { value } = event.target;
                  setChallenge(produce(challenge, draft => {
                    draft.rewardsDashboard[rewardIndex].requiredCPPoints.value = value as number;
                  }));
                }}
              />
            </FormControl>
            <FormControl component="fieldset">
              <FormLabel component="legend">tier</FormLabel>
              <RadioGroup
                style={{ display: 'inline-block', marginBottom: 0 }}
                aria-label="tier" name="tier"
                value={reward.rewardsTier.value}
                onChange={(event: React.ChangeEvent<{ value: unknown }>) => {
                  const { value } = event.target;
                  setChallenge(produce(challenge, draft => {
                    draft.rewardsDashboard[rewardIndex].rewardsTier.value = value as EChallengeType;
                  }));
                }}
              >
                {Object.keys(EChallengeType).map(option =>
                  <FormControlLabel style={{ display: 'inline-block', marginBottom: 0 }}
                    label={option} value={option} key={option}
                    control={<Radio disabled={shouldBeDisabled} />}
                  />
                )}
              </RadioGroup>
            </FormControl>
            {!Object.keys(EChallengeType).includes(reward.rewardsTier.value) &&
              <Alert severity="error" style={{ marginBottom: '2rem'}}>
                Invalid value provided for tier. Please click on "regular" or "premium" above.
              </Alert>
            }
            <ChallengeRewardList
              rewardsList={reward.rewardsList}
              options={{
                amount: {
                  disabled: shouldBeDisabled,
                  onChange: ({ event, rewardIndex: rIndex }) => {
                    const { value } = event.target;
                    setChallenge(produce(challenge, draft => {
                      draft.rewardsDashboard[rewardIndex].rewardsList[rIndex].amount.value = value as number;
                    }));
                  },
                },
                dailyRewardType: {
                  disabled: shouldBeDisabled,
                  onChange: ({ event, rewardIndex: rIndex }) => {
                    const { value } = event.target;
                    setChallenge(produce(challenge, draft => {
                      draft.rewardsDashboard[rewardIndex].rewardsList[rIndex].dailyRewardType.value = value as EChallengeDailyRewardType;
                    }));
                  },
                },
                currencyCode: {
                  disabled: shouldBeDisabled,
                  onChange: ({ event, rewardIndex: rIndex }) => {
                    const { value } = event.target;
                    setChallenge(produce(challenge, draft => {
                      draft.rewardsDashboard[rewardIndex].rewardsList[rIndex].currencyCode.value = value as ECurrency;
                    }));
                  },
                },
                currencyType: {
                  disabled: shouldBeDisabled,
                  onChange: ({ event, rewardIndex: rIndex }) => {
                    const { value } = event.target;
                    setChallenge(produce(challenge, draft => {
                      draft.rewardsDashboard[rewardIndex].rewardsList[rIndex].currencyType.value = value as string;
                    }));
                  },
                },
                duration: {
                  disabled: shouldBeDisabled,
                  onChange: ({ event, rewardIndex: rIndex }) => {
                    const { value } = event.target;
                    setChallenge(produce(challenge, draft => {
                      draft.rewardsDashboard[rewardIndex].rewardsList[rIndex].duration.value = value as number;
                    }));
                  },
                },
                addFn: () => {
                  if (isSelectedAppCrypto) {
                    setChallenge(produce(challenge, draft => {
                      draft.rewardsDashboard[rewardIndex].rewardsList.push({
                        ...challengeDefaultsForC.reward,
                        currencyType: {
                          ...challengeDefaultsForC.reward.currencyType,
                          value: defaultVirtualCurrency
                        }
                      });
                    }));
                  } else {
                    setChallenge(produce(challenge, draft => {
                      draft.rewardsDashboard[rewardIndex].rewardsList.push({
                        ...challengeDefaults.reward,
                        currencyType: {
                          ...challengeDefaults.reward.currencyType,
                          value: defaultVirtualCurrency
                        }
                      });
                    }));
                  }
                },
                deleteFn: (rIndex) => {
                  setChallenge(produce(challenge, draft => {
                    draft.rewardsDashboard[rewardIndex].rewardsList.splice(rIndex, 1);
                  }));
                },
              }}
            />
          </div>
        )}
      </WithAddDelete>
    </React.Fragment>
  );
}

export default SectionChallengeRewards;

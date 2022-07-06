import React, { useMemo } from 'react';
import produce from '@reduxjs/toolkit/node_modules/immer';
import {
  TSectionChallengeProps
} from './section-challenge-basic-config';
import {
  useAppDispatch,
  useAppSelector,
  useDefaultRealCurrency,
  useDefaultVCurrency
} from '../../../common/hooks';
import {
  challengeDefaults as cDefaults,
  challengeDefaultsForCrypto,
  setChallengeForm
} from '../challenges-slice';
import WithAddDelete from '../../../components/with-add-delete';
import {
  EChallengeCashFlag,
  EChallengeDailyRewardType,
  EChallengeGiftBox,
  EChallengeTask,
  EChallengeTournamentType,
  EChallengeType,
  TChallengeForm
} from '../challenges-types';
import {
  ECost,
  ECurrency,
  EPlacementLocation
} from '../../../types/eventTypes';
import ChallengeDetails from './challenge-details';
import {
  TFormFieldNumber
} from '../../../types/formFields';

function SectionChallengeSeasons({
  shouldBeDisabled,
  defaultVirtualCurrency
}: TSectionChallengeProps) {

  const dispatch = useAppDispatch();
  const {
    challenge,
    mutateMode,
  } = useAppSelector(state => state.challengesSlice);
  const { selectedApp } = useAppSelector(state => state.gameConfigForm);
  const defaultVCurrency = useDefaultVCurrency(selectedApp);
  const defaultRealCurrency = useDefaultRealCurrency();
  const challengeDefaults = cDefaults(defaultVCurrency, defaultRealCurrency);
  const challengeDefaultsForC = useMemo(() => challengeDefaultsForCrypto(defaultVCurrency, defaultRealCurrency),
    [defaultVCurrency, defaultRealCurrency]);

  const [disableKeyItems, setDisableKeyItems] = React.useState<boolean>(false);

  const { isSelectedAppCrypto } = useAppSelector(state => state.gameConfigForm);

  const setChallenge = (form: TChallengeForm) => {
    dispatch(setChallengeForm(form));
  };

  return (
    <React.Fragment>
      <WithAddDelete
        addDisabled={shouldBeDisabled}
        nameOfResource="challenge"
        addFn={event => {
          event.preventDefault();
          setChallenge(produce(challenge, draft => {
            draft.seasonChallengeList.push({ ...challengeDefaults.challengeDetails });
          }));
        }}
        deleteFn={event => {
          event.preventDefault();
        }}
      >
        <ChallengeDetails
          challenges={challenge.seasonChallengeList}
          options={{
            deleteChallenge: (challengeIndex) => {
              setChallenge(produce(challenge, draft => {
                draft.seasonChallengeList.splice(challengeIndex, 1);
              }));
            },
            challengeType: {
              disabled: shouldBeDisabled,
              onChange: (event, cIndex) => {
                const { value } = event.target;
                setChallenge(produce(challenge, draft => {
                  draft.seasonChallengeList[cIndex].challengeType.value =
                    value as EChallengeType;
                }));
              }
            },
            challengeName: {
              disabled: mutateMode === 'View',
              onChange: (event, cIndex) => {
                const { value } = event.target;
                setChallenge(produce(challenge, draft => {
                  draft.seasonChallengeList[cIndex].challengeName.value =
                    value as string;
                }));
              },
            },
            challengeDescription: {
              disabled: mutateMode === 'View',
              onChange: (event, cIndex) => {
                const { value } = event.target;
                setChallenge(produce(challenge, draft => {
                  draft.seasonChallengeList[cIndex].challengeDescription.value =
                    value as string;
                }));
              },
            },
            challengeKey: {
              challengeTask: {
                disabled: shouldBeDisabled,
                onChange: (event, cIndex) => {
                  const value = event.target.value as EChallengeTask;
                  setChallenge(produce(challenge, draft => {
                    if (value === EChallengeTask.invite || value === EChallengeTask.inviteAndDepositX ||
                      value === EChallengeTask.inviteXAndDeposit || value === EChallengeTask.xpPoint || 
                      value === EChallengeTask.xpLevel ) {
                      draft.seasonChallengeList[cIndex].challengeKey.cashFlag.value = EChallengeCashFlag.all;
                      draft.seasonChallengeList[cIndex].challengeKey.tournamentNameId = null;
                      draft.seasonChallengeList[cIndex].challengeKey.tournamentType.value = EChallengeTournamentType.all;
                      setDisableKeyItems(true);
                    } else {
                      setDisableKeyItems(false);
                    }

                    draft.seasonChallengeList[cIndex].challengeKey.challengeTask.value = value;
                    draft.seasonChallengeList[cIndex].challengeKey.secondaryScoreIndex =
                      value === EChallengeTask.secondaryScore ?
                        { value: 1, error: '', required: true } :
                        null;
                  }));
                },
              },
              cashFlag: {
                disabled: shouldBeDisabled || disableKeyItems,
                onChange: (event, cIndex) => {
                  const { value } = event.target;
                  setChallenge(produce(challenge, draft => {
                    draft.seasonChallengeList[cIndex].challengeKey.cashFlag.value =
                      value as EChallengeCashFlag;
                  }));
                },
              },
              tournamentNameId: {
                disabled: shouldBeDisabled || disableKeyItems,
                onChange: (event, cIndex, cLevelOptions, nullableOptions = undefined) => {
                  const { value } = event.target;
                  let newField: null | TFormFieldNumber = { value: value as number, error: '', required: true };
                  setChallenge(produce(challenge, draft => {
                    if (nullableOptions && newField) {
                      newField = { ...newField, value: 1};
                    } else if (nullableOptions === false) {
                      newField = null;
                    } else {
                      const { tournamentNameId } = draft.seasonChallengeList[cIndex].challengeKey;
                      if (tournamentNameId !== null) {
                        newField = { ...tournamentNameId, value: value as number };
                      }
                    }
                    draft.seasonChallengeList[cIndex].challengeKey.tournamentNameId = newField;
                  }));
                },
              },
              secondaryScoreIndex: {
                disabled: shouldBeDisabled,
                onChange: (event, cIndex, cLevelOptions, nullableOptions = undefined) => {
                  const { value } = event.target;
                  let newField: null | TFormFieldNumber = { value: value as number, error: '', required: true };
                  setChallenge(produce(challenge, draft => {
                    if (nullableOptions && newField) {
                      newField = { ...newField, value: 1};
                    } else if (nullableOptions === false) {
                      newField = null;
                    } else {
                      const { secondaryScoreIndex } = draft.seasonChallengeList[cIndex].challengeKey;
                      if (secondaryScoreIndex !== null) {
                        newField = {
                          ...secondaryScoreIndex,
                          value: value as number,
                          error: '',
                        };
                      }
                    }
                    draft.seasonChallengeList[cIndex].challengeKey.secondaryScoreIndex = newField;
                  }));
                },
              },
              tournamentType: {
                disabled: shouldBeDisabled || disableKeyItems,
                onChange: (event, cIndex) => {
                  const { value } = event.target;
                  setChallenge(produce(challenge, draft => {
                    draft.seasonChallengeList[cIndex].challengeKey.tournamentType.value =
                      value as EChallengeTournamentType;
                  }));
                },
              },
              gameModeOnly: {
                disabled: shouldBeDisabled || disableKeyItems,
                onChange: (event, cIndex) => {
                  const value = event.target.value === 'true' ? true : false;
                  setChallenge(produce(challenge, draft => {
                    const { gameModeOnly } = draft.seasonChallengeList[cIndex].challengeKey;
                    if (gameModeOnly) {
                      gameModeOnly.value = value;
                    }
                  }));
                },
              },
            },
            hasChallengeRedirection: {
              disabled: shouldBeDisabled,
              onChange: (event, cIndex) => {
                const { checked } = event.target;
                setChallenge(produce(challenge, draft => {
                  if (checked as boolean) {
                    draft.seasonChallengeList[cIndex].challengeRedirection = {
                      value: '',
                      error: '',
                      required: true,
                    };
                  } else {
                    delete draft.seasonChallengeList[cIndex].challengeRedirection;
                  }
                }));
              },
            },
            challengeRedirection: {
              disabled: shouldBeDisabled,
              onChange: (event, cIndex) => {
                const { value } = event.target;
                setChallenge(produce(challenge, draft => {
                  const { challengeRedirection } = draft.seasonChallengeList[cIndex];
                  if (challengeRedirection) {
                    challengeRedirection.value =
                      value as EPlacementLocation;
                  }
                }));
              }
            },
            heroChallenge: {
              disabled: shouldBeDisabled,
              onChange: (event, cIndex) => {
                const { checked } = event.target;
                setChallenge(produce(challenge, draft => {
                  draft.seasonChallengeList[cIndex].heroChallenge.value =
                    checked as boolean;
                  if (checked as boolean) {
                    draft.seasonChallengeList[cIndex].heroChallengeData = challengeDefaults.challengeDetails.heroChallengeData ?
                      { ...challengeDefaults.challengeDetails.heroChallengeData } :
                      undefined;
                  } else {
                    delete draft.seasonChallengeList[cIndex].heroChallengeData;
                  }
                }));
              },
            },
            heroChallengeData: {
              heroChallengeTitle: {
                disabled: mutateMode === 'View',
                onChange: (event, cIndex) => {
                  const { value } = event.target;
                  setChallenge(produce(challenge, draft => {
                    const { heroChallengeData } = draft.seasonChallengeList[cIndex];
                    if (heroChallengeData) {
                      heroChallengeData.heroChallengeTitle.value = value as string;
                    }
                  }));
                },
              },
              heroChallengeDescription: {
                disabled: mutateMode === 'View',
                onChange: (event, cIndex) => {
                  const { value } = event.target;
                  setChallenge(produce(challenge, draft => {
                    const { heroChallengeData } = draft.seasonChallengeList[cIndex];
                    if (heroChallengeData) {
                      heroChallengeData.heroChallengeDescription.value = value as string;
                    }
                  }));
                },
              },
              heroChallengeColumnName: {
                disabled: mutateMode === 'View',
                onChange: (event, cIndex) => {
                  const { value } = event.target;
                  setChallenge(produce(challenge, draft => {
                    const { heroChallengeData } = draft.seasonChallengeList[cIndex];
                    if (heroChallengeData) {
                      heroChallengeData.heroChallengeColumnName.value = value as string;
                    }
                  }));
                },
              },
            },
            dailyChallengeId: {
              disabled: shouldBeDisabled,
              onChange: (event, cIndex, cLevelOptions, nullableOptions = undefined) => {
                const { value } = event.target;
                setChallenge(produce(challenge, draft => {
                  if (nullableOptions === true) {
                    draft.seasonChallengeList[cIndex].dailyChallengeId =
                      { value: 0, error: '', required: true };
                  } else if (nullableOptions === false) {
                    draft.seasonChallengeList[cIndex].dailyChallengeId = null;
                  } else {
                    draft.seasonChallengeList[cIndex].dailyChallengeId =
                      { value: value as number, error: '', required: false };
                  }
                }));
              },
            },
            challengeLevelsList: {
              addFn: (challengeIndex) => {
                if (isSelectedAppCrypto) {
                  setChallenge(produce(challenge, draft => {
                    draft.seasonChallengeList[challengeIndex].challengeLevelsList.push({
                      ...challengeDefaultsForC.challengeDetails.challengeLevelsList[0]
                    });
                  }));
                } else {
                  setChallenge(produce(challenge, draft => {
                    draft.seasonChallengeList[challengeIndex].challengeLevelsList.push({
                      ...challengeDefaults.challengeDetails.challengeLevelsList[0]
                    });
                  }));
                }
              },
              deleteFn: (challengeIndex, challengeLevelIndex) => {
                setChallenge(produce(challenge, draft => {
                  draft.seasonChallengeList[challengeIndex].challengeLevelsList.splice(challengeLevelIndex, 1);
                }));
              },
              parameter: {
                disabled: shouldBeDisabled,
                onChange: (event, cIndex, cLevelOptions = { cLevelIndex: 0, cLevelRewardIndex: 0 }) => {
                  const { value } = event.target;
                  setChallenge(produce(challenge, draft => {
                    draft.seasonChallengeList[cIndex].challengeLevelsList[cLevelOptions.cLevelIndex].parameter.value =
                      value as number;
                  }));
                },
              },
              giftbox: {
                disabled: shouldBeDisabled,
                onChange: (event, cIndex, cLevelOptions = { cLevelIndex: 0, cLevelRewardIndex: 0 }) => {
                  const { value } = event.target;
                  setChallenge(produce(challenge, draft => {
                    draft.seasonChallengeList[cIndex].challengeLevelsList[cLevelOptions.cLevelIndex].giftbox.value =
                      value as EChallengeGiftBox;
                  }));
                },
              },
              rewardsList: {
                addFn: (challengeIndex, challengeLevelIndex) => {
                  if (isSelectedAppCrypto) {
                    setChallenge(produce(challenge, draft => {
                      draft.seasonChallengeList[challengeIndex].challengeLevelsList[challengeLevelIndex].rewardsList.push({
                        ...challengeDefaultsForC.reward,
                        currencyType: {
                          ...challengeDefaultsForC.reward.currencyType,
                          value: defaultVirtualCurrency
                        }
                      });
                    }));
                  } else {
                    setChallenge(produce(challenge, draft => {
                      draft.seasonChallengeList[challengeIndex].challengeLevelsList[challengeLevelIndex].rewardsList.push({
                        ...challengeDefaults.reward,
                        currencyType: {
                          ...challengeDefaults.reward.currencyType,
                          value: defaultVirtualCurrency
                        }
                      });
                    }));
                  }
                },
                deleteFn: (challengeIndex, challengeLevelIndex, rewardIndex) => {
                  setChallenge(produce(challenge, draft => {
                    draft.seasonChallengeList[challengeIndex].challengeLevelsList[challengeLevelIndex].rewardsList.splice(rewardIndex, 1);
                  }));
                },
                dailyRewardType: {
                  disabled: shouldBeDisabled,
                  onChange: (event, cIndex, cLevelOptions = { cLevelIndex: 0, cLevelRewardIndex: 0 }) => {
                    const { value } = event.target;
                    setChallenge(produce(challenge, draft => {
                      draft.seasonChallengeList[cIndex].challengeLevelsList[cLevelOptions.cLevelIndex].rewardsList[cLevelOptions.cLevelRewardIndex].dailyRewardType.value =
                        value as EChallengeDailyRewardType;
                    }));
                  },
                },
                amount: {
                  disabled: shouldBeDisabled,
                  onChange: (event, cIndex, cLevelOptions = { cLevelIndex: 0, cLevelRewardIndex: 0 }) => {
                    const { value } = event.target;
                    setChallenge(produce(challenge, draft => {
                      draft.seasonChallengeList[cIndex].challengeLevelsList[cLevelOptions.cLevelIndex].rewardsList[cLevelOptions.cLevelRewardIndex].amount.value =
                        value as number;
                    }));
                  },
                },
                currencyCode: {
                  disabled: shouldBeDisabled,
                  onChange: (event, cIndex, cLevelOptions = { cLevelIndex: 0, cLevelRewardIndex: 0 }) => {
                    const { value } = event.target;
                    setChallenge(produce(challenge, draft => {
                      draft.seasonChallengeList[cIndex].challengeLevelsList[cLevelOptions.cLevelIndex].rewardsList[cLevelOptions.cLevelRewardIndex].currencyCode.value =
                        value as ECurrency;
                    }));
                  },
                },
                currencyType: {
                  disabled: shouldBeDisabled,
                  onChange: (event, cIndex, cLevelOptions = { cLevelIndex: 0, cLevelRewardIndex: 0 }) => {
                    const { value } = event.target;
                    setChallenge(produce(challenge, draft => {
                      draft.seasonChallengeList[cIndex].challengeLevelsList[cLevelOptions.cLevelIndex].rewardsList[cLevelOptions.cLevelRewardIndex].currencyType.value =
                        value as ECost;
                    }));
                  },
                },
                duration: {
                  disabled: shouldBeDisabled,
                  onChange: (event, cIndex, cLevelOptions = { cLevelIndex: 0, cLevelRewardIndex: 0 }) => {
                    const { value } = event.target;
                    setChallenge(produce(challenge, draft => {
                      draft.seasonChallengeList[cIndex].challengeLevelsList[cLevelOptions.cLevelIndex].rewardsList[cLevelOptions.cLevelRewardIndex].duration.value =
                        value as number;
                    }));
                  },
                },
              },
            },
          }}
        />
      </WithAddDelete>
    </React.Fragment>
  );
}

export default SectionChallengeSeasons;

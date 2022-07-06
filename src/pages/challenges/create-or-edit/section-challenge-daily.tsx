import React, { useMemo } from 'react';
import {
  IconButton,
  Typography
} from '@material-ui/core';
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
  Trash
} from 'react-feather';
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
import globalStyles from '../../../theme/globalStyles';
import ChallengeDetails from './challenge-details';
import {
  TFormFieldNumber
} from '../../../types/formFields';


function SectionChallengeDaily({
  shouldBeDisabled,
  defaultVirtualCurrency
}: TSectionChallengeProps) {

  const dispatch = useAppDispatch();
  const globalClasses = globalStyles();
  const {
    challenge,
    mutateMode,
  } = useAppSelector(state => state.challengesSlice);
  const { selectedApp } = useAppSelector(state => state.gameConfigForm);
  const defaultVCurrency = useDefaultVCurrency(selectedApp);
  const defaultRealCurrency = useDefaultRealCurrency();
  const challengeDefaults = useMemo(() => cDefaults(defaultVCurrency), [defaultVCurrency]);
  const challengeDefaultsForC = useMemo(() => challengeDefaultsForCrypto(defaultVCurrency, defaultRealCurrency),
    [defaultVCurrency, defaultRealCurrency]);
  const [disableKeyItems, setDisableKeyItems] = React.useState<boolean>(false);
  const { isSelectedAppCrypto } = useAppSelector(state => state.gameConfigForm);
  const setChallenge = (form: TChallengeForm) => {
    dispatch(setChallengeForm(form));
  };

  const deleteChallengeSet = (event: React.MouseEvent, index: number) => {
    event.preventDefault();
    setChallenge(produce(challenge, draft => {
      if (draft) {
        draft.dailyChallengeList.splice(index, 1);
      }
    }));
  };

  return (
    <React.Fragment>
      <WithAddDelete
        addDisabled={shouldBeDisabled}
        nameOfResource="set"
        addFn={event => {
          event.preventDefault();
          console.info('add set addFn', [{ ...challengeDefaults.challengeDetails }]);
          setChallenge(produce(challenge, draft => {
            draft.dailyChallengeList.push([{ ...challengeDefaults.challengeDetails }]);
          }));
        }}
        deleteFn={event => {
          event.preventDefault();
          // todo
        }}
      >
        {challenge.dailyChallengeList.map((challengeList, cListIndex) =>
          <WithAddDelete
            addDisabled={shouldBeDisabled}
            nameOfResource="challenge"
            key={`challengeList-${cListIndex}`}
            addFn={event => {
              event.preventDefault();
              console.info('add challenge addFn', { ...challengeDefaults.challengeDetails });
              setChallenge(produce(challenge, draft => {
                draft.dailyChallengeList[cListIndex].push({ ...challengeDefaults.challengeDetails });
              }));
            }}
            deleteFn={event => {
              event.preventDefault();
            }}
          >
            <div className="indent-outlined">
              <div className={globalClasses.spaceBetween}>
                <Typography variant="h4">Set {cListIndex + 1}</Typography>
                <IconButton
                  aria-label="delete"
                  disabled={shouldBeDisabled}
                  onClick={e => deleteChallengeSet(e, cListIndex)}
                  // onMouseDown={handleMouseDownPassword}
                >
                  <Trash />
                </IconButton>
              </div>
              <ChallengeDetails
                challenges={challengeList}
                options={{
                  deleteChallenge: (challengeIndex) => {
                    setChallenge(produce(challenge, draft => {
                      draft.dailyChallengeList[cListIndex].splice(challengeIndex, 1);
                    }));
                  },
                  challengeType: {
                    disabled: shouldBeDisabled,
                    onChange: (event, cIndex) => {
                      const { value } = event.target;
                      setChallenge(produce(challenge, draft => {
                        draft.dailyChallengeList[cListIndex][cIndex].challengeType.value =
                          value as EChallengeType;
                      }));
                    }
                  },
                  challengeName: {
                    disabled: mutateMode === 'View',
                    onChange: (event, cIndex) => {
                      const { value } = event.target;
                      setChallenge(produce(challenge, draft => {
                        draft.dailyChallengeList[cListIndex][cIndex].challengeName.value =
                          value as string;
                      }));
                    },
                  },
                  challengeDescription: {
                    disabled: mutateMode === 'View',
                    onChange: (event, cIndex) => {
                      const { value } = event.target;
                      setChallenge(produce(challenge, draft => {
                        draft.dailyChallengeList[cListIndex][cIndex].challengeDescription.value =
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
                          draft.dailyChallengeList[cListIndex][cIndex].challengeKey.challengeTask.value = value;
                          if (value === EChallengeTask.invite || value === EChallengeTask.inviteAndDepositX ||
                            value === EChallengeTask.inviteXAndDeposit || value === EChallengeTask.xpPoint || 
                            value === EChallengeTask.xpLevel ) {
                            draft.dailyChallengeList[cListIndex][cIndex].challengeKey.cashFlag.value = EChallengeCashFlag.all;
                            draft.dailyChallengeList[cListIndex][cIndex].challengeKey.tournamentNameId = null;
                            draft.dailyChallengeList[cListIndex][cIndex].challengeKey.tournamentType.value = EChallengeTournamentType.all;
                            setDisableKeyItems(true);
                          } else {
                            setDisableKeyItems(false);
                          }
                          draft.dailyChallengeList[cListIndex][cIndex].challengeKey.secondaryScoreIndex =
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
                          draft.dailyChallengeList[cListIndex][cIndex].challengeKey.cashFlag.value =
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
                            const { tournamentNameId } = draft.dailyChallengeList[cListIndex][cIndex].challengeKey;
                            if (tournamentNameId !== null) {
                              newField = { ...tournamentNameId, value: value as number };
                            }
                          }
                          draft.dailyChallengeList[cListIndex][cIndex].challengeKey.tournamentNameId = newField;
                        }));
                      },
                    },
                    secondaryScoreIndex: {
                      disabled: shouldBeDisabled,
                      onChange: (event, cIndex, cLevelOptions, nullableOptions = undefined) => {
                        const { value } = event.target;
                        setChallenge(produce(challenge, draft => {
                          let newField: null | TFormFieldNumber = { value: value as number, error: '', required: true };
                          if (nullableOptions && newField) {
                            newField = { ...newField, value: 1};
                          } else if (nullableOptions === false) {
                            newField = null;
                          } else {
                            const { secondaryScoreIndex } = draft.dailyChallengeList[cListIndex][cIndex].challengeKey;
                            if (secondaryScoreIndex !== null) {
                              const v = parseInt(value as string);
                              newField = {
                                ...secondaryScoreIndex,
                                value: value as number,
                                error: '',
                              };
                            }
                          }
                          draft.dailyChallengeList[cListIndex][cIndex].challengeKey.secondaryScoreIndex = newField;
                        }));
                      },
                    },
                    tournamentType: {
                      disabled: shouldBeDisabled || disableKeyItems,
                      onChange: (event, cIndex) => {
                        const { value } = event.target;
                        setChallenge(produce(challenge, draft => {
                          draft.dailyChallengeList[cListIndex][cIndex].challengeKey.tournamentType.value =
                            value as EChallengeTournamentType;
                        }));
                      },
                    },
                    gameModeOnly: {
                      disabled: shouldBeDisabled || disableKeyItems,
                      onChange: (event, cIndex) => {
                        const value = event.target.value === 'true' ? true : false;
                        setChallenge(produce(challenge, draft => {
                          const { gameModeOnly } = draft.dailyChallengeList[cListIndex][cIndex].challengeKey;
                          if (gameModeOnly) {
                            gameModeOnly.value = value as boolean;
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
                          draft.dailyChallengeList[cListIndex][cIndex].challengeRedirection = {
                            value: '',
                            error: '',
                            required: true,
                          };
                        } else {
                          delete draft.dailyChallengeList[cListIndex][cIndex].challengeRedirection;
                        }
                      }));
                    },
                  },
                  challengeRedirection: {
                    disabled: shouldBeDisabled,
                    onChange: (event, cIndex) => {
                      const { value } = event.target;
                      setChallenge(produce(challenge, draft => {
                        const { challengeRedirection } = draft.dailyChallengeList[cListIndex][cIndex];
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
                        draft.dailyChallengeList[cListIndex][cIndex].heroChallenge.value =
                          checked as boolean;
                        if (checked as boolean) {
                          draft.dailyChallengeList[cListIndex][cIndex].heroChallengeData = challengeDefaults.challengeDetails.heroChallengeData ?
                            { ...challengeDefaults.challengeDetails.heroChallengeData } :
                            undefined;
                        } else {
                          delete draft.dailyChallengeList[cListIndex][cIndex].heroChallengeData;
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
                          const { heroChallengeData } = draft.dailyChallengeList[cListIndex][cIndex];
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
                          const { heroChallengeData } = draft.dailyChallengeList[cListIndex][cIndex];
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
                          const { heroChallengeData } = draft.dailyChallengeList[cListIndex][cIndex];
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
                          draft.dailyChallengeList[cListIndex][cIndex].dailyChallengeId =
                            { value: 0, error: '', required: true };
                        } else if (nullableOptions === false) {
                          draft.dailyChallengeList[cListIndex][cIndex].dailyChallengeId = null;
                        } else {
                          draft.dailyChallengeList[cListIndex][cIndex].dailyChallengeId =
                            { value: value as number, error: '', required: true };
                        }
                      }));
                    },
                  },
                  challengeLevelsList: {
                    addFn: (challengeIndex) => {
                      console.info('challengeLevelsList addFn 1', challengeDefaultsForC.challengeDetails.challengeLevelsList[0]);
                      if (isSelectedAppCrypto) {
                        setChallenge(produce(challenge, draft => {
                          draft.dailyChallengeList[cListIndex][challengeIndex].challengeLevelsList.push({
                            ...challengeDefaultsForC.challengeDetails.challengeLevelsList[0]
                          });
                        }));
                      } else {
                        setChallenge(produce(challenge, draft => {
                          console.info('challengeLevelsList addFn 2', challengeDefaults.challengeDetails.challengeLevelsList[0]);
                          draft.dailyChallengeList[cListIndex][challengeIndex].challengeLevelsList.push({
                            ...challengeDefaults.challengeDetails.challengeLevelsList[0]
                          });
                        }));
                      }
                    },
                    deleteFn: (challengeIndex, challengeLevelIndex) => {
                      setChallenge(produce(challenge, draft => {
                        draft.dailyChallengeList[cListIndex][challengeIndex].challengeLevelsList.splice(challengeLevelIndex, 1);
                      }));
                    },
                    parameter: {
                      disabled: shouldBeDisabled,
                      onChange: (event, cIndex, cLevelOptions = { cLevelIndex: 0, cLevelRewardIndex: 0 }) => {
                        const { value } = event.target;
                        setChallenge(produce(challenge, draft => {
                          draft.dailyChallengeList[cListIndex][cIndex].challengeLevelsList[cLevelOptions.cLevelIndex].parameter.value =
                            value as number;
                        }));
                      },
                    },
                    giftbox: {
                      disabled: shouldBeDisabled,
                      onChange: (event, cIndex, cLevelOptions = { cLevelIndex: 0, cLevelRewardIndex: 0 }) => {
                        const { value } = event.target;
                        setChallenge(produce(challenge, draft => {
                          draft.dailyChallengeList[cListIndex][cIndex].challengeLevelsList[cLevelOptions.cLevelIndex].giftbox.value =
                            value as EChallengeGiftBox;
                        }));
                      },
                    },
                    rewardsList: {
                      addFn: (challengeIndex, challengeLevelIndex) => {
                        console.info('challengeLevelsList rewardsList addFn 1', { ...challengeDefaultsForC.reward, currencyType: { ...challengeDefaultsForC.reward.currencyType, value: defaultVirtualCurrency }});
                        if (isSelectedAppCrypto) {
                          setChallenge(produce(challenge, draft => {
                            draft.dailyChallengeList[cListIndex][challengeIndex].challengeLevelsList[challengeLevelIndex].rewardsList.push({
                              ...challengeDefaultsForC.reward,
                              currencyType: {
                                ...challengeDefaultsForC.reward.currencyType,
                                value: defaultVirtualCurrency
                              }
                            });
                          }));
                        } else {
                          setChallenge(produce(challenge, draft => {
                            draft.dailyChallengeList[cListIndex][challengeIndex].challengeLevelsList[challengeLevelIndex].rewardsList.push({
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
                          draft.dailyChallengeList[cListIndex][challengeIndex].challengeLevelsList[challengeLevelIndex].rewardsList.splice(rewardIndex, 1);
                        }));
                      },
                      dailyRewardType: {
                        disabled: shouldBeDisabled,
                        onChange: (event, cIndex, cLevelOptions = { cLevelIndex: 0, cLevelRewardIndex: 0 }) => {
                          const { value } = event.target;
                          setChallenge(produce(challenge, draft => {
                            draft.dailyChallengeList[cListIndex][cIndex].challengeLevelsList[cLevelOptions.cLevelIndex].rewardsList[cLevelOptions.cLevelRewardIndex].dailyRewardType.value =
                              value as EChallengeDailyRewardType;
                          }));
                        },
                      },
                      amount: {
                        disabled: shouldBeDisabled,
                        onChange: (event, cIndex, cLevelOptions = { cLevelIndex: 0, cLevelRewardIndex: 0 }) => {
                          const { value } = event.target;
                          setChallenge(produce(challenge, draft => {
                            draft.dailyChallengeList[cListIndex][cIndex].challengeLevelsList[cLevelOptions.cLevelIndex].rewardsList[cLevelOptions.cLevelRewardIndex].amount.value =
                              value as number;
                          }));
                        },
                      },
                      currencyCode: {
                        disabled: shouldBeDisabled,
                        onChange: (event, cIndex, cLevelOptions = { cLevelIndex: 0, cLevelRewardIndex: 0 }) => {
                          const { value } = event.target;
                          setChallenge(produce(challenge, draft => {
                            draft.dailyChallengeList[cListIndex][cIndex].challengeLevelsList[cLevelOptions.cLevelIndex].rewardsList[cLevelOptions.cLevelRewardIndex].currencyCode.value =
                              value as ECurrency;
                          }));
                        },
                      },
                      currencyType: {
                        disabled: shouldBeDisabled,
                        onChange: (event, cIndex, cLevelOptions = { cLevelIndex: 0, cLevelRewardIndex: 0 }) => {
                          const { value } = event.target;
                          setChallenge(produce(challenge, draft => {
                            draft.dailyChallengeList[cListIndex][cIndex].challengeLevelsList[cLevelOptions.cLevelIndex].rewardsList[cLevelOptions.cLevelRewardIndex].currencyType.value =
                              value as ECost;
                          }));
                        },
                      },
                      duration: {
                        disabled: shouldBeDisabled,
                        onChange: (event, cIndex, cLevelOptions = { cLevelIndex: 0, cLevelRewardIndex: 0 }) => {
                          const { value } = event.target;
                          setChallenge(produce(challenge, draft => {
                            draft.dailyChallengeList[cListIndex][cIndex].challengeLevelsList[cLevelOptions.cLevelIndex].rewardsList[cLevelOptions.cLevelRewardIndex].duration.value =
                              value as number;
                          }));
                        },
                      },
                    },
                  },
                }}
              />
            </div>
          </WithAddDelete>
        )}
      </WithAddDelete>
    </React.Fragment>
  );
}

export default SectionChallengeDaily;

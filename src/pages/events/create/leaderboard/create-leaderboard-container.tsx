/* eslint-disable react-hooks/exhaustive-deps */
import produce from 'immer';
import React, { useEffect } from 'react';
import { useRouteMatch } from 'react-router-dom';
import { EVENT_URL_PARAMS, TMutateModes } from '../../../../common/common-types';
import {
  URL_SEARCH_KEY_EVENT_TYPE,
  XHR_STATE
} from '../../../../common/constants';
import {
  useAppDispatch,
  useAppSelector,
  useDefaultRealCurrency,
  useShouldShowPlaceholder,
  useUrlQuery
} from '../../../../common/hooks';
import { filterUniques } from '../../../../common/utils';
import globalStyles from '../../../../theme/globalStyles';
import {
  ECryptoCurrency,
  ECurrency,
  EEventCategory, EGroupType, EPlacementLocation, EWinScoreLogic, IEventBattleForm, IEventBattlePayload, placementHumanReadable, TCreateEventPresentationalProps
} from '../../../../types/eventTypes';
import { TFormFieldNumber } from '../../../../types/formFields';
import { EChallengeCashFlag, EChallengeTask, EChallengeTournamentType } from '../../../challenges/challenges-types';
import { getEventFormFromPayload, getEventPayloadFromForm } from '../../eventConverters';
import {
  defaultRewardFields, eventApiDispatchers, initialBattleForm,
  setEventForm
} from '../../eventSlice';
import { getActualEventCategory } from '../../index-events';
import CreateEventPresentational from '../create-presentational';


const stringField = { value: '', error: '', required: true };
const getForcedAsyncPlayerCount = (eventCategory: EEventCategory): TFormFieldNumber | null => {
  switch (eventCategory) {
    case EEventCategory.TOURNAMENT:
    case EEventCategory.MULTI_ENTRY_TOURNAMENT:
      return { ...stringField, value: 3 };
    case EEventCategory.ELIMINATION:
      return { ...stringField, value: 4 };
  }
  return null;
};

export const getPlayerCountKey = (eventCategory: EEventCategory): string => {
  //return eventCategory === EEventCategory.BATTLE ? '2' : '0';
  return '2';
};

const defaultBannerRulesText = `{
  "subtitle": "Introducing",
  "subtitleColor": "#ffffff",
  "backgroundColor": "#a542fb",
  "spaceGap": 15,
  "textAttributes": [
    {
      "prefixView": 2,
      "text": "<span style='font-size:15px;'><font face='GreycliffCF-Medium'>Top 3 players will win rewards⭐️</font></span>",
      "isHtmlString": true
    },
    {
      "prefixView": 2,
      "text": "<span style='font-size:15px;'><font face='GreycliffCF-Medium'>All it takes is one good startegy 🤳️️</font></span>",
      "isHtmlString": true
    },
    {
      "prefixView": 2,
      "text": "<span style='font-size:15px;'><font face='GreycliffCF-Medium'>Stay tuned! New tournamnets will be added 👀</font></span>",
      "isHtmlString": true
    }
  ],
  "buttonText": "OK",
  "textColor": "#ffffff",
  "smallDescription": "Top 3 players at the end of the match win rewards. || All players are given the same deck of cards. || In case of a tie, the player who submits their score first will win."
}`;

export const MAX_EXTRA_TIME_BEFORE_START = 604800;
export const MAX_EXTRA_TIME_AFTER_END = 86400;

function CreateEvent(props: any) {
  const dispatch = useAppDispatch();
  // todo move selectedApp to route
  const { selectedApp, isSelectedAppCrypto, apps, gameData } = useAppSelector(state => state.gameConfigForm);
  const { eventForm, events } = useAppSelector(state => state.eventSlice);
  const routeMatch = useRouteMatch();
  const routeParams = routeMatch.params as { id?: string };
  const searchQuery = useUrlQuery();
  const classes = globalStyles();
  const shouldShowPlaceholder = useShouldShowPlaceholder();
  const [mutateMode, setMutateMode] = React.useState<TMutateModes>('View');
  const modeFromUrl = searchQuery.get(EVENT_URL_PARAMS.mode);
  const eventCategoryFromUrl = searchQuery.get(URL_SEARCH_KEY_EVENT_TYPE) as EEventCategory;
  const eventCategory: EEventCategory = getActualEventCategory(eventCategoryFromUrl as EEventCategory);
  const [disableKeyItems, setDisableKeyItems] = React.useState<boolean>(false);
  const [enableTournamentNameId, setEnableTournamentNameId] = React.useState<boolean>(false);
  const defaultRealCurrency = useDefaultRealCurrency();
  const defaultForm: IEventBattleForm = React.useMemo(() => {
    return {
      ...initialBattleForm,
      eventCategory: {
        ...initialBattleForm.eventCategory,
        value: eventCategory
      },
      additionalParams: {
        ...initialBattleForm.additionalParams,
        forcedAsyncPlayerCount: getForcedAsyncPlayerCount(eventCategoryFromUrl),
        forcedAsyncMinPlayerCount: getForcedAsyncPlayerCount(eventCategoryFromUrl),
        isAsyncEnabled: {
          value: [
            EEventCategory.TOURNAMENT,
            EEventCategory.MULTI_ENTRY_TOURNAMENT,
            EEventCategory.ELIMINATION
          ].includes(eventCategoryFromUrl),
          error: '',
          required: false,
        },
        winScoreLogic: {
          ...stringField,
          value: eventCategoryFromUrl === EEventCategory.MULTI_ENTRY_TOURNAMENT ?
            EWinScoreLogic.BEST :
            EWinScoreLogic.NA,
        },
        playerCountToRewardList: {
          // [getPlayerCountKey(eventCategoryFromUrl)]: [{ ...defaultRewardFields }],
        },
        placementDataList: [{
          placementLocation: {
            ...stringField,
            value: selectedApp in placementHumanReadable ?
              Object.keys(placementHumanReadable[selectedApp])[0] as EPlacementLocation :
              EPlacementLocation.PGBottom
          },
          placementPriority: { value: 0, error: '', required: true },
          showOnCollapse: { value: false, error: '', required: true },
          prerequisiteJsonLogic: { value: '', error: '', required: true },
        }],
        mltData: eventCategoryFromUrl === EEventCategory.ELIMINATION ?
          {
            type: { ...stringField, value: 'SingleElimAsync' },
            maxPlayTime: { ...stringField, value: 86400 },
          } :
          null,
        rewardList: [{ ...defaultRewardFields }],
        gameIdToGameDataMap: (gameData && gameData.data && gameData.data.map(gameConfig => gameConfig.gameId).filter(filterUniques).length === 1) ? {
          [gameData.data.map(gameConfig => gameConfig.gameId).filter(filterUniques)[0]]: {
            _showDisplayName: false,
            _showImageDataList: false,
            _showRoundCount: false,
            _showGameSpecificParams: false,
            _showGameColor: false,
            _showDuration: false,
            _showPlayerCountPreferences: false,
            _showBotsEnabled: false,
            _showBotConfig: false,
            _showDifficultyMaxLevel: false,
            _showDifficultyMinLevel: false,
            _showBannerRulesText: false,
            _showWinQualificationJson: false,
          }
        } : {},
        walletCurrency: { ...stringField, value: isSelectedAppCrypto ? defaultRealCurrency : ECurrency.USD },
      },
    };
  }, [selectedApp, gameData]);

  useEffect(() => {
    dispatch(setEventForm({ ...defaultForm }));
  }, []);

  useEffect(() => {
    if (selectedApp) {
      dispatch(eventApiDispatchers.getEvents(getActualEventCategory(eventCategoryFromUrl), selectedApp));
      dispatch(setEventForm({
        ...defaultForm,
        appId: {
          ...eventForm.appId,
          value: selectedApp
        },
        additionalParams: {
          ...initialBattleForm.additionalParams,
          gameIdToGameDataMap: (gameData && gameData.data && gameData.data.map(gameConfig => gameConfig.gameId).filter(filterUniques).length === 1) ? {
            [gameData.data.map(gameConfig => gameConfig.gameId).filter(filterUniques)[0]]: {
              _showDisplayName: false,
              _showImageDataList: false,
              _showRoundCount: false,
              _showGameSpecificParams: false,
              _showGameColor: false,
              _showDuration: false,
              _showPlayerCountPreferences: false,
              _showBotsEnabled: false,
              _showBotConfig: false,
              _showDifficultyMaxLevel: false,
              _showDifficultyMinLevel: false,
              _showBannerRulesText: false,
              _showWinQualificationJson: false,
            }
          } : {},
          walletCurrency: { ...stringField, value: isSelectedAppCrypto ? defaultRealCurrency : ECurrency.USD },
        },
      }));
    }
  }, [selectedApp]);

  useEffect(() => {
    if (selectedApp) {
      // let found: IEventBattlePayload | undefined;
      let found: any;
      setMutateMode('Create');
      if (routeParams.id) {
        // find event for editing
        found = events.eventsList.find(event => event.id === parseInt(routeParams.id || '-1'));
        setMutateMode(modeFromUrl === EVENT_URL_PARAMS.modeValue ? 'View' : 'Edit');
      } else if (searchQuery.get('cloneId')) {
        // find event for cloning
        found = events.eventsList.find(event => event.id === parseInt(searchQuery.get('cloneId') || '-1'));
        setMutateMode('Clone');
      }
      // console.info('found', found);
      if (found) {
        dispatch(setEventForm({ ...getEventFormFromPayload(found as IEventBattlePayload) }));
      } else {
        dispatch(setEventForm({
          ...defaultForm,
          appId: {
            ...eventForm.appId,
            value: selectedApp
          }
        }));
      }
    }
  }, [selectedApp, events, modeFromUrl]);

  useEffect(() => {
    if (eventForm && eventForm.additionalParams.challengeKey) {
      let value = eventForm.additionalParams.challengeKey.challengeTask.value as EChallengeTask;
      dispatch(setEventForm(produce(eventForm, draftForm => {
        if (value === EChallengeTask.invite || value === EChallengeTask.inviteAndDepositX ||
          value === EChallengeTask.inviteXAndDeposit || value === EChallengeTask.xpPoint ||
          value === EChallengeTask.xpLevel) {
          draftForm.additionalParams.challengeKey.cashFlag.value = EChallengeCashFlag.all;
          draftForm.additionalParams.challengeKey.tournamentNameId = null;
          draftForm.additionalParams.challengeKey.tournamentType.value = EChallengeTournamentType.all;
          setDisableKeyItems(true);
        } else {
          setDisableKeyItems(false);
        }
      })));
    }
  }, [eventForm.additionalParams.challengeKey]);

  const formSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.info('todo this might be unused');
    // todo add payload
    dispatch(
      eventApiDispatchers.createEvent(getEventPayloadFromForm(eventForm),
        selectedApp,
        () => {
          // console.info(ROUTES.EVENTS +
          //   '?view=' + (isLive ? VIEW_VALUES.PROD : VIEW_VALUES.TEST) +
          //   '?type=' + searchQuery.get(URL_SEARCH_KEY_EVENT_TYPE));
          // history.push(ROUTES.EVENTS +
          //   '?view=' + (isLive ? VIEW_VALUES.PROD : VIEW_VALUES.TEST) +
          //   '?type=' + searchQuery.get(URL_SEARCH_KEY_EVENT_TYPE)
          // );
        }
      ));
  };


  const getCreateEventPresentationalProps = (): TCreateEventPresentationalProps => {
    const props: TCreateEventPresentationalProps = {
      dataFields: {
        maxExtraTimeBeforeStart: MAX_EXTRA_TIME_AFTER_END,
        eventCategory: eventCategory,
        shouldShowPlaceholder: Boolean(shouldShowPlaceholder && apps.loading !== XHR_STATE.IN_PROGRESS),
        mutateMode: mutateMode,
        formSubmit: formSubmit,
        gameIdToGameDataMap: eventForm.additionalParams.gameIdToGameDataMap,
        noAppPlaceholderImageUrl: 'https://assets.onclixlogix-samplecode.com/website/img/icons/illustration-calendar.svg',
        noAppPlaceholderText: 'You can set up your Live-ops events here. To see the events create a new app.',
      },

      formControls: {

        noAppPlaceholder: {
          render: Boolean(shouldShowPlaceholder && apps.loading !== XHR_STATE.IN_PROGRESS),
          error: '',
        },

        id: {
          value: eventForm.id.value,
          error: '',
        },

        groupIdCheckBox: {
          checked: Boolean(eventForm.groupId),
          disabled: Boolean(mutateMode === 'View'),
          error: '',
          onChange:
            (e) => {
              const { checked } = e.target;
              dispatch(setEventForm(produce(eventForm, draftForm => {
                draftForm.groupId = checked ? { ...stringField } : null;
              })));
            },
          render: eventCategoryFromUrl === EEventCategory.MULTI_ENTRY_TOURNAMENT,
        },

        groupIdTextBox: {
          value: eventForm.groupId?.value,
          error: eventForm.groupId?.error || '',
          disabled: Boolean(mutateMode === 'View'),
          onChange: (e) => {
            dispatch(setEventForm(produce(eventForm, draftForm => {
              if (draftForm.groupId) {
                draftForm.groupId.value = e.target.value as string;
              }
            })));
          }
        },

        description: {
          value: eventForm.description.value,
          error: eventForm.description.error,
          disabled: Boolean(mutateMode === 'View'),
          onChange: (e) => {
            dispatch(setEventForm(produce(eventForm, draftForm => {
              draftForm.description.value = e.target.value as string;
            })));
          },
        },

        extraTimeBeforeStart: {
          value: eventForm.extraTimeBeforeStart.value,
          error: eventForm.extraTimeBeforeStart.error,
          disabled: Boolean(mutateMode === 'View' || mutateMode === 'Edit'),
          onChange: (e) => {
            const value = e.target.value as number;
            dispatch(setEventForm(produce(eventForm, draftForm => {
              draftForm.extraTimeBeforeStart.value = value;
              draftForm.extraTimeBeforeStart.error = value >= 0 && value <= MAX_EXTRA_TIME_BEFORE_START ? '' : `value must be minimum 0 and maximum ${MAX_EXTRA_TIME_BEFORE_START}`;
            })));
          },
        },

        extraTimeAfterEnd: {
          value: eventForm.extraTimeAfterEnd.value,
          error: eventForm.extraTimeAfterEnd.error,
          disabled: Boolean(mutateMode === 'View' || mutateMode === 'Edit'),
          onChange: (e) => {
            const value = e.target.value as number;
            dispatch(setEventForm(produce(eventForm, draftForm => {
              draftForm.extraTimeAfterEnd.value = value;
              draftForm.extraTimeAfterEnd.error = value >= 0 && value <= MAX_EXTRA_TIME_AFTER_END ? '' : `value must be minimum 0 and maximum ${MAX_EXTRA_TIME_AFTER_END}`;
            })));
          },
        },

        walletCurrency: {
          render: eventCategory === EEventCategory.CHALLENGE_LEADERBOARD,
          value: eventForm.additionalParams.walletCurrency.value,
          error: eventForm.additionalParams.walletCurrency.error,
          disabled: Boolean(mutateMode === 'View'),
          onChange: (e) => {
            dispatch(setEventForm(produce(eventForm, draftForm => {
              if (draftForm.additionalParams.walletCurrency) {
                draftForm.additionalParams.walletCurrency.value = e.target.value as ECurrency | ECryptoCurrency;
              }
            })));
          }
        },

        groupType: {
          render: eventCategory === EEventCategory.CHALLENGE_LEADERBOARD,
          value: eventForm.additionalParams.groupType.value,
          error: eventForm.additionalParams.groupType.error,
          disabled: Boolean(mutateMode === 'View'),
          onChange: (e) => {
            dispatch(setEventForm(produce(eventForm, draftForm => {
              if (draftForm.additionalParams.groupType) {
                draftForm.additionalParams.groupType.value = e.target.value as EGroupType;
              }
            })));
          }
        },

        challengeName: {
          render: eventCategory === EEventCategory.CHALLENGE_LEADERBOARD,
          value: eventForm.additionalParams.challengeName.value,
          error: eventForm.additionalParams.challengeName.error,
          disabled: Boolean(mutateMode === 'View'),
          onChange: (e) => {
            dispatch(setEventForm(produce(eventForm, draftForm => {
              draftForm.additionalParams.challengeName.value = e.target.value as string;
              draftForm.additionalParams.challengeName.error = Boolean(e.target.value as string) ? '' : 'mandatory field';
            })));
          },
        },

        challengeDescription: {
          render: eventCategory === EEventCategory.CHALLENGE_LEADERBOARD,
          value: eventForm.additionalParams.challengeDescription.value,
          error: eventForm.additionalParams.challengeDescription.error,
          disabled: Boolean(mutateMode === 'View'),
          onChange: (e) => {
            dispatch(setEventForm(produce(eventForm, draftForm => {
              draftForm.additionalParams.challengeDescription.value = e.target.value as string;
              draftForm.additionalParams.challengeDescription.error = Boolean(e.target.value as string) ? '' : 'mandatory field';
            })));
          },
        },

        challengeKey: {
          render: eventCategory === EEventCategory.CHALLENGE_LEADERBOARD,
          value: eventForm.additionalParams.challengeKey.challengeTask.value,
          error: eventForm.additionalParams.challengeKey.challengeTask.error,
          disabled: Boolean(mutateMode === 'View'),
          onChange: (event) => {
            const value = event.target.value as EChallengeTask;
            dispatch(setEventForm(produce(eventForm, draftForm => {
              draftForm.additionalParams.challengeKey.challengeTask.value = value as EChallengeTask;
              draftForm.additionalParams.challengeKey.secondaryScoreIndex =
                value === EChallengeTask.secondaryScore ?
                  { value: 1, error: '', required: true } :
                  null;
            })));
          },
        },

        cashFlag: {
          render: eventCategory === EEventCategory.CHALLENGE_LEADERBOARD,
          value: eventForm.additionalParams.challengeKey.cashFlag.value,
          error: eventForm.additionalParams.challengeKey.cashFlag.error,
          disabled: Boolean(mutateMode === 'View') || disableKeyItems,
          onChange: (e) => {
            dispatch(setEventForm(produce(eventForm, draftForm => {
              if (draftForm.additionalParams.challengeKey.cashFlag) {
                draftForm.additionalParams.challengeKey.cashFlag.value = e.target.value as EChallengeCashFlag;
              }
            })));
          }
        },

        tournamentNameId: {
          render: (eventCategory === EEventCategory.CHALLENGE_LEADERBOARD &&
            eventForm.additionalParams.challengeKey.tournamentNameId != null),
          value: eventForm.additionalParams.challengeKey.tournamentNameId?.value,
          error: eventForm.additionalParams.challengeKey.tournamentNameId?.error || '',
          disabled: Boolean(mutateMode === 'View') || disableKeyItems,
          onChange: (e) => {
            const { value } = e.target;
            dispatch(setEventForm(produce(eventForm, draftForm => {
              const v = parseInt(value as string);
              // if (nullableOptions && newField) {
              //   newField = { ...newField, value: 1 };
              // } else if (!nullableOptions) {
              //   newField = null;
              // } else {
              //   const { tournamentNameId } = eventForm.additionalParams.challengeKey;
              //   if (tournamentNameId !== null) {
              //     newField = { ...tournamentNameId, value: value as number };
              //   }
              // }
              let newField = {
                value: v,
                error: v < 0 ? `value should be greater than 0` : ``,
                required: false,
              };
              draftForm.additionalParams.challengeKey.tournamentNameId = newField;
            })));
          },
        },

        secondaryScoreIndex: {
          render: (eventCategory === EEventCategory.CHALLENGE_LEADERBOARD &&
            eventForm.additionalParams.challengeKey.secondaryScoreIndex != null),
          value: eventForm.additionalParams.challengeKey.secondaryScoreIndex?.value,
          error: eventForm.additionalParams.challengeKey.secondaryScoreIndex?.error || '',
          disabled: Boolean(mutateMode === 'View'),
          onChange: (e) => {
            const { value } = e.target;
            dispatch(setEventForm(produce(eventForm, draftForm => {
              const v = parseInt(value as string);
              // if (nullableOptions && newField) {
              //   newField = { ...newField, value: 1 };
              // } else if (!nullableOptions) {
              //   newField = null;
              // } else {
              //   const { secondaryScoreIndex } = eventForm.additionalParams.challengeKey;
              //   if (secondaryScoreIndex !== null) {
              //     const v = parseInt(value as string);
              //     newField = {
              //       ...secondaryScoreIndex,
              //       value: value as number,
              //       error: v < 1 || v > 5 ? `value should be in between 1 and 5` : ``,
              //     };
              //   }
              // }
              let newField = {
                value: v,
                error: '',
                required: false,
              };
              draftForm.additionalParams.challengeKey.secondaryScoreIndex = newField;
            })));
          },
        },

        tournamentType: {
          render: eventCategory === EEventCategory.CHALLENGE_LEADERBOARD,
          value: eventForm.additionalParams.challengeKey.tournamentType.value,
          error: eventForm.additionalParams.challengeKey.tournamentType.error,
          disabled: Boolean(mutateMode === 'View') || disableKeyItems,
          onChange: (e) => {
            dispatch(setEventForm(produce(eventForm, draftForm => {
              if (draftForm.additionalParams.challengeKey.tournamentType) {
                draftForm.additionalParams.challengeKey.tournamentType.value = e.target.value as EChallengeTournamentType;
              }
            })));
          }
        },

        enableTournamentNameId: {
          render: eventCategory === EEventCategory.CHALLENGE_LEADERBOARD,
          checked: Boolean(eventForm.additionalParams.challengeKey.tournamentNameId !== null),
          error: '',
          disabled: Boolean(mutateMode === 'View') || disableKeyItems,
          onChange: (e) => {
            const { checked } = e.target;
            dispatch(setEventForm(produce(eventForm, draftForm => {
              if (checked) {
                draftForm.additionalParams.challengeKey.tournamentNameId = { value: 1, error: '', required: false };
              } else {
                draftForm.additionalParams.challengeKey.tournamentNameId = null;
              }
            })));
          }
        },

        enabledCountryCodes: {
          render: eventCategory !== EEventCategory.CHALLENGE_LEADERBOARD,
          error: '',
        },

        jsonLogicFilters: {
          value: eventForm.jsonLogicFilters.value,
          error: eventForm.jsonLogicFilters.error,
          disabled: Boolean(mutateMode === 'View'),
          onChange: (e) => {
            dispatch(setEventForm(produce(eventForm, draftForm => {
              draftForm.jsonLogicFilters.value = e.target.value as string;
            })));
          },
        },

        unlockLogic: {
          value: eventForm.unlockLogic.value,
          error: eventForm.unlockLogic.error,
          disabled: Boolean(mutateMode === 'View'),
          onChange: (e) => {
            dispatch(setEventForm(produce(eventForm, draftForm => {
              draftForm.unlockLogic.value = e.target.value as string;
            })));
          },
        },

        bannerRulesTextCheckBox: {
          checked: (gameId) => eventForm.additionalParams.gameIdToGameDataMap[gameId]._showBannerRulesText,
          disabled: Boolean(mutateMode === 'View'),
          error: '',
          onChange: (e, gameId?) => {
            if (gameId) {
              let newForm: IEventBattleForm = {
                ...eventForm,
                additionalParams: {
                  ...eventForm.additionalParams,
                  gameIdToGameDataMap: {
                    ...eventForm.additionalParams.gameIdToGameDataMap,
                    [gameId]: {
                      ...eventForm.additionalParams.gameIdToGameDataMap[gameId],
                      _showBannerRulesText: e.target.checked
                    },
                  }
                }
              };
              if (e.target.checked) {
                newForm = {
                  ...eventForm,
                  additionalParams: {
                    ...eventForm.additionalParams,
                    gameIdToGameDataMap: {
                      ...eventForm.additionalParams.gameIdToGameDataMap,
                      [gameId]: {
                        ...eventForm.additionalParams.gameIdToGameDataMap[gameId],
                        _showBannerRulesText: e.target.checked,
                        bannerRulesText: {
                          value: defaultBannerRulesText,
                          error: '',
                          required: true
                        }
                      },
                    }
                  }
                }
              } else {
                delete newForm.additionalParams.gameIdToGameDataMap[gameId].bannerRulesText;
              }
              dispatch(setEventForm(newForm));
            }
          },
        },

        bannerRulesTextTextBox: {
          value: (gameId) => eventForm.additionalParams.gameIdToGameDataMap[gameId].bannerRulesText?.value || '',
          error: (gameId) => eventForm.additionalParams.gameIdToGameDataMap[gameId].bannerRulesText?.error || '',
          disabled: Boolean(mutateMode === 'View'),
          onChange: (e, gameId?) => {
            if (gameId) {
              dispatch(setEventForm({
                ...eventForm,
                additionalParams: {
                  ...eventForm.additionalParams,
                  gameIdToGameDataMap: {
                    ...eventForm.additionalParams.gameIdToGameDataMap,
                    [gameId]: {
                      ...eventForm.additionalParams.gameIdToGameDataMap[gameId],
                      bannerRulesText: { value: e.target.value as string, error: '', required: false }
                    }
                  }
                }
              }));
            }
          },
          render: (gameId) => eventForm.additionalParams.gameIdToGameDataMap[gameId]._showBannerRulesText, // TODO : this is somehow always returning true in presenntational component
        },

        gameModeFields: {
          render: eventForm.eventCategory.value === EEventCategory.BATTLE ||
            eventForm.eventCategory.value === EEventCategory.TOURNAMENT,
          error: '',
        },

        battleFields: {
          render: eventForm.eventCategory.value === EEventCategory.BATTLE ||
            eventForm.eventCategory.value === EEventCategory.TOURNAMENT ||
            eventForm.eventCategory.value === EEventCategory.CHALLENGE_LEADERBOARD,
          error: '',
        },

        nudgeFields: {
          render: eventForm.eventCategory.value === EEventCategory.SALE,
          error: '',
        },
      },
    };

    return props;
  };


  return (

    <CreateEventPresentational
      {...getCreateEventPresentationalProps()}
    />

  );
}

export default CreateEvent;

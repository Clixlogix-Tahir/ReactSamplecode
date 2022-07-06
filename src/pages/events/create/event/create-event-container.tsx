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
  useShouldShowPlaceholder,
  useUrlQuery
} from '../../../../common/hooks';
import globalStyles from '../../../../theme/globalStyles';
import {
  EEventCategory, EPlacementLocation, EWinScoreLogic, IEventBattleForm, IEventBattlePayload, IEventNudgePayload, placementHumanReadable, TCreateEventPresentationalProps
} from '../../../../types/eventTypes';
import { TFormFieldNumber } from '../../../../types/formFields';
import { getEventFormFromPayload, getEventPayloadFromForm, getNudgeFormFromPayload } from '../../eventConverters';
import {
  defaultRewardFields, eventApiDispatchers, initialBattleForm,
  initialNudgeForm, setEventForm, setNudgeForm
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
  return eventCategory === EEventCategory.BATTLE ? '2' : '0';
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
  const { selectedApp, apps } = useAppSelector(state => state.gameConfigForm);
  const { eventForm, events, nudgeForm } = useAppSelector(state => state.eventSlice);
  const routeMatch = useRouteMatch();
  const routeParams = routeMatch.params as { id?: string };
  const searchQuery = useUrlQuery();
  const classes = globalStyles();
  const shouldShowPlaceholder = useShouldShowPlaceholder();
  const [mutateMode, setMutateMode] = React.useState<TMutateModes>('View');
  const modeFromUrl = searchQuery.get(EVENT_URL_PARAMS.mode);
  const eventCategoryFromUrl = searchQuery.get(URL_SEARCH_KEY_EVENT_TYPE) as EEventCategory;
  const eventCategory: EEventCategory = getActualEventCategory(eventCategoryFromUrl as EEventCategory);
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
          [getPlayerCountKey(eventCategoryFromUrl)]: [{ ...defaultRewardFields }],
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
      }
    }
  }, [selectedApp]);

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
        }
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
        if ([EEventCategory.BATTLE, EEventCategory.TOURNAMENT, EEventCategory.MULTI_ENTRY_TOURNAMENT].includes(eventCategory)) {
          dispatch(setEventForm({ ...getEventFormFromPayload(found as IEventBattlePayload) }));
        } else if (eventCategory === EEventCategory.SALE) {
          dispatch(setNudgeForm({ ...getNudgeFormFromPayload(found as IEventNudgePayload) }));
        }
      } else {
        if (eventCategory === EEventCategory.BATTLE) {
          dispatch(setEventForm({
            ...defaultForm,
            appId: {
              ...eventForm.appId,
              value: selectedApp
            }
          }));
        } else {
          dispatch(setNudgeForm({
            ...initialNudgeForm,
            appId: {
              ...eventForm.appId,
              value: selectedApp
            }
          }));
        }
      }
    }
  }, [selectedApp, events, modeFromUrl]);

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
          error: ''
        },

        id: {
          value: eventCategory === EEventCategory.BATTLE ? eventForm.id.value : nudgeForm.id.value,
          error: ''
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
          value: eventCategory === EEventCategory.BATTLE ? eventForm.description.value : nudgeForm.description.value,
          error: eventForm.description.error,
          disabled: Boolean(mutateMode === 'View'),
          onChange: (e) => {
            if (eventCategory === EEventCategory.BATTLE) {
              dispatch(setEventForm(produce(eventForm, draftForm => {
                draftForm.description.value = e.target.value as string;
              })));
            } else if (eventCategory === EEventCategory.SALE) {
              dispatch(setNudgeForm(produce(nudgeForm, draftForm => {
                draftForm.description.value = e.target.value as string;
              })));
            }
          },
        },

        extraTimeBeforeStart: {
          value: eventCategory === EEventCategory.BATTLE ? eventForm.extraTimeBeforeStart.value : nudgeForm.extraTimeBeforeStart.value,
          error: eventForm.extraTimeBeforeStart.error,
          disabled: Boolean(mutateMode === 'View' || mutateMode === 'Edit'),
          onChange: (e) => {
            const value = e.target.value as number;
            if (eventCategory === EEventCategory.BATTLE) {
              dispatch(setEventForm(produce(eventForm, draftForm => {
                draftForm.extraTimeBeforeStart.value = value;
                draftForm.extraTimeBeforeStart.error = value >= 0 && value <= MAX_EXTRA_TIME_BEFORE_START ? '' : `value must be minimum 0 and maximum ${MAX_EXTRA_TIME_BEFORE_START}`;
              })));
            } else if (eventCategory === EEventCategory.SALE) {
              dispatch(setNudgeForm(produce(nudgeForm, draftForm => {
                draftForm.extraTimeBeforeStart.value = value;
                draftForm.extraTimeBeforeStart.error = value >= 0 && value <= MAX_EXTRA_TIME_BEFORE_START ? '' : `value must be minimum 0 and maximum ${MAX_EXTRA_TIME_BEFORE_START}`;
              })));
            }
          },
        },

        extraTimeAfterEnd: {
          value: eventCategory === EEventCategory.BATTLE ? eventForm.extraTimeAfterEnd.value : nudgeForm.extraTimeAfterEnd.value,
          error: eventForm.extraTimeAfterEnd.error,
          disabled: Boolean(mutateMode === 'View' || mutateMode === 'Edit'),
          onChange: (e) => {
            const value = e.target.value as number;
            if (eventCategory === EEventCategory.BATTLE) {
              dispatch(setEventForm(produce(eventForm, draftForm => {
                draftForm.extraTimeAfterEnd.value = value;
                draftForm.extraTimeAfterEnd.error = value >= 0 && value <= MAX_EXTRA_TIME_AFTER_END ? '' : `value must be minimum 0 and maximum ${MAX_EXTRA_TIME_AFTER_END}`;
              })));
            } else if (eventCategory === EEventCategory.SALE) {
              dispatch(setNudgeForm(produce(nudgeForm, draftForm => {
                draftForm.extraTimeAfterEnd.value = value;
                draftForm.extraTimeAfterEnd.error = value >= 0 && value <= MAX_EXTRA_TIME_AFTER_END ? '' : `value must be minimum 0 and maximum ${MAX_EXTRA_TIME_AFTER_END}`;
              })));
            }
          },
        },

        walletCurrency: {
          render: eventCategory === EEventCategory.CHALLENGE_LEADERBOARD,
          error: '',
        },
        groupType: {
          render: eventCategory === EEventCategory.CHALLENGE_LEADERBOARD,
          error: '',
        },
        challengeName: {
          render: eventCategory === EEventCategory.CHALLENGE_LEADERBOARD,
          error: '',
        },
        challengeDescription: {
          render: eventCategory === EEventCategory.CHALLENGE_LEADERBOARD,
          error: '',
        },
        challengeKey: {
          render: eventCategory === EEventCategory.CHALLENGE_LEADERBOARD,
          error: '',
        },
        cashFlag: {
          render: eventCategory === EEventCategory.CHALLENGE_LEADERBOARD,
          error: '',
        },
        secondaryScoreIndex: {
          render: eventCategory === EEventCategory.CHALLENGE_LEADERBOARD,
          error: '',
        },
        tournamentNameId: {
          render: eventCategory === EEventCategory.CHALLENGE_LEADERBOARD,
          error: '',
        },
        enableTournamentNameId: {
          render: eventCategory === EEventCategory.CHALLENGE_LEADERBOARD,
          error: '',
        },
        tournamentType: {
          render: eventCategory === EEventCategory.CHALLENGE_LEADERBOARD,
          error: '',
        },

        enabledCountryCodes: {
          value: eventCategory === EEventCategory.BATTLE ? eventForm.enabledCountryCodes.value.join(', ') : nudgeForm.enabledCountryCodes.value.join(', '),
          error: '',
          onChange: (e) => {
            let newCodes = [...eventForm.enabledCountryCodes.value];
            if (newCodes.indexOf(e.target.value as string) >= 0) {
              newCodes.splice(0, 1);
            } else {
              newCodes = [e.target.value as string];
            }
            if (eventCategory === EEventCategory.BATTLE) {
              dispatch(setEventForm(produce(eventForm, draftForm => {
                draftForm.enabledCountryCodes.value = newCodes;
              })));
            } else if (eventCategory === EEventCategory.SALE) {
              dispatch(setNudgeForm(produce(nudgeForm, draftForm => {
                draftForm.enabledCountryCodes.value = newCodes;
              })));
            }
          },
          render: eventCategory !== EEventCategory.CHALLENGE_LEADERBOARD,
        },

        jsonLogicFilters: {
          value: eventCategory === EEventCategory.BATTLE ? eventForm.jsonLogicFilters.value : nudgeForm.jsonLogicFilters.value,
          error: eventForm.jsonLogicFilters.error,
          disabled: Boolean(mutateMode === 'View'),
          onChange: (e) => {
            if (eventCategory === EEventCategory.BATTLE) {
              dispatch(setEventForm(produce(eventForm, draftForm => {
                draftForm.jsonLogicFilters.value = e.target.value as string;
              })));
            } else if (eventCategory === EEventCategory.SALE) {
              dispatch(setNudgeForm(produce(nudgeForm, draftForm => {
                draftForm.jsonLogicFilters.value = e.target.value as string;
              })));
            }
          },
        },

        unlockLogic: {
          value: eventCategory === EEventCategory.BATTLE ? eventForm.unlockLogic.value : nudgeForm.unlockLogic.value,
          error: eventForm.unlockLogic.error,
          disabled: Boolean(mutateMode === 'View'),
          onChange: (e) => {
            if (eventCategory === EEventCategory.BATTLE) {
              dispatch(setEventForm(produce(eventForm, draftForm => {
                draftForm.unlockLogic.value = e.target.value as string;
              })));
            } else if (eventCategory === EEventCategory.SALE) {
              dispatch(setNudgeForm(produce(nudgeForm, draftForm => {
                draftForm.unlockLogic.value = e.target.value as string;
              })));
            }
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
          render: (gameId) => eventForm.additionalParams.gameIdToGameDataMap[gameId]._showBannerRulesText,
        },

        gameModeFields: {
          render: eventForm.eventCategory.value === EEventCategory.BATTLE ||
            eventForm.eventCategory.value === EEventCategory.TOURNAMENT,
          error: '',
        },

        battleFields: {
          render: eventForm.eventCategory.value === EEventCategory.BATTLE ||
            eventForm.eventCategory.value === EEventCategory.TOURNAMENT,
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

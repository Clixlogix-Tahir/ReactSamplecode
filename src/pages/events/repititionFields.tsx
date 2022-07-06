import {
  FormControl, FormControlLabel, FormLabel,
  Radio, RadioGroup, TextField
} from '@material-ui/core';
import produce from 'immer';
import moment from 'moment';
import React, { Fragment } from 'react';
import Datetime from 'react-datetime';
import "react-datetime/css/react-datetime.css";
import { useRouteMatch } from 'react-router-dom';
import { ROUTES, URL_SEARCH_KEY_EVENT_TYPE } from '../../common/constants';
import {
  useAppDispatch,
  useAppSelector,
  useUrlQuery
} from '../../common/hooks';
import { defaultRepetitions, EEventCategory, ERepetitionType } from '../../types/eventTypes';
import { setEventForm, setNudgeForm } from './eventSlice';
import { getActualEventCategory } from './index-events';

function RepititionFields(props: any) {
  const dispatch = useAppDispatch();
  const route = useRouteMatch();
  const searchQuery = useUrlQuery();
  const eventCategoryFromUrl: EEventCategory = searchQuery.get(URL_SEARCH_KEY_EVENT_TYPE) as EEventCategory || EEventCategory.BATTLE;
  const { eventForm, nudgeForm } = useAppSelector(state => state.eventSlice);
  const eventCategoryInPayload = getActualEventCategory(eventCategoryFromUrl);

  return (
    <Fragment>
      {(eventCategoryInPayload === EEventCategory.SALE ? nudgeForm : eventForm).repetitions.map((repetition, repIndex) =>
        <div className="indent" key={repIndex}>
          <FormControl component="fieldset">
            <FormLabel component="legend">Recurrence type</FormLabel>
            <RadioGroup
              style={{ display: 'inline-block', marginBottom: 0 }}
              aria-label="Recurrence type" name="recurrence-type"
              value={repetition._type}
              // helperText={form.engineData.engineType.error}
              onChange={(e: React.ChangeEvent<{ value: unknown }>) => {
                if (eventCategoryInPayload === EEventCategory.BATTLE ||
                  eventCategoryInPayload === EEventCategory.CHALLENGE_LEADERBOARD) {
                  dispatch(setEventForm(produce(eventForm, draftForm => {
                    draftForm.repetitions[repIndex]._type =  e.target.value as ERepetitionType;
                    draftForm.repetitions[repIndex].repetitionKeyValueMap = { ...defaultRepetitions[e.target.value as ERepetitionType] }
                  })));
                } else if (eventCategoryInPayload === EEventCategory.SALE) {
                  dispatch(setNudgeForm(produce(nudgeForm, draftForm => {
                    draftForm.repetitions[repIndex]._type =  e.target.value as ERepetitionType;
                    draftForm.repetitions[repIndex].repetitionKeyValueMap = { ...defaultRepetitions[e.target.value as ERepetitionType] }
                  })));
                }
              }}
            >
              {Object.keys(ERepetitionType).map(rType =>
                <FormControlLabel style={{ display: 'inline-block', marginBottom: 0 }}
                  label={rType} value={rType} key={rType}
                  control={
                    <Radio
                      disabled={route.path.startsWith(ROUTES.EDIT_EVENT.replace(':id', '')) ||
                        route.path.startsWith(ROUTES.EDIT_LEADERBOARD.replace(':id', ''))
                      }
                    />
                  }
                />
              )}
            </RadioGroup>
          </FormControl>
          <FormControl>
            <FormLabel disabled={route.path.startsWith(ROUTES.EDIT_EVENT.replace(':id', '')) ||
              route.path.startsWith(ROUTES.EDIT_LEADERBOARD.replace(':id', ''))}
            >
              Start
            </FormLabel>
            <Datetime
              value={new Date(repetition.repetitionKeyValueMap.Start.value)}
              inputProps={{
                className: 'MuiInputBase-input MuiInput-input',
                disabled: route.path.startsWith(ROUTES.EDIT_EVENT.replace(':id', '')) ||
                  route.path.startsWith(ROUTES.EDIT_LEADERBOARD.replace(':id', '')),
                style: {
                  borderBottom: (route.path.startsWith(ROUTES.EDIT_EVENT.replace(':id', '')) ||
                    route.path.startsWith(ROUTES.EDIT_LEADERBOARD.replace(':id', ''))) ?
                    'dotted 1px rgba(0, 0, 0, 0.42)' : '1px solid rgba(0, 0, 0, 0.42)',
                  color: (route.path.startsWith(ROUTES.EDIT_EVENT.replace(':id', '')) ||
                    route.path.startsWith(ROUTES.EDIT_LEADERBOARD.replace(':id', ''))) ?
                    'rgba(0, 0, 0, 0.38)' : 'inherit',
                },
                onKeyUp: (e: any) => console.info(e.target.selectionStart)
              }}
              onChange={e => {
                if (eventCategoryInPayload === EEventCategory.BATTLE ||
                  eventCategoryInPayload === EEventCategory.CHALLENGE_LEADERBOARD) {
                  dispatch(setEventForm(produce(eventForm, draftForm => {
                    draftForm.repetitions[repIndex].repetitionKeyValueMap.Start.value = moment(e).toDate().toJSON();
                  })));
                } else if (eventCategoryInPayload === EEventCategory.SALE) {
                  dispatch(setNudgeForm(produce(nudgeForm, draftForm => {
                    draftForm.repetitions[repIndex].repetitionKeyValueMap.Start.value = moment(e).toDate().toJSON();
                  })));
                }
              }}
            />
          </FormControl>
          <FormControl>
            <FormLabel disabled={route.path.startsWith(ROUTES.EDIT_EVENT.replace(':id', '')) ||
              route.path.startsWith(ROUTES.EDIT_LEADERBOARD.replace(':id', ''))}
            >
              End
            </FormLabel>
            <Datetime
              value={new Date(repetition.repetitionKeyValueMap.End.value)}
              inputProps={{
                className: 'MuiInputBase-input MuiInput-input',
                disabled: route.path.startsWith(ROUTES.EDIT_EVENT.replace(':id', '')) ||
                  route.path.startsWith(ROUTES.EDIT_LEADERBOARD.replace(':id', '')),
                style: {
                  borderBottom: (route.path.startsWith(ROUTES.EDIT_EVENT.replace(':id', '')) ||
                    route.path.startsWith(ROUTES.EDIT_LEADERBOARD.replace(':id', ''))) ?
                    'dotted 1px' : 'solid 1px',
                  color: (route.path.startsWith(ROUTES.EDIT_EVENT.replace(':id', '')) ||
                    route.path.startsWith(ROUTES.EDIT_LEADERBOARD.replace(':id', ''))) ?
                    'rgba(0, 0, 0, 0.38)' : 'inherit',
                },
              }}
              onChange={e => {
                if (eventCategoryInPayload === EEventCategory.BATTLE ||
                  eventCategoryInPayload === EEventCategory.CHALLENGE_LEADERBOARD) {
                  dispatch(setEventForm(produce(eventForm, draftForm => {
                    draftForm.repetitions[repIndex].repetitionKeyValueMap.End.value = moment(e).toDate().toJSON();
                  })));
                } else if (eventCategoryInPayload === EEventCategory.SALE) {
                  dispatch(setNudgeForm(produce(nudgeForm, draftForm => {
                    draftForm.repetitions[repIndex].repetitionKeyValueMap.End.value = moment(e).toDate().toJSON();
                  })));
                }
              }}
            />
          </FormControl>
          {/* <FormControl>
            <FormLabel>Start</FormLabel>
            <Input
              id={`field-rev-start-${repIndex}`}
              type="datetime-local"
              value={repetition.repetitionKeyValueMap.Start.value}
              error={repetition.repetitionKeyValueMap.Start.error !== ''}
              // helperText={form.gameId.error}
              disabled={route.path.startsWith(ROUTES.EDIT_EVENT.replace(':id', ''))}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="delete placement data"
                    // disabled={form.gameControlParams.tutorialData.slideUrls.value.length <= 1 || routeMatch.path !== ROUTES.CREATE}
                    onClick={e => {
                      const repCopy = [...eventForm.repetitions];
                      repCopy.splice(repIndex, 1);
                      dispatch(setEventForm({
                        ...eventForm,
                        repetitions: repCopy
                      }));
                    }}
                    // onMouseDown={handleMouseDownPassword}
                  >
                    <DeleteIcon />
                  </IconButton>
                </InputAdornment>
              }
              onChange={(e: React.ChangeEvent<{ value: unknown }>) => {
                const repCopy = [...eventForm.repetitions];
                const newRep = {
                  ...eventForm.repetitions[repIndex],
                  repetitionKeyValueMap: {
                    ...eventForm.repetitions[repIndex].repetitionKeyValueMap,
                    Start: {
                      ...eventForm.repetitions[repIndex].repetitionKeyValueMap.Start,
                      value: e.target.value as string
                    }
                  }
                };
                repCopy.splice(repIndex, 1);
                repCopy.splice(repIndex, 0, newRep);
                dispatch(setEventForm({
                  ...eventForm,
                  repetitions: repCopy
                }));
              }}
            />
          </FormControl>
          <FormControl>
            <TextField
              id={`field-rev-end-${repIndex}`}
              type="datetime-local"
              label="End"
              value={repetition.repetitionKeyValueMap.End.value}
              error={repetition.repetitionKeyValueMap.End.error !== ''}
              // helperText={form.gameId.error}
              disabled={route.path.startsWith(ROUTES.EDIT_EVENT.replace(':id', ''))}
              onChange={(e: React.ChangeEvent<{ value: unknown }>) => {
                const repCopy = [...eventForm.repetitions];
                const newRep = {
                  ...eventForm.repetitions[repIndex],
                  repetitionKeyValueMap: {
                    ...eventForm.repetitions[repIndex].repetitionKeyValueMap,
                    End: {
                      ...eventForm.repetitions[repIndex].repetitionKeyValueMap.End,
                      value: e.target.value as string
                    }
                  }
                };
                repCopy.splice(repIndex, 1);
                repCopy.splice(repIndex, 0, newRep);
                dispatch(setEventForm({
                  ...eventForm,
                  repetitions: repCopy
                }));
              }}
            />
          </FormControl> */}
          {(repetition._type === ERepetitionType.INTERVAL_BASED || repetition._type === ERepetitionType.CALENDAR_BASED) &&
            repetition.repetitionKeyValueMap.Duration &&
            <FormControl>
              <TextField
                id={`field-rev-duration-${repIndex}`}
                label="Duration"
                value={repetition.repetitionKeyValueMap.Duration.value}
                error={repetition.repetitionKeyValueMap.Duration.error !== ''}
                // helperText={form.gameId.error}
                disabled={route.path.startsWith(ROUTES.EDIT_EVENT.replace(':id', '')) ||
                  route.path.startsWith(ROUTES.EDIT_LEADERBOARD.replace(':id', ''))
                }
                onChange={(e: React.ChangeEvent<{ value: unknown }>) => {
                  const field = {
                    value: e.target.value as number,
                    error: '',
                    required: true,
                  };
                  if (eventCategoryInPayload === EEventCategory.BATTLE ||
                    eventCategoryInPayload === EEventCategory.CHALLENGE_LEADERBOARD) {
                    dispatch(setEventForm(produce(eventForm, draftForm => {
                      draftForm.repetitions[repIndex].repetitionKeyValueMap.Duration = field;
                    })));
                  } else if (eventCategoryInPayload === EEventCategory.SALE) {
                    dispatch(setNudgeForm(produce(nudgeForm, draftForm => {
                      draftForm.repetitions[repIndex].repetitionKeyValueMap.Duration = field;
                    })));
                  }
                }}
                type="number"
              />
            </FormControl>
          }
          {repetition._type === ERepetitionType.INTERVAL_BASED &&
            repetition.repetitionKeyValueMap.StartTimeGapInSec &&
            <FormControl>
              <TextField
                id={`field-rev-StartTimeGapInSec-${repIndex}`}
                label="StartTimeGapInSec"
                value={repetition.repetitionKeyValueMap.StartTimeGapInSec.value}
                error={repetition.repetitionKeyValueMap.StartTimeGapInSec.error !== ''}
                helperText="This must be at least 20 + extraTimeBeforeStart + extraTimeAfterEnd seconds greater than Duration. Also visualize each occurrence while setting up."
                disabled={route.path.startsWith(ROUTES.EDIT_EVENT.replace(':id', '')) ||
                  route.path.startsWith(ROUTES.EDIT_LEADERBOARD.replace(':id', ''))
                }  
                onChange={(e: React.ChangeEvent<{ value: unknown }>) => {
                  const field = {
                    value: e.target.value as number,
                    error: '',
                    required: true,
                  };

                  const {Duration } = repetition.repetitionKeyValueMap;
                    if (Duration && (+field.value < 20 + +eventForm.extraTimeBeforeStart.value + +eventForm.extraTimeAfterEnd.value + +Duration.value)) {
                      field.error = 'StartTimeGapInSec is not having appropriate value.';
                    } else {
                     field.error = '';
                    }

                  if (eventCategoryInPayload === EEventCategory.BATTLE ||
                    eventCategoryInPayload === EEventCategory.CHALLENGE_LEADERBOARD) {
                    dispatch(setEventForm(produce(eventForm, draftForm => {
                      draftForm.repetitions[repIndex].repetitionKeyValueMap.StartTimeGapInSec = field;
                    })));
                  } else if (eventCategoryInPayload === EEventCategory.SALE) {
                    dispatch(setNudgeForm(produce(nudgeForm, draftForm => {
                      draftForm.repetitions[repIndex].repetitionKeyValueMap.StartTimeGapInSec = field;
                    })));
                  }
                }}
                type="number"
              />
            </FormControl>
          }
          {repetition._type === ERepetitionType.CALENDAR_BASED &&
            repetition.repetitionKeyValueMap.DayInMonth &&
            repetition.repetitionKeyValueMap.DayInWeek &&
            repetition.repetitionKeyValueMap.TimeInDay &&
            <Fragment>
              <FormControl>
                <TextField
                  id={`field-rev-DayInMonth-${repIndex}`}
                  label="DayInMonth"
                  value={repetition.repetitionKeyValueMap.DayInMonth.value}
                  error={repetition.repetitionKeyValueMap.DayInMonth.error !== ''}
                  // helperText={form.gameId.error}
                  disabled={route.path.startsWith(ROUTES.EDIT_EVENT.replace(':id', '')) || 
                    route.path.startsWith(ROUTES.EDIT_LEADERBOARD.replace(':id', ''))
                  }
                  onChange={(e: React.ChangeEvent<{ value: unknown }>) => {
                    const field = {
                      value: e.target.value as number,
                      error: '',
                      required: true,
                    };
                    if (eventCategoryInPayload === EEventCategory.BATTLE || 
                      eventCategoryInPayload === EEventCategory.CHALLENGE_LEADERBOARD) {
                      dispatch(setEventForm(produce(eventForm, draftForm => {
                        draftForm.repetitions[repIndex].repetitionKeyValueMap.DayInMonth = field;
                      })));
                    } else if (eventCategoryInPayload === EEventCategory.SALE) {
                      dispatch(setNudgeForm(produce(nudgeForm, draftForm => {
                        draftForm.repetitions[repIndex].repetitionKeyValueMap.DayInMonth = field;
                      })));
                    }
                  }}
                  type="number"
                />
              </FormControl>
              <FormControl>
                <TextField
                  id={`field-rev-DayInWeek-${repIndex}`}
                  label="DayInWeek"
                  value={repetition.repetitionKeyValueMap.DayInWeek.value}
                  error={repetition.repetitionKeyValueMap.DayInWeek.error !== ''}
                  // helperText={form.gameId.error}
                  disabled={route.path.startsWith(ROUTES.EDIT_EVENT.replace(':id', '')) ||
                    route.path.startsWith(ROUTES.EDIT_LEADERBOARD.replace(':id', ''))
                  }
                  onChange={(e: React.ChangeEvent<{ value: unknown }>) => {
                    const field = {
                      value: e.target.value as number,
                      error: '',
                      required: true,
                    };
                    if (eventCategoryInPayload === EEventCategory.BATTLE ||
                      eventCategoryInPayload === EEventCategory.CHALLENGE_LEADERBOARD) {
                      dispatch(setEventForm(produce(eventForm, draftForm => {
                        draftForm.repetitions[repIndex].repetitionKeyValueMap.DayInWeek = field;
                      })));
                    } else if (eventCategoryInPayload === EEventCategory.SALE) {
                      dispatch(setNudgeForm(produce(nudgeForm, draftForm => {
                        draftForm.repetitions[repIndex].repetitionKeyValueMap.DayInWeek = field;
                      })));
                    }
                  }}
                  type="number"
                />
              </FormControl>
              <FormControl>
                <TextField
                  id={`field-rev-TimeInDay-${repIndex}`}
                  label="TimeInDay"
                  value={repetition.repetitionKeyValueMap.TimeInDay.value}
                  error={repetition.repetitionKeyValueMap.TimeInDay.error !== ''}
                  // helperText={form.gameId.error}
                  disabled={route.path.startsWith(ROUTES.EDIT_EVENT.replace(':id', '')) || 
                    route.path.startsWith(ROUTES.EDIT_LEADERBOARD.replace(':id', ''))
                  }
                  onChange={(e: React.ChangeEvent<{ value: unknown }>) => {
                    const field = {
                      value: e.target.value as number,
                      error: '',
                      required: true,
                    };
                    if (eventCategoryInPayload === EEventCategory.BATTLE ||
                      eventCategoryInPayload === EEventCategory.CHALLENGE_LEADERBOARD) {
                      dispatch(setEventForm(produce(eventForm, draftForm => {
                        draftForm.repetitions[repIndex].repetitionKeyValueMap.TimeInDay = field;
                      })));
                    } else if (eventCategoryInPayload === EEventCategory.SALE) {
                      dispatch(setNudgeForm(produce(nudgeForm, draftForm => {
                        draftForm.repetitions[repIndex].repetitionKeyValueMap.TimeInDay = field;
                      })));
                    }
                  }}
                  type="number"
                />
              </FormControl>
            </Fragment>
          }
        </div>
      )}
      {/* commenting because only one repitition is supported
      <Button
        variant="outlined"
        color="primary"
        onClick={e => {
          dispatch(setEventForm({
            ...eventForm,
            repetitions: [
              ...eventForm.repetitions,
              {
                _type: ERepetitionType.ONE_TIME,
                repetitionId: { value: 0, error: '', required: false },
                repetitionKeyValueMap: {
                  Start: { value: getDateTimeForMuiField(), error: '', required: false },
                  End: { value: getDateTimeForMuiField(ONE_DAY_IN_MILLIS), error: '', required: false },
                },
              }
            ]
          }));
        }}
      >
        Add Repitition
      </Button> */}
    </Fragment>
  );
}

export default RepititionFields;
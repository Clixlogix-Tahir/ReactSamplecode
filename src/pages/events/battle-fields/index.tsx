/* eslint-disable react-hooks/exhaustive-deps */
import {
  Button, Checkbox, FormControl, FormControlLabel, FormLabel, IconButton, Input, MenuItem,
  InputLabel, Radio, RadioGroup, Select, TextField, Snackbar,
} from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import produce from 'immer';
import React, { Fragment, useMemo, useState } from 'react';
import { URL_SEARCH_KEY_EVENT_TYPE } from '../../../common/constants';
import {
  useAppDispatch,
  useAppSelector,
  useUrlQuery
} from '../../../common/hooks';
import globalStyles from '../../../theme/globalStyles';
import {
  EDefaultIconsImages,
  EEntryType,
  EEventCategory,
  EImageUploadType,
  EPlacementLocation,
  EWinScoreLogic,
  placementHumanReadable,
  TMutateProps
} from '../../../types/eventTypes';
import { Alert } from '@material-ui/lab';
import { appManagementApi } from '../../app-management/appManagementApi';
import { setEventForm } from '../eventSlice';
import EntryFields from './entryFields';
import RewardFields from './rewardFields';
import { CircularProgress } from '@material-ui/core';
import { acceptedTypes } from '../../app-management/constants';
import '../../app-management/app-details/fileUpload.css';
import RewardList from './rewardList';
import { APP_ID } from '../../../types/types';

function BattleFields({ mutateMode }: TMutateProps) {
  const dispatch = useAppDispatch();
  const classes = globalStyles();
  const { selectedApp } = useAppSelector(state => state.gameConfigForm);
  const { eventForm } = useAppSelector(state => state.eventSlice);
  const searchQuery = useUrlQuery();
  const eventCategoryFromUrl = useMemo(() => searchQuery.get(URL_SEARCH_KEY_EVENT_TYPE), []);
  const placementKey = useMemo(() =>
    Object.keys(placementHumanReadable).includes(selectedApp) ? selectedApp : 'common',
    [selectedApp]
  );
  const [groupPriority, setGroupPriority] = useState<number>(0); // curretly created only to store dummy data  screen
  const [eventPriority, setEventPriority] = useState<number>(0); // curretly created only to store dummy data  screen
  const [imageUploadType, setImageUploadType] = useState<EImageUploadType>(EImageUploadType.DEFAULT);

  //image upload related fields
  const [image, setImage] = React.useState<File | null>();
  const [showUploadFileTypeError, setShowUploadFileTypeError] = React.useState<boolean>(false);
  const [showFileNotSelectedError, setShowFileNotSelectedError] = React.useState<boolean>(false);
  const [showFileUploadSuccess, setShowFileUploadSuccess] = React.useState<boolean>(false);
  const [showFileUploadError, setShowFileUploadError] = React.useState<boolean>(false);
  const [imageUploadInProgress, setImageUploadInProgress] = React.useState<boolean>(false);

  const handleImageUpload = async (selectedFile: File) => {
    if (!selectedFile) {
      setShowFileNotSelectedError(true);
      return;
    }
    setImageUploadInProgress(true);
    if ((selectedFile.type === 'image/jpeg' || selectedFile.type === 'image/png')) {
      const formData = new FormData();
      formData.append('file', selectedFile);
      const response = await appManagementApi.uploadFile(formData);
      if (response.message === "success") {
     
        setShowFileUploadSuccess(true);
        dispatch(setEventForm({
          ...eventForm,
          additionalParams: {
            ...eventForm.additionalParams,
            cdnIcon: {
              ...eventForm.additionalParams.cdnIcon,
              value: response.url,
            }
          }
        }));
        setImage(null);
      }
      else {
     
        setShowFileUploadError(true);
      }
    } else {
      setShowUploadFileTypeError(true);
    }
    setImageUploadInProgress(false);
  };

  return (
    <Fragment>
      <FormControl>
        <TextField
          id="field-battle-displayName"
          label="Display name*"
          value={eventForm.additionalParams.displayName.value}
          error={eventForm._isSubmittedOnce && eventForm.additionalParams.displayName.error !== ''}
          // helperText={form.gameId.error}
          disabled={mutateMode === 'View'}
          onChange={(e: React.ChangeEvent<{ value: unknown }>) => {
            dispatch(setEventForm({
              ...eventForm,
              additionalParams: {
                ...eventForm.additionalParams,
                displayName: {
                  ...eventForm.additionalParams.displayName,
                  error: Boolean(e.target.value as string) ? '' : 'mandatory field',
                  value: e.target.value as string
                }
              }
            }));
          }}
        />
        {eventForm.additionalParams.displayName.error &&
          <p className={classes.fieldError}>{eventForm.additionalParams.displayName.error}</p>}
      </FormControl>

      {
        eventCategoryFromUrl === EEventCategory.CHALLENGE_LEADERBOARD &&
        <FormControl>
          <TextField
            id="field-minEntries*"
            label="Forced min player count"
            value={eventForm.additionalParams.minEntries.value}
            error={eventForm.additionalParams.minEntries.value < -1 || eventForm.additionalParams.displayName.error !== ''}
            disabled={mutateMode === 'View'}
            onChange={(e: React.ChangeEvent<{ value: unknown }>) => {
              dispatch(setEventForm({
                ...eventForm,
                additionalParams: {
                  ...eventForm.additionalParams,
                  minEntries: {
                    ...eventForm.additionalParams.minEntries,
                    error: parseInt(e.target.value as string) >= -1 ? '' : 'Not a valid value',
                    value: e.target.value as number
                  }
                }
              }));
            }}
            type="number"
            inputProps={{ min: 0 }}
          />
          {eventForm.additionalParams.minEntries.error &&
            <p className={classes.fieldError}>{eventForm.additionalParams.minEntries.error}</p>}
        </FormControl>
      }

      {
        eventCategoryFromUrl === EEventCategory.CHALLENGE_LEADERBOARD &&
        <FormControl>
          <TextField
            id="field-maxEntries*"
            label="Max entry player count"
            value={eventForm.additionalParams.maxEntries.value}
            error={eventForm.additionalParams.maxEntries.value < -1 || eventForm.additionalParams.maxEntries.error !== ''}
            disabled={mutateMode === 'View'}
            onChange={(e: React.ChangeEvent<{ value: unknown }>) => {
              dispatch(setEventForm({
                ...eventForm,
                additionalParams: {
                  ...eventForm.additionalParams,
                  maxEntries: {
                    ...eventForm.additionalParams.maxEntries,
                    error: parseInt(e.target.value as string) >= -1 ? '' : 'Not a valid value',
                    value: e.target.value as number
                  }
                }
              }));
            }}
            type="number"
            inputProps={{ min: 0 }}
          />
          {eventForm.additionalParams.maxEntries.error &&
            <p className={classes.fieldError}>{eventForm.additionalParams.maxEntries.error}</p>}
        </FormControl>
      }


      {eventForm.additionalParams.mltData &&
        <Fragment>
          <FormControl>
            <TextField
              id="field-battle-maxPlayTime"
              label="Max play time"
              value={eventForm.additionalParams.mltData.maxPlayTime.value}
              error={eventForm._isSubmittedOnce && eventForm.additionalParams.mltData.maxPlayTime.error !== ''}
              helperText={eventForm.additionalParams.mltData.maxPlayTime.error}
              type="number"
              inputProps={{ min: 0 }}
              disabled={mutateMode === 'View'}
              onChange={(e: React.ChangeEvent<{ value: unknown }>) => {
                dispatch(setEventForm(produce(eventForm, draftForm => {
                  const { mltData } = draftForm.additionalParams;
                  if (mltData) {
                    mltData.maxPlayTime.value = e.target.value as number;
                  }
                })));
              }}
            />
          </FormControl>
          <FormControl>
            <TextField
              id="field-battle-mltType"
              label="Type"
              value={eventForm.additionalParams.mltData.type.value}
              error={eventForm._isSubmittedOnce && eventForm.additionalParams.mltData.type.error !== ''}
              helperText={eventForm.additionalParams.mltData.type.error}
              disabled
            />
          </FormControl>
        </Fragment>
      }

      {eventForm.additionalParams.forcedAsyncMinPlayerCount !== null && <FormControl>
        <TextField
          id="field-forcedAsyncMinPlayerCount"
          label="Forced async min player count"
          value={eventForm.additionalParams.forcedAsyncMinPlayerCount.value}
          error={eventForm.additionalParams.forcedAsyncMinPlayerCount.error !== ''}
          helperText={eventForm.additionalParams.forcedAsyncMinPlayerCount.error}
          disabled={mutateMode === 'View'}
          onChange={(e: React.ChangeEvent<{ value: unknown }>) => {
            dispatch(setEventForm(produce(eventForm, draftForm => {
              if (draftForm.additionalParams.forcedAsyncMinPlayerCount) {
                draftForm.additionalParams.forcedAsyncMinPlayerCount.value = e.target.value as number;
                if( selectedApp === APP_ID.TENNIS_CHAMPS && eventCategoryFromUrl === EEventCategory.MULTI_ENTRY_TOURNAMENT){
                  draftForm.additionalParams.forcedAsyncMinPlayerCount.error =
                  parseInt(e.target.value as string) < 1 ? 'minimum can be 1' : '';
                } else {
                  draftForm.additionalParams.forcedAsyncMinPlayerCount.error =
                  parseInt(e.target.value as string) < 3 ? 'minimum can be 3' : '';
                }
              }
            })));
          }}
          type="number"
          inputProps={{
            min:
              (selectedApp === APP_ID.TENNIS_CHAMPS && eventCategoryFromUrl === EEventCategory.MULTI_ENTRY_TOURNAMENT) ? 1 : 3
          }}
        />
      </FormControl>}

      {eventForm.additionalParams.forcedAsyncPlayerCount !== null && <FormControl>
        <TextField
          id="field-forcedAsyncPlayerCount"
          label="Forced async player count"
          value={eventForm.additionalParams.forcedAsyncPlayerCount.value}
          error={eventForm.additionalParams.forcedAsyncPlayerCount.error !== ''}
          helperText={eventForm.additionalParams.forcedAsyncPlayerCount.error}
          disabled={mutateMode === 'View'}
          onChange={(e: React.ChangeEvent<{ value: unknown }>) => {
            dispatch(setEventForm(produce(eventForm, draftForm => {
              if (draftForm.additionalParams.forcedAsyncPlayerCount) {
                draftForm.additionalParams.forcedAsyncPlayerCount.value = e.target.value as number;
                if( selectedApp === APP_ID.TENNIS_CHAMPS && eventCategoryFromUrl === EEventCategory.MULTI_ENTRY_TOURNAMENT){
                  draftForm.additionalParams.forcedAsyncPlayerCount.error =
                  parseInt(e.target.value as string) < 1 ? 'minimum can be 1' : '';
                } else {
                  draftForm.additionalParams.forcedAsyncPlayerCount.error =
                  parseInt(e.target.value as string) < 3 ? 'minimum can be 3' : '';
                }
              }
            })));
          }}
          type="number"
          inputProps={{
            min:
              (selectedApp === APP_ID.TENNIS_CHAMPS && eventCategoryFromUrl === EEventCategory.MULTI_ENTRY_TOURNAMENT) ? 1 : 3
          }}
        />
      </FormControl>}

      {eventCategoryFromUrl === EEventCategory.MULTI_ENTRY_TOURNAMENT && <React.Fragment>
        <FormControl component="fieldset">
          <FormLabel component="legend">Win score logic</FormLabel>
          <RadioGroup
            style={{ display: 'inline-block', marginBottom: 0 }}
            aria-label="Win score logic" name="win-score-logic"
            value={eventForm.additionalParams.winScoreLogic.value}
            // helperText={form.engineData.engineType.error}
            onChange={(e: React.ChangeEvent<{ value: unknown }>) => {
              dispatch(setEventForm(produce(eventForm, draftForm => {
                draftForm.additionalParams.winScoreLogic.value = e.target.value as EWinScoreLogic;
              })));
            }}
          >
            {Object.keys(EWinScoreLogic).filter(wsl => wsl !== EWinScoreLogic.NA).map(wsLogic =>
              <FormControlLabel style={{ display: 'inline-block', marginBottom: 0 }}
                key={wsLogic} label={wsLogic} value={wsLogic}
                control={<Radio disabled={mutateMode === 'View'} />}
              />
            )}
          </RadioGroup>
        </FormControl>

        <FormControl>
          <TextField
            id="field-resultDelayDuration"
            label="Result delay duration"
            value={eventForm.additionalParams.resultDelayDuration.value}
            error={eventForm.additionalParams.resultDelayDuration.error !== ''}
            helperText={eventForm.additionalParams.resultDelayDuration.error}
            disabled={mutateMode === 'View'}
            onChange={(e: React.ChangeEvent<{ value: unknown }>) => {
              dispatch(setEventForm(produce(eventForm, draftForm => {
                draftForm.additionalParams.resultDelayDuration.value = e.target.value as number;
              })));
            }}
            type="number"
            inputProps={{ min: 3 }}
          />
        </FormControl>
      </React.Fragment>}

      {
        eventCategoryFromUrl === EEventCategory.CHALLENGE_LEADERBOARD &&
        <React.Fragment>
          <FormControl component="fieldset">
            <FormLabel component="legend">Event Icon</FormLabel>
            <RadioGroup
              style={{ display: 'inline-block', marginBottom: 0 }}
              aria-label="Win score logic" name="win-score-logic"
              value={imageUploadType}
              onChange={(e: React.ChangeEvent<{ value: unknown }>) => {
                let value = e.target.value as EImageUploadType;
                setImageUploadType(value);
              }}
            >
              {Object.entries(EImageUploadType).map(ut =>
                <FormControlLabel style={{ display: 'inline-block', marginBottom: 0 }}
                  key={ut[0]} label={ut[1]} value={ut[1]}
                  control={<Radio disabled={mutateMode === 'View'} />}
                />
              )}
            </RadioGroup>
          </FormControl>

          {
            eventForm.additionalParams.cdnIcon.value && eventForm.additionalParams.cdnIcon.value !== '' &&
            <FormControl component="fieldset">
              <div className='image-and-url-div'>
                <img src={eventForm.additionalParams.cdnIcon.value} alt="cd image" width="50" height="50"></img>
                <a href={eventForm.additionalParams.cdnIcon.value} target="_blank" rel="noopener noreferrer">
                  {eventForm.additionalParams.cdnIcon.value}
                </a>

              </div>
            </FormControl>
          }

          {
            imageUploadInProgress &&
            <FormControl component="fieldset">
              <div className='image-and-url-div'>
                <div className="uploadProgressDiv"><CircularProgress /></div>
                <div className="uploadProgressDiv">File Upload in progress</div>
              </div>
            </FormControl>
          }

          {
            imageUploadType === EImageUploadType.URL &&
            <FormControl>
              <TextField
                id="field-resultDelayDuration"
                label="Image Url"
                value={eventForm.additionalParams.cdnIcon.value}
                error={eventForm.additionalParams.cdnIcon.error !== ''}
                helperText={eventForm.additionalParams.cdnIcon.error}
                disabled={mutateMode === 'View'}
                onChange={(e: React.ChangeEvent<{ value: unknown }>) => {
                  dispatch(setEventForm(produce(eventForm, draftForm => {
                    draftForm.additionalParams.cdnIcon.value = e.target.value as string;
                  })));
                }}
                //type="number"
                inputProps={{ min: 3 }}
              />
            </FormControl>
          }

          {
            imageUploadType === EImageUploadType.DEFAULT &&
            <FormControl>
              <InputLabel>
                Default Icon Images
              </InputLabel>
              <Select
                value={eventForm.additionalParams.cdnIcon.value}
                error={false}
                disabled={mutateMode === 'View'}
                onChange={(event: React.ChangeEvent<{ value: unknown }>) => {
                  dispatch(setEventForm(produce(eventForm, draftForm => {
                    draftForm.additionalParams.cdnIcon.value = event.target.value as string;
                  })));
                }}
              >
                {Object.entries(EDefaultIconsImages).map(groupType =>
                  <MenuItem value={groupType[1]} key={groupType[0]}>{groupType[0]}</MenuItem>)}
              </Select>
            </FormControl>
          }

          {
            imageUploadType === EImageUploadType.CDN &&
            <FormControl component="fieldset">
              <input type="file"
                onChange={e => e.target.files && setImage(e.target.files[0])}
                accept={acceptedTypes.toString()}
              />
              <button className="upload-button" type="button" onClick={() => handleImageUpload(image as File)}>
                Upload
              </button>
            </FormControl>
          }

        </React.Fragment>
      }

      {
        eventCategoryFromUrl === EEventCategory.CHALLENGE_LEADERBOARD &&
        <FormControl>
          <InputLabel>
            Entry type
          </InputLabel>
          <Select
            value={eventForm.additionalParams.entryType.value}
            error={false}
            disabled={Boolean(mutateMode === 'View')}
            onChange={(e: React.ChangeEvent<{ value: unknown }>) => {
              dispatch(setEventForm(produce(eventForm, draftForm => {
                if (draftForm.additionalParams.entryType) {
                  draftForm.additionalParams.entryType.value = e.target.value as EEntryType;
                  if (e.target.value === EEntryType.FREE || e.target.value === EEntryType.PASSIVE) {
                    draftForm.additionalParams.entryFeeList = [];
                  }
                }
              })));
            }}
          >
            {Object.values(EEntryType)
              .filter(et => (et === EEntryType.CASH || et === EEntryType.FREE || et === EEntryType.PASSIVE))
              .map(entryType =>
                <MenuItem value={entryType} key={entryType}>{entryType}</MenuItem>)}
          </Select>
        </FormControl>
      }

      <EntryFields mutateMode={mutateMode} />

      {
        eventCategoryFromUrl !== EEventCategory.CHALLENGE_LEADERBOARD &&
        <RewardFields mutateMode={mutateMode} />
      }

      {
        eventCategoryFromUrl === EEventCategory.CHALLENGE_LEADERBOARD &&
        <RewardList mutateMode={mutateMode} />
      }

      <FormControl>
        <TextField
          id="field-battle-tier"
          label="Tier"
          value={eventForm.additionalParams.tier.value}
          error={eventForm.additionalParams.tier.error !== ''}
          // helperText={form.gameId.error}
          disabled={mutateMode === 'View'}
          onChange={(e: React.ChangeEvent<{ value: unknown }>) => {
            dispatch(setEventForm({
              ...eventForm,
              additionalParams: {
                ...eventForm.additionalParams,
                tier: {
                  ...eventForm.additionalParams.tier,
                  value: e.target.value as number
                }
              }
            }));
          }}
          type="number"
          inputProps={{ min: 0 }}
        />
      </FormControl>

      {
        eventCategoryFromUrl !== EEventCategory.CHALLENGE_LEADERBOARD &&
        <FormControl>
          <TextField
            id="field-matchMakingTime"
            label="Match-making time"
            value={eventForm.additionalParams.matchMakingTime.value}
            error={eventForm.additionalParams.matchMakingTime.error !== ''}
            // helperText={form.gameId.error}
            disabled={mutateMode === 'View'}
            onChange={(e: React.ChangeEvent<{ value: unknown }>) => {
              dispatch(setEventForm({
                ...eventForm,
                additionalParams: {
                  ...eventForm.additionalParams,
                  matchMakingTime: {
                    ...eventForm.additionalParams.matchMakingTime,
                    value: parseInt(e.target.value as string)
                  }
                }
              }));
            }}
            type="number"
            inputProps={{ min: 0 }}
          />
        </FormControl>
      }

      {
        eventCategoryFromUrl !== EEventCategory.CHALLENGE_LEADERBOARD &&
        <FormControlLabel
          style={{ margin: 0 }}
          labelPlacement="start"
          control={
            <Checkbox
              inputProps={{ 'aria-label': 'isAsyncEnabled' }}
              checked={eventForm.additionalParams.isAsyncEnabled.value}
              disabled={mutateMode === 'View' || [
                EEventCategory.TOURNAMENT,
                EEventCategory.MULTI_ENTRY_TOURNAMENT,
                EEventCategory.ELIMINATION
              ].includes(eventCategoryFromUrl as EEventCategory)}
              onChange={(e: React.ChangeEvent<{ checked: boolean }>) => {
                dispatch(setEventForm({
                  ...eventForm,
                  additionalParams: {
                    ...eventForm.additionalParams,
                    isAsyncEnabled: {
                      ...eventForm.additionalParams.isAsyncEnabled,
                      value: e.target.checked
                    }
                  }
                }));
              }}
              name="isAsyncEnabled"
              color="primary"
            />
          }
          label="Async enabled"
        />
      }


      <FormControlLabel
        style={{ margin: 0 }}
        labelPlacement="start"
        control={
          <Checkbox
            inputProps={{ 'aria-label': 'hideEndTime' }}
            checked={eventForm.additionalParams.hideEndTime.value}
            disabled={mutateMode === 'View'}
            onChange={(e: React.ChangeEvent<{ checked: boolean }>) => {
              dispatch(setEventForm({
                ...eventForm,
                additionalParams: {
                  ...eventForm.additionalParams,
                  hideEndTime: {
                    ...eventForm.additionalParams.hideEndTime,
                    value: e.target.checked
                  }
                }
              }));
            }}
            name="isAsyncEnabled"
            color="primary"
          />
        }
        label="Hide end time"
      />

      {
        eventCategoryFromUrl !== EEventCategory.CHALLENGE_LEADERBOARD &&
        <FormControlLabel
          style={{ margin: 0 }}
          labelPlacement="start"
          control={
            <Checkbox
              inputProps={{ 'aria-label': 'showOnCollapse' }}
              checked={eventForm.additionalParams.showOnCollapse.value}
              disabled={mutateMode === 'View'}
              onChange={(e: React.ChangeEvent<{ checked: boolean }>) => {
                dispatch(setEventForm({
                  ...eventForm,
                  additionalParams: {
                    ...eventForm.additionalParams,
                    showOnCollapse: {
                      ...eventForm.additionalParams.showOnCollapse,
                      value: e.target.checked
                    }
                  }
                }));
              }}
              name="isAsyncEnabled"
              color="primary"
            />
          }
          label="Show on collapse"
        />
      }

      {
        eventCategoryFromUrl !== EEventCategory.CHALLENGE_LEADERBOARD &&
        <FormControlLabel
          style={{ margin: '0 0 2rem 0' }}
          labelPlacement="start"
          control={
            <Checkbox
              inputProps={{ 'aria-label': 'asyncBotMatchEnabled' }}
              checked={eventForm.additionalParams.asyncBotMatchEnabled.value}
              disabled={mutateMode === 'View' || [
                EEventCategory.TOURNAMENT,
                EEventCategory.MULTI_ENTRY_TOURNAMENT,
                EEventCategory.ELIMINATION
              ].includes(eventCategoryFromUrl as EEventCategory)}
              onChange={(e: React.ChangeEvent<{ checked: boolean }>) => {
                dispatch(setEventForm({
                  ...eventForm,
                  additionalParams: {
                    ...eventForm.additionalParams,
                    asyncBotMatchEnabled: {
                      ...eventForm.additionalParams.asyncBotMatchEnabled,
                      value: e.target.checked
                    }
                  }
                }));
              }}
              name="asyncBotMatchEnabled"
              color="primary"
            />
          }
          label="Async bot match enabled"
        />
      }

      {eventForm.additionalParams.placementDataList.map((pData, pdlIndex) =>
        <div className="indent" key={pdlIndex}>

          {
            eventCategoryFromUrl !== EEventCategory.CHALLENGE_LEADERBOARD &&
            <>
              <FormControl style={{ display: 'inline-block', marginBottom: 0 }}>
                <InputLabel htmlFor={`field-placementLocation-${pdlIndex}`}>Placement location</InputLabel>
                <Select native
                  input={<Input name="placementLocation-f"
                    id={`field-placementLocation-${pdlIndex}`} />}
                  value={pData.placementLocation.value}
                  error={pData.placementLocation.error !== '' ||
                    !Object.keys(placementHumanReadable[placementKey]).includes(pData.placementLocation.value)}
                  style={{ marginBottom: 0 }}
                  disabled={mutateMode === 'View'}
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
                  {selectedApp && Object.keys(placementHumanReadable[placementKey]).map(locationKey =>
                    <option value={locationKey} key={locationKey}>
                      {placementHumanReadable[placementKey][locationKey]}
                      {/* {` (${locationKey})`} */}
                    </option>
                  )}
                </Select>
              </FormControl>

              <FormControl style={{ display: 'inline-block', marginBottom: 0 }}>
                <TextField
                  id={`field-placementPriority-${pdlIndex}`}
                  label="placementPriority*"
                  value={pData.placementPriority.value}
                  error={pData.placementPriority.error !== ''}
                  // helperText={form.gameId.error}
                  style={{ marginBottom: 0 }}
                  disabled={mutateMode === 'View'}
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
            </>
          }

          {
            eventCategoryFromUrl === EEventCategory.CHALLENGE_LEADERBOARD &&
            <>
              <FormControl style={{ display: 'inline-block', marginBottom: 0 }}>
                <TextField
                  id={`field-groupPriority-${pdlIndex}`}
                  label="Group Priority"
                  value={groupPriority}
                  error={groupPriority < 0}
                  // helperText={form.gameId.error}
                  style={{ marginBottom: 0 }}
                  disabled={mutateMode === 'View'}
                  onChange={(e: React.ChangeEvent<{ value: unknown }>) => {
                    setGroupPriority(e.target.value as number);
                  }}
                  type="number"
                  inputProps={{ min: 1 }}
                />
              </FormControl>

              <FormControl style={{ display: 'inline-block', marginBottom: 0 }}>
                <TextField
                  id={`field-eventPriority-${pdlIndex}`}
                  label="Event Priority"
                  value={eventPriority}
                  error={eventPriority < 0}
                  // helperText={form.gameId.error}
                  style={{ marginBottom: 0 }}
                  disabled={mutateMode === 'View'}
                  onChange={(e: React.ChangeEvent<{ value: unknown }>) => {
                    setEventPriority(e.target.value as number);
                  }}
                  type="number"
                  inputProps={{ min: 1 }}
                />
              </FormControl>
            </>
          }

          {
            eventCategoryFromUrl !== EEventCategory.CHALLENGE_LEADERBOARD &&
            <FormControl style={{ marginBottom: 0, marginTop: 2 }}>
              <TextField
                id="field-prerequisiteJsonLogic"
                label="Prerequisite*"
                value={pData.prerequisiteJsonLogic.value}
                error={pData.prerequisiteJsonLogic.error !== ''}
                multiline
                required
                rows={10}
                rowsMax={10}
                inputProps={{ style: { background: 'rgba(0,0,0,0.05)', fontFamily: 'monospace', fontSize: 13 } }}
                style={{ marginBottom: 0 }}
                disabled={mutateMode === 'View'}
                onChange={(e: React.ChangeEvent<{ value: unknown }>) => {
                  const newPdList = [...eventForm.additionalParams.placementDataList];
                  const newPd = {
                    ...eventForm.additionalParams.placementDataList[pdlIndex],
                    prerequisiteJsonLogic: {
                      ...eventForm.additionalParams.placementDataList[pdlIndex].prerequisiteJsonLogic,
                      value: e.target.value as string
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
              />
            </FormControl>
          }

          {
            eventCategoryFromUrl !== EEventCategory.CHALLENGE_LEADERBOARD &&
            <FormControlLabel
              style={{ display: 'inline-block', marginBottom: 0 }}
              label="Show On Collapse"
              control={
                <Checkbox
                  id="field-showOnCollapse"
                  name="field-showOnCollapse"
                  //inputProps={{ 'aria-label': 'enableTicketExpiry' }}
                  checked={pData.showOnCollapse.value}
                  disabled={mutateMode === 'View'}
                  onChange={(event: React.ChangeEvent<{ value: unknown, checked: boolean }>) => {
                    const { checked } = event.target;
                    const newPdList = [...eventForm.additionalParams.placementDataList];
                    const newPd = {
                      ...eventForm.additionalParams.placementDataList[pdlIndex],
                      showOnCollapse: {
                        ...eventForm.additionalParams.placementDataList[pdlIndex].showOnCollapse,
                        value: checked
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
                />
              }
            />
          }


          {
            mutateMode !== 'View' &&
            <IconButton
              aria-label="delete placement data"
              //disabled={mutateMode === 'View'}
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
            >
              <DeleteIcon />
            </IconButton>
          }

        </div>
      )}

      {
        mutateMode !== 'View' &&
        <Button
          variant="outlined"
          color="primary"
          style={{ marginBottom: '2rem' }}
          //disabled={mutateMode === 'View'}
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
      }

      <Snackbar
        open={showUploadFileTypeError}
        autoHideDuration={3000}
        onClose={() => setShowUploadFileTypeError(false)}
      >
        <Alert onClose={() => setShowUploadFileTypeError(false)} severity="error">
          Sorry, only .jpeg and .png files can be uploaded!
        </Alert>
      </Snackbar>

      <Snackbar
        open={showFileNotSelectedError}
        autoHideDuration={3000}
        onClose={() => setShowFileNotSelectedError(false)}
      >
        <Alert onClose={() => setShowFileNotSelectedError(false)} severity="error">
          Please select a file to upload!
        </Alert>
      </Snackbar>

      <Snackbar
        open={showFileUploadError}
        autoHideDuration={3000}
        onClose={() => setShowFileUploadError(false)}
      >
        <Alert onClose={() => setShowFileUploadError(false)} severity="error">
          Could not upload the image. Please try again!
        </Alert>
      </Snackbar>

      <Snackbar
        open={showFileUploadSuccess}
        autoHideDuration={3000}
        onClose={() => setShowFileUploadSuccess(false)}
      >
        <Alert onClose={() => setShowFileUploadSuccess(false)} severity="success">
          Image uploaded successfully!
        </Alert>
      </Snackbar>
    </Fragment>
  );
}

export default BattleFields;

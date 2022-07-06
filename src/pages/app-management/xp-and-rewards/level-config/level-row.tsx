/* eslint-disable react-hooks/exhaustive-deps */
import {
  FormControl,
  IconButton, TableCell,
  TableRow as MuiTableRow,
  TextField
} from '@material-ui/core';
import { AddCircle } from '@material-ui/icons';
import produce from 'immer';
import jsonLogic from 'json-logic-js';
import React, { useMemo } from 'react';
import styled from 'styled-components';
import { CONSTANTS } from '../../../../common/constants';
import { useAppDispatch, useAppSelector, useDefaultRealCurrency, useUrlQuery } from '../../../../common/hooks';
import { findVarFromJsonLogic } from '../../../../common/utils';
import globalStyles from '../../../../theme/globalStyles';
import { ECost, ECurrency } from '../../../../types/eventTypes';
import { eventApiDispatchers, getEventsSuccess } from '../../../events/eventSlice';
import { appManagementDispatchers, getLevelRewardsSuccess } from '../../appManagementSlice';
import { ERewardType, TLevelReward } from '../../appManagementTypes';
import { DIALOG_POPUP_TEXT, ERewardTypesForDropDown } from '../../constants';
import LevelRewardWrapper from './level-reward-wrapper';

type TLevelRowProps = {
  levelNumber: string;
  currentLevelRewards: number[];
  collatedLevels: { [key: string]: number[] };
  setCollatedLevels: Function;
  appIosVersion: string;
  appAndroidVersion: string;
};

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const TableRow = React.memo(styled(MuiTableRow)`
  vertical-align: top;
`);

function LevelRow({
  levelNumber,
  currentLevelRewards,
  collatedLevels,
  setCollatedLevels,
  appIosVersion,
  appAndroidVersion
}: TLevelRowProps) {
  const dispatch = useAppDispatch();
  const globalClasses = globalStyles();
  const searchParams = useUrlQuery();
  const debugMode = useMemo(() => searchParams.get('debug'), []);
  const { selectedApp, isSelectedAppCrypto } = useAppSelector(state => state.gameConfigForm);
  const { levelRewards, getAppDetails } = useAppSelector(state => state.appManagementSlice);
  const { rewards } = levelRewards;
  const { events } = useAppSelector(state => state.eventSlice);
  const { eventsList } = events;
  const [eligibleEvents, setEligibleEvents] = React.useState<number[]>([]);
  const [selectedEventIds, setSelectedEventIds] = React.useState<number[]>([]);
  const [updatingEvent, setUpdatingEvent] = React.useState(false);

  const [showWarningDialog, setWarningDialog] = React.useState<boolean>(false);
  const [showErrorDialog, setErrorDialog] = React.useState<boolean>(false);
  const [showDeleteDialog, setDeleteDialog] = React.useState<boolean>(false);
  const [dialogText, setDialogText] = React.useState<string | null>('');
  // const maxRewardsAllowedPerLevel = isSelectedAppCrypto ? 3 : 4;
  const maxRewardsAllowedPerLevel = 4;
  const defaultRealCurrency = useDefaultRealCurrency();

  const defaultRewards: TLevelReward = {
    id: 0,
    appId: selectedApp,
    level: 0,
    rewardType: ERewardType.VIRTUAL_CURRENCY,
    virtualAmount: 0,
    depositAmount: 0,
    bonusAmount: 0,
    multiplierAmount: 0,
    currencyCode: isSelectedAppCrypto ? defaultRealCurrency : ECurrency.USD,
    currencyType: getAppDetails.app?.currencies[0] as ECost || ECost.COIN, // assuming 1st array item is v-currency and 2nd is TICKET
    title: 'string',
    subTitle: '',
    image: '',
    duration: 0,
    _isNew: true,
  };

  React.useEffect(() => {
    // handle selected events dropdown
    const newSelection: number[] = [];
    setEligibleEvents(eventsList.filter(ev => {
      const unlockInfo = ev._parseUnlockLogic;
      if (unlockInfo && unlockInfo.found) {
        switch (unlockInfo.varInfo.operator) {
          case '<=':
          case '==':
            if (unlockInfo.varInfo.value === parseInt(levelNumber)) {
              newSelection.push(ev.id);
            }
            break;
          case '-NA-':
            break;
        }
      }
      let versionCondition = false;
      if (ev.jsonLogicFilters) {
        try {
          versionCondition = jsonLogic.apply(JSON.parse(ev.jsonLogicFilters), {
            appIosVersion: appIosVersion,
            appAndroidVersion: appAndroidVersion,
            trueSkills: 0,
            userRole: 'REGULAR',  // set to PREVIEW to filter test events; REGULAR are prod events
          });
        } catch {
          versionCondition = false;
        }
      }
      // console.info(`version-${ev.id}:`, versionCondition);
      return !ev.forceInvisible
        && parseInt(ev.repetitions[0].repetitionKeyValueMap.End + '') >= parseInt((Date.now() / 1000) + '')
        && (
          newSelection.includes(ev.id) ||
          !unlockInfo?.found
        )
        && ((!appIosVersion && !appAndroidVersion) || versionCondition)
    }).map(ev => ev.id));
    setSelectedEventIds(newSelection);
  }, [eventsList, appIosVersion, appAndroidVersion]);

  const addNewLevelReward = (level: string) => {
    const tempId = -Date.now();  // temporary ID
    const newReward: TLevelReward = {
      ...defaultRewards,
      _isNew: true,
      id: tempId,
      level: parseInt(level) - 1,
      currencyType: ERewardTypesForDropDown.COIN,
      virtualAmount: 1,
    };

    dispatch(getLevelRewardsSuccess(produce(rewards, draftRewards => {
      draftRewards.push(newReward);
    })));
    setCollatedLevels({
      ...collatedLevels,
      [levelNumber]: [ ...collatedLevels[levelNumber], levelRewards.rewards.length ]
    });
  };

  const unlockValueMacro = '_^_UNLOCK_LEVEL_^_';
  const unlockTmpl =
    `{
  "<=": [
    ${unlockValueMacro},
    {
      "var": [
        "minXpLevel"
      ]
    }
  ]
}`;

  const clearUnlockLogicForEvents = (evId: number, selEventIds: number[]) => {
    const theEvent = events.eventsList.find(ev => ev.id === evId);
    if (theEvent) {
      setUpdatingEvent(true);
      dispatch(eventApiDispatchers.updateEvent(
        {
          ...theEvent,
          unlockLogic: '' // clear unlock logic
        },
        selectedApp,
        theEvent.id,
        {
          success: () => {
            setUpdatingEvent(false);
            // update dropdown selection
            // const newSelection = selectedEventIds.splice(selectedEventIds.indexOf(theEvent.id), 1);
            // setSelectedEventIds(newSelection);
            // update unlockLogic for the event
            dispatch(getEventsSuccess(produce(events.eventsList, draftList => {
              const event = draftList.find(ev => ev.id === theEvent.id);
              if (event) {
                event.unlockLogic = '';
                event._parseUnlockLogic = findVarFromJsonLogic(
                  JSON.parse(event.unlockLogic || '{}'), CONSTANTS.JSON_LOGIC_KEYS.minXpLevel
                );
              }
            })));
            let noOtherUnlockingEvent = true;
            events.eventsList.forEach((ev, evIndex) => {
              // const parsed = findVarFromJsonLogic(JSON.parse(ev.unlockLogic || '{}'), CONSTANTS.JSON_LOGIC_KEYS.minXpLevel);
              if (ev._parseUnlockLogic?.found) {
                noOtherUnlockingEvent = false;
              }
            });
            if (!noOtherUnlockingEvent) {
              levelRewards.rewards.forEach(lReward => {
                if (lReward.level === parseInt(levelNumber) - 1 &&
                  lReward.rewardType === ERewardType.EVENT_UNLOCK &&
                  !selEventIds.length) {
                  dispatch(appManagementDispatchers.deleteLevelReward(
                    selectedApp,
                    lReward.id,
                    {
                      success: () => {
                        const newLR = [ ...collatedLevels[levelNumber]];
                        const deletedRewardIndex = rewards.findIndex(r => r.id === lReward.id);
                        newLR.splice(deletedRewardIndex, 1);
                        setCollatedLevels({
                          ...collatedLevels,
                          [levelNumber]: newLR
                        });
                        dispatch(getLevelRewardsSuccess(produce(rewards, draftRewards => {
                          console.info(`level-${levelNumber}:`, draftRewards[deletedRewardIndex]);
                          draftRewards.splice(deletedRewardIndex, 1);
                        })));
                      },
                      error: (e: any) => {
                        console.error('clearUnlockLogicForEvents deleteLevelReward error\n', e);
                      },
                    },
                  ));
                }
              });
            }
          },
          error: (e: any) => {
            setUpdatingEvent(false);
            console.error('clearUnlockLogicForEvents updateEvent error\n', e);
          }
        }
      ));
    } else {
      console.warn('handleSelectedEventChange not available');
    }
  };

  const setUnlockLogicForEvents = (number: number) => {
    const theEvent = events.eventsList.find(ev => ev.id === number);
    if (theEvent) {
      const removeWhiteSpace = (str: string) => JSON.stringify(JSON.parse(str));
      const newStr = unlockTmpl.replace(unlockValueMacro, levelNumber);
      if (removeWhiteSpace(newStr) !== removeWhiteSpace(theEvent.unlockLogic || '{}')) {
        setUpdatingEvent(true);
        dispatch(eventApiDispatchers.updateEvent(
          {
            ...theEvent,
            unlockLogic: newStr
          },
          selectedApp,
          theEvent.id,
          {
            success: () => {
              setUpdatingEvent(false);
              dispatch(getEventsSuccess(produce(events.eventsList, draftList => {
                const event = draftList.find(ev => ev.id === theEvent.id);
                if (event) {
                  event.unlockLogic = newStr;
                  event._parseUnlockLogic = findVarFromJsonLogic(
                    JSON.parse(event.unlockLogic || '{}'), CONSTANTS.JSON_LOGIC_KEYS.minXpLevel
                  );
                }
              })));
              let noLevelUnlockExists = true;
              currentLevelRewards.forEach(level => {
                if (levelRewards.rewards.find(reward => reward.rewardType === ERewardType.EVENT_UNLOCK && reward.level === parseInt(levelNumber) - 1)) {
                  noLevelUnlockExists = false;
                }
              });
              if (noLevelUnlockExists) {
                const newReward: TLevelReward = {
                  ...defaultRewards,
                  rewardType: ERewardType.EVENT_UNLOCK,
                  level: parseInt(levelNumber) - 1,
                  // todo find all events unlocking and set title/subtitle depending on event type
                  image: 'https://assets.onclixlogix-samplecode.com/solitaire/contestUnlockReward.png',
                  title: 'New Contests Unlocked',
                  subTitle: '',
                };
                dispatch(appManagementDispatchers.createLevelReward(
                  selectedApp,
                  newReward,
                  {
                    success: (reward: TLevelReward) => {
                      dispatch(getLevelRewardsSuccess(produce(rewards, draftRewards => {
                        console.info(`level-${levelNumber}:`, draftRewards);
                        draftRewards.push(newReward);
                      })));
                      setCollatedLevels({
                        ...collatedLevels,
                        [levelNumber]: [ ...collatedLevels[levelNumber], rewards.length ]
                      });
                      console.info('setUnlockLogicForEvents', {
                        ...collatedLevels,
                        [levelNumber]: [ ...collatedLevels[levelNumber], rewards.length ]
                      })
                      // setCollatedLevels(produce(currentLevelRewards, draftLevels => {
                      //   draftLevels.push(reward.id);
                      // }));
                      // dispatch(getLevelRewardsSuccess(produce(rewards, draftRewards => {
                      //   draftRewards.push(reward);
                      // })));
                    },
                    error: (e: any) => {
                      console.error('setUnlockLogicForEvents createLevelReward');
                    },
                  }
                ));
              }
            },
            error: () => {
              setUpdatingEvent(false);
            }
          }
        ));
      }
    } else {
      console.warn('handleSelectedEventChange not available');
    }
  };

  const handleSelectedEventChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    const selectedIdsInDropdown = event.target.value as number[];
    selectedEventIds.filter(evId => !selectedIdsInDropdown.includes(evId))
      .forEach(evId => clearUnlockLogicForEvents(evId, selectedIdsInDropdown));
    selectedIdsInDropdown.forEach(setUnlockLogicForEvents);
    setSelectedEventIds(selectedIdsInDropdown);
  };

  const deleteRewards = () => {
    dispatch(appManagementDispatchers.deleteAllLevelRewardsForALevel(
      selectedApp,
      levelNumber
      // {
      //   success: () => {
      //     dispatch(getLevelRewardsSuccess(produce(levelRewards.rewards, draftRewards => {
      //       const index = draftRewards.map(reward => reward.id).indexOf(levelReward.id);
      //       if (index >= 0) {
      //         setCollatedLevels({});  // todo this causes expensive rerender
      //         draftRewards.splice(index, 1);
      //       }
      //     })));
      //   }
      // }
    ))
    .then(() => {
      if (selectedApp) {
        dispatch(appManagementDispatchers.getLevelRewards(selectedApp));
      }
    });
  };

  const handleDialogOkCta = () => {
    if (dialogText === DIALOG_POPUP_TEXT.DELETE_A_LEVEL) {
      deleteRewards();
    }
    setDialogText(null);
  }

  return (
    <React.Fragment>
      <TableRow hover>
        <TableCell width={105}>Level {levelNumber}</TableCell>
        <TableCell>
          <div>
            {Array.isArray(currentLevelRewards) && currentLevelRewards.map(rewardIndex =>
              rewards[rewardIndex] && [ERewardType.REAL_CURRENCY, ERewardType.VIRTUAL_CURRENCY].includes(rewards[rewardIndex].rewardType) ?
                <LevelRewardWrapper
                  key={`reward-group-${levelNumber}-${rewardIndex}`}
                  index={rewardIndex}
                  levelNumber={levelNumber}
                  levelReward={rewards[rewardIndex]}
                  collatedLevels={collatedLevels}
                  setCollatedLevels={setCollatedLevels}
                  currentLevelRewards={currentLevelRewards}
                />
              :
                rewards[rewardIndex] &&
                <div className={globalClasses.indent}
                  key={`reward-group-not-found-${levelNumber}-${rewardIndex}`}
                  style={{ marginRight: 5, display: 'inline-block' }}
                >
                  {debugMode === '1' && `ID: ${rewards[rewardIndex].id}`}
                  <img
                    style={{ height: 48 }}
                    src={rewards[rewardIndex].image || 'https://via.placeholder.com/150?text=NA'}
                    alt="reward"
                  />
                  <FormControl>
                    <TextField
                      label="Reward type"
                      value={rewards[rewardIndex].rewardType}
                      disabled
                    />
                  </FormControl>
                  <FormControl>
                    <TextField
                      label="Title"
                      value={rewards[rewardIndex].title}
                      disabled
                    />
                  </FormControl>
                </div>
            )}

            {Array.isArray(currentLevelRewards) && currentLevelRewards.length < maxRewardsAllowedPerLevel &&
              <IconButton onClick={() => addNewLevelReward(levelNumber)}>
                <AddCircle style={{ color: 'green' }} />
              </IconButton>
            }
          </div>
        </TableCell>
        {/* todo disabled temporarily */}
        {/* <TableCell>
          <FormControl style={{ width: 180 }}>
            <InputLabel id="selected-events-label">Unlocked Events</InputLabel>
            <Select
              // labelId="selected-events-label"
              id="selected-events-checkbox"
              multiple
              value={selectedEventIds}
              onChange={handleSelectedEventChange}
              input={<Input />}
              renderValue={(selected) => `${eligibleEvents.filter(id => selectedEventIds.includes(id)).length} event(s) unlocked` || '0 event unlock'}
              MenuProps={MenuProps}
              disabled={updatingEvent || !eligibleEvents.length}
            >
              {eligibleEvents.map((id) => (
                <MenuItem key={id} value={id}>
                  <Checkbox checked={selectedEventIds.includes(id)} />
                  <ListItemText primary={id + ': ' + (events.eventsList.find(ev => ev.id === id)?.additionalParams.displayName || id)} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <HandyDialog
            open={showDeleteDialog}
            title="Delete Confirmation"
            content={
              <Typography>{dialogText} </Typography>
            }
            onClose={() => setDeleteDialog(false)}
            onOkClick={() => {
              setDeleteDialog(false);
              handleDialogOkCta();
            }}
            onCancelClick={() => setDeleteDialog(false)}
          />

          <HandyDialog
            open={showWarningDialog}
            title="Warning"
            content={
              <Typography>{dialogText} </Typography>
            }
            onClose={() => setWarningDialog(false)}
            onOkClick={() => {
              setWarningDialog(false);
              handleDialogOkCta();
            }}
            onCancelClick={() => setWarningDialog(false)}
          />

          <HandyDialog
            open={showErrorDialog}
            title="Error"
            content={
              <Typography>{dialogText} </Typography>
            }
            onClose={() => setErrorDialog(false)}
            onOkClick={() => {
              setErrorDialog(false);
              handleDialogOkCta();
            }}
            onCancelClick={() => setErrorDialog(false)}
          />
        </TableCell> */}

      </TableRow>
    </React.Fragment>
  );
}

export default LevelRow;

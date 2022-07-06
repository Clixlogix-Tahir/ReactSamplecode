import {
  Checkbox,
  FormControl,
  FormControlLabel,
  FormLabel,
  IconButton,
  Input,
  InputLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  TextField,
  Typography
} from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import React, { useState } from 'react';
import { Trash } from 'react-feather';
import { useAppSelector } from '../../../common/hooks';
import WithAddDelete from '../../../components/with-add-delete';
import globalStyles from '../../../theme/globalStyles';
import { placementHumanReadable } from '../../../types/eventTypes';
import {
  EChallengeCashFlag,
  EChallengeGiftBox,
  EChallengeTask,
  EChallengeTournamentType,
  EChallengeType,
  TChallengeDetailsFields
} from '../challenges-types';
import ChallengeRewardList from './challenge-reward-list';

type TChallengeDetailOptions = {
  disabled?: boolean;
  onChange: (
    event: React.ChangeEvent<{ value: unknown }>,
    cIndex: number,
    cLevelOptions?: {
      cLevelIndex: number,
      cLevelRewardIndex: number,
    },
    nullableOptions?: boolean,
  ) => void;
};

type TChallengeDetailOptionsBoolean = {
  disabled?: boolean;
  onChange: (
    event: React.ChangeEvent<{ value: unknown, checked: boolean }>,
    cIndex: number,
    cLevelOptions?: {
      cLevelIndex: number,
      cLevelRewardIndex: number,
    }
  ) => void;
};

type TChallengeDetailsProps = {
  challenges: TChallengeDetailsFields[];
  options: {
    deleteChallenge: (challengeIndex: number) => void;
    challengeType: TChallengeDetailOptions;
    challengeName: TChallengeDetailOptions;
    challengeDescription: TChallengeDetailOptions;
    challengeKey: {
      challengeTask: TChallengeDetailOptions;
      cashFlag: TChallengeDetailOptions;
      tournamentNameId: TChallengeDetailOptions;
      secondaryScoreIndex: TChallengeDetailOptions;
      tournamentType: TChallengeDetailOptions;
      gameModeOnly: TChallengeDetailOptions;
    };
    heroChallenge: TChallengeDetailOptionsBoolean;
    heroChallengeData: {
      heroChallengeTitle: TChallengeDetailOptions;
      heroChallengeDescription: TChallengeDetailOptions;
      heroChallengeColumnName: TChallengeDetailOptions;
    };
    dailyChallengeId: TChallengeDetailOptions;
    challengeLevelsList: {
      addFn: (challengeIndex: number) => void;
      deleteFn: (challengeIndex: number, challengeLevelIndex: number) => void;
      parameter: TChallengeDetailOptions;
      giftbox: TChallengeDetailOptions;
      rewardsList: {
        addFn: (challengeIndex: number, challengeLevelIndex: number) => void;
        deleteFn: (challengeIndex: number, challengeLevelIndex: number, rewardIndex: number) => void;
        dailyRewardType: TChallengeDetailOptions;
        amount: TChallengeDetailOptions;
        currencyCode: TChallengeDetailOptions;
        currencyType: TChallengeDetailOptions;
        duration: TChallengeDetailOptions;
      };
    };
    hasChallengeRedirection: TChallengeDetailOptionsBoolean;
    challengeRedirection: TChallengeDetailOptions;
  };
};

function ChallengeDetails({ challenges, options }: TChallengeDetailsProps) {
  const globalClasses = globalStyles();
  const { selectedApp } = useAppSelector(state => state.gameConfigForm);
  const [hasChallengeRedirection, setHasChallengeRedirection] = useState(false);

  return (
    <div>
      {challenges.map((chall, cIndex) =>
        <div className="indent" key={`challenge-${cIndex}`}>
          <div className={globalClasses.spaceBetween}>
            <Typography variant="h4">Challenge {cIndex + 1}</Typography>
            <IconButton
              aria-label="delete"
              disabled={options.challengeType.disabled}
              onClick={e => options.deleteChallenge(cIndex)}
              // onClick={e => deleteFn(e, index)}
              // onMouseDown={handleMouseDownPassword}
            >
              <Trash />
            </IconButton>
          </div>
          <FormControl component="fieldset">
            <FormLabel component="legend">Type</FormLabel>
            <RadioGroup
              style={{ display: 'inline-block', marginBottom: 0 }}
              aria-label="challenge type" name="challenge-type"
              value={chall.challengeType.value}
              onChange={(event: React.ChangeEvent<{ value: unknown }>) => {
                options.challengeType.onChange(event, cIndex);
              }}
            >
              {Object.keys(EChallengeType).map(option =>
                <FormControlLabel style={{ display: 'inline-block', marginBottom: 0 }}
                  label={option} value={option} key={option}
                  control={
                    <Radio disabled={options.challengeType.disabled} />
                  }
                />
              )}
            </RadioGroup>
          </FormControl>
          <p style={{ color: 'red' }}>{chall.challengeType.error}</p>
          <FormControl>
            <TextField
              id="field-challenge-challengeName"
              label="Name"
              helperText={chall.challengeName.error}
              value={chall.challengeName.value}
              error={chall.challengeName.error !== ''}
              disabled={options.challengeName.disabled}
              onChange={(event: React.ChangeEvent<{ value: unknown }>) => {
                options.challengeName.onChange(event, cIndex);
              }}
            />
          </FormControl>
          <FormControl>
            <TextField
              id="field-challenge-challengeDescription"
              label="Description"
              helperText={chall.challengeDescription.error}
              value={chall.challengeDescription.value}
              error={chall.challengeDescription.error !== ''}
              disabled={options.challengeDescription.disabled}
              onChange={(event: React.ChangeEvent<{ value: unknown }>) => {
                options.challengeDescription.onChange(event, cIndex);
              }}
            />
          </FormControl>
          {!placementHumanReadable[selectedApp] &&
            <Alert severity="warning">Placements not found for selected app</Alert>
          }
          <FormControlLabel
            label="Has redirection info"
            control={
              <Checkbox
                id={`field-challenge-hasChallengeRedirection-${cIndex}`}
                name="field-challenge-Override-hasChallengeRedirection-f"
                inputProps={{ 'aria-label': 'hasChallengeRedirection' }}
                checked={hasChallengeRedirection}
                disabled={options.challengeRedirection.disabled}
                onChange={(event: React.ChangeEvent<{ value: unknown, checked: boolean }>) => {
                  const checked = event.target.checked;
                  setHasChallengeRedirection(checked);
                  options.hasChallengeRedirection.onChange(event, cIndex);
                  if (checked) {
                    // todo set field values
                  } else {
                    // todo remove field values
                  }
                }}
              />
            }
          />
          {chall.challengeRedirection &&
          <FormControl>
            <InputLabel htmlFor={`field-challenge-challengeRedirection-${cIndex}`}>
              Redirection
            </InputLabel>
            <Select
              input={
                <Input name={`field-challenge-challengeRedirection-${cIndex}`}
                  id={`field-challenge-challengeRedirection-${cIndex}`} />
              }
              value={chall.challengeRedirection.value}
              error={chall.challengeRedirection.error !== ''}
              disabled={options.challengeRedirection.disabled}
              onChange={(event: React.ChangeEvent<{ value: unknown }>) => {
                options.challengeRedirection.onChange(event, cIndex);
              }}
            >
              {Object.keys(placementHumanReadable[selectedApp] || placementHumanReadable.common).map(option =>
                <MenuItem value={option} key={option}>{(placementHumanReadable[selectedApp] || placementHumanReadable.common)[option]}</MenuItem>)}
              <MenuItem value="NoAction">No Action</MenuItem>
              <MenuItem value="Store">Store</MenuItem>
              <MenuItem value="Share">Share</MenuItem>
              <MenuItem value="Profile">Profile</MenuItem>
              <MenuItem value="Leaderboard">Leaderboard</MenuItem>
            </Select>
          </FormControl>
          }
          <FormControlLabel
            label="Hero challenge"
            control={
              <Checkbox
                id={`field-challenge-heroChallenge-${cIndex}`}
                name="field-challenge-Override-heroChallenge-f"
                inputProps={{ 'aria-label': 'heroChallenge' }}
                checked={chall.heroChallenge.value}
                disabled={options.heroChallenge.disabled}
                onChange={(event: React.ChangeEvent<{ value: unknown, checked: boolean }>) => {
                  options.heroChallenge.onChange(event, cIndex);
                }}
              />
            }
          />
          {chall.heroChallengeData && <div className="indent">
            <Typography variant="h5">Hero Challenge Details</Typography>
            <FormControl>
              <TextField
                id="field-challenge-heroChallengeData-heroChallengeTitle"
                label="Title"
                helperText={chall.heroChallengeData.heroChallengeTitle.error}
                value={chall.heroChallengeData.heroChallengeTitle.value}
                error={chall.heroChallengeData.heroChallengeTitle.error !== ''}
                disabled={options.heroChallengeData.heroChallengeTitle.disabled}
                onChange={(event: React.ChangeEvent<{ value: unknown }>) => {
                  options.heroChallengeData.heroChallengeTitle.onChange(event, cIndex);
                }}
              />
            </FormControl>
            <FormControl>
              <TextField
                id="field-challenge-heroChallengeData-heroChallengeDescription"
                label="Description"
                helperText={chall.heroChallengeData.heroChallengeDescription.error}
                value={chall.heroChallengeData.heroChallengeDescription.value}
                error={chall.heroChallengeData.heroChallengeDescription.error !== ''}
                disabled={options.heroChallengeData.heroChallengeDescription.disabled}
                onChange={(event: React.ChangeEvent<{ value: unknown }>) => {
                  options.heroChallengeData.heroChallengeDescription.onChange(event, cIndex);
                }}
              />
            </FormControl>
            <FormControl>
              <TextField
                id="field-challenge-heroChallengeData-heroChallengeColumnName"
                label="Column name"
                helperText={chall.heroChallengeData.heroChallengeColumnName.error}
                value={chall.heroChallengeData.heroChallengeColumnName.value}
                error={chall.heroChallengeData.heroChallengeColumnName.error !== ''}
                disabled={options.heroChallengeData.heroChallengeColumnName.disabled}
                onChange={(event: React.ChangeEvent<{ value: unknown }>) => {
                  options.heroChallengeData.heroChallengeColumnName.onChange(event, cIndex);
                }}
              />
            </FormControl>
          </div>}
          {chall.dailyChallengeId &&
            <FormControl>
              <TextField
                id={`field-challenge-dailyChallengeId-${cIndex}`}
                label="Daily challenge ID"
                type="number"
                value={chall.dailyChallengeId.value}
                disabled
              />
            </FormControl>
          }
          <div className="indent-outlined">
            <Typography variant="h5">Key</Typography>
            <FormControl>
              <InputLabel htmlFor={`field-challenge-challengeKey-challengeTask-${cIndex}`}>
                Task
              </InputLabel>
              <Select
                input={
                  <Input name={`field-challenge-challengeKey-challengeTask-${cIndex}`}
                    id={`field-challenge-challengeKey-challengeTask-${cIndex}`} />
                }
                value={chall.challengeKey.challengeTask.value}
                error={chall.challengeKey.challengeTask.error !== ''}
                disabled={options.challengeKey.challengeTask.disabled}
                onChange={(event: React.ChangeEvent<{ value: unknown }>) => {
                  options.challengeKey.challengeTask.onChange(event, cIndex);
                }}
              >
                {Object.keys(EChallengeTask).map(option =>
                  <MenuItem value={option} key={option}>{option}</MenuItem>)}
              </Select>
            </FormControl>
            <FormControl component="fieldset">
              <FormLabel component="legend">Cash flag</FormLabel>
              <RadioGroup
                style={{ display: 'inline-block', marginBottom: 0 }}
                aria-label="cash flag" name="cash-flag"
                value={chall.challengeKey.cashFlag.value}
                onChange={(event: React.ChangeEvent<{ value: unknown }>) => {
                  options.challengeKey.cashFlag.onChange(event, cIndex);
                }}
              >
                {Object.keys(EChallengeCashFlag).map(option =>
                  <FormControlLabel style={{ display: 'inline-block', marginBottom: 0 }}
                    label={option} value={option} key={option}
                    control={
                      <Radio disabled={options.challengeKey.cashFlag.disabled} />
                    }
                  />
                )}
              </RadioGroup>
            </FormControl>
            {chall.challengeKey.cashFlag.error &&
              <p style={{ color: 'red' }}>{chall.challengeKey.cashFlag.error}</p>
            }
            {chall.challengeKey.secondaryScoreIndex && <FormControl>
              <TextField
                id="field-challenge-challengeKey-secondaryScoreIndex"
                label="Secondary score index"
                helperText={chall.challengeKey.secondaryScoreIndex.error}
                type="number"
                inputProps={{ min: 1, max: 5 }}
                value={chall.challengeKey.secondaryScoreIndex.value}
                error={chall.challengeKey.secondaryScoreIndex.error !== ''}
                disabled={options.challengeKey.secondaryScoreIndex.disabled}
                onChange={(event: React.ChangeEvent<{ value: unknown }>) => {
                  options.challengeKey.secondaryScoreIndex.onChange(event, cIndex);
                }}
              />
            </FormControl>}
            <FormControl>
              <InputLabel htmlFor={`field-challenge-challengeKey-tournamentType`}>
                Tournament type
              </InputLabel>
              <Select
                input={
                  <Input name={`field-challenge-challengeKey-tournamentType`}
                    id={`field-challenge-challengeKey-tournamentType`} />
                }
                value={chall.challengeKey.tournamentType.value}
                error={chall.challengeKey.tournamentType.error !== ''}
                disabled={options.challengeKey.tournamentType.disabled}
                onChange={(event: React.ChangeEvent<{ value: unknown }>) => {
                  const { value } = event.target;
                  console.info('value === EChallengeTournamentType.all', value === EChallengeTournamentType.all, value)
                  options.challengeKey.tournamentType.onChange(event, cIndex);
                  // options.challengeKey.tournamentNameId.onChange(event, cIndex, { cLevelIndex: -1, cLevelRewardIndex: -1 }, value === EChallengeTournamentType.all ? true : false);
                }}
              >
                {Object.keys(EChallengeTournamentType).map(option =>
                  <MenuItem value={option} key={option}>{option}</MenuItem>)}
              </Select>
            </FormControl>
            {chall.challengeKey.gameModeOnly &&
              <FormControl component="fieldset">
                <FormLabel component="legend">Game mode</FormLabel>
                <RadioGroup
                  style={{ display: 'inline-block', marginBottom: 0 }}
                  aria-label="gift box" name="gift-box"
                  value={chall.challengeKey.gameModeOnly.value}
                  onChange={(event: React.ChangeEvent<{ value: unknown }>) => {
                    const { value } = event.target;
                    options.challengeKey.gameModeOnly.onChange(event, cIndex);
                  }}
                >
                  <FormControlLabel style={{ display: 'inline-block', marginBottom: 0 }}
                    label="Daily" value={true}
                    control={<Radio disabled={options.challengeKey.gameModeOnly.disabled} />}
                  />
                  <FormControlLabel style={{ display: 'inline-block', marginBottom: 0 }}
                    label="Seasonal" value={false}
                    control={<Radio disabled={options.challengeKey.gameModeOnly.disabled} />}
                  />
                </RadioGroup>
              </FormControl>
            }
            <FormControlLabel
              label="Enable tournament name ID"
              control={
                <Checkbox
                  id={`field-challenge-enable-tournamentNameId-${cIndex}`}
                  name="field-challenge-enable-tournamentNameId-f"
                  inputProps={{ 'aria-label': 'enable-tournamentNameId' }}
                  checked={Boolean(chall.challengeKey.tournamentNameId)}
                  disabled={options.challengeKey.tournamentNameId.disabled}
                  onChange={(event: React.ChangeEvent<{ value: unknown, checked: boolean }>) => {
                    options.challengeKey.tournamentNameId.onChange(event, cIndex, { cLevelIndex: -1, cLevelRewardIndex: -1 }, event.target.checked);
                  }}
                />
              }
            />
            {chall.challengeKey.tournamentNameId && <FormControl>
              <TextField
                id="field-challenge-challengeKey-tournamentNameId"
                label="Tournament name ID"
                helperText={chall.challengeKey.tournamentNameId.error}
                type="number"
                inputProps={{ min: 1 }}
                value={chall.challengeKey.tournamentNameId.value}
                error={chall.challengeKey.tournamentNameId.error !== ''}
                disabled={options.challengeKey.tournamentNameId.disabled}
                onChange={(event: React.ChangeEvent<{ value: unknown }>) => {
                  options.challengeKey.tournamentNameId.onChange(event, cIndex);
                }}
              />
            </FormControl>}
            <Typography variant="h4">Levels</Typography>
            <WithAddDelete
              addDisabled={options.challengeLevelsList.parameter.disabled}
              nameOfResource="level"
              key={`challengeLevelsList-${cIndex}`}
              addFn={event => {
                options.challengeLevelsList.addFn(cIndex);
              }}
              deleteFn={event => {}}
            >
              {chall.challengeLevelsList.map((challengeLevel, challengeLevelIndex) =>
              <div className="indent-outlined" style={{ marginTop: 5 }}
                key={`level-${cIndex}-${challengeLevelIndex}`}
              >
                <div className={globalClasses.spaceBetween}>
                  <Typography variant="h5">Level {challengeLevelIndex + 1}</Typography>
                  <IconButton
                    aria-label="delete"
                    disabled={options.challengeLevelsList.parameter.disabled}
                    onClick={e => options.challengeLevelsList.deleteFn(cIndex, challengeLevelIndex)}
                    // onMouseDown={handleMouseDownPassword}
                  >
                    <Trash />
                  </IconButton>
                </div>
                <FormControl>
                  <TextField
                    id="field-challenge-challengeLevelsList-"
                    label="Parameter"
                    helperText={challengeLevel.parameter.error}
                    type="number"
                    inputProps={{ min: 0 }}
                    value={challengeLevel.parameter.value}
                    error={challengeLevel.parameter.error !== ''}
                    disabled={options.challengeLevelsList.parameter.disabled}
                    onChange={(event: React.ChangeEvent<{ value: unknown }>) => {
                      options.challengeLevelsList.parameter.onChange(event, cIndex, {
                        cLevelIndex: challengeLevelIndex,
                        cLevelRewardIndex: challengeLevelIndex,
                      });
                    }}
                  />
                </FormControl>
                <FormControl component="fieldset">
                  <FormLabel component="legend">Gift box</FormLabel>
                  <RadioGroup
                    style={{ display: 'inline-block', marginBottom: 0 }}
                    aria-label="gift box" name="gift-box"
                    value={challengeLevel.giftbox.value}
                    onChange={(event: React.ChangeEvent<{ value: unknown }>) => {
                      options.challengeLevelsList.giftbox.onChange(event, cIndex, {
                        cLevelIndex: challengeLevelIndex,
                        cLevelRewardIndex: challengeLevelIndex,
                      });
                    }}
                  >
                    {Object.keys(EChallengeGiftBox).map(option =>
                      <FormControlLabel style={{ display: 'inline-block', marginBottom: 0 }}
                        label={option} value={option} key={option}
                        control={
                          <Radio disabled={options.challengeLevelsList.giftbox.disabled} />
                        }
                      />
                    )}
                  </RadioGroup>
                </FormControl>
                <ChallengeRewardList
                  rewardsList={challengeLevel.rewardsList}
                  options={{
                    amount: {
                      disabled: options.challengeLevelsList.rewardsList.amount.disabled,
                      onChange: ({ event, rewardIndex }) => {
                        options.challengeLevelsList.rewardsList.amount.onChange(event, cIndex, {
                          cLevelIndex: challengeLevelIndex,
                          cLevelRewardIndex: rewardIndex,
                        });
                      },
                    },
                    dailyRewardType: {
                      disabled: options.challengeLevelsList.rewardsList.dailyRewardType.disabled,
                      onChange: ({ event, rewardIndex }) => {
                        options.challengeLevelsList.rewardsList.dailyRewardType.onChange(event, cIndex, {
                          cLevelIndex: challengeLevelIndex,
                          cLevelRewardIndex: rewardIndex,
                        });
                      },
                    },
                    currencyCode: {
                      disabled: options.challengeLevelsList.rewardsList.currencyCode.disabled,
                      onChange: ({ event, rewardIndex }) => {
                        options.challengeLevelsList.rewardsList.currencyCode.onChange(event, cIndex, {
                          cLevelIndex: challengeLevelIndex,
                          cLevelRewardIndex: rewardIndex,
                        });
                      },
                    },
                    currencyType: {
                      disabled: options.challengeLevelsList.rewardsList.currencyType.disabled,
                      onChange: ({ event, rewardIndex }) => {
                        options.challengeLevelsList.rewardsList.currencyType.onChange(event, cIndex, {
                          cLevelIndex: challengeLevelIndex,
                          cLevelRewardIndex: rewardIndex,
                        });
                      },
                    },
                    duration: {
                      disabled: options.challengeLevelsList.rewardsList.duration.disabled,
                      onChange: ({ event, rewardIndex }) => {
                        options.challengeLevelsList.rewardsList.duration.onChange(event, cIndex, {
                          cLevelIndex: challengeLevelIndex,
                          cLevelRewardIndex: rewardIndex,
                        });
                      },
                    },
                    addFn: () => {
                      options.challengeLevelsList.rewardsList.addFn(cIndex, challengeLevelIndex);
                    },
                    deleteFn: (rewardIndex) => {
                      options.challengeLevelsList.rewardsList.deleteFn(cIndex, challengeLevelIndex, rewardIndex);
                    },
                  }}
                />
              </div>
              )}
            </WithAddDelete>
          </div>
        </div>
      )}
    </div>
  );
}

export default ChallengeDetails;
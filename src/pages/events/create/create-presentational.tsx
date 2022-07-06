/* eslint-disable react-hooks/exhaustive-deps */
import {
  Card as MuiCard, CardContent, Checkbox, FormControl, FormControlLabel, FormLabel,
  Grid, Input, InputAdornment, InputLabel, MenuItem, Radio, RadioGroup, Select, TextField,
  Typography as MuiTypography
} from '@material-ui/core';
import { display, spacing } from "@material-ui/system";
import React, { Fragment } from 'react';
import styled from 'styled-components';
import { useAppSelector } from '../../../common/hooks';
import { isValidJSONObject } from '../../../common/utils';
import NoAppPlaceholder from '../../../components/no-app-placeholder';
import globalStyles from '../../../theme/globalStyles';
import { ECountryCode, ECryptoCurrency, ECurrency, EEventCategory, EGroupType, TCreateEventPresentationalProps } from '../../../types/eventTypes';
import { EChallengeCashFlag, EChallengeTask, EChallengeTournamentType } from '../../challenges/challenges-types';
import BattleFields from '../battle-fields';
import GameModeFields from '../gameModeFields';
import NudgeFields from '../nudge-fields';
import RepititionFields from '../repititionFields';

const GenericPage = styled.div`
  .MuiFormControlLabel-root {
    display: block;
  }
  .MuiFormControl-root {
    display: block;
    margin-bottom: 2rem;
  }
  .MuiInput-formControl {
    width: 100%;
  }
  .indent {
    padding: 8px 8px 8px 16px;
    margin-bottom: 8px;
    background-color: rgb(25 118 210 / 7%);
    border-radius: 4px;
  }
`;

const Card = styled(MuiCard)`
  ${spacing};

  box-shadow: none;
`;

const Shadow = styled.div`
  box-shadow: ${props => props.theme.shadows[1]};
`;

const Typography = styled(MuiTypography)`${spacing}; ${display}`;

function CreateEventPresentational(props: TCreateEventPresentationalProps) {
  const { dataFields, formControls } = props;
  const classes = globalStyles();
  const { selectedApp, isSelectedAppCrypto } = useAppSelector(state => state.gameConfigForm);

  return (
    <GenericPage>

      {(formControls.noAppPlaceholder.render ? formControls.noAppPlaceholder.render : false) &&
        <NoAppPlaceholder
          imageUrl={dataFields.noAppPlaceholderImageUrl}
          text={dataFields.noAppPlaceholderText}
        />
      }

      {!dataFields.shouldShowPlaceholder &&

        <Fragment>

          <Typography variant="h1">{dataFields.mutateMode} {dataFields.eventCategory === EEventCategory.CHALLENGE_LEADERBOARD ? 'Leaderboard' : 'Event'}</Typography>
          <form
            noValidate
            onSubmit={e => dataFields.formSubmit(e)}
          >
            <Grid container spacing={6}>
              <Grid item xs={12} sm={6}>
                <Shadow>
                  <Card px={6} py={6}>
                    <CardContent>
                      <Typography variant="h2">Event Configuration</Typography>
                      <FormControl>
                        <TextField
                          id="field-event-id"
                          label="ID"
                          value={formControls.id.value}
                          disabled
                        />
                      </FormControl>
                      {(formControls.groupIdCheckBox.render ? formControls.groupIdCheckBox.render : false) &&
                        <Fragment>
                          <FormControlLabel
                            label="Provide group ID"
                            control={
                              <Checkbox
                                id={`field-event-groupId-isEnabled`}
                                name="field-event-groupId-isEnabled-f"
                                inputProps={{ 'aria-label': 'groupId-isEnabled' }}
                                checked={formControls.groupIdCheckBox.checked}
                                disabled={formControls.groupIdCheckBox.disabled}
                                onChange={(event: React.ChangeEvent<{ value: unknown, checked: boolean }>) => {
                                  formControls.groupIdCheckBox.onChange && formControls.groupIdCheckBox.onChange(event);
                                }}
                              />
                            }
                          />
                          {(formControls.groupIdTextBox.render ? formControls.groupIdTextBox.render : false) &&
                            <FormControl>
                              <TextField
                                id="field-event-groupId"
                                label="Group ID"
                                value={formControls.groupIdTextBox.value}
                                error={formControls.groupIdTextBox.error !== ''}
                                helperText={formControls.groupIdTextBox.error}
                                disabled={formControls.groupIdTextBox.disabled}
                                onChange={(e: React.ChangeEvent<{ value: unknown }>) => {
                                  formControls.groupIdTextBox.onChange && formControls.groupIdTextBox.onChange(e);
                                }}
                              />
                            </FormControl>
                          }
                        </Fragment>
                      }
                      <FormControl>
                        <TextField
                          id="field-event-description"
                          label="Description"
                          value={formControls.description.value}
                          error={formControls.description.error !== ''}
                          // helperText={form.gameId.error}
                          disabled={formControls.description.disabled}
                          onChange={(e: React.ChangeEvent<{ value: unknown }>) => {
                            formControls.description.onChange && formControls.description.onChange(e);
                          }}
                        />
                      </FormControl>

                      {
                        (formControls.challengeName.render ? formControls.challengeName.render : false) &&
                        <FormControl>
                          <TextField
                            id="field-challengeName"
                            label="Challenge Name*"
                            value={formControls.challengeName.value}
                            helperText={formControls.secondaryScoreIndex.error}
                            error={formControls.challengeName.error ? (formControls.challengeName.error !== '') : false}
                            disabled={formControls.challengeName.disabled ? formControls.challengeName.disabled : false}
                            onChange={(e: React.ChangeEvent<{ value: unknown }>) => {
                              formControls.challengeName.onChange && formControls.challengeName.onChange(e);
                            }}
                          />
                          {formControls.challengeName.error &&
                            <p className={classes.fieldError}>{formControls.challengeName.error}</p>}
                        </FormControl>
                      }

                      {
                        (formControls.challengeDescription.render ? formControls.challengeDescription.render : false) &&
                        <FormControl>
                          <TextField
                            id="field-challengeDescription"
                            label="Challenge Description*"
                            value={formControls.challengeDescription.value}
                            helperText={formControls.secondaryScoreIndex.error}
                            error={formControls.challengeDescription.error ? formControls.challengeDescription.error !== '' : false}
                            disabled={formControls.challengeDescription.disabled ? formControls.challengeDescription.disabled : false}
                            onChange={(e: React.ChangeEvent<{ value: unknown }>) => {
                              formControls.challengeDescription.onChange && formControls.challengeDescription.onChange(e);
                            }}
                          />
                          {formControls.challengeDescription.error &&
                            <p className={classes.fieldError}>{formControls.challengeDescription.error}</p>}
                        </FormControl>
                      }

                      <FormControl>
                        <TextField
                          id="field-event-extraTimeBeforeStart"
                          label="Extra time before start"
                          value={formControls.extraTimeBeforeStart.value}
                          error={formControls.extraTimeBeforeStart.error !== ''}
                          helperText="to see upcoming"
                          disabled={formControls.extraTimeBeforeStart.disabled}
                          onChange={(e: React.ChangeEvent<{ value: unknown }>) => {
                            formControls.extraTimeBeforeStart.onChange && formControls.extraTimeBeforeStart.onChange(e);
                          }}
                          type="number"
                          inputProps={{ min: 0, max: dataFields.maxExtraTimeBeforeStart }}
                          InputProps={{
                            endAdornment: <InputAdornment position="end">seconds</InputAdornment>
                          }}
                        />
                        {formControls.extraTimeBeforeStart.error &&
                          <p className={classes.fieldError}>{formControls.extraTimeBeforeStart.error}</p>}
                      </FormControl>

                      <FormControl>
                        <TextField
                          id="field-event-extraTimeAfterEnd*"
                          label={dataFields.eventCategory === EEventCategory.CHALLENGE_LEADERBOARD ? "Result pop up display time" : "Extra time after end"}
                          value={formControls.extraTimeAfterEnd.value}
                          error={formControls.extraTimeAfterEnd.error !== ''}
                          helperText="to see result"
                          disabled={formControls.extraTimeAfterEnd.disabled}
                          onChange={(e: React.ChangeEvent<{ value: unknown }>) => {
                            formControls.extraTimeAfterEnd.onChange && formControls.extraTimeAfterEnd.onChange(e);
                          }}
                          type="number"
                          inputProps={{ min: 0, max: dataFields.maxExtraTimeBeforeStart }}
                          InputProps={{
                            endAdornment: <InputAdornment position="end">seconds</InputAdornment>
                          }}
                        />
                        {formControls.extraTimeAfterEnd.error &&
                          <p className={classes.fieldError}>{formControls.extraTimeAfterEnd.error}</p>}
                      </FormControl>

                      {
                        (formControls.walletCurrency.render ? formControls.walletCurrency.render : false) &&
                        <FormControl>
                          <InputLabel htmlFor={`field-event-currency`}>Currency</InputLabel>
                          <Select
                            input={
                              <Input name={`field-event-currency`}
                                id={`field-event-currency`} />
                            }
                            value={formControls.walletCurrency.value}
                            error={formControls.walletCurrency.error !== ''}
                            disabled={formControls.walletCurrency.disabled}
                            onChange={(e: React.ChangeEvent<{ value: unknown }>) => {
                              formControls.walletCurrency.onChange && formControls.walletCurrency.onChange(e);
                            }}
                          >
                            {!isSelectedAppCrypto &&
                              Object.keys(ECurrency).filter(c => c !== ECurrency.NOT_AVAILABLE).map(curr =>
                                <MenuItem value={curr} key={curr}>{curr}</MenuItem>)}

                            {isSelectedAppCrypto &&
                              Object.keys(ECryptoCurrency).map(curr =>
                                <MenuItem value={curr} key={curr}>{curr}</MenuItem>)}

                          </Select>
                          {formControls.walletCurrency.error &&
                            <p className={classes.fieldError}>{formControls.walletCurrency.error}</p>}
                        </FormControl>
                      }

                      {
                        (formControls.groupType.render ? formControls.groupType.render : false) &&
                        <FormControl>
                          <InputLabel>
                            Group type
                          </InputLabel>
                          <Select
                            value={formControls.groupType.value as EGroupType}
                            error={formControls.groupType.error ? formControls.groupType.error !== '' : false}
                            disabled={formControls.groupType.disabled ? formControls.groupType.disabled : false}
                            onChange={(event: React.ChangeEvent<{ value: unknown }>) => {
                              formControls.groupType.onChange && formControls.groupType.onChange(event);
                            }}
                          >
                            {Object.entries(EGroupType).map(groupType =>
                              <MenuItem value={groupType[1]} key={groupType[0]}>{groupType[0]}</MenuItem>)}
                          </Select>
                        </FormControl>
                      }

                      {
                        (formControls.challengeKey.render ? formControls.challengeKey.render : false) &&
                        <FormControl>
                          <InputLabel>
                            Challenge key
                          </InputLabel>
                          <Select
                            value={formControls.challengeKey.value as EChallengeTask}
                            error={formControls.challengeKey.error ? formControls.challengeKey.error !== '' : false}
                            disabled={formControls.challengeKey.disabled ? formControls.challengeKey.disabled : false}
                            onChange={(event: React.ChangeEvent<{ value: unknown }>) => {
                              formControls.challengeKey.onChange && formControls.challengeKey.onChange(event);
                            }}
                          >
                            {Object.entries(EChallengeTask).map(challengeEventKey =>
                              <MenuItem value={challengeEventKey[1]} key={challengeEventKey[0]}>{challengeEventKey[0]}</MenuItem>)}
                          </Select>
                        </FormControl>
                      }

                      {
                        (formControls.cashFlag.render ? formControls.cashFlag.render : false) &&
                        <FormControl>
                          <FormLabel component="legend">Cash flag</FormLabel>
                          <RadioGroup
                            style={{ display: 'inline-block', marginBottom: 0 }}
                            aria-label="cash flag" name="cash-flag"
                            value={formControls.cashFlag.value as EChallengeCashFlag}
                            onChange={(event: React.ChangeEvent<{ value: unknown }>) => {
                              formControls.cashFlag.onChange && formControls.cashFlag.onChange(event);
                            }}
                          >
                            {Object.keys(EChallengeCashFlag).map(option =>
                              <FormControlLabel style={{ display: 'inline-block', marginBottom: 0 }}
                                label={option} value={option} key={option}
                                control={
                                  <Radio disabled={formControls.cashFlag.disabled} />
                                }
                              />
                            )}
                          </RadioGroup>
                        </FormControl>
                      }

                      {
                        (formControls.secondaryScoreIndex.render ? formControls.secondaryScoreIndex.render : false) &&
                        <FormControl>
                          <TextField
                            id="field-challenge-challengeKey-secondaryScoreIndex"
                            label="Secondary score index"
                            helperText={formControls.secondaryScoreIndex.error}
                            type="number"
                            inputProps={{ min: 1, max: 5 }}
                            value={formControls.secondaryScoreIndex.value as number}
                            error={formControls.secondaryScoreIndex.error !== ''}
                            disabled={formControls.secondaryScoreIndex.disabled}
                            onChange={(event: React.ChangeEvent<{ value: unknown }>) => {
                              formControls.secondaryScoreIndex.onChange && formControls.secondaryScoreIndex.onChange(event);
                            }}
                          />
                          {formControls.secondaryScoreIndex.error &&
                            <p className={classes.fieldError}>{formControls.secondaryScoreIndex.error}</p>}
                        </FormControl>
                      }

                      {
                        (formControls.tournamentType.render ? formControls.tournamentType.render : false) &&
                        <FormControl>
                          <InputLabel htmlFor={`field-challenge-challengeKey-tournamentType`}>
                            Tournament type
                          </InputLabel>
                          <Select
                            input={
                              <Input name={`field-challenge-challengeKey-tournamentType`}
                                id={`field-challenge-challengeKey-tournamentType`} />
                            }
                            value={formControls.tournamentType.value as EChallengeTournamentType}
                            error={formControls.tournamentType.error !== ''}
                            disabled={formControls.tournamentType.disabled}
                            onChange={(event: React.ChangeEvent<{ value: unknown }>) => {
                              const { value } = event.target;
                              formControls.tournamentType.onChange && formControls.tournamentType.onChange(event);
                            }}
                          >
                            {Object.keys(EChallengeTournamentType).map(option =>
                              <MenuItem value={option} key={option}>{option}</MenuItem>)}
                          </Select>
                        </FormControl>
                      }


                      {
                        (formControls.enableTournamentNameId.render ? formControls.enableTournamentNameId.render : false) &&
                        <FormControlLabel
                          label="Enable tournament name ID"
                          control={
                            <Checkbox
                              id={`field-challenge-enable-tournamentNameId`}
                              name="field-challenge-enable-tournamentNameId-f"
                              inputProps={{ 'aria-label': 'enable-tournamentNameId' }}
                              checked={formControls.enableTournamentNameId.checked}
                              disabled={formControls.enableTournamentNameId.disabled}
                              onChange={(event: React.ChangeEvent<{ value: unknown, checked: boolean }>) => {
                                formControls.enableTournamentNameId.onChange && formControls.enableTournamentNameId.onChange(event);
                              }}
                            />
                          }
                        />
                      }

                      {
                        (formControls.tournamentNameId.render ? formControls.tournamentNameId.render : false) &&
                        <FormControl>
                          <TextField
                            id="field-challenge-challengeKey-tournamentNameId"
                            label="Tournament name ID"
                            helperText={formControls.tournamentNameId.error}
                            type="number"
                            inputProps={{ min: 1 }}
                            value={formControls.tournamentNameId.value}
                            error={formControls.tournamentNameId.error !== ''}
                            disabled={formControls.tournamentNameId.disabled}
                            onChange={(event: React.ChangeEvent<{ value: unknown }>) => {
                              formControls.tournamentNameId.onChange && formControls.tournamentNameId.onChange(event);
                            }}
                          />
                          {formControls.tournamentNameId.error &&
                            <p className={classes.fieldError}>{formControls.tournamentNameId.error}</p>}
                        </FormControl>
                      }

                      {
                        (formControls.enabledCountryCodes.render ? formControls.enabledCountryCodes : false) &&
                        <FormControl component="fieldset">
                          <FormLabel component="legend">Enabled country codes</FormLabel>
                          <RadioGroup
                            style={{ display: 'inline-block', marginBottom: 0 }}
                            aria-label="Enabled country codes" name="enabled-country-codes"
                            value={formControls.enabledCountryCodes.value}
                            // helperText={form.engineData.engineType.error}
                            onChange={(e: React.ChangeEvent<{ value: unknown }>) => {
                              formControls.enabledCountryCodes.onChange && formControls.enabledCountryCodes.onChange(e);
                            }}
                          >
                            {Object.keys(ECountryCode).map(country =>
                              <FormControlLabel style={{ display: 'inline-block', marginBottom: 0 }}
                                label={country} value={country} key={country}
                                control={<Radio disabled={dataFields.mutateMode === 'View'} />}
                              />
                            )}
                          </RadioGroup>
                        </FormControl>
                      }


                      <FormControl style={{ marginBottom: 0 }}>
                        <TextField
                          id="field-json-logic"
                          label="JSON logic filters"
                          value={formControls.jsonLogicFilters.value}
                          error={formControls.jsonLogicFilters.error !== ''}
                          multiline
                          rows={10}
                          rowsMax={10}
                          inputProps={{ style: { background: 'rgba(0,0,0,0.05)', fontFamily: 'monospace', fontSize: 13 } }}
                          style={{ marginBottom: 0 }}
                          disabled={formControls.jsonLogicFilters.disabled}
                          onChange={(e: React.ChangeEvent<{ value: unknown }>) => {
                            formControls.jsonLogicFilters.onChange && formControls.jsonLogicFilters.onChange(e);
                          }}
                        />
                      </FormControl>
                      <Fragment>
                        <Typography variant="body2">
                          <span>Enter condition to match users by <abbr title="Days Since Install">DSI</abbr>
                            . Event will be shown only to matching users.
                            {/* Click <a href="https://altayaydemir.github.io/react-json-logic/" target="_blank" rel="noopener noreferrer">here</a> to
                          create json-logic string. */}
                            <br />
                            e.g. Below json-logic will match all users irrespective of their DSI.</span>
                        </Typography>
                        <pre style={{ marginBottom: '2rem' }}>{`{
  "<=": [
    0,
    {
      "var": [
        "dsi"
      ]
    }
  ]
}`}</pre>
                      </Fragment>
                      <FormControl>
                        <TextField
                          id="field-unlockLogic"
                          label="unlockLogic"
                          value={formControls.unlockLogic.value}
                          error={formControls.unlockLogic.error !== ''}
                          helperText="use json-logic string"
                          disabled={formControls.unlockLogic.disabled}
                          onChange={(e: React.ChangeEvent<{ value: unknown }>) => {
                            formControls.unlockLogic.onChange && formControls.unlockLogic.onChange(e);
                          }}
                          multiline rows={10} rowsMax={20}
                          inputProps={{ style: { background: 'rgba(0,0,0,0.05)', fontFamily: 'monospace' } }}
                        />
                      </FormControl>
                      {formControls.unlockLogic.error &&
                        <p className={classes.fieldError}>{formControls.unlockLogic.error}</p>}

                      {Object.keys(dataFields.gameIdToGameDataMap).map((gameId, gameModeIndex) =>
                        <Fragment key={gameId}>
                          <FormControlLabel
                            label="Override banner rules JSON"
                            control={
                              <Checkbox
                                id={`Override-bannerRulesText-field-${gameId}`}
                                name="Override-bannerRulesText-f"
                                inputProps={{ 'aria-label': 'bannerRulesText' }}
                                checked={formControls.bannerRulesTextCheckBox.checked(gameId)}
                                disabled={formControls.bannerRulesTextCheckBox.disabled}
                                onChange={(e: React.ChangeEvent<{ value: unknown, checked: boolean }>) => {
                                  formControls.bannerRulesTextCheckBox.onChange && formControls.bannerRulesTextCheckBox.onChange(e, gameId);
                                }}
                              />
                            }
                          />

                          {
                            (formControls.bannerRulesTextTextBox.render ? formControls.bannerRulesTextTextBox.render(gameId) : false) &&
                            <FormControl>
                              <TextField
                                id={`bannerRulesText-${gameModeIndex}`}
                                name="bannerRulesText"
                                label="Banner rules JSON"
                                value={formControls.bannerRulesTextTextBox.value(gameId)}
                                error={formControls.bannerRulesTextTextBox.error(gameId) !== ''}
                                helperText={formControls.bannerRulesTextTextBox.error}
                                disabled={formControls.bannerRulesTextTextBox.disabled}
                                onChange={(e: React.ChangeEvent<{ value: unknown }>) => {
                                  if (isValidJSONObject(e.target.value as string || '{}')) {
                                    formControls.bannerRulesTextTextBox.onChange && formControls.bannerRulesTextTextBox.onChange(e, gameId);
                                  }
                                }}
                                multiline rows={10} rowsMax={20}
                                inputProps={{ style: { background: 'rgba(0,0,0,0.05)', fontFamily: 'monospace' } }}
                              />
                            </FormControl>
                          }
                        </Fragment>
                      )}

                    </CardContent>
                  </Card>
                </Shadow>

                {(formControls.gameModeFields.render ? formControls.gameModeFields.render : false) &&
                  <Shadow style={{ marginTop: 24 }}>
                    <Card px={6} py={6}>
                      <CardContent>
                        <Typography variant="h2">Game Mode Data List</Typography>
                        <Typography variant="body2">These values will override the values provided in Game Config.</Typography>
                        {/* todo */}
                        <GameModeFields mutateMode={dataFields.mutateMode} />
                      </CardContent>
                    </Card>
                  </Shadow>
                }
              </Grid>

              <Grid item xs={12} sm={6}>
                {(formControls.battleFields.render ? formControls.battleFields.render : false) &&
                  <Shadow>
                    <Card px={6} py={6}>
                      <CardContent>
                        <Typography variant="h2">Battle Data</Typography>
                        <BattleFields mutateMode={dataFields.mutateMode} />
                      </CardContent>
                    </Card>
                  </Shadow>
                }

                {(formControls.nudgeFields.render ? formControls.nudgeFields.render : false) &&
                  <Shadow>
                    <Card px={6} py={6}>
                      <CardContent>
                        <Typography variant="h2">Nudge Data</Typography>
                        <NudgeFields mutateMode={dataFields.mutateMode} />
                      </CardContent>
                    </Card>
                  </Shadow>
                }

                <Shadow style={{ marginTop: 24 }}>
                  <Card px={6} py={6} style={{ overflow: 'visible' }}>
                    <CardContent>
                      <Typography variant="h2">Event Recurrence</Typography>
                      {/* todo */}
                      <RepititionFields />
                    </CardContent>
                  </Card>
                </Shadow>
              </Grid>
            </Grid>
          </form>

        </Fragment>}

    </GenericPage>
  );
}

export default CreateEventPresentational;

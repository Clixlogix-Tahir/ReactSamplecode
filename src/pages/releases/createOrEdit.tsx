import {
  Button,
  Card as MuiCard,
  CardContent,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  TextField,
  Typography as MuiTypography
} from '@material-ui/core';
import React, {
  FormEvent,
  useState
} from 'react';
import {
  EPlatforms
} from '../../types/gameConfigTypes';
import {
  spacing
} from "@material-ui/system";
import styled from 'styled-components';
import Datetime from 'react-datetime';
import "react-datetime/css/react-datetime.css";
import moment from 'moment';

const GenericPage = styled.div`
  .MuiFormControl-root,
  form > .MuiFormControlLabel-root {
    display: block;
    margin-bottom: 2rem;
  }
  .MuiInput-formControl {
    width: 100%;
  }
`;

const Card = styled(MuiCard)`
  ${spacing};

  box-shadow: none;
`;

const Typography = styled(MuiTypography)`
  ${spacing};
`;

const Shadow = styled.div`
  box-shadow: ${props => props.theme.shadows[1]};
`;

function CreateOrEdit(props: any) {
  const [platform, setPlatform] = useState(EPlatforms.iOS);
  const [version, setVersion] = useState('');
  const [date, setDate] = useState(new Date());
  const [buildNumber, setBuildNumber] = useState(0);
  const [downloadVersion, setDownloadVersion] = useState('');
  const [enableSoftUpdate, setEnableSoftUpdate] = useState(false);

  const createOrEditSubmit = (event: FormEvent) => {
    event.preventDefault();
    console.info('createOrEditSubmit');
  };

  return (
    <GenericPage>
      <Typography variant="h1" mb={4}>Create or Edit Release</Typography>
      <Shadow>
        <Card px={6} py={6}>
          <CardContent>
            <form onSubmit={createOrEditSubmit} noValidate
              style={{ maxWidth: 500, margin: 'auto' }}
            >
              <FormControl component="fieldset">
                <FormLabel component="legend">OS</FormLabel>
                <RadioGroup
                  aria-label="gender" name="engine-type"
                  value={platform}
                  // helperText={form.engineData.engineType.error}
                  onChange={(e: React.ChangeEvent<{ value: unknown }>) => {
                    setPlatform(e.target.value as EPlatforms);
                  }}
                >
                  {Object.keys(EPlatforms).map(type =>
                    <FormControlLabel
                      key={type}
                      value={type}
                      label={type}
                      control={<Radio/>}
                    />
                  )}
                </RadioGroup>
              </FormControl>
              <FormControl>
                <TextField
                  id="release-version"
                  name="release-version"
                  label="Version"
                  value={version}
                  onChange={(e: React.ChangeEvent<{ value: unknown }>) => {
                    setVersion(e.target.value as string);
                  }}
                />
              </FormControl>
              <FormControl>
              <FormLabel>
                Release date
              </FormLabel>
                <Datetime
                  value={date}
                  inputProps={{
                    className: 'MuiInputBase-input MuiInput-input',
                    style: {
                      borderBottom: '1px solid rgba(0, 0, 0, 0.42)',
                    },
                    onKeyUp: (e: any) => console.info(e.target.selectionStart)
                  }}
                  onChange={e => {
                    setDate(moment(e).toDate());
                  }}
                />
              </FormControl>
              <FormControl>
                <TextField
                  id="release-build-number"
                  name="release-build-number"
                  label="Build number"
                  value={buildNumber}
                  onChange={(e: React.ChangeEvent<{ value: unknown }>) => {
                    setBuildNumber(e.target.value as number);
                  }}
                />
              </FormControl>
              <FormControl>
                <TextField
                  id="release-download-version"
                  name="release-download-version"
                  label="Download version"
                  value={downloadVersion}
                  onChange={(e: React.ChangeEvent<{ value: unknown }>) => {
                    setDownloadVersion(e.target.value as string);
                  }}
                />
              </FormControl>
              <FormControlLabel
                label="Soft update"
                control={
                  <Checkbox
                    id="release-enable-soft-update"
                    name="release-enable-soft-update"
                    inputProps={{ 'aria-label': 'enable soft update' }}
                    checked={enableSoftUpdate}
                    onChange={(e: React.ChangeEvent<{ checked: boolean }>) => {
                      setEnableSoftUpdate(e.target.checked);
                    }}
                  />
                }
              />
              <Button
                variant="contained"
                color="primary"
                type="submit"
              >
                Create Release
              </Button>
            </form>
          </CardContent>
        </Card>
      </Shadow>
    </GenericPage>
  );
}

export default CreateOrEdit;

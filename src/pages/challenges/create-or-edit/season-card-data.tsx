import {
  FormControl, Input, InputLabel, MenuItem, Select, TextField
} from '@material-ui/core';
import React from 'react';
import {
  ESeasonCardType,
  TSeasonCardTypeFields
} from '../challenges-types';


type TSeasonCardOptions = {
  disabled?: boolean;
  onChange: (
    event: React.ChangeEvent<{ value: unknown }>
  ) => void;
};

type TSeasonCardDataProps = {
  cdIndex: number;
  seasonCard: TSeasonCardTypeFields;
  options: {
    deleteSeasonCard: (seasonCardIndex: number) => void;
    seasonCardType: TSeasonCardOptions;
    title: TSeasonCardOptions;
    description: TSeasonCardOptions;
  };
};

function SeasonCardData({ cdIndex, seasonCard, options }: TSeasonCardDataProps) {

  return (
    <div>
      <FormControl>
        <TextField
          id={`field-seasonCardDataList-title-${cdIndex}`}
          label="Title"
          value={seasonCard.title.value}
          error={seasonCard.title.error !== ''}
          helperText={seasonCard.title.error}
          disabled={options.title.disabled}
          onChange={(event: React.ChangeEvent<{ value: unknown }>) => {
            options.title.onChange(event);
          }}
        />
      </FormControl>
      <FormControl>
        <TextField
          id={`field-seasonCardDataList-description-${cdIndex}`}
          label="Description"
          value={seasonCard.description.value}
          error={seasonCard.description.error !== ''}
          helperText={seasonCard.description.error}
          disabled={options.description.disabled}
          onChange={(event: React.ChangeEvent<{ value: unknown }>) => {
            options.description.onChange(event);
          }}
        />
      </FormControl>
      <FormControl>
        <InputLabel htmlFor={`field-seasonCardDataList-seasonCardType-${cdIndex}`}>Type</InputLabel>
        <Select
          input={
            <Input name={`field-seasonCardDataList-seasonCardType-${cdIndex}`}
              id={`field-seasonCardDataList-seasonCardType-${cdIndex}`} />
          }
          value={seasonCard.seasonCardType.value}
          error={seasonCard.seasonCardType.error !== ''}
          disabled={options.seasonCardType.disabled}
          onChange={(event: React.ChangeEvent<{ value: unknown }>) => {
            options.seasonCardType.onChange(event);
          }}
        >
          {Object.keys(ESeasonCardType).map(scType =>
            <MenuItem value={scType} key={scType}>{scType}</MenuItem>)}
        </Select>
      </FormControl>
    </div>
  );
}

export default SeasonCardData;

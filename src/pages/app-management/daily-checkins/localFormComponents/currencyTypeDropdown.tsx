/* eslint-disable react-hooks/exhaustive-deps */
import {
  createStyles,
  MenuItem,
  Select
} from '@material-ui/core';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import { makeStyles } from '@material-ui/core/styles';
import React from 'react';
import { EVirtualCurrencyTypes } from '../../../../types/types';

const useStyles = makeStyles((theme) => createStyles({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 150,
  },
  errorText: {
    color: 'red',
    fontSize: '0.8rem',
    marginTop: 0,
  },
}));

type TCurrencyTypeDropdownProps = {
  dropdownValue: EVirtualCurrencyTypes;
  onChangeHandler: (event: React.ChangeEvent<{ name?: string | undefined; value: unknown; }>, child: React.ReactNode) => void;
  disabledFlag: boolean;
  error: string;
  setError: Function;
  addError: Function;
};

const CurrencyTypeDropdown: React.FC<TCurrencyTypeDropdownProps> = ({ dropdownValue, onChangeHandler, disabledFlag, error, setError, addError }) => {
  const classes = useStyles();
  //const [error, setError] = useState<string>('');

  // useEffect(() => {
  //   if (dropdownValue && dropdownValue === EVirtualCurrencyTypes.NONE) {
  //     setError('Please select a currency type.');
  //     addError(1);
  //   } else {
  //     if (error !== '') {
  //       setError('');
  //       addError(-1);
  //     }
  //   }
  // }, [dropdownValue]);

  return (
    <FormControl className={classes.formControl}>
      <InputLabel id="demo-simple-select-label">Currency Type</InputLabel>
      <Select
        labelId="demo-simple-select-label"
        id="demo-simple-select"
        value={dropdownValue}
        onChange={onChangeHandler}
        disabled={disabledFlag}
        error={error !== ''}
      >
        {
          Object.values(EVirtualCurrencyTypes).map((currencyType, index) => (
            <MenuItem
              value={currencyType}
            >
              {currencyType}
            </MenuItem>
          ))
        }

      </Select>
      <p className={classes.errorText}>{error}</p>

    </FormControl>
  );
}

export default CurrencyTypeDropdown;

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  Input,
  InputLabel,
  MenuItem,
  Select,
  Snackbar,
  TextField
} from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import produce from 'immer';
import React, { FormEvent } from 'react';
import styled from 'styled-components';
import { XHR_STATE } from '../../../common/constants';
import { useAppDispatch, useAppSelector } from '../../../common/hooks';
import { ECashProductType, ECurrency, TCashProduct, TCashProductForm } from '../../../types/eventTypes';
import { TFormFieldString } from '../../../types/formFields';
import { getProductPayloadFromForm } from '../eventConverters';
import { eventApiDispatchers, setNudgeForm } from '../eventSlice';

type TAddProductProps = {
  open: boolean;
  onClose: () => void;
  onOkClick: () => void;
  onSuccess?: () => void;
  onError?: () => void;
}

const GenericPage = styled.form`
  width: 300px;
  // .MuiTypography-h3 {
  //   margin-top: 1rem;
  // }
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

const stringField: TFormFieldString = {
  value: '',
  error: '',
  required: true,
};

const initialProductForm: TCashProductForm = {
  id: { ...stringField, value: 0 },
  readableId: { ...stringField },
  name: { ...stringField },
  highlightLabel: { ...stringField },
  currency: { value: ECurrency.USD, error: '', required: true },
  amount: { ...stringField, value: 0 },
  offerPercent: { ...stringField, value: 0 },
  appId: { ...stringField },
  type: { value: ECashProductType.FEATURED, error: '', required: true },
  offerAmount: { ...stringField, value: 0 },
};

function AddProduct(props: TAddProductProps) {
  const dispatch = useAppDispatch();
  const { selectedApp, selectedAppObj } = useAppSelector(state => state.gameConfigForm);
  const { createProduct, nudgeForm } = useAppSelector(state => state.eventSlice);
  const [showProducCreateSuccess, setShowProducCreateSuccess] = React.useState(false);
  const [showProducCreateError, setShowProducCreateError] = React.useState(false);
  const [validationError, setValidationError] = React.useState('');
  const [form, setForm] = React.useState<TCashProductForm>(initialProductForm);

  React.useEffect(() => {
    setForm(initialProductForm);
  }, [props.open])

  const addProductSubmit = (event: FormEvent) => {
    event.preventDefault();
    event.stopPropagation();
    if (parseFloat(form.amount.value + '') <= 0) {
      setValidationError('Amount should be greater than 0');
      return;
    }
    setValidationError('');
    dispatch(eventApiDispatchers.createCashProduct(
      selectedApp,
      {
        ...getProductPayloadFromForm(form),
        appId: selectedApp,
      },
      {
        success: (createdProduct: TCashProduct) => {
          props.onClose();
          dispatch(setNudgeForm(produce(nudgeForm, draftForm => {
            draftForm.additionalParams.productIds.value = [createdProduct.readableId];
          })));
          setShowProducCreateSuccess(true);
          if (props.onSuccess) props.onSuccess();
        },
        error: (e: any) => {
          // todo show snackbar
          console.error('addProductSubmit error', e);
          setShowProducCreateError(true);
          if (props.onError) props.onError();
        }
      },
    ));
    props.onOkClick();
  };

  return (
    <React.Fragment>
      <Dialog
        open={props.open}
        onClose={props.onClose}
        scroll="paper"
        aria-labelledby="scroll-dialog-title"
        aria-describedby="scroll-dialog-description"
        disableBackdropClick={true}
        // fullScreen={fullScreen}
        maxWidth="xl"
      >
        <DialogTitle id="scroll-dialog-title">
          Create New Product
        </DialogTitle>
        <GenericPage onSubmit={addProductSubmit}>
          <DialogContent dividers={true}>
            <FormControl>
              <TextField
                id="event-product-field-readableId"
                label="Readable ID"
                value={form.readableId.value}
                error={form.readableId.error !== ''}
                helperText={form.readableId.error}
                required
                onChange={(e: React.ChangeEvent<{ value: unknown }>) => {
                  setForm(produce(form, draftForm => {
                    draftForm.readableId.value = e.target.value as string;
                  }));
                }}
              />
            </FormControl>

            <FormControl>
              <TextField
                id="event-product-field-name"
                label="Name"
                value={form.name.value}
                error={form.name.error !== ''}
                helperText={form.name.error}
                onChange={(e: React.ChangeEvent<{ value: unknown }>) => {
                  setForm(produce(form, draftForm => {
                    draftForm.name.value = e.target.value as string;
                  }));
                }}
              />
            </FormControl>

            <FormControl>
              <TextField
                id="event-product-field-highlightLabel"
                label="Highlight label"
                value={form.highlightLabel.value}
                error={form.highlightLabel.error !== ''}
                helperText={form.highlightLabel.error}
                onChange={(e: React.ChangeEvent<{ value: unknown }>) => {
                  setForm(produce(form, draftForm => {
                    draftForm.highlightLabel.value = e.target.value as string;
                  }));
                }}
              />
            </FormControl>

            <FormControl>
              <InputLabel htmlFor="event-product-field-type">Type</InputLabel>
              <Select
                input={
                  <Input name="event-product-field-type"
                    id="event-product-field-type" />
                }
                value={form.type.value}
                error={form.type.error !== ''}
                onChange={(e: React.ChangeEvent<{ value: unknown }>) => {
                  setForm(produce(form, draftForm => {
                    draftForm.type.value = e.target.value as ECashProductType;
                  }));
                }}
              >
                {Object.keys(ECashProductType).map(subCat =>
                  <MenuItem value={subCat} key={subCat}>{subCat}</MenuItem>)}
              </Select>
            </FormControl>

            <FormControl>
              <InputLabel htmlFor="event-product-field-currency">Entry currency</InputLabel>
              <Select
                input={<Input name="product-nudge-currency"
                  id="event-product-field-currency" />}
                value={form.currency.value}
                error={form.currency.error !== ''}
                onChange={(e: React.ChangeEvent<{ value: unknown }>) => {
                  setForm(produce(form, draftForm => {
                    draftForm.currency.value = e.target.value as ECurrency;
                  }));
                }}
                inputProps={{ min: 1 }}
              >
                {selectedAppObj.serverParams.realCryptoCurrency.map(currency =>
                  <MenuItem
                    key={currency}
                    value={currency}
                  >
                    {currency}
                  </MenuItem>
                )}
                {/* {Object.keys(ECurrency).map(currency =>
                  <option value={currency} key={currency}>{currency}</option>)} */}
              </Select>
            </FormControl>

            <FormControl>
              <TextField
                id="event-product-field-amount"
                label="Amount"
                value={form.amount.value}
                error={form.amount.error !== ''}
                helperText={form.amount.error}
                type="number"
                onChange={(e: React.ChangeEvent<{ value: unknown }>) => {
                  setForm(produce(form, draftForm => {
                    draftForm.amount.value = e.target.value as number;
                  }));
                }}
              />
            </FormControl>

            <FormControl>
              <TextField
                id="event-product-field-offerAmount"
                label="Offer amount"
                value={form.offerAmount.value}
                error={form.offerAmount.error !== ''}
                helperText={form.offerAmount.error}
                type="number"
                onChange={(e: React.ChangeEvent<{ value: unknown }>) => {
                  setForm(produce(form, draftForm => {
                    draftForm.offerAmount.value = e.target.value as number;
                  }));
                }}
              />
            </FormControl>

            <FormControl>
              <TextField
                id="event-product-field-offerPercent"
                label="Offer percent"
                value={form.offerPercent.value}
                error={form.offerPercent.error !== ''}
                helperText={form.offerPercent.error}
                type="number"
                onChange={(e: React.ChangeEvent<{ value: unknown }>) => {
                  setForm(produce(form, draftForm => {
                    draftForm.offerPercent.value = e.target.value as number;
                  }));
                }}
              />
            </FormControl>
          {/* </GenericPage> */}
        </DialogContent>
          <DialogActions>
            <Button onClick={props.onClose} color="primary"
              disabled={createProduct.loading === XHR_STATE.IN_PROGRESS}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained" color="primary"
              disabled={createProduct.loading === XHR_STATE.IN_PROGRESS}
              >
              Create Product
            </Button>
          </DialogActions>
        </GenericPage>
      </Dialog>
      <Snackbar
        open={showProducCreateSuccess}
        autoHideDuration={4000}
        onClose={() => setShowProducCreateSuccess(false)}
      >
        <Alert onClose={() => setShowProducCreateSuccess(false)} severity="success">
          Created product successfully.
        </Alert>
      </Snackbar>
      <Snackbar
        open={showProducCreateError}
        autoHideDuration={4000}
        onClose={() => setShowProducCreateError(false)}
      >
        <Alert onClose={() => setShowProducCreateError(false)} severity="error">
          Creation of product failed.
        </Alert>
      </Snackbar>
      <Snackbar
        open={Boolean(validationError)}
        autoHideDuration={4000}
        onClose={() => setValidationError('')}
      >
        <Alert onClose={() => setValidationError('')} severity="error">
          {validationError}
        </Alert>
      </Snackbar>
    </React.Fragment>
  );
}

export default AddProduct;
/* eslint-disable react-hooks/exhaustive-deps */
import { Button, FormControl, Input, InputLabel, MenuItem, Select, TextField } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import Autocomplete from '@material-ui/lab/Autocomplete';
import produce from 'immer';
import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../../common/hooks';
import { ESubCategory, TMutateProps } from '../../../types/eventTypes';
import { eventApiDispatchers, setNudgeForm } from '../eventSlice';
import AddProduct from './addProduct';

function NudgeFields({ mutateMode }: TMutateProps) {
  const dispatch = useAppDispatch();
  const { products } = useAppSelector(state => state.eventSlice);
  const { nudgeForm } = useAppSelector(state => state.eventSlice);
  const { selectedApp } = useAppSelector(state => state.gameConfigForm);
  const [showAddProductModal, setShowAddProductModal] = React.useState(false);

  useEffect(() => {
    if (selectedApp) {
      dispatch(eventApiDispatchers.getCashProducts(selectedApp));
    }
  }, [selectedApp]);

  const addNewProduct = () => {
    setShowAddProductModal(true);
  };

  return (
    <div>
      <FormControl>
        <InputLabel htmlFor="event-nudge-field-subcategory">Sub-category</InputLabel>
        <Select
          input={
            <Input name="event-nudge-field-subcategory"
              id="event-nudge-field-subcategory" />
          }
          value={nudgeForm.additionalParams.subcategory.value}
          error={nudgeForm.additionalParams.subcategory.error !== ''}
          disabled={mutateMode === 'View'}
          onChange={(e: React.ChangeEvent<{ value: unknown }>) => {
            dispatch(setNudgeForm(produce(nudgeForm, draftForm => {
              draftForm.additionalParams.subcategory.value = e.target.value as ESubCategory;
            })));
            }
          }
        >
          {Object.keys(ESubCategory).map(subCat =>
            <MenuItem value={subCat} key={subCat}>{subCat}</MenuItem>)}
        </Select>
      </FormControl>
      {nudgeForm.additionalParams.subcategory.error !== '' &&
        <Alert>{nudgeForm.additionalParams.subcategory.error}</Alert>}

      <Autocomplete
        id="combo-box-productIds"
        options={products.productsList.map(p => p.readableId)}
        // getOptionLabel={product => product.readableId}
        value={nudgeForm.additionalParams.productIds.value.join(', ')}
        disabled={mutateMode === 'View'}
        onChange={(event, value, reason) => {
          if (value)
          dispatch(setNudgeForm(produce(nudgeForm, draftForm => {
            // assuming only 1 product ID will be present
            draftForm.additionalParams.productIds.value = [value];
          })));
        }}
        renderInput={(params) => <TextField {...params} label="Product IDs" />}
      />

      <Button
        variant="contained"
        color="primary"
        disabled={mutateMode === 'View'}
        onClick={addNewProduct}
        style={{ marginBottom: '2rem' }}
      >
        Add New Product
      </Button>

      {/* TODO: extraVCPercent */}

      <FormControl>
        <TextField
          id="event-nudge-field-extraRCPercent"
          label="Extra real cash percent"
          value={nudgeForm.additionalParams.extraRCPercent.value}
          error={nudgeForm.additionalParams.extraRCPercent.error !== ''}
          helperText={nudgeForm.additionalParams.extraRCPercent.error}
          type="number"
          disabled={mutateMode === 'View'}
          onChange={(e: React.ChangeEvent<{ value: unknown }>) => {
            dispatch(setNudgeForm(produce(nudgeForm, draftForm => {
              draftForm.additionalParams.extraRCPercent.value = e.target.value as number;
            })));
          }}
        />
      </FormControl>

      <FormControl>
        <TextField
          id="event-nudge-field-nudgeCountOnSessionChange"
          label="Count on session change"
          value={nudgeForm.additionalParams.nudgeCountOnSessionChange.value}
          error={nudgeForm.additionalParams.nudgeCountOnSessionChange.error !== ''}
          helperText={nudgeForm.additionalParams.nudgeCountOnSessionChange.error}
          type="number"
          disabled={mutateMode === 'View'}
          onChange={(e: React.ChangeEvent<{ value: unknown }>) => {
            dispatch(setNudgeForm(produce(nudgeForm, draftForm => {
              draftForm.additionalParams.nudgeCountOnSessionChange.value = e.target.value as number;
            })));
          }}
        />
      </FormControl>

      <FormControl>
        <TextField
          id="event-nudge-field-nudgeDisplayCount"
          label="Display count"
          value={nudgeForm.additionalParams.nudgeDisplayCount.value}
          error={nudgeForm.additionalParams.nudgeDisplayCount.error !== ''}
          helperText={nudgeForm.additionalParams.nudgeDisplayCount.error}
          type="number"
          disabled={mutateMode === 'View'}
          onChange={(e: React.ChangeEvent<{ value: unknown }>) => {
            dispatch(setNudgeForm(produce(nudgeForm, draftForm => {
              draftForm.additionalParams.nudgeDisplayCount.value = e.target.value as number;
            })));
          }}
        />
      </FormControl>

      <FormControl>
        <TextField
          id="event-nudge-field-nudgeCooldownDay"
          label="Cooldown day"
          value={nudgeForm.additionalParams.nudgeCooldownDay.value}
          error={nudgeForm.additionalParams.nudgeCooldownDay.error !== ''}
          helperText={nudgeForm.additionalParams.nudgeCooldownDay.error}
          type="number"
          disabled={mutateMode === 'View'}
          onChange={(e: React.ChangeEvent<{ value: unknown }>) => {
            dispatch(setNudgeForm(produce(nudgeForm, draftForm => {
              draftForm.additionalParams.nudgeCooldownDay.value = e.target.value as number;
            })));
          }}
        />
      </FormControl>

      <FormControl>
        <TextField
          id="event-nudge-field-nudgeCooldownHours"
          label="Cooldown hours"
          value={nudgeForm.additionalParams.nudgeCooldownHours.value}
          error={nudgeForm.additionalParams.nudgeCooldownHours.error !== ''}
          helperText={nudgeForm.additionalParams.nudgeCooldownHours.error}
          type="number"
          disabled={mutateMode === 'View'}
          onChange={(e: React.ChangeEvent<{ value: unknown }>) => {
            dispatch(setNudgeForm(produce(nudgeForm, draftForm => {
              draftForm.additionalParams.nudgeCooldownHours.value = e.target.value as number;
            })));
          }}
        />
      </FormControl>

      <FormControl>
        <TextField
          id="event-nudge-field-bgGradient"
          label="Background gradient"
          value={nudgeForm.additionalParams.bgGradient.value.join(', ')}
          error={nudgeForm.additionalParams.bgGradient.error !== ''}
          helperText={nudgeForm.additionalParams.bgGradient.error ||
            'enter comma separated values'}
          disabled={mutateMode === 'View'}
          onChange={(e: React.ChangeEvent<{ value: unknown }>) => {
            dispatch(setNudgeForm(produce(nudgeForm, draftForm => {
              draftForm.additionalParams.bgGradient.value = (e.target.value as string).split(',').map(s => s.trim());
            })));
          }}
        />
      </FormControl>

      {(nudgeForm.additionalParams.bgGradient.value.length === 2 &&
        nudgeForm.additionalParams.bgGradient.value[0].length === 7 &&
        nudgeForm.additionalParams.bgGradient.value[1].length === 7) &&
        <div
          style={{
            height: 100,
            backgroundImage: `linear-gradient(${nudgeForm.additionalParams.bgGradient.value[0]}, ${nudgeForm.additionalParams.bgGradient.value[1]})`,
            marginBottom: '2rem',
            color: '#fff',
            textShadow: '0 0 3px #000',
            fontWeight: 'bold',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            border: 'solid 1px #000',
          }}
        >
          Gradient Preview
          <small>(gradient direction might differ in app)</small>
        </div>
      }
      {(nudgeForm.additionalParams.bgGradient.value.length !== 2 ||
        nudgeForm.additionalParams.bgGradient.value[0].length !== 7 ||
        nudgeForm.additionalParams.bgGradient.value[1].length !== 7) &&
        <Alert severity="warning">Invalid background gradient colors.</Alert>
      }

      <FormControl>
        <TextField
          id="event-nudge-field-title"
          label="Title"
          value={nudgeForm.additionalParams.title.value}
          error={nudgeForm.additionalParams.title.error !== ''}
          helperText={nudgeForm.additionalParams.title.error}
          rowsMax={3}
          multiline
          disabled={mutateMode === 'View'}
          onChange={(e: React.ChangeEvent<{ value: unknown }>) => {
            dispatch(setNudgeForm(produce(nudgeForm, draftForm => {
              draftForm.additionalParams.title.value = e.target.value as string;
            })));
          }}
        />
      </FormControl>

      <FormControl>
        <TextField
          id="event-nudge-field-centerGraphicDimension-h"
          label="Center graphic height"
          value={nudgeForm.additionalParams.centerGraphicDimension.h.value}
          error={nudgeForm.additionalParams.centerGraphicDimension.h.error !== ''}
          helperText={nudgeForm.additionalParams.centerGraphicDimension.h.error}
          type="number"
          disabled={mutateMode === 'View'}
          onChange={(e: React.ChangeEvent<{ value: unknown }>) => {
            dispatch(setNudgeForm(produce(nudgeForm, draftForm => {
              draftForm.additionalParams.centerGraphicDimension.h.value = e.target.value as number;
            })));
          }}
        />
      </FormControl>

      <FormControl>
        <TextField
          id="event-nudge-field-centerGraphicDimension-w"
          label="Center graphic width"
          value={nudgeForm.additionalParams.centerGraphicDimension.w.value}
          error={nudgeForm.additionalParams.centerGraphicDimension.w.error !== ''}
          helperText={nudgeForm.additionalParams.centerGraphicDimension.w.error}
          type="number"
          disabled={mutateMode === 'View'}
          onChange={(e: React.ChangeEvent<{ value: unknown }>) => {
            dispatch(setNudgeForm(produce(nudgeForm, draftForm => {
              draftForm.additionalParams.centerGraphicDimension.w.value = e.target.value as number;
            })));
          }}
        />
      </FormControl>

      <FormControl>
        <TextField
          id="event-nudge-field-centerGraphicTexts"
          label="Center graphic texts"
          value={nudgeForm.additionalParams.centerGraphicTexts.value.join(', ')}
          error={nudgeForm.additionalParams.centerGraphicTexts.error !== ''}
          helperText={nudgeForm.additionalParams.centerGraphicTexts.error ||
            'enter comma separated values'}
          disabled={mutateMode === 'View'}
          onChange={(e: React.ChangeEvent<{ value: unknown }>) => {
            dispatch(setNudgeForm(produce(nudgeForm, draftForm => {
              draftForm.additionalParams.centerGraphicTexts.value = (e.target.value as string).split(',').map(s => s.trim());
            })));
          }}
        />
      </FormControl>

      <AddProduct
        open={showAddProductModal}
        onClose={() => setShowAddProductModal(false)}
        onOkClick={() => {}}
      />
    </div>
  );
}

export default NudgeFields;

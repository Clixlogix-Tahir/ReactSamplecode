export type TMutateModes = 'View' | 'Create' | 'Edit' | 'Clone';

export enum EVENT_URL_PARAMS {
  mode = 'mode',
  modeValue = 'view-only',
  view = 'view',
  type = 'type',
  startTime = 'startTime',
  endTime = 'endTime',
  placementPosition = 'placementPosition',
  placementPriority = 'placementPriority',
  dsiOperator = 'dsiOperator',
  dsiValue = 'dsiValue',
};

export type TValidationResonse = {
  isValid: boolean;
  errors: string[];
};

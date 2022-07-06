export type TFormFieldNumber = {
  value: number;
  error: string;
  required: boolean;
  [key: string]: number | string | boolean;
}

export type TFormFieldString = {
  value: string;
  error: string;
  required: boolean;
  [key: string]: string | boolean;
}

export type TFormFieldStringArray = {
  value: string[];
  error: string;
  required: boolean;
  [key: string]: string[] | string | boolean;
}


export type TFormFieldBoolean = {
  value: boolean;
  error: string;
  required: boolean;
  [key: string]: string | boolean;
}

export type TFormFieldNumberArray = {
  value: string;
  // pattern?: /$[0-9](,[0-9]*)^/ig; todo implement this
  error: string;
  required: boolean;
  [key: string]: number[] | string | boolean;
}

export type TFormFieldDate = {
  value: Date;
  error: string;
  required: boolean;
  [key: string]: Date | string | boolean;
}

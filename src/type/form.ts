import { HTMLInputTypeAttribute } from 'react';

export interface FormFields {
  [field: string]: string;
}

export type FieldElement = {
  inputName: string;
  inputLabel: string;
  inputType: HTMLInputTypeAttribute;
};

export interface FieldSet {
  fieldSetLabel: string;
  fields: FieldElement[];
}

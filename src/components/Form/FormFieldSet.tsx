import React from 'react';
import { FormFields, FieldElement } from 'type/form';
import FormInput from './FormInput';

interface FormFieldSetProps {
  fieldSetLabel: string;
  fields: FieldElement[];
  inputValues: FormFields | Record<string, never>;
  errorMess: FormFields;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const FormFieldSet: React.FC<FormFieldSetProps> = ({
  fieldSetLabel,
  fields,
  inputValues,
  errorMess,
  handleChange,
}) => {
  const chunk = [];
  const newFields = ([] as FieldElement[]).concat(...fields);

  while (newFields.length) {
    chunk.push(newFields.splice(0, 2));
  }
  return (
    <fieldset className="row container">
      <legend>{fieldSetLabel}</legend>
      {chunk.map((row, rowIndex) => (
        <div className="row mb-3" key={rowIndex}>
          {row.map((val, colIndex) => (
            <FormInput
              {...val}
              key={`${rowIndex}-${colIndex}`}
              inputValue={(inputValues as FormFields)[val.inputName]}
              inputError={errorMess[val.inputName]}
              handleChange={handleChange}
            />
          ))}
        </div>
      ))}
    </fieldset>
  );
};

export default FormFieldSet;

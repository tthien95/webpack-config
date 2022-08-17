import React from 'react';

interface FormInputProps {
  inputName: string;
  inputLabel: string;
  inputValue: string;
  inputType: string;
  inputError: string;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const FormInput: React.FC<FormInputProps> = ({
  inputName,
  inputLabel,
  inputValue,
  inputType = 'text',
  inputError,
  handleChange,
}) => (
  <div className="col-6">
    <label htmlFor={inputName} className="form-label">
      {inputLabel}
    </label>
    <input
      type={inputType}
      className="form-control"
      id={inputName}
      name={inputName}
      value={inputValue}
      onChange={handleChange}
    />
    {inputError && <p className="error">{inputError}</p>}
  </div>
);

export default FormInput;

export interface ValRes {
  isValid: boolean;
  message: string;
}
export interface Validations {
  [validatedField: string]: {
    required: boolean;
    validator: string | null;
  };
}

const validators: {
  [validateFunc: string]: (value: string) => ValRes;
} = {
  validateEmail: (value: string) => ({
    isValid:
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(
        value
      ),
    message: 'Invalid email format',
  }),

  validatePhone: (value: string) => ({
    isValid:
      /^\+?([0-9]{2})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/.test(
        value
      ),
    message:
      'Invalid phone number. Must contain + followed by country code and 10 digits phone number',
  }),
  validateNoSpecialChar: (value: string) => ({
    isValid: /^[A-Za-z]*$/.test(value),
    message: 'Must contains only alphabet characters',
  }),
};

export default validators;

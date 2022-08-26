import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { AxiosError, AxiosResponse } from 'axios';
import { FormFields } from '@type/form';
import { User } from '@type/user';
import { get } from '@utils/api-helper';
import validators, { Validations } from '@utils/validation';
import { toastActions } from '@store/toast-slice';

interface UseFromProps {
  initialValues: FormFields | Record<string, never>;
  userId: string | undefined;
  validations: Validations;
  onSubmit: () => Promise<void>;
}

const useForm = ({
  initialValues = {},
  userId = '',
  validations,
  onSubmit,
}: UseFromProps) => {
  const [data, setData] = useState(initialValues);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<FormFields>({});
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const fnHandleError = useCallback(
    ({ response }: AxiosError<{ message: string }>, customMess = '') => {
      dispatch(
        toastActions.showNotification({
          status: 'error',
          title: 'Error',
          message:
            customMess ||
            response?.data?.message ||
            response?.statusText ||
            'There is something wrong happended while fetching data',
        })
      );
      navigate('/');
    },
    [dispatch, navigate]
  );

  useEffect(() => {
    if (userId) {
      setLoading(true);
      const fnHandleSuccess = (res: AxiosResponse<User>) => {
        const { firstName, lastName, birthDate, email, phone } = res.data;
        setData({
          firstName,
          lastName,
          birthDate,
          email,
          phone,
        });
      };

      get(`/users/${userId}`)
        .then(fnHandleSuccess, fnHandleError)
        .finally(() => {
          setLoading(false);
        });
    } else {
      const initData = initialValues;
      setData({
        ...initData,
      });
    }
  }, [userId, initialValues, dispatch, navigate, fnHandleError]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event?.target?.name) {
      setData((prevData) => ({
        ...prevData,
        [event?.target?.name]: event?.target?.value,
      }));
    } else {
      // eslint-disable-next-line no-console
      console.error('Please set name attribute for this input');
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (validations && typeof validations === 'object') {
      let valid = true;
      const newError: FormFields = {};

      // eslint-disable-next-line no-restricted-syntax
      for (const key in validations) {
        if (Object.hasOwnProperty.call(validations, key)) {
          const validation = validations[key];
          const value = (data as FormFields)[key];

          if (validation.required && !value) {
            valid = false;
            newError[key] = 'This field cannot be empty';
          }

          if (!newError[key] && value && validation.validator) {
            const { isValid, message } =
              validators[validation.validator](value);
            valid = isValid;
            if (!isValid) {
              newError[key] = message;
            }
          }
        }
      }

      if (!valid) {
        setError(newError);
        return;
      }
    }

    setError({});

    if (onSubmit) {
      setLoading(true);
      onSubmit().finally(() => {
        setLoading(false);
      });
    }
  };

  return {
    data,
    loading,
    error,
    handleChange,
    handleSubmit,
  };
};

export default useForm;

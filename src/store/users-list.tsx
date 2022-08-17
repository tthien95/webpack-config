/* eslint-disable @typescript-eslint/no-empty-function */
import React, { useState, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { AxiosError } from 'axios';
import { toastActions } from './toast-slice';
import { User, UsersListContextType } from '../type/user';

const UsersListContext = React.createContext<UsersListContextType>({
  usersList: [],
  setUsersList: () => {},
  isLoading: false,
  addUser: () => {},
  updateUser: () => {},
  deleteUser: () => {},
  setIsLoading: () => {},
  fnHandleError: () => {},
});

export const UserContextProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const [usersList, setUsersList] = useState<User[] | []>([]);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();

  const fnHandleError = useCallback(
    ({ response }: AxiosError<{ message: string }>) => {
      dispatch(
        toastActions.showNotification({
          status: 'error',
          title: 'Error',
          message:
            response?.data.message ||
            response?.statusText ||
            'There is something wrong happended while fetching data',
        })
      );
    },
    [dispatch]
  );

  const addUser = (value: User) => {
    const currUsersList = [...usersList];
    currUsersList.unshift(value);
    setUsersList(currUsersList);
  };

  const updateUser = (value: User) => {
    const currUsersList = [...usersList];
    // eslint-disable-next-line eqeqeq
    const userIndx = currUsersList.findIndex(({ id }) => id == value.id);
    if (userIndx > -1) {
      currUsersList.splice(userIndx, 1, value);
      setUsersList(currUsersList);
    }
  };

  const deleteUser = (userId: string) => {
    const currUsersList = [...usersList];
    // eslint-disable-next-line eqeqeq
    const userIndx = currUsersList.findIndex(({ id }) => id == userId);
    if (userIndx > -1) {
      currUsersList.splice(userIndx, 1);
      setUsersList(currUsersList);
    }
  };

  return (
    <UsersListContext.Provider
      value={{
        usersList,
        setUsersList,
        addUser,
        updateUser,
        deleteUser,
        isLoading,
        setIsLoading,
        fnHandleError,
      }}
    >
      {children}
    </UsersListContext.Provider>
  );
};

export default UsersListContext;

import {
  cleanup,
  render,
  waitForElementToBeRemoved,
  screen,
  waitFor,
  fireEvent,
} from '@testing-library/react';
import { useSelector, useDispatch, Provider } from 'react-redux';
// import { act, Simulate } from 'react-dom/test-utils';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

import UserForm from '../components/Form/UserForm';
import store from '../store/index';
import { toastActions } from '../store/toast-slice';
import UsersListContext from '../store/users-list';
import { baseUrl } from '../utils/api-helper';
import { User } from '../type/user';
import { FormFields } from '../type/form';

const sampleUser: User = {
  id: 1,
  firstName: 'Terry',
  lastName: 'Medhurst',
  birthDate: '2000-12-25',
  email: 'atuny0@sohu.com',
  phone: '+63 791 675 8914',
  image: '',
};

const fields: FormFields = {
  firstName: 'First Name',
  lastName: 'Last Name',
  birthDate: 'Birth Date',
  email: 'Email address',
  phone: 'Phone',
};

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useSelector: jest.fn(),
  useDispatch: jest.fn(),
}));

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
  useParams: jest.fn(),
}));

jest.mock('axios');

const wrapperRender = ({
  updateUser = () => {},
  addUser = () => {},
  fnHandleError = () => {},
} = {}) =>
  render(
    <Provider store={store}>
      <UsersListContext.Provider
        value={{
          updateUser,
          addUser,
          fnHandleError,
          usersList: [],
          setUsersList: () => {},
          isLoading: false,
          setIsLoading: () => {},
          deleteUser: () => {},
        }}
      >
        <UserForm />
      </UsersListContext.Provider>
    </Provider>
  );

describe('UserForm', () => {
  afterAll(cleanup);

  beforeEach(() => {
    (useDispatch as jest.Mock).mockReturnValue(() => {});
    (useNavigate as jest.Mock).mockReturnValue(() => {});
    (useSelector as jest.Mock).mockReturnValue(() => {});
  });

  it('should display empty form for new user', () => {
    (useParams as jest.Mock).mockReturnValue({ userId: null });

    const { container } = wrapperRender();

    expect(container).toMatchSnapshot();
  });

  it('should display form with user information for edit', async () => {
    (useParams as jest.Mock).mockReturnValue({ userId: '1' });
    (axios.get as jest.Mock).mockResolvedValue({
      data: { ...sampleUser },
    });

    const { container } = wrapperRender();
    await waitForElementToBeRemoved(() => screen.queryByRole('status'));
    expect(axios.get).toBeCalled();
    expect(axios.get).toBeCalledWith(`${baseUrl}/users/${sampleUser.id}`);

    expect(container).toMatchSnapshot();
  });

  it('should submit add user form with correct inputs', async () => {
    const testData: FormFields = {
      firstName: 'abc',
      lastName: 'def',
      birthDate: '2000-12-25',
      email: 'abc@def.com',
      phone: '+63 791 675 8914',
    };
    (useParams as jest.Mock).mockReturnValue({ userId: null });

    const dispatch = jest.fn();

    const navigate = jest.fn();
    const addUser = jest.fn();

    (useDispatch as jest.Mock).mockReturnValue(dispatch);
    (useNavigate as jest.Mock).mockReturnValue(navigate);
    (axios.post as jest.Mock).mockResolvedValue({
      data: {
        id: 1,
        ...testData,
      },
    });

    wrapperRender({ addUser });

    Object.keys(fields).forEach((key) => {
      const element = fields[key];
      fireEvent.change(screen.getByLabelText(element), {
        target: { value: testData[key] },
      });
    });

    fireEvent.click(screen.getByRole('button'));

    expect(axios.post).toBeCalled();
    expect(axios.post).toBeCalledWith(`${baseUrl}/users/add`, testData);
    await waitFor(() => expect(addUser).toBeCalled());
    expect(dispatch).toBeCalled();
    expect(dispatch).toBeCalledWith(
      toastActions.showNotification({
        status: 'success',
        title: 'Success',
        message: 'Add request has been sent successfully',
      })
    );
    expect(navigate).toBeCalled();
    expect(navigate).toBeCalledWith('/');
  });

  it('should submit edit request when inputs are all correct', async () => {
    (useParams as jest.Mock).mockReturnValue({ userId: '1' });

    const newInput: Record<string, string | number> = {
      ...sampleUser,
      firstName: 'Ter',
      lastName: 'Med',
    };

    const dispatch = jest.fn();

    const navigate = jest.fn();
    const updateUser = jest.fn();

    (axios.get as jest.Mock).mockResolvedValue({
      data: { ...sampleUser },
    });

    (axios.put as jest.Mock).mockResolvedValue({
      data: { ...newInput },
    });

    (useDispatch as jest.Mock).mockReturnValue(dispatch);
    (useNavigate as jest.Mock).mockReturnValue(navigate);

    delete newInput.id;
    delete newInput.image;

    wrapperRender({ updateUser });
    await waitForElementToBeRemoved(() => screen.queryByRole('status'));
    expect(axios.get).toBeCalled();
    expect(axios.get).toBeCalledWith(`${baseUrl}/users/${sampleUser.id}`);

    fireEvent.change(screen.getByLabelText('First Name'), {
      target: { value: newInput.firstName },
    });

    fireEvent.change(screen.getByLabelText('Last Name'), {
      target: { value: newInput.lastName },
    });

    fireEvent.click(screen.getByRole('button'));

    expect(axios.put).toBeCalled();
    expect(axios.put).toBeCalledWith(
      `${baseUrl}/users/${sampleUser.id}`,
      newInput
    );
    await waitFor(() => expect(updateUser).toBeCalled());
    expect(dispatch).toBeCalled();
    expect(dispatch).toBeCalledWith(
      toastActions.showNotification({
        status: 'success',
        title: 'Success',
        message: 'Update request has been sent successfully',
      })
    );
    expect(navigate).toBeCalled();
    expect(navigate).toBeCalledWith('/');
  });

  it('should show error messages for wrong inputs', () => {
    const testData: Record<string, string> = {
      firstName: '',
      lastName: '',
      birthDate: '',
      email: 'abc',
      phone: '638914',
    };

    (useParams as jest.Mock).mockReturnValue({ userId: null });

    const { container } = wrapperRender();

    Object.keys(fields).forEach((key) => {
      const element = fields[key];
      fireEvent.change(screen.getByLabelText(element), {
        target: { value: testData[key] },
      });
    });

    fireEvent.click(screen.getByRole('button'));

    expect(container).toMatchSnapshot();
    expect(axios.post).not.toBeCalled();
  });

  it('should show error and redirect to home', async () => {
    (useParams as jest.Mock).mockReturnValue({ userId: '11241515' });

    (axios.get as jest.Mock).mockRejectedValue({
      response: {
        statusText: 'Error message',
      },
    });

    const dispatch = jest.fn();
    const navigate = jest.fn();

    (useDispatch as jest.Mock).mockReturnValue(dispatch);
    (useNavigate as jest.Mock).mockReturnValue(navigate);

    wrapperRender();
    await waitForElementToBeRemoved(() => screen.queryByRole('status'));
    expect(axios.get).toBeCalled();
    expect(axios.get).toBeCalledWith(`${baseUrl}/users/11241515`);

    expect(dispatch).toBeCalled();
    expect(dispatch).toBeCalledWith(
      toastActions.showNotification({
        status: 'error',
        title: 'Error',
        message: 'Error message',
      })
    );
    expect(navigate).toBeCalled();
    expect(navigate).toBeCalledWith('/');
  });
});

import {
  cleanup,
  render,
  waitForElementToBeRemoved,
  screen,
  waitFor
} from '@testing-library/react';
import UserForm from '../components/Form/UserForm';

import { useSelector, useDispatch, Provider } from 'react-redux';
import store from '../store/index';
import { act, Simulate } from 'react-dom/test-utils';
import { toastActions } from '../store/toast-slice';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import UsersListContext from '../store/users-list';
import { baseUrl } from '../utils/api-helper';
import userEvent from '@testing-library/user-event';

const sampleUser = {
  id: 1,
  firstName: 'Terry',
  lastName: 'Medhurst',
  birthDate: '2000-12-25',
  email: 'atuny0@sohu.com',
  phone: '+63 791 675 8914'
};

const fields = {
  firstName: 'First Name',
  lastName: 'Last Name',
  birthDate: 'Birth Date',
  email: 'Email address',
  phone: 'Phone'
};

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useSelector: jest.fn(),
  useDispatch: jest.fn()
}));

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
  useParams: jest.fn()
}));

jest.mock('axios');

const wrapperRender = ({
  updateUser = () => {},
  addUser = () => {},
  fnHandleError = () => {}
} = {}) => {
  return render(
    <Provider store={store}>
      <UsersListContext.Provider value={{ updateUser, addUser, fnHandleError }}>
        <UserForm />
      </UsersListContext.Provider>
    </Provider>
  );
};

describe('UserForm', () => {
  afterAll(cleanup);

  beforeEach(() => {
    useDispatch.mockReturnValue(() => {});
    useNavigate.mockReturnValue(() => {});
    useSelector.mockReturnValue(() => {});
  });

  it('should display empty form for new user', () => {
    useParams.mockReturnValue({ userId: null });

    const { container } = wrapperRender();

    expect(container).toMatchSnapshot();
  });

  it('should display form with user information for edit', async () => {
    useParams.mockReturnValue({ userId: '1' });
    axios.get.mockResolvedValue({
      data: { ...sampleUser }
    });

    const { container } = wrapperRender();
    await waitForElementToBeRemoved(() => screen.queryByRole('status'));
    expect(axios.get).toBeCalled();
    expect(axios.get).toBeCalledWith(`${baseUrl}/users/${sampleUser.id}`);

    expect(container).toMatchSnapshot();
  });

  it('should submit add user form with correct inputs', async () => {
    const testData = {
      firstName: 'abc',
      lastName: 'def',
      birthDate: '2000-12-25',
      email: 'abc@def.com',
      phone: '+63 791 675 8914'
    };
    useParams.mockReturnValue({ userId: null });

    const dispatch = jest.fn();

    const navigate = jest.fn();
    const addUser = jest.fn();

    useDispatch.mockReturnValue(dispatch);
    useNavigate.mockReturnValue(navigate);
    axios.post.mockResolvedValue({
      data: {
        id: 1,
        ...testData
      }
    });

    wrapperRender({ addUser });

    for (const key in fields) {
      if (Object.hasOwnProperty.call(fields, key)) {
        const element = fields[key];
        userEvent.type(screen.getByLabelText(element), testData[key]);
      }
    }

    userEvent.click(screen.getByRole('button'));

    expect(axios.post).toBeCalled();
    expect(axios.post).toBeCalledWith(`${baseUrl}/users/add`, testData);
    await waitFor(() => expect(addUser).toBeCalled());
    expect(dispatch).toBeCalled();
    expect(dispatch).toBeCalledWith(
      toastActions.showNotification({
        status: 'success',
        title: 'Success',
        message: 'Add request has been sent successfully'
      })
    );
    expect(navigate).toBeCalled();
    expect(navigate).toBeCalledWith('/');
  });

  it('should submit edit request when inputs are all correct', async () => {
    useParams.mockReturnValue({ userId: '1' });

    const newInput = {
      ...sampleUser,
      firstName: 'Ter',
      lastName: 'Med'
    };

    const dispatch = jest.fn();

    const navigate = jest.fn();
    const updateUser = jest.fn();

    axios.get.mockResolvedValue({
      data: { ...sampleUser }
    });

    axios.put.mockResolvedValue({
      data: { ...newInput }
    });

    useDispatch.mockReturnValue(dispatch);
    useNavigate.mockReturnValue(navigate);

    delete newInput.id;

    wrapperRender({ updateUser });
    await waitForElementToBeRemoved(() => screen.queryByRole('status'));
    expect(axios.get).toBeCalled();
    expect(axios.get).toBeCalledWith(`${baseUrl}/users/${sampleUser.id}`);

    act(() => {
      Simulate.change(screen.getByLabelText('First Name'), {
        target: { value: newInput.firstName, name: 'firstName' }
      });

      Simulate.change(screen.getByLabelText('Last Name'), {
        target: { value: newInput.lastName, name: 'lastName' }
      });
    });

    userEvent.click(screen.getByRole('button'));

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
        message: 'Update request has been sent successfully'
      })
    );
    expect(navigate).toBeCalled();
    expect(navigate).toBeCalledWith('/');
  });

  it('should show error messages for wrong inputs', () => {
    const testData = {
      firstName: '',
      lastName: '',
      birthDate: '',
      email: 'abc',
      phone: '638914'
    };

    useParams.mockReturnValue({ userId: null });

    const { container } = wrapperRender();

    act(() => {
      for (const key in fields) {
        if (Object.hasOwnProperty.call(fields, key)) {
          const element = fields[key];
          Simulate.change(screen.getByLabelText(element), {
            target: { value: testData[key], name: key }
          });
        }
      }
    });

    userEvent.click(screen.getByRole('button'));

    expect(container).toMatchSnapshot();
    expect(axios.post).not.toBeCalled();
  });

  it('should show error and redirect to home', async () => {
    useParams.mockReturnValue({ userId: '11241515' });

    axios.get.mockRejectedValue({
      response: {
        statusText: 'Error message'
      }
    });

    const dispatch = jest.fn();
    const navigate = jest.fn();

    useDispatch.mockReturnValue(dispatch);
    useNavigate.mockReturnValue(navigate);

    wrapperRender();
    await waitForElementToBeRemoved(() => screen.queryByRole('status'));
    expect(axios.get).toBeCalled();
    expect(axios.get).toBeCalledWith(`${baseUrl}/users/11241515`);

    expect(dispatch).toBeCalled();
    expect(dispatch).toBeCalledWith(
      toastActions.showNotification({
        status: 'error',
        title: 'Error',
        message: 'Error message'
      })
    );
    expect(navigate).toBeCalled();
    expect(navigate).toBeCalledWith('/');
  });

  it('should handle error in success callback', async () => {
    useParams.mockReturnValue({ userId: '1' });
    axios.get.mockResolvedValue({
      message: 'Error message'
    });

    const dispatch = jest.fn();
    const navigate = jest.fn();

    useDispatch.mockReturnValue(dispatch);
    useNavigate.mockReturnValue(navigate);

    wrapperRender();
    await waitForElementToBeRemoved(() => screen.queryByRole('status'));
    expect(axios.get).toBeCalled();
    expect(axios.get).toBeCalledWith(`${baseUrl}/users/1`);

    expect(dispatch).toBeCalled();
    expect(dispatch).toBeCalledWith(
      toastActions.showNotification({
        status: 'error',
        title: 'Error',
        message: 'Error message'
      })
    );
    expect(navigate).toBeCalled();
    expect(navigate).toBeCalledWith('/');
  });
});

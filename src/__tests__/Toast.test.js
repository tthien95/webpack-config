import { cleanup, render, waitFor, within } from '@testing-library/react';
import Toast from '../components/Toast/Toast';

import { useSelector, useDispatch, Provider } from 'react-redux';
import { createPortal } from 'react-dom';
import store from '../store/index';
import { toastActions } from '../store/toast-slice';
import userEvent from '@testing-library/user-event';

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useSelector: jest.fn(),
  useDispatch: jest.fn()
}));

jest.mock('react-dom', () => ({
  ...jest.requireActual('react-dom'),
  createPortal: jest.fn()
}));

const renderWithProvider = () => {
  return render(
    <Provider store={store}>
      <Toast />
    </Provider>
  );
};

describe('Navigation', () => {
  beforeEach(() => {
    useDispatch.mockReturnValue(() => {});
    createPortal.mockImplementation((component) => component);
  });
  afterAll(cleanup);

  it('should match snapshot for success', () => {
    useSelector.mockReturnValueOnce({
      status: 'success',
      title: 'Success',
      message: 'Success Message'
    });
    const { container } = renderWithProvider();
    expect(within(container).getByRole('alert')).toMatchSnapshot();
  });

  it('should match snapshot for error', () => {
    useSelector.mockReturnValueOnce({
      status: 'error',
      title: 'error',
      message: 'Error Message'
    });
    const { container } = renderWithProvider();
    expect(within(container).getByRole('alert')).toMatchSnapshot();
  });

  it('should not render toast when there is no notification', () => {
    useSelector.mockReturnValueOnce(null);
    const { container } = renderWithProvider();
    expect(within(container).queryByRole('alert')).not.toBeInTheDocument();
  });

  it('should trigger handler to close notification when press X button', () => {
    useSelector.mockReturnValueOnce({
      status: 'success',
      title: 'Success',
      message: 'Success Message'
    });

    const dispatch = jest.fn();

    useDispatch.mockReturnValueOnce(dispatch);

    const { container } = renderWithProvider();
    const noti = within(container).queryByRole('alert');
    const button = within(noti).getByRole('button');

    userEvent.click(button)

    expect(dispatch).toBeCalledTimes(1);
    expect(dispatch).toBeCalledWith(toastActions.hideNotification());
  });

  it('should trigger handler to close notification after 3 seconds', async () => {
    useSelector.mockReturnValueOnce({
      status: 'success',
      title: 'Success',
      message: 'Success Message'
    });

    const dispatch = jest.fn();

    useDispatch.mockReturnValueOnce(dispatch);

    renderWithProvider();

    await waitFor(() => expect(dispatch).toHaveBeenCalledTimes(1), {
      timeout: 3100
    });

    expect(dispatch).toBeCalledWith(toastActions.hideNotification());
  });
});

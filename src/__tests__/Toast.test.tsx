import { cleanup, fireEvent, render, within } from '@testing-library/react';
import { useSelector, useDispatch, Provider } from 'react-redux';
import { createPortal } from 'react-dom';

import Toast from '../components/Toast/Toast';
import store from '../store/index';
import { toastActions } from '../store/toast-slice';

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useSelector: jest.fn(),
  useDispatch: jest.fn(),
}));

jest.mock('react-dom', () => ({
  ...jest.requireActual('react-dom'),
  createPortal: jest.fn(),
}));

const renderWithProvider = () =>
  render(
    <Provider store={store}>
      <Toast />
    </Provider>
  );

describe('Toast', () => {
  beforeEach(() => {
    (useDispatch as jest.Mock).mockReturnValue(() => {});
    (createPortal as jest.Mock).mockImplementation((component) => component);
  });
  afterAll(cleanup);

  it('should match snapshot for success', () => {
    (useSelector as jest.Mock).mockReturnValueOnce({
      status: 'success',
      title: 'Success',
      message: 'Success Message',
    });
    const { container } = renderWithProvider();
    expect(within(container).getByRole('alert')).toMatchSnapshot();
  });

  it('should match snapshot for error', () => {
    (useSelector as jest.Mock).mockReturnValueOnce({
      status: 'error',
      title: 'error',
      message: 'Error Message',
    });
    const { container } = renderWithProvider();
    expect(within(container).getByRole('alert')).toMatchSnapshot();
  });

  it('should not render toast when there is no notification', () => {
    (useSelector as jest.Mock).mockReturnValueOnce(null);
    const { container } = renderWithProvider();
    expect(within(container).queryByRole('alert')).not.toBeInTheDocument();
  });

  it('should trigger handler to close notification when press X button', () => {
    (useSelector as jest.Mock).mockReturnValueOnce({
      status: 'success',
      title: 'Success',
      message: 'Success Message',
    });

    const dispatch = jest.fn();

    (useDispatch as jest.Mock).mockReturnValueOnce(dispatch);

    const { container } = renderWithProvider();
    const noti = within(container).queryByRole('alert');
    const button = within(noti!).getByRole('button');

    fireEvent.click(button);

    expect(dispatch).toBeCalledTimes(1);
    expect(dispatch).toBeCalledWith(toastActions.hideNotification());
  });

  it('should trigger handler to close notification after 3 seconds', async () => {
    jest.useFakeTimers();

    (useSelector as jest.Mock).mockReturnValueOnce({
      status: 'success',
      title: 'Success',
      message: 'Success Message',
    });

    const dispatch = jest.fn();

    (useDispatch as jest.Mock).mockReturnValueOnce(dispatch);

    renderWithProvider();

    jest.advanceTimersByTime(3100);

    expect(dispatch).toHaveBeenCalledTimes(1);
    expect(dispatch).toBeCalledWith(toastActions.hideNotification());
  });
});

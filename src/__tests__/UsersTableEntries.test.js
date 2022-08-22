import { screen, render, cleanup, within, waitFor } from '@testing-library/react';
import UsersListContext from '../store/users-list';
import UsersTableEntries from '../components/Table/UsersTableEntries';
import { Provider } from 'react-redux';
import store from '../store/index';
import { BrowserRouter } from 'react-router-dom';
import axios from 'axios';
import userEvent from '@testing-library/user-event';

jest.mock('axios');

const sampleUsers = [
  {
    id: 1,
    firstName: 'Terry',
    lastName: 'Medhurst',
    birthDate: '2000-12-25',
    email: 'atuny0@sohu.com',
    phone: '+63 791 675 8914'
  },
  {
    id: 2,
    firstName: 'Sheldon',
    lastName: 'Quigley',
    birthDate: '2003-08-02',
    email: 'hbingley1@plala.or.jp',
    phone: '+07 813 117 7139'
  }
];

const renderWithContext = ({
  setIsLoading = () => {},
  deleteUser = () => {},
  isLoading = false,
  usersList = [],
  fnHandleError = () => {}
}) => {
  return render(
    <BrowserRouter>
      <Provider store={store}>
        <UsersListContext.Provider
          value={{
            isLoading,
            deleteUser,
            setIsLoading,
            fnHandleError
          }}
        >
          <table>
            <tbody>
              <UsersTableEntries usersData={usersList} />
            </tbody>
          </table>
        </UsersListContext.Provider>
      </Provider>
    </BrowserRouter>
  );
};

describe('UsersTableEntries', () => {
  afterAll(cleanup);

  it('should show spinner when loading status is true', () => {
    renderWithContext({ isLoading: true });

    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('should show message when there is no data', () => {
    renderWithContext({ isLoading: false, usersList: [] });

    expect(screen.getByTestId('nodata')).toBeInTheDocument();
  });

  it('should show users data', () => {
    renderWithContext({ isLoading: false, usersList: sampleUsers });

    const allRows = screen.getAllByRole('row');
    expect(allRows).toHaveLength(2);

    const firstRow = allRows[0];
    expect(within(firstRow).getByRole('rowheader')).toBeInTheDocument();
    expect(within(firstRow).getAllByRole('cell')).toHaveLength(7);
  });

  it('should have action buttons for each rows', () => {
    const user = [
      {
        ...sampleUsers[0]
      }
    ];

    renderWithContext({ isLoading: false, usersList: user });
    const lastCell = within(screen.getAllByRole('row')[0]).getAllByRole(
      'cell'
    )[6];
    expect(within(lastCell).getByText('Edit')).toBeInTheDocument();
    expect(within(lastCell).getByText('Delete')).toBeInTheDocument();
  });

  it('should delete button trigger event', async () => {
    const user = [
      {
        ...sampleUsers[0]
      }
    ];

    axios.delete.mockResolvedValue('ok');

    const setIsLoading = jest.fn();
    const deleteUser = jest.fn()

    renderWithContext({ isLoading: false, usersList: user, setIsLoading, deleteUser });
    const lastCell = within(screen.getAllByRole('row')[0]).getAllByRole(
      'cell'
    )[6];

    const button = within(lastCell).getByText('Delete');
    userEvent.click(button)

    await waitFor(() => expect(setIsLoading).toHaveBeenCalledTimes(2));

    expect(deleteUser).toBeCalledTimes(1);
    expect(deleteUser).toBeCalledWith(sampleUsers[0].id);

    expect(setIsLoading.mock.calls[0][0]).toBeTruthy();
    expect(setIsLoading.mock.calls[1][0]).toBeFalsy();
    
  });
});

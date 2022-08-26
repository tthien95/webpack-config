import {
  render,
  screen,
  cleanup,
  within,
  fireEvent,
  waitForElementToBeRemoved,
} from '@test_utils/custom_query';
import { Provider } from 'react-redux';
import axios from 'axios';
import { BrowserRouter as Router } from 'react-router-dom';
import { baseUrl } from '@utils/api-helper';
import UsersTable from '../components/Table/UsersTable';
import { UserContextProvider } from '../store/users-list';
import store from '../store/index';
import { User } from '../type/user';

jest.mock('axios');

const sampleUsers: User[] = [
  {
    id: '1',
    firstName: 'Terry',
    lastName: 'Medhurst',
    birthDate: '2000-12-25',
    email: 'atuny0@sohu.com',
    phone: '+63 791 675 8914',
    image: '',
  },
  {
    id: '2',
    firstName: 'Sheldon',
    lastName: 'Quigley',
    birthDate: '2003-08-02',
    email: 'hbingley1@plala.or.jp',
    phone: '+07 813 117 7139',
    image: '',
  },
];

const renderWithContext = () =>
  render(
    <Router>
      <Provider store={store}>
        <UserContextProvider>
          <UsersTable />
        </UserContextProvider>
      </Provider>
    </Router>
  );

describe('UsersTable', () => {
  afterAll(cleanup);

  describe('when there is no data', () => {
    beforeEach(() => {
      (axios.get as jest.Mock).mockResolvedValue({
        data: {
          users: [],
        },
      });
    });

    it('should render table with no data message', async () => {
      const { getByRowgroupType } = renderWithContext();

      expect(screen.getByText(/loading/i)).toBeInTheDocument();
      expect(axios.get).toHaveBeenCalled();

      expect(axios.get).toHaveBeenCalledWith(`${baseUrl}/users`);

      await waitForElementToBeRemoved(() => screen.queryByText(/loading/i));

      const header = getByRowgroupType('thead');
      expect(within(header).getAllByRole('columnheader')).toHaveLength(8);

      expect(screen.getByText(/No Data/i)).toBeInTheDocument();
    });
  });

  describe('when there are data', () => {
    beforeEach(() => {
      (axios.get as jest.Mock).mockResolvedValue({
        data: {
          users: [...sampleUsers],
        },
      });
    });

    it('should render table with matching data', async () => {
      const {
        getByRowgroupType,
        getAllRowsByRowgroupType,
        getRowByFirstCellText,
        getCellByRowAndColumnHeaders,
      } = renderWithContext();

      expect(screen.getByText(/loading/i)).toBeInTheDocument();
      expect(axios.get).toHaveBeenCalled();

      expect(axios.get).toHaveBeenCalledWith(`${baseUrl}/users`);

      await waitForElementToBeRemoved(() => screen.queryByText(/loading/i));

      const header = getByRowgroupType('thead');
      expect(within(header).getAllByRole('columnheader')).toHaveLength(8);

      expect(getAllRowsByRowgroupType('tbody')).toHaveLength(
        sampleUsers.length
      );

      const dateFormat = new Intl.DateTimeFormat(undefined, {
        dateStyle: 'long',
      });

      sampleUsers.forEach((user) => {
        const { id, firstName, lastName, birthDate, email, phone } = user;
        const stringId = id as string;

        expect(getRowByFirstCellText(stringId)).toBeVisible();
        expect(
          getCellByRowAndColumnHeaders(stringId, 'First Name', undefined)
        ).toHaveTextContent(firstName);
        expect(
          getCellByRowAndColumnHeaders(stringId, 'Last Name', undefined)
        ).toHaveTextContent(lastName);
        expect(
          getCellByRowAndColumnHeaders(stringId, 'Birth Date', undefined)
        ).toHaveTextContent(dateFormat.format(new Date(birthDate)));
        expect(
          getCellByRowAndColumnHeaders(stringId, 'Email', undefined)
        ).toHaveTextContent(email);
        expect(
          getCellByRowAndColumnHeaders(stringId, 'Phone', undefined)
        ).toHaveTextContent(phone);
      });
    });

    it('should remove user after pressing Delete', async () => {
      const {
        getAllRowsByRowgroupType,
        getRowByFirstCellText,
        getCellByRowAndColumnHeaders,
      } = renderWithContext();

      expect(screen.getByText(/loading/i)).toBeInTheDocument();

      await waitForElementToBeRemoved(() => screen.queryByText(/loading/i));

      expect(getAllRowsByRowgroupType('tbody')).toHaveLength(
        sampleUsers.length
      );

      const firstRow = getRowByFirstCellText(sampleUsers[0].id as string);

      expect(firstRow).toBeVisible();

      (axios.delete as jest.Mock).mockResolvedValue('ok');

      fireEvent.click(within(firstRow).getByText('Delete'));

      await waitForElementToBeRemoved(() => screen.queryByText(/loading/i));

      expect(getAllRowsByRowgroupType('tbody')).toHaveLength(
        sampleUsers.length - 1
      );

      const { id, firstName, lastName, birthDate, email, phone } =
        sampleUsers[1];
      const stringId = id as string;

      const dateFormat = new Intl.DateTimeFormat(undefined, {
        dateStyle: 'long',
      });

      expect(getRowByFirstCellText(stringId)).toBeVisible();
      expect(
        getCellByRowAndColumnHeaders(stringId, 'First Name', undefined)
      ).toHaveTextContent(firstName);
      expect(
        getCellByRowAndColumnHeaders(stringId, 'Last Name', undefined)
      ).toHaveTextContent(lastName);
      expect(
        getCellByRowAndColumnHeaders(stringId, 'Birth Date', undefined)
      ).toHaveTextContent(dateFormat.format(new Date(birthDate)));
      expect(
        getCellByRowAndColumnHeaders(stringId, 'Email', undefined)
      ).toHaveTextContent(email);
      expect(
        getCellByRowAndColumnHeaders(stringId, 'Phone', undefined)
      ).toHaveTextContent(phone);
    });
  });
});

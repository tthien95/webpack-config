import { useContext, useEffect } from 'react';
import { AxiosResponse } from 'axios';
import { User } from 'type/user';
import { get } from 'utils/api-helper';
import UsersListContext from 'store/users-list';
import UsersTableEntries from './UsersTableEntries';

const UsersTable = () => {
  const { setIsLoading, usersList, setUsersList, fnHandleError } =
    useContext(UsersListContext);

  useEffect(() => {
    setIsLoading(true);
    get('/users')
      .then((res: AxiosResponse<{ users: User[] }>) => {
        const { users } = res.data;
        setUsersList(users);
      }, fnHandleError)
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  return (
    <div className="container-md mt-3 table-responsive">
      <table className="table table-hover">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">Avatar</th>
            <th scope="col">Birth Date</th>
            <th scope="col">Phone</th>
            <th scope="col">Email</th>
            <th scope="col">Last Name</th>
            <th scope="col">First Name</th>
            <th scope="col">Action</th>
          </tr>
        </thead>
        <tbody>
          <UsersTableEntries usersData={usersList} />
        </tbody>
      </table>
    </div>
  );
};

export default UsersTable;

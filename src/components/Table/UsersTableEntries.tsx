import React, { useContext, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { User } from 'type/user';
import { deleteReq } from 'utils/api-helper';
import UsersListContext from 'store/users-list';
import { toastActions } from 'store/toast-slice';
import Spinner from '../UI/Spinner';

const dateFormat = new Intl.DateTimeFormat(undefined, { dateStyle: 'long' });

const TableEntries: React.FC<{ usersData: User[] }> = ({ usersData }) => {
  const { deleteUser, isLoading, setIsLoading, fnHandleError } =
    useContext(UsersListContext);
  const dispatch = useDispatch();

  const handleDelete = useCallback(
    (userId: string) => {
      setIsLoading(true);
      deleteReq(`/users/${userId}`)
        .then(() => {
          dispatch(
            toastActions.showNotification({
              status: 'success',
              title: 'Success',
              message: 'Delete request has been sent successfully',
            })
          );
          deleteUser(userId);
        }, fnHandleError)
        .finally(() => {
          setIsLoading(false);
        });
    },
    [deleteUser, setIsLoading, fnHandleError, dispatch]
  );

  if (usersData.length === 0 || isLoading) {
    return (
      <tr>
        <td colSpan={8} className="text-center">
          {isLoading ? (
            <Spinner />
          ) : (
            <p className="text-center" data-testid="nodata">
              No Data
            </p>
          )}
        </td>
      </tr>
    );
  }

  return (
    <>
      {usersData.map(
        ({ id, image, email, birthDate, phone, firstName, lastName }) => (
          <tr key={id}>
            <th scope="row" className="align-middle">
              {id}
            </th>
            <td className="align-middle" style={{ width: '10rem' }}>
              <img className="rounded-circle w-50" src={image} alt={image} />
            </td>
            <td className="align-middle">
              {dateFormat.format(new Date(birthDate))}
            </td>
            <td className="align-middle">{phone}</td>
            <td className="align-middle">{email}</td>
            <td className="align-middle">{firstName}</td>
            <td className="align-middle">{lastName}</td>
            <td className="align-middle">
              <div className="d-flex justify-content-between">
                <Link to={`/user/${id}`}>
                  <button>Edit</button>
                </Link>
                <button onClick={() => handleDelete(id)}>Delete</button>
              </div>
            </td>
          </tr>
        )
      )}
    </>
  );
};

export default TableEntries;

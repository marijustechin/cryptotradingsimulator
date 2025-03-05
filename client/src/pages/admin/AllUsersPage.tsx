import { useEffect } from 'react';
import {
  getAllUsersInfo,
  selectAllUsers,
} from '../../store/features/user/allUsersSlice';
import { useAppDispatch, useAppSelector } from '../../store/store';

export const AllUsersPage = () => {
  const dispatch = useAppDispatch();
  const allUsers = useAppSelector(selectAllUsers);

  useEffect(() => {
    if (!allUsers) {
      dispatch(getAllUsersInfo());
    }
  }, [allUsers]);

  return (
    <main>
      <div></div>
      <table className="min-w-full">
        <thead>
          <tr>
            <th
              scope="col"
              className="px-6 py-3 text-start text-xs font-medium text-gray-400 uppercase"
            >
              First name
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-start text-xs font-medium text-gray-400 uppercase"
            >
              Email
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-start text-xs font-medium text-gray-400 uppercase"
            >
              Balance
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-end text-xs font-medium text-gray-400 uppercase"
            >
              Role
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-end text-xs font-medium text-gray-400 uppercase"
            >
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {allUsers?.map((user) => (
            <tr key={user.email}>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-300">
                {user.first_name}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-300">
                {user.email}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-300">
                {user.balance}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-300">
                {user.role}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
};

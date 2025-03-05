import { useEffect } from 'react';
import {
  getAllUsersInfo,
  getCurrentPage,
  getTotalPages,
  selectAllUsers,
  setCurrentPage,
} from '../../store/features/user/allUsersSlice';
import { useAppDispatch, useAppSelector } from '../../store/store';
import { Pagination } from '../../components/Pagination';

export const AllUsersPage = () => {
  const dispatch = useAppDispatch();
  const allUsers = useAppSelector(selectAllUsers);
  const totalPages = useAppSelector(getTotalPages);
  const currentPage = useAppSelector(getCurrentPage);

  useEffect(() => {
    if (!allUsers) {
      dispatch(getAllUsersInfo());
    }
  }, [allUsers]);

  const handlePageChange = (current: number) => {
    dispatch(setCurrentPage({ current: current }));
    dispatch(getAllUsersInfo());
  };

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
      <Pagination
        onChange={(current) => handlePageChange(current)}
        totalPages={totalPages}
        currentPage={currentPage}
      />
    </main>
  );
};

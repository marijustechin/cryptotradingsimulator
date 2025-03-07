import { useEffect, useState } from 'react';
import {
  getAllUsersInfo,
  getCurrentPage,
  getSorting,
  getTotalPages,
  selectAllUsers,
  setCurrentPage,
  setSorting,
} from '../../store/features/user/allUsersSlice';
import { useAppDispatch, useAppSelector } from '../../store/store';
import { Pagination } from '../../components/Pagination';
import { FaLongArrowAltDown, FaLongArrowAltUp } from 'react-icons/fa';

export const AllUsersPage = () => {
  const dispatch = useAppDispatch();
  const allUsers = useAppSelector(selectAllUsers);
  const totalPages = useAppSelector(getTotalPages);
  const currentPage = useAppSelector(getCurrentPage);
  const [sortOrder, setSortOrder] = useState('asc');

  useEffect(() => {
    if (!allUsers) {
      dispatch(getAllUsersInfo());
    }
  }, [allUsers]);

  const handlePageChange = (current: number) => {
    dispatch(setCurrentPage({ current: current }));
    dispatch(getAllUsersInfo());
  };

  const handleSorting = (newOptions: string) => {
    // busenos atnaujinimas yra asinchroninis!!!
    // 1. todel setSortOrder neatsinaujina is karto
    //    t.y. kitoje kodo eiluteje update nesimato
    // 2. taip uztikrinam, kad pries dispatch butu naujausia busena
    setSortOrder((prevOrder) => {
      const newOrder = prevOrder === 'asc' ? 'desc' : 'asc';
      dispatch(setSorting({ sort: newOptions + ':' + newOrder }));
      dispatch(getAllUsersInfo());
      return newOrder;
    });
  };

  return (
    <main>
      <div></div>
      <table className="min-w-full">
        <thead>
          <tr>
            <th
              onClick={() => handleSorting('first_name')}
              scope="col"
              className="px-6 py-3 text-start text-xs font-medium text-gray-400 uppercase flex cursor-pointer"
            >
              First Name{' '}
              <span className="ml-2 text-violet-200">
                {sortOrder === 'asc' ? (
                  <FaLongArrowAltDown />
                ) : (
                  <FaLongArrowAltUp />
                )}
              </span>
            </th>
            <th
              onClick={() => handleSorting('email')}
              scope="col"
              className="px-6 py-3 text-start text-xs font-medium text-gray-400 uppercase cursor-pointer"
            >
              <span className="flex gap-1">
                Email
                <span className="ml-2 text-violet-200">
                  {sortOrder === 'asc' ? (
                    <FaLongArrowAltDown />
                  ) : (
                    <FaLongArrowAltUp />
                  )}
                </span>
              </span>
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

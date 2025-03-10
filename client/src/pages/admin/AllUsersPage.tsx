import { useEffect, useState } from 'react';
import {
  deleteUser,
  getAllUsersInfo,
  getCurrentPage,
  getFilter,
  getTotalPages,
  selectAllUsers,
  setCurrentPage,
  setFilter,
  setSorting,
} from '../../store/features/user/allUsersSlice';
import { useAppDispatch, useAppSelector } from '../../store/store';
import { Pagination } from '../../components/Pagination';
import { FaLongArrowAltDown, FaLongArrowAltUp } from 'react-icons/fa';
import { Search } from '../../components/Search';
import { ConfirmationModal } from '../../components/ConfirmationModal';
import toast from 'react-hot-toast';

export const AllUsersPage = () => {
  const dispatch = useAppDispatch();
  const allUsers = useAppSelector(selectAllUsers);
  const totalPages = useAppSelector(getTotalPages);
  const currentPage = useAppSelector(getCurrentPage);
  const filter = useAppSelector(getFilter);
  const [sortOrder, setSortOrder] = useState('asc');
  const [sortField, setSortField] = useState('first_name');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState<string>('');
  const [delUser, setDelUser] = useState<{ id: string; name: string }>();

  useEffect(() => {
    if (!allUsers) {
      dispatch(getAllUsersInfo());
    }
  }, [allUsers, dispatch]);

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
      setSortField(newOptions);
      dispatch(setSorting({ sort: newOptions + ':' + newOrder }));
      dispatch(getAllUsersInfo());
      return newOrder;
    });
  };

  const handleFilter = (text: string, field_name: string) => {
    const newFilter = text ? `${field_name}:${text}` : '';
    dispatch(setFilter({ filter: newFilter }));
  };

  // einam duomenu visada,
  // kai atnaujinamas `filter`
  useEffect(() => {
    dispatch(getAllUsersInfo());
  }, [filter, dispatch]);

  const handleModalOpen = (id: string, name: string) => {
    setModalMessage(`Do you want to delete user "${name}"?`);
    setDelUser({ id: id, name: name });
    setIsModalOpen(true);
  };

  const confirmDelete = () => {
    setIsModalOpen(false);
    delUser.id && dispatch(deleteUser({ id: delUser.id }));
    setDelUser({ id: '', name: '' });
    setModalMessage('');
    toast.success('User deleted');
  };

  return (
    <main>
      <div className="flex gap-4 py-3 items-center">
        <Search
          placeholderText="Search by First Name"
          onSearch={(searchText) => handleFilter(searchText, 'first_name')}
        />
        <Search
          placeholderText="Search by Email"
          onSearch={(searchText) => handleFilter(searchText, 'email')}
        />
      </div>
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
                {sortField === 'first_name' &&
                  (sortOrder === 'asc' ? (
                    <FaLongArrowAltDown />
                  ) : (
                    <FaLongArrowAltUp />
                  ))}
              </span>
            </th>
            <th
              onClick={() => handleSorting('email')}
              scope="col"
              className="px-6 py-3 text-start text-xs font-medium text-gray-400 uppercase cursor-pointer"
            >
              <span className="flex gap-1">
                <span>Email</span>
                <span className="ml-2 text-violet-200">
                  {sortField === 'email' &&
                    (sortOrder === 'asc' ? (
                      <FaLongArrowAltDown />
                    ) : (
                      <FaLongArrowAltUp />
                    ))}
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
              <td>
                <button
                  onClick={() => handleModalOpen(user.id, user.first_name)}
                  className="cursor-pointer text-violet-600 hover:text-violet-400"
                >
                  ❌ Delete
                </button>
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
      <ConfirmationModal
        isOpen={isModalOpen}
        title="Delete user"
        message={modalMessage}
        onConfirm={confirmDelete}
        onCancel={() => setIsModalOpen(false)}
      />
    </main>
  );
};

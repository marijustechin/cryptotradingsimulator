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

const AllUsersPage = () => {
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

  const confirmDelete = async () => {
    setIsModalOpen(false);
    if (delUser?.id) {
      await dispatch(deleteUser({ id: delUser.id }));
    }
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
      {/* nauja lentele ========================================= */}
      <div className="overflow-x-auto">
        <table className="table table-zebra">
          <thead>
            <tr>
              <th>ID</th>
              <th
                className="cursor-pointer"
                onClick={() => handleSorting('first_name')}
                scope="col"
              >
                <span className="flex gap-1 items-center">
                  <span>First name</span>
                  <span className="ml-2 text-violet-300">
                    {sortField === 'first_name' &&
                      (sortOrder === 'asc' ? (
                        <FaLongArrowAltDown />
                      ) : (
                        <FaLongArrowAltUp />
                      ))}
                  </span>
                </span>
              </th>
              <th
                className="cursor-pointer"
                onClick={() => handleSorting('email')}
                scope="col"
              >
                <span className="flex gap-1 items-center">
                  <span>Email</span>
                  <span className="ml-2 text-violet-300">
                    {sortField === 'email' &&
                      (sortOrder === 'asc' ? (
                        <FaLongArrowAltDown />
                      ) : (
                        <FaLongArrowAltUp />
                      ))}
                  </span>
                </span>
              </th>
              <th>Balance</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {allUsers?.map((user) => (
              <tr key={user.email}>
                <th>{user.id}</th>
                <td>{user.first_name}</td>
                <td>{user.email}</td>
                <td>{user.balance}</td>
                <td>{user.role}</td>
                <td>
                  <button
                    onClick={() => handleModalOpen(user.id, user.first_name)}
                    className="cursor-pointer text-violet-500 hover:text-violet-400"
                  >
                    ❌ Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* naujos lenteles pagaiga ========================================= */}

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
export default AllUsersPage;

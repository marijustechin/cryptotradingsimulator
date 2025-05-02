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
import HelperService from '../../services/HelperService';
import { useTranslation } from 'react-i18next';

const AllUsersPage = () => {
  const { t } = useTranslation();
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

  useEffect(() => {
    dispatch(getAllUsersInfo());
  }, [filter, dispatch]);

  const handleModalOpen = (id: string, name: string) => {
    setModalMessage(t('admin_all_users_confirm_delete', { name }));
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
    toast.success(t('admin_all_users_deleted'));
  };

  return (
    <main className='w-full'>
      <h1 className="text-center">{t('admin_all_users_title')}</h1>
      <div className='flex gap-2 py-3 items-center flex-col md:flex-row'>
        <Search
          placeholderText={t('admin_all_users_search_first_name')}
          onSearch={(searchText) => handleFilter(searchText, 'first_name')}
        />
        <Search
          placeholderText={t('admin_all_users_search_email')}
          onSearch={(searchText) => handleFilter(searchText, 'email')}
        />
      </div>
      <div className="w-full overflow-x-auto">
        <table className='table border-separate border-spacing-y-2 w-full min-w-[1000px]'>
          <thead>
            <tr className='bg-gray-800 text-white'>
              <th>ID</th>
              <th
                className='cursor-pointer'
                onClick={() => handleSorting('first_name')}
                scope='col'
              >
                <span className='flex gap-1 items-center'>
                  <span>{t('admin_all_users_table_first_name')}</span>
                  <span className='ml-2 text-violet-300'>
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
                className='cursor-pointer'
                onClick={() => handleSorting('email')}
                scope='col'
              >
                <span className='flex gap-1 items-center'>
                  <span>{t('admin_all_users_table_email')}</span>
                  <span className='ml-2 text-violet-300'>
                    {sortField === 'email' &&
                      (sortOrder === 'asc' ? (
                        <FaLongArrowAltDown />
                      ) : (
                        <FaLongArrowAltUp />
                      ))}
                  </span>
                </span>
              </th>
              <th>{t('admin_all_users_table_balance')}</th>
              <th>{t('admin_all_users_table_role')}</th>
              <th>{t('admin_all_users_table_actions')}</th>
            </tr>
          </thead>
          <tbody>
            {allUsers?.map((user, index) => (
              <tr
                key={user.email}
                className={index % 2 === 0 ? 'bg-gray-800' : 'bg-gray-700'}
              >
                <th>{user.id}</th>
                <td>{user.first_name}</td>
                <td>{user.email}</td>
                <td>{HelperService.formatCurrency(user.balance)}</td>
                <td>{user.role}</td>
                <td>
                  <button
                    onClick={() => handleModalOpen(user.id, user.first_name)}
                    className='cursor-pointer text-violet-500 hover:text-violet-400'
                  >
                    ❌ {t('admin_all_users_delete_button')}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Pagination
        onChange={(current) => handlePageChange(current)}
        totalPages={totalPages}
        currentPage={currentPage}
      />
      <ConfirmationModal
        isOpen={isModalOpen}
        title={t('admin_all_users_modal_title')}
        message={modalMessage}
        onConfirm={confirmDelete}
        onCancel={() => setIsModalOpen(false)}
      />
    </main>
  );
};

export default AllUsersPage;
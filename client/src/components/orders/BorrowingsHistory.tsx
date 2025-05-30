import { useState, useEffect } from 'react';
import $api from '../../api/axios'; // Assuming this is the axios instance for API calls
import { Pagination } from '../Pagination'; // Assuming you have a Pagination component
import { useAppSelector } from '../../store/store'; // Assuming you use Redux
import { selectUserInfo } from '../../store/features/user/userInfoSlice'; // Assuming this selector gets user info
import { useTranslation } from 'react-i18next';

interface Borrowing {
  id: number;
  amount: number;
  borrow_date: string;
}

export default function BorrowingsHistory() {
  const { t } = useTranslation();
  const [data, setData] = useState<Borrowing[]>([]); // State to store the borrowings data
  const [currentPage, setCurrentPage] = useState(1); // Current page number
  const [totalPages, setTotalPages] = useState(1); // Total number of pages
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const itemsPerPage = 4; // Items per page

  // Fetching userId from the global state using Redux (similar to UpdateUserForm)
  const userData = useAppSelector(selectUserInfo);

  // Fetch borrow history for a specific user
  useEffect(() => {
    if (!userData) return; // Wait until userData is available

    const userId = userData.id;

    if (!userId) {
      setError('User ID not found. Please ensure you are logged in.');
      setLoading(false);
      return;
    }

    const fetchBorrowHistory = async () => {
      setLoading(true);
      try {
        const response = await $api.get(`/users/borrows/${userId}`, {
          params: {
            page: currentPage,
            limit: itemsPerPage,
            sort: 'borrow_date:asc',
          },
        });

        setData(response.data.borrows);
        setTotalPages(response.data.totalPages);
      } catch (err) {
        console.error('Error fetching borrow history:', err);
        setError('Failed to fetch borrow history.');
      } finally {
        setLoading(false);
      }
    };

    fetchBorrowHistory();
  }, [userData, currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  if (loading) {
    return <div>{t('loading')}</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="w-full">
      <table className="w-full table-auto border-separate border-spacing-y-2">
        <thead>
          <tr className="text-white bg-gray-800">
            <th className="px-4 py-2 text-left">ID</th>
            <th className="px-4 py-2 text-left">{t('borrowing_amount')}</th>
            <th className="px-4 py-2 text-left">{t('date_borrowed')}</th>
          </tr>
        </thead>
        <tbody>
          {data?.map((item, index) => (
            <tr
              key={item.id}
              className={index % 2 ? 'bg-gray-800' : 'bg-gray-700'}
            >
              <td className="px-4 py-2">{item.id}</td>
              <td className="px-4 py-2">{item.amount}</td>
              <td className="px-4 py-2">{item.borrow_date.slice(0, 10)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination Component */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onChange={handlePageChange}
      />
    </div>
  );
}

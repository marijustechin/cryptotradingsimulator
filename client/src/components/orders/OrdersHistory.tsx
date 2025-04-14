import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/store';
import { selectUser } from '../../store/features/user/authSlice';
import { DataExport } from './DataExport';
import HelperService from '../../services/HelperService';
import { Pagination } from '../../components/Pagination';
import { getOrdersHistory } from '../../store/features/orders/ordersSlice';

export const OrdersHistory = () => {
  // dispatch - nueina į duomenu baze ir atnaujina state naujais duomenim.
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);
  const { data: orders, totalPages } = useAppSelector(
    (state) => state.orders.ordersHistory
  );
  const ordersHistory = useAppSelector((state) => state.orders.ordersHistory);
  const [currentPage, setCurrentPage] = useState(1);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  useEffect(() => {
    if (user?.id) {
      dispatch(getOrdersHistory({ page: currentPage }));
    }
  }, [dispatch, user?.id, currentPage]);

  const formatDate = (isoString: string) => {
    const date = new Date(isoString);
    return date.toISOString().slice(0, 19).replace('T', ' ');
  };

  const filterOrders = orders?.filter((item) => item.ord_status === 'closed');

  return (
    <div>
      <DataExport ordersHistory={ordersHistory.data} />
      <table className='border-separate border-spacing-y-2 w-full table bg-gray-900 md:bg-transparent '>
        <thead>
          <tr className='text-white bg-gray-800'>
            <th>Market</th>
            <th>Order type</th>
            <th>Direction</th>
            <th>Order Price</th>
            <th>Order Quantity</th>
            <th>Order Time</th>
            <th>Order Value</th>
          </tr>
        </thead>
        <tbody>
          {filterOrders?.map((order, index) => (
            <tr
              className={index % 2 ? 'bg-gray-800' : 'bg-gray-700'}
              key={order.id}
            >
              <td
                className={
                  order.ord_direct === 'buy'
                    ? 'border-l-[2px] border-green-700'
                    : 'border-l-[2px] border-red-700'
                }
                key={order.id}
              >
                {order.assetId}
              </td>
              <td>{order.ord_type}</td>
              <td
                className={
                  order.ord_direct === 'buy' ? 'text-green-700' : 'text-red-700'
                }
              >
                {order.ord_direct}
              </td>
              <td>
                {HelperService.formatCurrency(
                  order.ord_type === 'market' ? order.price : order.triggerPrice
                )}
              </td>
              <td>{order.amount.toFixed(6)}</td>
              <td>
                {formatDate(
                  order.ord_status === 'open'
                    ? order.open_date
                    : order.closed_date
                )}
              </td>
              <td>
                {HelperService.formatCurrency(
                  order.ord_type === 'market'
                    ? order.price * order.amount
                    : order.triggerPrice * order.amount
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onChange={handlePageChange}
      />
    </div>
  );
};

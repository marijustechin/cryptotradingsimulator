import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/store';
import { selectUser } from '../../store/features/user/authSlice';
import {
  selectOrdersHistory,
  getOrdersHistory,
} from '../../store/features/orders/ordersSlice';
import { DataExport } from './DataExport';

export const OrdersHistory = () => {
  // dispatch - nueina į duomenu baze ir atnaujina state naujais duomenim.
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);
  const ordersHistory = useAppSelector(selectOrdersHistory);

  const formatDate = (isoString: string) => {
    const date = new Date(isoString);
    return date.toISOString().slice(0, 19).replace('T', ' ');
  };

  const filterOrders = ordersHistory?.filter(
    (item) => item.ord_status === 'closed'
  );

  useEffect(() => {
    if (!ordersHistory && user.id) {
      dispatch(getOrdersHistory({ userId: user.id }));
    }
  });

  return (
    <div>
      <DataExport type='History' />
      <table className='border-separate border-spacing-y-2 w-full table bg-gray-900 md:bg-transparent '>
        <thead>
          <tr className='text-white bg-gray-800'>
            <th>Market</th>
            <th>Order type</th>
            <th>Direction</th>
            <th>Order Price</th>
            <th>Order Quantity</th>
            <th>Order Time</th>
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
                {parseFloat(Number(order.price).toFixed(2))}/{order.ord_type}
              </td>
              <td>
                {order.amount}/
                <span className='text-gray-400 text-[12px]'>
                  {order.assetId}
                </span>
              </td>
              <td>
                {formatDate(
                  order.ord_status === 'open'
                    ? order.open_date
                    : order.closed_date
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

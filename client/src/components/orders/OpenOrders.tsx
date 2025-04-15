import { useEffect } from 'react';
import {
  getOpenOrders,
  selectOpenOrders,
} from '../../store/features/orders/ordersSlice';
import { selectUser } from '../../store/features/user/authSlice';
import { useAppDispatch, useAppSelector } from '../../store/store';
import { DataExport } from './DataExport';
import CancelOrder from './CancelOrder';
import EditOrderPrice from './EditPrice';
import EditOrderAmount from './EditAmount';
import HelperService from '../../services/HelperService';

export const OpenOrders = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);
  const openOrders = useAppSelector(selectOpenOrders);

  useEffect(() => {
    if (!openOrders && user.id) {
      dispatch(getOpenOrders({ userId: user.id }));
    }
  }, [dispatch, openOrders, user.id]);
  const refreshOrders = () => {
    if (user.id) {
      dispatch(getOpenOrders({ userId: user.id }));
    }
  };

  return (
    <div className='overflow-x-auto'>
      <DataExport openOrders={openOrders} />
      <table className='border-separate border-spacing-y-2 table'>
        <thead>
          <tr className='text-white bg-gray-800'>
            <th>Market</th>
            <th>Order Type</th>
            <th>Direction</th>
            <th>Entry Price</th>
            <th>Order Qty</th>
            <th>Order Time</th>
            <th>Order Value</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {openOrders?.map((order, index) => (
            <tr
              className={index % 2 ? 'bg-gray-800' : 'bg-gray-700'}
              key={order.assetName + order.id}
            >
              <td
                className={
                  order.ord_direct === 'buy'
                    ? 'border-l-[2px] border-green-700'
                    : 'border-l-[2px] border-red-700'
                }
              >
                {order.assetName}
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
                <div className='flex items-center'>
                  {HelperService.formatCurrency(Number(order.triggerPrice))}
                  <EditOrderPrice
                    orderId={order.id}
                    triggerPrice={order.triggerPrice}
                    onSuccess={refreshOrders}
                  />
                </div>
              </td>
              <td>
                <div className='text-green-700 flex items-center'>
                  {order.amount.toFixed(6)}
                  <EditOrderAmount
                    orderId={order.id}
                    amount={order.amount}
                    onSuccess={refreshOrders}
                  />
                </div>
              </td>
              <td>{order.open_date}</td>
              <td>
                {HelperService.formatCurrency(
                  order.ord_type === 'market'
                    ? order.price * order.amount
                    : order.triggerPrice * order.amount
                )}
              </td>
              <td>
                <CancelOrder orderId={order.id} onSuccess={refreshOrders} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

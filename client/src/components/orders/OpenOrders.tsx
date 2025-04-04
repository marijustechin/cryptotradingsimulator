import { useEffect } from 'react';
import {
  getOpenOrders,
  selectOpenOrders,
} from '../../store/features/orders/ordersSlice';
import { selectUser } from '../../store/features/user/authSlice';
import { useAppDispatch, useAppSelector } from '../../store/store';

export const OpenOrders = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);
  const openOrders = useAppSelector(selectOpenOrders);

  useEffect(() => {
    if (!openOrders && user.id) {
      dispatch(getOpenOrders({ userId: user.id }));
    }
  }, [dispatch, openOrders, user.id]);

  return (
    <div className="">
      <table className="border-separate border-spacing-y-2 w-full table">
        <thead>
          <tr className="text-white bg-gray-800">
            <th>Market</th>
            <th>Order Type</th>
            <th>Direction</th>
            <th>Price</th>
            <th>Order Qty</th>
            <th>Entry Price</th>
            <th>Order Time</th>
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
                {parseFloat(Number(order.triggerPrice).toFixed(2))}{' '}
                <span className="text-gray-400 text-[12px]">USDT</span>
              </td>
              <td className="text-green-700">{order.amount}</td>
              <td>
                {parseFloat(
                  Number(order.amount * order.triggerPrice).toFixed(2)
                )}
              </td>
              <td>{order.open_date}</td>
              <td>
                <button>Cancel</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../store/store";
import { selectUser } from "../../store/features/user/authSlice";
import {
  selectOrdersHistory,
  getOrdersHistory,
} from "../../store/features/orders/ordersSlice";

export const OrdersHistory = () => {
  // dispatch - nueina į duomenu baze ir atnaujina state naujais duomenim.
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);
  const ordersHistory = useAppSelector(selectOrdersHistory);

  console.log(ordersHistory);

  useEffect(() => {
    if (!ordersHistory && user.id) {
      dispatch(getOrdersHistory({ userId: user.id }));
    }
  });

  return (
    <div>
      <table className="table">
        <thead>
          <tr className="text-gray-500">
            <th>Market</th>
            <th>Order type</th>
            <th>Direction</th>
            <th>Order Price</th>
            <th>Order Quantity</th>
            <th>Order Time</th>
          </tr>
        </thead>
        <tbody>
          {ordersHistory?.map((order) => (
            <tr className="" key={order.id}>
              <td>{order.assetId}</td>
              <td>{order.ord_type}</td>
              <td>{order.ord_direct}</td>
              <td>{order.price}</td>
              <td>{order.amount}</td>
              <td>{order.open_date}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

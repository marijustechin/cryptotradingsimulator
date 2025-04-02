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

  // jei vartotojo statusas open - open date
  // jei vartotojo statusas closed - closed date

  const formatDate = (isoString) => {
    const date = new Date(isoString);
    return date.toISOString().slice(0, 19).replace("T", " ");
  };

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
            <th>Status</th>
            <th>Order Time</th>
          </tr>
        </thead>
        <tbody>
          {ordersHistory?.map((order) => (
            <tr className="" key={order.id}>
              <td>{order.assetId}</td>
              <td>{order.ord_type}</td>
              <td
                className={
                  order.ord_direct === "buy" ? "text-green-500" : "text-red-500"
                }
              >
                {order.ord_direct}
              </td>
              <td>
                {parseFloat(Number(order.price).toFixed(2))}/{order.ord_type}
              </td>
              <td>
                {order.amount}/
                <span className="text-gray-400 text-[12px]">
                  {order.assetId}
                </span>
              </td>
              <td>{order.ord_status}</td>
              <td>
                {formatDate(
                  order.ord_status === "open"
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

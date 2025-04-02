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
      <table className="border-separate border-spacing-y-2 w-full table">
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
            <tr className="hover:bg-gray-800" key={order.id}>
              <td
                className={
                  order.ord_direct === "buy"
                    ? "border-l-[2px] border-green-700"
                    : "border-l-[2px] border-red-700"
                }
                key={order.id}
              >
                {order.assetId}
              </td>
              <td>{order.ord_type}</td>
              <td
                className={
                  order.ord_direct === "buy" ? "text-green-700" : "text-red-700"
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

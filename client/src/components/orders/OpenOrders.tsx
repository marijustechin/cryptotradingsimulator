import { useEffect } from "react";
import {
  getOpenOrders,
  selectOpenOrders,
} from "../../store/features/orders/ordersSlice";
import { selectUser } from "../../store/features/user/authSlice";
import { useAppDispatch, useAppSelector } from "../../store/store";

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
    <div className="overflow-x-auto">
      <table className="table">
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Instrument</th>
            <th>Type</th>
            <th>Direction</th>
            <th>Price</th>
            <th>Order Qty</th>
            <th>Order Value</th>
            <th>Order Time</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {openOrders?.map((order) => (
            <tr className="" key={order.assetName + order.id}>
              <td>{order.id}</td>
              <td>{order.assetName}</td>
              <td>{order.ord_type}</td>
              <td>{order.ord_direct}</td>
              <td>{order.triggerPrice}</td>
              <td>{order.amount}</td>
              <td>{order.amount * order.triggerPrice}</td>
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

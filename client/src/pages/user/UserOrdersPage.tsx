import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../store/store";
import { getUserOrders } from "../../store/features/orders/ordersSlice";

export const UserOrdersPage = () => {
  const dispatch = useAppDispatch();

  const { orders, status, error } = useAppSelector((state) => state.orders);

  useEffect(() => {
    dispatch(getUserOrders());
  }, [dispatch]);

  return (
    <main className="flex flex-col gap-3">
      <h1>Orders</h1>
      {orders?.portfolio.map((item, index) => (
        <li key={index}>{item.amount};</li>
      ))}
    </main>
  );
};

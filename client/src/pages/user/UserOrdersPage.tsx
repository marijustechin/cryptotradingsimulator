import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../store/store";
import { getUserOrders } from "../../store/features/orders/ordersSlice";
import { format } from "date-fns";

export const UserOrdersPage = () => {
  const dispatch = useAppDispatch();

  const { orders, status, error } = useAppSelector((state) => state.orders);

  console.log("transakcijos", orders);

  useEffect(() => {
    dispatch(getUserOrders());
  }, [dispatch]);

  console.log("OrdersTransakcijos", orders);

  const formattedDate = (dateStr: string) => {
    return format(new Date(dateStr), "eee dd MMM, yyyy HH:mm");
  };

  return (
    <main>
      <h1>Orders</h1>
      <section>
        <div className="grid grid-cols-[0.7fr_1fr_0.7fr_1fr_1.4fr_1.5fr_2.6fr] text-center mb-2 gap-x-0 bg-[#1C1C1C] to-transparent p-4 rounded-[10px] border-gray-700 border-1">
          <p>#ID</p>
          <p>Direct</p>
          <p>Amount</p>
          <p>Type</p>
          <p>Asset</p>
          <p>Value</p>
          <p>Date</p>
        </div>
        <div className="rounded-[10px] border-gray-700 border-1">
          {orders?.transactions.map((item, index) => (
            <div
              className={`py-4 grid grid-cols-[0.7fr_1fr_0.7fr_1fr_1.4fr_1.5fr_2.6fr] text-center border-gray-600 bg-[#1C1C1C] 
                ${
                  index === orders.transactions.length - 1
                    ? "border-b-0"
                    : "border-b border-b-indigo-900"
                }
              `}
              key={index}
            >
              <span>#{item.id}</span>
              <span>{item.ord_direct}</span>
              <span>{item.amount}</span>
              <span>{item.ord_type}</span>
              <span>{item.asset_id}</span>
              <span>{item.order_value}$</span>
              <span>
                {formattedDate(
                  item.ord_direct === "buy" ? item.open_date : item.closed_date
                )}
              </span>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
};

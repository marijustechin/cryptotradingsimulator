import { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../store/store";
import { getUserOrders } from "../../store/features/orders/ordersSlice";
import { format } from "date-fns";

type TabOption =
  | "Open Orders"
  | "Positions"
  | "Order History"
  | "Trade History"
  | "Assets"
  | "Borrowings"
  | "P%L";

const TABS: TabOption[] = [
  "Open Orders",
  "Positions",
  "Order History",
  "Trade History",
  "Assets",
  "Borrowings",
  "P%L",
];

export const UserOrdersPage = () => {
  const dispatch = useAppDispatch();

  const { orders, status, error } = useAppSelector((state) => state.orders);
  const [active, setActive] = useState<TabOption>("Open Orders");

  useEffect(() => {
    dispatch(getUserOrders());
  }, [dispatch]);

  const formattedDate = (dateStr: string) => {
    return format(new Date(dateStr), "eee dd MMM, yyyy HH:mm");
  };

  return (
    <main>
      <h1>Orders</h1>
      <nav>
        <div className="grid grid-cols-7">
          {TABS.map((tab) => (
            <span
              key={tab}
              onClick={() => setActive(tab)}
              className={`cursor-pointer py-2 text-center`}
            ></span>
          ))}
        </div>
      </nav>
      <section>
        <div className="grid grid-cols-[0.7fr_1fr_0.7fr_1fr_1.4fr_1.5fr_2.6fr] text-center mb-2 gap-x-0 bg-[#1C1C1C] to-transparent p-4 rounded-[10px] border-gray-700 border-1">
          <p>Contracts</p>
          <p>Qty</p>
          <p>Entry price</p>
          <p>Mark price</p>
          <p>Profit</p>
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
              <span>{item.asset.symbol}</span>
              <span>{item.amount}</span>
              <span>{item.entry_price}$</span>
              <span>{item.price_usd} Cia bus market kaina$</span>
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

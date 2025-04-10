import { useState } from "react";
import { OpenOrders } from "../../components/orders/OpenOrders";
import { OrdersHistory } from "../../components/orders/OrdersHistory";
import { UserAssets } from "../../components/orders/UserAssets";

const UserOrdersPage = () => {
  const [activeTab, setActiveTab] = useState("oo");

  const buttons = [
    {
      text: "Open Orders",
      tabCode: "oo",
    },
    {
      text: "Order History",
      tabCode: "oh",
    },
    {
      text: "Assets",
      tabCode: "ua",
    },
  ];

  return (
    <main>
      <h1 className="text-center">My Orders</h1>
      <nav className="flex justify-start gap-2 py-2">
        {buttons.map((button) => (
          <button
            key={button.text}
            onClick={() => setActiveTab(button.tabCode)}
            className={`${
              activeTab === button.tabCode
                ? "border-b-2 text-violet-200"
                : "text-violet-500"
            } p-2 cursor-pointer `}
          >
            {button.text}
          </button>
        ))}
      </nav>
      <section>
        {activeTab === "oo" && <OpenOrders />}
        {activeTab === "oh" && <OrdersHistory />}
        {activeTab === "ua" && <UserAssets />}
      </section>
    </main>
  );
};
export default UserOrdersPage;

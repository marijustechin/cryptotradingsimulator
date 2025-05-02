import { useState } from "react";
import { OpenOrders } from "../../components/orders/OpenOrders";
import { OrdersHistory } from "../../components/orders/OrdersHistory";
import { UserAssets } from "../../components/orders/UserAssets";
import { useTranslation } from "react-i18next";

const UserOrdersPage = () => {
  const [activeTab, setActiveTab] = useState("oo");
  const { t } = useTranslation();

  const buttons = [
    {
      text: t("open_orders"),
      tabCode: "oo",
    },
    {
      text: t("order_history"),
      tabCode: "oh",
    },
    {
      text: t("assets"),
      tabCode: "ua",
    },
  ];

  return (
    <main>
      <h1 className="text-center">{t("orders_title")}</h1>
      <nav className="flex justify-start gap-2 py-2">
        {buttons.map((button) => (
          <button
            key={button.text}
            onClick={() => setActiveTab(button.tabCode)}
            className={`${
              activeTab === button.tabCode
                ? "border-b-2 text-blue-200"
                : "text-violet-300"
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

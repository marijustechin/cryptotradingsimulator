import { useEffect } from "react";
import {
  getOpenOrders,
  getUserAssets,
  selectOpenOrders,
  selectUserAssets,
} from "../../store/features/orders/ordersSlice";
import { selectUser, fetchUserInfo } from "../../store/features/user/authSlice";
import { selectLimitFee } from "../../store/features/admin/settingsSlice";
import { useAppDispatch, useAppSelector } from "../../store/store";
import { DataExport } from "./DataExport";
import CancelOrder from "./CancelOrder";
import EditOrderPrice from "./EditPrice";
import EditOrderAmount from "./EditAmount";
import HelperService from "../../services/HelperService";
import { useTranslation } from "react-i18next";

export const OpenOrders = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);
  const openOrders = useAppSelector(selectOpenOrders);
  const assets = useAppSelector(selectUserAssets);
  const limitFee = useAppSelector(selectLimitFee);

  useEffect(() => {
    if (!openOrders && !assets && user.id) {
      dispatch(getOpenOrders({ userId: user.id }));
      dispatch(getUserAssets({ userId: user.id }));
    }
  }, [dispatch, openOrders, assets, user.id]);
  const refreshOrders = () => {
    if (user.id) {
      dispatch(getOpenOrders({ userId: user.id }));
      dispatch(getUserAssets({ userId: user.id }));
      dispatch(fetchUserInfo());
    }
  };

  return (
    <div className="w-full">
      <DataExport openOrders={openOrders} />
      <div className="overflow-x-auto">
        <table className="border-separate border-spacing-y-2 table">
          <thead>
            <tr className="text-white bg-gray-800">
              <th>{t("order_market")}</th>
              <th>{t("order_type")}</th>
              <th>{t("direction")}</th>
              <th>{t("entry_price")}</th>
              <th>{t("order_qty")}</th>
              <th>{t("order_value")}</th>
              <th>{t("order_time")}</th>
              <th>{t("action")}</th>
            </tr>
          </thead>
          <tbody>
            {openOrders?.map((order, index) => (
              <tr
                className={index % 2 ? "bg-gray-800" : "bg-gray-700"}
                key={order.assetName + order.id}
              >
                <td
                  className={
                    order.ord_direct === "buy"
                      ? "border-l-[2px] border-green-700"
                      : "border-l-[2px] border-red-700"
                  }
                >
                  {order.assetName}
                </td>
                <td>{order.ord_type}</td>
                <td
                  className={
                    order.ord_direct === "buy"
                      ? "text-green-700"
                      : "text-red-700"
                  }
                >
                  {order.ord_direct}
                </td>
                <td>
                  <div className="flex items-center">
                    {HelperService.formatCurrency(Number(order.triggerPrice))}
                    <EditOrderPrice
                      orderId={order.id}
                      triggerPrice={order.triggerPrice}
                      onSuccess={refreshOrders}
                    />
                  </div>
                </td>
                <td>
                  <div className="text-green-700 flex items-center">
                    {order.amount.toFixed(6)}
                    <EditOrderAmount
                      orderId={order.id}
                      assetId={order.assetId}
                      amount={order.amount}
                      onSuccess={refreshOrders}
                      assets={assets}
                      balance={user.balance ?? 0}
                      orderDirection={order.ord_direct}
                      limit={limitFee ?? 0}
                      orderPrice={order.triggerPrice}
                    />
                  </div>
                </td>
                <td>
                  {HelperService.formatCurrency(
                    order.triggerPrice * order.amount
                  )}
                </td>
                <td>{order.open_date}</td>
                <td>
                  <CancelOrder orderId={order.id} onSuccess={refreshOrders} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

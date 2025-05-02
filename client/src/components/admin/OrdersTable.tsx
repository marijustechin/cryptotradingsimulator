import { FaLongArrowAltDown, FaLongArrowAltUp } from "react-icons/fa";
import HelperService from "../../services/HelperService";
import { useTranslation } from "react-i18next";

export interface AdminOrder {
  id: number;
  userName: string;
  amount: number;
  assetId: string;
  status: string;
  type: string;
  fee: number;
  createdAt: string;
  closedAt: string;
  price: number;
}

interface OrdersTableProps {
  paginatedOrders: AdminOrder[];
  sortField: "user" | "amount";
  sortOrder: "asc" | "desc";
  setSortField: React.Dispatch<React.SetStateAction<"user" | "amount">>;
  setSortOrder: React.Dispatch<React.SetStateAction<"asc" | "desc">>;
}

export const OrdersTable = ({
  paginatedOrders,
  sortField,
  sortOrder,
  setSortField,
  setSortOrder,
}: OrdersTableProps) => {
  const { t } = useTranslation();

  return (
    <div className="w-full overflow-x-auto">
      <table className="min-w-[1000px] border-separate border-spacing-y-2 w-full">
        <thead className="text-white bg-gray-700">
          <tr>
            <th
              className="cursor-pointer whitespace-nowrap px-4 py-2"
              onClick={() => {
                setSortField("user");
                setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
              }}
            >
              <div className="flex gap-1 items-center">
                <span>{t('admin_orders_table_user')}</span>
                {sortField === "user" && (
                  <span className="ml-2 text-violet-300">
                    {sortOrder === "asc" ? <FaLongArrowAltDown /> : <FaLongArrowAltUp />}
                  </span>
                )}
              </div>
            </th>
            <th
              className="cursor-pointer whitespace-nowrap px-4 py-2"
              onClick={() => {
                setSortField("amount");
                setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
              }}
            >
              <div className="flex gap-1 items-center">
                <span>{t('admin_orders_table_amount')}</span>
                {sortField === "amount" && (
                  <span className="ml-2 text-violet-300">
                    {sortOrder === "asc" ? <FaLongArrowAltDown /> : <FaLongArrowAltUp />}
                  </span>
                )}
              </div>
            </th>
            <th className="whitespace-nowrap px-4 py-2 text-left">{t('admin_orders_table_currency')}</th>
            <th className="whitespace-nowrap px-4 py-2 text-left">{t('admin_orders_table_status')}</th>
            <th className="whitespace-nowrap px-4 py-2 text-left">{t('admin_orders_table_type')}</th>
            <th className="whitespace-nowrap px-4 py-2 text-left">{t('admin_orders_table_fee')}</th>
            <th className="whitespace-nowrap px-4 py-2 text-left">{t('admin_orders_table_order_value')}</th>
          </tr>
        </thead>
        <tbody>
          {paginatedOrders.map((order, index) => (
            <tr
              key={order.id}
              className={index % 2 === 0 ? "bg-gray-800" : "bg-gray-700"}
            >
              <td className="whitespace-nowrap px-4 py-2">{order.userName}</td>
              <td className="whitespace-nowrap px-4 py-2">{Number(order.amount).toFixed(6)}</td>
              <td className="whitespace-nowrap px-4 py-2">{order.assetId.slice(0, 3)}</td>
              <td className="whitespace-nowrap px-4 py-2">{order.status}</td>
              <td className="whitespace-nowrap px-4 py-2">{order.type}</td>
              <td className="whitespace-nowrap px-4 py-2">
                {HelperService.formatCurrency(order.fee)}
              </td>
              <td className="whitespace-nowrap px-4 py-2">
                {HelperService.formatCurrency(order.amount * order.price)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
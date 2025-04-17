import { FaLongArrowAltDown, FaLongArrowAltUp } from "react-icons/fa";
import HelperService from "../../services/HelperService";

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
    return (
      <div>
        <table className="table border-separate border-spacing-y-2 w-full">
          <thead className="text-white bg-gray-700">
            <tr>
              <th
                className="cursor-pointer w-1/7"
                onClick={() => {
                  setSortField("user");
                  setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
                }}
              >
                <div className="flex gap-1 items-center">
                  <span>User</span>
                  {sortField === "user" && (
                    <span className="ml-2 text-violet-300">
                      {sortOrder === "asc" ? (
                        <FaLongArrowAltDown />
                      ) : (
                        <FaLongArrowAltUp />
                      )}
                    </span>
                  )}
                </div>
              </th>
              <th
                className="cursor-pointer w-1/7"
                onClick={() => {
                  setSortField("amount");
                  setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
                }}
              >
                <div className="flex gap-1 items-center">
                  <span>Amount</span>
                  {sortField === "amount" && (
                    <span className="ml-2 text-violet-300">
                      {sortOrder === "asc" ? (
                        <FaLongArrowAltDown />
                      ) : (
                        <FaLongArrowAltUp />
                      )}
                    </span>
                  )}
                </div>
              </th>
              <th className="w-1/7">Currency</th>
              <th className="w-1/7">Status</th>
              <th className="w-1/7">Type</th>
              <th className="w-1/7">Fee</th>
              <th className="w-1/7">Order Value</th>
            </tr>
          </thead>
          <tbody>
            {paginatedOrders.map((order, index) => (
              <tr
                key={order.id}
                className={index % 2 === 0 ? "bg-gray-800" : "bg-gray-700"}
              >
                <td className="w-1/7">{order.userName}</td>
                <td className="w-1/7">{order.amount}</td>
                <td className="w-1/7">{order.assetId.slice(0, 3)}</td>
                <td className="w-1/7">{order.status}</td>
                <td className="w-1/7">{order.type}</td>
                <td className="w-1/7">{HelperService.formatCurrency(order.fee)}</td>
                <td className="w-1/7">
                  {HelperService.formatCurrency(order.amount * order.price)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };
  
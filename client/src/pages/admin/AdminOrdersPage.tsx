import { useEffect, useMemo, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../store/store";
import {
  getGeneralInfo,
  selectAdminOrderInfo,
} from "../../store/features/admin/adminSlice";
import { Pagination } from "../../components/Pagination";
import { OrdersTable } from "../../components/admin/OrdersTable";
import { Search } from "../../components/Search";
import helperService from "../../services/HelperService";
import { DashboardOrdersCard } from "../../components/admin/DasboardOrdersCard";

export default function AdminOrdersPage() {
  const dispatch = useAppDispatch();
  const orderInfo = useAppSelector(selectAdminOrderInfo);
  const orders = orderInfo?.AllOrdersWithUsers?.orders ?? [];

  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<"user" | "amount">("user");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const ordersPerPage = 10;

  useEffect(() => {
    if (!orderInfo) {
      dispatch(getGeneralInfo());
    }
  }, [dispatch, orderInfo]);

  const sortedAndFilteredOrders = useMemo(() => {
    const result = searchText
      ? orders.filter(
          (o) =>
            o.userName?.toLowerCase().includes(searchText.toLowerCase()) ||
            o.assetId?.toLowerCase().includes(searchText.toLowerCase())
        )
      : orders;

    return result.slice().sort((a, b) => {
      const aVal = sortField === "user" ? a.userName : a.amount;
      const bVal = sortField === "user" ? b.userName : b.amount;

      if (typeof aVal === "string" && typeof bVal === "string") {
        return sortOrder === "asc"
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal);
      }

      return sortOrder === "asc"
        ? Number(aVal) - Number(bVal)
        : Number(bVal) - Number(aVal);
    });
  }, [orders, searchText, sortField, sortOrder]);

  const paginatedOrders = useMemo(() => {
    const start = (currentPage - 1) * ordersPerPage;
    const end = start + ordersPerPage;
    return sortedAndFilteredOrders.slice(start, end);
  }, [sortedAndFilteredOrders, currentPage]);

  const stats = useMemo(() => {
    const activeOrders = orders.filter((o) => o.status === "open").length;
    const totalAmount = orders.reduce((acc, o) => acc + o.amount, 0);
    const uniqueUsers = new Set(orders.map((o) => o.userName)).size;

    const averageOrderSize = orders.length
      ? (totalAmount / orders.length).toFixed(2)
      : "0";
    const totalFees = orders.reduce((acc, o) => acc + Number(o.fee), 0);
    const averageFee = orders.length
      ? (totalFees / orders.length).toFixed(2)
      : "0";
    const totalValue = orders.reduce((acc, o) => acc + o.price, 0);
    const averageValue = orders.length
      ? (totalValue / orders.length).toFixed(2)
      : "0";
    const currencyFrequency = orders.reduce(
      (acc: Record<string, number>, o) => {
        acc[o.assetId] = (acc[o.assetId] || 0) + 1;
        return acc;
      },
      {}
    );
    const mostActiveCurrency =
      Object.entries(currencyFrequency).sort((a, b) => b[1] - a[1])[0]?.[0] ||
      "-";

    const biggestAmount = Math.max(...orders.map((o) => o.amount), 0);
    const biggestValue = Math.max(...orders.map((o) => o.amount * o.price), 0);
    const biggestFee = Math.max(...orders.map((o) => o.fee || 0), 0);

    return {
      activeOrders,
      totalAmount,
      uniqueUsers,
      averageOrderSize,
      averageFee,
      mostActiveCurrency,
      averageValue,
      totalValue,
      biggestAmount,
      biggestValue,
      biggestFee,
      totalFees,
    };
  }, [orders]);

  const handleSearch = (text: string) => {
    setCurrentPage(1);
    setSearchText(text);
  };

  return (
    <main className="overflow-x-auto">
      <h1 className="text-center">Platform Orders Summary</h1>

      {/* Dashboard cards */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-6">
        <DashboardOrdersCard
          title="Total Value"
          value={helperService.formatCurrency(Number(stats.totalValue))}
        />
        <DashboardOrdersCard
          title="Total Fees"
          value={helperService.formatCurrency(
            Number(stats.totalFees.toFixed(4))
          )}
        />
        <DashboardOrdersCard
          title="Total Amount"
          value={stats.totalAmount.toFixed(4)}
        />
        <DashboardOrdersCard title="Unique Users" value={stats.uniqueUsers} />
        <DashboardOrdersCard
          title="Avg. Order Value"
          value={helperService.formatCurrency(Number(stats.averageValue))}
        />
        <DashboardOrdersCard
          title="Avg. Order Fee"
          value={helperService.formatCurrency(Number(stats.averageFee))}
        />
        <DashboardOrdersCard
          title="Avg. Order Amount"
          value={stats.averageOrderSize}
        />

        <DashboardOrdersCard
          title="Most Active Currency"
          value={stats.mostActiveCurrency.slice(0, 3)}
        />
        <DashboardOrdersCard
          title="Biggest Order Value"
          value={helperService.formatCurrency(stats.biggestValue)}
        />
        <DashboardOrdersCard
          title="Biggest Fee Paid"
          value={helperService.formatCurrency(stats.biggestFee)}
        />
        <DashboardOrdersCard
          title="Biggest Order Amount"
          value={stats.biggestAmount.toFixed(4)}
        />
        <DashboardOrdersCard title="Open Orders" value={stats.activeOrders} />
      </div>

      <h2 className="text-2xl font-semibold text-white mb-2">
        Last Operations
      </h2>

      {/* Search */}
      <div className="flex gap-4 items-center mb-4">
        <Search
          placeholderText="Search by User or Currency"
          onSearch={handleSearch}
        />
      </div>

      <OrdersTable
        paginatedOrders={paginatedOrders}
        sortField={sortField}
        sortOrder={sortOrder}
        setSortField={setSortField}
        setSortOrder={setSortOrder}
      />

      {/* Pagination */}
      <Pagination
        onChange={(page) => setCurrentPage(page)}
        totalPages={Math.ceil(sortedAndFilteredOrders.length / ordersPerPage)}
        currentPage={currentPage}
      />
    </main>
  );
}

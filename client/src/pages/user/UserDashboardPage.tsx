import UserBalanceChart from "../../components/dashboard/UserBalanceChart";
import Inventory from "../../components/dashboard/Inventory";

const UserDashboardPage = () => {
  return (
    <main className="mt-6 sm:mt-8 p-4 sm:p-6 bg-gray-900 rounded-xl shadow-xl space-y-6">
      <UserBalanceChart />
      <Inventory />
    </main>
  );
};

export default UserDashboardPage;

import UserBalanceChart from "../../components/dashboard/UserBalanceChart";
import Inventory from "../../components/dashboard/Inventory";

const UserDashboardPage = () => {
  return (
    <main className="mt-5">
      <UserBalanceChart />
      <Inventory />
    </main>
  );
};
export default UserDashboardPage;

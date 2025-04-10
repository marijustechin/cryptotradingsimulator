import UserBalanceChart from "../../components/dashboard/UserBalanceChart";
import UserOrdersByCryptoChart from "../../components/dashboard/OrdersByCrypto";
import UserCryptoHoldingsStackedBar from "../../components/dashboard/UserCryptoHoldingsStackedBar";

const UserDashboardPage = () => {
  return (
    <main>
      <h1 className="text-center">Performance Summary</h1>
      <UserBalanceChart />
      <UserOrdersByCryptoChart/>
      <UserCryptoHoldingsStackedBar/>
    </main>
  );
};
export default UserDashboardPage;

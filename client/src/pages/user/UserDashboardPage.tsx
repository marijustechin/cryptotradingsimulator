import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../store/store";
import {
  selectOrdersHistory,
  getOrdersHistory,
} from "../../store/features/orders/ordersSlice";
import { selectUser } from "../../store/features/user/authSlice";
import UserBalanceChart from "../../components/dashboard/UserBalanceChart";
import UserOrdersByCryptoChart from "../../components/dashboard/OrdersByCrypto";
import UserCryptoHoldingsStackedBar from "../../components/dashboard/UserCryptoHoldingsStackedBar";
import { Link } from "react-router";
import { Player } from "@lottiefiles/react-lottie-player";

const UserDashboardPage = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getOrdersHistory({ page: 1 }));
  }, [dispatch]);

  const user = useAppSelector(selectUser);
  const orders = useAppSelector(selectOrdersHistory)?.data;

  return (
    <>
      {!user || !orders?.length ? (
        <div className="flex justify-between items-center mb-4 flex-wrap gap-2 lg:pl-32 pt-24 pl-10">
          <div>
            <div className="flex flex-col justify-center items-center w-full">
              <div className="pb-4 flex flex-col justify-center items-center">
                <h3 className="pb-4">Nothing to show</h3>
                <Link to="/my-dashboard/trading" className="btn-generic my-6">
                  Go to Trading
                </Link>
              </div>
              <Player
                autoplay
                loop
                src="/Animation3.json"
                className="w-full h-[300px] md:h-[600px]"
              />
            </div>
          </div>
        </div>
      ) : (
        <main>
          <h1 className="text-center">Trading Summary</h1>
          <UserBalanceChart orders={orders} user={user} />
          <UserOrdersByCryptoChart orders={orders} />
          <UserCryptoHoldingsStackedBar orders={orders} />
        </main>
      )}
    </>
  );
};

export default UserDashboardPage;

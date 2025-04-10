import { useEffect, useMemo } from "react";
import { useAppSelector, useAppDispatch } from "../../store/store";
import {
  selectUserAssets,
  getUserAssets,
} from "../../store/features/orders/ordersSlice";
import { selectUser } from "../../store/features/user/authSlice";
import { Link } from "react-router";

const Inventory = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);
  const userAssets = useAppSelector(selectUserAssets);

  // Fetch assets when the component mounts or when the page becomes visible
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        if (user.id) {
          dispatch(getUserAssets({ userId: user.id }));
        }
      }
    };

    // Fetch assets on mount if not already loaded
    if (!userAssets && user.id) {
      dispatch(getUserAssets({ userId: user.id }));
    }

    // Set up visibility change listener to refresh data when the page becomes visible
    document.addEventListener("visibilitychange", handleVisibilityChange);

    // Clean up the event listener when the component is unmounted
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [dispatch, user.id, userAssets]);

  // Memoize the assets to avoid unnecessary re-renders
  const assets = useMemo(() => {
    if (!userAssets) return [];

    return userAssets
      .filter((a) => a.balance > 0)
      .map((a) => ({
        asset: a.asset,
        balance: a.balance,
      }));
  }, [userAssets]);

  if (!assets.length) {
    return <div className="text-sm text-gray-400">No assets found.</div>;
  }

  return (
    <div className="mt-4 space-y-4">
      <h1 className="text-2xl sm:text-3xl font-semibold text-gray-200">
        Your Crypto
      </h1>
      {assets.map(({ asset, balance }) => (
        <Link
          to="orders"
          key={asset}
          className="flex justify-between items-center bg-gray-800 hover:bg-gray-700 p-4 rounded-xl text-white shadow-md transition-all duration-300 transform hover:scale-105"
        >
          <span className="font-semibold text-lg">{asset}</span>
          <span className="text-sm text-gray-300">{balance}</span>
        </Link>
      ))}
    </div>
  );
};

export default Inventory;

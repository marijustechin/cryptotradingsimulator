import { useEffect, useMemo } from 'react';
import { useAppSelector, useAppDispatch } from '../../store/store';
import { selectUserAssets, getUserAssets } from '../../store/features/orders/ordersSlice';
import { selectUser } from '../../store/features/user/authSlice';
import { Link } from 'react-router';

const Inventory = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);
  const userAssets = useAppSelector(selectUserAssets);

  // Fetch assets when the component mounts or when the page becomes visible
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
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
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Clean up the event listener when the component is unmounted
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
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
    <div className="mt-4 space-y-2">
      <div>
        <h1>Your Crypto's</h1>
      </div>
      {assets.map(({ asset, balance }) => (
        <Link
          to="orders"
          key={asset}
          className="flex justify-between items-center bg-gray-800 hover:bg-gray-700 p-3 rounded-xl text-white shadow transition"
        >
          <span className="font-semibold">{asset}</span>
          <span className="text-sm text-gray-300">{balance}</span>
        </Link>
      ))}
    </div>
  );
};

export default Inventory;

import useWebSocket from 'react-use-websocket';
import {
  getUserAssets,
  selectUserAssets,
} from '../../store/features/orders/ordersSlice';
import { selectUser } from '../../store/features/user/authSlice';
import { useAppDispatch, useAppSelector } from '../../store/store';
import { WS_URL } from '../../api/ws';
import { useEffect, useState, useMemo } from 'react';
import HelperService from '../../services/HelperService';

interface ILivePrices {
  symbol: string;
  lastPrice: number;
}

export const UserAssets = () => {
  const dispatch = useAppDispatch();
  const userAssets = useAppSelector(selectUserAssets);
  const user = useAppSelector(selectUser);
  const [livePrices, setLivePrices] = useState<ILivePrices[]>([]);

  // Fetch user's asset summary
  useEffect(() => {
    if (!userAssets && user.id) {
      dispatch(getUserAssets({ userId: user.id }));
    }
  }, [dispatch, user.id, userAssets]);

  // WebSocket connection for live prices
  const { sendJsonMessage } = useWebSocket(WS_URL, {
    share: false,
    shouldReconnect: () => true,
    onOpen: () => {
      sendJsonMessage({ type: 'subscribe', role: 'live' });
    },
    onMessage: (event) => {
      const parsedData = JSON.parse(event.data);
      const { symbol, lastPrice } = parsedData.data;

      // Ensure symbol is in "XXXUSDT" format
      const normalizedSymbol = symbol.toUpperCase();

      setLivePrices((prev) => {
        const existingIndex = prev.findIndex(
          (p) => p.symbol === normalizedSymbol
        );
        if (existingIndex !== -1) {
          const updated = [...prev];
          updated[existingIndex] = { symbol: normalizedSymbol, lastPrice };
          return updated;
        } else {
          return [...prev, { symbol: normalizedSymbol, lastPrice }];
        }
      });
    },
  });

  // Map of {symbol -> price}
  const priceMap = useMemo(() => {
    const map = new Map<string, number>();
    livePrices.forEach(({ symbol, lastPrice }) => map.set(symbol, lastPrice));
    return map;
  }, [livePrices]);

  // Build table rows with calculations
  const assetRows = useMemo(() => {
    if (!userAssets) return [];

    return userAssets
      .filter((asset) => asset.balance > 0)
      .map((asset) => {
        const lastPrice = Number(priceMap.get(asset.asset) ?? 0);
        const nav = Number(asset.balance) * lastPrice;
        const pnlAmount = nav - Number(asset.spotCost);
        const pnlPercent =
          Number(asset.spotCost) > 0
            ? (pnlAmount / Number(asset.spotCost)) * 100
            : 0;

        return {
          ...asset,
          lastPrice: lastPrice.toFixed(2),
          netAssetValue: nav.toFixed(2),
          pnlAmount: pnlAmount.toFixed(2),
          pnlPercent: pnlPercent.toFixed(2),
        };
      });
  }, [userAssets, priceMap]);

  return (
    <div>
      <table className='table border-separate border-spacing-y-2 w-full'>
        <thead className='w-full'>
          <tr className='text-white bg-gray-800'>
            <th className='w-1/6'>Asset</th>
            <th className='w-1/6'>Net Asset Value</th>
            <th className='w-1/6'>Balance</th>
            <th className='w-1/6'>Spot Cost</th>
            <th className='w-1/6'>Last Price</th>
            <th className='w-1/6'>PnL</th>
          </tr>
        </thead>
        <tbody className='w-full'>
          <tr className='bg-gray-700'>
            <td className='w-1/6'>USD</td>
            <td className='w-1/6'>
              {HelperService.formatCurrency(Number(user.balance))}
            </td>
            <td className='w-1/6'>
              {HelperService.formatCurrency(Number(user.balance))}
            </td>
            <td className='w-1/6'>—</td>
            <td className='w-1/6'>—</td>
            <td className='w-1/6'>—</td>
          </tr>
          {assetRows.map((row, index) => (
            <tr
              className={index % 2 ? 'bg-gray-700' : 'bg-gray-800'}
              key={row.asset}
            >
              <td>{row.asset}</td>
              <td className='w-1/6'>
                {HelperService.formatCurrency(Number(row.netAssetValue))}
              </td>
              <td>{row.balance}</td>
              <td className='w-1/6'>
                {HelperService.formatCurrency(Number(row.spotCost))}
              </td>
              <td className='w-1/6'>
                {HelperService.formatCurrency(Number(row.lastPrice))}
              </td>
              <td
                className={`w-1/6 ${
                  parseFloat(row.pnlAmount) >= 0
                    ? 'text-green-500'
                    : 'text-red-500'
                }`}
              >
                {HelperService.formatCurrency(Number(row.pnlAmount))} (
                {row.pnlPercent}%)
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

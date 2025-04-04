import useWebSocket from 'react-use-websocket';
import {
  getUserAssets,
  selectUserAssets,
} from '../../store/features/orders/ordersSlice';
import { selectUser } from '../../store/features/user/authSlice';
import { useAppDispatch, useAppSelector } from '../../store/store';
import { WS_URL } from '../../api/ws';
import { useEffect, useState, useMemo } from 'react';
import { DataExport } from './DataExport';

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

    return userAssets.map((asset) => {
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
      <DataExport type='Assets' />
      <table className='table border-separate border-spacing-y-2'>
        <thead>
          <tr className='text-white bg-gray-800'>
            <th>Asset</th>
            <th>Net Asset Value</th>
            <th>Balance</th>
            <th>Spot Cost</th>
            <th>Last Price</th>
            <th>PnL</th>
          </tr>
        </thead>
        <tbody>
          <tr className='bg-gray-700'>
            <td>USD</td>
            <td className='min-w-[80px]'>
              {parseFloat(Number(user.balance).toFixed(2))} USD
            </td>
            <td className='min-w-[80px]'>
              {parseFloat(Number(user.balance).toFixed(2))}
            </td>
            <td>—</td>
            <td>—</td>
            <td>—</td>
          </tr>
          {assetRows.map((row, index) => (
            <tr
              className={index % 2 ? 'bg-gray-700' : 'bg-gray-800'}
              key={row.asset}
            >
              <td>{row.asset}</td>
              <td className='min-w-[80px]'>{row.netAssetValue} USD</td>
              <td>{row.balance}</td>
              <td className='min-w-[80px]'>
                {parseFloat(Number(row.spotCost).toFixed(2))} USD
              </td>
              <td className='min-w-[80px]'>{row.lastPrice} USD</td>
              <td
                className={`min-w-[80px] ${
                  parseFloat(row.pnlAmount) >= 0
                    ? 'text-green-500'
                    : 'text-red-500'
                }`}
              >
                {parseFloat(Number(row.pnlAmount).toFixed(2))} USD (
                {row.pnlPercent}%)
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

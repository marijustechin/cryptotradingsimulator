import { useEffect, useState } from 'react';
import { CryptoAsset } from './CryptoAsset';
import { useAppDispatch, useAppSelector } from '../../store/store';
import {
  getAssets,
  selectAssets,
  updateAssets,
} from '../../store/features/crypto/assetsSlice';
import useWebSocket from 'react-use-websocket';
import { FaSortUp, FaSortDown } from 'react-icons/fa'; // Sorting icons
import { ICryptoAsset } from '../../types/crypto'; // Import type

const WS_URL = 'ws://localhost:3003/ws/crypto';

export const TopCryptos = () => {
  const dispatch = useAppDispatch();
  const assets = useAppSelector(selectAssets) as ICryptoAsset[];
  // Explicitly define type

  // Sorting state
  const [sortField, setSortField] = useState<keyof ICryptoAsset>('rank');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [sortedAssets, setSortedAssets] = useState<ICryptoAsset[]>([]); // Explicit type

  useEffect(() => {
    if (assets?.length === 0) {
      dispatch(getAssets());
    }
  }, [dispatch, assets]);

  // Sort assets when they change or sorting is updated
  useEffect(() => {
    if (assets.length > 0) {
      const sorted = [...assets].sort((a, b) => {
        const aValue = a[sortField] as number | string;
        const bValue = b[sortField] as number | string;

        if (typeof aValue === 'string') {
          return sortOrder === 'asc'
            ? aValue.localeCompare(bValue as string)
            : (bValue as string).localeCompare(aValue);
        }
        return sortOrder === 'asc'
          ? (aValue as number) - (bValue as number)
          : (bValue as number) - (aValue as number);
      });

      setSortedAssets(sorted);
    }
  }, [assets, sortField, sortOrder]);

  useWebSocket(WS_URL, {
    share: false,
    shouldReconnect: () => true,
    onMessage: (event: WebSocketEventMap['message']) => {
      const parsedData = JSON.parse(event.data);
      if (Array.isArray(parsedData)) {
        dispatch(updateAssets([...parsedData].sort((a, b) => a.rank - b.rank)));
      } else {
        console.error('Received data is not an array:', parsedData);
      }
    },
  });

  const handleSorting = (field: keyof ICryptoAsset) => {
    setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    setSortField(field);
  };

  return (
    <div className="p-4 border rounded-lg shadow-lg shadow-violet-700 mx-auto mt-10">
      <p className="text-center">
        Select crypto currency, analize the chart and place an order
      </p>

      {/* Sorting Controls */}
      <div className="flex justify-between p-2 bg-gray-800 rounded-md mb-2 text-white">
        {[
          { key: 'name', label: 'Name' },
          { key: 'priceUsd', label: 'Price (USD)' },
          { key: 'marketCapUsd', label: 'Market Cap' },
          { key: 'changePercent24Hr', label: '24h Change (%)' },
        ].map(({ key, label }) => (
          <button
            key={key}
            onClick={() => handleSorting(key as keyof ICryptoAsset)}
            className="flex items-center gap-1 text-sm font-semibold hover:text-violet-400 transition"
          >
            {label}
            {sortField === key &&
              (sortOrder === 'asc' ? <FaSortUp /> : <FaSortDown />)}
          </button>
        ))}
      </div>

      {/* Table */}
      <table className="table">
        <thead>
          <tr>
            <th>Crypto currency</th>
            <th>Price (USD)</th>
            <th>MarketCap</th>
            <th>24h Change (%)</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {sortedAssets.map((asset) => (
            <CryptoAsset key={asset.id} asset={asset} />
          ))}
        </tbody>
      </table>
    </div>
  );
};

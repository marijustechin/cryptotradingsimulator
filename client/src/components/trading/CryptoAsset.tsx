import { useState } from 'react';
import HelperService from '../../services/HelperService';
import { ICryptoAsset } from '../../types/crypto';
import { IoIosArrowDown, IoIosArrowUp } from 'react-icons/io';
import { PlaceOrderButton } from './PlaceOrderButton';
import { TradeChart } from './TradeChart';
import { useAppDispatch, useAppSelector } from '../../store/store';
import {
  getAssetId,
  setAssetId,
} from '../../store/features/trading/tradeOptionsSlice';

interface IAsset {
  asset: ICryptoAsset;
}

export const CryptoAsset = ({ asset }: IAsset) => {
  const dispatch = useAppDispatch();
  const [isOpened, setIsOpened] = useState(false);
  const assetId = useAppSelector(getAssetId);

  const handleShowChart = (asset_id: string) => {
    if (!isOpened) {
      setIsOpened((prev) => !prev);
      dispatch(setAssetId(asset_id));
    } else {
      setIsOpened((prev) => !prev);
      dispatch(setAssetId(''));
    }
  };

  return (
    <>
      {/* Clickable Row */}
      <tr
        onClick={() => handleShowChart(asset.id)}
        className={`${
          assetId !== asset.id && 'border-b border-violet-800 last:border-none'
        } cursor-pointer hover:bg-violet-950 transition`}
      >
        <td className="py-2">
          {asset.name} ({asset.symbol})
        </td>
        <td>{HelperService.formatCurrency(asset.priceUsd)}</td>
        <td>${(asset.marketCapUsd / 1e9).toFixed(2)}B</td>
        <td
          className={`${
            asset.changePercent24Hr > 0 ? 'text-emerald-500' : 'text-rose-500'
          }`}
        >
          {(Math.round(asset.changePercent24Hr * 1000) / 1000).toFixed(2)}%
        </td>
        <td className="text-violet-300">
          {assetId === asset.id ? (
            <IoIosArrowUp size={20} />
          ) : (
            <IoIosArrowDown size={20} />
          )}
        </td>
      </tr>

      {/* Expanded Row for Buy/Sell Options */}
      {assetId === asset.id && (
        <tr>
          <td colSpan={5} className="py-2">
            <TradeChart />
            <PlaceOrderButton />
          </td>
        </tr>
      )}
    </>
  );
};

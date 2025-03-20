import HelperService from '../../services/HelperService';
import { ICryptoAsset } from '../../types/crypto';
import { TestChart } from './SmallHistoryChart';
import { Link } from 'react-router';

interface IAsset {
  asset: ICryptoAsset;
}

export const Coin = ({ asset }: IAsset) => {
  return (
    <div className="grid grid-cols-[0.7fr_1fr_0.8fr_1.5fr_1fr] md:text-lg text-xs p-3 text-white">
      <div className="text-left place-content-center">{asset.name}</div>
      <div className="place-content-center">
        {HelperService.formatCurrency(asset.priceUsd)}
      </div>
      <div
        className={`${
          asset.changePercent24Hr > 0 ? 'text-emerald-500' : 'text-rose-500'
        } place-content-center`}
      >
        {(Math.round(asset.changePercent24Hr * 1000) / 1000).toFixed(2)}%
      </div>
      <TestChart asset_id={asset.id} />
      <div className="place-content-center">
        <Link to="/registration">Trade now -{'>'}</Link>
      </div>
    </div>
  );
};

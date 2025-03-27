import HelperService from '../../services/HelperService';
import { TestChart } from './SmallHistoryChart';
import { Link } from 'react-router';

interface ICoinProps {
  asset: { name: string; code: string; price: number; priceChange: number };
}

export const Coin = ({ asset }: ICoinProps) => {
  return (
    <div className="grid grid-cols-[0.5fr_1.3fr_0.9fr_1.3fr_1fr] md:grid-cols-[0.7fr_1fr_0.8fr_1.5fr_1fr] md:text-lg text-xs  p-3 ext-white">
      <div className="text-left place-content-center">
        {/* Show symbol on small screens */}
        <div className="block md:hidden">{asset.code}</div>

        {/* Show name on md and up */}
        <div className="hidden md:block">{asset.name}</div>
      </div>
      <div className="place-content-center">
        {HelperService.formatCurrency(asset.price)}
      </div>
      <div
        className={`${
          asset.priceChange > 0 ? 'text-emerald-500' : 'text-rose-500'
        } place-content-center`}
      >
        {asset.priceChange}%
      </div>
      {/* <TestChart asset_id={asset.id} /> */}
      <div className="place-content-center">
        <Link
          to="/registration"
          className="text-white hover:bg-clip-text hover:text-transparent hover:bg-gradient-to-r hover:from-purple-500 hover:to-blue-500"
        >
          Trade now -{'>'}
        </Link>
      </div>
    </div>
  );
};

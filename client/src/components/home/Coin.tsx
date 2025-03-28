import HelperService from '../../services/HelperService';
import { Link } from 'react-router';
import { ITicker } from '../../types/tradingN';

interface ICoinProps {
  asset: ITicker;
  chartData: { price: number }[]; // pridėta
}

export const Coin = ({ asset}: ICoinProps) => {
  return (
    <div className="grid grid-cols-[0.8fr_1.9fr_1.3fr_1.5fr_1fr] items-center py-4 px-2 text-white text-sm md:text-base">
<div className="font-bold text-violet-400">{asset.symbol.slice(0, 3)}</div>

      <div className="text-white">{HelperService.formatCurrency(asset.lastPrice)}</div>

  <div className={`${asset.price24hPcnt >= 0 ? 'text-green-500' : 'text-red-500'}`}>
  {asset.price24hPcnt > 0 ? '+' : ''}
  {Math.round(asset.price24hPcnt * 100) / 100}%
</div>


<div className='place-content-center text-violet-500'>
        {Math.round(asset.usdIndexPrice * 100) / 100}
      </div>
        
        <Link
          to="/registration"
          className="text-white hover:bg-gradient-to-r hover:from-purple-500 hover:to-blue-500 hover:text-transparent bg-clip-text transition text-center"
        >
          Trade Now →
        </Link>
    </div>
  );
};

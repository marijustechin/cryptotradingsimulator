import HelperService from '../../services/HelperService';
import { Link } from 'react-router';
import { ITicker } from '../../types/tradingN';

interface ICoinProps {
  asset: ITicker;
}

export const Coin = ({ asset }: ICoinProps) => {
  return (
    <div className='grid grid-cols-[0.5fr_1.3fr_0.9fr_1.3fr_1fr] md:grid-cols-[0.7fr_1fr_0.8fr_1.5fr_1fr] md:text-lg text-xs  p-3 ext-white'>
      <div className='text-left place-content-center'>
        {/* Show symbol on small screens */}
        <div className='block md:hidden'>{asset.symbol}</div>

        {/* Show name on md and up */}
        <div className='hidden md:block'>{asset.symbol}</div>
      </div>
      <div className='place-content-center text-amber-500'>
        {HelperService.formatCurrency(asset.lastPrice)}
      </div>
      <div
        className={`${
          asset.price24hPcnt > 0 ? 'text-emerald-500' : 'text-rose-500'
        } place-content-center`}
      >
        {asset.price24hPcnt}%
      </div>
      <div className='place-content-center text-violet-500'>
        {Math.round(asset.usdIndexPrice * 1000) / 1000}
      </div>
      <div className='place-content-center'>
        <Link
          to='/registration'
          className='text-white hover:bg-clip-text hover:text-transparent hover:bg-gradient-to-r hover:from-purple-500 hover:to-blue-500'
        >
          Trade now -{'>'}
        </Link>
      </div>
    </div>
  );
};

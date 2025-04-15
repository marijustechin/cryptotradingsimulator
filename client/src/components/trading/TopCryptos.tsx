import { TickersN } from './TickersN';
import { IntervalSelector } from './IntervalSelector';
import { CryptoSelector } from './CryptoSelectorN';
import { LightWeightChart } from './LightWeightChart';
import { PlaceOrderButton } from '../orders/PlaceOrderButton';
import { TradingOptions } from './TradingOptions';
import { useAppSelector } from '../../store/store';
import { selectTradingOptions } from '../../store/features/trading/tradingOptionsSlice';

export const TopCryptos = () => {
  const tradeOptions = useAppSelector(selectTradingOptions);
  return (
    <div className='flex flex-col gap-4 rounded-xl w-full'>
      <h1 className='text-center'>Spot Trading</h1>
      <TickersN />

      {/* Spot Trading Section */}
      <div className='flex flex-col gap-3 items-center text-center lg:flex-row lg:text-left'>
        <p className='text-xs lg:text-sm text-violet-400 px-4'>
          Selected order type:{' '}
          <span className='text-violet-50 ml-1'>
            {tradeOptions.orderType.toUpperCase()}
          </span>{' '}
          , order direction:
          <span
            className={`ml-1 font-bold ${
              tradeOptions.orderDirection === 'buy'
                ? 'text-emerald-500'
                : 'text-rose-500'
            }`}
          >
            {tradeOptions.orderDirection.toUpperCase()}
          </span>
        </p>
      </div>

      {/* Trading Options Section */}
      <div className='flex flex-col gap-3 lg:flex-row lg:gap-5 justify-between items-center bg-gray-800 p-3 lg:p-4 rounded-lg shadow-md w-full'>
        <CryptoSelector />
        <IntervalSelector />
        <TradingOptions />
      </div>

      {/* Chart Section */}
      <div className='bg-gray-800 p-3 lg:p-4 rounded-lg shadow-md w-full'>
        <LightWeightChart />
      </div>

      {/* Place Order Button Section */}
      <div className='flex justify-center mt-3 lg:mt-4 w-full pb-4'>
        <PlaceOrderButton />
      </div>
    </div>
  );
};

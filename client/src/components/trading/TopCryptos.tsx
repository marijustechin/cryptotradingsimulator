import { TickersN } from './TickersN';
import { TradingChartN } from './TradingChartN';
import { IntervalSelector } from './IntervalSelector';
import { CryptoSelector } from './CryptoSelectorN';
import { LightWeightChart } from './LightWeightChart';
import { PlaceOrderButton } from './PlaceOrderButton';
import { TradingOptions } from './TradingOptions';
import { useAppSelector } from '../../store/store';
import { selectTradingOptions } from '../../store/features/trading/tradingOptionsSlice';

export const TopCryptos = () => {
  const tradeOptions = useAppSelector(selectTradingOptions);
  return (
    <div className='flex flex-col gap-3'>
      <TickersN />
      <div className='flex gap-3 items-center'>
        <h3 className='text-2xl text-violet-300'>Spot Trading</h3>
        <p className='text-sm text-violet-400'>
          Selected order type:{' '}
          <span className='text-violet-50'>
            {tradeOptions.orderType.toLocaleUpperCase()}
          </span>{' '}
          , order dircection:{' '}
          <span
            className={`${
              tradeOptions.orderDirection === 'buy'
                ? 'text-emerald-500'
                : 'text-rose-500'
            }`}
          >
            {tradeOptions.orderDirection.toLocaleUpperCase()}
          </span>
        </p>
      </div>

      <div className='flex gap-5'>
        <CryptoSelector />
        <IntervalSelector />
        <TradingOptions />
      </div>
      <LightWeightChart />
      <PlaceOrderButton />
      <TradingChartN />
    </div>
  );
};

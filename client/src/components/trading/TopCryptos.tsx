import { TickersN } from './TickersN';
import { TradingChartN } from './TradingChartN';
import { IntervalSelector } from './IntervalSelector';
import { CryptoSelector } from './CryptoSelectorN';
import { LightWeightChart } from './LightWeightChart';
import { PlaceOrderButton } from './PlaceOrderButton';

export const TopCryptos = () => {
  return (
    <div className='flex flex-col gap-3'>
      <TickersN />
      <TradingChartN />
      <div className='flex gap-5'>
        <IntervalSelector />
        <CryptoSelector />
      </div>
      <LightWeightChart />
      <PlaceOrderButton />
    </div>
  );
};

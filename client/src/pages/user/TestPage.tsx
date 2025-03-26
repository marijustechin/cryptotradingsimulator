import { CryptoSelector } from '../../components/trading/CryptoSelectorN';
import { IntervalSelector } from '../../components/trading/IntervalSelector';
import { LightWeightChart } from '../../components/trading/LightWeightChart';
import { PlaceOrderButton } from '../../components/trading/PlaceOrderButton';
import { TickersN } from '../../components/trading/TickersN';
import { TradingChartN } from '../../components/trading/TradingChartN';

export const TestPage = () => {
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

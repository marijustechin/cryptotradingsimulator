import { LightWeightChart } from '../../components/trading/LightWeightChart';
import { TickersN } from '../../components/trading/TickersN';
import { TradingChartN } from '../../components/trading/TradingChartN';

export const TestPage = () => {
  return (
    <div className="flex flex-col gap-3">
      <TickersN />
      <TradingChartN />
      <LightWeightChart />
    </div>
  );
};

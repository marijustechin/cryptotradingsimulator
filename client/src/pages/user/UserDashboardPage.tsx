import { ChartCandles } from '../../components/trading/ChartCandles';
import { IntervalSelector } from '../../components/trading/IntervalSelector';
import { PlaceOrderButton } from '../../components/trading/PlaceOrderButton';
import { TradingOptions } from '../../components/trading/TradingOptions';

export const UserDashboardPage = () => {
  return (
    <main>
      <h1>User Dashboard</h1>
      <p>Čia turi būti naudotojo informacijos suvestinė</p>
      <div className="flex flex-col gap-3">
        <TradingOptions />
        <div className="flex gap-5">
          <IntervalSelector /> <div>Cia bus valiutos pasirinkimas</div>
        </div>

        <ChartCandles />
        <PlaceOrderButton />
      </div>
    </main>
  );
};

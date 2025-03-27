import { TickersN } from "./TickersN";
import { IntervalSelector } from "./IntervalSelector";
import { CryptoSelector } from "./CryptoSelectorN";
import { LightWeightChart } from "./LightWeightChart";
import { PlaceOrderButton } from "./PlaceOrderButton";
import { TradingOptions } from "./TradingOptions";
import { useAppSelector } from "../../store/store";
import { selectTradingOptions } from "../../store/features/trading/tradingOptionsSlice";

export const TopCryptos = () => {
  const tradeOptions = useAppSelector(selectTradingOptions);
  return (
    <div className="flex flex-col gap-4 p-6 bg-gray-900 rounded-xl shadow-lg">
      <TickersN />
      <div className="flex gap-3 items-center">
        <h3 className="text-2xl text-violet-300 font-semibold">Spot Trading</h3>
        <p className="text-sm text-violet-400">
          Selected order type:
          <span className="text-violet-50 ml-1">
            {tradeOptions.orderType.toUpperCase()}
          </span>
          , order direction:
          <span
            className={`ml-1 font-bold ${
              tradeOptions.orderDirection === "buy"
                ? "text-emerald-500"
                : "text-rose-500"
            }`}
          >
            {tradeOptions.orderDirection.toUpperCase()}
          </span>
        </p>
      </div>

      <div className="flex gap-5 justify-between items-center bg-gray-800 p-4 rounded-lg shadow-md">
        <CryptoSelector />
        <IntervalSelector />
        <TradingOptions />
      </div>

      <div className="bg-gray-800 p-4 rounded-lg shadow-md">
        <LightWeightChart />
      </div>

      <div className="flex justify-center mt-4">
        <PlaceOrderButton />
      </div>
    </div>
  );
};

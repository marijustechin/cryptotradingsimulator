import {
  selectTradeOptions,
  setAmount,
  setTriggerPrice,
} from '../../store/features/trading/tradeOptionsSlice';
import { useAppDispatch, useAppSelector } from '../../store/store';

export const PlaceOrderButton = () => {
  const dispatch = useAppDispatch();
  const tradeOptions = useAppSelector(selectTradeOptions);

  const handlePlaceOrder = async () => {
    // cia turim patikrinti:
    // 1. ar naudotojas turi pakankamai lesu
    // 2. jeigu direction 'sell', ar turi toki asseta savo portfelyje
    // Jei yra bedu, metam modal pranesima apie negalima sandori

    // tik jeigu viskas ok,
    // 1. rasom i duomenu baze per OrderService
    // 2. nuskaiciuojam pinigus arba valiuta
    // 3. atstatom kai kurias tradeOptions reiksmes
    // 4. toast mesidza apie sekminga sandori
    console.log(tradeOptions);
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-3">
        <div className="flex gap-2 items-center">
          <label
            className="text-sm text-violet-300"
            htmlFor={'amount' + tradeOptions.assetId}
          >
            Amount:
          </label>
          <input
            id={'amount' + tradeOptions.assetId}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              dispatch(setAmount(Number(e.target.value)))
            }
            className="py-1 px-2 border border-violet-700 rounded-lg focus:outline-none max-w-30"
            type="number"
            min={0.01}
          />
        </div>
        {tradeOptions.orderType === 'limit' && (
          <div className="flex gap-2 items-center">
            <label
              className="text-sm text-violet-300"
              htmlFor={'triggerPrice' + tradeOptions.assetId}
            >
              Trigger Price:
            </label>
            <input
              id={'triggerPrice' + tradeOptions.assetId}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                dispatch(setTriggerPrice(Number(e.target.value)))
              }
              className="py-1 px-2 border border-violet-700 rounded-lg focus:outline-none max-w-30"
              type="number"
              min={0.01}
            />
          </div>
        )}
      </div>

      <button
        onClick={handlePlaceOrder}
        className={`${
          tradeOptions.orderDirection === 'buy'
            ? 'bg-emerald-500 border-emerald-500'
            : 'bg-rose-500 border-rose-500'
        } min-w-40 px-2 py-1 rounded-lg border cursor-pointer`}
      >
        {tradeOptions.orderDirection.toLocaleUpperCase()}{' '}
      </button>
    </div>
  );
};

import $api from "../../api/axios";
import { useAppDispatch, useAppSelector } from "../../store/store";
import {
  selectTradingOptions,
  setAmount,
  setTriggerPrice,
} from "../../store/features/trading/tradingOptionsSlice";
import {
  getChartSymbol,
  getCurrentPrices,
  getSelectedSymbolData,
} from "../../store/features/trading/chartSlice";
import { toast } from "react-hot-toast";
import HelperService from "../../services/HelperService";


export const PlaceOrderButton = () => {
  const dispatch = useAppDispatch();
  const tradingOptions = useAppSelector(selectTradingOptions);
  const selectedCrypto = useAppSelector(getChartSymbol);
  const currentPrices = useAppSelector(getCurrentPrices);
  const cryptoData = useAppSelector(getSelectedSymbolData);

      // cia turim patikrinti:
    // 1. ar naudotojas turi pakankamai lesu
    // 2. jeigu direction 'sell', ar turi toki asseta savo portfelyje
    // Jei yra bedu, metam modal pranesima apie negalima sandori
      // tik jeigu viskas ok,
    // 1. rasom i duomenu baze per OrderService
    // 2. nuskaiciuojam pinigus arba valiuta
    // 3. atstatom kai kurias tradeOptions reiksmes
    // 4. toast mesidza apie sekminga sandori


  const handlePlaceOrder = async () => {
    try {
      const { amount, orderType, orderDirection, triggerPrice } =
        tradingOptions;

      const assetId = selectedCrypto;
      const price =
        orderType === "limit"
          ? triggerPrice
          : currentPrices?.lastPrice

        if(amount <= 0 && triggerPrice <= 0) {
          toast.error(`Enter Amount or Trigger Price`)
        }

        if(!amount || !triggerPrice) {
          toast.error("Missing required fields");
        }


      await $api.post("/trade", {
        assetId,
        amount,
        ord_type: orderType,
        ord_direct: orderDirection,
        price,
      });

      dispatch(setAmount(0));
      dispatch(setTriggerPrice(0));
      toast.success("Order placed successfully!");
    } catch (err: unknown) {
      console.error("Atsakas iš API", HelperService.errorToString(err));
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-3">
        <div className="flex gap-2 items-center">
          <label
            className="text-sm text-violet-300"
            htmlFor={"amount" + tradingOptions.orderType}
          >
            Amount:
          </label>
          <input
            id={"amount" + tradingOptions.orderDirection}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              dispatch(setAmount(Number(e.target.value)))
            }
            className="py-1 px-2 border border-violet-700 rounded-lg focus:outline-none max-w-30"
            type="number"
            value={tradingOptions.amount}
            min={0.01}
          />
        </div>
        {tradingOptions.orderType === "limit" && (
          <div className="flex gap-2 items-center">
            <label
              className="text-sm text-violet-300"
              htmlFor={"triggerPrice" + "xml"}
            >
              Trigger Price:
            </label>
            <input
              id={"triggerPrice" + "single"}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                dispatch(setTriggerPrice(Number(e.target.value)))
              }
              className="py-1 px-2 border border-violet-700 rounded-lg focus:outline-none max-w-30"
              type="number"
              min={0.01}
              value={tradingOptions.triggerPrice}
            />
          </div>
        )}
      </div>

      <button
        onClick={handlePlaceOrder}
        className={`${
          tradingOptions.orderDirection === "buy"
            ? "bg-emerald-500 border-emerald-500"
            : "bg-rose-500 border-rose-500"
        } min-w-40 px-2 py-1 rounded-lg border cursor-pointer text-violet-950 text-xl`}
      >
        {tradingOptions.orderDirection === "buy"
          ? `Buy Long ${cryptoData?.name} (${cryptoData?.code})`
          : `Sell Short ${cryptoData?.name} (${cryptoData?.code})`}
      </button>
    </div>
  );
};

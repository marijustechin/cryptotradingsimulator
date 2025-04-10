import { useAppDispatch, useAppSelector } from '../../store/store';
import {
  selectTradingOptions,
  setAmount,
  setTriggerPrice,
} from '../../store/features/trading/tradingOptionsSlice';
import {
  getChartSymbol,
  getCurrentPrices,
  getSelectedSymbolData,
} from '../../store/features/trading/chartSlice';
import { toast } from 'react-hot-toast';
import HelperService from '../../services/HelperService';
import {
  selectUser,
  setUserBalance,
  selectUserBalance,
  fetchUserInfo,
} from '../../store/features/user/authSlice';
import OrdersService from '../../services/OrdersService';
import {
  getOpenOrders,
  getUserAssets,
  selectUserAssets,
} from '../../store/features/orders/ordersSlice';

export const PlaceOrderButton = () => {
  const dispatch = useAppDispatch();
  const tradingOptions = useAppSelector(selectTradingOptions);
  const selectedCrypto = useAppSelector(getChartSymbol);
  const currentPrices = useAppSelector(getCurrentPrices);
  const cryptoData = useAppSelector(getSelectedSymbolData);
  const user = useAppSelector(selectUser);
  const order = useAppSelector(selectUserAssets);
  const balance = useAppSelector(selectUserBalance);

  const handlePlaceOrder = async () => {
    // 0. Sistemos testas
    if (user?.balance === undefined || user?.balance === null) {
      toast.error('System error');
      return;
    }

    console.log(user);

    // 1. Ar ivestas kiekis?
    if (tradingOptions.amount === 0) {
      toast.error('Amount cannot be empty');
      return;
    }

    // jei vartotojas daro limit orderi
    // tikrina ar triggerPrice uzteks turimo balanso.
    if (
      tradingOptions.orderDirection === 'buy' &&
      tradingOptions.orderType === 'limit' &&
      user?.balance !== undefined &&
      user?.balance < tradingOptions.amount * tradingOptions.triggerPrice
    ) {
      toast.error('Insufficient funds for limit order');
      return;
    }

    // 2. Jei sandoris 'limit' ar ivesta trigger kaina?
    // jei kaina neivesta, darom lastPrice
    if (
      tradingOptions.triggerPrice === 0 &&
      tradingOptions.orderType === 'limit'
    ) {
      dispatch(setTriggerPrice(currentPrices?.lastPrice));
    }

    // 4. Jei parduoda, ar turi tokia valiuta?
    if (tradingOptions.orderDirection === 'sell') {
      const assets = await dispatch(
        getUserAssets({ userId: user.id })
      ).unwrap();

      const isHaveAsset = assets.some(
        (asset) => asset.asset === selectedCrypto
      );

      if (!isHaveAsset) {
        toast.error("You don't have this asset to sell");
        return;
      }
    }

    try {
      // bandom irasyti sandori
      if (currentPrices?.lastPrice && user.id) {
        const response = await OrdersService.placeOrder(
          selectedCrypto,
          tradingOptions.amount,
          tradingOptions.orderDirection,
          tradingOptions.orderType,
          currentPrices?.lastPrice,
          user.id,
          tradingOptions.triggerPrice
        );

        toast.success(response);
        if (tradingOptions.orderType === 'market') {
          dispatch(setUserBalance(balance));
          await dispatch(fetchUserInfo());
          return;
        } else if (tradingOptions.orderType === 'limit') {
          dispatch(setUserBalance(balance));
          await dispatch(fetchUserInfo());
          return;
        }
        dispatch(getOpenOrders({ userId: user.id }));
        dispatch(setAmount(0));
        dispatch(setTriggerPrice(0));
      }
    } catch (err: unknown) {
      console.error('Atsakas iš API', HelperService.errorToString(err));
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-col sm:flex-row sm:gap-3 gap-2">
        <div className="flex gap-2 items-center">
          <label
            className="text-sm text-violet-300"
            htmlFor={'amount' + tradingOptions.orderType}
          >
            Amount:
          </label>
          <input
            id={'amount' + tradingOptions.orderType}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              dispatch(setAmount(Number(e.target.value)))
            }
            className="py-1 px-2 border border-violet-700 rounded-lg focus:outline-none max-w-30"
            type="number"
            value={tradingOptions.amount}
            min={0.01}
          />
        </div>
        {tradingOptions.orderType === 'limit' && (
          <div className="flex gap-2 items-center">
            <label
              className="text-sm text-violet-300"
              htmlFor={'triggerPrice' + 'xml'}
            >
              Trigger Price:
            </label>
            <input
              id={'triggerPrice' + 'xml'}
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

      {/* <!-- Mobile Button --> */}
      <button
        onClick={handlePlaceOrder}
        className={`
    ${
      tradingOptions.orderDirection === 'buy'
        ? 'bg-emerald-500 border-emerald-500'
        : 'bg-rose-500 border-rose-500'
    }
    min-w-20 px-1 py-0.5 rounded-lg border cursor-pointer text-violet-950 text-sm
    sm:hidden
  `}
      >
        {tradingOptions.orderDirection === 'buy'
          ? `Buy ${cryptoData?.name}`
          : `Sell ${cryptoData?.name}`}
      </button>

      {/* <!-- Desktop Button --> */}
      <button
        onClick={handlePlaceOrder}
        className={`
    ${
      tradingOptions.orderDirection === 'buy'
        ? 'bg-emerald-500 border-emerald-500'
        : 'bg-rose-500 border-rose-500'
    }
    min-w-40 px-2 py-1 rounded-lg border cursor-pointer text-violet-950 text-xl
    hidden sm:block
  `}
      >
        {tradingOptions.orderDirection === 'buy'
          ? `Buy Long ${cryptoData?.name} (${cryptoData?.code})`
          : `Sell Short ${cryptoData?.name} (${cryptoData?.code})`}
      </button>
    </div>
  );
};

import { useAppDispatch, useAppSelector } from '../../store/store';
import {
  selectTradingOptions,
  setAmount,
  setTriggerPrice,
  setValue,
} from '../../store/features/trading/tradingOptionsSlice';
import {
  getChartSymbol,
  getCurrentPrices,
  getSelectedSymbolData,
} from '../../store/features/trading/chartSlice';
import { toast } from 'react-hot-toast';
import HelperService from '../../services/HelperService';
import { selectUser, fetchUserInfo } from '../../store/features/user/authSlice';
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
  const userAssets = useAppSelector(selectUserAssets);

  const handlePlaceOrder = async () => {
    // 0. Sistemos testas
    if (user?.balance === undefined || user?.balance === null) {
      toast.error('System error');
      return;
    }

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
    if (tradingOptions.orderDirection === 'sell' && user.id) {
      if (!userAssets) {
        await dispatch(getUserAssets({ userId: user.id }));
      }

      if (userAssets && userAssets.length > 0) {
        const userAsset = userAssets.find((a) => a.asset === selectedCrypto);
        if (userAsset && userAsset.balance < tradingOptions.amount) {
          toast.error('Trying to sell more than you have. Check the amount');
          return;
        }
      } else {
        toast.error("You don't have this asset");
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
        // 1. Atnaujinam naudotojo balansa
        await dispatch(fetchUserInfo());

        dispatch(getUserAssets({ userId: user.id }));
        dispatch(getOpenOrders({ userId: user.id }));

        // Atnaujinam formos laukus
        dispatch(setValue(0));
        dispatch(setAmount(0));
        dispatch(setTriggerPrice(0));
      }
    } catch (err: unknown) {
      console.error('Atsakas iš API', HelperService.errorToString(err));
    }
  };

  const handleAmountChange = (amount: number) => {
    dispatch(setAmount(amount));
    const price = currentPrices?.lastPrice;
    if (price) {
      dispatch(setValue(Number(amount * price)));
    }
  };

  const handleValueChange = (value: number) => {
    dispatch(setValue(value));
    const price = currentPrices?.lastPrice;
    if (price) {
      dispatch(setAmount(value / price));
    }
  };

  return (
    <div className='flex flex-col gap-2'>
      <div className='flex flex-col sm:flex-row sm:gap-3 gap-2'>
        <div className='flex gap-2 items-center'>
          <label
            className='text-sm text-violet-300'
            htmlFor={'amount' + tradingOptions.orderType}
          >
            Amount:
          </label>
          <input
            id={'amount' + tradingOptions.orderType}
            onChange={(e) => handleAmountChange(Number(e.target.value))}
            className='py-1 px-2 border border-violet-700 rounded-lg focus:outline-none max-w-30'
            type='number'
            value={tradingOptions.amount}
            min={0.01}
            step={0.01}
          />
        </div>

        <div className='flex gap-2 items-center'>
          <label
            className='text-sm text-violet-300'
            htmlFor={'amount' + tradingOptions.orderType}
          >
            Value:
          </label>
          <input
            id={'value' + tradingOptions.orderType}
            onChange={(e) => handleValueChange(Number(e.target.value))}
            className='py-1 px-2 border border-violet-700 rounded-lg focus:outline-none max-w-30'
            type='number'
            value={tradingOptions.value}
            min={0.01}
            step={0.01}
          />
        </div>
        {tradingOptions.orderType === 'limit' && (
          <div className='flex gap-2 items-center'>
            <label
              className='text-sm text-violet-300'
              htmlFor={'triggerPrice' + 'xml'}
            >
              Trigger Price:
            </label>
            <input
              id={'triggerPrice' + 'xml'}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                dispatch(setTriggerPrice(Number(e.target.value)))
              }
              className='py-1 px-2 border border-violet-700 rounded-lg focus:outline-none max-w-30'
              type='number'
              min={0.01}
              step={0.01}
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

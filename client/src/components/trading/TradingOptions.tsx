import {
  selectTradingOptions,
  setOrderDirection,
  setOrderType,
} from '../../store/features/trading/tradingOptionsSlice';
import { useAppDispatch, useAppSelector } from '../../store/store';

export const TradingOptions = () => {
  const dispatch = useAppDispatch();
  const tradeOptions = useAppSelector(selectTradingOptions);

  return (
    <div className='flex gap-4 items-center'>
      <div>
        <div className='flex flex-col'></div>
        {/* sandorio tipo mygtukai */}
        <div className='flex gap-2'>
          <button
            onClick={() => dispatch(setOrderType('limit'))}
            className={`${
              tradeOptions.orderType === 'limit'
                ? 'border-violet-700 bg-violet-800/40'
                : 'bg-transparent border-violet-900'
            } border px-2 py-1 cursor-pointer rounded-lg hover:bg-violet-800/20`}
          >
            Limit
          </button>
          <button
            onClick={() => dispatch(setOrderType('market'))}
            className={`${
              tradeOptions.orderType === 'market'
                ? 'border-violet-700 bg-violet-800/40'
                : 'bg-transparent border-violet-900'
            } border px-2 py-1 cursor-pointer rounded-lg hover:bg-violet-800/20`}
          >
            Market
          </button>
          {/* sandorio kryptis */}
          <div className='flex gap-2 items-center'>
            <button
              onClick={() => dispatch(setOrderDirection('buy'))}
              className={`${
                tradeOptions.orderDirection === 'buy'
                  ? 'bg-emerald-500 text-violet-950'
                  : ''
              } min-w-20 px-2 py-1 border border-emerald-500 rounded-lg cursor-pointer`}
            >
              Buy
            </button>
            <button
              onClick={() => dispatch(setOrderDirection('sell'))}
              className={`${
                tradeOptions.orderDirection === 'sell'
                  ? 'bg-rose-500 text-violet-950'
                  : ''
              } min-w-20 px-2 py-1 border border-rose-500 rounded-lg cursor-pointer`}
            >
              Sell
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

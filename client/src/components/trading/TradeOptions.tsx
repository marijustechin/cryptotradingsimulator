import { useAppDispatch, useAppSelector } from '../../store/store';
import {
  setOrderDirection,
  setOrderType,
} from '../../store/features/trading/tradeOptionsSlice';
import { selectTradingOptions } from '../../store/features/trading/tradingOptionsSlice';

export const TradeOptions = () => {
  const dispatch = useAppDispatch();
  const tradingOptions = useAppSelector(selectTradingOptions);

  return (
    <div className="flex gap-4 items-center">
      <p className="text-2xl text-violet-300">Spot</p>
      <div>
        <div className="flex flex-col"></div>
        <div>
          <p className="text-sm text-violet-400">
            Selected order type:{' '}
            <span className="text-violet-50">
              {tradingOptions.orderType.toLocaleUpperCase()}
            </span>{' '}
            , order dircection:{' '}
            <span
              className={`${
                tradingOptions.orderDirection === 'buy'
                  ? 'text-emerald-500'
                  : 'text-rose-500'
              }`}
            >
              {tradingOptions.orderDirection.toLocaleUpperCase()}
            </span>
          </p>
        </div>
        {/* sandorio tipo mygtukai */}
        <div className="flex gap-2">
          <button
            onClick={() => dispatch(setOrderType('limit'))}
            className={`${
              tradingOptions.orderType === 'limit'
                ? 'border-violet-700 bg-violet-800/40'
                : 'bg-transparent border-violet-900'
            } border px-2 py-1 cursor-pointer rounded-lg hover:bg-violet-800/20`}
          >
            Limit
          </button>
          <button
            onClick={() => dispatch(setOrderType('market'))}
            className={`${
              tradingOptions.orderType === 'market'
                ? 'border-violet-700 bg-violet-800/40'
                : 'bg-transparent border-violet-900'
            } border px-2 py-1 cursor-pointer rounded-lg hover:bg-violet-800/20`}
          >
            Market
          </button>
          {/* sandorio kryptis */}
          <div className="flex gap-2 items-center">
            <button
              onClick={() => dispatch(setOrderDirection('buy'))}
              className={`${
                tradingOptions.orderDirection === 'buy'
                  ? 'bg-emerald-500 text-violet-950'
                  : ''
              } min-w-20 px-2 py-1 border border-emerald-500 rounded-lg cursor-pointer`}
            >
              Buy
            </button>
            <button
              onClick={() => dispatch(setOrderDirection('sell'))}
              className={`${
                tradingOptions.orderDirection === 'sell'
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

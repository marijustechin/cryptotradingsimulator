import { useAppDispatch, useAppSelector } from '../../store/store';
import {
  selectTradeOptions,
  setOrderDirection,
  setOrderType,
} from '../../store/features/trading/tradeOptionsSlice';

export const SelectOptions = () => {
  const dispatch = useAppDispatch();
  const tradeOptions = useAppSelector(selectTradeOptions);

  return (
    <div className='flex gap-4 items-center'>
      <p className='text-2xl text-violet-300'>Spot</p>
      <div>
        <div className='flex flex-col'></div>
        <div>
          <p className='text-sm text-violet-400'>
            Selected order type:{' '}
            <span className='text-violet-50'>
              {tradeOptions.orderType.toLocaleUpperCase()}
            </span>{' '}
            , order dircection:{' '}
            <span
              className={`${
                tradeOptions.orderDirection === 'buy'
                  ? 'text-emerald-500'
                  : 'text-rose-500'
              }`}
            >
              {tradeOptions.orderDirection.toLocaleUpperCase()}
            </span>
          </p>
        </div>
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
                tradeOptions.orderDirection === 'buy' ? 'bg-emerald-500 ' : ''
              } min-w-20 px-2 py-1 border border-emerald-500 rounded-lg cursor-pointer`}
            >
              Buy
            </button>
            <button
              onClick={() => dispatch(setOrderDirection('sell'))}
              className={`${
                tradeOptions.orderDirection === 'sell' ? 'bg-rose-500 ' : ''
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

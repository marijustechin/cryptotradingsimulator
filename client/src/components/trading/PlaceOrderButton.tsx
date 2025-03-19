import {
  selectTradeOptions,
  setAmount,
  setTriggerPrice,
} from '../../store/features/trading/tradeOptionsSlice';
import { useAppDispatch, useAppSelector } from '../../store/store';

export const PlaceOrderButton = () => {
  const dispatch = useAppDispatch();
  const tradeOptions = useAppSelector(selectTradeOptions);

  return (
    <div className='flex flex-col gap-2'>
      <div className='flex gap-3'>
        <div className='flex gap-2 items-center'>
          <label className='text-sm text-violet-300' htmlFor='amount'>
            Amount:
          </label>
          <input
            name='amount'
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              dispatch(setAmount(Number(e.target.value)))
            }
            className='py-1 px-2 border border-violet-700 rounded-lg focus:outline-none max-w-30'
            type='number'
            min={0.01}
          />
        </div>
        {tradeOptions.orderType === 'limit' && (
          <div className='flex gap-2 items-center'>
            <label className='text-sm text-violet-300' htmlFor='triggerPrice'>
              Trigger Price:
            </label>
            <input
              name='triggerPrice'
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                dispatch(setTriggerPrice(Number(e.target.value)))
              }
              className='py-1 px-2 border border-violet-700 rounded-lg focus:outline-none max-w-30'
              type='number'
              min={0.01}
            />
          </div>
        )}
      </div>

      <button
        className={`${
          tradeOptions.orderDirection === 'buy'
            ? 'bg-emerald-500 border-emerald-500'
            : 'bg-rose-500 border-rose-500'
        } min-w-40 px-2 py-1 rounded-lg border cursor-pointer`}
      >
        {tradeOptions.orderDirection.toLocaleUpperCase()}{' '}
        {tradeOptions.currency.toLocaleUpperCase()}
      </button>
    </div>
  );
};

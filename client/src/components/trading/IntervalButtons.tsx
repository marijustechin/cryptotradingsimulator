import {
  getHistoryInterval,
  setHistoryInterval,
} from '../../store/features/trading/tradeOptionsSlice';
import { useAppDispatch, useAppSelector } from '../../store/store';

export const IntervalButtons = () => {
  const dispatch = useAppDispatch();
  const historyInterval = useAppSelector(getHistoryInterval);

  return (
    <div className='flex gap-2'>
      <button
        onClick={() => dispatch(setHistoryInterval('m1'))}
        className={`${
          historyInterval === 'm1'
            ? 'border-violet-500 bg-violet-500'
            : 'border-violet-700'
        } cursor-pointer px-2 py-1 border rounded-lg`}
      >
        m1
      </button>
      <button
        onClick={() => dispatch(setHistoryInterval('m5'))}
        className={`${
          historyInterval === 'm5'
            ? 'border-violet-500 bg-violet-500'
            : 'border-violet-700'
        } cursor-pointer px-2 py-1 border rounded-lg`}
      >
        m5
      </button>
      <button
        onClick={() => dispatch(setHistoryInterval('m15'))}
        className={`${
          historyInterval === 'm15'
            ? 'border-violet-500 bg-violet-500'
            : 'border-violet-700'
        } cursor-pointer px-2 py-1 border rounded-lg`}
      >
        m15
      </button>
      <button
        onClick={() => dispatch(setHistoryInterval('m30'))}
        className={`${
          historyInterval === 'm30'
            ? 'border-violet-500 bg-violet-500'
            : 'border-violet-700'
        } cursor-pointer px-2 py-1 border rounded-lg`}
      >
        m30
      </button>
      <button
        onClick={() => dispatch(setHistoryInterval('h1'))}
        className={`${
          historyInterval === 'h1'
            ? 'border-violet-500 bg-violet-500'
            : 'border-violet-700'
        } cursor-pointer px-2 py-1 border rounded-lg`}
      >
        h1
      </button>
    </div>
  );
};

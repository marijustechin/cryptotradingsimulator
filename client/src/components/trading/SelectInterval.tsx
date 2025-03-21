import {
  getChartInterval,
  setChartInterval,
} from '../../store/features/trading/tradingOptionsSlice';
import { useAppDispatch, useAppSelector } from '../../store/store';

export const SelectInterval = () => {
  const dispatch = useAppDispatch();
  const historyInterval = useAppSelector(getChartInterval);

  return (
    <div className="flex gap-2">
      <button
        onClick={() => dispatch(setChartInterval('minutes'))}
        className={`${
          historyInterval === 'minutes'
            ? 'border-violet-500 bg-violet-500'
            : 'border-violet-700'
        } cursor-pointer px-2 py-1 border rounded-lg`}
      >
        1H
      </button>
      <button
        onClick={() => dispatch(setChartInterval('hours'))}
        className={`${
          historyInterval === 'hours'
            ? 'border-violet-500 bg-violet-500'
            : 'border-violet-700'
        } cursor-pointer px-2 py-1 border rounded-lg`}
      >
        24H
      </button>
      <button
        onClick={() => dispatch(setChartInterval('days'))}
        className={`${
          historyInterval === 'days'
            ? 'border-violet-500 bg-violet-500'
            : 'border-violet-700'
        } cursor-pointer px-2 py-1 border rounded-lg`}
      >
        7D
      </button>
    </div>
  );
};

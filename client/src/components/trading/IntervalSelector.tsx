import {
  getChartInterval,
  setChartInterval,
} from '../../store/features/trading/chartSlice';
import { useAppDispatch, useAppSelector } from '../../store/store';

const intervals = ['15', '30', '60'];

export const IntervalSelector = () => {
  const dispatch = useAppDispatch();
  const chartInterval = useAppSelector(getChartInterval);

  return (
    <div className="flex gap-3">
      {intervals.map((i) => (
        <button
          key={i}
          onClick={() => dispatch(setChartInterval(i))}
          className={`${
            chartInterval === i
              ? 'border-violet-500 bg-violet-500'
              : 'border-violet-700'
          } cursor-pointer px-2 py-1 border rounded-lg`}
        >
          {i}
        </button>
      ))}
    </div>
  );
};

import { getChartSymbol } from '../../store/features/trading/chartSlice';
import { useAppDispatch, useAppSelector } from '../../store/store';

export const CryptoSelector = () => {
  const dispatch = useAppDispatch();
  const selectedSymbol = useAppSelector(getChartSymbol);

  return (
    <div>
      <select onChange={() => dispatch()}>
        <option>Bitcoin</option>
        <option>Ethereum</option>
      </select>
    </div>
  );
};

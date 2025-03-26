import { ChangeEvent, useEffect } from 'react';
import {
  getSelectedSymbolData,
  getSymbolData,
  setSymbol,
} from '../../store/features/trading/chartSlice';
import { useAppDispatch, useAppSelector } from '../../store/store';

export const CryptoSelector = () => {
  const dispatch = useAppDispatch();
  const symbolData = useAppSelector(getSelectedSymbolData);

  useEffect(() => {
    if (!symbolData) {
      dispatch(getSymbolData());
    }
  }, [dispatch, symbolData]);

  const handleCryptoChange = (e: ChangeEvent<HTMLSelectElement>) => {
    dispatch(setSymbol(e.target.value));
    dispatch(getSymbolData());
  };

  return (
    <div className='flex gap-3'>
      {symbolData && (
        <div className='w-12 flex items-center justify-center'>
          <img className='h-10' src={symbolData.icon} alt={symbolData.name} />
        </div>
      )}
      <select
        className='bg-violet-500 p-2 rounded-lg focus:outline-none'
        onChange={handleCryptoChange}
      >
        <option value={'BTCUSDT'}>Bitcoin</option>
        <option value={'ETHUSDT'}>Ethereum</option>
      </select>
    </div>
  );
};

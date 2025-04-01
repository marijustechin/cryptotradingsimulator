import { ChangeEvent, useEffect } from 'react';
import {
  allActiveSymbols,
  getAllSymbols,
  getSelectedSymbolData,
  setSymbol,
} from '../../store/features/trading/chartSlice';
import { useAppDispatch, useAppSelector } from '../../store/store';

export const CryptoSelector = () => {
  const dispatch = useAppDispatch();
  const allSymbols = useAppSelector(allActiveSymbols);
  const symbolData = useAppSelector(getSelectedSymbolData);

  useEffect(() => {
    if (!allSymbols) {
      dispatch(getAllSymbols());
    }
  }, [dispatch, allSymbols]);

  const handleCryptoChange = (e: ChangeEvent<HTMLSelectElement>) => {
    dispatch(setSymbol(e.target.value));
  };

  return (
    <div className='flex flex-col gap-2 items-center sm:flex-row sm:gap-3 w-full'>
      {symbolData && (
        <div className='w-10 h-10 flex items-center justify-center'>
          <img
            className='h-8 w-8 object-contain'
            src={symbolData.icon}
            alt={symbolData.name}
          />
        </div>
      )}
      <select
        id='selectCrypto'
        defaultValue={symbolData ? symbolData.id : ''}
        className='bg-violet-500 p-2 rounded-lg focus:outline-none w-full sm:w-auto text-sm'
        onChange={handleCryptoChange}
      >
        {allSymbols ? (
          allSymbols.map((item) => (
            <option key={item.id} value={item.id}>
              {item.name}
            </option>
          ))
        ) : (
          <option>Nodata</option>
        )}
      </select>
    </div>
  );
};

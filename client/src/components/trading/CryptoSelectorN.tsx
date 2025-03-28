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
    <div className="flex gap-3">
      {symbolData && (
        <div className="w-12 flex items-center justify-center">
          <img className="h-10" src={symbolData.icon} alt={symbolData.name} />
        </div>
      )}
      <select
        className="bg-violet-500 p-2 rounded-lg focus:outline-none"
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

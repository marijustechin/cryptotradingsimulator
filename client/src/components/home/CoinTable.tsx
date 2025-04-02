import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/store';

import { Coin } from './Coin';
import {
  allActiveSymbols,
  getAllSymbols,
} from '../../store/features/trading/chartSlice';

const CoinTable = () => {
  const dispatch = useAppDispatch();
  const allSymbols = useAppSelector(allActiveSymbols);

  useEffect(() => {
    if (!allSymbols) {
      dispatch(getAllSymbols());
    }
  }, [dispatch, allSymbols]);

  return (
    <div className='relative z-15 rounded-[25px] bg-[#1A1B23] mx-auto p-3 mt-10 divide-y divide-gray-700 w-full'>
      {allSymbols ? (
        allSymbols.map((item) => (
          <Coin
            key={item.id}
            assetId={item.id}
            assetName={item.name}
            assetCode={item.code}
          />
        ))
      ) : (
        <div>No data to display</div>
      )}
    </div>
  );
};
export default CoinTable;

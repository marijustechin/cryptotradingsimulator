import { ChangeEvent, useEffect } from 'react';
import {
  getAllInstruments,
  getInstrument,
  getInstruments,
  getSingleInstrument,
  setInstrument,
} from '../../store/features/trading/tradingOptionsSlice';
import { useAppDispatch, useAppSelector } from '../../store/store';

export const SelectInstrument = () => {
  const dispatch = useAppDispatch();
  const symbol = useEffect(() => {
    if (!allInstruments) {
      dispatch(getInstruments());
    }
  }, [allInstruments, dispatch]);

  return (
    <div className="flex gap-3 items-center">
      {singleInstrument && (
        <div className="flex gap-2 items-center">
          <img
            className="w-10"
            src={singleInstrument.icon}
            alt={singleInstrument.name}
          />
        </div>
      )}
      <select
        className="px-2 py-1 border border-violet-700 focus:outline-none rounded-lg"
        onChange={(e: ChangeEvent<HTMLSelectElement>) =>
          dispatch(setInstrument(e.target.value))
        }
        name="select-instrument"
        id="select-instrument"
        value={instrument || ''}
      >
        {allInstruments ? (
          allInstruments.map((item) => (
            <option key={item.id} value={item.id}>
              {item.name} ({item.code})
            </option>
          ))
        ) : (
          <option disabled>no data</option>
        )}
      </select>
    </div>
  );
};

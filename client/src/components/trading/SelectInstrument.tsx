import { ChangeEvent, useEffect, useState } from 'react';
import {
  getAllInstruments,
  getInstrument,
  getInstruments,
  setInstrument,
} from '../../store/features/trading/tradingOptionsSlice';
import { useAppDispatch, useAppSelector } from '../../store/store';
import { IInstrument } from '../../types/crypto';

export const SelectInstrument = () => {
  const dispatch = useAppDispatch();
  const instrument = useAppSelector(getInstrument);
  const allInstruments = useAppSelector(getAllInstruments);
  const [currentInstrument, setCurrentInstrument] = useState<IInstrument>();

  useEffect(() => {
    if (!allInstruments) {
      dispatch(getInstruments());
    }
  }, [allInstruments, dispatch]);

  useEffect(() => {
    if (allInstruments) {
      setCurrentInstrument(
        allInstruments.find((item) => item.id === instrument)
      );
    }
  }, [allInstruments, instrument]);

  return (
    <div className='flex gap-3 items-center'>
      <select
        onChange={(e: ChangeEvent<HTMLSelectElement>) =>
          dispatch(setInstrument(e.target.value))
        }
        name='select-instrument'
        id='select-instrument'
      >
        {allInstruments
          ? allInstruments.map((item) => (
              <option
                key={item.id}
                selected={instrument === item.id}
                value={item.id}
              >
                {item.name} ({item.code})
              </option>
            ))
          : 'no data'}
      </select>
      {currentInstrument && (
        <div className='flex gap-2 items-center'>
          <img src={currentInstrument?.icon} alt={currentInstrument?.name} />
        </div>
      )}
    </div>
  );
};

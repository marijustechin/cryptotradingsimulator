import toast from 'react-hot-toast';
import { useAppDispatch, useAppSelector } from '../../store/store';
import {
  getSettings,
  selectLimitFee,
  selectMarketFee,
} from '../../store/features/admin/settingsSlice';
import { useEffect, useState } from 'react';

export const SystemFees = () => {
  const dispatch = useAppDispatch();
  const limitFeeFromStore = useAppSelector(selectLimitFee);
  const marketFeeFromStore = useAppSelector(selectMarketFee);

  const [limitFee, setLimitFee] = useState(0);
  const [marketFee, setMarketFee] = useState(0);

  useEffect(() => {
    dispatch(getSettings());
  }, [dispatch]);

  // Sync Redux -> local state when fetched
  useEffect(() => {
    if (limitFeeFromStore !== null) setLimitFee(limitFeeFromStore);
    if (marketFeeFromStore !== null) setMarketFee(marketFeeFromStore);
  }, [limitFeeFromStore, marketFeeFromStore]);

  return (
    <>
      <h2>Fees</h2>
      <div className='flex gap-2'>
        <div className='flex flex-col border border-violet-700 rounded-lg p-2'>
          <label htmlFor='limit_fee'>Limit order fee %</label>
          <div className='flex gap-2'>
            <input
              value={limitFee}
              onChange={(e) => setLimitFee(parseFloat(e.target.value))}
              type='number'
              step={0.001}
              className='py-1 px-2 w-40 border border-violet-900 rounded-lg'
              id='limit_fee'
            />
            <button
              className='btn-generic'
              onClick={() =>
                toast.success('Limit order fee successfully updated')
              }
            >
              Update
            </button>
          </div>
        </div>
        <div className='flex flex-col border border-violet-700 rounded-lg p-2'>
          <label htmlFor='market_fee'>Market order fee %</label>
          <div className='flex gap-2'>
            <input
              value={marketFee}
              onChange={(e) => setMarketFee(parseFloat(e.target.value))}
              type='number'
              step={0.001}
              className='py-1 px-2 w-40 border border-violet-900 rounded-lg'
              id='market_fee'
            />
            <button
              className='btn-generic'
              type='button'
              onClick={() =>
                toast.success('Market order fee successfully updated')
              }
            >
              Update
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

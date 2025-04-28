import toast from 'react-hot-toast';
import { useAppDispatch, useAppSelector } from '../../store/store';
import {
  getSettings,
  selectLimitFee,
  selectMarketFee,
} from '../../store/features/admin/settingsSlice';
import { useEffect, useState } from 'react';
import { ConfirmationModal } from "../../components/ConfirmationModal";

export const SystemFees = () => {
  const dispatch = useAppDispatch();
  const limitFeeFromStore = useAppSelector(selectLimitFee);
  const marketFeeFromStore = useAppSelector(selectMarketFee);

  const [limitFee, setLimitFee] = useState(0);
  const [marketFee, setMarketFee] = useState(0);

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [feeType, setFeeType] = useState(''); // To determine which fee is being updated

  useEffect(() => {
    dispatch(getSettings());
  }, [dispatch]);

  // Sync Redux -> local state when fetched
  useEffect(() => {
    if (limitFeeFromStore !== null) setLimitFee(limitFeeFromStore);
    if (marketFeeFromStore !== null) setMarketFee(marketFeeFromStore);
  }, [limitFeeFromStore, marketFeeFromStore]);

  // Function to handle the update action
  const handleUpdateFee = async () => {
    if (feeType === 'limit') {
      // Logic to update limit fee (e.g., dispatch action)
      toast.success('Limit order fee successfully updated');
    } else if (feeType === 'market') {
      // Logic to update market fee (e.g., dispatch action)
      toast.success('Market order fee successfully updated');
    }
    setIsModalOpen(false); // Close the modal after the update
  };

  // Function to open modal for confirming fee update
  const handleModalOpen = (fee: string) => {
    setFeeType(fee); // Set the fee type to update
    setModalMessage(`Are you sure you want to update the ${fee} fee?`);
    setIsModalOpen(true); // Open the confirmation modal
  };

  return (
    <main className='bg-gray-800 rounded-xl p-4 shadow'>
      <h2>Fees</h2>
      <div className='flex flex-col gap-2 lg:flex-row lg:justify-around border border-violet-700 rounded-lg p-2'>
        <div className='flex flex-col'>
          <label htmlFor='limit_fee'>Limit order fee %</label>
          <div className='flex gap-2'>
            <input
              value={limitFee}
              onChange={(e) => setLimitFee(parseFloat(e.target.value))}
              type='number'
              step={0.001}
              className='py-1 px-2 w-35 md:w-45 border border-violet-900 rounded-lg'
              id='limit_fee'
            />
            <button
              className='btn-generic'
              type='button'
              onClick={() => handleModalOpen('limit')} // Open modal for limit fee
            >
              Update
            </button>
          </div>
        </div>
        <div className='flex flex-col'>
          <label htmlFor='market_fee'>Market order fee %</label>
          <div className='flex gap-2'>
            <input
              value={marketFee}
              onChange={(e) => setMarketFee(parseFloat(e.target.value))}
              type='number'
              step={0.001}
              className='py-1 px-2 w-35 md:w-45 border border-violet-900 rounded-lg'
              id='market_fee'
            />
            <button
              className='btn-generic'
              type='button'
              onClick={() => handleModalOpen('market')} // Open modal for market fee
            >
              Update
            </button>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={isModalOpen}
        title='Confirm Action'
        message={modalMessage}
        onConfirm={handleUpdateFee} // Proceed with the update if confirmed
        onCancel={() => setIsModalOpen(false)} // Close the modal on cancel
      />
    </main>
  );
};

import {
  generateActivity,
  getSettingsStatus,
} from '../../store/features/admin/settingsSlice';
import { useAppDispatch, useAppSelector } from '../../store/store';
import { useState } from 'react';
import { getGeneralInfo } from '../../store/features/admin/adminSlice';
import { ConfirmationModal } from "../../components/ConfirmationModal";

export const SystemFakeActivity = () => {
  const dispatch = useAppDispatch();
  const status = useAppSelector(getSettingsStatus);

  const [ref, setRef] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal visibility state
  const [modalMessage, setModalMessage] = useState(''); // Modal message
  const [orderId, setOrderId] = useState(null); // Order ID 

  const generateFakeActivity = async () => {
    setRef(true);
    await dispatch(generateActivity());
    await dispatch(getGeneralInfo());
    setRef(false);
  };

  const handleModalOpen = () => {
    setModalMessage('Are you sure you want to generate fake activity?'); // Modal message
    setIsModalOpen(true); // Open the modal
  };

  const confirmGenerate = async () => {
    setIsModalOpen(false); // Close the modal
    await generateFakeActivity(); // Call the generate fake activity function
  };

  return (
    <main className='bg-gray-800 rounded-xl p-4 shadow'>
      <h2>Generate fake Activity</h2>
      {status === 'loading' && ref ? (
        <div className='p-3 border border-rose-500 rounded-2xl font-semibold text-emerald-500'>
          Generating fake activity. Please wait...
        </div>
      ) : (
        <div className='gap-3 border border-violet-700 rounded-lg p-2'>
          <p className='py-5'>
            Here you can generate fake users trading activity during the period of
            the last year.
          </p>
          <button
            onClick={handleModalOpen} // Open modal when button is clicked
            className='btn-generic'
          >
            Generate Fake Activity
          </button>
        </div>
      )}

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={isModalOpen}
        title='Confirm Action'
        message={modalMessage}
        onConfirm={confirmGenerate} // Confirm action
        onCancel={() => setIsModalOpen(false)} // Cancel action
      />
    </main>
  );
};

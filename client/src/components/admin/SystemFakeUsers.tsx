import { useEffect, useState } from 'react';
import {
  generateUsers,
  getSettingsStatus,
  selectFakeUsers,
} from '../../store/features/admin/settingsSlice';
import { useAppDispatch, useAppSelector } from '../../store/store';
import { ConfirmationModal } from "../../components/ConfirmationModal";

export const SystemFakeUsers = () => {
  const dispatch = useAppDispatch();
  const fakeUsersFromStore = useAppSelector(selectFakeUsers);
  const status = useAppSelector(getSettingsStatus);
  const [fakeUsers, setFakeUsers] = useState(0);
  const [ref, setRef] = useState(false);
  const [password, setPassword] = useState('password1');

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [orderId, setOrderId] = useState(null); // You can remove or repurpose this if needed

  useEffect(() => {
    if (fakeUsersFromStore !== null) setFakeUsers(fakeUsersFromStore);
  }, [fakeUsersFromStore]);

  // Function to trigger fake users generation
  const generateFakeUsers = async () => {
    setRef(true);
    await dispatch(
      generateUsers({ usersCount: fakeUsers ?? 100, defaultPassword: password })
    );
    setRef(false);
  };

  // Modal open handler
  const handleModalOpen = () => {
    setModalMessage('Are you sure you want to generate fake users?');
    setIsModalOpen(true);
  };

  // Confirm modal action
  const confirmGenerate = async () => {
    setIsModalOpen(false); // Close modal
    await generateFakeUsers(); // Proceed with generating fake users
  };

  return (
    <main className='bg-gray-800 rounded-xl p-4 shadow'>
      <h2>Generate fake Users</h2>
      {status === 'loading' && ref ? (
        <div className='p-3 border border-rose-500 rounded-2xl font-semibold text-emerald-500'>
          Generating fake users. Just a moment, please...
        </div>
      ) : (
        <div className='flex gap-3 border border-violet-700 rounded-lg p-2'>
          <div className='flex flex-col'>
            <label htmlFor='defaultPassword'>Default password</label>
            <input
              id='defaultPassword'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className='p-2 w-40 border border-violet-900 rounded-lg'
              type='text'
            />
          </div>
          <div>
            <label htmlFor='fake_users'>Number of users to generate</label>
            <div className='flex gap-2'>
              <input
                value={fakeUsers}
                onChange={(e) => setFakeUsers(parseFloat(e.target.value))}
                type='number'
                step={1}
                className='py-1 px-2 w-40 border border-violet-900 rounded-lg'
                id='fake_users'
              />
              <button
                className='btn-generic'
                type='button'
                onClick={handleModalOpen} // Open modal on button click
              >
                Generate Fake Users
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={isModalOpen}
        title='Confirm Action'
        message={modalMessage}
        onConfirm={confirmGenerate} // Generate users when confirmed
        onCancel={() => setIsModalOpen(false)} // Close the modal on cancel
      />
    </main>
  );
};

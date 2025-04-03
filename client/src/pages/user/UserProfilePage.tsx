import { UpdateUserForm } from '../../components/auth/UpdateUserForm';
import { ChangePasswordForm } from '../../components/auth/ChangePassword';
import { useState } from 'react';

const UserProfilePage = () => {
  const [showPasswordForm, setShowPasswordForm] = useState(false);

  const togglePasswordForm = () => {
    setShowPasswordForm((prev) => !prev);
  };

  return (
    <main className='flex flex-col gap-3'>
      <h1>User profile</h1>

      <div className='my-4 grid grid-cols-1 lg:grid-cols-2 gap-4'>
        {/* Left column: Update form */}
        <UpdateUserForm />

        {/* Right column: Password section */}
        <div className='flex flex-col gap-4'>
          <button
            onClick={togglePasswordForm}
            className='text-violet-400 cursor-pointer hover:text-violet-300 underline transition duration-150 text-left'
          >
            {showPasswordForm ? 'Hide Change Password' : 'Change Password'}
          </button>

          {showPasswordForm && <ChangePasswordForm />}
        </div>
      </div>
    </main>
  );
};

export default UserProfilePage;
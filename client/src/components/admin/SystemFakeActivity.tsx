import toast from 'react-hot-toast';
import {
  generateActivity,
  getSettingsMessage,
  getSettingsStatus,
} from '../../store/features/admin/settingsSlice';
import { useAppDispatch, useAppSelector } from '../../store/store';
import { useState } from 'react';

export const SystemFakeActivity = () => {
  const dispatch = useAppDispatch();
  const status = useAppSelector(getSettingsStatus);
  const message = useAppSelector(getSettingsMessage);
  const [ref, setRef] = useState(false);

  const generateFakeActivity = async () => {
    setRef(true);
    await dispatch(generateActivity());
    setRef(false);
    toast.success(message);
  };

  return (
    <>
      <h2>Generate fake Activity</h2>
      {status === 'loading' && ref ? (
        <div className='p-3 border border-rose-500 rounded-2xl font-semibold text-emerald-500'>
          Generating fake activity. Please wait...
        </div>
      ) : (
        <>
          <p>
            Here you can generate fake users trading activity during period of
            the laste year
          </p>
          <button
            onClick={() => generateFakeActivity()}
            className='btn-generic'
          >
            Generate Fake Activity
          </button>
        </>
      )}
    </>
  );
};

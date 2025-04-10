import { SystemFees } from '../../components/admin/SystemFees';
import { SystemFakeUsers } from '../../components/admin/SystemFakeUsers';
import { SystemFakeActivity } from '../../components/admin/SystemFakeActivity';
import { useAppDispatch, useAppSelector } from '../../store/store';
import {
  getSettingsMessage,
  setSettingsMessage,
} from '../../store/features/admin/settingsSlice';
import { useEffect } from 'react';
import toast from 'react-hot-toast';

const SystemSettingsPage = () => {
  const dispatch = useAppDispatch();
  const message = useAppSelector(getSettingsMessage);

  useEffect(() => {
    if (message) {
      toast.success(message);
      dispatch(setSettingsMessage(null));
    }
  }, [message, dispatch]);

  return (
    <div className='relative'>
      <div className='relative flex flex-col gap-5 z-30 p-2'>
        <h1>System Settings</h1>
        <SystemFees />
        <SystemFakeUsers />
        <SystemFakeActivity />
      </div>
      <div className='absolute top-0 left-0 w-full h-full bg-gray-900/70 z-0 rounded-2xl'></div>
    </div>
  );
};
export default SystemSettingsPage;

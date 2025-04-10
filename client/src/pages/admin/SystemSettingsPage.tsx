import { SystemFees } from '../../components/admin/SystemFees';
import { SystemFakeUsers } from '../../components/admin/SystemFakeUsers';
import { SystemFakeActivity } from '../../components/admin/SystemFakeActivity';
import { useAppSelector } from '../../store/store';
import { getSettingsMessage } from '../../store/features/admin/settingsSlice';
import { useEffect } from 'react';
import toast from 'react-hot-toast';

const SystemSettingsPage = () => {
  const message = useAppSelector(getSettingsMessage);

  useEffect(() => {
    if (message) toast.success(message);
  }, [message]);

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

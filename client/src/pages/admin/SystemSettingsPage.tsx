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
      <h1 className='text-center'>System Settings</h1>
      <div className='relative flex flex-col gap-5 z-30 p-2'>
        <SystemFees />
        <SystemFakeUsers />
        <SystemFakeActivity />
      </div>
    </div>
  );
};
export default SystemSettingsPage;

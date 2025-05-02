import {
  generateActivity,
  getSettingsStatus,
} from '../../store/features/admin/settingsSlice';
import { useAppDispatch, useAppSelector } from '../../store/store';
import { useState } from 'react';
import { getGeneralInfo } from '../../store/features/admin/adminSlice';
import { ConfirmationModal } from "../../components/ConfirmationModal";
import { useTranslation } from 'react-i18next';

export const SystemFakeActivity = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const status = useAppSelector(getSettingsStatus);

  const [ref, setRef] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [orderId, setOrderId] = useState(null);

  const generateFakeActivity = async () => {
    setRef(true);
    await dispatch(generateActivity());
    await dispatch(getGeneralInfo());
    setRef(false);
  };

  const handleModalOpen = () => {
    setModalMessage(t('admin_fake_activity_confirm'));
    setIsModalOpen(true);
  };

  const confirmGenerate = async () => {
    setIsModalOpen(false);
    await generateFakeActivity();
  };

  return (
    <main className='bg-gray-800 rounded-xl p-4 shadow'>
      <h2>{t('admin_fake_activity_title')}</h2>
      {status === 'loading' && ref ? (
        <div className='p-3 border border-rose-500 rounded-2xl font-semibold text-emerald-500'>
          {t('admin_fake_activity_generating')}
        </div>
      ) : (
        <div className='gap-3 border border-violet-700 rounded-lg p-2'>
          <p className='py-5'>
            {t('admin_fake_activity_description')}
          </p>
          <button
            onClick={handleModalOpen}
            className='btn-generic'
          >
            {t('admin_fake_activity_button')}
          </button>
        </div>
      )}

      <ConfirmationModal
        isOpen={isModalOpen}
        title={t('admin_fake_activity_modal_title')}
        message={modalMessage}
        onConfirm={confirmGenerate}
        onCancel={() => setIsModalOpen(false)}
      />
    </main>
  );
};
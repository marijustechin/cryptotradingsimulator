import toast from 'react-hot-toast';
import { useAppDispatch, useAppSelector } from '../../store/store';
import {
  getSettings,
  selectLimitFee,
  selectMarketFee,
} from '../../store/features/admin/settingsSlice';
import { useEffect, useState } from 'react';
import { ConfirmationModal } from "../../components/ConfirmationModal";
import { useTranslation } from 'react-i18next';

export const SystemFees = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const limitFeeFromStore = useAppSelector(selectLimitFee);
  const marketFeeFromStore = useAppSelector(selectMarketFee);

  const [limitFee, setLimitFee] = useState(0);
  const [marketFee, setMarketFee] = useState(0);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [feeType, setFeeType] = useState('');

  useEffect(() => {
    dispatch(getSettings());
  }, [dispatch]);

  useEffect(() => {
    if (limitFeeFromStore !== null) setLimitFee(limitFeeFromStore);
    if (marketFeeFromStore !== null) setMarketFee(marketFeeFromStore);
  }, [limitFeeFromStore, marketFeeFromStore]);

  const handleUpdateFee = async () => {
    if (feeType === 'limit') {
      toast.success(t('admin_fees_limit_success'));
    } else if (feeType === 'market') {
      toast.success(t('admin_fees_market_success'));
    }
    setIsModalOpen(false);
  };

  const handleModalOpen = (fee: string) => {
    setFeeType(fee);
    setModalMessage(t('admin_fees_confirm', { feeType: t(`admin_fees_${fee}_label`) }));
    setIsModalOpen(true);
  };

  return (
    <main className='bg-gray-800 rounded-xl p-4 shadow'>
      <h2>{t('admin_fees_title')}</h2>
      <div className='flex flex-col gap-2 lg:flex-row lg:justify-around border border-violet-700 rounded-lg p-2'>
        <div className='flex flex-col'>
          <label htmlFor='limit_fee'>{t('admin_fees_limit_label')}</label>
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
              onClick={() => handleModalOpen('limit')}
            >
              {t('admin_fees_update_button')}
            </button>
          </div>
        </div>
        <div className='flex flex-col'>
          <label htmlFor='market_fee'>{t('admin_fees_market_label')}</label>
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
              onClick={() => handleModalOpen('market')}
            >
              {t('admin_fees_update_button')}
            </button>
          </div>
        </div>
      </div>

      <ConfirmationModal
        isOpen={isModalOpen}
        title={t('admin_fees_modal_title')}
        message={modalMessage}
        onConfirm={handleUpdateFee}
        onCancel={() => setIsModalOpen(false)}
      />
    </main>
  );
};

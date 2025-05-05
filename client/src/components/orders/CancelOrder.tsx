import { ConfirmationModal } from '../../components/ConfirmationModal';
import { useState } from 'react';
import { toast } from 'react-hot-toast';
import OrdersService from '../../services/OrdersService';
import { useAppDispatch } from '../../store/store';
import { fetchUserInfo } from '../../store/features/user/authSlice';
import { useTranslation } from 'react-i18next';

interface CancelOrderProps {
  orderId: number;
  onSuccess?: () => void;
}

export default function CancelOrder({
  orderId,
  onSuccess,
}: Readonly<CancelOrderProps>) {
  const dispatch = useAppDispatch();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState<string>('');
  const [delOrder, setDelOrder] = useState<{ orderId: number } | null>(null);
  const { t } = useTranslation();

  const handleModalOpen = (orderId: number) => {
    setModalMessage(`${t('cancel_description')} ${orderId}`);
    setDelOrder({ orderId });
    setIsModalOpen(true);
  };

  const confirmDelete = async () => {
    setIsModalOpen(false);
    if (delOrder?.orderId) {
      try {
        await OrdersService.cancelOrder(delOrder.orderId);
        await dispatch(fetchUserInfo());
        toast.success(t('cancel_success'));

        if (onSuccess) onSuccess();
      } catch (error) {
        console.log(error);
        toast.error(t('cancel_error'));
      }
    }
    setDelOrder(null);
    setModalMessage('');
  };

  return (
    <>
      <button
        onClick={() => handleModalOpen(orderId)}
        className="btn btn-ghost px-2 rounded-2xl"
        title={t('cancel_title')}
      >
        ❌
      </button>
      <ConfirmationModal
        isOpen={isModalOpen}
        title={t('cancel_title')}
        message={modalMessage}
        onConfirm={confirmDelete}
        onCancel={() => setIsModalOpen(false)}
      />
    </>
  );
}

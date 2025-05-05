import { ConfirmationModal } from '../../components/ConfirmationModal';
import { useState } from 'react';
import { toast } from 'react-hot-toast';
import OrdersService from '../../services/OrdersService';
import { useTranslation } from 'react-i18next';

interface EditOrderAmountProps {
  orderId: number;
  amount: number;
  onSuccess?: () => void;
}

export default function EditOrderAmount({
  orderId,
  amount,
  onSuccess,
}: Readonly<EditOrderAmountProps>) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState<string>('');
  const [editOrder, setEditOrder] = useState({ orderId, amount });
  const { t } = useTranslation();

  const handleModalOpen = (orderId: number) => {
    setModalMessage(`${t('edit_amount_description')} ${orderId}`);
    setEditOrder({ orderId, amount });
    setIsModalOpen(true);
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditOrder({ ...editOrder, amount: parseFloat(e.target.value) });
  };

  const confirmEdit = async () => {
    if (!editOrder?.orderId) return;

    try {
      await OrdersService.editOrderAmount(editOrder.orderId, editOrder.amount);
      toast.success(t('edit_amount_success'));

      if (onSuccess) onSuccess();
    } catch (error: any) {
      console.error('Edit order failed:', error);
      const message =
        error?.response?.data?.error ?? error?.message ?? t('edit_amount_error');
      toast.error(message);
    } finally {
      setIsModalOpen(false);
      setEditOrder({ orderId: editOrder.orderId, amount });
      setModalMessage('');
    }
  };

  return (
    <>
      <button
        onClick={() => handleModalOpen(orderId)}
        className="btn btn-ghost ml-1 px-1 rounded-2xl"
        title={t('edit_amount')}
      >
        <img src="/edit-order.svg" alt="pen icon for edit" className="w-5" />
      </button>

      <ConfirmationModal
        isOpen={isModalOpen}
        title={t('edit_amount')}
        message={modalMessage}
        onConfirm={confirmEdit}
        onCancel={() => setIsModalOpen(false)}
      >
        <input
          id="newAmount"
          type="number"
          step={0.01}
          className="form-input mb-5"
          value={editOrder.amount || ''}
          onChange={handleAmountChange}
          placeholder={t('edit_amount_placeholder')}
          required
        />
      </ConfirmationModal>
    </>
  );
}

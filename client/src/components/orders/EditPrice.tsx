import { ConfirmationModal } from '../../components/ConfirmationModal';
import { useState } from 'react';
import { toast } from 'react-hot-toast';
import OrdersService from '../../services/OrdersService';
import { useTranslation } from 'react-i18next';

interface EditPriceOrderProps {
  orderId: number;
  triggerPrice: number;
  onSuccess?: () => void;
}

export default function EditOrderPrice({
  orderId,
  triggerPrice,
  onSuccess,
}: Readonly<EditPriceOrderProps>) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState<string>('');
  const [editOrder, setEditOrder] = useState({ orderId, triggerPrice });
  const { t } = useTranslation();

  const handleModalOpen = (orderId: number) => {
    setModalMessage(`${t('edit_order_description')} ${orderId}`);
    setEditOrder({ orderId, triggerPrice });
    setIsModalOpen(true);
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditOrder({ ...editOrder, triggerPrice: parseFloat(e.target.value) });
  };

  const confirmEdit = async () => {
    if (!editOrder?.orderId) return;

    try {
      await OrdersService.editOrderPrice(
        editOrder.orderId,
        editOrder.triggerPrice
      );

      toast.success(t('edit_price_success'));

      if (onSuccess) onSuccess();
    } catch (error: any) {
      console.error('Edit order failed:', error);

      // Safe extraction of server error message
      const message =
        error?.response?.data?.error ??
        error?.message ??
        t('edit_price_error');

      toast.error(message);
    } finally {
      // ✅ Always close modal, whether success or failure
      setIsModalOpen(false);
      setEditOrder({ orderId: editOrder.orderId, triggerPrice });
      setModalMessage('');
    }
  };

  return (
    <>
      <button
        onClick={() => handleModalOpen(orderId)}
        className="btn btn-ghost ml-1 px-1 rounded-2xl"
        title={t('edit_order_price')}
      >
        <img src="/edit-order.svg" alt="pen icon for edit" className="w-5" />
      </button>
      <ConfirmationModal
        isOpen={isModalOpen}
        title={t('edit_order_price')}
        message={modalMessage}
        onConfirm={confirmEdit}
        onCancel={() => setIsModalOpen(false)}
      >
        <input
          id="newPrice"
          type="number"
          step={0.01}
          className="form-input mb-5"
          value={editOrder.triggerPrice || ''}
          onChange={handlePriceChange}
          placeholder={t('edit_price_placeholder')}
          required
        />
      </ConfirmationModal>
    </>
  );
}

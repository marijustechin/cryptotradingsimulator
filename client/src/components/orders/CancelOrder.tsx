import { ConfirmationModal } from '../../components/ConfirmationModal';
import { useState } from 'react';
import { toast } from 'react-hot-toast';
import OrdersService from '../../services/OrdersService';
import { useAppDispatch } from '../../store/store';
import { fetchUserInfo } from '../../store/features/user/authSlice';

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

  const handleModalOpen = (orderId: number) => {
    setModalMessage(`Do you want to cancel order ${orderId}?`);
    setDelOrder({ orderId });
    setIsModalOpen(true);
  };

  const confirmDelete = async () => {
    setIsModalOpen(false);
    if (delOrder?.orderId) {
      try {
        await OrdersService.cancelOrder(delOrder.orderId);
        await dispatch(fetchUserInfo());
        toast.success('Order cancelled');

        if (onSuccess) onSuccess(); // ✅ trigger refresh from parent
      } catch (error) {
        console.log(error);
        toast.error('Failed to cancel order');
      }
    }
    setDelOrder(null);
    setModalMessage('');
  };

  return (
    <>
      <button
        onClick={() => handleModalOpen(orderId)}
        className='btn btn-ghost px-2 rounded-2xl'
        title='Cancel order'
      >
        ❌
      </button>
      <ConfirmationModal
        isOpen={isModalOpen}
        title='Cancel order'
        message={modalMessage}
        onConfirm={confirmDelete}
        onCancel={() => setIsModalOpen(false)}
      />
    </>
  );
}

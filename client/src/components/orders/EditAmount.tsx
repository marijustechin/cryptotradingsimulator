import { ConfirmationModal } from "../../components/ConfirmationModal";
import { useState } from "react";
import { toast } from "react-hot-toast";
import OrdersService from "../../services/OrdersService";

interface EditOrderAmountProps {
  orderId: number;
  amount: number;
  onSuccess?: () => void; // ✅ callback for refresh
}

export default function EditOrderAmount({
  orderId,
  amount,
  onSuccess
}: Readonly<EditOrderAmountProps>) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState<string>("");
  const [editOrder, setEditOrder] = useState({ orderId, amount });

  const handleModalOpen = (orderId: number) => {
    setModalMessage(`Select new amount for order ${orderId}`);
    setEditOrder({ orderId, amount });
    setIsModalOpen(true);
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditOrder({ ...editOrder, amount: parseFloat(e.target.value) });
  };

  const confirmEdit = async () => {
    setIsModalOpen(false);
    if (editOrder?.orderId) {
      try {
        await OrdersService.editOrderAmount(
          editOrder.orderId,
          editOrder.amount
        );
        toast.success("Amount successfully changed");

        if (onSuccess) onSuccess(); // ✅ notify parent to refresh
      } catch (error) {
        toast.error("Failed to change the amount");
      }
    }
    setEditOrder({ orderId: editOrder.orderId, amount });
    setModalMessage("");
  };

  return (
    <>
      <button
        onClick={() => handleModalOpen(orderId)}
        className="btn btn-ghost ml-1 px-1 rounded-2xl"
        title="Edit amount"
      >
        <img src="/edit-order.svg" alt="pen icon for edit" className="w-5" />
      </button>
      <ConfirmationModal
        isOpen={isModalOpen}
        title="Edit order amount"
        message={modalMessage}
        onConfirm={confirmEdit}
        onCancel={() => setIsModalOpen(false)}
      >
        <input
          id="newAmount"
          type="number"
          step={0.01}
          className="form-input mb-5"
          value={editOrder.amount || ""}
          onChange={handleAmountChange}
          placeholder="Enter new amount"
          required
        />
      </ConfirmationModal>
    </>
  );
}

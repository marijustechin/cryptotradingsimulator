import { ConfirmationModal } from "../../components/ConfirmationModal";
import { useState } from "react";
import { toast } from "react-hot-toast";
import OrdersService from "../../services/OrdersService";

interface EditPriceOrderProps {
  orderId: number;
  triggerPrice: number;
}

export default function EditOrderPrice({
  orderId,
  triggerPrice,
}: EditPriceOrderProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState<string>("");
  const [editOrder, setEditOrder] = useState({ orderId, triggerPrice });

  const handleModalOpen = (orderId: number) => {
    setModalMessage(`Select a new price for order ${orderId}`);
    setEditOrder({ orderId, triggerPrice });
    setIsModalOpen(true);
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditOrder({ ...editOrder, triggerPrice: parseFloat(e.target.value) });
  };

  const confirmEdit = async () => {
    setIsModalOpen(false);
    if (editOrder?.orderId) {
      try {
        await OrdersService.editOrderPrice(
          editOrder.orderId,
          editOrder.triggerPrice
        );
        toast.success("Price successfully changed");
      } catch (error) {
        toast.error("Failed to change the price");
      }
    }
    setEditOrder({ orderId: editOrder.orderId, triggerPrice });
    setModalMessage("");
  };

  return (
    <>
      <button
        onClick={() => handleModalOpen(orderId)}
        className="btn btn-ghost ml-1 px-1 rounded-2xl"
        title="Edit price"
      >
        <img src="/edit-order.svg" alt="ped icon for edit" className="w-5" />
      </button>
      <ConfirmationModal
        isOpen={isModalOpen}
        title="Edit order price"
        message={modalMessage}
        onConfirm={confirmEdit}
        onCancel={() => setIsModalOpen(false)}
      >
        <input
          id="newPrice"
          type="number"
          step={0.01}
          className="form-input mb-5"
          value={editOrder.triggerPrice || ""}
          onChange={handlePriceChange}
          placeholder="Enter new price"
          required
        />
      </ConfirmationModal>
    </>
  );
}

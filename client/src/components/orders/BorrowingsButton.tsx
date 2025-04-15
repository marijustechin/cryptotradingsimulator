import { useAppSelector } from "../../store/store";
import { selectUser } from "../../store/features/user/authSlice";
import $api from "../../api/axios";

export default function BorrowingsButton() {
  const user = useAppSelector(selectUser);

  const handleBorrow = async () => {
    try {
      await $api.post("/users/borrow", {
        amount: 10000,
        reason: "Personal use",
      });
      alert("Borrow successful!");
      window.location.reload();
    } catch (err) {
      alert("Borrow failed. Check your balance or try again.");
      console.error(err);
    }
  };

  const canBorrow = user?.balance <= 300;

  return (
    <div>
      <button
        onClick={handleBorrow}
        className="btn-generic my-6"
        disabled={!canBorrow}
      >
        Borrow 10000$
      </button>
      {!canBorrow && (
        <p className="text-sm text-red-500">
          You can only borrow if your balance is 300$ or less.
        </p>
      )}
    </div>
  );
}

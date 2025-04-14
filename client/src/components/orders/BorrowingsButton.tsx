import $api from "../../api/axios";

export default function BorrowingsButton() {
  const handleBorrow = async () => {
    try {
      // Use the $api instance for the POST request
      await $api.post("/users/borrow", {
        amount: 10000,
        reason: "Personal use",
      });            
      alert("Borrow successful!");
      window.location.reload(); // Reload to show updated history
    } catch (err) {
      alert("Borrow failed. Check your balance or try again.");
      console.error(err);
    }
  };

  return (
    <div>
      <button onClick={handleBorrow} className="btn-generic my-6">
        Borrow 10000$
      </button>
    </div>
  );
}

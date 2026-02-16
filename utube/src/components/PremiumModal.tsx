import axios from "@/lib/axiosinstance";

type PremiumModalProps = {
  onClose: () => void;
};

export default function PremiumModal({ onClose }: PremiumModalProps) {
  const upgrade = async () => {
    await axios.post("/payment/mock-success");
    alert("Premium activated");
    window.location.reload();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
      <div className="bg-white text-black p-6 rounded">
        <h2 className="text-lg font-bold">Go Premium</h2>
        <p>Unlimited video downloads</p>

        <button
          onClick={upgrade}
          className="mt-4 bg-black text-white px-4 py-2"
        >
          Upgrade
        </button>

        <button onClick={onClose} className="ml-2">
          Cancel
        </button>
      </div>
    </div>
  );
}

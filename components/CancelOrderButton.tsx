"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface CancelOrderButtonProps {
  orderId: string;
  onCancel?: () => void;
}

export default function CancelOrderButton({
  orderId,
  onCancel,
}: CancelOrderButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleCancel = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "CANCELLED" }),
      });

      if (res.ok) {
        router.refresh();
        setShowConfirm(false);
        if (onCancel) onCancel(); // notify parent
      } else {
        const data = await res.json();
        alert(data.error || "Failed to cancel order");
      }
    } catch (error) {
      alert("An error occurred while canceling the order");
    } finally {
      setLoading(false);
    }
  };

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowConfirm(true);
  };

  const handleConfirm = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    await handleCancel();
  };

  const handleCancelClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowConfirm(false);
  };

  if (showConfirm) {
    return (
      <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
        <button
          onClick={handleConfirm}
          disabled={loading}
          className="btn btn-outline text-red-600 border-red-600 hover:bg-red-50 disabled:opacity-50"
        >
          {loading ? "Canceling..." : "Confirm Cancel"}
        </button>
        <button
          onClick={handleCancelClick}
          disabled={loading}
          className="btn btn-outline"
        >
          Cancel
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={handleClick}
      className="btn btn-outline text-red-600 border-red-600 hover:bg-red-50"
    >
      Cancel Order
    </button>
  );
}

"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useCart } from "@/hooks/useCart";
import Image from "next/image";

export default function CheckoutPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const { cartItems, refreshCart } = useCart();
  const [shippingAddress, setShippingAddress] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!session) {
      router.push("/login?redirect=/checkout");
    }
  }, [session, router]);

  useEffect(() => {
    if (cartItems.length === 0 && session && !loading && !success) {
      const timer = setTimeout(() => {
        if (cartItems.length === 0) {
          router.push("/cart");
        }
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [cartItems, session, router, loading, success]);

  if (!session) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <p>Loading...</p>
      </div>
    );
  }

  if (cartItems.length === 0 && session) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <p className="text-center text-gray-600 mb-4">Loading checkout...</p>
      </div>
    );
  }

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
  const shipping = subtotal >= 50 ? 0 : 5;
  const total = subtotal + shipping;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!shippingAddress.trim()) {
      setError("Please enter a shipping address");
      setLoading(false);
      return;
    }

    if (!phoneNumber.trim()) {
      setError("Please enter a phone number");
      setLoading(false);
      return;
    }

    const phoneRegex =
      /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/;
    if (!phoneRegex.test(phoneNumber.replace(/\s/g, ""))) {
      setError("Please enter a valid phone number");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          shippingAddress,
          phoneNumber,
          notes: notes.trim() || undefined,
          cartItems: cartItems.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.product.price,
          })),
          total,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        console.error("Order creation failed:", data);
        const errorMessage =
          data.error ||
          data.details ||
          "Failed to create order. Check console.";
        setError(errorMessage);
        setLoading(false);
        return;
      }

      console.log("Order created successfully:", data);
      setSuccess(true);
      await refreshCart();

      setTimeout(() => {
        router.push("/orders?refresh=" + Date.now());
        setTimeout(() => {
          window.location.href = "/orders";
        }, 100);
      }, 2000);
    } catch (error: any) {
      console.error("Network error creating order:", error);
      setError(
        `Network error: ${error.message || "Failed to connect to server."}`
      );
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="relative min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-16 bg-gradient-to-br from-green-50 via-emerald-50/50 to-white overflow-hidden">
        {/* Background animation */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-72 h-72 bg-green-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
          <div className="absolute bottom-20 right-10 w-72 h-72 bg-emerald-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        </div>

        <div className="relative max-w-2xl mx-auto w-full">
          <div className="bg-white/80 backdrop-blur-md rounded-3xl shadow-2xl p-8 md:p-12 text-center border border-green-100/50">
            <div className="mb-8">
              <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg animate-zoom-bounce">
                <i className="fas fa-check text-3xl text-white"></i>
              </div>
              <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-3">
                Order Sent Successfully!
              </h2>
              <p className="text-lg text-gray-600 mb-2">
                We will contact you soon to confirm your order.
              </p>
              <p className="text-sm text-gray-500 mb-6">
                Redirecting to your orders page...
              </p>
            </div>
            <button
              onClick={() => router.push("/orders")}
              className="group relative inline-flex items-center gap-2 btn btn-primary overflow-hidden"
            >
              <span className="relative z-10 flex items-center gap-2">
                <i className="fas fa-list"></i>
                <span>View My Orders</span>
                <i className="fas fa-arrow-right transform group-hover:translate-x-1 transition-transform"></i>
              </span>
              <div className="absolute inset-0 bg-white/20 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-[calc(100vh-4rem)] bg-gradient-to-b from-white via-rose-50/30 to-white">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-[0.02]">
        <div
          className="absolute inset-0"
          style={{ backgroundImage: `url("data:image/svg+xml,...")` }}
        ></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-2 bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent">
            Checkout
          </h1>
          <p className="text-gray-600">Complete your order details</p>
        </div>

        {/* Form + Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form */}
          {/* ... keep your existing form JSX here ... */}
        </div>
      </div>
    </div>
  );
}

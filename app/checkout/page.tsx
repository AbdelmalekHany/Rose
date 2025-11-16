"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useCart } from "@/hooks/useCart";
import Image from "next/image";
import Link from "next/link";

export default function CheckoutPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const { cartItems, refreshCart, isLoading: cartLoading } = useCart();
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

  if (!session) {
    return (
      <div className="relative min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-rose-200 border-t-rose-600 rounded-full animate-spin"></div>
            <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-pink-400 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
          </div>
          <p className="text-gray-700 font-medium text-lg">Please wait...</p>
        </div>
      </div>
    );
  }
  
  if (cartLoading) {
    return (
      <div className="relative min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-rose-200 border-t-rose-600 rounded-full animate-spin"></div>
            <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-pink-400 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
          </div>
          <p className="text-gray-700 font-medium text-lg">Loading checkout...</p>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0 && session) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <p className="text-center text-gray-600 mb-4">Your cart is empty. Please add items to checkout.</p>
        <Link href="/" className="btn btn-primary block text-center max-w-xs mx-auto">
          Continue Shopping
        </Link>
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
          <form
            onSubmit={handleSubmit}
            className="lg:col-span-2 bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-gray-100"
          >
            <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent">
              Shipping Information
            </h2>

            <div className="space-y-6">
              <div>
                <label
                  htmlFor="shippingAddress"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Shipping Address
                </label>
                <textarea
                  id="shippingAddress"
                  value={shippingAddress}
                  onChange={(e) => setShippingAddress(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition-all"
                  rows={4}
                  placeholder="Enter your full address"
                  required
                ></textarea>
              </div>

              <div>
                <label
                  htmlFor="phoneNumber"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phoneNumber"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition-all"
                  placeholder="e.g., 01234567890"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="notes"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Order Notes (Optional)
                </label>
                <textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition-all"
                  rows={3}
                  placeholder="Any special instructions for your order?"
                ></textarea>
              </div>
            </div>

            {error && <p className="text-red-500 mt-4">{error}</p>}

            <div className="mt-8">
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full btn btn-primary block text-center overflow-hidden"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Processing Order...</span>
                    </>
                  ) : (
                    <>
                      <i className="fas fa-lock"></i>
                      <span>Place Order</span>
                      <i className="fas fa-arrow-right transform group-hover:translate-x-1 transition-transform"></i>
                    </>
                  )}
                </span>
                <div className="absolute inset-0 bg-white/20 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
              </button>
            </div>
          </form>

          {/* Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-gray-100 sticky top-20">
              <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent">
                Order Summary
              </h2>

              <div className="space-y-4 mb-6">
                {cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-16 h-16 relative bg-gray-100 rounded-lg flex-shrink-0 overflow-hidden">
                        <Image
                          src={item.product.image}
                          alt={item.product.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <p className="font-semibold">{item.product.name}</p>
                        <p className="text-sm text-gray-600">
                          Qty: {item.quantity}
                        </p>
                      </div>
                    </div>
                    <p className="font-semibold">
                      {(item.product.price * item.quantity).toFixed(2)} EGP
                    </p>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-200 pt-4 space-y-3">
                <div className="flex justify-between text-gray-700">
                  <span>Subtotal</span>
                  <span className="font-semibold">
                    {subtotal.toFixed(2)} EGP
                  </span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>Shipping</span>
                  <span
                    className={`font-semibold ${
                      subtotal >= 50 ? "text-green-600" : ""
                    }`}
                  >
                    {subtotal >= 50 ? "Free" : `${shipping.toFixed(2)} EGP`}
                  </span>
                </div>
                <div className="border-t-2 border-gray-200 pt-4 flex justify-between font-bold text-xl">
                  <span>Total</span>
                  <span className="bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent">
                    {total.toFixed(2)} EGP
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

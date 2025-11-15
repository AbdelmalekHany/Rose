"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import CancelOrderButton from "@/components/CancelOrderButton";

interface OrderDetailsClientProps {
  order: any;
}

export default function OrderDetailsClient({ order }: OrderDetailsClientProps) {
  return (
    <>
      {/* Status / Payment / Total */}
      <div className="grid grid-cols-2 gap-4 mb-8 p-4 rounded-xl bg-gradient-to-br from-rose-50 to-pink-50 border border-rose-200">
        <div>
          <p className="text-sm text-gray-600 mb-1 font-semibold">Status</p>
          <span
            className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
              order.status === "DELIVERED"
                ? "bg-green-100 text-green-800 border-2 border-green-300"
                : order.status === "CANCELLED"
                ? "bg-red-100 text-red-800 border-2 border-red-300"
                : "bg-yellow-100 text-yellow-800 border-2 border-yellow-300"
            }`}
          >
            {order.status}
          </span>
        </div>
        <div>
          <p className="text-sm text-gray-600 mb-1 font-semibold">
            Payment Status
          </p>
          <p className="font-semibold capitalize text-gray-800">
            {order.paymentStatus}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-600 mb-1 font-semibold">Order Date</p>
          <p className="font-semibold text-gray-800">
            {new Date(order.createdAt).toLocaleDateString()}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-600 mb-1 font-semibold">Total</p>
          <p className="font-extrabold text-2xl bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent">
            {order.total.toFixed(2)} EGP
          </p>
        </div>
      </div>

      {/* Contact Info */}
      <div className="mb-8">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <i className="fas fa-address-card text-rose-500"></i> Contact
          Information
        </h2>
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-gray-50 border border-gray-200">
            <p className="text-sm text-gray-600 mb-1 font-semibold flex items-center gap-2">
              <i className="fas fa-phone text-rose-400"></i>Phone Number
            </p>
            <p className="text-rose-600 font-semibold">{order.phoneNumber}</p>
          </div>
          <div className="p-4 rounded-xl bg-gray-50 border border-gray-200">
            <p className="text-sm text-gray-600 mb-1 font-semibold flex items-center gap-2">
              <i className="fas fa-map-marker-alt text-rose-400"></i>Shipping
              Address
            </p>
            <p className="text-gray-800 whitespace-pre-line">
              {order.shippingAddress}
            </p>
          </div>
        </div>
      </div>

      {/* Items */}
      <div>
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <i className="fas fa-shopping-bag text-rose-500"></i> Order Items
        </h2>
        <div className="space-y-3">
          {order.items.map((item: any) => (
            <div
              key={item.id}
              className="group flex gap-4 p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border border-gray-200 hover:border-rose-200 transition-all duration-300 hover:shadow-md"
            >
              <div className="w-24 h-24 relative bg-white rounded-xl flex-shrink-0 overflow-hidden">
                {item.product.image ? (
                  <Image
                    src={item.product.image}
                    alt={item.product.name}
                    fill
                    className="object-cover rounded-xl transition-transform duration-300 group-hover:scale-110"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <i className="fas fa-image text-2xl"></i>
                  </div>
                )}
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-lg text-gray-800 mb-1">
                  {item.product.name}
                </h3>
                <p className="text-gray-600">
                  Quantity: <strong>{item.quantity}</strong> ×{" "}
                  <span className="font-semibold text-rose-600">
                    {item.price.toFixed(2)} EGP
                  </span>
                </p>
              </div>
              <div className="font-extrabold text-xl bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent">
                {(item.price * item.quantity).toFixed(2)} EGP
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Cancel / Continue Shopping */}
      <div className="mt-8 flex flex-col sm:flex-row gap-4">
        {(order.status === "PENDING" || order.status === "PROCESSING") && (
          <CancelOrderButton orderId={order.id} />
        )}
        <Link
          href="/"
          className="group relative inline-flex items-center justify-center gap-2 btn btn-primary overflow-hidden"
        >
          <span className="relative z-10 flex items-center gap-2">
            <i className="fas fa-arrow-left transform group-hover:-translate-x-1 transition-transform"></i>
            <span>Continue Shopping</span>
          </span>
          <div className="absolute inset-0 bg-white/20 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
        </Link>
      </div>
    </>
  );
}

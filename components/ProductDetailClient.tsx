// ProductDetailClient.tsx
"use client";

import Image from "next/image";
import { useCart } from "@/hooks/useCart";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface ProductImage {
  id: number | string;
  url: string;
  position: number;
  isCover?: boolean;
}

interface Product {
  id: number | string;
  name: string;
  description: string | null;
  price: number;
  image?: string | null;
  category: string | null;
  stock: number;
  images?: ProductImage[];
}

export default function ProductDetailClient({ product }: { product: Product }) {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const router = useRouter();

  // Collect all images, prefer product.images over product.image
  const allImages =
    product.images && product.images.length > 0
      ? product.images.map((img) => img.url)
      : product.image
      ? [product.image]
      : [];

  // Determine initial cover image if any
  useEffect(() => {
    if (product.images && product.images.length > 0) {
      const coverIndex = product.images.findIndex((img) => img.isCover);
      setSelectedImageIndex(coverIndex !== -1 ? coverIndex : 0);
    } else {
      setSelectedImageIndex(0);
    }
  }, [product.images]);

  // Ensure selected index is valid
  const safeIndex =
    allImages.length > 0
      ? Math.min(selectedImageIndex, allImages.length - 1)
      : 0;
  const displayImage = allImages[safeIndex] || null;

  const handleAddToCart = async () => {
    if (product.stock === 0) {
      alert("This product is out of stock");
      return;
    }

    setAdding(true);
    const success = await addToCart(String(product.id), quantity);
    setAdding(false);

    if (success) {
      const goToCart = confirm("Added to cart! Would you like to go to cart?");
      if (goToCart) {
        router.push("/cart");
      }
    }
  };

  return (
    <div>
      <h1>{product.name}</h1>
    </div>
  );
}

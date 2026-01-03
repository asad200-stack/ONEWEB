"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { formatCurrency } from "@/lib/utils";

interface ProductDetailPageProps {
  store: any;
  product: any;
}

export default function ProductDetailPage({ store, product }: ProductDetailPageProps) {
  const [language, setLanguage] = useState(store.settings?.language || "en");
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const isRTL = language === "ar";

  const shareUrl = typeof window !== "undefined" ? window.location.href : "";
  const shareText = `${product.name} - ${formatCurrency(
    product.discountedPrice || product.price,
    product.currency
  )}`;

  const shareLinks = {
    whatsapp: `https://wa.me/?text=${encodeURIComponent(shareText + " " + shareUrl)}`,
    messenger: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
  };

  const copyLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(shareUrl);
      alert(language === "en" ? "Link copied!" : "تم نسخ الرابط!");
    }
  };

  return (
    <div dir={isRTL ? "rtl" : "ltr"} className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href={`/store/${store.slug}`} className="text-xl font-bold">
              {store.name}
            </Link>
            <button
              onClick={() => setLanguage(language === "en" ? "ar" : "en")}
              className="px-4 py-2 border rounded-md hover:bg-gray-100"
            >
              {language === "en" ? "العربية" : "English"}
            </button>
          </div>
        </div>
      </header>

      {/* Product Detail */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8">
            {/* Images */}
            <div>
              {product.images && product.images.length > 0 ? (
                <>
                  <div className="relative w-full h-96 bg-gray-200 rounded-lg mb-4">
                    <Image
                      src={product.images[selectedImageIndex].url}
                      alt={product.name}
                      fill
                      className="object-cover rounded-lg"
                    />
                  </div>
                  {product.images.length > 1 && (
                    <div className="grid grid-cols-4 gap-2">
                      {product.images.map((img: any, index: number) => (
                        <button
                          key={img.id}
                          onClick={() => setSelectedImageIndex(index)}
                          className={`relative w-full h-24 bg-gray-200 rounded ${
                            selectedImageIndex === index ? "ring-2 ring-indigo-500" : ""
                          }`}
                        >
                          <Image
                            src={img.url}
                            alt={`${product.name} ${index + 1}`}
                            fill
                            className="object-cover rounded"
                          />
                        </button>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <div className="w-full h-96 bg-gray-200 rounded-lg flex items-center justify-center">
                  <span className="text-gray-400">
                    {language === "en" ? "No Image" : "لا توجد صورة"}
                  </span>
                </div>
              )}
            </div>

            {/* Product Info */}
            <div>
              <h1 className="text-3xl font-bold mb-4">{product.name}</h1>

              {product.category && (
                <Link
                  href={`/store/${store.slug}?category=${product.category.slug}`}
                  className="text-indigo-600 hover:underline mb-4 block"
                >
                  {product.category.name}
                </Link>
              )}

              {product.tags && product.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {product.tags.map((tag: any) => (
                    <span
                      key={tag.id}
                      className="px-3 py-1 bg-gray-100 rounded-full text-sm"
                    >
                      {tag.name}
                    </span>
                  ))}
                </div>
              )}

              <div className="mb-6">
                {product.discountActive && product.discountedPrice ? (
                  <div>
                    <div className="flex items-center space-x-4 mb-2">
                      <span className="text-3xl font-bold text-red-600">
                        {formatCurrency(product.discountedPrice, product.currency)}
                      </span>
                      <span className="text-xl text-gray-500 line-through">
                        {formatCurrency(product.price, product.currency)}
                      </span>
                      <span className="px-3 py-1 bg-red-500 text-white rounded text-sm font-bold">
                        {language === "en" ? "SALE" : "خصم"}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">
                      {Math.round(
                        ((product.price - product.discountedPrice) / product.price) * 100
                      )}
                      % {language === "en" ? "off" : "خصم"}
                    </p>
                  </div>
                ) : (
                  <span className="text-3xl font-bold">
                    {formatCurrency(product.price, product.currency)}
                  </span>
                )}
              </div>

              {product.stock === 0 ? (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded">
                  <p className="text-red-700 font-medium">
                    {language === "en" ? "Out of Stock" : "نفدت الكمية"}
                  </p>
                </div>
              ) : (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded">
                  <p className="text-green-700 font-medium">
                    {language === "en"
                      ? `In Stock (${product.stock} available)`
                      : `متوفر (${product.stock} متاح)`}
                  </p>
                </div>
              )}

              {product.description && (
                <div className="mb-6">
                  <h2 className="text-xl font-semibold mb-2">
                    {language === "en" ? "Description" : "الوصف"}
                  </h2>
                  <p className="text-gray-700 whitespace-pre-line">{product.description}</p>
                </div>
              )}

              {product.specifications && (
                <div className="mb-6">
                  <h2 className="text-xl font-semibold mb-2">
                    {language === "en" ? "Specifications" : "المواصفات"}
                  </h2>
                  <p className="text-gray-700 whitespace-pre-line">{product.specifications}</p>
                </div>
              )}

              {product.sku && (
                <p className="text-sm text-gray-500 mb-6">
                  SKU: {product.sku}
                </p>
              )}

              {/* Share Buttons */}
              <div className="border-t pt-6">
                <h3 className="font-semibold mb-3">
                  {language === "en" ? "Share Product" : "مشاركة المنتج"}
                </h3>
                <div className="flex space-x-2">
                  <a
                    href={shareLinks.whatsapp}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
                  >
                    WhatsApp
                  </a>
                  <a
                    href={shareLinks.messenger}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                  >
                    Messenger
                  </a>
                  <button
                    onClick={copyLink}
                    className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
                  >
                    {language === "en" ? "Copy Link" : "نسخ الرابط"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}


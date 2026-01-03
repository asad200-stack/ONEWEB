"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { formatCurrency } from "@/lib/utils";

interface StoreFrontendProps {
  store: any;
}

export default function StoreFrontend({ store }: StoreFrontendProps) {
  const [language, setLanguage] = useState(store.settings?.language || "en");
  const isRTL = language === "ar";

  return (
    <div dir={isRTL ? "rtl" : "ltr"} className="min-h-screen bg-gray-50">
      {/* Header */}
      <header
        className="bg-white shadow-sm"
        style={{
          backgroundColor: store.settings?.primaryColor || "#ffffff",
          color: store.settings?.secondaryColor || "#000000",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {store.logo && (
                <Image
                  src={store.logo}
                  alt={store.name}
                  width={50}
                  height={50}
                  className="rounded"
                />
              )}
              <h1 className="text-2xl font-bold">{store.name}</h1>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setLanguage(language === "en" ? "ar" : "en")}
                className="px-4 py-2 border rounded-md hover:bg-gray-100"
              >
                {language === "en" ? "العربية" : "English"}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Promotional Banners */}
      {store.promotionalBanners && store.promotionalBanners.length > 0 && (
        <div className="bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="space-y-4">
              {store.promotionalBanners.map((banner: any) => (
                <div
                  key={banner.id}
                  className="relative rounded-lg overflow-hidden"
                >
                  {banner.imageUrl && (
                    <Image
                      src={banner.imageUrl}
                      alt={banner.title || ""}
                      width={1200}
                      height={400}
                      className="w-full h-auto object-cover"
                    />
                  )}
                  {(banner.title || banner.subtitle || banner.description) && (
                    <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center p-8">
                      <div className="text-center text-white">
                        {banner.title && (
                          <h2 className="text-3xl font-bold mb-2">{banner.title}</h2>
                        )}
                        {banner.subtitle && (
                          <h3 className="text-xl mb-2">{banner.subtitle}</h3>
                        )}
                        {banner.description && (
                          <p className="text-lg">{banner.description}</p>
                        )}
                        {banner.linkUrl && (
                          <a
                            href={banner.linkUrl}
                            className="mt-4 inline-block px-6 py-2 bg-white text-black rounded-md hover:bg-gray-100"
                          >
                            {language === "en" ? "Learn More" : "اعرف المزيد"}
                          </a>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Categories */}
        {store.categories && store.categories.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4">
              {language === "en" ? "Categories" : "الفئات"}
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {store.categories.map((category: any) => (
                <Link
                  key={category.id}
                  href={`/store/${store.slug}?category=${category.slug}`}
                  className="bg-white rounded-lg shadow p-4 hover:shadow-md transition-shadow text-center"
                >
                  {category.image && (
                    <Image
                      src={category.image}
                      alt={category.name}
                      width={100}
                      height={100}
                      className="mx-auto mb-2 rounded"
                    />
                  )}
                  <h3 className="font-medium">{category.name}</h3>
                  <p className="text-sm text-gray-500">
                    {category._count.products} {language === "en" ? "products" : "منتج"}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Products Grid */}
        <div>
          <h2 className="text-2xl font-bold mb-4">
            {language === "en" ? "Products" : "المنتجات"}
          </h2>
          {store.products && store.products.length > 0 ? (
            <div
              className={
                store.settings?.displayMode === "cards"
                  ? "grid grid-cols-1 gap-6"
                  : "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              }
            >
              {store.products.map((product: any) => (
                <Link
                  key={product.id}
                  href={`/store/${store.slug}/product/${product.slug}`}
                  className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow overflow-hidden"
                >
                  {product.images && product.images.length > 0 && (
                    <div className="relative w-full h-48 bg-gray-200">
                      <Image
                        src={product.images[0].url}
                        alt={product.name}
                        fill
                        className="object-cover"
                      />
                      {product.discountActive && product.discountedPrice && (
                        <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-sm font-bold">
                          {language === "en" ? "SALE" : "خصم"}
                        </div>
                      )}
                    </div>
                  )}
                  <div className="p-4">
                    <h3 className="font-semibold text-lg mb-2">{product.name}</h3>
                    {product.category && (
                      <p className="text-sm text-gray-500 mb-2">{product.category.name}</p>
                    )}
                    <div className="flex items-center space-x-2">
                      {product.discountActive && product.discountedPrice ? (
                        <>
                          <span className="text-lg font-bold text-red-600">
                            {formatCurrency(product.discountedPrice, product.currency)}
                          </span>
                          <span className="text-sm text-gray-500 line-through">
                            {formatCurrency(product.price, product.currency)}
                          </span>
                        </>
                      ) : (
                        <span className="text-lg font-bold">
                          {formatCurrency(product.price, product.currency)}
                        </span>
                      )}
                    </div>
                    {product.stock === 0 && (
                      <p className="text-sm text-red-500 mt-2">
                        {language === "en" ? "Out of Stock" : "نفدت الكمية"}
                      </p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-12">
              {language === "en" ? "No products available" : "لا توجد منتجات متاحة"}
            </p>
          )}
        </div>
      </main>

      {/* Contact Form */}
      <footer className="bg-white border-t mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h2 className="text-2xl font-bold mb-4">
            {language === "en" ? "Contact Us" : "اتصل بنا"}
          </h2>
          <ContactForm storeId={store.id} language={language} />
        </div>
      </footer>
    </div>
  );
}

function ContactForm({ storeId, language }: { storeId: string; language: string }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);

    try {
      const res = await fetch(`/api/stores/${storeId}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setSuccess(true);
        setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
      }
    } catch (error) {
      // Handle error
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl">
      {success && (
        <div className="mb-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
          {language === "en" ? "Message sent successfully!" : "تم إرسال الرسالة بنجاح!"}
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          type="text"
          required
          placeholder={language === "en" ? "Name" : "الاسم"}
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="px-4 py-2 border rounded-md"
        />
        <input
          type="email"
          required
          placeholder={language === "en" ? "Email" : "البريد الإلكتروني"}
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className="px-4 py-2 border rounded-md"
        />
        <input
          type="tel"
          placeholder={language === "en" ? "Phone (Optional)" : "الهاتف (اختياري)"}
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          className="px-4 py-2 border rounded-md"
        />
        <input
          type="text"
          placeholder={language === "en" ? "Subject (Optional)" : "الموضوع (اختياري)"}
          value={formData.subject}
          onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
          className="px-4 py-2 border rounded-md"
        />
      </div>
      <textarea
        required
        rows={4}
        placeholder={language === "en" ? "Message" : "الرسالة"}
        value={formData.message}
        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
        className="w-full mt-4 px-4 py-2 border rounded-md"
      />
      <button
        type="submit"
        disabled={loading}
        className="mt-4 px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
      >
        {loading
          ? language === "en"
            ? "Sending..."
            : "جاري الإرسال..."
          : language === "en"
          ? "Send Message"
          : "إرسال الرسالة"}
      </button>
    </form>
  );
}


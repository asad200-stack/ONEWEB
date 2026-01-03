"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { formatCurrency } from "@/lib/utils";

interface ProductsListProps {
  storeId: string;
  store: any;
  products: any[];
  categories: any[];
  tags: any[];
  role: string;
}

export default function ProductsList({
  storeId,
  store,
  products: initialProducts,
  categories,
  tags,
  role,
}: ProductsListProps) {
  const [products, setProducts] = useState(initialProducts);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const canEdit = role === "Owner" || role === "Editor";

  const handleDelete = async (productId: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    try {
      const res = await fetch(`/api/stores/${storeId}/products/${productId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setProducts(products.filter((p) => p.id !== productId));
      }
    } catch (error) {
      alert("Failed to delete product");
    }
  };

  const handleToggleActive = async (product: any) => {
    try {
      const res = await fetch(`/api/stores/${storeId}/products/${product.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !product.isActive }),
      });

      if (res.ok) {
        const data = await res.json();
        setProducts(
          products.map((p) => (p.id === product.id ? data.product : p))
        );
      }
    } catch (error) {
      alert("Failed to update product");
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Products</h1>
          <p className="mt-2 text-sm text-gray-600">
            Manage your store products
          </p>
        </div>
        {canEdit && (
          <Link
            href={`/dashboard/stores/${storeId}/products/new`}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            Add Product
          </Link>
        )}
      </div>

      {products.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <p className="text-gray-500 mb-4">No products yet.</p>
          {canEdit && (
            <Link
              href={`/dashboard/stores/${storeId}/products/new`}
              className="inline-block px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
            >
              Create Your First Product
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-lg shadow hover:shadow-md transition-shadow overflow-hidden"
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
                    <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-bold">
                      SALE
                    </div>
                  )}
                </div>
              )}
              <div className="p-4">
                <h3 className="font-semibold text-lg mb-2">{product.name}</h3>
                {product.category && (
                  <p className="text-sm text-gray-500 mb-2">
                    {product.category.name}
                  </p>
                )}
                <div className="flex items-center space-x-2 mb-4">
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
                <div className="flex items-center justify-between">
                  <span
                    className={`text-sm ${
                      product.isActive ? "text-green-600" : "text-gray-500"
                    }`}
                  >
                    {product.isActive ? "Active" : "Inactive"}
                  </span>
                  <span className="text-sm text-gray-500">
                    Stock: {product.stock}
                  </span>
                </div>
                {canEdit && (
                  <div className="mt-4 flex space-x-2">
                    <Link
                      href={`/dashboard/stores/${storeId}/products/${product.id}/edit`}
                      className="flex-1 text-center px-3 py-2 text-sm bg-indigo-50 text-indigo-600 rounded-md hover:bg-indigo-100"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleToggleActive(product)}
                      className="px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
                    >
                      {product.isActive ? "Deactivate" : "Activate"}
                    </button>
                    <button
                      onClick={() => handleDelete(product.id)}
                      className="px-3 py-2 text-sm bg-red-50 text-red-600 rounded-md hover:bg-red-100"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}


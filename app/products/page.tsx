"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

async function getProducts(page: number, search: string) {
  const apiBase = process.env.NEXT_PUBLIC_API_URL;
  const url = apiBase
    ? new URL("/api/products", apiBase)
    : new URL("/api/products", window.location.origin);

  url.searchParams.set("page", String(page));
  url.searchParams.set("limit", "3");
  if (search) {
    url.searchParams.set("search", search);
  }

  const res = await fetch(url.toString(), {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch products");
  }

  return res.json();
}

export default function ProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);

  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      try {
        const data = await getProducts(currentPage, searchQuery);
        setProducts(data.products ?? []);
        setTotalPages(data.totalPages ?? 1);
        setTotalProducts(data.total ?? 0);
      } catch (error) {
        console.error(error);
        setProducts([]);
        setTotalPages(1);
        setTotalProducts(0);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, [currentPage, searchQuery]);

  const handleSearch = () => {
    setCurrentPage(1);
    setSearchQuery(searchTerm.trim());
  };

  const handleClearSearch = () => {
    setSearchTerm("");
    setSearchQuery("");
    setCurrentPage(1);
  };

  const handleToggleStatus = async (product: any) => {
    await fetch(`/api/products/${product._id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: !product.isActive }),
    });
    setCurrentPage(1);
    setSearchQuery(searchQuery);
  };

  const handleDelete = async (id: string) => {
    await fetch(`/api/products/${id}`, { method: "DELETE" });
    setCurrentPage(1);
    setSearchQuery(searchQuery);
  };

  if (loading) {
    return <div className="p-8 text-center text-slate-500 dark:text-slate-400">Loading products...</div>;
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 text-slate-900 transition-colors dark:bg-slate-950 dark:text-slate-100 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">
              Inventory
            </p>
            <h1 className="text-3xl font-semibold tracking-tight">Products</h1>
          </div>

          <Link
            href="/products/add"
            className="inline-flex items-center justify-center rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-700 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200"
          >
            + Add Product
          </Link>
        </div>

        <div className="mb-8 grid gap-3 sm:grid-cols-[1fr_auto] sm:items-center">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <label className="sr-only" htmlFor="product-search">
              Search products
            </label>
            <input
              id="product-search"
              type="text"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search products"
              className="min-w-0 flex-1 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm text-slate-900 shadow-sm outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-300 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:focus:border-slate-500"
            />

            <button
              type="button"
              onClick={handleSearch}
              className="inline-flex items-center justify-center rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200"
            >
              Search
            </button>
            <button
              type="button"
              onClick={handleClearSearch}
              className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              Clear
            </button>
          </div>

          <p className="text-sm text-slate-500 dark:text-slate-400">
            Showing {products.length} / {totalProducts} product{totalProducts === 1 ? "" : "s"}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {products.map((product: any) => (
            <article
              key={product._id}
              className="group rounded-2xl border border-slate-200/80 bg-white/80 p-5 shadow-sm backdrop-blur-sm transition duration-200 hover:-translate-y-1 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900/80"
            >
              <div className="mb-4 flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                    {product.product_name}
                  </h2>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    {product.brand?.brand_name || "Unassigned brand"}
                  </p>
                </div>

                <span
                  className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                    product.isActive
                      ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300"
                      : "bg-rose-100 text-rose-700 dark:bg-rose-500/15 dark:text-rose-300"
                  }`}
                >
                  {product.isActive ? "Active" : "Inactive"}
                </span>
              </div>

              <div className="space-y-3 rounded-xl bg-slate-50 p-3 text-sm dark:bg-slate-800/70">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 dark:text-slate-400">Price</span>
                  <span className="font-semibold text-slate-900 dark:text-white">
                    ₹{product.price_range.minimum_price} - ₹{product.price_range.maximum_price}
                  </span>
                </div>
                <div className="space-y-2">
                  <span className="text-slate-500 dark:text-slate-400">Categories</span>
                  {product.categories?.length ? (
                    <div className="flex flex-wrap gap-1.5">
                      {product.categories.slice(0, 3).map((category: any, index: number) => (
                        <span
                          key={category._id || `${category.name || "category"}-${index}`}
                          className="rounded-full bg-slate-200 px-2 py-1 text-[11px] font-medium text-slate-700 dark:bg-slate-700 dark:text-slate-200"
                        >
                          {typeof category === "string" ? category : category.name || category._id}
                        </span>
                      ))}
                      {product.categories.length > 3 && (
                        <span className="rounded-full bg-slate-200 px-2 py-1 text-[11px] font-medium text-slate-700 dark:bg-slate-700 dark:text-slate-200">
                          +{product.categories.length - 3}
                        </span>
                      )}
                    </div>
                  ) : (
                    <p className="text-sm text-slate-500 dark:text-slate-400">No categories</p>
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 dark:text-slate-400">Tags</span>
                  <span className="font-medium text-slate-700 dark:text-slate-200">
                    {product.tags?.length || 0}
                  </span>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
                <div className="flex flex-wrap gap-2">
                  {product.isFeatured && (
                    <span className="rounded-full bg-amber-100 px-2.5 py-1 text-xs font-medium text-amber-700 dark:bg-amber-500/15 dark:text-amber-300">
                      Featured
                    </span>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => handleToggleStatus(product)}
                    className="rounded-full border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
                  >
                    {product.isActive ? "Deactivate" : "Activate"}
                  </button>
                  <button
                    onClick={() => handleDelete(product._id)}
                    className="rounded-full border border-rose-200 px-3 py-1.5 text-xs font-semibold text-rose-600 transition hover:bg-rose-50 dark:border-rose-800 dark:text-rose-300 dark:hover:bg-rose-950/40"
                  >
                    Delete
                  </button>
                  <Link
                    href={`/products/${product._id}`}
                    className="text-sm font-semibold text-slate-700 transition hover:text-slate-950 dark:text-slate-300 dark:hover:text-white"
                  >
                    View details →
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-8 flex flex-col items-center justify-between gap-4 rounded-2xl border border-slate-200/80 bg-white/80 p-4 text-sm text-slate-700 shadow-sm dark:border-slate-800 dark:bg-slate-900/80 dark:text-slate-300 sm:flex-row">
          <p>
            Page {currentPage} of {totalPages}
          </p>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage <= 1}
              className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200 dark:hover:bg-slate-900"
            >
              Previous
            </button>
            <button
              type="button"
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage >= totalPages}
              className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200 dark:hover:bg-slate-900"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}

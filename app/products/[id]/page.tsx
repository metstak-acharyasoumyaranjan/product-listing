"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

async function getProduct(id: string) {
  const res = await fetch(`http://localhost:3000/api/products/${id}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch product details");
  }

  return res.json();
}

export default function ProductDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const [product, setProduct] = useState<any>(null);
  const [id, setId] = useState<string | null>(null);

  useEffect(() => {
    const loadProduct = async () => {
      const resolvedParams = await params;
      setId(resolvedParams.id);
      const data = await getProduct(resolvedParams.id);
      setProduct(data);
    };

    loadProduct();
  }, [params]);

  const handleToggleStatus = async () => {
    if (!id || !product) return;
    await fetch(`/api/products/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: !product.isActive }),
    });
    const updated = await getProduct(id);
    setProduct(updated);
  };

  const handleDelete = async () => {
    if (!id) return;
    await fetch(`/api/products/${id}`, { method: "DELETE" });
    router.push("/products");
  };

  if (!product) {
    return <div className="p-8 text-center text-slate-500 dark:text-slate-400">Loading product...</div>;
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 text-slate-900 transition-colors dark:bg-slate-950 dark:text-slate-100 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <Link
          href="/products"
          className="inline-flex items-center text-sm font-medium text-slate-600 transition hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
        >
          ← Back to products
        </Link>

        <div className="mt-6 rounded-3xl border border-slate-200/80 bg-white/80 p-6 shadow-sm backdrop-blur-sm dark:border-slate-800 dark:bg-slate-900/80 sm:p-8">
          <div className="mb-6 flex flex-wrap items-center justify-end gap-2">
            <button
              onClick={handleToggleStatus}
              className="rounded-full border border-slate-200 px-3 py-1.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              {product.isActive ? "Deactivate" : "Activate"}
            </button>
            <button
              onClick={handleDelete}
              className="rounded-full border border-rose-200 px-3 py-1.5 text-sm font-semibold text-rose-600 transition hover:bg-rose-50 dark:border-rose-800 dark:text-rose-300 dark:hover:bg-rose-950/40"
            >
              Delete
            </button>
          </div>
          <div className="flex flex-col gap-4 border-b border-slate-200 pb-6 dark:border-slate-800">
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">
                Product details
              </p>
              {product.isFeatured ? (
                <span className="rounded-full bg-amber-100 px-2.5 py-1 text-xs font-medium text-amber-700 dark:bg-amber-500/15 dark:text-amber-300">
                  Featured
                </span>
              ) : null}
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

            <div>
              <h1 className="text-3xl font-semibold tracking-tight">
                {product.product_name}
              </h1>
              <p className="mt-2 text-base text-slate-600 dark:text-slate-300">
                {product.brand?.brand_name || "Unassigned brand"}
              </p>
            </div>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-800/70">
              <p className="text-sm text-slate-500 dark:text-slate-400">Brand</p>
              <p className="mt-1 font-semibold text-slate-900 dark:text-white">
                {product.brand?.brand_name || "Not available"}
              </p>
            </div>

            <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-800/70">
              <p className="text-sm text-slate-500 dark:text-slate-400">Manufacturer</p>
              <p className="mt-1 font-semibold text-slate-900 dark:text-white">
                {product.brand?.manufacturer?.manufacturer_name || "Not available"}
              </p>
            </div>

            <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-800/70">
              <p className="text-sm text-slate-500 dark:text-slate-400">Price range</p>
              <p className="mt-1 font-semibold text-slate-900 dark:text-white">
                {product.price_range?.currency || "INR"} {product.price_range?.minimum_price} - {product.price_range?.maximum_price}
              </p>
            </div>

            <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-800/70">
              <p className="text-sm text-slate-500 dark:text-slate-400">Variants</p>
              <p className="mt-1 font-semibold text-slate-900 dark:text-white">
                {product.enable_variants ? "Enabled" : "Disabled"}
              </p>
            </div>
          </div>

          <div className="mt-6 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="rounded-2xl border border-slate-200 p-4 dark:border-slate-800">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
                Categories
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {product.categories?.length ? (
                  product.categories.map((category: any) => (
                    <span
                      key={category._id}
                      className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-700 dark:bg-slate-800 dark:text-slate-200"
                    >
                      {category.name}
                    </span>
                  ))
                ) : (
                  <p className="text-sm text-slate-500 dark:text-slate-400">No categories assigned</p>
                )}
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 p-4 dark:border-slate-800">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
                Tags
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {product.tags?.length ? (
                  product.tags.map((tag: string, index: number) => (
                    <span
                      key={`${tag}-${index}`}
                      className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-700 dark:bg-slate-800 dark:text-slate-200"
                    >
                      {tag}
                    </span>
                  ))
                ) : (
                  <p className="text-sm text-slate-500 dark:text-slate-400">No tags added</p>
                )}
              </div>
            </div>
          </div>

          <div className="mt-6 rounded-2xl border border-slate-200 p-4 dark:border-slate-800">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
              Specifications
            </p>
            {product.specification?.length ? (
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {product.specification.map((item: any, index: number) => (
                  <div key={`${item.name}-${index}`} className="rounded-xl bg-slate-50 p-3 dark:bg-slate-800/70">
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">{item.name}</p>
                    <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{item.value}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">No specifications added</p>
            )}
          </div>

          {product.gallery?.length ? (
            <div className="mt-6 rounded-2xl border border-slate-200 p-4 dark:border-slate-800">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
                Gallery
              </p>
              <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {product.gallery.map((item: any, index: number) => (
                  <div key={`${item.url}-${index}`} className="overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-700">
                    {item.url ? (
                      <img src={item.url} alt={item.alt_text || product.product_name} className="h-40 w-full object-cover" />
                    ) : (
                      <div className="flex h-40 items-center justify-center bg-slate-100 text-sm text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                        Media item
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </main>
  );
}

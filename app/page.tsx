import Link from "next/link";

export default function Page() {
  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10 text-slate-900 transition-colors dark:bg-slate-950 dark:text-slate-100 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-6xl flex-col gap-6">
        <section className="rounded-3xl border border-slate-200/80 bg-white/80 p-8 shadow-sm backdrop-blur-sm dark:border-slate-800 dark:bg-slate-900/80">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">
            Product listing
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight">Manage your catalog with ease</h1>
          <p className="mt-3 max-w-2xl text-sm text-slate-600 dark:text-slate-300">
            Create products, organize categories, and keep your inventory polished in a clean, modern workspace.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/products"
              className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-700 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200"
            >
              Browse products
            </Link>
            <Link
              href="/products/add"
              className="inline-flex items-center justify-center rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              Add product
            </Link>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900/70">
            <h2 className="text-lg font-semibold">Products</h2>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">Create and review product details in one place.</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900/70">
            <h2 className="text-lg font-semibold">Categories</h2>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">Group your catalog with custom categories.</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900/70">
            <h2 className="text-lg font-semibold">Brands</h2>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">Manage your brand and manufacturer relationships.</p>
          </div>
        </section>
      </div>
    </main>
  );
}
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import {
  ManufacturerInputForm,
  ManufacturerValidationSchema,
} from "@/schema/db_validation";

export default function ManufacturerForm() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ManufacturerInputForm>({
    resolver: zodResolver(ManufacturerValidationSchema),
    defaultValues: {
      manufacturer_name: "",
      description: "",
      isActive: true,
    },
  });

  async function onSubmit(data: ManufacturerInputForm) {
    const response = await fetch("/api/manufacturers", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      toast.error("Failed to create manufacturer");
      return;
    }

    toast.success("Manufacturer created successfully");

    reset();
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 text-slate-900 transition-colors dark:bg-slate-950 dark:text-slate-100 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl rounded-3xl border border-slate-200/80 bg-white/80 p-6 shadow-sm backdrop-blur-sm dark:border-slate-800 dark:bg-slate-900/80 sm:p-8">
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">
            Partners
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight">Create manufacturer</h1>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
            Add a manufacturer to keep your product records organized.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label className="mb-2 block text-sm font-medium">Manufacturer Name</label>
            <input
              {...register("manufacturer_name")}
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200 dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-100 dark:focus:border-slate-500 dark:focus:ring-slate-800"
              placeholder="Enter manufacturer name"
            />
            {errors.manufacturer_name && <p className="mt-1 text-sm text-rose-500">{errors.manufacturer_name.message}</p>}
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">Description</label>
            <textarea
              {...register("description")}
              rows={4}
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200 dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-100 dark:focus:border-slate-500 dark:focus:ring-slate-800"
              placeholder="Enter description"
            />
          </div>

          <label className="inline-flex items-center gap-2 text-sm text-slate-700 dark:text-slate-200">
            <input type="checkbox" {...register("isActive")} />
            Active
          </label>

          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-70 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200"
          >
            {isSubmitting ? "Creating..." : "Create Manufacturer"}
          </button>
        </form>
      </div>
    </main>
  );
}
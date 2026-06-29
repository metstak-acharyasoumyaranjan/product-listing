"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import {
  ProductInputForm,
  ProductValidationSchema,
} from "@/schema/db_validation";

interface Brand {
  _id: string;
  brand_name: string;
}

interface Category {
  _id: string;
  name: string;
}

type SpecificationItem = {
  name: string;
  value: string;
};

type GalleryItem = {
  url: string;
  mime_type: string;
  file_name: string;
  alt_text: string;
};

type VariantValue = {
  label: string;
  value: string;
};

type VariantAttribute = {
  name: string;
  unit: string;
  values: VariantValue[];
};

export default function ProductForm() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [specifications, setSpecifications] = useState<SpecificationItem[]>([
    { name: "", value: "" },
  ]);
  const [tags, setTags] = useState<string[]>([""]);
  const [gallery, setGallery] = useState<GalleryItem[]>([
    { url: "", mime_type: "", file_name: "", alt_text: "" },
  ]);
  const [variantAttributes, setVariantAttributes] = useState<VariantAttribute[]>([
    { name: "", unit: "", values: [{ label: "", value: "" }] },
  ]);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ProductInputForm>({
    resolver: zodResolver(ProductValidationSchema),
    defaultValues: {
      product_name: "",
      brand: "",
      categories: [],
      price_range: {
        minimum_price: 0,
        maximum_price: 0,
        currency: "INR",
      },
      enable_variants: false,
      gallery: [],
      specification: [],
      tags: [],
      isActive: true,
      isFeatured: false,
    },
  });

  const enableVariants = watch("enable_variants");

  async function fetchBrands() {
    const res = await fetch("/api/brands");
    const data = await res.json();
    setBrands(data);
  }

  async function fetchCategories() {
    const res = await fetch("/api/categories");
    const data = await res.json();
    setCategories(data);
  }

  useEffect(() => {
    fetchBrands();
    fetchCategories();
  }, []);

  const toggleCategory = (categoryId: string) => {
    const nextValues = selectedCategories.includes(categoryId)
      ? selectedCategories.filter((id) => id !== categoryId)
      : [...selectedCategories, categoryId];

    setSelectedCategories(nextValues);
    setValue("categories", nextValues);
  };

  const updateSpecification = (
    index: number,
    field: keyof SpecificationItem,
    value: string
  ) => {
    setSpecifications((current) =>
      current.map((item, itemIndex) =>
        itemIndex === index ? { ...item, [field]: value } : item
      )
    );
  };

  const addSpecification = () => {
    setSpecifications((current) => [...current, { name: "", value: "" }]);
  };

  const removeSpecification = (index: number) => {
    setSpecifications((current) => current.filter((_, itemIndex) => itemIndex !== index));
  };

  const updateTag = (index: number, value: string) => {
    setTags((current) => current.map((item, itemIndex) => (itemIndex === index ? value : item)));
  };

  const addTag = () => {
    setTags((current) => [...current, ""]);
  };

  const removeTag = (index: number) => {
    setTags((current) => current.filter((_, itemIndex) => itemIndex !== index));
  };

  const updateGallery = (
    index: number,
    field: keyof GalleryItem,
    value: string
  ) => {
    setGallery((current) =>
      current.map((item, itemIndex) =>
        itemIndex === index ? { ...item, [field]: value } : item
      )
    );
  };

  const addGalleryItem = () => {
    setGallery((current) => [
      ...current,
      { url: "", mime_type: "", file_name: "", alt_text: "" },
    ]);
  };

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const previewUrl = URL.createObjectURL(file);

    setGallery((current) =>
      current.map((item, itemIndex) =>
        itemIndex === index
          ? {
              ...item,
              url: previewUrl,
              mime_type: file.type || "",
              file_name: file.name || "",
              alt_text: item.alt_text || file.name.replace(/\.[^/.]+$/, ""),
            }
          : item
      )
    );
  };

  const removeGalleryItem = (index: number) => {
    setGallery((current) => current.filter((_, itemIndex) => itemIndex !== index));
  };

  const updateVariantAttribute = (
    index: number,
    field: keyof VariantAttribute,
    value: string
  ) => {
    setVariantAttributes((current) =>
      current.map((item, itemIndex) =>
        itemIndex === index ? { ...item, [field]: value } : item
      )
    );
  };

  const updateVariantValue = (
    attributeIndex: number,
    valueIndex: number,
    field: keyof VariantValue,
    value: string
  ) => {
    setVariantAttributes((current) =>
      current.map((attribute, attributeItemIndex) => {
        if (attributeItemIndex !== attributeIndex) return attribute;

        return {
          ...attribute,
          values: attribute.values.map((item, itemValueIndex) =>
            itemValueIndex === valueIndex ? { ...item, [field]: value } : item
          ),
        };
      })
    );
  };

  const addVariantAttribute = () => {
    setVariantAttributes((current) => [
      ...current,
      { name: "", unit: "", values: [{ label: "", value: "" }] },
    ]);
  };

  const removeVariantAttribute = (index: number) => {
    setVariantAttributes((current) => current.filter((_, itemIndex) => itemIndex !== index));
  };

  const addVariantValue = (attributeIndex: number) => {
    setVariantAttributes((current) =>
      current.map((attribute, itemIndex) =>
        itemIndex === attributeIndex
          ? { ...attribute, values: [...attribute.values, { label: "", value: "" }] }
          : attribute
      )
    );
  };

  const removeVariantValue = (attributeIndex: number, valueIndex: number) => {
    setVariantAttributes((current) =>
      current.map((attribute, itemIndex) => {
        if (itemIndex !== attributeIndex) return attribute;

        return {
          ...attribute,
          values: attribute.values.filter((_, itemValueIndex) => itemValueIndex !== valueIndex),
        };
      })
    );
  };

  async function onSubmit(data: ProductInputForm) {
    const payload = {
      ...data,
      categories: selectedCategories,
      specification: specifications.filter(
        (item) => item.name.trim() || item.value.trim()
      ),
      tags: tags.filter((tag) => tag.trim()),
      gallery: gallery.filter(
        (item) =>
          item.url.trim() ||
          item.mime_type.trim() ||
          item.file_name.trim() ||
          item.alt_text.trim()
      ),
      variant_attributes: enableVariants
        ? variantAttributes
            .filter((attribute) => attribute.name.trim())
            .map((attribute) => ({
              ...attribute,
              values: attribute.values.filter(
                (value) => value.label.trim() || value.value.trim()
              ),
            }))
        : [],
    };

    const res = await fetch("/api/products", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      toast.error("Failed to create product");
      return;
    }

    toast.success("Product created");

    reset();
    setSelectedCategories([]);
    setSpecifications([{ name: "", value: "" }]);
    setTags([""]);
    setGallery([{ url: "", mime_type: "", file_name: "", alt_text: "" }]);
    setVariantAttributes([{ name: "", unit: "", values: [{ label: "", value: "" }] }]);
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 text-slate-900 transition-colors dark:bg-slate-950 dark:text-slate-100 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl rounded-3xl border border-slate-200/80 bg-white/80 p-6 shadow-sm backdrop-blur-sm dark:border-slate-800 dark:bg-slate-900/80 sm:p-8">
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">
            Inventory
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight">Create product</h1>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
            Add a new product with the essential details.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-6 md:grid-cols-2">
          <div className="md:col-span-2">
            <label className="mb-2 block text-sm font-medium">Product Name</label>
            <input
              {...register("product_name")}
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200 dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-100 dark:focus:border-slate-500 dark:focus:ring-slate-800"
              placeholder="Enter product name"
            />
            {errors.product_name && <p className="mt-1 text-sm text-rose-500">{errors.product_name.message}</p>}
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">Brand</label>
            <select
              {...register("brand")}
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200 dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-100 dark:focus:border-slate-500 dark:focus:ring-slate-800"
            >
              <option value="">Select Brand</option>
              {brands.map((brand) => (
                <option key={brand._id} value={brand._id}>
                  {brand.brand_name}
                </option>
              ))}
            </select>
            {errors.brand && <p className="mt-1 text-sm text-rose-500">{errors.brand.message}</p>}
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">Categories</label>
            <p className="mb-3 text-sm text-slate-500 dark:text-slate-400">
              Choose one or more categories for this product.
            </p>

            {categories.length > 0 ? (
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                {categories.map((category) => {
                  const isSelected = selectedCategories.includes(category._id);

                  return (
                    <button
                      key={category._id}
                      type="button"
                      onClick={() => toggleCategory(category._id)}
                      className={`rounded-xl border px-3 py-2 text-left text-sm font-medium transition ${
                        isSelected
                          ? "border-slate-900 bg-slate-900 text-white dark:border-white dark:bg-white dark:text-slate-900"
                          : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-200 dark:hover:bg-slate-800"
                      }`}
                    >
                      {category.name}
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="rounded-xl border border-dashed border-slate-300 px-3 py-4 text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400">
                No categories available yet.
              </div>
            )}

            {errors.categories && <p className="mt-1 text-sm text-rose-500">{errors.categories.message}</p>}
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">Minimum Price</label>
            <input
              type="number"
              {...register("price_range.minimum_price", {
                valueAsNumber: true,
              })}
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200 dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-100 dark:focus:border-slate-500 dark:focus:ring-slate-800"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">Maximum Price</label>
            <input
              type="number"
              {...register("price_range.maximum_price", {
                valueAsNumber: true,
              })}
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200 dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-100 dark:focus:border-slate-500 dark:focus:ring-slate-800"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">Currency</label>
            <input
              {...register("price_range.currency")}
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200 dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-100 dark:focus:border-slate-500 dark:focus:ring-slate-800"
            />
          </div>

          <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-800/70 md:col-span-2">
            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <label className="inline-flex items-center gap-2 text-sm text-slate-700 dark:text-slate-200">
                <input type="checkbox" {...register("enable_variants")} />
                Enable Variants
              </label>
              <label className="inline-flex items-center gap-2 text-sm text-slate-700 dark:text-slate-200">
                <input type="checkbox" {...register("isFeatured")} />
                Featured
              </label>
              <label className="inline-flex items-center gap-2 text-sm text-slate-700 dark:text-slate-200">
                <input type="checkbox" {...register("isActive")} />
                Active
              </label>
            </div>
          </div>

          {enableVariants && (
            <div className="md:col-span-2 rounded-2xl border border-slate-200 p-4 dark:border-slate-800">
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-base font-semibold">Variant attributes</h3>
                <button
                  type="button"
                  onClick={addVariantAttribute}
                  className="rounded-full border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
                >
                  + Add attribute
                </button>
              </div>

              <div className="mt-4 space-y-4">
                {variantAttributes.map((attribute, attributeIndex) => (
                  <div key={attributeIndex} className="rounded-2xl border border-slate-200 p-4 dark:border-slate-700">
                    <div className="flex flex-col gap-3 sm:flex-row">
                      <input
                        value={attribute.name}
                        onChange={(event) =>
                          updateVariantAttribute(attributeIndex, "name", event.target.value)
                        }
                        placeholder="Attribute name"
                        className="flex-1 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200 dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-100"
                      />
                      <input
                        value={attribute.unit}
                        onChange={(event) =>
                          updateVariantAttribute(attributeIndex, "unit", event.target.value)
                        }
                        placeholder="Unit (optional)"
                        className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200 dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-100 sm:w-40"
                      />
                      {attributeIndex > 0 && (
                        <button
                          type="button"
                          onClick={() => removeVariantAttribute(attributeIndex)}
                          className="rounded-xl border border-rose-200 px-3 py-2.5 text-sm font-medium text-rose-600 transition hover:bg-rose-50 dark:border-rose-800 dark:text-rose-300 dark:hover:bg-rose-950/40"
                        >
                          Remove
                        </button>
                      )}
                    </div>

                    <div className="mt-3 space-y-2">
                      {attribute.values.map((value, valueIndex) => (
                        <div key={valueIndex} className="grid gap-3 sm:grid-cols-2">
                          <input
                            value={value.label}
                            onChange={(event) =>
                              updateVariantValue(attributeIndex, valueIndex, "label", event.target.value)
                            }
                            placeholder="Label"
                            className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200 dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-100"
                          />
                          <input
                            value={value.value}
                            onChange={(event) =>
                              updateVariantValue(attributeIndex, valueIndex, "value", event.target.value)
                            }
                            placeholder="Value"
                            className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200 dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-100"
                          />
                        </div>
                      ))}

                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => addVariantValue(attributeIndex)}
                          className="rounded-full border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
                        >
                          + Add value
                        </button>
                        {attribute.values.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeVariantValue(attributeIndex, attribute.values.length - 1)}
                            className="rounded-full border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
                          >
                            Remove last value
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="md:col-span-2 rounded-2xl border border-slate-200 p-4 dark:border-slate-800">
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-base font-semibold">Specifications</h3>
              <button
                type="button"
                onClick={addSpecification}
                className="rounded-full border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
              >
                + Add specification
              </button>
            </div>

            <div className="mt-4 space-y-3">
              {specifications.map((specification, index) => (
                <div key={index} className="grid gap-3 sm:grid-cols-[1fr_1fr_auto]">
                  <input
                    value={specification.name}
                    onChange={(event) => updateSpecification(index, "name", event.target.value)}
                    placeholder="Name"
                    className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200 dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-100"
                  />
                  <input
                    value={specification.value}
                    onChange={(event) => updateSpecification(index, "value", event.target.value)}
                    placeholder="Value"
                    className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200 dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-100"
                  />
                  {index > 0 && (
                    <button
                      type="button"
                      onClick={() => removeSpecification(index)}
                      className="rounded-xl border border-slate-200 px-3 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="md:col-span-2 rounded-2xl border border-slate-200 p-4 dark:border-slate-800">
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-base font-semibold">Tags</h3>
              <button
                type="button"
                onClick={addTag}
                className="rounded-full border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
              >
                + Add tag
              </button>
            </div>

            <div className="mt-4 space-y-3">
              {tags.map((tag, index) => (
                <div key={index} className="flex gap-3">
                  <input
                    value={tag}
                    onChange={(event) => updateTag(index, event.target.value)}
                    placeholder="Tag"
                    className="flex-1 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200 dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-100"
                  />
                  {index > 0 && (
                    <button
                      type="button"
                      onClick={() => removeTag(index)}
                      className="rounded-xl border border-slate-200 px-3 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="md:col-span-2 rounded-2xl border border-slate-200 p-4 dark:border-slate-800">
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-base font-semibold">Gallery</h3>
              <button
                type="button"
                onClick={addGalleryItem}
                className="rounded-full border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
              >
                + Add image
              </button>
            </div>

            <div className="mt-4 space-y-3">
              {gallery.map((item, index) => (
                <div key={index} className="grid gap-3 lg:grid-cols-2">
                  <div className="rounded-xl border border-dashed border-slate-300 p-3 dark:border-slate-700 lg:col-span-2">
                    <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">
                      Upload image
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(event) => handleImageUpload(event, index)}
                      className="block w-full text-sm text-slate-500 file:mr-4 file:rounded-full file:border-0 file:bg-slate-900 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-slate-700 dark:text-slate-400 dark:file:bg-white dark:file:text-slate-900 dark:hover:file:bg-slate-200"
                    />
                    {item.url ? (
                      <div className="mt-3 overflow-hidden rounded-xl border border-slate-200 dark:border-slate-700">
                        <img src={item.url} alt={item.alt_text || "Uploaded preview"} className="h-40 w-full object-cover" />
                      </div>
                    ) : null}
                  </div>

                  <input
                    value={item.alt_text}
                    onChange={(event) => updateGallery(index, "alt_text", event.target.value)}
                    placeholder="Alt text"
                    className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200 dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-100 lg:col-span-2"
                  />
                  {index > 0 && (
                    <button
                      type="button"
                      onClick={() => removeGalleryItem(index)}
                      className="rounded-xl border border-slate-200 px-3 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800 lg:col-span-2"
                    >
                      Remove image
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="md:col-span-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-70 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200"
            >
              {isSubmitting ? "Creating..." : "Create Product"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
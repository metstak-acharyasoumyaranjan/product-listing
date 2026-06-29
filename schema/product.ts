import { z } from "zod";

const LogoSchema = z.object({
  url: z.string().url("Invalid logo URL"),
  mime_type: z.string().min(1),
});

const ManufacturerSchema = z.object({
  manufacturer_name: z.string().trim().min(1),
  slug: z.string().trim().min(1),
  description: z.string().trim().optional(),
  logo: LogoSchema.optional(),
});

const BrandSchema = z.object({
  brand_name: z.string().trim().min(1),
  slug: z.string().trim().min(1),
  description: z.string().trim().optional(),
  manufacturer: ManufacturerSchema.optional(),
});

const CategorySchema = z.object({
  name: z.string().trim().min(1),
  slug: z.string().trim().optional(),
  isParent: z.boolean().optional(),
  description: z.string().trim().optional(),
});

const GallerySchema = z.object({
  url: z.string().url("Invalid image URL"),
  mime_type: z.string().min(1),
});

const SpecificationSchema = z.object({
  name: z.string().trim().min(1),
  value: z.string().trim().min(1),
});

const VariantValueSchema = z.object({
  label: z.string().trim().min(1),
  value: z.string().trim().min(1),
});

const VariantAttributeSchema = z.object({
  name: z.string().trim().min(1),
  unit: z.string().trim().min(1),
  values: VariantValueSchema,
});

export const ProductSchema = z
  .object({
    product_name: z.string().trim().min(1),

    brand: BrandSchema.optional(),

    categories: z
      .array(CategorySchema)
      .min(1, "At least one category is required"),

    price_range: z.string().trim().optional(),

    enable_varriants: z.boolean().default(false),

    gallery: z.array(GallerySchema).default([]),

    specification: z.array(SpecificationSchema).default([]),

    tags: z.array(z.string().trim()).default([]),

    isActive: z.boolean().default(true),

    isFeatured: z.boolean().default(false),

    varriant_attribute: z.array(VariantAttributeSchema).optional(),
  })
  .superRefine((data, ctx) => {
    if (
      data.enable_varriants &&
      (!data.varriant_attribute ||
        data.varriant_attribute.length === 0)
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["varriant_attribute"],
        message:
          "Variant attributes are required when variants are enabled.",
      });
    }
  });

export type ProductInput = z.infer<typeof ProductSchema>;
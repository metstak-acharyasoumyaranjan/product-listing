import { z } from "zod";
// validators/common.ts

export const ObjectIdValidationSchema = z.string().regex(
  /^[0-9a-fA-F]{24}$/,
  "Invalid MongoDB ObjectId"
);


export const MediaValidationSchema = z.object({
  url: z.url("Invalid URL"),
  mime_type: z.string().min(1),
  file_name: z.string().optional(),
  alt_text: z.string().optional(),
});


export const CategoryValidationSchema = z.object({
    name : z.string().trim().min(1 , "Category name is Required"),
    description : z.string().optional(),
    parentCategory : z.string().optional().nullable(),
    logo: MediaValidationSchema.optional(),
    isActive : z.boolean().default(true),
});

export const ManufacturerValidationSchema = z.object({
  manufacturer_name: z.string().trim().min(1, "Manufacturer name is required"),
  description: z.string().optional(),
  logo: MediaValidationSchema.optional(),
  isActive: z.boolean().default(true),
});
export const BrandValidationSchema = z.object({
  brand_name: z.string().trim().min(1, "Brand name is required"),
  description: z.string().optional(),
  logo: MediaValidationSchema.optional(),
  manufacturer: ObjectIdValidationSchema,
  isActive: z.boolean().default(true),
});

export const ProductValidationSchema = z.object({
  product_name: z
    .string()
    .trim()
    .min(1, "Product name is required"),

  brand: ObjectIdValidationSchema,

  categories: z
    .array(ObjectIdValidationSchema)
    .min(1, "Select at least one category"),

  price_range: z.object({
    minimum_price: z
      .number()
      .min(0, "Minimum price cannot be negative"),

    maximum_price: z
      .number()
      .min(0, "Maximum price cannot be negative"),

    currency: z.string().default("INR"),
  }),

  enable_variants: z.boolean().default(false),

  gallery: z
    .array(MediaValidationSchema)
    .default([]),

  specification: z
    .array(
      z.object({
        name: z
          .string()
          .trim()
          .min(1, "Specification name is required"),

        value: z
          .string()
          .trim()
          .min(1, "Specification value is required"),
      })
    )
    .default([]),

  tags: z
    .array(z.string().trim())
    .default([]),

  isActive: z.boolean().default(true),

  isFeatured: z.boolean().default(false),
})
.superRefine((data, ctx) => {
  if (
    data.price_range.maximum_price <
    data.price_range.minimum_price
  ) {
    ctx.addIssue({
      code: "custom",
      path: ["price_range", "maximum_price"],
      message: "Maximum price must be greater than or equal to minimum price",
    });
  }
});


export type CategoryInput = z.infer<typeof CategoryValidationSchema>;
export type CategoryInputForm = z.input<typeof CategoryValidationSchema>;
export type ManufacturerInput = z.infer<typeof ManufacturerValidationSchema>;
export type ManufacturerInputForm = z.input<typeof ManufacturerValidationSchema>;
export type BrandInput = z.infer<typeof BrandValidationSchema>;
export type BrandInputForm = z.input<typeof BrandValidationSchema>;
export type ProductInputForm = z.input<typeof ProductValidationSchema>;
export type ProductInput = z.output<typeof ProductValidationSchema>;


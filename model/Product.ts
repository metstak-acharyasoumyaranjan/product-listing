import mongoose, { Schema } from "mongoose";
import { generateSlug } from "@/lib/slugify";

const ProductSchema = new Schema(
  {
    product_name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    slug: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
    },

    brand: {
      type: Schema.Types.ObjectId,
      ref: "Brand",
      required: true,
    },

    categories: [
      {
        type: Schema.Types.ObjectId,
        ref: "Category",
        required: true,
      },
    ],

    price_range: {
      minimum_price: {
        type: Number,
        required: true,
        min: 0,
      },

      maximum_price: {
        type: Number,
        required: true,
        min: 0,
      },

      currency: {
        type: String,
        default: "INR",
      },
    },

    enable_variants: {
      type: Boolean,
      default: false,
    },

    variant_attributes: [
      {
        name: {
          type: String,
          required: true,
          trim: true,
        },

        unit: {
          type: String,
          default: "",
          trim: true,
        },

        values: [
          {
            label: {
              type: String,
              required: true,
              trim: true,
            },

            value: {
              type: String,
              required: true,
              trim: true,
            },
          },
        ],
      },
    ],

    gallery: [
      {
        url: {
          type : String,
        }
      }
    ],

    specification: [
      {
        name: {
          type: String,
          required: true,
          trim: true,
        },

        value: {
          type: String,
          required: true,
          trim: true,
        },
      },
    ],

    tags: [
      {
        type: String,
        trim: true,
      },
    ],

    isActive: {
      type: Boolean,
      default: true,
    },

    isFeatured: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

ProductSchema.pre("validate", async function () {
  if (this.isModified("product_name")) {
    this.set("slug", generateSlug(this.get("product_name")));
  }
});

ProductSchema.pre("validate", async function () {
  if (
    this.enable_variants &&
    (!this.variant_attributes || this.variant_attributes.length === 0)
  ) {
    throw new Error(
      "Variant attributes are required when variants are enabled."
    );
  }
});

export const Product =
  mongoose.models.Product ||
  mongoose.model("Product", ProductSchema);
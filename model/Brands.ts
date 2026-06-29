import mongoose, { Schema } from "mongoose";
import { MediaSchema } from "./Media";
import { generateSlug } from "@/lib/slugify";

const BrandSchema = new Schema(
  {
    brand_name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    slug: {
      type: String,
      lowercase: true,
      trim: true,
    },
    logo: {
      type: MediaSchema
    },
    description: {
      type: String,
      default: "",
      trim: true,
    },
    manufacturer: {
      type: Schema.Types.ObjectId,
      ref: "Manufacturer",
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

BrandSchema.pre("validate", async function () {
  if (this.isModified("name")) {
    this.set("slug", generateSlug(this.get("name")));
  }
});

export const Brand =
  mongoose.models.Brand ||
  mongoose.model("Brand", BrandSchema);
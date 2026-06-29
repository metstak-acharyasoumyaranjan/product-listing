import mongoose, { Schema } from "mongoose";
import { MediaSchema } from "./Media";
import { generateSlug } from "@/lib/slugify";

const CategorySchema = new Schema(
  {
    name: {
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

    description: {
      type: String,
      default: "",
      trim: true,
    },

    logo: {
      type: MediaSchema,
    },

    parentCategory: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      default: null,
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
CategorySchema.pre("validate", async function () {
  if (this.isModified("name")) {
    this.set("slug", generateSlug(this.get("name")));
  }
});

export const Category =
  mongoose.models.Category ||
  mongoose.model("Category", CategorySchema);
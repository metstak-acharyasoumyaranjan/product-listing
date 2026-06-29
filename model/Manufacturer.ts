import mongoose, { Schema } from "mongoose";
import { MediaSchema } from "./Media";
import { generateSlug } from "@/lib/slugify";


const ManufacturerSchema = new Schema(
  {
    manufacturer_name: {
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

    description: {
      type: String,
      default: "",
      trim: true,
    },

    logo: {
        type: MediaSchema
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

ManufacturerSchema.pre("validate", async function () {
  if (this.isModified("name")) {
    this.set("slug", generateSlug(this.get("name")));
  }
});

export const Manufacturer =
  mongoose.models.Manufacturer ||
  mongoose.model("Manufacturer", ManufacturerSchema);
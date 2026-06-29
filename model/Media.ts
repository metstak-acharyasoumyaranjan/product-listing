import { Schema } from "mongoose";

export const MediaSchema = new Schema(
  {
    url: {
      type: String,
      required: true,
      trim: true,
    },

    mime_type: {
      type: String,
      required: true,
      trim: true,
    },
    file_name :{
        type : String,
        trim : true,
    },

    alt_text: {
      type: String,
      default: "",
      trim: true,
    },
  },
  {
    _id: false,
  }
);
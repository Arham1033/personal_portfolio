import mongoose from "mongoose";

const ContactSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    youtube: {
      type: String,
      required: true,
    },
    instagram: {
      type: String,
      required: true,
    },
    tiktok: {
      type: String,
      required: true,
    },
    note: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Contact ||
mongoose.model("Contact", ContactSchema);
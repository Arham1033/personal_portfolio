import mongoose from "mongoose";

const ProjectSchema = new mongoose.Schema(
  {
    title: String,
    link: String,
    description: String,
    image: String, // store image URL or path
  },
  { timestamps: true }
);

export default mongoose.models.Project ||
  mongoose.model("Project", ProjectSchema);
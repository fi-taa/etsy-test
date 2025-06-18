import mongoose from "mongoose";

const listingSchema = new mongoose.Schema({
  listingId: { type: String, unique: true },
  customerId: { type: String, required: true },
  title: String,
  description: String,
  tags: [String],
  image: String,
}, { timestamps: true });

export default mongoose.models.Listing || mongoose.model("Listing", listingSchema);

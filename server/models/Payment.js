import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  razorpayOrderId: String,
  razorpayPaymentId: String,
  status: {
    type: String,
    enum: ["SUCCESS", "FAILED"],
  },
});

export default mongoose.model("Payment", paymentSchema);

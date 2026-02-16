import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    plan: {
      type: String,
      enum: ["FREE", "BRONZE", "SILVER", "GOLD"],
      required: true,
    },

    amount: {
      type: Number,
      required: true,
    },

    paymentGateway: {
      type: String,
      enum: ["RAZORPAY", "FAKE"],
      default: "FAKE",
    },

    gatewayOrderId: String,
    gatewayPaymentId: String,

    transactionId: {
      type: String,
    },

    status: {
      type: String,
      enum: ["PENDING", "SUCCESS", "FAILED"],
      default: "PENDING",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Payment", paymentSchema);

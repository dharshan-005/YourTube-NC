// import Razorpay from "razorpay";
import Auth from "../models/Auth.js";
import Payment from "../models/Payment.js";
import { generateInvoice } from "../utils/invoice.js";
import { sendInvoiceEmail } from "../utils/email.js";

// const razorpay = new Razorpay({
//   key_id: process.env.RAZORPAY_KEY_ID,
//   key_secret: process.env.RAZORPAY_SECRET,
// });

// export const createOrder = async (req, res) => {
//   const order = await razorpay.orders.create({
//     amount: 19900,
//     currency: "INR",
//     receipt: "premium_plan",
//   });

//   res.json(order);
// };

// export const verifyPayment = async (req, res) => {
//   const user = await Auth.findById(req.user.id);

//   user.isPremium = true;
//   await user.save();

//   await Payment.create({
//     userId: user._id,
//     razorpayOrderId: req.body.razorpay_order_id,
//     razorpayPaymentId: req.body.razorpay_payment_id,
//     status: "SUCCESS",
//   });

//   res.json({ message: "Premium activated" });
// };

export const mockPremiumPayment = async (req, res) => {
  try {
    const { plan } = req.body;

    if (!["BRONZE", "SILVER", "GOLD"].includes(plan)) {
      return res.status(400).json({ message: "Invalid plan" });
    }

    const user = await Auth.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // ✅ Plan price mapping
    const planPrices = {
      BRONZE: 10,
      SILVER: 50,
      GOLD: 100,
    };

    const amount = planPrices[plan];

    // ✅ Update subscription
    user.subscription = {
      plan,
      validTill: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    };

    await user.save();

    // ✅ Create payment record
    const transactionId = "MOCK_" + Date.now();

    await Payment.create({
      userId: user._id,
      razorpayOrderId: transactionId,
      razorpayPaymentId: transactionId,
      status: "SUCCESS",
      plan,
      amount,
    });

    // ✅ Generate invoice
    const invoicePath = await generateInvoice(
      user._id,
      plan,
      amount,
      transactionId,
    );

    // ✅ Send email
    await sendInvoiceEmail(user._id, invoicePath, plan);

    res.json({ message: `${plan} activated successfully` });
  } catch (error) {
    console.error("Mock payment error:", error);
    res.status(500).json({ message: error.message });
  }
};

// import Razorpay from "razorpay";
import Auth from "../models/Auth.js";
import Payment from "../models/Payment.js";

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
  const user = await Auth.findById(req.user.id);

  user.isPremium = true;
  await user.save();

  await Payment.create({
    userId: user._id,
    razorpayOrderId: "MOCK_ORDER",
    razorpayPaymentId: "MOCK_PAYMENT",
    status: "SUCCESS",
  });

  res.json({ message: "Premium activated (mock)" });
};
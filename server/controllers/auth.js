// import mongoose from "mongoose";
// import users from "../Modals/Auth.js";
// import axios from "axios";
// import nodemailer from "nodemailer";
// import twilio from "twilio";

// const otpStore = {};
// const southernStates = [
//   "Tamil Nadu",
//   "Kerala",
//   "Telangana",
//   "Andhra Pradesh",
//   "Karnataka",
// ];

// const transporter = nodemailer.createTransport({
//   host: process.env.EMAIL_HOST,
//   port: Number(process.env.EMAIL_PORT) || 587,
//   secure: false,
//   // service: 'Gmail',
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASSWORD,
//   },
// });

// const twilioClient = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);

// function generateOTP() {
//   return Math.floor(100000 + Math.random() * 900000).toString();
// }

// async function sendEmail(email, otp) {
//   const mailOptions = {
//     from: `"YourAppName OTP" <${process.env.EMAIL_USER}>`,
//     to: email,
//     subject: "Your OTP Code",
//     text: `Your OTP code is ${otp}`,
//   };
//   await transporter.sendMail(mailOptions);
//   console.log(`Email OTP sent to ${email}`);
// }

// async function sendSMS(mobile, otp) {
//   await twilioClient.messages.create({
//     body: `Your OTP code is ${otp}`,
//     from: process.env.TWILIO_PHONE_NUMBER,
//     to: mobile,
//   });
//   console.log(`SMS OTP sent to ${mobile}`);
// }

// export const login = async (req, res) => {
//   const { email, name, image, mobile } = req.body;

//   try {
//     const ip = req.headers["x-forwarded-for"]?.split(",")[0] || req.connection.remoteAddress;
//     if (ip === "::1" || ip === "127.0.0.1") {
//       ip = "8.8.8.8";
//     }
//     let state = "Unknown";
//     try {
//       const response = await axios.get(`https://api.ipgeolocation.io/ipgeo`, { 
//         params: { apiKey: "33647603305f424783d132741e457a5c", ip: ip } 
//       });
//       state = response.data.region || "Unknown";
//     } catch (error) {
//       console.error("IP Geolocation error:", error);
//     }

//     let user = await users.findOne({ email });
//     let isNew = false;
//     console.log("User found:", user);
//     if (!user) {
//       user = await users.create({ email, name, image });
//       isNew = true;
//       console.log("New user created:", user);
//     }

//     const otp = generateOTP();
//     otpStore[email] = { otp, expires: Date.now() + 5 * 60 * 1000 };

//     let otpMethod = "email";
//     if (southernStates.includes(state)) {
//       await sendEmail(email, otp);
//       otpMethod = "email";
//     } else {
//       if (!mobile) {
//         return res.status(400).json({ message: "Mobile number required for SMS OTP" });
//       }
//       await sendSMS(mobile, otp);
//       otpMethod = "sms";
//     }

//     return res.status(isNew ? 201 : 200).json({
//       result: user,
//       locationState: state,
//       otpSent: true,
//       otpMethod,
//     });

//   } catch (error) {
//     console.error("Login error:", error);
//     return res.status(500).json({ message: "Something went wrong" });
//   }
// };

// export const verifyOtp = async (req, res) => {
//   const { email, otp } = req.body;
//   const record = otpStore[email];
//   if (!record) {
//     return res.status(400).json({ message: "OTP not found. Please request a new one." });
//   }

//   if (Date.now() > record.expires) {
//     return res.status(400).json({ message: "OTP expired. Please request a new one." });
//   }
  
//   if (record.otp !== otp) {
//     return res.status(400).json({ message: "Invalid OTP. Please try again." });
//   }
//   delete otpStore[email];
//   return res.status(200).json({ message: "OTP verified successfully." });
// };

// export const updateprofile = async (req, res) => {
//   const { id: _id } = req.params;
//   const { channelname, description } = req.body;
//   if (!mongoose.Types.ObjectId.isValid(_id)) {
//     return res.status(500).json({ message: "User unavailable..." });
//   }
//   try {
//     const updatedata = await users.findByIdAndUpdate(
//       _id,
//       {
//         $set: {
//           channelname: channelname,
//           description: description,
//         },
//       },
//       { new: true }
//     );
//     return res.status(201).json(updatedata);
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({ message: "Something went wrong" });
//   }
// };

import mongoose from "mongoose";
import users from "../Modals/Auth.js";

export const login = async (req, res) => {
  const { email, name, image } = req.body;

  try {
    const existingUser = await users.findOne({ email });

    if (!existingUser) {
      const newUser = await users.create({ email, name, image });
      return res.status(201).json({ result: newUser });
    } else {
      return res.status(200).json({ result: existingUser });
    }
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};
export const updateprofile = async (req, res) => {
  const { id: _id } = req.params;
  const { channelname, description } = req.body;
  if (!mongoose.Types.ObjectId.isValid(_id)) {
    return res.status(500).json({ message: "User unavailable..." });
  }
  try {
    const updatedata = await users.findByIdAndUpdate(
      _id,
      {
        $set: {
          channelname: channelname,
          description: description,
        },
      },
      { new: true }
    );
    return res.status(201).json(updatedata);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};
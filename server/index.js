import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import userroutes from "./routes/auth.js";
import channelRoutes from "./routes/channel.js";
import videoroutes from "./routes/video.js";
import likeroutes from "./routes/like.js";
import watchlaterroutes from "./routes/watchlater.js";
import historyrroutes from "./routes/history.js";
import commentroutes from "./routes/comment.js";
dotenv.config();

import downloadRoutes from "./routes/download.js"
import paymentRoutes from "./routes/payment.js"

const app = express();

import path from "path";

// app.set("trust proxy", true);

// const allowedOrigins = [
//   "http://localhost:3000",
//   "https://your-tube-nc.vercel.app",
// ];

// app.use(
//   cors({
//     origin: function (origin, callback) {
//       // allow server-to-server / Postman / curl
//       if (!origin) return callback(null, true);

//       if (allowedOrigins.includes(origin)) {
//         return callback(null, true);
//       }

//       callback(new Error("Not allowed by CORS"));
//     },
//     credentials: true,
//     methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
//     allowedHeaders: ["Content-Type", "Authorization"],
//   }),
// );

app.set("trust proxy", true);

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", req.headers.origin);
  res.header("Access-Control-Allow-Credentials", "true");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.header(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE, OPTIONS"
  );

  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }

  next();
});


app.use(express.json({ limit: "30mb", extended: true }));
app.use(express.urlencoded({ limit: "30mb", extended: true }));

app.use("/uploads", express.static(path.join("uploads")));

app.get("/", (req, res) => {
  res.send("You tube backend is working");
});

app.use(bodyParser.json());

app.use("/user", userroutes);
app.use("/channel", channelRoutes);
app.use("/video", videoroutes);
app.use("/like", likeroutes);
app.use("/watch", watchlaterroutes);
app.use("/history", historyrroutes);
app.use("/comment", commentroutes);

app.use("/api/download", downloadRoutes);
app.use("/api/payment", paymentRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`);
});


const DBURL = process.env.MONGO_URI;
mongoose
  .connect(DBURL)
  .then(() => {
    console.log("Mongodb connected");
  })
  .catch((error) => {
    console.log(error);
  });

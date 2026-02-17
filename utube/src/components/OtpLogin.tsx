// import React, { FormEvent, useEffect, useState, useTransition } from "react";
// import {
//   InputOTP,
//   InputOTPGroup,
//   InputOTPSeparator,
//   InputOTPSlot,
// } from "./ui/input-otp";
// import { Input } from "./ui/input";
// import { Button } from "./ui/button";
// import { useRouter } from "next/router";
// import {
//   ConfirmationResult,
//   RecaptchaVerifier,
//   sendSignInLinkToEmail,
//   signInWithPhoneNumber,
// } from "firebase/auth";
// import { auth } from "@/lib/firebase";

import React, { useState } from "react";
import axiosInstance from "@/lib/axiosinstance";
import { useRouter } from "next/router";
import { useUser } from "@/lib/AuthContext";

const OtpLogin = () => {
  const router = useRouter();
  const { login } = useUser();

  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");

  const [step, setStep] = useState<"login" | "verify">("login");

  const [theme, setTheme] = useState("");
  const [locationState, setLocationState] = useState("");

  const [error, setError] = useState("");

  /* =============================
     STEP 1 → CALL /login
  ============================= */

  const handleLogin = async () => {
    try {
      const res = await axiosInstance.post("/user/login", {
        email,
        name: "Test User",
        image: "https://github.com/shadcn.png",
        phone,
      });

      localStorage.setItem(
        "tempLoginData",
        JSON.stringify({
          email,
          phone,
          locationState: res.data.locationState,
          theme: res.data.theme,
        }),
      );

      setTheme(res.data.theme);
      setLocationState(res.data.locationState);

      // Apply theme immediately
      if (res.data.theme === "light") {
        document.documentElement.classList.remove("dark");
      } else {
        document.documentElement.classList.add("dark");
      }

      setStep("verify");
    } catch (err: any) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  /* =============================
     STEP 2 → CALL /verify-otp
  ============================= */

  const handleVerify = async () => {
    try {
      const res = await axiosInstance.post("/user/verify-otp", {
        email,
        phone,
        otp,
      });

      const { token, result } = res.data;

      // Save token in localStorage
      localStorage.setItem("token", token);

      // Update axios default header
      axiosInstance.defaults.headers.common["Authorization"] =
        `Bearer ${token}`;

      // Update user context
      login(result, locationState, theme);

      router.push("/");
    } catch (err: any) {
      setError(err.response?.data?.message || "Verification failed");
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      {step === "login" && (
        <>
          <input
            type="email"
            placeholder="Enter Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border p-2"
          />

          <input
            type="text"
            placeholder="Enter Phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="border p-2"
          />

          <button
            onClick={handleLogin}
            className="bg-blue-500 text-white px-4 py-2"
          >
            Send OTP
          </button>
        </>
      )}

      {step === "verify" && (
        <>
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="border p-2"
          />

          <button
            onClick={handleVerify}
            className="bg-green-500 text-white px-4 py-2"
          >
            Verify OTP
          </button>
        </>
      )}

      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
};

export default OtpLogin;

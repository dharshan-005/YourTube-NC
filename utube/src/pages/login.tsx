import { useUser } from "@/lib/AuthContext";
import OtpLogin from "@/components/OtpLogin";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function LoginPage() {
  const { handlegooglesignin, user } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.push("/");
    }
  }, [user]);

  return (
    <div className="flex flex-col items-center gap-6 mt-10">
      <h1 className="text-2xl font-bold">Sign In</h1>

      {/* OTP Login */}
      <OtpLogin />

      <div className="flex items-center gap-2 mt-6">
        <div className="h-px w-20 bg-gray-400"></div>
        <span>OR</span>
        <div className="h-px w-20 bg-gray-400"></div>
      </div>

      {/* Google Login */}
      <button
        onClick={handlegooglesignin}
        className="bg-red-500 text-white px-4 py-2 rounded"
      >
        Sign in with Google
      </button>
    </div>
  );
}

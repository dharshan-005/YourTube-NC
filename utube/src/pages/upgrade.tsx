"use client";

import { useEffect, useState } from "react";

const plans = [
  {
    name: "FREE",
    price: 0,
    limit: "5 Minutes",
  },
  {
    name: "BRONZE",
    price: 10,
    limit: "7 Minutes",
  },
  {
    name: "SILVER",
    price: 50,
    limit: "10 Minutes",
  },
  {
    name: "GOLD",
    price: 100,
    limit: "Unlimited",
  },
];

export default function UpgradePage() {
  const [loading, setLoading] = useState<string | null>(null);
  const [currentPlan, setCurrentPlan] = useState("FREE");

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setCurrentPlan(parsedUser?.subscription?.plan || "FREE");
    }
  }, []);

  const handleUpgrade = async (plan: string) => {
    try {
      if (plan === "FREE") return;

      if (plan === currentPlan) {
        alert("You are already on this plan.");
        return;
      }

      setLoading(plan);

      const storedUser = localStorage.getItem("user");
      if (!storedUser) {
        alert("Please login first.");
        return;
      }

      const parsedUser = JSON.parse(storedUser);
      const token = parsedUser.token;

      const res = await fetch("http://localhost:5000/payment/mock-success", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ plan }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Upgrade failed");
        return;
      }

      alert(data.message);

      // Update local storage with new plan
      parsedUser.subscription.plan = plan;
      localStorage.setItem("user", JSON.stringify(parsedUser));

      setCurrentPlan(plan);
    } catch (err) {
      console.error("Upgrade error:", err);
      alert("Something went wrong. Try again.");
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center py-16 px-4">
      <h1 className="text-4xl font-bold mb-10">Upgrade Your Plan</h1>

      <div className="grid md:grid-cols-4 gap-6 w-full max-w-6xl">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className="bg-zinc-900 rounded-2xl p-6 flex flex-col justify-between border border-zinc-800 hover:border-yellow-500 transition"
          >
            <div>
              <h2 className="text-2xl font-semibold mb-4">{plan.name}</h2>

              <p className="text-3xl font-bold mb-2">₹{plan.price}</p>

              <p className="text-gray-400 mb-6">Watch Limit: {plan.limit}</p>
            </div>

            <button
              disabled={
                plan.name === "FREE" ||
                plan.name === currentPlan ||
                loading === plan.name
              }
              onClick={() => handleUpgrade(plan.name)}
              className={`py-2 rounded-lg font-semibold transition
    ${
      plan.name === currentPlan
        ? "bg-green-600 text-white cursor-not-allowed"
        : plan.name === "FREE"
          ? "bg-gray-600 text-white cursor-not-allowed"
          : "bg-yellow-500 hover:bg-yellow-600 text-black"
    }
    disabled:opacity-60
  `}
            >
              {plan.name === currentPlan
                ? "Current Plan"
                : loading === plan.name
                  ? "Processing..."
                  : "Upgrade"}
            </button>

            {/* {plan.name === "FREE" ? (
              <button
                disabled
                className="bg-gray-600 text-white py-2 rounded-lg cursor-not-allowed"
              >
                Current Plan
              </button>
            ) : (
              <button
                disabled={loading === plan.name}
                onClick={() => handleUpgrade(plan.name)}
                className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold py-2 rounded-lg transition disabled:opacity-50"
              >
                {loading === plan.name ? "Processing..." : "Upgrade"}
              </button>
            )} */}
          </div>
        ))}
      </div>
    </div>
  );
}

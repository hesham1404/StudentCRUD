"use client";

import { useState } from "react";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || "Registration failed");
        return;
      }

      alert("Account created successfully!");

      // Go to login page
      window.location.href = "/login";
    } catch (error) {
      console.error(error);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 flex items-center justify-center px-6 relative overflow-hidden">

      {/* Background Glow */}
      <div className="absolute top-[-150px] left-[-150px] w-[400px] h-[400px] bg-blue-600/20 rounded-full blur-[120px]" />

      <div className="absolute bottom-[-150px] right-[-150px] w-[400px] h-[400px] bg-purple-600/20 rounded-full blur-[120px]" />

      {/* Register Card */}
      <div className="relative w-full max-w-md">

        <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 shadow-2xl">

          {/* Logo */}
          <div className="flex justify-center mb-6">
            <div className="w-14 h-14 rounded-2xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-600/30">
              <span className="text-2xl font-bold text-white">
                S
              </span>
            </div>
          </div>

          {/* Heading */}
          <div className="text-center mb-8">

            <h1 className="text-3xl font-bold text-white">
              Create Account
            </h1>

            <p className="text-slate-400 mt-2 text-sm">
              Create your Student Management account
            </p>

          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Full Name
              </label>

              <input
                type="text"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3.5 text-white placeholder-slate-500 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Email Address
              </label>

              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3.5 text-white placeholder-slate-500 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Password
              </label>

              <input
                type="password"
                placeholder="Create a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3.5 text-white placeholder-slate-500 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            {/* Register Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 disabled:cursor-not-allowed text-white font-semibold py-3.5 rounded-xl transition duration-200 shadow-lg shadow-blue-600/20"
            >
              {loading ? "Creating Account..." : "Create Account"}
            </button>

          </form>

          {/* Login Link */}
          <div className="text-center mt-7">

            <p className="text-sm text-slate-400">
              Already have an account?{" "}

              <a
                href="/login"
                className="text-blue-400 hover:text-blue-300 font-medium transition"
              >
                Sign In
              </a>
            </p>

          </div>

        </div>

        {/* Footer */}
        <p className="text-center text-slate-600 text-xs mt-6">
          Student Management System
        </p>

      </div>

    </main>
  );
}
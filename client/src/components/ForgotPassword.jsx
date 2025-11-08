import React, { useState } from "react";
import { Link } from "react-router-dom";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const baseUrl =
    import.meta.env.MODE === "development" ? "http://localhost:5003" : "";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      const response = await fetch(`${baseUrl}/user/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Error sending email");

      setMessage(
        "An email has been sent with instructions to reset your password."
      );
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-primary">
      <div className="bg-[rgba(17,16,16,0.79)] p-8 rounded max-w-md w-full text-center">
        <h1 className="text-3xl text-white font-bold mb-4">Forgot Password</h1>
        <p className="text-white mb-6">
          Enter your email to receive a password reset link.
        </p>

        {message && <p className="text-green-500 mb-4">{message}</p>}
        {error && <p className="text-red-500 mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="Email"
            className="p-2 border border-white bg-transparent text-white placeholder-white rounded"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button className="bg-teal-600 text-white py-2 rounded hover:bg-teal-700 font-bold">
            Send Reset Link
          </button>
        </form>

        <p className="mt-4 text-white">
          <Link to="/login" className="text-blue-500 hover:underline">
            Back to Login
          </Link>
        </p>
      </div>
    </div>
  );
}

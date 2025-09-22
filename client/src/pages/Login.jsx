import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { UserContext } from "../context/UserContext.jsx";
import { FiEye, FiEyeOff } from "react-icons/fi"; // install react-icons if not installed

export default function Login() {
  const { login } = useContext(UserContext);
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || "/profile";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [showPassword, setShowPassword] = useState(false); // state for password toggle

  const baseUrl =
    import.meta.env.MODE === "development" ? "http://localhost:5003" : "";

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate(from);
    } else {
      setCheckingAuth(false);
    }
  }, []);

  if (checkingAuth) {
    return (
      <div className="flex items-center justify-center h-screen text-white">
        <p>Loading...</p>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${baseUrl}/user/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      const token = data.token;

      if (!response.ok) {
        throw new Error(data.message || "Invalid email or password.");
      }
      if (!token) {
        throw new Error("No token received.");
      }

      localStorage.setItem("token", token);
      login(token, data);
      alert("Login successful!");
      navigate(from);
    } catch (err) {
      console.error("Login error:", err);
      setError(err.message);
    }
  };

  return (
    <div className="relative w-full h-screen bg-primary">
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/3 p-8 max-w-xl w-full text-center bg-[rgba(17,16,16,0.79)] ">
        <h1 className="text-4xl font-extrabold mb-4 text-white">
          LOGIN ACCOUNT
        </h1>
        <p className="mb-6 text-white">Welcome to our website.</p>

        {error && <p className="text-red-500">{error}</p>}

        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            placeholder="Email *"
            className="border border-white p-2 bg-transparent text-white placeholder-white"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password *"
              className="border border-white p-2 bg-transparent text-white placeholder-white w-full pr-10"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <span
              className="absolute right-2 top-2 text-white cursor-pointer"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
            </span>
          </div>

          <button
            type="submit"
            className="text-white py-2 border border-white hover:bg-teal-600 hover:text-white transition-colors font-bold"
          >
            LOGIN
          </button>

          <p className="p-2 text-white">
            <Link to="/forgot-password" className="text-sm text-blue-600">
              Forgot Password?
            </Link>
          </p>
          <p className="p-2 text-white">
            Don't have an account?{" "}
            <Link to="/register">
              <span className="text-blue-500 cursor-pointer">Register Now</span>
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

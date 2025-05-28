import { useState } from "react";
import axios from "../utils/axiosInstance";
import LeftPanel from '../components/SignUp/Login Page/leftPanelTW.jsx';

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("/auth/forgot-password", { email });
      setMessage(res.data.message);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
      setMessage(null);
    }
  };

  return (
    <div className="flex min-h-screen">
      <LeftPanel />
      
      <div className="flex items-center justify-center min-h-screen px-20 bg-gray-50">
        <div className="w-full max-w-md p-6 space-y-4 bg-white shadow-md rounded-xl">
          <h2 className="text-2xl font-semibold text-center text-gray-800">Reset Your Password</h2>

          {message && <div className="text-sm text-green-600">{message}</div>}
          {error && <div className="text-sm text-red-600">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <button
              type="submit"
              className="w-full py-2 text-white transition bg-green-600 rounded-md hover:bg-green-700"
            >
              Send Reset Link
            </button>
          </form>
          <p className="text-sm text-center text-gray-500">
            Remembered your password?{" "}
            <a href="/login" className="text-green-600 hover:underline">Login</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;

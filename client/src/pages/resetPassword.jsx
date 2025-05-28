import { useParams } from "react-router-dom";
import { useState } from "react";
import axios from "../utils/axiosInstance";

const ResetPassword = () => {
  const { token } = useParams();
  const [newPassword, setNewPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPassword !== confirm) {
      setError("Passwords do not match.");
      return;
    }

    try {
      const res = await axios.post(`/auth/reset-password/${token}`, {
        newPassword,
      });
      setMessage(res.data.message);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || "Reset failed");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-4 bg-gray-50">
      <div className="w-full max-w-md p-6 space-y-4 bg-white shadow-md rounded-xl">
        <h2 className="text-2xl font-semibold text-center text-gray-800">Set New Password</h2>

        {message && <div className="text-sm text-green-600">{message}</div>}
        {error && <div className="text-sm text-red-600">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="password"
            required
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <input
            type="password"
            required
            placeholder="Confirm Password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <button
            type="submit"
            className="w-full py-2 text-white transition bg-green-600 rounded-md hover:bg-green-700"
          >
            Reset Password
          </button>
        </form>
        <p className="text-sm text-center text-gray-500">
          Back to{" "}
          <a href="/login" className="text-green-600 hover:underline">Login</a>
        </p>
      </div>
    </div>
  );
};

export default ResetPassword;

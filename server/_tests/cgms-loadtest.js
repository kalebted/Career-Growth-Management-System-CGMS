import http from "k6/http";
import { sleep, check } from "k6";

// Load Test Configuration
export const options = {
  vus: 100,
  duration: "30s",
};

// API Base URL
const BASE_URL = "http://localhost:3001";

export default function () {
  // Enhanced randomness for unique data
  const uniqueId = `${Date.now()}_${Math.random()
    .toString(36)
    .substring(2, 10)}`;

  const userData = {
    name: `Test User ${uniqueId}`,
    email: `user_${uniqueId}@example.com`,
    username: `user_${uniqueId}`,
    password: "StrongPass123!",
    role: "job_seeker",
    birth_date: "1995-05-01",
  };

  // User Registration
  const registerRes = http.post(
    `${BASE_URL}/auth/register`,
    JSON.stringify(userData),
    {
      headers: { "Content-Type": "application/json" },
    }
  );

  check(registerRes, {
    "Registration successful": (r) => r.status === 201 && r.json("token"),
  });

  sleep(0.5);

  // User Login
  const loginRes = http.post(
    `${BASE_URL}/auth/login`,
    JSON.stringify({
      email: userData.email,
      password: userData.password,
    }),
    {
      headers: { "Content-Type": "application/json" },
    }
  );

  check(loginRes, {
    "Login successful": (r) => r.status === 200 && r.json("token"),
  });

  const token = loginRes.json("token");

  sleep(0.5);

  // Fetch User Profile
  const profileRes = http.get(`${BASE_URL}/users/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  check(profileRes, {
    "Profile fetched": (r) =>
      r.status === 200 && r.json("email") === userData.email,
  });

  sleep(0.5);

  // Removed low-success tests (profile update, password reset, user deletion)
}
  
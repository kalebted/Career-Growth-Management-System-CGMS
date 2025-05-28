import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import sendEmail from "../utils/sendEmail.js";
import User from "../models/User.js";

// Register new user
export const registerUser = async (req, res) => {
  console.log("Request body:", req.body); // Debug log
  const { name, email, username, password, role, birth_date } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      email,
      username,
      password: hashedPassword,
      role,
      birth_date: birth_date || null, // Add birth_date if provided
    });

    await user.save();

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    res.status(201).json({ token, user });
  } catch (error) {
    // Handle duplicate email or username gracefully
    if (error.code === 11000) {
      return res.status(400).json({ message: "User already exists" });
    }
  
    res.status(500).json({ message: "Registration failed", error: error.message });
  }
};

// Login user
export const loginUser = async (req, res) => {
  console.log("Login request body:", req.body);
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      console.log("No user found for email:", email);
      return res.status(400).json({ message: "Invalid credentials" });
    }

    console.log("Retrieved user from DB:", user); // Log the full user object

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      console.log("Password mismatch for user:", email);
      return res.status(400).json({ message: "Invalid credentials" });
    }

    console.log("User before token generation:", {
      id: user._id,
      role: user.role,
    });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    console.log("Generated token:", token);
    console.log(
      "Generated token payload:",
      jwt.verify(token, process.env.JWT_SECRET)
    );

    res.json({ token, user });
  } catch (error) {
    console.log("Login error:", error);
    res.status(500).json({ message: "Login failed", error: error.message });
  }
};

// Get current user profile (protected)
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch profile", error });
  }
};

// Update user profile
// Update user profile (name, username, password)
export const updateUserProfile = async (req, res) => {
  const { name, username, newPassword, currentPassword } = req.body;

  try {
    const user = await User.findById(req.user.id);

    if (!user) return res.status(404).json({ message: "User not found" });

    if (name) user.name = name;
    if (username) user.username = username;

    if (newPassword) {
      if (!currentPassword) {
        return res.status(400).json({ message: "Current password required to change password" });
      }

      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: "Current password is incorrect" });
      }

      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(newPassword, salt);
    }

    const updatedUser = await user.save();
    const { password, ...userData } = updatedUser.toObject();

    res.json(userData);
  } catch (error) {
    res.status(500).json({ message: "Failed to update profile", error });
  }
};

// request password reset that triggers token and email
export const requestPasswordReset = async (req, res) => {
  const { email } = req.body;

  try {
    // 1. Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "No user with that email." });
    }

    // 2. Generate a reset token and hash it
    const resetToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex");

    // 3. Save the hashed token and expiry time to the user document
    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpires = Date.now() + 15 * 60 * 1000; // 15 minutes
    await user.save();

    // 4. Construct reset link and log it instead of sending email
    const resetLink = `http://localhost:5173/reset-password/${resetToken}`; // change to prod frontend if needed
    console.log("🔗 Password reset link:", resetLink);
    const html = `
  <p>Hello ${user.name},</p>
  <p>You requested a password reset for your CGMS account.</p>
  <p>Click the link below to reset your password:</p>
  <a href="${resetLink}">${resetLink}</a>
  <p>If you didn't request this, you can ignore this email.</p>
`;

await sendEmail(user.email, "Reset Your Password", html);

    // 5. Respond to client
    res.json({ message: "Password reset link has been generated and logged in the console." });
  } catch (err) {
    console.error("❌ Reset request error:", err); // Show error in terminal
  
    res.status(500).json({
      message: "Server error while requesting reset.",
      error: err.message || String(err)
    });
  }  
};

// processes token and sets new password
export const resetForgottenPassword = async (req, res) => {
  const { token } = req.params;
  const { newPassword } = req.body;

  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  try {
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user)
      return res.status(400).json({ message: "Invalid or expired token." });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();
    res.json({ message: "Password successfully reset." });
  } catch (err) {
    res.status(500).json({ message: "Error resetting password.", err });
  }
};

// Delete user account
export const deleteUser = async (req, res) => {
  const { password } = req.body;

  if (!password) {
    return res.status(400).json({ message: "Password is required to delete account" });
  }

  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Incorrect password" });
    }

    await User.findByIdAndDelete(req.user.id);
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete user", error: error.message });
  }
};
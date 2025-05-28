import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import User from "../models/User.js";

dotenv.config({ path: '../.env' }); 

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(async () => {
  const hashedPassword = await bcrypt.hash("Admin@123", 10);

  const admin = new User({
    name: "Super Admin",
    email: "admin@cgms.com",
    username: "admin",
    password: hashedPassword,
    role: "admin",
  });

  await admin.save();
  console.log("✅ Admin user created!");
  mongoose.disconnect();
})
.catch((err) => console.error("❌ Error:", err));

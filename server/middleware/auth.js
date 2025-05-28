import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  try {
    let token = req.header("Authorization");

    if (!token) {
      return res.status(403).json({ message: "Access Denied" });
    }

    if (token.startsWith("Bearer ")) {
      token = token.slice(7).trim();
    } else {
      return res
        .status(401)
        .json({ message: "Invalid or missing token format" });
    }

    const verified = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded Token:", verified);
    req.user = {
      id: verified.id,
      role: verified.role,
    };
    console.log("req.user after verifyToken:", req.user);
    next();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
export const verifyAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Admin access only" });
  }
  next();
};
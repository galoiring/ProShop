import jwt from "jsonwebtoken";

const generateToken = (
  res,
  userId,
  email = null,
  name = null,
  isAdmin = false
) => {
  const payload = { userId };
  if (email) {
    payload.email = email;
  }
  if (name) {
    payload.name = name;
  }
  if (typeof isAdmin === "boolean") {
    payload.isAdmin = isAdmin;
  }

  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });

  // Set JWT as HTTP-Only cookie
  res.cookie("jwt", token, {
    httpOnly: true,
    // secure: process.env.NODE_ENV !== "development",
    sameSite: "strict",
    maxAge: 30 * 24 * 60 * 60 * 1000, //30 Days
  });
  return token;
};

export default generateToken;

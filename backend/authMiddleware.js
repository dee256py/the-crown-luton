require("dotenv").config();
const jwt = require("jsonwebtoken");

function authenticateAdmin(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({
      error: "No token provided. Admin login required."
    });
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      error: "Invalid authorization format."
    });
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "development-secret"
    );

    req.admin = decoded;
    next();
  } catch (err) {
    return res.status(403).json({
      error: "Invalid or expired token."
    });
  }
}

module.exports = authenticateAdmin;
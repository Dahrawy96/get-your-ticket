const jwt = require("jsonwebtoken");
const secretKey = process.env.JWT_SECRET;

// 🔐 Header-based token verification (Bearer)
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Access Denied: No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, secretKey);
    req.user = decoded.user; // { id, role }
    next();
  } catch (err) {
    return res.status(403).json({ message: "Invalid Token" });
  }
};

// 👤 Role-based access control
const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Access Denied: Insufficient role" });
    }
    next();
  };
};

module.exports = { verifyToken, authorizeRoles };

const jwt = require("jsonwebtoken");
const secretKey = process.env.JWT_SECRET;

// Header-based token verification (Bearer)
<<<<<<< HEAD:middleware/authorMiddleware.js


// hena fi middle ware aashan y verify el token el gaya men el headers 
=======
>>>>>>> main:backend/middleware/authorMiddleware.js
const verifyToken = (req, res, next) => {


  //hashouf fen el token fe the request headers (bezat in "Authorization")
   // grab the "Authorization" header men  request
  const authHeader = req.headers.authorization;



    // law mafish header aw msh beyebtedy be bearer yeb'a h deny el request, access denied
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Access Denied: No token provided" });
  }

  const token = authHeader.split(" ")[1];


  // haneemel akenena ben decode el header we hanestakhdem el token ka  secret key
  // law successful, attach the decoded user information to the request object
  // aashan neeraf n access it in the next middleware or route handler
  try {
    const decoded = jwt.verify(token, secretKey);



   // save the decoded user info (like id and role) to the request for later use
    req.user = decoded.user; // { id, role }
    next();
  } catch (err) {
    return res.status(403).json({ message: "Invalid Token" });
  }
};

<<<<<<< HEAD:middleware/authorMiddleware.js
// role based access control
=======
// Role-based access control
>>>>>>> main:backend/middleware/authorMiddleware.js
const authorizeRoles = (...roles) => {
  //  // hy return el middleware function that checks the user's role
  // against the allowed roles passed as arguments
  return (req, res, next) => {

    // h check law  the user's role is in the list of allowed roles
    // law msh allowed, return a 403 Forbidden error
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Access Denied: Insufficient role" });
    }

    // If allowed, continue to the next middleware or route handler
    // Move to the next step (controller or next middleware)
    next();
  };
};

module.exports = { verifyToken, authorizeRoles };
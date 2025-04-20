//// Bring in the jsonwebtoken package so we can verify tokens
const jwt = require("jsonwebtoken");

//get the secret key to decode and verify the jwt token
const secretKey = process.env.JWT_SECRET;


//haamel function middleware to protect el routes 
//bacheck law el user logged in aw la
// law 3ando token aw la
module.exports = function authenticationMiddleware(req, res, next) {

   // look for the token in the request headers specifically fe "Authorization"
  const authHeader = req.headers.authorization;



//law mafeesh token aw el token mesh sah doesnt start with "Bearer "
// return 401 Unauthorized
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided in Authorization header" });
  }
   // basplit el token mn el bearer(string) 3ashan a3raf el token bas
  const token = authHeader.split(" ")[1];

  try {
     // try to verify (decode) the token using the secret key
    const decoded = jwt.verify(token, secretKey);
    // if successful attach the decoded user information to the request object
    // so that it can be accessed in the next middleware or route handler
    req.user = decoded.user;

    // move to the next step (controller or next middleware)
    next();
  } catch (err) {
    //law token expired aw fake error appears
    return res.status(403).json({ message: "Invalid token" });
  }
};
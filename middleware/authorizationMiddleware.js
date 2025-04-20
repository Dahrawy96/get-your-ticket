// export- function that takes in allowed roles zay el admin w el organizer)
module.exports = function authorizationMiddleware(roles) {

  //returns another function (middleware) that handles the request
  return (req, res, next) => {
    // Get the role of the current user from the token el howa already verified in authentication middleware
    const userRole = req.user.role;

    // checks if user is actually allowed fel user roles
    if (!roles.includes(userRole)) {
      // If not allowed, return a 403 Forbidden error
      return res.status(403).json({ message: "Unauthorized access" });
    }

    // law allowed continue to the next middleware or route handler
    next();
  };
};
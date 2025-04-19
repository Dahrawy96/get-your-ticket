const express = require('express');
const router = express.Router();  // Create a router object for defining user-related routes

// “From the express-validator library, 
// I want to use the body function so
// I can write rules that check fields sent in the body of a request.”

// Used to validate request body fields
const { body } = require('express-validator');


// Import controller functions
const {
  registerUser,
  loginUser,
  forgetPassword,
  getAllUsers,
  getUser,
  updateUser,
  deleteUser
} = require('../controllers/userController');


// Import middlewares for checking authentication and roles
const { verifyToken, authorizeRoles } = require('../middleware/authorMiddleware');


// rules ashan lama el user yeregister 
// yebaa 3ando el rules deh 3ashan el data ely hayb3athha tkon sah
const registerValidation = [
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
];


// rules ashan lama el user yelogin 
const loginValidation = [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required')
];


// rules ashan el user y3ml forget password
const forgetPasswordValidation = [
  body('email').isEmail().withMessage('Valid email is required'),
  body('newPassword').isLength({ min: 6 }).withMessage('New password must be at least 6 characters')
];


// Public routes and no authentication required
router.post('/register', registerValidation, registerUser);
router.post('/login', loginValidation, loginUser);
router.put('/forgetPassword', forgetPasswordValidation, forgetPassword);


// Protected routes hena baa lazem tokens abaatha maah

// Get all users (admin)
router.get('/', verifyToken, authorizeRoles('admin'), getAllUsers);

// Get your own profile info (ay haga)
router.get('/me', verifyToken, (req, res) => res.status(200).json({ user: req.user }));

// Get a specific user by ID (ay haga)
router.get('/:id', verifyToken, authorizeRoles('admin', 'user', 'organizer'), getUser);

// Update a specific user by ID (ay haga)
// 3ashan el user y3ml update l data beta3to)
router.put('/:id', verifyToken, authorizeRoles('admin', 'user', 'organizer'), updateUser);

// Delete a user by ID (admin or organizer allowed)
router.delete('/:id', verifyToken, authorizeRoles('admin', 'organizer'), deleteUser);


module.exports = router;

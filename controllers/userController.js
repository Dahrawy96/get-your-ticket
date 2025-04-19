const User = require('../models/userModel');
//  hash passwords securely
const bcrypt = require('bcrypt');
//  generate tokens for login and authorization
const jwt = require('jsonwebtoken');


//  Register a new user
const registerUser = async (req, res) => {
  const { name, email, password, role } = req.body;

  // parameters ely beydakhalha el user
  // name, email, password, role (optional)
  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Name, email, and password are required' });
  }

  try {
    // Check if a user with the same email already exists
    const existing = await User.findOne({ email });
    //  law mawgood , return a 409 
    if (existing) 
      return res.status(409).json({ message: 'User already exists' });

    // Hash the password before saving it
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role || 'user'   // Default role is 'user' if not provided
    });

    // Create a JWT token for the new user
    const token = jwt.sign(
      { user: { id: newUser._id, role: newUser.role } },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }  // Token valid for 1 day only law hatest baadaha ya farah benafs el token mesh hateshtaghal 
    );

    // el response shaklo kda
    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role
      },
      token
    });

  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};


//  Login user
const loginUser = async (req, res) => {
  // parameters ely beydakhalha el user
  const { email, password } = req.body;

  try {
    // Check if the email exists in the database
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'Email not found' });

    // Compare the entered password with the stored hashed password
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ message: 'Incorrect password' });

    // Generate a JWT token for the user
    const token = jwt.sign(
      { user: { id: user._id, role: user.role } },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    // Return a success response with user details and token mengheir el password akeed
    // 3ashan el password ma3ana fe el database hashed
    res.status(200).json({
      message: 'Login successful',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      },
      token
    });
  } catch (err) {
    res.status(500).json({ message: 'Login failed', error: err.message });
  }
};


//  Forget Password
const forgetPassword = async (req, res) => {
  const { email, newPassword } = req.body;

  // Check if both email and new password are provided
  // 3ashan el user yedkhal el email w el password ely heya 3ayza tghayro
  if (!email || !newPassword) {
    return res.status(400).json({ message: 'Email and new password are required' });
  }

  try {
    // hadawar aal user bl email beta3o
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Hash the new password and update it
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ message: 'Password updated successfully' });

  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};


// Get all users (admin)
const getAllUsers = async (req, res) => {
  try {
    // Fetch all users mngheir passwords
    const users = await User.find().select('-password');
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching users', error: err.message });
  }
};


//  Get single user
const getUser = async (req, res) => {
  try {
    // Find user by their request ID we bardo basheel el password 
    const user = await User.findById(req.params.id).select('-password');

    if (!user) 
      return res.status(404).json({ message: 'User not found' });

    res.status(200).json(user);

  } catch (err) {
    res.status(500).json({ message: 'Error retrieving user', error: err.message });
  }
};


//  Update user
//  Middleware to check if the user is an admin
const updateUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const currentUser = req.user;  // mn el  token

    // Only the user themselves or an admin can update a user
    if (currentUser.id !== userId && currentUser.role !== 'admin') {
      return res.status(403).json({ message: 'Unauthorized to update this user' });
    }

    // Prevent regular users from changing their own role
    // 3ashan el user ely 3ayz yghayar el role beta3o
    if (req.body.role && currentUser.role !== 'admin') {
      delete req.body.role;
    }

    // Update user data
    const updatedUser = await User.findByIdAndUpdate(userId, req.body, {
      new: true, // haraga3lo updated doc 
      runValidators: true, // ashan el schema validations tergaa heya heya 
    }).select('-password'); // mesh habaat el password bardo tany 

    res.status(200).json({ message: 'User updated successfully', user: updatedUser });
  } catch (err) {
    res.status(500).json({ message: 'Error updating user', error: err.message });
  }
};


//  Delete user
const deleteUser = async (req, res) => {
  try {
    // Delete user by ID mn el request foo2
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.status(200).json({ message: 'User deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting user', error: err.message });
  }
};


// Export all the controller functions ashan astakhdemhom fl routes
module.exports = {
  registerUser,
  loginUser,
  forgetPassword,
  getAllUsers,
  getUser,
  updateUser,
  deleteUser
};

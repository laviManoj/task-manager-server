const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const generateToken = require('../utils/generateToken');

const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password} = req.body;

  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  const user = await User.create({
    name,
    email,
    password,
  });

  if (user) {
    res.status(201).json({
   message : "Account created Login In to continue"
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});

const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  } else {
    res.status(401);
    throw new Error('Invalid email or password');
  }
});

const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  console.log('user', user)

  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      profile: user.profile
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});



const checkUser = asyncHandler(async (req, res) => {

  const { email, name, password, profile } = req.body;
  let user = await User.findOne({ email });

  if (user) {

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      profile: user.profile,
      token: generateToken(user._id),
    });
  } else {
  
    // Create a new user if not found
    user = await User.create({
      name,
      email,
      password,
      profile // Ensure this is hashed in your User model or middleware
    });

    res.status(201).json({
      message: "Account created successfully",
      user,
    });
  }
});




module.exports = { registerUser, authUser, getUserProfile ,checkUser  };

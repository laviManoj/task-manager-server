const express = require('express');
const {
  registerUser,
  authUser,
  getUserProfile,
  checkUser,
} = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', authUser);
router.post('/google' , checkUser)
router.route('/profile').get(protect, getUserProfile);


module.exports = router;

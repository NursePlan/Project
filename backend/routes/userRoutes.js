const express = require('express');
const UserController = require('../controllers/UserController');
const authenticateToken = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', authenticateToken, UserController.getAllUsers);
router.get('/:id', authenticateToken, UserController.getUserById);
router.post('/', authenticateToken, UserController.createUser);
router.delete('/:id', authenticateToken, UserController.deleteUser);

module.exports = router;

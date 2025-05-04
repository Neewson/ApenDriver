const express = require('express');
const { check } = require('express-validator');
const { register, login, getMe, logout } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.post('/register', [
  check('name', 'Nome é obrigatório').not().isEmpty(),
  check('email', 'Por favor, inclua um email válido').isEmail(),
  check('password', 'Por favor, digite uma senha com 6 ou mais caracteres').isLength({ min: 6 })
], register);

router.post('/login', [
  check('email', 'Por favor, inclua um email válido').isEmail(),
  check('password', 'Senha é obrigatória').exists()
], login);

router.get('/me', protect, getMe);
router.get('/logout', protect, logout);

module.exports = router;

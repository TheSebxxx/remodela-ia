const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Estas rutas ahora dispararán la lógica de Supabase Auth
router.post('/registrar', authController.registrar);
router.post('/login', authController.login);

module.exports = router;
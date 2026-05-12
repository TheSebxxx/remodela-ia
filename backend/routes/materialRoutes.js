const express = require('express');
const router = express.Router();
const materialController = require('../controllers/materialController');

// Esta es la ruta que tu React está buscando
router.get('/', materialController.obtenerMateriales);

module.exports = router;
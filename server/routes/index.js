const express = require('express');
const router = express.Router();
const utentesRoutes = require('./utentes.routes');
const moradaRoutes = require('./morada.routes');
const loginRouter = require('./auth.routes');
router.use('/auth', loginRouter);


router.use('/utentes', utentesRoutes);
router.use('/api/morada', moradaRoutes); 
module.exports = router;
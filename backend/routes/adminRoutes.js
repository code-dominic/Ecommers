const express = require('express');
const adminOrderRoute = require('./adminOrderRoutes');
const adminProductRoute = require('./adminProductRoutes');
const router = express.Router();

router.use('/orders' ,adminOrderRoute);
router.use('/products' ,adminProductRoute);




module.exports = router;
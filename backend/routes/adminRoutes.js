const express = require('express');
const adminOrderRoute = require('./adminOrderRoutes');
const adminProductRoute = require('./adminProductRoutes');
const adminReturnsRoutes = require('./adminReturnsRoutes')
const router = express.Router();

router.use('/orders' ,adminOrderRoute);
router.use('/products' ,adminProductRoute);
router.use('/returns' , adminReturnsRoutes);




module.exports = router;
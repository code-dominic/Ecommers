const express = require('express');
const adminOrderRoute = require('./adminOrderRoutes');
const router = express.Router();

router.use('/orders' ,adminOrderRoute);




module.exports = router;
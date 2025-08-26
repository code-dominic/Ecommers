const mongoose = require('mongoose');


const dashboardSchema = new mongoose.Schema({
    usersCount : Number,
    orderCount : Number,
    returns : Number,
    cancellations : Number,
    
})
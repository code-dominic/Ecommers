const mongoose = require('mongoose');


const variantSchema = new mongoose.Schema({
    size : String,
    color : String,
    cost : Number,
    imageUrl : String
})


module.exports = mongoose.model('Varaint' , variantSchema);

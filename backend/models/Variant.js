const mongoose = require('mongoose');
const { Schema } = mongoose;


const variantSchema = new mongoose.Schema({
    size : String,
    color : String,
    cost : Number,
    imageUrl : String,
    product : { type: Schema.Types.ObjectId, ref: 'Product' }
})


module.exports = mongoose.model('Variant' , variantSchema);

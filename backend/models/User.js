const mongoose = require('mongoose');
const Product = require('./Product');
const { Schema } = mongoose;

const userSchema = new Schema({
   email: {
      type: String,
      required: true,
      unique: true
   },
   username: { 
      type: String,
      required: true,
      unique: true
   },
   password: {
      type: String,
      required: true
   },
   cart: [
      {
         product : { type : Schema.Types.ObjectId , ref : 'Product'},
         Qty: { type: Number, required: true },
         productVariant : { type: Schema.Types.ObjectId, ref: 'Varaint'}
      }
   ]
});

const User = mongoose.model('User', userSchema);
module.exports = User;



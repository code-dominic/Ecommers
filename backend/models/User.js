const mongoose = require('mongoose');
const Product = require('./Product');
const Order = require('./Order');
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
   Role : {
      type : String,
      enum : [ "users" , "admin"],
      default : "users"
   },
   cart: [
      {
         product : { type : Schema.Types.ObjectId , ref : 'Product'},
         Qty: { type: Number, required: true },
         productVariant : { type: Schema.Types.ObjectId, ref: 'Varaint'}
      }
   ],
   orders : [
      { type : Schema.Types.ObjectId ,  ref : 'Order'}
   ]

});

const User = mongoose.model('User', userSchema);
module.exports = User;



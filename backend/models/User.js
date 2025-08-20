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
         productOrdered: { type: Schema.Types.ObjectId, ref: 'Product' },
         Qty: { type: Number, required: true }
      }
   ]
});

const User = mongoose.model('User', userSchema);
module.exports = User;


// Varaint : [
//     {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Varaint",
//       required: true
//     }
//   ],
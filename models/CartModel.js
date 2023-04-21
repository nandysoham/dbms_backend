// incomplete part

const mongoose = require('mongoose')

const CartModelSchema = new mongoose.Schema({
  userid:{
      type:  mongoose.Schema.Types.ObjectId,
      ref : 'CustomerModel'
  },
  productid:{
      type:  mongoose.Schema.Types.ObjectId,
      ref : 'ProductModel'
  },
  quantity:{
    type: String,
    required: true,
    default : "1"
  }
  
},{timestamps:true});

const CartModel = mongoose.model('CartModel', CartModelSchema)
module.exports = CartModel

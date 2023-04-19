// incomplete part

const mongoose = require('mongoose')

const Seller_Product_ModelSchema = new mongoose.Schema({
  sellerid:{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'SellerModel'
  },
  productid:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ProductModel'
  },
  quantity:{
      type: String,
      required: true,
  },
  price:{
      type: String,
      required: true
  },
  discount:{
    type: String,
    default: 0
  },
  updatedAt : Date,
},{timestamps:true});

const Seller_Product_Model = mongoose.model('Seller_Product_Model', Seller_Product_ModelSchema)
module.exports = Seller_Product_Model

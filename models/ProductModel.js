// incomplete part

const mongoose = require('mongoose')

const ProductModelSchema = new mongoose.Schema({
  name:{
      type: String,
      required:true
  },
  description:{
      type: String,
      require: true
  },
  sellerid:{
      type : mongoose.Schema.Types.ObjectId,
      ref : 'SellerModel'
  },
  category:{
    type : String,
    required : true

  },
  quantity:{
    type: String,
    required: true,
  },
  org_price:{
    type : String,
    required : true
  },
  price:{
      type: String,
      required: true
  },
  discount:{
    type: String,
    default: 0
  },
  pictures :
    [{img : {type : String}} ]
  ,
  updatedAt : Date,
},{timestamps:true});

const ProductModel = mongoose.model('ProductModel', ProductModelSchema)
module.exports = ProductModel

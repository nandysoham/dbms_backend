// incomplete part

const mongoose = require('mongoose')

const OrderModelSchema = new mongoose.Schema({
  sellerid:{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'SellerModel'
  },
  productid:{
      type: mongoose.Schema.Types.ObjectId,
      ref : 'ProductModel'
  },
  userid:{
    type: mongoose.Schema.Types.ObjectId,
    ref : 'CustomerModel'
  },
  orderid:{
    type: String,
    required : true
  },
  quantity:{
    type : String,
    required : true
  },
  email:{
    type : String,
    required : true
  },
  phone:{
    type:"String",
    required:true,      
  },
  address1:{
    type:String,
  },
  address2:{
    type:String
  },
  city:{
    type:String,
  },
  state:{
    type:String,
    required:true
  },
  country:{
      type:String,
      required:true
  },
  pincode:{
      type:String,
  },
  payment:{
      type: String,
      required: true
  },
  status:{
    type: String,
    require: true
  },
  type:{        // "return" or "order"
    type: String,
    require : true
  },
  
  updatedAt : Date,
},{timestamps:true});

const OrderModel = mongoose.model('OrderModel', OrderModelSchema)
module.exports = OrderModel

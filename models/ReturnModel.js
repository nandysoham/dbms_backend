// incomplete part

const mongoose = require('mongoose')

const ReturnModelSchema = new mongoose.Schema({
  orderid:{             // to get to know about the order just query this
    type: String,
    required : true
  },
  orderid:{             // to get to know about the order just query this
    type: mongoose.Schema.Types.ObjectId,
    ref: 'OrderModel'
  },    
  sellerid:{
    type : mongoose.Schema.Types.ObjectId,
    ref : "SellerModel"
  },
  userid:{
    type : mongoose.Schema.Types.ObjectId,
    ref : "CustomerModel"
  },
  productid:{
    type : mongoose.Schema.Types.ObjectId,
    ref : "ProductModel"
  },
  quantity:{
    type: String,
    require: true
  }  ,
  payment:{
    type : String,
    required : true
  },  
  status:{
    type : String,
    defualt : "registered"
  },
  dayofpurchase:{
    type : Date
  },
  updatedAt : Date,
},{timestamps:true});

const ReturnModel = mongoose.model('ReturnModel', ReturnModelSchema)
module.exports = ReturnModel

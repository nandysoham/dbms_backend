// incomplete part

const mongoose = require('mongoose')

const DeliveryModelSchema = new mongoose.Schema({
  orderid:{             // to get to know about the order just query this
    type: String,
    required : true
  },
  individ:{             // to get to know about the order just query this
    type: mongoose.Schema.Types.ObjectId,
    ref: 'OrderModel'
  },
  type:{
    type : String,
    required : true
  },
  comment:{
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
  
  
  updatedAt : Date,
},{timestamps:true});

const DeliveryModel = mongoose.model('DeliveryModel', DeliveryModelSchema)
module.exports = DeliveryModel

const mongoose = require('mongoose')

const CustomerModelSchema = new mongoose.Schema({
  firstname:{
      type: String,
      required:true
  },
  lastname:{
    type:String,
  },
  email:{
      type:String,
      required:true,
      unique:true
  },
  password: {
    type:String,
    required:true
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
  profilePicture :
    {img : {type : String}}  
,
  updatedAt : Date,
},{timestamps:true});

const CustomerModel = mongoose.model('CustomerModel', CustomerModelSchema)
module.exports = CustomerModel

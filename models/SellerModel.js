const mongoose = require('mongoose')

const SellerModelSchema = new mongoose.Schema({
  companyname:{
      type: String,
      required:true
  },
  companyregid:{
    type:String,
  },
  admin:{
    type:String
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

const SellerModel = mongoose.model('SellerModel', SellerModelSchema)
module.exports = SellerModel

const mongoose = require('mongoose')

const AdvertiserSchema = new mongoose.Schema({
  companyid:{
    type: mongoose.Schema.Types.ObjectId,
      ref: 'SellerModel'
  },
  description:{
    type: String,
    required : true
  },
  profilePicture :
    {img : {type : String}}  
,
  updatedAt : Date,
},{timestamps:true});

const AdvertiserModel = mongoose.model('AdvertiserModel', AdvertiserSchema)
module.exports = AdvertiserModel

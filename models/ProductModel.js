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
  pictures :
    [{img : {type : String}} ]
  ,
  updatedAt : Date,
},{timestamps:true});

const ProductModel = mongoose.model('ProductModel', ProductModelSchema)
module.exports = ProductModel

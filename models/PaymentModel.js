// incomplete part

const mongoose = require('mongoose')

const PaymentModelSchema = new mongoose.Schema({
  userid:{
      type:  mongoose.Schema.Types.ObjectId,
      ref : 'CustomerModel'
  },
  orderid:{
      type:  String,
      required : true
  },
  amount:{
    type: String,
    required: true
  }
  
},{timestamps:true});

const PaymentModel = mongoose.model('PaymentModel', PaymentModelSchema)
module.exports = PaymentModel

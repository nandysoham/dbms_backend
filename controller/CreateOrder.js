// NOT TESTED
// check while calling from the payment gateway
// this takes in an object and creates an order for each of them
const OrderModel= require("../models/OrderModel")
exports.createOrder = (obj) =>{
    const order =new OrderModel({
        productid : obj.productid,
        userid : obj.userid,
        quantity : obj.quantity,
        email : obj.email,
        phone : obj.phone,
        address1 : obj.address1,
        address2 : obj.address2,
        city : obj.city,
        state : obj.state,
        country : obj.country,
        pincode : obj.pincode,
        payment: obj.payment,
        status: obj.status,
        type : obj.type

    });

    order.save((error, order) =>{
        if(error) return res.status(400).json({success: "false",error:error})
        if(order){
            req.order = order
        }
    })
}
const express = require("express");
const router = express.Router();
const path = require("path");
const { body, validationResult } = require("express-validator");
const randomstring = require("randomstring");
const env = require("dotenv");
env.config({ path: __dirname + "/./../.env" });
const { AsyncDatabase } = require("promised-sqlite3");
const sqlite3 = require("sqlite3").verbose();

const app = express();
const FetchUser = require("../controller/FetchUser");
const CartModel = require("../models/CartModel");
const CreateOrder = require("../controller/CreateOrder");
const UserModel = require("../models/CustomerModel");
const SellerModel = require("../models/SellerModel");
const ProductModel = require("../models/ProductModel");
const OrderModel = require("../models/OrderModel");
const PaymentModel = require("../models/PaymentModel");
const DeliveryModel = require("../models/DeliveryModel");


const { compareSync } = require("bcryptjs");
const { response } = require("express");

// const db = new sqlite3.Database(path.resolve(__dirname, "../db/sample.db"));
// to add each product by quantity 1
router.post("/makepayment/debit", FetchUser, async (req, res) => {
  // someone trying to post an authorised request
  
  const signtoken = req.headers.signtoken;
  if (!signtoken) {
    return res.status(401).json({
      success: "false",
      msg: "forbidden request",
    });
  }

  if (signtoken != process.env.SIGNTOKEN) {
    return res.status(401).json({
      success: "false",
      msg: "forbidden request",
    });
  }

  try {
    let payment = await PaymentModel.findOne({ orderid: req.body.orderid });
    if (payment) {
      const amount = payment.amount;
      console.log("total cart amount", amount)
    //   console.log(req.body)
      const db = await AsyncDatabase.open(path.resolve(__dirname, "../db/sample.db"));
      const account = await db.get("SELECT AMOUNT FROM Bank WHERE DEBIT_CARD = ? AND DEBIT_CVV = ?", req.body.DEBIT_CARD, req.body.DEBIT_CVV );
      console.log("Before purchasal the balance in bank", account.AMOUNT)
      if(account){
        if(parseInt(amount) > parseInt(account.AMOUNT)){
            return res.status(401).json({
                success : "false",
                msg: "Insufficient balance for purchase"
            })
        }
        else{
            // first deduct the amount from the account

            const new_amt = parseInt(account.AMOUNT) - parseInt(amount)
            console.log(new_amt)
            const uptaccount = await db.exec(`
                UPDATE Bank 
                SET AMOUNT = ${new_amt}
                WHERE DEBIT_CARD = ${req.body.DEBIT_CARD} AND DEBIT_CVV = ${req.body.DEBIT_CVV}
            `)

            
          

            // change the status of the order to paid
            // insert all the orders to the delivery module
            const orderarr = await OrderModel.find({orderid : req.body.orderid})
            console.log(orderarr)
            for await (obj of orderarr){
                obj.status = "paid"
                const change_status = await OrderModel.findByIdAndUpdate(obj._id, {$set : obj}, {new : true});
                const seller = await SellerModel.findById(obj.sellerid)
                const put_delivery = await DeliveryModel.create({
                    orderid : obj.orderid,
                    individ : obj._id,
                    type : "order",
                    comment : "Order deatails sent to the Seller",
                    address1 : seller.address1,
                    address2 : seller.address2,
                    city : seller.city,
                    state : seller.state,
                    country : seller.country,
                    pincode : seller.pincode,
                    phone : seller.phone
                })

                const cartremove = await CartModel.findOneAndDelete({userid : req.user.id, productid : obj.productid })
            }

            console.log("Reached here")
            return res.status(200).json({
                success : "true",
                msg: "payment done"
            })

            
            // clear the cart
        }
      }
      else{
          return res.status(401).json({
              success : "false",
              msg: "Invalid Credentials"
          })
      }
        
    }
    
    return res.status(200).json({
            success : "false",
            msg : "No Unpaid payments found"
        })


  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: "false",
      msg: "Internal Server Error",
    });
  }
});



// const db = new sqlite3.Database(path.resolve(__dirname, "../db/sample.db"));
// to add each product by quantity 1
router.post("/makepayment/credit", FetchUser, async (req, res) => {
    // someone trying to post an authorised request
    
    const signtoken = req.headers.signtoken;
    if (!signtoken) {
      return res.status(401).json({
        success: "false",
        msg: "forbidden request",
      });
    }
  
    if (signtoken != process.env.SIGNTOKEN) {
      return res.status(401).json({
        success: "false",
        msg: "forbidden request",
      });
    }
  
    try {
      let payment = await PaymentModel.findOne({ orderid: req.body.orderid });
      if (payment) {
        const amount = payment.amount;
        console.log("total cart amount", amount)
      //   console.log(req.body)
        const db = await AsyncDatabase.open(path.resolve(__dirname, "../db/sample.db"));
        const account = await db.get("SELECT AMOUNT FROM Bank WHERE CREDIT_CARD = ? AND CREDIT_CVV = ?", req.body.CREDIT_CARD, req.body.CREDIT_CVV );
        console.log(account.AMOUNT)
        if(account){
          if(parseInt(amount) > parseInt(account.AMOUNT)){
              return res.status(401).json({
                  success : "false",
                  msg: "Insufficient balance for purchase"
              })
          }
          else{
              // first deduct the amount from the account
  
              const new_amt = parseInt(account.AMOUNT) - parseInt(amount)
              console.log(new_amt)
              const uptaccount = await db.exec(`
                  UPDATE Bank 
                  SET AMOUNT = ${new_amt.toString()}
                  WHERE CREDIT_CARD = ${req.body.CREDIT_CARD} AND CREDIT_CVV = ${req.body.CREDIT_CVV}
              `)
  
              
  
  
              // change the status of the order to paid
              // insert all the orders to the delivery module
              const orderarr = await OrderModel.find({orderid : req.body.orderid})
              console.log(orderarr)
              for await (obj of orderarr){
                  obj.status = "paid"
                  const change_status = await OrderModel.findByIdAndUpdate(obj._id, {$set : obj}, {new : true});
                  const seller = await SellerModel.findById(obj.sellerid)
                  const put_delivery = await DeliveryModel.create({
                      orderid : obj.orderid,
                      type : "order",
                      comment : "Order deatails sent to the Seller",
                      address1 : seller.address1,
                      address2 : seller.address2,
                      city : seller.city,
                      state : seller.state,
                      country : seller.country,
                      pincode : seller.pincode,
                      phone : seller.phone
                  })
  
                  const cartremove = await CartModel.findOneAndDelete({userid : req.user.id, productid : obj.productid })
              }
  
              console.log("Reached here")
              return res.status(200).json({
                  success : "True",
                  msg: "payment done"
              })
  
              
              // clear the cart
          }
        }
        else{
            return res.status(401).json({
                success : "false",
                msg: "Invalid Credentials"
            })
        }
          
      }
      
      return res.status(200).json({
              success : "false",
              msg : "No Unpaid payments found"
          })
  
  
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        success: "false",
        msg: "Internal Server Error",
      });
    }
  });
  
module.exports = router;

// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjQ0MTdkODZlYTgyOTZjMTIyNzlkYjVkIiwiZW1haWwiOiJuYW5keUBnbWFpbC5jb20ifSwiaWF0IjoxNjgyMDEzNTc0fQ.6B5kjPClcgglolwx-ABCEQcWz1ganfsPuWgwSZsVsQg

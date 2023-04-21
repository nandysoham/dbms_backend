const express = require("express");
const router = express.Router();
const path = require("path");
const { body, validationResult } = require("express-validator");
const env = require("dotenv");
env.config({ path: __dirname + "/./../.env" });

const app = express();
const FetchSeller = require("../controller/FetchSeller");
const DeliveryModel = require("../models/DeliveryModel");


// const db = new sqlite3.Database(path.resolve(__dirname, "../db/sample.db"));
// to add each product by quantity 1
router.post("/updatedelivery", FetchSeller, async (req, res) => {
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
  try{
      let delivery =await DeliveryModel.findOne({individ : req.body.individ});
    //   console.log(delivery)
      if(delivery){
          var newdel = {}
          newdel.comment = req.body.comment
          newdel.address1 = req.body.address1
          newdel.address2 = req.body.address2 
          newdel.city = req.body.city 
          newdel.state = req.body.state
          newdel.country = req.body.country
          newdel.pincode = req.body.pincode 
          newdel.phone = req.body.phone
            newdel.type = delivery.type,
            newdel.orderid = delivery.orderid,
            newdel.individ = delivery.individ
        let addnew =await DeliveryModel.create(newdel)
        return res.status(200).json({
            success : "true",
            msg : "Packet information updated",
        })
      }
      else{
          return res.status(200).json({
              success : "false",
              msg : "sorry the parcel was not found"
          })
      }
  }
  catch (error) {
    console.log(error);
    return res.status(500).json({
      success: "false",
      msg: "Internal Server Error",
    });
  }
});


  
module.exports = router;

// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjQ0MTdkODZlYTgyOTZjMTIyNzlkYjVkIiwiZW1haWwiOiJuYW5keUBnbWFpbC5jb20ifSwiaWF0IjoxNjgyMDEzNTc0fQ.6B5kjPClcgglolwx-ABCEQcWz1ganfsPuWgwSZsVsQg

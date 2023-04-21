const express = require("express");
const router = express.Router();

const env = require("dotenv");
env.config({ path: __dirname + "/./../.env" });

const app = express();
const FetchUser = require("../controller/FetchUser");
const DeliveryModel = require("../models/DeliveryModel");


// const db = new sqlite3.Database(path.resolve(__dirname, "../db/sample.db"));
// to add each product by quantity 1
router.post("/fetchdelivery", FetchUser, async (req, res) => {
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
      let delivery =await DeliveryModel.find({individ : req.body.individ}).sort({updatedAt : -1})
    //   console.log(delivery)
      if(delivery){
        
        return res.status(200).json({
            success : "true",
            msg : "Sucessfuly Traced",
            delivery
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

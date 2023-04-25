const express = require("express");
const router = express.Router();

const env = require("dotenv");
env.config({ path: __dirname + "/./../.env" });

const app = express();
const FetchUser = require("../controller/FetchUser");
const ProductModel = require("../models/ProductModel");


// const db = new sqlite3.Database(path.resolve(__dirname, "../db/sample.db"));
// to add each product by quantity 1
router.post("/fetchproducts", async (req, res) => {
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
      let products =await ProductModel.find()
    
          return res.status(200).json({
              success : "true",
              msg : "products attached",
              products
          })
      
  }
  catch (error) {
    console.log(error);
    return res.status(500).json({
      success: "false",
      msg: "Internal Server Error",
    });
  }
});


router.post("/fetchproducts/searchitem", async (req, res) => {
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
      let products =await ProductModel.find({ $text: { $search: req.body.searchword } })
    
          return res.status(200).json({
              success : "true",
              msg : "products attached",
              products
          })
      
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

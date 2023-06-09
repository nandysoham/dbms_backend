const express = require('express');
const cors = require("cors")
const env = require('dotenv');    // for .env running

const mongoose = require('mongoose')

const app = express();
const sqlite3 = require('sqlite3').verbose();

env.config();

app.use(cors())
app.use(express.json())
// parse application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: false }))


const CustomerSignupRoutes = require("./routes/CustomerSignup.js")
const SellerSignupRoutes = require("./routes/SellerSignup")
const ProductCrudRoutes = require("./routes/ProductCrud")
const CartCrudRoutes = require("./routes/CartCrud")
const CreateOrderRoutes = require("./routes/CreateOrder")
const MakePaymentRoutes = require("./routes/MakePayment")
const UpdateDeliveryRoutes = require("./routes/UpdateDelivery")
const ShowDeliveryRoutes = require("./routes/ShowDelivery")
const CustomerLoginRoutes = require("./routes/CustomerLogin")
const SellerLoginRoutes = require("./routes/SellerLogin")
const CustomerPublicRoutes = require("./routes/CustomerPublicDetails")
const SellerPublicRoutes = require("./routes/SellerPublicDetails")
const ReturnProductIniRoutes = require("./routes/ReturnProductIni")
const ReturnProductFinalRoutes = require("./routes/ReturnProductConfirm")
const showProductRoutes = require("./routes/showProducts")
const GetProductRoutes = require("./routes/ProductDetails")
const ShowCustomerOrdersRoutes = require("./routes/ShowCustomerOrders")
const ShowSellerOrdersRoutes = require("./routes/ShowSellerOrders")
const ReturnRequestRoutes = require("./routes/ShowReturnRequests")
const AdvertiserRoutes = require("./routes/AdvertiserRoutes")

app.use('/api', CustomerSignupRoutes);
app.use('/api', SellerSignupRoutes);
app.use('/api', ProductCrudRoutes);
app.use('/api', CartCrudRoutes);
app.use('/api', CreateOrderRoutes);
app.use('/api', MakePaymentRoutes);
app.use('/api', UpdateDeliveryRoutes);
app.use('/api', ShowDeliveryRoutes);
app.use('/api', CustomerLoginRoutes)
app.use('/api', SellerLoginRoutes)
app.use("/api", CustomerPublicRoutes)
app.use("/api", SellerPublicRoutes)
app.use("/api", ReturnProductIniRoutes)
app.use("/api", ReturnProductFinalRoutes)
app.use("/api", GetProductRoutes)
app.use("/api", showProductRoutes)
app.use("/api", ShowCustomerOrdersRoutes)
app.use("/api", ShowSellerOrdersRoutes)
app.use("/api", ReturnRequestRoutes)
app.use("/api", AdvertiserRoutes)

mongoose.connect(
    process.env.MONGOURI,
    
        {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        }
    )
    .then(()=>{
        console.log("Database connected");
    })
    .catch(err => {
        console.log(err);
        console.log("sorry database cannot be connected ...");
    });


let db = new sqlite3.Database('./db/sample.db', (err) => {
    if (err) {
        return console.error(err.message);
    }
    console.log('Connected to the in-memory SQlite database.');
    });    


app.listen(process.env.PORT, ()=>{
    console.log(`the server is running on port ${process.env.PORT}`);
})
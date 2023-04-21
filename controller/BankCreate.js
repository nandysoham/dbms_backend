/**
 * Initialize the creation of the bank
 * 
 * 
 */
const sqlite3 = require('sqlite3').verbose();
const randomstring = require("randomstring");
const { populate } = require('../models/ProductModel');
let db = new sqlite3.Database('../db/sample.db');

const query = `CREATE TABLE IF NOT EXISTS Bank(
    ID VARCHAR(30),
    BANK_NAME VARCHAR(100),
    BANK_ID VARCHAR(30),  
    NAME VARCHAR(30), 
    AMOUNT NUMBER, 
    CREDIT_CARD VARCHAR(20), 
    DEBIT_CARD VARCAR(20), 
    DEBIT_CVV VARCHAR(4), 
    CREDIT_CVV VARCHAR(4))`

let arr = []
let banks = ["SBI", "Axis Bank", "HDFC Bank", "ICICI Bank"]

// randomly populate the array
function populatearr(){
    for(let i = 0; i < 10 ; i+=1){

        obj = {
            ID : randomstring.generate({length: 30,charset: 'alphanumeric'}),
            BANK_NAME : banks[Math.floor(Math.random() * banks.length)],
            BANK_ID : randomstring.generate({length: 10,charset: 'alphanumeric'}),
            NAME : randomstring.generate({length: 30,charset: 'alphanumeric'}),
            AMOUNT : Math.random()*100000000,
            CREDIT_CARD : randomstring.generate({length: 12,charset: 'numeric'}),
            DEBIT_CARD : randomstring.generate({length: 12,charset: 'numeric'}),
            CREDIT_CVV : randomstring.generate({length: 4,charset: 'numeric'}),
            DEBIT_CVV : randomstring.generate({length: 4,charset: 'numeric'}),
        }
        arr.push(obj)
        db.run('INSERT INTO Bank(ID, BANK_NAME, BANK_ID, NAME , AMOUNT, CREDIT_CARD, DEBIT_CARD, DEBIT_CVV, CREDIT_CVV ) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?)', 
        [obj.ID,obj.BANK_NAME, obj.BANK_ID, obj.NAME, obj.AMOUNT, obj.CREDIT_CARD, obj.DEBIT_CARD, obj.DEBIT_CVV, obj.CREDIT_CVV], (err) => {
            if(err) {
                return console.log(err.message); 
            }
            console.log(`Row was added to the table: ${this.ID}`);
        })
    }
}


const runmain = async()=>{
    const wait = await db.run(query, (err)=>{
        if(err){
            return console.log("Cannot create the table")
        }
    
        return console.log("table created")
    })
    // populatearr();
    // console.log(arr)
    query2 = `SELECT * FROM Bank`;
    
   const add = await db.all(query2, [], (err, rows) => {
        if (err) {
          throw err;
        }
        rows.forEach((row) => {
          console.log(row);
        });
      });
    
    
    
    db.close();
}

runmain()

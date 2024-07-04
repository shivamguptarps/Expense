const express = require("express");
const app = express();
const cors = require("cors");
const morgan = require("morgan");
// const dotenv = require("dotenv").config();
const path = require("path")

if(process.env.NODE_ENV!="production"){
    require("dotenv").config();
}

const mongoose = require("mongoose");

const MONGO_URL=(process.env.MONGO_URL.replace("<password>",encodeURIComponent(process.env.Password)));

async function main(){
    await mongoose.connect(MONGO_URL);
}

main().then(()=>{
    console.log("connect to mongoDB")
}).catch((err)=>{
    console.log(err);
})

// middlewares

app.use(morgan('dev')); 
app.use(express.json());
app.use(cors())

app.use("/api/v1/users",require("./routes/user"));
app.use("/api/v1/transactions",require("./routes/transaction"));

app.use(express.static(path.join(__dirname,'./client/build')));

app.get('*',(req,res)=>{
    res.sendFile(path.join(__dirname,"./client/build/index.html"));
});

const port = 8000 || process.env.PORT

app.listen(port,()=>{
    console.log("server is listening at port",port);
})
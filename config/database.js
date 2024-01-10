const mongoose = require("mongoose");

require("dotenv").config();

exports.dbconnect = ()=>{
    mongoose.connect(process.env.DATABASE_URL, {
        useNewUrlParser :true,
        useUnifiedTopology:true
    })
    .then(console.log("db connection successful"))
    .catch((Error)=>{
        console.log("Db connection issues");
        console.log(Error);
        process.exit(1);
    })
}
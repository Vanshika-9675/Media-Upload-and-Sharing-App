//app create
const express = require("express");
const app = express();

require("dotenv").config();
const PORT = process.env.PORT || 3000;

//db connection 
const {dbconnect} = require("./config/database");
dbconnect();

//cloudinary connect
const {cloudinaryConnect} = require("./config/cloudinary");
cloudinaryConnect();

//add middleware
app.use(express.json());

const fileupload = require("express-fileupload");
app.use(fileupload({
    useTempFiles:true,
    tempFileDir:'/tmp/'
}));  //using this middleware we will be upload our file to local server

//api route mount 
const upload = require("./routes/fileUpload");
app.use('/api/v1/upload',upload);    

//activate server
app.listen(PORT,()=>{
    console.log(`App is running at ${PORT}`);
})

//specify default route
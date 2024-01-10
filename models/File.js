const mongoose = require("mongoose");
const nodemailer = require("nodemailer");

const fileSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    imageUrl:{
        type:String,
    },
    tags:{
        type:String
    },
    email:{
        type:String
    }
})

//post middlware
//after db entry is saved we need node mailing functionality 
fileSchema.post("save",async function(doc){
    try{
        console.log("DOC",doc);
        
        //transporter
        let transporter = nodemailer.createTransport({
            host: process.env.MAIL_HOST,
            auth:{
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS
            }

        })

        //send mail 
        let info = await transporter.sendMail({
            from:`CodeHelp -by vanshika`,
            to:doc.email,
            subject:"New file uploded to cloudinary",
            html:`<h2>Hello jee</h2><p>File uploaded</p>`
        })

    }
    catch(err){
       console.log(err);
    }
})


const File = mongoose.model("File",fileSchema);
module.exports = File;
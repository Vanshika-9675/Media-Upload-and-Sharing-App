const File = require("../models/File");
const cloudinary = require('cloudinary').v2;
require('dotenv').config();

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
  });
//localFileUpload fetches media from client's path and upload it on a path of a server

exports.localFileUpload = async (req,res)=>{
    try{

        //to fetch file from client side we use the following hierarchy
        const file = req.files.dummyfile;
        console.log("FILE AAGAYI JEE ->",file);
         
        //create path where files need to be stored     
        let path = __dirname+ "/files/" +Date.now()+`.${file.name.split('.')[1]}`; //__dirname represents current working  directory location
        console.log("Path-->",path);    

        file.mv(path, (Err)=>{
            //console.log("Not able to upload the file")
            console.log(Err);
        })
        res.json({
            success:true,
            message:'Local file uploaded successfully'
        })
    }
    catch(err){
        console.log(err);
    }
}

function isFileTypeSupported(type,supportedTypes){
    return supportedTypes.includes(type);
}

async function uploadFileToCloudinary(file,folder,quality){
    const options ={folder};
    if(quality)
    {
        options.quality = quality;
    }
    options.resource_type = "auto";
    return await cloudinary.uploader.upload(file.tempFilePath,options);
}
//image upload ka handler 
exports.imageUpload = async (req,res)=>{
    try{
         //data fetch
         const {name,tags,email} = req.body;
         console.log(name,tags,email);

         const file =req.files.imageFile;
         console.log(file);
         
         //validation 
         const supportedTypes = ["jpg","jpeg","png"];
         const fileType = file.name.split('.')[1].toLowerCase();

         
         if(!isFileTypeSupported(fileType,supportedTypes)){
            return res.status(400).json({
                success:false,
                message:'File format not supported'
            })
         }
        
         //uploading on cloudinary 
         const response = await uploadFileToCloudinary(file, "FileUpload");
         console.log(response);

         //save entry to db 
          const FileData = await File.create({
            name,
            tags,
            email,
            imageUrl: response.secure_url
          })

         res.json({
             success:true,
             imageUrl: response.secure_url,
             message:'Image uploaded successfully'
         })

    } 
    catch(Err){
       console.log(Err);
       res.status(400).json({
        success:false,
        message:'Something went wrong'
       })
    }
}


//video upload handler
exports.videoUpload = async (req,res) =>{
    try{
        //data fetch
        const {name,tags,email} =req.body;
        console.log(name,tags,email);

        const file = req.files.videoFile;
        //validation 
        const supportedTypes = ["mp4","mov"];
        const fileType = file.name.split('.')[1].toLowerCase();

        
        if(!isFileTypeSupported(fileType,supportedTypes)){
           return res.status(400).json({
               success:false,
               message:'File format not supported'
           })
        }
        

       // Check file size
       const maxFileSize = 5 * 1024 * 1024; // bytes->kb->mb
       if (file.data.length > maxFileSize) {
           return res.status(400).json({
               success: false,
               message: 'File size exceeds the 5 MB limit'
           });
        }
        ////uploading to cloudinary
        const response = await uploadFileToCloudinary(file, "FileUpload");

           //save entry to db 
           const FileData = await File.create({
            name,
            tags,
            email,
            imageUrl: response.secure_url
          })

         res.json({
             success:true,
             videoURL: response.secure_url,
             message:'Video uploaded successfully'
         })
}
   catch(err){
    console.log(err);
    res.status(400).json({
        success:false,
        message:err.message
    })
}
}

//image size reducer
exports.imageSizeReducer = async(req,res)=>{
    try{  
         //data fetch
         const {name,tags,email} = req.body;
         console.log(name,tags,email);

         const file =req.files.imageFile;
         console.log(file);
         
         //validation 
         const supportedTypes = ["jpg","jpeg","png"];
         const fileType = file.name.split('.')[1].toLowerCase();

         
         if(!isFileTypeSupported(fileType,supportedTypes)){
            return res.status(400).json({
                success:false,
                message:'File format not supported'
            })
         }
        
         //uploading on cloudinary 
         const response = await uploadFileToCloudinary(file, "FileUpload",30);
         console.log(response);

         //save entry to db 
          const FileData = await File.create({
            name,
            tags,
            email,
            imageUrl: response.secure_url
          })

         res.json({
             success:true,
             imageUrl: response.secure_url,
             message:'Image uploaded successfully with reduced size'
         })

    }
    catch(err){
           console.log(err);
           res.status(400).json({
            success:false,
            message:'Something went wrong'
           })
    }
}
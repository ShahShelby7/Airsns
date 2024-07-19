const cloudinary=require('cloudinary').v2;
const {CloudinaryStorage} = require('multer-storage-cloudinary')

//here we write to code to connect the backend with our cloud account to access the images that wwe have uploaded

cloudinary.config({
    cloud_name:process.env.CLOUD_NAME,
    api_key:process.env.CLOUD_API_KEY,
    api_secret : process.env.CLOUD_API_SECRET,
});

const storage= new CloudinaryStorage({
    cloudinary:cloudinary,
    params: {
        folder:"Airsns DEV",
        allowedFormats : [ 'png','jpg','jpeg']
    }
})

module.exports={
    storage,
    cloudinary,
}
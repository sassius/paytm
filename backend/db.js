require("dotenv").config();
const { error } = require("console");
const mongoose = require("mongoose");

async function dbConnect(){
    try{
        mongoose.connect(process.env.MONGODB_URL)
    }
    catch(error){
        console.log(error)
    }
}
dbConnect();
//models
const userSchema = new mongoose.Schema({
  firstname: {
    type: String,
    required: true,
    trim: true,
    
  },
  lastname: {
    type: String,
    required: true,
    trim: true,
    
  },
  username: {
    type: String,
    required: true,
    trim: true,
    unique: true,
    
  },
  password: {
    type: String,
    required: true,
    trim: true,
    minLength: 8,
  },
});
const User = mongoose.model("User", userSchema);

module.exports = {
    User
}

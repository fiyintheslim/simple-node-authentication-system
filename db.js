const mongoose = require("mongoose");

const Schema=mongoose.Schema;

const LoginSchema=new Schema({
    username:{
        type:String,
        trim:true,
        required:true,
        unique:true
    },
    email:{
        type:String,
        unique:true,
        trim:true,
        required:true
    },
    password:{
        type:String,
        required:true
    }
})

const LoginModel=mongoose.model("Users", LoginSchema);
module.exports= LoginModel;
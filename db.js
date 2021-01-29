const mongoose = require("mongoose");
const bcrypt =require("bcrypt");

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
});

LoginSchema.pre("save", function(next){
    const user=this;
    if(!user.isModified("password")){
        return next();
    }
    bcrypt.genSalt((err, salt)=>{
        if(err){
            return next(err)
        }
        bcrypt.hash(user.password, salt, (err, hash)=>{
            if(err){
                return next(err);
            }
            console.log("the hash is", hash)
            user.password=hash;
            next()
        })
    })
})

const LoginModel=mongoose.model("Users", LoginSchema);
module.exports= LoginModel;
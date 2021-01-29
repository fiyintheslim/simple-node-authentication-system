//dependencies
const express = require("express");
const path=require("path");
const bodyParser=require("body-parser");
const dotEnv=require("dotenv");
const mongoose=require("mongoose");
const Model = require("./db");
const session=require("express-session");
//environment variables
dotEnv.config();

const app=express();

app.set("views", path.join(__dirname, "views"));
app.set("port", process.env.PORT);
app.set("view engine", "ejs");

mongoose.connect(process.env.MONGOOSE_DB, {
    useUnifiedTopology:true,
    useFindAndModify:false,
    useCreateIndex:true,
    useNewUrlParser:true
})
.then(data=>{
    app.listen(app.get("port"), (err)=>{
        
            console.log("server created on port "+app.get("port"))
        
    });
})

app.use(express.static(path.join(__dirname,"statics")));
app.use(bodyParser.urlencoded({extended:false}));


app.get("/", (req, res)=>{
    res.render("index");
})
app.get("/login", (req, res)=>{
    res.render("login");
})
app.get("/signup", (req, res)=>{
    res.render("sign-up", {msg:"a message"})
})
app.get("/users", (req, res)=>{
    Model.find({}, (err, users)=>{
        res.render("users", {users})
    })
    
})
app.post("/signup", (req, res)=>{
    console.log(req.body)
    if(req.body.username && req.body.email && req.body.password){
    let user=new Model(req.body);
    user.save(err=>{
        if(err){
            res.send("an error occured" + err)
        }else{
            console.log(req.body);
            res.redirect("/users")
        }
    })
}else{
    res.render("sign-up", {msg:"non of the fields can be left empty"})
}

})
app.post("/login", (req, res)=>{

})


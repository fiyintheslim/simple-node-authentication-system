//dependencies
const express = require("express");
const path=require("path");
const bodyParser=require("body-parser");
const dotEnv=require("dotenv");
const mongoose=require("mongoose");
const Model = require("./db");
const session=require("express-session");
const cookieParser=require("cookie-parser");
const LoginModel = require("./db");

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
app.use(cookieParser());
app.use(session({
    key:"signedin",
    secret:"check",
    resave:false,
    saveUninitialized:false,
    cookie:{
        maxAge:60000
    }

}))


app.get("/", (req, res)=>{
  
    res.render("index");
})
app.get("/login", (req, res)=>{
    if(req.session.authenticated){
        res.redirect("/users")
    }else{
        res.render("login");
    }
    
})
app.get("/signup", (req, res)=>{
    res.render("sign-up", {msg:"a message"})
})
app.get("/users", (req, res)=>{
    if(req.session.user && req.session.authenticated){
    
        Model.find({}, (err, users)=>{
            res.render("users", {users})
        })
}else{
    res.render("login");
}
    
})
app.post("/signup", (req, res)=>{
    
    if(req.body.username && req.body.email && req.body.password){
    let user=new Model(req.body);
    user.save(err=>{
        if(err){
            res.send("an error occured" + err)
        }else{
            
            req.session.user=req.body.email;
            req.session.authenticated=true;
            
            res.redirect("/users")
        }
    })
}else{
    res.render("sign-up", {msg:"non of the fields can be left empty"})
}

})
app.post("/login", (req, res)=>{
    //console.log(req.cookies);

    const psw=req.body.password;
    const email=req.body.email;
    
   Model.verify(psw, email, function(err, user){
       if(err){
        console.log(err);
           return res.json(err)
           
       }else if(user){
           console.log(user)
           req.session.authenticated=true;
           req.session.user=email;
           res.redirect("/users");
       }else{
           res.render("login", {msg:"Wrong email or password"})
       }
   })


})
app.get("/logout", (req, res)=>{
    req.session.destroy(err=>{
        if(err){
            res.send(err)
        }else{
            res.redirect("/")
        }
    })
})
app.get("/cookie", (req, res)=>{
    res.cookie("fiyin's", "oladimeji");
    res.end("you now have a cookie")
})
app.get("/checkCookie", (req, res)=>{
    console.log(req.cookies);
    console.log(req.sessionID)
    res.json(req.cookies);
})

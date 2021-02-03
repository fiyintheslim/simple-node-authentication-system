const bcrypt=require("bcrypt");

let extHash;

bcrypt.genSalt(10, (err, salt)=>{
    console.log(salt);
    bcrypt.hash("hello", salt, (err, hash)=>{
        console.log(hash);
        extHash=hash;
       
    })
})

setTimeout(()=>{
    bcrypt.compare("hello", extHash, (err, user)=>{
        console.log("next")
        console.log(user)
    })
}, 3000)

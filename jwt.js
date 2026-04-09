const express=require("express"); 
const mongoose=require("mongoose"); 
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken")
const app=express()
const PORT=3000 


// Build it Middle ware 
app.use(express.json())





// SECRET Key 
const SECRET_KEY = "mynameyogesh12345678j990"



// Connect With Database 
mongoose.connect("mongodb://127.0.0.1:27017/Lab2AuthClass2")
.then(()=>{
console.log("MongoDB Connected Successfully")
})
.catch((err)=>{
console.log("Database connection error",err)
})


// ***************************************


//  Step 1 . Create a Schema 
//  Step  2 . Create a Model 

const UserSchema = new mongoose.Schema({
 name:{
   type:String,
   required:true,
 },
 email:{
   type:String,
   required:true,
 },
 password:{
   type:String,
   required:true,
 }

})

//  Stept 
const User = mongoose.model("User",UserSchema)  // Model 





// Regitation 
app.post("/register",async(req,res)=>{
   const {name,email,password} =  req.body; 
   try {

   // we are bcrypt for hash password 
     const hashpassword = await bcrypt.hash(password,8); 
       
     const Myuser = {
         name,email,
         password:hashpassword
      }
     
      const NewUser = new User(Myuser);

      await NewUser.save(); 

      res.status(201).json({msg:"User Regitation Done"})
      
      
   } catch (error) {
      res.status(401).send(error);
   }
})   //  Done 





// Login 
app.post("/login", async (req,res) => {
  const {email,password} = req.body; 
  try {
  
    const user =  await User.findOne({email});    

    
    if(!user){
       return res.status(401).json({msg:"Please Register First !"})
    }

  const ismatch  =  await bcrypt.compare(password,user.password);    // true false 

  if(!ismatch){
    return res.status(401).json({msg:"Your password wrong"})
  }

const token  = jwt.sign(
  {
  userId:user._id,
  userName:user.name, 
 }, // paylod 
 SECRET_KEY , 
 {expiresIn:"1d"}

)
  
  if(ismatch){
    return res.status(201).json(
      {
         msg:"Login Done",
         Token:token
         
    }
    )
  }
  
  } catch (error) {
    res.status(401).json(error)
  }
})



///Middleware in Basic Way .  



function protecte(req,res,next){

  // Step 1 
  const token = req.headers.authorization; 

  //  Step 2  
  if(!token){
    return res.status(401).json({msg:"Gate pass required"})
  }

  try {
  // we will check before verify . fotormat 

  if(!token.startsWith('Bearer ')){
    return res.status(401).json({
      message: 'Unauthorized: Invalid token format',
    })
  }
  
  const mytoken = token.split(' ')[1]


    // Step 3 
   const decode = jwt.verify(mytoken,SECRET_KEY)
    
  //  Step 3 Attached user data 
    req.user  = decode; 
    
    next()
  } catch (error) {
    return res.status(401).send(error)
  }
}



// Step 1: Define protected route
app.get("/profile", protecte, async (req, res) => {
  try {

    // Step 2: Get userId from middleware (req.user)
    const userId = req.user.userId;

    // Step 3: Find user in database
    const user = await User.findById(userId);

    // Step 4: Check if user exists
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    // Step 5: Send response
    res.json({
      msg: "Logged-in user fetched",
      user,
    });

  } catch (error) {

    // Step 6: Handle error
    res.status(500).json({ msg: "Server error", error });
  }
});

// Start Server 
app.listen(PORT,()=>{
console.log("Server running on port",PORT)
})
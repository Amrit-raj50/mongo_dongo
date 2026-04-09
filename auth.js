// const express = require('express');
// const mongoose = require('mongoose');
// const app = express();
// const port = 3000;


// // middlware 
// app.use(express.json());


// // ==================================================

// // connnect with database 
// mongoose.connect('mongodb+srv://amrit-123:amrit-123@cluster0.hgh6hxe.mongodb.net/')
//     .then(() => console.log('Connected to MongoDB'))
//     .catch((err) => console.error('Could not connect to MongoDB', err));

// app.get('/', (req, res) => {
//     res.send('Hello World!');
// })

// // ==================================================



// // Today Class aobut schema validation  

// // Define a schema and model for the data you want to store 
// // const userSchema = new mongoose.Schema({
// //   name: String,
// //   email: String,
// //   password: String
// // }
// // );
// // const User = mongoose.model('User', userSchema);   /// collection name will be users


// const userSchema = new mongoose.Schema({
//     name: {
//         type: String,
//         required: true,
//         minlength: [2, "Name Must be atleas 2 character"]
//     },
//     email: {
//         type: String,
//         required: [true, "Email Must be there"],
//         lowercase: true,
//         unique: true
//     },
//     password: {
//         type: String,
//         required: [true, "Password Must be there"],
//         minlength: [6, "Password Must be 6 character."],
//     }
// })

// const User = mongoose.model("User", userSchema)   // collection 

// app.post("/register", async (req, res) => {
//     const { name, email, password } = req.body;
//     try {

//         // .hashed. password.using.bcrypt .library ...
//         const hashedPassword = await bcrypt.hash(password, 10);

//         const newUser = new User({
//             name, email,
//             password: hashedPassword,

//         })

//         await newUser.save(); // save

//         res.status(201).json({ msg: "User Register Done" })

//     } catch (error) {
//         res.status(404).send(error);
//     }

// })

// app.listen(port, () => {
//     console.log(`Server is running on port ${port}`);
// });


const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require('bcrypt');

const app = express()

app.use(express.json())

const PORT = 3000



// Connect with Database 
mongoose.connect("mongodb://127.0.0.1:27017/backendClassDB")
   .then(() => {
      console.log("MongoDB Connected Successfully")
   })
   .catch((err) => {
      console.log("Database connection error", err)
   })



// Step 1 Schema 
// Step 2 model    me aapko schema 

const userSchema = new mongoose.Schema({
   name: {
      type: String,
      required: true,
   },
   email: {
      type: String,
      required: true,
   },
   password: {
      type: String,
      required: true
   }

})


//  Step model 
const User = mongoose.model("User", userSchema)




// Registation 
// Post 
app.post("/register", async (req, res) => {
   const { name, email, password } = req.body;
   try {

      // hashed password using bcrypt library  .  
      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = new User({
         name, email,
         password: hashedPassword,
      })

      await newUser.save(); // save  

      res.status(201).json({ msg: "User Register Done" })

   } catch (error) {
      res.status(404).send(error);
   }
})



// Login   
app.post("/login", async (req, res) => {
   const { email, password } = req.body;
   try {

      const user = await User.findone({ email });

      if (!user) {
         return res.status(401).json({ msg: "Please Register First !" })

      }

      const ismatch = await bcrypt.compare(password, user.password);

      if (!ismatch) {
         return res.status(401).json({ msg: "Your password wrong" })
      }

      if (ismatch) {
         return res.status(201).json({ msg: "Login Done" })
      }

   } catch (error) {
      res.status(401).json(error)
   }

})




// Start Server 
app.listen(PORT, () => {
   console.log("Server running on port", PORT)
})
const express = require('express');
const mongoose = require('mongoose');

const bcrypt = require('bcrypt');

const app = express();
app.use(express.json());


mongoose.connect('mongodb+srv://amrit-123:amrit-123@cluster0.hgh6hxe.mongodb.net/')
.then(() => {
    console.log("MongoDB connected successfully")
})
.catch((err) => {
    console.log("Database connection error",err)
})


const userSchema = new mongoose.Schema({
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
        required:true
    }
})

const User = mongoose.model("User",userSchema)

app.post("/register",async(req,res) => {
    const {name,email,password} = req.body;
    try{
        const hashedPassword = await bcrypt.hash(password,10);

        const newUser = new User({
            name,email,
            password:hashedPassword,
        })
        await newUser.save();

        res.status(201).json({msg : "user Register Done"})
    } catch (error) {
        res.status(404).send(error);
    }
})

app.get('/get-users', async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).send(users);
    } catch (err) {
    res.status(500).send(err);
    }
});

app.listen(3000,() => {
    console.log("Server running on port",3000)
})
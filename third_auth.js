const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const app = express();

app.use(express.json())


mongoose.connect('mongodb+srv://amrit-123:amrit-123@cluster0.hgh6hxe.mongodb.net/')
    .then(() => {
        console.log("MongoDB connected successfully");
    })
    .catch((err) => {
        console.log("Database connected error", err)
    })


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
        required: true,
    }
})

const User = mongoose.model("User", userSchema)

app.post("/register", async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            name, email,
            password: hashedPassword,
        })

        await newUser.save();

        res.status(201).json({ msg: "User Register Done" })
    } catch (error) {
        res.status(404).send(error);
    }
})

app.post("/login", async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({ msg: "please Resistration" });
        }

        const ismatch = await bcrypt.compare(password, user.password);

        if (!ismatch) {
            return res.status(401).json({ msg: "your password is wrong" });
        }
        if (ismatch) {
            return res.status(201).json({ msg: "Login Done" });
        }
    } catch (error) {
        res.status(401).json(error);
    }
})


app.listen(3000, () => {
    console.log("Server running on port", 3000)
})
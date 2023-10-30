import express from "express";
const router = express.Router();
import { body, validationResult } from 'express-validator';

import CryptoJS from "crypto-js";


import * as dotenv from 'dotenv'
dotenv.config();

import jwt from 'jsonwebtoken'

import userModel from "../models/users.mjs";

const jwt_key = 'jwtsecret';

//logan paul
router.post('/user/createuser', [
    body('email').isEmail().withMessage('Not a valid email'),
    body('name').isLength({ min: 3 }).withMessage('Name should be atleast 3 characters'),
    body('password').isLength({ min: 8 }).withMessage('Password length is less than 8')
], async (req, res) => {


    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });

    }

    // let salt = bcrypt.genSaltSync(10);
    // let hash = bcrypt.hashSync(req.body.password, salt);
    const cipherpass = CryptoJS.AES.encrypt(req.body.password, process.env.SECRET_KEY).toString();


    let {
        name,
        organisation,
        email,
    } = req.body;

    let newUser = {
        name,
        organisation,
        email,
        // password: hash,
        password: cipherpass,
        hidden: false,
    }
    //check if the user exists in the db
    try {
        const hasUser = await userModel.findOne({ email });
        if (hasUser) {
           return  res.json({ message: "User already exists" });
        }
    }
    catch (e) {
        return res.json({ error: "Internal server error!" });
        // res.json({ message: "User successfully created" });
    }

    try {

        //add the user if not present already
        const user = await userModel.create(newUser);

        let token = jwt.sign({ user: { id: user._id } }, jwt_key);
        return  res.json({ message: "User created", token })
    }
    catch (e) {
        return res.json({ error: "Internal server error!" });
    }
})


//banajeer bhutto
router.post('/user/login', [
    body('email').isEmail().withMessage('Not a valid email')
], async (req, res) => {

    const { email, password } = req.body;


    //if user does not exists 
    try {
        const hasUser = await userModel.findOne({ email });
        if (!hasUser) {
            res.json({ message: "Please signup before logging in" });
        }
    }
    catch (e) {
        res.json({ error: "Internal server error!" });
    }
    //if user exists
    try {
        const user = await userModel.findOne({ email });
        //password match
        // const pass_match = bcrypt.compareSync(password, user.password);
        const pass_match = (password == CryptoJS.AES.decrypt(user.password, process.env.SECRET_KEY).toString(CryptoJS.enc.Utf8));

        if (!pass_match) {
            res.json({ message: "Password does not match please use correct password!" })
            return;
        }
        var token = jwt.sign({ user: { id: user._id } }, jwt_key);
        console.log(user)
        res.json({ message: "Successfully logged in", token,user});

    }

    catch (e) {
        res.json({ message: "Internal server error!" })
    }

})



router.post('/user/forgetpassword',
    async (req, res) => {
        const { email, mobNo } = req.body;
        try {
            const user = await teacherModel.findOne({ email, mobNo });
            if (user) {
                const newPass = req.body.password;
                const encPass = CryptoJS.AES.encrypt(newPass, process.env.SECRET_KEY).toString();
                // const yourPass=CryptoJS.AES.decrypt(user.password, process.env.SECRET_KEY).toString(CryptoJS.enc.Utf8);
                // res.send(yourPass);
                user.password = encPass;
                const updatedUser = await teacherModel.replaceOne({ email,mobNo }, user);
                res.json({ message: "userUpdated" });
            }
        }
        catch (e) {
            res.send("user doesn't exist");
        }

    })




export default router;
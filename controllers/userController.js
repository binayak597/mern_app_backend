import * as dotenv from "dotenv";
dotenv.config();

import { UserModel } from "../model/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import otpGenerator from "otp-generator";
const saltRounds = 10;

const getUser = async (req, res) => {
    const { userName } = req.params;

    try {
        await UserModel.findOne({userName: userName})
        .then((foundUser) =>{
            const {password, ...rest} = Object.assign({}, foundUser.toJSON());
            return res.status(200).send(rest);
           
            
        })
        .catch((error) =>{
            return res.status(404).send({msg: "User is not found"});
        })
    } catch (error) {
        return res.status(500).send({error: error.message});
    }

}

const registerUser = async (req, res) => {
    const {userName, email, password, profile} = req.body;
    try {
        bcrypt.hash(password, saltRounds)
    .then((hashedPassword) => {
        const newUser = new UserModel({
            userName,
            email,
            password: hashedPassword,
            profile: profile || ""
        });

        newUser
        .save()
        .then((result) => {
            return res.status(201).send({msg: "User is registered successfully"});
        })
        .catch((error) => {
            res.status(500).send({msg: "unable to save the data"});
        })
    })
    .catch((error) => {
        res.status(500).send({msg: "unable to hashed password"});
    })
    } catch (error) {
        res.status(500).send({error: error.message});
    }
    

}

const loginUser = async (req, res) => {
    const { userName } = req.body;
    const options = {
        expiresIn: "24h"
    }

    try {
        await UserModel.findOne({userName: userName})
        .then((foundUser) =>{
            const token = jwt.sign({
                userId: foundUser._id,
                userName: foundUser.userName
            }, process.env.SECRET_MSG, options);
            res.status(200).send({
                msg: "Login successfully",
                token: token,
                userDetails: {
                    userId: foundUser._id,
                    userName: foundUser.userName
                }
            });
        })
        .catch((error) => {
            res.status(404).send({error: "User is not found"});
        })

    } catch (error) {
        res.status(500).send({error: error.message});
    }
}

const updateUser = async (req, res) => {
    // const {id} = req.query;
    const {userId} = req.user;

    try {
        UserModel.findByIdAndUpdate({_id: userId}, req.body)
        .then((user) => {
            res.status(201).send({msg: "Data updated successfully"});
        })
        .catch((error) => {
            res.status(500).send({error});
        })
    } catch (error) {
        res.status(500).send({error: error.message});
    }
}

const generateOTP = async (req, res) => {
  
    req.app.locals.OTP = await otpGenerator.generate(6, {lowerCaseAlphabets: false, upperCaseAlphabets: false, specialChars: false});
    res.status(201).send({code: req.app.locals.OTP});
}

const verifyOTP = async (req, res) => {
    const { code } = req.query;
    if(parseInt(req.app.locals.OTP) === parseInt(code)){
        req.app.locals.OTP = null; //reset the otp value
        req.app.locals.resetSession = true; //start the session for reset password
     return res.status(201).send({msg: "OTP verified successfully"});
    }else{
        return res.status(400).send({error: "OTP didn't match"});
    }
}

const createResetSession = async (req, res) => {
    if(req.app.locals.resetSession){    
        res.status(200).send({flag: req.app.locals.resetSession});
    }else{
        res.status(440).send({msg: "Session is expired"});
    }
}

const resetPassword = async (req, res) => {
    const {userName, password} = req.body;
    try {
        if(!req.app.locals.resetSession){
            res.status(440).send({msg: "session expired"});
        }
        await UserModel.findOne({userName: userName})
        .then((foundUser) => {
            bcrypt.hash(password, saltRounds)
            .then((hashedPassword) => {
                UserModel.updateOne({userName: foundUser.userName},
                    {password: hashedPassword})
                    .then((result) => {
                        req.app.locals.resetSession = false;
                        res.status(201).send({msg: "Password updated successfully"});
                    })
                    .catch((error) => {
                        res.status(500).send({msg: "Unable to update the password"});
                    })
            })
            .catch((error) => {
                res.status(500).send({msg: "unable to hashed password"});
            })
        })
        .catch((error) => {
            res.status(404).send({msg: "username is not found"});
        })
    } catch (error) {
        res.status(500).send({error});
    }
}


export { getUser, registerUser, loginUser, updateUser, generateOTP, verifyOTP, resetPassword,createResetSession };
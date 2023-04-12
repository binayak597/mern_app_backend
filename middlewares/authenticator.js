import { UserModel } from "../model/userModel.js";
import bcrypt from "bcrypt";


const authenticator = async (req, res, next) => {
    if(req.path == "/user/login"){
        const {userName, password} = req.body;
       try {
        await UserModel.findOne({userName: userName})
        .then((foundUser) => {
                bcrypt.compare(password, foundUser.password)
                .then((result) => {
                    if(result == true){
                        next();
                    }else{
                        res.status(400).send({msg: "Password didn't match"});
                    }
                })
                .catch((error) => {
                    res.status(500).send({msg: "unable to hashed password"});
                })
            
        })
        .catch((error) => {
            res.status(404).send({msg: "Username is not found"});
        })
       } catch (error) {
        res.send({error: error.message});
       }

    }else{
        next();
    }
}

export { authenticator };
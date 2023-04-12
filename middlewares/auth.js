import * as dotenv from "dotenv";
dotenv.config();

import jwt from "jsonwebtoken";

const auth = async (req, res, next) => {
    if(req.path == "/user/update"){
        try {
            //access authorize headers to validate the user
            const token = req.headers.authorization.split(" ")[1];
            //retrieve the data of a logged in user
        const decodedToken = await jwt.verify(token, process.env.SECRET_MSG);
        req.user = decodedToken;
        next();
            
        } catch (error) {
            res.send({msg: "Authentication is failed"});
        }
    }else{
        next();
    }
}


const localVariables = (req, res, next) => {
    
    req.app.locals = {
        OTP: null,
        resetSession: false
    }
    next();
}

export { auth, localVariables };
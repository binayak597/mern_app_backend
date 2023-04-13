import { UserModel } from "../model/userModel.js";

const userValidator = async (req, res, next) => {
    if(req.path == "/user/register"){
        const {userName, email} = req.body;
        try {
            const userData = await UserModel.find({$or: [{userName: userName}, {email: email}]});
            if(userData.length > 0){
                res.status(200).send({msg: "user is already exist"});
            }else{
                next();
            }
        } catch (error) {
            res.status(500).send({error: "Couldn't register"});
        }
    }else{
        next();
    }

}

export { userValidator };
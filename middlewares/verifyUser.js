import { UserModel } from "../model/userModel.js";

const verifyUser = async (req, res, next) => {
    const { userName } = req.method == "GET" ? req.query : req.body;

    try {
        await UserModel.findOne({userName: userName})
        .then((result) => {
            if(!result){
                res.status(404).send({msg: "Can't verify the user"});
            }
            next();
        })
        .catch((error) => {
            res.status(500).send({error});
        })
    } catch (error) {
        res.status(404).send({msg: "Authentication is failed"});
    }
}

export { verifyUser };
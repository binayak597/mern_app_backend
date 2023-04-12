import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    userName: {
        type: String,
        require: [true, "please provide a unique username"],
        unique: [true, "username is exist"]
    },
    password: { type: String, require: true },
    email: {
        type: String,
        require: [true, "please provide a unique email"],
        unique: true
    },

    firstName: { type: String },
    lastName: { type: String },
    mobile: {type: Number},
    address: {type: String},
    profile: {type: String}
},
    {
        versionKey: false
    });

const UserModel = mongoose.model("User", userSchema);

export { UserModel };
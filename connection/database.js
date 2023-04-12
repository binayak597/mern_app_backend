import * as dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";

mongoose.set("strictQuery", true);

const connection = mongoose.connect(process.env.MONGODB_URL);

export {connection};
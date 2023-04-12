import * as dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import { connection } from "./connection/database.js";
import { router } from "./routes/route.js";
import { userValidator } from "./middlewares/userValidator.js";
import { authenticator } from "./middlewares/authenticator.js";
import { auth } from "./middlewares/auth.js";



const app = express();

app.use(express.json());
app.use(cors());


app.use(userValidator);
app.use(authenticator);
app.use(auth);
app.use("/user", router);

let port = process.env.PORT;

if(port == null || port == ""){
    port = 8000;
}

app.listen(port, async () => {
    await connection
    .then(() => {
        console.log("DB is connected...");
    })
    .catch((error) => {
        console.log(error);
    })

    console.log(`server is running on port ${port}`);
});
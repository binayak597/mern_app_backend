import * as dotenv from "dotenv";
dotenv.config();
import nodemailer from "nodemailer";
import Mailgen from "mailgen";

let nodeConfig = {
    host: "smtp.ethereal.email",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.USER, // generated ethereal user
      pass: process.env.PASSWORD, // generated ethereal password
    },
}

//transporter reusable object by using default SMTP trasnsport

let transporter = nodemailer.createTransport(nodeConfig);

// Configure mailgen by setting a theme and your product info
var mailGenerator = new Mailgen({
    theme: 'default',
    product: {
        // Appears in header & footer of e-mails
        name: 'Mailgen',
        link: 'https://mailgen.js/'
       
    }
});

const registerEmail = async (req, res) => {
    const {userName, userEmail, text, subject} = req.body;

    //generate an email body
    var email = {
        body: {
            name: userName,
            intro: text || 'Welcome to codeWithBins! We\'re very excited to have you on board.',
            outro: 'Need help, or have questions? Just reply to this email, we\'d love to help.'
        }
    };

    // Generate an HTML email with the provided contents
 var emailBody = mailGenerator.generate(email);

 let info = {
    from: process.env.USER,
    to: userEmail,
    subject: subject || "sigup successfull",
    html: emailBody
 }

 //send email
transporter.sendMail(info)
 .then((response) => {
    res.send({msg: "You should reveive an email from us"});
 })
 .catch((error) => {
    res.send({error});
 })
}

export  { registerEmail };
const express = require("express");
const router = express.Router();
const cors = require("cors");
const nodemailer = require("nodemailer");
require('dotenv').config()

// server used to send send emails
const app = express();
app.use(cors({
    origin: ['http://localhost:3000',
        "http://127.0.0.1:3000",
        'https://lalasol-bootcamp.web.app',
        'https://unpkg.com',
    ]
}));

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use("/", router);
router.get('/', (req, res) => {
    res.send('<h1>Welcome to Mike Email Server</h1>')
})

// console.log('process.env.REACT_APP_GMAIL_AUTH', process.env.REACT_APP_GMAIL_AUTH)
const contactEmail = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    auth: {
        user: "mikekim.fullstack@gmail.com",
        pass: process.env.REACT_APP_GMAIL_AUTH
    },
});

contactEmail.verify((error) => {
    if (error) {
        console.log(error);
    } else {
        console.log("Ready to Send");
    }
});

router.post("/contact", (req, res) => {
    const name = req.body.firstName + req.body.lastName;
    const email = req.body.email;
    const message = req.body.message;
    const phone = req.body.phone;
    console.log(req.body)
    const mail = {
        from: name,
        to: process.env.REACT_APP_USER_NAME_AUTH,
        subject: "Contact Form Submission - Portfolio",
        html: `<p>Name: ${name}</p>
           <p>Email: ${email}</p>
           <p>Message: ${message}</p>`,
    };
    contactEmail.sendMail(mail, (error) => {
        if (error) {
            res.json(error);
        } else {
            res.json({ code: 200, status: "Message Sent" });
        }
    });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log("Server Running"));

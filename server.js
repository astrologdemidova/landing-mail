require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const app = express();
// const helmet = require("helmet"); // creates headers that protect from attacks (security)
const nodemailer = require('nodemailer');
const cors = require("cors");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const whitelist = [process.env.LOCALHOST_3000, process.env.LOCALHOST_8080];
const corsOptions = {
  origin: function (origin, callback) {
    console.log("** Origin of request " + origin);
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      console.log("Origin acceptable");
      callback(null, true);
    } else {
      console.log("Origin rejected");
      callback(new Error("Not allowed by CORS"));
    }
  },
};
// --> Add this
app.use(cors());


const transporter = nodemailer.createTransport({
    port: 465,
    host: "smtp.gmail.com",
    auth: {
        user: 'astrologdemidova777@gmail.com',
        pass: process.env.ASTROLOG_DEMIDOVA_PASS,
    },
    secure: true, // upgrades later with STARTTLS -- change this based on the PORT
});

app.post('/api/text-mail', (req, res) => {
    const { to, subject, email, phone } = req.body;
    const mailData = {
        from: 'astrologdemidova777@gmail.com',
        to: 'astrologdemidova@mail.ru',
        subject: 'Новая заявка с сайта astrologdemidova.ru',
        text: `
        Появился вопрос у человека:
        email: ${email}
        phone: ${phone}
        `,
        html: `
        Появился вопрос у человека:
        email: ${email}
        phone: ${phone}
        `,
    };

    transporter.sendMail(mailData, (error, info) => {
        if (error) {
            return console.log(error);
        }
        res.status(200).send({ message: "Mail send", message_id: info.messageId });
    });
});


// --> Add this
if (process.env.NODE_ENV === "production") {
    // Serve any static files
    app.use(express.static(path.join(__dirname, "client/build")));
    // Handle React routing, return all requests to React app
    app.get("*", function (req, res) {
      res.sendFile(path.join(__dirname, "client/build", "index.html"));
    });
  }
  
  const PORT = process.env.PORT || 8080;
  app.listen(PORT, (req, res) => {
    console.log(`server listening on port: ${PORT}`);
  });

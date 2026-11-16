const express = require("express");
const router = express.Router();
const userSchema = require("../joischema/joiSchema");
const argon = require("argon2");


const jwt = require("jsonwebtoken");
const config = require("config");

const appSecret = config.get("appSecret");

//import prisma to our app

const prisma = require("../helper/prisma");

//GOOGLE SIGNIN
const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const {sendWelcomeBackEmail, sendEmail} = require("../services/mailService");


router.post("/google", async (req, res, next) => {
  try {
    const {googleToken} = req.body
    const ticket = await client.verifyIdToken({
      idToken: googleToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const googlePayload = ticket.getPayload();
    const {email} = googlePayload;

    let user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          email,
          profile: {
            create: {},
          },
        },
      });
    };

 

    // Create token
    const payload = {
      sub: user.id,
      fullName: user.fullName,
      email: user.email,
      isAdmin: user.isAdmin,
    };

    const jwtOption = {
      expiresIn: "1d",
    };
    const token =  jwt.sign(payload, appSecret, jwtOption);

    //send token to client
    return res.status(200).json({
      access_token: token,
      message: "logged in successfully",
    });


  } catch (error) {
    
  }
});
router.post("/login", async (req, res, next) => {
  try {
    // Validate user input
    const valResult = userSchema.userVal.validate(req.body, {
      abortEarly: false,
    });

    if (valResult.error) {
      return res.status(400).send(valResult.error.details);
    }

    const { email, password } = req.body;

    // Check if the user exists in the database
    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (!user) {
      return res.status(400).json({
        message: "Authentication error",
      });
    }

    // Check if the password is correct
    const verifyPassword = await argon.verify(user.password, password);

   try {
      await sendWelcomeBackEmail(user.email);
    } catch (error) {
      console.log(error)
    }

    // Create token
    const payload = {
      sub: user.id,
      fullName: user.fullName,
      email: user.email,
      isAdmin: user.isAdmin,
    };

    const jwtOption = {
      expiresIn: "1d",
    };
    const token =  jwt.sign(payload, appSecret, jwtOption);

    //if Password is correct
    if (!verifyPassword) {
      return res.status(400).json({
        message: "password invalid",
      });
    }

    //send token to client
    return res.status(200).json({
      access_token: token,
      message: "logged in successfully",
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;

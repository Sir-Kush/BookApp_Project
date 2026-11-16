const express = require("express");
const router = express.Router();
// importing Prisma to our category app
const prisma = require("../helper/prisma");
const userSchema = require("../joischema/joiSchema");
const argon = require("argon2");

const adminProtect = require("../middleware/authAdmin");
const authProtect = require("../middleware/auth");

router.post("/register", async (req, res, next) => {
  const { email, password } = req.body;

  try {
    // Validate user input
    const valResult = userSchema.userVal.validate(req.body, {
      abortEarly: false,
    });
    const pwdResult = userSchema.pwdVal.validate(req.body.password);

    if (valResult.error) {
      return res.status(400).send(valResult.error.details);
    }
    if (pwdResult.error) {
      return res.status(400).send(pwdResult.error.details);
    }

    //check if a user is already registered
    const CheckUser = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (CheckUser) {
      return res.status(400).json({
        message: "user already exists",
      });
    }

    //hash password
    const hashedPassword = await argon.hash(password);

    const newUser = await prisma.user.create({
      data: {
        email: email.trim().toLowerCase(),
        password: hashedPassword,
      },
    });

    //check if user is created
    if (!newUser) {
      return res.status(400).json({
        message: "User not registered",
      });
    }
    //Firstly create a profile
    const userProfile = await prisma.profile.create({
      data: {
        userId: newUser.id,
      },
    });

    if (!userProfile) {
      return res.status(400).json({
        message: "Profile not created",
      });
    }
    return res.status(200).json({
      message: "User created successfully",
    })
  } catch (error) {
    next(error);
  }
});

router.get("/allusers", [authProtect, adminProtect], async (req, res, next) => {
  try {
    // get info from user databace
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        isAdmin: true,
        profile:{
          select: {
            fullName: true
          }
        },
        books: {
          select: {
            title: true,
            price: true,
            description: true,
            author: true,
            id: true,
            category: {
              select: {
                name: true
              }
            }
          },
        }
      },
    }); // get all users
    return res.status(200).json(users);
  } catch (error) {
    next(error);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    console.log(id);

    const user = await prisma.user.findUnique({
      where: {
        id: Number(id),
      },
    });
    if (user) {
      return res.status(200).json(user);
    } else {
      return res.status(404).json({
        message: "user not found",
      });
    }
  } catch (error) {
    next(error);
  }
});

router.put("/update/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const { password } = req.body;

    // Update user records in the database for password
    const findUser = await prisma.user.findUnique({
      where: {
        id: Number(id),
      },
    });
    if (!findUser) {
      return res.status(404).json({
        message: "user not found",
      });
    } else {
      const updateUser = await prisma.user.update({
        where: {
          email: findUser.email,
        },
        data: {
          password: password,
        },
      });
      return res.status(200).json(updateUser);
    }
  } catch (error) {
    next(error);
  }
});

router.delete("/delete/:id", async (req, res, next) => {
  try {
    const { id } = req.params;

    const user = await prisma.user.findUnique({
      where: {
        id: Number(id),
      },
    });

    if (!user) {
      return res.status(404).json({
        message: "user not found",
      });
    } else {
      const deleteUser = await prisma.user.delete({
        where: {
          email: user.email,
        },
      });
      return res.status(200).json(deleteUser);
    }
  } catch (error) {
    next(error);
  }
});

module.exports = router;

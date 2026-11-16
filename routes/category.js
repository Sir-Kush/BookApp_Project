const express = require("express");
const router = express.Router();
// Importing Prisma to our category app
const prisma = require("../helper/prisma");

// AuthProtection
const authProtect = require("../middleware/auth");

router.post("/create", async (req, res, next) => {
  try {
    const { name, description } = req.body;

    //create category on database
    const category = await prisma.category.create({
      data: {
        name,
        description,
      },
    });

    return res.status(201).json({
      message: "category created successfully",
      category,
    });
  } catch (error) {
    next(error);
  }
});

router.put("/update", async (req, res, next) => {
  try {
    const { id, name, description } = req.body;

    //update category on database
    const category = await prisma.category.update({
      where: {
        id: Number(id),
      },
      data: {
        name,
        description,
      },
    });

    return res.status(201).json({
      message: "category updated successfully",
      category,
    });
  } catch (error) {
    next(error);
  }
});

router.get("/all", async (req, res, next) => {
  try {
    //fetch all categories from database
    const categories = await prisma.category.findMany({});
    return res.status(200).json(categories);
  } catch (error) {
    next(error);
  }
});
router.get("/single/:id", authProtect, async (req, res, next) => {
  try {
    const { id } = req.params;
    const category = await prisma.category.findUnique({
      where: {
        id: Number(id),
      },
    });
    if (category) {
      return res.status(200).json(category);
    } else {
      return res.status(404).json({
        message: "category not found",
      });
    }
  } catch (error) {
    next(error);
  }
});

router.delete("/delete/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const category = await prisma.category.delete({
      where: {
        id: Number(id),
      },
    });
    if (category) {
      return res.status(200).json({
        message: "category deleted successfully",
        category,
      });
    } else {
      return res.status(404).json({
        message: "category not found",
      });
    }
  } catch (error) {
    next(error);
  }
});
// router.get("/start", (req, res, next) => {
//   return res.status(200).json({
//     message: "categories fetched successfully",
//   });
// });

// router.post("/create", (req, res, next) => {
//   const { name, email } = req.body;
//   console.log(name, email);
//   return res.status(200).json({
//     message: "category created successfully",
//   });
// });

// router.put("/update", (req, res, next) => {
//   return res.status(200).json({
//     message: "category updated successfully",
//   });
// });

// router.delete("/delete", (req, res, next) => {
//   return res.status(200).json({
//     message: "category deleted successfully",
//   });
// });

module.exports = router; // Foundation/base of a project for an API for paticular routes

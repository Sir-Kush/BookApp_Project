const express = require("express");
const router = express.Router();
// Importing Prisma to our category app
const prisma = require("../helper/prisma");
const userSchema = require("../joischema/joiSchema");
// AuthProtection
const authProtect = require("../middleware/auth");

router.post("/create", authProtect, async (req, res, next) => {
  try {
    const { title, price, description, author, categoryId } = req.body;
    const { sub, isAdmin } = req.user;

    const book = await prisma.book.create({
      data: {
        title,
        price: String(price),
        description,
        author,
        categoryId: Number(categoryId),
        userId: Number(sub),
      },
    });

    return res.status(200).json({ message: "book create successfully" });
  } catch (error) {
    next(error);
  }
});

router.put("/update", authProtect, async (req, res, next) => {
  try {
    const { title, price, description, author, bookId } = req.body;
    const { sub, isAdmin } = req.user;

    const book = await prisma.book.update({
      where: {
        id: Number(bookId),
        userId: Number(sub),
      },
      data: {
        title,
        price: String(price),
        description,
        author,
      },
    });
    if (book) {
      return res.status(203).json({
        message: "book updated successfully",
        book,
      });
    } else {
      return res.status(404).json({
        message: "book not found",
      });
    }
  } catch (error) {
    next(error);
  }
});

router.get("/allbooks", authProtect, async (req, res, next) => {
  try {
    //fetch all books from database
    const books = await prisma.book.findMany({
      where: {
        userId: Number(req.user.sub),
      },
    });
    return res.status(200).json(books);
  } catch (error) {
    next(error);
  }
});

router.get("/single/:id", authProtect, async (req, res, next) => {
  try {
    const { id } = req.params;
    const { sub, isAdmin } = req.user;
    const book = await prisma.book.findUnique({
      where: {
        id: Number(id),
        userId: Number(sub),
      },
      select: {
        title: true,
        price: true,
        description: true,
        author: true,
        id: true,
        category: {
          select: {
            name: true,
          },
        },
      },
    });
    if (book) {
      return res.status(200).json({message: "book found", book});
    } else {
      return res.status(404).json({
        message: "book not found",
      });
    }
  } catch (error) {
    next(error);
  }
});

router.delete("/single/:id", authProtect, async (req, res, next) => {
  try {
    const { id } = req.params;
    const { sub, isAdmin } = req.user;
    const book = await prisma.book.delete({
      where: {
        id: Number(id),
        userId: Number(sub),
      },
    });
    if (book) {
      return res.status(200).json({
        message: "book deleted successfully",
        book,
      });
    } else {
      return res.status(404).json({
        message: "book not found",
      });
    }
  } catch (error) {
    next(error);
  }
});

module.exports = router;

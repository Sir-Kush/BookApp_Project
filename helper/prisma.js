require("dotenv").config(); // import dotenv

// import prisma
const { PrismaClient } = require("../generated/prisma/client");  

// import PrismaPg
const { PrismaPg } = require("@prisma/adapter-pg"); 


// create prisma client
const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({
  adapter,
});


module.exports = prisma;
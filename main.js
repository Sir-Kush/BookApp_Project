// const http = require("http");

// const server = http.createServer((req, res) => {
//   res.writeHead(200, { "Content-Type": "text/plain" });
//   res.end("Hello World");
// });

// server.listen(3000, () => {
//   console.log("Server listening on port 3000");
// });

// Express Application
// router

const config = require("config"); // import configuration file
const express = require("express"); // import express
const cors = require("cors");
const app = express(); // create express application
const port = config.get("PORT") || 9000; // get port from config
const error = require("./middleware/error"); // import error middleware
const path = require("path");   // import path

// Enable cors
app.use(cors("frontendUrl"));

console.log(config.get("AppName"));

// Body parser middleware, used before importing files
app.use(express.json());


// Serving of static asset to the client
app.use("/public", express.static(path.join(__dirname, "public")));

// Logger
app.use((req, res, next) => {
  console.log(`${req.method}  || ${req.url}`);
  next();
});


// Importing files from routes, as mounted router
const authRoute = require("./routes/auth");
const books = require("./routes/books");
const categories = require("./routes/category");
const product = require("./routes/product");
const profile = require("./routes/profile");
const users = require("./routes/users");

// Application level where routes are registered as router middleware
app.use("/auth", authRoute);
app.use("/books", books);
app.use("/categories", categories);
app.use("/product", product);
app.use("/profile", profile);
app.use("/users", users);



// error-handler middleware
app.use(error);

app.listen(port, () => console.log(`Example app listening on port ${port}!`));

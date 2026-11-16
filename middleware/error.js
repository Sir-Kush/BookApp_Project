const error = (err, req, res, next) => {
   console.log("Stack trace", err.stack);

   return res.status(500).json({
      error: "Internal Server Error. please check the the log for details",
   });
};

module.exports = error;
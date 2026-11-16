const express = require('express');
const router =express.Router();

// const authProtect = require('../middleware/auth');

router.get('/start', (req, res, next) => {
   return res.status(200).json({
      message: 'product fetched successfully'
   });
})

// router.put('/update', authProtect, (req, re, next) => {
//    try {
//       return res.status(201).json({
//          message: "product updated successfully"
//       })
//    } catch (error) {
      
//    }
// })



module.exports = router;
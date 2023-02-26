const express = require('express')
const router = express.Router()


router.get('/sss',(req,res) => {
    res.send("Hello")  
})

module.exports = router
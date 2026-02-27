const express = require('express');
const router = express.Router();
const {protect, authorize} = require("../middleware/auth.middleware");


router.get("/dashboard", protect, async (req, res) => {
    res.json({
        message : "Welcome to the admin dashboard",
        success : true,
        user : req.user.name,
    })
})
module.exports = router;
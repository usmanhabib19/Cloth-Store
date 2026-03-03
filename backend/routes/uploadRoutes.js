const express = require('express');
const router = express.Router();
const asyncHandler = require('express-async-handler');
const { upload } = require('../config/cloudinary');
const { protect } = require('../middleware/auth');

// @desc  Upload images to Cloudinary
// @route POST /api/upload
router.post(
    '/',
    protect,
    upload.array('images', 5),
    asyncHandler(async (req, res) => {
        if (!req.files || req.files.length === 0) {
            res.status(400);
            throw new Error('No files uploaded');
        }
        const urls = req.files.map((f) => f.path);
        res.json({ urls });
    })
);

module.exports = router;

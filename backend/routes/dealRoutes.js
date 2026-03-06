const express = require('express');
const router = express.Router();
const asyncHandler = require('express-async-handler');
const Deal = require('../models/Deal');
const { protect, admin } = require('../middleware/auth');
const { upload } = require('../config/cloudinary');

// @desc  Get all active deals
// @route GET /api/deals
router.get('/', asyncHandler(async (req, res) => {
    const deals = await Deal.find({ isActive: true }).sort({ createdAt: -1 });
    res.json(deals);
}));

// @desc  Get all deals (admin)
// @route GET /api/deals/admin
router.get('/admin', protect, admin, asyncHandler(async (req, res) => {
    const deals = await Deal.find({}).sort({ createdAt: -1 });
    res.json(deals);
}));

// @desc  Create a deal (admin)
// @route POST /api/deals
router.post('/', protect, admin, upload.single('image'), asyncHandler(async (req, res) => {
    const { title, subtitle, description, discountCode, buttonText, buttonLink, type, isActive } = req.body;
    
    if (!req.file) {
        res.status(400);
        throw new Error('Please upload an image for the deal');
    }

    const deal = await Deal.create({
        title,
        subtitle,
        description,
        discountCode,
        buttonText,
        buttonLink,
        type,
        isActive: isActive === 'true' || isActive === true,
        discountPercentage: Number(req.body.discountPercentage) || 0,
        image: req.file.path
    });

    res.status(201).json(deal);
}));

// @desc  Update a deal (admin)
// @route PUT /api/deals/:id
router.put('/:id', protect, admin, upload.single('image'), asyncHandler(async (req, res) => {
    const deal = await Deal.findById(req.params.id);

    if (!deal) {
        res.status(404);
        throw new Error('Deal not found');
    }

    const { title, subtitle, description, discountCode, buttonText, buttonLink, type, isActive } = req.body;

    deal.title = title || deal.title;
    deal.subtitle = subtitle || deal.subtitle;
    deal.description = description || deal.description;
    deal.discountCode = discountCode || deal.discountCode;
    deal.buttonText = buttonText || deal.buttonText;
    deal.buttonLink = buttonLink || deal.buttonLink;
    deal.type = type || deal.type;
    deal.isActive = isActive !== undefined ? (isActive === 'true' || isActive === true) : deal.isActive;
    deal.discountPercentage = req.body.discountPercentage !== undefined ? Number(req.body.discountPercentage) : deal.discountPercentage;

    if (req.file) {
        deal.image = req.file.path;
    }

    const updatedDeal = await deal.save();
    res.json(updatedDeal);
}));

// @desc  Delete a deal (admin)
// @route DELETE /api/deals/:id
router.delete('/:id', protect, admin, asyncHandler(async (req, res) => {
    const deal = await Deal.findById(req.params.id);

    if (!deal) {
        res.status(404);
        throw new Error('Deal not found');
    }

    await deal.deleteOne();
    res.json({ message: 'Deal removed' });
}));

module.exports = router;

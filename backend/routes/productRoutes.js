const express = require('express');
const router = express.Router();
const asyncHandler = require('express-async-handler');
const Product = require('../models/Product');
const { protect, admin } = require('../middleware/auth');
const { upload } = require('../config/cloudinary');

// @desc  Get all products with filters
// @route GET /api/products
router.get(
    '/',
    asyncHandler(async (req, res) => {
        const { category, size, search, sort, featured, page = 1, limit = 12 } = req.query;
        const filter = {};
        if (category) filter.category = category;
        if (size) filter.sizes = { $in: [size] };
        if (featured === 'true') filter.featured = true;
        if (search) filter.name = { $regex: search, $options: 'i' };

        let sortOption = { createdAt: -1 };
        if (sort === 'price-asc') sortOption = { price: 1 };
        if (sort === 'price-desc') sortOption = { price: -1 };
        if (sort === 'rating') sortOption = { rating: -1 };
        if (sort === 'newest') sortOption = { createdAt: -1 };

        const total = await Product.countDocuments(filter);
        const products = await Product.find(filter)
            .sort(sortOption)
            .skip((page - 1) * limit)
            .limit(Number(limit));

        res.json({ products, total, page: Number(page), pages: Math.ceil(total / limit) });
    })
);

// @desc  Get single product
// @route GET /api/products/:id
router.get(
    '/:id',
    asyncHandler(async (req, res) => {
        const product = await Product.findById(req.params.id);
        if (!product) {
            res.status(404);
            throw new Error('Product not found');
        }
        res.json(product);
    })
);

// @desc  Create product (admin)
// @route POST /api/products
router.post(
    '/',
    protect,
    admin,
    upload.array('images', 5),
    asyncHandler(async (req, res) => {
        const { name, description, price, originalPrice, category, subCategory, sizes, stock, featured, tags } = req.body;
        const images = req.files ? req.files.map((f) => f.path) : [];
        const parsedSizes = typeof sizes === 'string' ? JSON.parse(sizes) : sizes;
        const parsedTags = typeof tags === 'string' ? JSON.parse(tags) : tags || [];

        const product = await Product.create({
            name,
            description,
            price: Number(price),
            originalPrice: originalPrice ? Number(originalPrice) : undefined,
            category,
            subCategory,
            sizes: parsedSizes,
            images,
            stock: Number(stock || 0),
            featured: featured === 'true',
            tags: parsedTags,
        });
        res.status(201).json(product);
    })
);

// @desc  Update product (admin)
// @route PUT /api/products/:id
router.put(
    '/:id',
    protect,
    admin,
    upload.array('images', 5),
    asyncHandler(async (req, res) => {
        const product = await Product.findById(req.params.id);
        if (!product) {
            res.status(404);
            throw new Error('Product not found');
        }
        const { name, description, price, originalPrice, category, subCategory, sizes, stock, featured, tags } = req.body;
        const newImages = req.files ? req.files.map((f) => f.path) : [];

        product.name = name || product.name;
        product.description = description || product.description;
        product.price = price ? Number(price) : product.price;
        product.originalPrice = originalPrice ? Number(originalPrice) : product.originalPrice;
        product.category = category || product.category;
        product.subCategory = subCategory !== undefined ? subCategory : product.subCategory;
        product.sizes = sizes ? (typeof sizes === 'string' ? JSON.parse(sizes) : sizes) : product.sizes;
        product.stock = stock ? Number(stock) : product.stock;
        product.featured = featured !== undefined ? featured === 'true' : product.featured;
        product.tags = tags ? (typeof tags === 'string' ? JSON.parse(tags) : tags) : product.tags;
        if (newImages.length > 0) product.images = newImages;

        const updated = await product.save();
        res.json(updated);
    })
);

// @desc  Delete product (admin)
// @route DELETE /api/products/:id
router.delete(
    '/:id',
    protect,
    admin,
    asyncHandler(async (req, res) => {
        const product = await Product.findById(req.params.id);
        if (!product) {
            res.status(404);
            throw new Error('Product not found');
        }
        await product.deleteOne();
        res.json({ message: 'Product removed' });
    })
);

module.exports = router;

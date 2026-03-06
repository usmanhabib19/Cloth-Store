const express = require('express');
const router = express.Router();
const asyncHandler = require('express-async-handler');
const Order = require('../models/Order');
const { protect, admin } = require('../middleware/auth');

// @desc  Create order (auth required)
// @route POST /api/orders
router.post(
    '/',
    protect,
    asyncHandler(async (req, res) => {
        const { items, shippingAddress, totalAmount, shippingFee, paymentMethod } = req.body;
        if (!items || items.length === 0) {
            res.status(400);
            throw new Error('No order items');
        }
        const order = await Order.create({
            userId: req.user._id,
            userEmail: req.user.email,
            items,
            shippingAddress,
            totalAmount,
            shippingFee: shippingFee || 150,
            paymentMethod: paymentMethod || 'COD',
        });
        res.status(201).json(order);
    })
);

// @desc  Get logged-in user orders
// @route GET /api/orders/my
router.get(
    '/my',
    protect,
    asyncHandler(async (req, res) => {
        const orders = await Order.find({ userId: req.user._id })
            .populate('items.product', 'name images')
            .sort({ createdAt: -1 });
        res.json(orders);
    })
);

// @desc  Get all orders (admin dashboard)
// @route GET /api/orders
router.get(
    '/',
    protect,
    admin,
    asyncHandler(async (req, res) => {
        const orders = await Order.find({}).sort({ createdAt: -1 });
        res.json(orders);
    })
);

// @desc  Update order status (admin)
// @route PATCH /api/orders/:id/status
router.patch(
    '/:id/status',
    protect,
    admin,
    asyncHandler(async (req, res) => {
        const order = await Order.findById(req.params.id);
        if (!order) {
            res.status(404);
            throw new Error('Order not found');
        }
        order.status = req.body.status || order.status;
        if (req.body.trackingId !== undefined) {
            order.trackingId = req.body.trackingId;
        }
        if (req.body.shippingImage !== undefined) {
            order.shippingImage = req.body.shippingImage;
        }
        const updated = await order.save();
        res.json(updated);
    })
);

module.exports = router;

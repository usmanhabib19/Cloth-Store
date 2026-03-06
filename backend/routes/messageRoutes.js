const express = require('express');
const router = express.Router();
const Message = require('../models/Message');
const Notification = require('../models/Notification');
const User = require('../models/User');
const { protect, admin } = require('../middleware/auth');
const asyncHandler = require('express-async-handler');

// @desc    Send a message
// @route   POST /api/messages
// @access  Public
router.post('/', asyncHandler(async (req, res) => {
    const { name, email, subject, message } = req.body;
    
    if (!name || !email || !message) {
        res.status(400);
        throw new Error('Please fill all required fields');
    }

    const newMessage = await Message.create({
        name,
        email,
        subject,
        message
    });

    // Create notifications for all admins
    try {
        const admins = await User.find({ isAdmin: true });
        for (const adminUser of admins) {
            await Notification.create({
                user: adminUser._id,
                title: `New Message from ${name}`,
                message: subject || 'No subject',
                type: 'message',
                link: '/admin'
            });
        }
    } catch (err) {
        console.error('Admin notification creation failed:', err);
    }

    res.status(201).json(newMessage);
}));

// @desc    Get all messages
// @route   GET /api/messages
// @access  Private/Admin
router.get('/', protect, admin, asyncHandler(async (req, res) => {
    const messages = await Message.find({}).sort({ createdAt: -1 });
    res.json(messages);
}));

// @desc    Get unread messages count
// @route   GET /api/messages/unread-count
// @access  Private/Admin
router.get('/unread-count', protect, admin, asyncHandler(async (req, res) => {
    const count = await Message.countDocuments({ isRead: false });
    res.json({ count });
}));

// @desc    Mark message as read
// @route   PATCH /api/messages/:id/read
// @access  Private/Admin
router.patch('/:id/read', protect, admin, asyncHandler(async (req, res) => {
    const message = await Message.findById(req.params.id);
    if (message) {
        message.isRead = true;
        await message.save();
        res.json({ message: 'Message marked as read' });
    } else {
        res.status(404);
        throw new Error('Message not found');
    }
}));

// @desc    Delete a message
// @route   DELETE /api/messages/:id
// @access  Private/Admin
router.delete('/:id', protect, admin, asyncHandler(async (req, res) => {
    const message = await Message.findById(req.params.id);
    if (message) {
        await message.deleteOne();
        res.json({ message: 'Message removed' });
    } else {
        res.status(404);
        throw new Error('Message not found');
    }
}));

module.exports = router;

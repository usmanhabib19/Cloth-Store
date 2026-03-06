const express = require('express');
const router = express.Router();
const Notification = require('../models/Notification');
const { protect } = require('../middleware/auth');
const asyncHandler = require('express-async-handler');

// @desc    Get current user's notifications
// @route   GET /api/notifications
// @access  Private
router.get('/', protect, asyncHandler(async (req, res) => {
    const notifications = await Notification.find({ user: req.user._id })
        .sort({ createdAt: -1 })
        .limit(20);
    res.json(notifications);
}));

// @desc    Get unread notifications count
// @route   GET /api/notifications/unread-count
// @access  Private
router.get('/unread-count', protect, asyncHandler(async (req, res) => {
    const count = await Notification.countDocuments({ 
        user: req.user._id, 
        isRead: false 
    });
    res.json({ count });
}));

// @desc    Mark notification as read
// @route   PATCH /api/notifications/:id/read
// @access  Private
router.patch('/:id/read', protect, asyncHandler(async (req, res) => {
    const notification = await Notification.findOne({
        _id: req.params.id,
        user: req.user._id
    });

    if (notification) {
        notification.isRead = true;
        await notification.save();
        res.json({ message: 'Notification marked as read' });
    } else {
        res.status(404);
        throw new Error('Notification not found');
    }
}));

// @desc    Mark all as read
// @route   PATCH /api/notifications/read-all
// @access  Private
router.patch('/read-all', protect, asyncHandler(async (req, res) => {
    await Notification.updateMany(
        { user: req.user._id, isRead: false },
        { isRead: true }
    );
    res.json({ message: 'All notifications marked as read' });
}));

// @desc    Delete a notification
// @route   DELETE /api/notifications/:id
// @access  Private
router.delete('/:id', protect, asyncHandler(async (req, res) => {
    const notification = await Notification.findOne({
        _id: req.params.id,
        user: req.user._id
    });

    if (notification) {
        await notification.deleteOne();
        res.json({ message: 'Notification removed' });
    } else {
        res.status(404);
        throw new Error('Notification not found');
    }
}));

module.exports = router;

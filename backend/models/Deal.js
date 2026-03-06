const mongoose = require('mongoose');

const dealSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    subtitle: {
        type: String,
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    discountCode: {
        type: String,
        trim: true
    },
    buttonText: {
        type: String,
        default: 'Shop Now'
    },
    buttonLink: {
        type: String,
        default: '/shop'
    },
    image: {
        type: String, // Cloudinary URL
        required: true
    },
    discountPercentage: {
        type: Number,
        default: 0
    },
    type: {
        type: String,
        enum: ['primary_banner', 'featured_deal'],
        default: 'featured_deal'
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

const Deal = mongoose.model('Deal', dealSchema);

module.exports = Deal;

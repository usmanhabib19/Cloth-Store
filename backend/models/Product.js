const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User',
        },
        name: { type: String, required: true },
        rating: { type: Number, required: true },
        comment: { type: String, required: true },
    },
    { timestamps: true }
);

const productSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, trim: true },
        description: { type: String, required: true },
        price: { type: Number, required: true, min: 0 },
        originalPrice: { type: Number, min: 0 },
        category: {
            type: String,
            required: true,
            enum: ['men', 'women', 'kids', 'accessories'],
        },
        subCategory: { type: String, default: '' },
        sizes: [{ type: String, enum: ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'Free'] }],
        images: [{ type: String }],
        video: { type: String },
        stock: { type: Number, default: 0, min: 0 },
        featured: { type: Boolean, default: false },
        rating: { type: Number, default: 0, min: 0, max: 5 },
        numReviews: { type: Number, default: 0 },
        reviews: [reviewSchema],
        tags: [{ type: String }],
    },
    { timestamps: true }
);

module.exports = mongoose.model('Product', productSchema);

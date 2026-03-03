const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    name: { type: String, required: true },
    image: { type: String },
    price: { type: Number, required: true },
    size: { type: String },
    qty: { type: Number, required: true, default: 1 },
});

const orderSchema = new mongoose.Schema(
    {
        userId: { type: String, required: true }, // Clerk user ID
        userEmail: { type: String, required: true },
        items: [orderItemSchema],
        shippingAddress: {
            fullName: { type: String, required: true },
            phone: { type: String, required: true },
            address: { type: String, required: true },
            city: { type: String, required: true },
            postalCode: { type: String, required: true },
            country: { type: String, required: true, default: 'Pakistan' },
        },
        totalAmount: { type: Number, required: true },
        shippingFee: { type: Number, default: 150 },
        status: {
            type: String,
            enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
            default: 'pending',
        },
        paymentMethod: { type: String, default: 'COD' },
        isPaid: { type: Boolean, default: false },
    },
    { timestamps: true }
);

module.exports = mongoose.model('Order', orderSchema);

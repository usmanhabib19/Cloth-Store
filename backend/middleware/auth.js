const { createClerkClient } = require('@clerk/clerk-sdk-node');
const asyncHandler = require('express-async-handler');
const User = require('../models/User');

const clerkClient = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY });

const protect = asyncHandler(async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            res.status(401);
            throw new Error('Not authorized, no token provided');
        }

        const token = authHeader.split(' ')[1];
        
        // Verify Clerk token
        let decoded;
        try {
            decoded = await clerkClient.verifyToken(token);
        } catch (verifyErr) {
            res.status(401);
            throw new Error('Not authorized, token verification failed');
        }

        const clerkId = decoded.sub;

        // Get user details from Clerk to sync with our DB
        let clerkUser;
        try {
            clerkUser = await clerkClient.users.getUser(clerkId);
        } catch (userErr) {
            res.status(401);
            throw new Error('Not authorized, user lookup failed');
        }

        const email = clerkUser.emailAddresses[0]?.emailAddress;
        const name = `${clerkUser.firstName || ''} ${clerkUser.lastName || ''}`.trim() || 'User';

        // Find or update our local User model
        let user = await User.findOne({ 
            $or: [{ clerkId: clerkId }, { email: email }] 
        });

        if (!user) {
            user = await User.create({
                clerkId: clerkId,
                name: name,
                email: email,
                isAdmin: email === process.env.ADMIN_EMAIL,
            });
            console.log('✅ New user synced:', email);
        } else if (!user.clerkId || user.clerkId !== clerkId) {
            user.clerkId = clerkId;
            await user.save();
        }

        req.user = user;
        next();
    } catch (error) {
        res.status(401);
        throw new Error(error.message || 'Not authorized, session failed');
    }
});

const admin = (req, res, next) => {
    if (req.user && req.user.isAdmin) {
        next();
    } else {
        res.status(401);
        throw new Error('Not authorized as admin');
    }
};

module.exports = { protect, admin };

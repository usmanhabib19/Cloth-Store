const asyncHandler = require('express-async-handler');
const clerk = require('@clerk/clerk-sdk-node');

const protect = asyncHandler(async (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }
    if (!token) {
        res.status(401);
        throw new Error('Not authorized, no token');
    }
    try {
        const payload = await clerk.verifyToken(token);
        req.user = payload;
        next();
    } catch (error) {
        res.status(401);
        throw new Error('Not authorized, token failed');
    }
});

const admin = asyncHandler(async (req, res, next) => {
    if (!req.user) {
        res.status(401);
        throw new Error('Not authorized');
    }
    const adminEmail = process.env.ADMIN_EMAIL;
    const clerkUser = await clerk.users.getUser(req.user.sub);
    const userEmail = clerkUser.emailAddresses[0]?.emailAddress;
    if (userEmail === adminEmail) {
        next();
    } else {
        res.status(403);
        throw new Error('Not authorized as admin');
    }
});

module.exports = { protect, admin };

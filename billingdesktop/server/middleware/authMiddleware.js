const jwt = require("jsonwebtoken");
const User = require("../models/User");

// ==========================================
// PROTECT
// ==========================================

const protect = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (
            !authHeader ||
            !authHeader.startsWith("Bearer ")
        ) {
            return res.status(401).json({
                success: false,
                message: "Not authorized. Token required."
            });
        }

        const token = authHeader.split(" ")[1];

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        const user = await User.findById(
            decoded.id
        ).select("-password");

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "User not found"
            });
        }

        if (!user.isActive) {
            return res.status(403).json({
                success: false,
                message: "User account is inactive"
            });
        }

        req.user = user;

        next();

    } catch (error) {

        console.error(
            "Auth error:",
            error.message
        );

        return res.status(401).json({
            success: false,
            message: "Invalid or expired token"
        });
    }
};


// ==========================================
// ADMIN ONLY
// ==========================================

const adminOnly = (req, res, next) => {

    if (
        !req.user ||
        req.user.role !== "admin"
    ) {
        return res.status(403).json({
            success: false,
            message: "Admin access required"
        });
    }

    next();
};


// ==========================================
// AUTHORIZE BY ROLE
// ==========================================

const authorize = (...roles) => {

    return (req, res, next) => {

        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: "Not authorized"
            });
        }

        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: "Access denied"
            });
        }

        next();
    };
};


module.exports = {
    protect,
    adminOnly,
    authorize
};
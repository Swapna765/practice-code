const User = require("../models/User");
const bcrypt = require("bcrypt");


// ==========================================
// GET ALL USERS
// ==========================================

const getUsers = async (req, res) => {
    try {

        const users = await User.find()
            .select("-password")
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            count: users.length,
            users
        });

    } catch (error) {

        console.error("Get users error:", error);

        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};


// ==========================================
// CREATE USER
// ==========================================

const createUser = async (req, res) => {
    try {

        const {
            name,
            email,
            password,
            role,
            phone
        } = req.body;


        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message:
                    "Name, email and password are required"
            });
        }


        const existingUser =
            await User.findOne({
                email: email.toLowerCase()
            });


        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "User already exists"
            });
        }


        const hashedPassword =
            await bcrypt.hash(password, 10);


        const user = await User.create({

            name,

            email:
                email.toLowerCase(),

            password:
                hashedPassword,

            role:
                role || "cashier",

            phone:
                phone || ""

        });


        res.status(201).json({

            success: true,

            message:
                "User created successfully",

            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                phone: user.phone,
                isActive: user.isActive
            }

        });

    } catch (error) {

        console.error(
            "Create user error:",
            error
        );

        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};


// ==========================================
// UPDATE USER
// ==========================================

const updateUser = async (req, res) => {
    try {

        const {
            name,
            email,
            password,
            role,
            phone,
            isActive
        } = req.body;


        const user =
            await User.findById(
                req.params.id
            );


        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }


        if (name !== undefined) {
            user.name = name;
        }


        if (email !== undefined) {
            user.email =
                email.toLowerCase();
        }


        if (role !== undefined) {
            user.role = role;
        }


        if (phone !== undefined) {
            user.phone = phone;
        }


        if (isActive !== undefined) {
            user.isActive = isActive;
        }


        if (password) {

            user.password =
                await bcrypt.hash(
                    password,
                    10
                );

        }


        await user.save();


        res.json({

            success: true,

            message:
                "User updated successfully",

            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                phone: user.phone,
                isActive: user.isActive
            }

        });

    } catch (error) {

        console.error(
            "Update user error:",
            error
        );

        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};


// ==========================================
// DELETE / DEACTIVATE USER
// ==========================================

const deleteUser = async (req, res) => {
    try {

        const user =
            await User.findById(
                req.params.id
            );


        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }


        user.isActive = false;

        await user.save();


        res.json({

            success: true,

            message:
                "User deactivated successfully"

        });

    } catch (error) {

        console.error(
            "Delete user error:",
            error
        );

        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};


module.exports = {
    getUsers,
    createUser,
    updateUser,
    deleteUser
};
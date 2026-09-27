const Customer = require("../models/Customer");

// ==========================================
// GET ALL CUSTOMERS
// ==========================================
const getCustomers = async (req, res) => {
    try {
        const customers = await Customer.find()
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            count: customers.length,
            customers
        });

    } catch (error) {
        console.error("Get customers error:", error);

        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};


// ==========================================
// GET SINGLE CUSTOMER
// ==========================================
const getCustomer = async (req, res) => {
    try {
        const customer = await Customer.findById(
            req.params.id
        );

        if (!customer) {
            return res.status(404).json({
                success: false,
                message: "Customer not found"
            });
        }

        res.json({
            success: true,
            customer
        });

    } catch (error) {
        console.error("Get customer error:", error);

        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};


// ==========================================
// CREATE CUSTOMER
// ==========================================
const createCustomer = async (req, res) => {
    try {
        const {
            name,
            phone,
            email,
            address,
            gstNumber
        } = req.body;

        if (!name || !phone) {
            return res.status(400).json({
                success: false,
                message: "Customer name and phone are required"
            });
        }

        const existingCustomer = await Customer.findOne({
            phone
        });

        if (existingCustomer) {
            return res.status(400).json({
                success: false,
                message: "Customer with this phone number already exists"
            });
        }

        const customer = await Customer.create({
            name,
            phone,
            email,
            address,
            gstNumber
        });

        res.status(201).json({
            success: true,
            message: "Customer created successfully",
            customer
        });

    } catch (error) {
        console.error("Create customer error:", error);

        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};


// ==========================================
// UPDATE CUSTOMER
// ==========================================
const updateCustomer = async (req, res) => {
    try {
        const customer = await Customer.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        if (!customer) {
            return res.status(404).json({
                success: false,
                message: "Customer not found"
            });
        }

        res.json({
            success: true,
            message: "Customer updated successfully",
            customer
        });

    } catch (error) {
        console.error("Update customer error:", error);

        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};


// ==========================================
// DELETE CUSTOMER
// ==========================================
const deleteCustomer = async (req, res) => {
    try {
        const customer = await Customer.findByIdAndDelete(
            req.params.id
        );

        if (!customer) {
            return res.status(404).json({
                success: false,
                message: "Customer not found"
            });
        }

        res.json({
            success: true,
            message: "Customer deleted successfully"
        });

    } catch (error) {
        console.error("Delete customer error:", error);

        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};


// ==========================================
// SEARCH CUSTOMER BY PHONE
// ==========================================
const searchCustomerByPhone = async (req, res) => {
    try {
        const customer = await Customer.findOne({
            phone: req.params.phone,
            isActive: true
        });

        if (!customer) {
            return res.status(404).json({
                success: false,
                message: "Customer not found"
            });
        }

        res.json({
            success: true,
            customer
        });

    } catch (error) {
        console.error("Search customer error:", error);

        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};


module.exports = {
    getCustomers,
    getCustomer,
    createCustomer,
    updateCustomer,
    deleteCustomer,
    searchCustomerByPhone
};
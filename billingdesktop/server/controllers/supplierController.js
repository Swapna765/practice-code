const Supplier = require("../models/Supplier");


// ==========================================
// GET ALL SUPPLIERS
// ==========================================

const getSuppliers = async (req, res) => {
    try {

        const suppliers = await Supplier.find()
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            count: suppliers.length,
            suppliers
        });

    } catch (error) {

        console.error("Get suppliers error:", error);

        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};


// ==========================================
// GET SINGLE SUPPLIER
// ==========================================

const getSupplierById = async (req, res) => {
    try {

        const supplier =
            await Supplier.findById(req.params.id);

        if (!supplier) {
            return res.status(404).json({
                success: false,
                message: "Supplier not found"
            });
        }

        res.json({
            success: true,
            supplier
        });

    } catch (error) {

        console.error("Get supplier error:", error);

        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};


// ==========================================
// CREATE SUPPLIER
// ==========================================

const createSupplier = async (req, res) => {
    try {

        const {
            name,
            companyName,
            phone,
            email,
            address,
            gstNumber
        } = req.body;


        if (!name || !phone) {
            return res.status(400).json({
                success: false,
                message: "Name and phone are required"
            });
        }


        const supplier =
            await Supplier.create({
                name,
                companyName: companyName || "",
                phone,
                email: email || "",
                address: address || "",
                gstNumber: gstNumber || ""
            });


        res.status(201).json({
            success: true,
            message: "Supplier created successfully",
            supplier
        });

    } catch (error) {

        console.error("Create supplier error:", error);

        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};


// ==========================================
// UPDATE SUPPLIER
// ==========================================

const updateSupplier = async (req, res) => {
    try {

        const supplier =
            await Supplier.findByIdAndUpdate(
                req.params.id,
                req.body,
                {
                    new: true,
                    runValidators: true
                }
            );


        if (!supplier) {
            return res.status(404).json({
                success: false,
                message: "Supplier not found"
            });
        }


        res.json({
            success: true,
            message: "Supplier updated successfully",
            supplier
        });

    } catch (error) {

        console.error("Update supplier error:", error);

        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};


// ==========================================
// DEACTIVATE SUPPLIER
// ==========================================

const deleteSupplier = async (req, res) => {
    try {

        const supplier =
            await Supplier.findById(req.params.id);

        if (!supplier) {
            return res.status(404).json({
                success: false,
                message: "Supplier not found"
            });
        }


        supplier.isActive = false;

        await supplier.save();


        res.json({
            success: true,
            message: "Supplier deactivated successfully"
        });

    } catch (error) {

        console.error("Delete supplier error:", error);

        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};


module.exports = {
    getSuppliers,
    getSupplierById,
    createSupplier,
    updateSupplier,
    deleteSupplier
};
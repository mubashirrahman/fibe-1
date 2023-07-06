const messages = require('../../../others/messages/messages');
const { Staff } = require('../models/staffModel');

// Create a new staff member
const createStaff = (req, res) => {
    const { name, number, email, branch, roles, mID } = req.body;

    // // Check for required fields
    // if () {
    //     return res.status(400).json({ message: 'All fields are required' });
    // }

    const staff = new Staff({ name, number, email, branch, roles, mID });

    staff.save()
        .then(() => {
            res.status(201).json({ message: messages.created });
        })
        .catch((error) => {
            res.status(400).json({ error: error.message });
        });
};

// Get all staff members
const getAllStaff = (req, res) => {
    Staff.find()
        .then((staff) => {
            res.status(200).json(staff);
        })
        .catch((error) => {
            res.status(400).json({ error: error.message });
        });
};

// Get a specific staff member by ID
const getStaffById = (req, res) => {
    Staff.findById(req.params.id)
        .then((staff) => {
            if (!staff) {
                return res.status(404).json({ message: messages.itemNotFount });
            }
            res.status(200).json(staff);
        })
        .catch((error) => {
            res.status(400).json({ error: error.message });
        });
};

// Get a specific staff member by mID
const getStaffByMID = (req, res) => {
    console.log(req.query.mID);
    Staff.findOne({ mID: req.query.mID })
        .then((staff) => {
            if (!staff) {
                return res.status(404).json({ message: messages.itemNotFount });
            }
            res.status(200).json(staff);
        })
        .catch((error) => {
            res.status(400).json({ error: error.message });
        });
};

// Update a staff member by ID
const updateStaffById = (req, res) => {
    Staff.findByIdAndUpdate(req.params.id, req.body)
        .then((staff) => {
            if (!staff) {
                return res.status(404).json({ message: messages.itemNotFount });
            }
            res.status(200).json({ message: messages.updatedSuccessfully });
        })
        .catch((error) => {
            res.status(400).json({ error: error.message });
        });
};

// Delete a staff member by ID
const deleteStaffById = (req, res) => {
    Staff.findByIdAndRemove(req.params.id)
        .then((staff) => {
            if (!staff) {
                return res.status(404).json({ message: messages.itemNotFount });
            }
            res.status(200).json({ message: messages.userDeleted });
        })
        .catch((error) => {
            res.status(400).json({ error: error.message });
        });
};

module.exports = {
    createStaff,
    getAllStaff,
    getStaffById,
    getStaffByMID,
    updateStaffById,
    deleteStaffById
};

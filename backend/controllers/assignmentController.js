const Assignment = require('../models/Assignment');

const getAllAssignments = async (req, res) => {
    try {
        const assignments = await Assignment.find({}, 'title description difficulty tags');
        res.json({ success: true, data: assignments });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

const getAssignmentById = async (req, res) => {
    try {
        const assignment = await Assignment.findById(req.params.id);
        if (!assignment) return res.status(404).json({ success: false, error: 'Assignment not found' });
        res.json({ success: true, data: assignment });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

module.exports = { getAllAssignments, getAssignmentById };

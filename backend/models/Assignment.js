const mongoose = require('mongoose');

const assignmentSchema = new mongoose.Schema({
    title: String,
    description: String,
    difficulty: String,
    question: String,
    tableSchemas: [{
        tableName: String,
        columns: [{
            name: String,
            type: { type: String }
        }]
    }],
    relevantTables: [String],
    tags: [String]
});

module.exports = mongoose.model('Assignment', assignmentSchema);

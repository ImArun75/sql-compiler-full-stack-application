const pool = require('../config/postgres');
const Assignment = require('../models/Assignment');

const executeQuery = async (req, res) => {
    const { assignmentId, query } = req.body;
    if (!query?.trim()) return res.status(400).json({ success: false, error: 'Query required' });

    try {
        const assignment = await Assignment.findById(assignmentId);
        const client = await pool.connect();
        try {
            await client.query("SET statement_timeout = '5000'");
            await client.query('BEGIN');
            const result = await client.query(query);

            let preview = null;
            if (['INSERT', 'UPDATE', 'DELETE'].some(k => query.toUpperCase().startsWith(k)) && assignment.relevantTables?.length) {
                const data = await client.query(`SELECT * FROM "${assignment.relevantTables[0]}" LIMIT 50`);
                preview = { columns: data.fields.map(f => f.name), rows: data.rows };
            }

            await client.query('ROLLBACK');
            res.json({ success: true, columns: result.fields?.map(f => f.name) || [], rows: result.rows, affected: result.rowCount, preview });
        } finally {
            client.release();
        }
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};

module.exports = { executeQuery };

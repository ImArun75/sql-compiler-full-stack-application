require('dotenv').config();
process.on('unhandledRejection', (r) => console.log('Rejection:', r));
process.on('uncaughtException', (e) => console.log('Exception:', e));
const express = require('express');
const cors = require('cors');
const connectMongo = require('./config/mongoose');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/assignments', require('./routes/assignments'));
app.use('/api/execute', require('./routes/execute'));
app.use('/api/hint', require('./routes/hint'));

connectMongo().then(() => {
    app.listen(process.env.PORT || 5000, () => console.log('Server running'));
});

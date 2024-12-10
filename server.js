const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');

const authRoutes = require('./src/routes/authRoutes');

dotenv.config();
const app = express();

app.use(bodyParser.json());
app.use(cors());
app.use('/api/auth', authRoutes);

app.get('/', (req, res) => {
    res.send('Inventory Management Backend is Running!');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

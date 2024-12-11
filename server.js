const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');


const authRoutes = require('./src/routes/authRoutes');
const inventoryRoutes = require('./src/routes/inventoryRoutes');
const salesRoutes = require('./src/routes/salesRoutes');
const analyticsRoutes = require('./src/routes/analyticsRoutes');


dotenv.config();
const app = express();

// Configure CORS dynamically
const corsOptions = {
    origin: process.env.CORS_ORIGIN || '*', // Default to allow all if not specified
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true, // Allow credentials
};

const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Inventory Management API',
            version: '1.0.0',
            description: 'API documentation for the Inventory Management System',
        },
        servers: [
            {
                url: 'http://localhost:5000', // Update this if deployed
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
            },
        },
        security: [{ bearerAuth: [] }],
    },
    apis: ['./src/routes/*.js'], // Path to API docs
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);


app.use(cors(corsOptions));

app.use(bodyParser.json());
app.use(cors());
app.use('/api/auth', authRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/sales', salesRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));


app.get('/', (req, res) => {
    res.send('Inventory Management Backend is Running!');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

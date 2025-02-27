import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import db from '../db/connection';

dotenv.config();

const app: Express = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Test route
app.get('/', (req: Request, res: Response) => {
    res.json({
        message: 'Employee Manager API'
    });
});

// Example employee routes
app.get('/api/employees', async (req: Request, res: Response) => {
    try {
        const employees = await db.findAllEmployees();
        res.json(employees);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch employees' });
    }
});

// Start server after db connection is established
db.connect((err, client, release) => {
    if (err) {
        console.error('Error connecting to the database:', err.stack);
        process.exit(1);
    } else {
        console.log('Connected to database successfully');
        release();

        // Start server
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    }
});

export default app;

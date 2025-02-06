import express from 'express';
import cors from 'cors';
import calculatorRouter from './routes/calculator.route.js';
import { SERVER_URL, PORT, ENV } from './config/constants.js';

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Routes
app.get('/', (req, res) => {
    res.json({ message: "Server is running" });
});

app.use('/calculate', calculatorRouter);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something broke!' });
});

// Start server
app.listen(PORT, SERVER_URL, () => {
    console.log(`Server running in ${ENV} mode on http://${SERVER_URL}:${PORT}`);
});
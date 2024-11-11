import express, { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// MongoDB connection
const MONGO_URI = process.env.MONGO_URI || 'mongodb://mongo:27017/users';

// mongoose
//   .connect(MONGO_URI)
//   .then(() => console.log('User Service connected to MongoDB'))
//   .catch((err) => console.error('MongoDB connection error:', err));

app.use(express.json());

// Placeholder routes
app.get('/users', (req: Request, res: Response) => {
  res.json({ message: 'List of users' });
});

app.post('/users', (req: Request, res: Response) => {
  res.json({ message: 'User created' });
});

// Global error handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).send('Internal Server Error');
});

app.listen(PORT, () => {
  console.log(`User Service listening on port ${PORT}`);
});

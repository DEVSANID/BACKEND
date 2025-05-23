import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import path from 'path';
import { fileURLToPath } from 'url';
import { CohereClient } from 'cohere-ai';

// Routes
import authRoutes from './routes/authRoutes.js';
import eventRoutes from './routes/eventRoutes.js';
import bookingRoutes from './routes/bookingRoutes.js';
import blogRoutes from './routes/blogRoutes.js';
import visitorRoutes from './routes/visitorRoutes.js';
import adminAuthRoutes from './routes/adminRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import collegeRoutes from './routes/collegeRoutes.js';
import tickets from './routes/tickets.js';
import reviewRoutes from './routes/reviewRoutes.js'; // ✅ Make sure this path is correct

// Setup path utilities
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Env config
dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static folders
app.use("/uploads", express.static(path.join(__dirname, "uploads")));    // Blog images
app.use("/tickets", express.static(path.join(__dirname, "tickets")));    // Ticket PDFs

// Cohere AI setup
const cohere = new CohereClient({
  token: process.env.COHERE_API_KEY,
});

// Register Routes
app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/blogs', blogRoutes); 
app.use('/api/visitors', visitorRoutes);
app.use('/api/admin', adminAuthRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/colleges', collegeRoutes);
app.use('/api/tickets', tickets);
app.use('/api/reviews', reviewRoutes);

// AI Chat Route
app.post('/api/chat', async (req, res) => {
  const { message } = req.body;

  const projectInfo = {
    'what is event hive': 'Event Hive is a platform designed to help users discover, create, and manage events...',
    'how do i create an event': "To create an event on Event Hive, log in to your account, click on 'Create Event,' and fill out the details...",
    'what types of events can i find': 'You can find a wide variety of events on Event Hive, including workshops, conferences, and more...',
    'how do i register for an event': "Click on the event you're interested in, then click 'Register' and follow the prompts...",
    'how do i contact support': 'You can contact Event Hive support by emailing support@eventhive.com...',
    'is event hive free to use': 'Yes, Event Hive is free for discovering and registering for events, but some events may have fees...',
  };

  const botMessage = projectInfo[message.toLowerCase()];
  if (botMessage) return res.json({ message: botMessage });

  try {
    const response = await cohere.generate({
      model: 'command',
      prompt: `You are a helpful assistant for Event Hive. The user asked: "${message}". Provide a relevant response.`,
      maxTokens: 100,
      temperature: 0.7,
    });

    res.json({ message: response.generations[0].text });
  } catch (error) {
    console.error('Cohere AI Error:', error);
    res.status(500).json({ error: 'Something went wrong. Please try again later.' });
  }
});

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log(' MongoDB Connected');
    app.listen(PORT, () => {
      console.log(` Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('MongoDB Connection Error:', err.message);
    process.exit(1);
  });

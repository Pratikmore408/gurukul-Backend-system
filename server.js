// server.js
import express from "express";
import { connectDB } from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import queueRoutes from "./routes/queueRoutes.js";
import amqp from "amqplib";

export const app = express();
app.use(express.json());

// Connect to MongoDB
connectDB();

// RabbitMQ connection and channel setup
let channel;
const connectQueue = async () => {
  try {
    const connection = await amqp.connect("amqp://gurukul-rabbitmq-1:5672");
    channel = await connection.createChannel();
    await channel.assertQueue("requests");
    app.locals.channel = channel; // Make the channel available in the app
  } catch (error) {
    console.error("Error connecting to RabbitMQ:", error);
  }
};
connectQueue();

// Routes
app.use("/auth", authRoutes);
app.use("/queue", queueRoutes);

app.get("/", (req, res) => {
  res.send("welcome to gurucool System");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});

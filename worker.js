import amqp from "amqplib";
import dotenv from "dotenv";
import mongoose from "mongoose";
import axios from "axios";
import RequestLog from "./models/requestLog.js";

dotenv.config();

// MongoDB connection
const dbURI = process.env.MONGO_URI;

mongoose
  .connect(dbURI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Function to process a specific queue for a client
const processQueue = async (queueName) => {
  try {
    const connection = await amqp.connect("amqp://gurukul-rabbitmq-1");
    console.log("Connected to RabbitMQ");
    const channel = await connection.createChannel();
    await channel.assertQueue(queueName);

    channel.consume(queueName, async (msg) => {
      if (msg !== null) {
        try {
          const request = JSON.parse(msg.content.toString());

          // Log the request to MongoDB
          await new RequestLog({
            type: request.type,
            payload: request.payload,
            user_id: request.user_id,
          }).save();

          channel.ack(msg);
        } catch (processingError) {
          console.error("Error processing message:", processingError);
        }
      } else {
        console.log("Received null message");
      }
    });
  } catch (error) {
    console.error(`Error processing queue ${queueName}:`, error);
  }
};

const getClientQueueNames = async () => {
  try {
    const response = await axios.get(
      "http://gurukul-rabbitmq-1:15672/api/queues",
      {
        auth: {
          username: "guest",
          password: "guest",
        },
      }
    );
    return response.data.map((queue) => queue.name);
  } catch (error) {
    console.error("Error fetching queues from RabbitMQ:", error);
    return [];
  }
};

// Start processing all client queues
export const startProcessing = async () => {
  const queues = await getClientQueueNames();
  queues.forEach((queueName) => {
    processQueue(queueName);
  });
};

startProcessing();

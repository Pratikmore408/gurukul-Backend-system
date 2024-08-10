// models/requestLog.js
import mongoose from "mongoose";

const requestLogSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
  },
  payload: {
    type: mongoose.Schema.Types.Mixed,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const RequestLog = mongoose.model("RequestLog", requestLogSchema);
export default RequestLog;

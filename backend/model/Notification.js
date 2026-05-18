import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true
    },

    message: {
      type: String,
      required: true
    },

    read: {
      type: Boolean,
      default: false
    },

    readAt: {
      type: Date,
      default: null
    },

    expiresAt: {
      type: Date
    }
  },
  { timestamps: true }
);


notificationSchema.index(
  { expiresAt: 1 },
  { expireAfterSeconds: 0 }
);

export default mongoose.model(
  "Notification",
  notificationSchema
);
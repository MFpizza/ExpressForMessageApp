import mongoose from "mongoose";

export const MessageSchema = new mongoose.Schema({
  team: [
    {
      member: {
        type: String,
        required: true,
      },
    },
  ],
  messageList: [
    {
      message: { type: String, required: true },
      whoSend: { type: String, required: true },
    },
  ],
});

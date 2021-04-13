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
  chatRoomName:{ type: String, required: true},
  // RoomImage:{ type: String, required: false},
  messageList: [
    {
      message: { type: String, required: true },
      SendingAccount: { type: String, required: true },
      time:{ type: Date, required: true }
    },
  ], 
});

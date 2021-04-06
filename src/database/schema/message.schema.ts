import mongoose from 'mongoose';

export const MessageSchema = new mongoose.Schema(
  {
    toWho:{
        type:String,
        required:true
    },
    message:{
        type:String,
        required:true
    }
  }
);
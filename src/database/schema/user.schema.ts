import mongoose from 'mongoose';

export const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      minlength: 6,
      maxlength: 16
    },
    account:{
      type:String,
      required: true,
      minlength: 6,
      maxlength: 16
    },
    password:{
      type:String,
      required: true,
      minlength:6,
      maxlength:16
    },
    hasImage:{
      type: Boolean,
      required: true
    },
    imageUrl:{
      type:String,
    },
    friend:[
      {account:{type:String}}
    ],
    chatRoom:[
      { 
        roomId:{type:String, required: true},
        // time:{type:Date, required: true},
        lastMessage:{type:String},
        roomName:{type:String,required:true}
      }
    ]
  }
);
import mongoose from 'mongoose';
import { MessageSchema } from '../../schema/message.schema';

export const MessageModel = mongoose.model('Message', MessageSchema);
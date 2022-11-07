import { Schema } from 'mongoose';

const { Types: { ObjectId } } = Schema;

const CommentSchema = new Schema({
  content: String,
  rating: Number,
  userId: {
    type: ObjectId,
    ref: "User"
  }
})

export { CommentSchema }
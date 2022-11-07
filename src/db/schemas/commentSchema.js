import { Schema } from 'mongoose';

const { Types: { ObjectId } } = Schema;

const CommentSchema = new Schema({
  content: String,
  rating: Number,
  user: {
    type: ObjectId,
    ref: "User"
  }
})

export { CommentSchema }
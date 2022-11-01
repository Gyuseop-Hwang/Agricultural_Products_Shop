import Schema from "Schema";

const CategorySchema = new Schema({
  name: String,
  total: {
    type: Number,
    default: 0,
  }
});

export { CategorySchema };
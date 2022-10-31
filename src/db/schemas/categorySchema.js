import Schema from "Schema";

const CategorySchema = new Schema({
  name: String,
  total: Number,
});

export { CategorySchema };
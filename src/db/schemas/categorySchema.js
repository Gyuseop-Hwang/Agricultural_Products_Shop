import Schema from "Schema";

const CategorySchema = new Schema({
  name: String,
  isLocal: Boolean,
  isOrganic: Boolean,
});

export { CategorySchema };
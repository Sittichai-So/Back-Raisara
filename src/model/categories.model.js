import mongoose from "mongoose"

const { Schema, model } = mongoose;


const CategorySchema = new Schema({
  key: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  icon: { type: String, required: true }
}, { 
  timestamps: true,
  collection: "categories"
});

const Categories = model('Categories', CategorySchema, 'categories');

export default Categories;

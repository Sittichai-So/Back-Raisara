import Category from "../model/categories.model.js";

export default class CategoryService {
  async getAll() {
    try {
      const categories = await Category.find().sort({ createdAt: -1 });
      return categories;
    } catch (error) {
      console.log(error);
      throw new Error(error.message || "Failed to get categories", {
        cause: "get_categories_error",
      });
    }
  }
}


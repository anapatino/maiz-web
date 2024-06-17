import { Category } from "@/domain/category";
import { CategoryRequest } from "../repository/category_request";

export class CategoryService {
  public static async addCategory(
    newCategory: Category,
    image: string
  ): Promise<string> {
    try {
      const message = await CategoryRequest.addCategory(newCategory, image);
      return message;
    } catch (error: any) {
      throw new Error(
        "An error occurred while adding the category: " + error.message
      );
    }
  }

  public static async deleteCategory(id: string): Promise<string> {
    try {
      const message = await CategoryRequest.deleteCategory(id);
      return message;
    } catch (error: any) {
      throw new Error(
        "An error occurred while deleting the category: " + error.message
      );
    }
  }

  public static async getAllCategories(): Promise<Category[]> {
    try {
      return await CategoryRequest.getAllCategories();
    } catch (error: any) {
      throw new Error(
        "An error occurred while retrieving categories: " + error.message
      );
    }
  }

  public static async getCategoryByName(name: string): Promise<Category[]> {
    try {
      return await CategoryRequest.getCategoryByName(name);
    } catch (error: any) {
      throw new Error(
        "An error occurred while retrieving the category by name: " +
          error.message
      );
    }
  }

  public static async getCategoryById(id: string): Promise<Category> {
    try {
      const category = await CategoryRequest.getCategoryById(id);
      if (!category) {
        throw new Error("Category not found");
      }
      return category;
    } catch (error: any) {
      throw new Error(
        "An error occurred while retrieving the category by ID: " +
          error.message
      );
    }
  }

  public static async updateCategory(
    id: string,
    updatedCategory: Partial<Category>,
    newImageBase64: string
  ): Promise<string> {
    try {
      const message = await CategoryRequest.updateCategory(
        id,
        updatedCategory,
        newImageBase64
      );
      return message;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }
}

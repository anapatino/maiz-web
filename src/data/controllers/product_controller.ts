import { Product, ProductResponse } from "@/domain/product";
import { ProductRequest } from "../repository/product_request";

export class ProductController {
  public static async getAllProducts(): Promise<ProductResponse[]> {
    try {
      return await ProductRequest.getAllProducts();
    } catch (error) {
      throw new Error("Error fetching all products: " + error);
    }
  }

  public static async getProductById(
    productId: string
  ): Promise<Product | null> {
    try {
      return await ProductRequest.getProductById(productId);
    } catch (error) {
      throw new Error("Error fetching product by ID: " + error);
    }
  }

  public static async getProductsByCategory(
    idCategory: string
  ): Promise<Product[]> {
    try {
      return await ProductRequest.getProductsByCategory(idCategory);
    } catch (error) {
      throw new Error("Error fetching products by category: " + error);
    }
  }

  public static async addProduct(
    newProduct: Product,
    image: string
  ): Promise<string> {
    try {
      return await ProductRequest.addProduct(newProduct, image);
    } catch (error) {
      throw new Error("Error adding product: " + error);
    }
  }

  public static async updateProduct(
    productId: string,
    updatedProduct: Partial<Product>,
    image: string
  ): Promise<string> {
    try {
      const message = await ProductRequest.updateProduct(
        productId,
        updatedProduct,
        image
      );
      return message;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  public static async deleteProduct(productId: string): Promise<void> {
    try {
      await ProductRequest.deleteProduct(productId);
    } catch (error) {
      throw new Error("Error deleting product: " + error);
    }
  }
}

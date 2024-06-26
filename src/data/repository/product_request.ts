import {
  Product,
  ProductResponse,
  mapDocToProduct,
  mapDocToProductResponse,
} from "@/domain/product";
import { database } from "@/lib/firebase";
import {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
  updateDoc,
  getDoc,
  QueryDocumentSnapshot,
  DocumentData,
} from "firebase/firestore";
import {
  deleteObject,
  getDownloadURL,
  getStorage,
  ref,
  uploadBytes,
} from "firebase/storage";
import { CategoryRequest } from "./category_request";

export class ProductRequest {
  public static async getAllProducts(): Promise<ProductResponse[]> {
    const categories = await CategoryRequest.getAllCategories();
    const products = await this.fetchProducts((doc) => true);
    
    return products.map(product => {
      const category = categories.find(cat => cat.id === product.idCategory);
      return mapDocToProductResponse(product, category ? category.options : []);
    });
  }

  public static async getProductById(id: string): Promise<Product | null> {
    const products = await this.fetchProducts((doc) => doc.id === id);

    return products.length > 0 ? products[0] : null;
  }

  public static async getProductsByCategory(
    idCategory: string
  ): Promise<Product[]> {
    return this.fetchProducts((doc) => doc.data().idCategory === idCategory);
  }

  private static async fetchProducts(
    filter: (doc: QueryDocumentSnapshot<DocumentData>) => boolean
  ): Promise<Product[]> {
    const products: Product[] = [];
    try {
      const productsCollection = await getDocs(
        collection(database, "products")
      );
      productsCollection.forEach((doc) => {
        if (filter(doc)) {
          products.push(mapDocToProduct(doc));
        }
      });
    } catch (error: any) {
      throw new Error(error.message);
    }
    return products;
  }

  public static async addProduct(
    newProduct: Product,
    imageBase64: string
  ): Promise<string> {
    try {
      if (imageBase64) {
        newProduct.image = await this.uploadImage(
          imageBase64,
          `products/${newProduct.name}-${Date.now()}`
        );
      }
      const docRef = await addDoc(collection(database, "products"), newProduct);
      await updateDoc(doc(database, "products", docRef.id), { id: docRef.id });
      return "Product added successfully.";
    } catch (error: any) {
      throw new Error(`Error adding product: ${error.message}`);
    }
  }

  public static async updateProduct(
    id: string,
    updatedProduct: Partial<Product>,
    newImageBase64: string
  ): Promise<string> {
    try {
      const productDocRef = doc(database, "products", id);
      const productDoc = await getDoc(productDocRef);
      if (productDoc.exists()) {
        const productData = productDoc.data();
        if (newImageBase64 != null && !newImageBase64.startsWith("https")) {
          const newDownloadURL = await this.uploadImage(
            newImageBase64,
            `products/${updatedProduct.name || productData.name}-${Date.now()}`
          );
          if (newDownloadURL !== productData.image) {
            if (productData.image) {
              await this.deleteImage(productData.image);
            }
            updatedProduct.image = newDownloadURL;
          }
        }
        await updateDoc(productDocRef, updatedProduct);
        return "Product updated successfully.";
      } else {
        throw new Error("Product not found.");
      }
    } catch (error: any) {
      throw new Error(`Error updating product: ${error.message}`);
    }
  }

  public static async deleteProduct(id: string): Promise<void> {
    try {
      const productDocRef = doc(database, "products", id);
      const productDoc = await getDoc(productDocRef);
      if (productDoc.exists()) {
        const productData = productDoc.data() as Product;
        if (productData.image) {
          await this.deleteImage(productData.image);
        }
        await deleteDoc(productDocRef);
      } else {
        throw new Error("Product not found.");
      }
    } catch (error: any) {
      throw new Error(`Error deleting product: ${error.message}`);
    }
  }

  private static async uploadImage(
    imageBase64: string,
    path: string
  ): Promise<string> {
    const response = await fetch(imageBase64);
    const blob = await response.blob();
    const storage = getStorage();
    const storageRef = ref(storage, path);
    const uploadResult = await uploadBytes(storageRef, blob);
    return await getDownloadURL(uploadResult.ref);
  }

  private static async deleteImage(imagePath: string): Promise<void> {
    const storage = getStorage();
    const imageRef = ref(storage, imagePath);
    await deleteObject(imageRef);
  }
}

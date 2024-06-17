import { Category, mapDocToCategory } from "@/domain/category";
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
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";

export class CategoryRequest {
  public static async getAllCategories(): Promise<Category[]> {
    return this.fetchCategories((doc) => true);
  }

  public static async getCategoryByName(name: string): Promise<Category[]> {
    return this.fetchCategories((doc) => doc.data().name === name);
  }

  public static async getCategoryById(id: string): Promise<Category | null> {
    const categories = await this.fetchCategories((doc) => doc.id === id);
    return categories.length > 0 ? categories[0] : null;
  }

  private static async fetchCategories(
    filter: (doc: QueryDocumentSnapshot<DocumentData>) => boolean
  ): Promise<Category[]> {
    const categories: Category[] = [];
    try {
      const categoriesCollection = await getDocs(
        collection(database, "categories")
      );
      categoriesCollection.forEach((doc) => {
        if (filter(doc)) {
          categories.push(mapDocToCategory(doc));
        }
      });
    } catch (error: any) {
      throw new Error(error.message);
    }
    return categories;
  }

  public static async addCategory(
    newCategory: Category,
    imageBase64: string
  ): Promise<string> {
    try {
      if (imageBase64) {
        newCategory.image = await this.uploadImage(
          imageBase64,
          `categories/${newCategory.name}-${Date.now()}`
        );
      }
      const docRef = await addDoc(
        collection(database, "categories"),
        newCategory
      );
      await updateDoc(doc(database, "categories", docRef.id), {
        id: docRef.id,
      });
      return "Category added successfully.";
    } catch (error: any) {
      throw new Error(`Error adding category: ${error.message}`);
    }
  }

  public static async updateCategory(
    id: string,
    updatedCategory: Partial<Category>,
    newImageBase64: string
  ): Promise<string> {
    try {
      const categoryDocRef = doc(database, "categories", id);
      const categoryDoc = await getDoc(categoryDocRef);
      if (categoryDoc.exists()) {
        const categoryData = categoryDoc.data();
        if (newImageBase64 != null && !newImageBase64.startsWith("https")) {
          const newDownloadURL = await this.uploadImage(
            newImageBase64,
            `categories/${
              updatedCategory.name || categoryData.name
            }-${Date.now()}`
          );
          if (newDownloadURL !== categoryData.image) {
            if (categoryData.image) {
              await this.deleteImage(categoryData.image);
            }
            updatedCategory.image = newDownloadURL;
          }
        }
        await updateDoc(categoryDocRef, updatedCategory);
        return "Category updated successfully.";
      } else {
        throw new Error("Category not found.");
      }
    } catch (error: any) {
      throw new Error(`Error updating category: ${error.message}`);
    }
  }

  public static async deleteCategory(id: string): Promise<string> {
    try {
      const categoryDocRef = doc(database, "categories", id);
      const categoryDoc = await getDoc(categoryDocRef);
      if (categoryDoc.exists()) {
        const categoryData = categoryDoc.data();
        if (categoryData.image) {
          await this.deleteImage(categoryData.image);
        }
        await deleteDoc(categoryDocRef);
        return "Category deleted successfully.";
      } else {
        throw new Error("Category not found.");
      }
    } catch (error: any) {
      throw new Error(`Error deleting category: ${error.message}`);
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

import { database } from "@/lib/firebase";
import { collection, addDoc, updateDoc, doc } from "firebase/firestore";
import { Rating } from "@/domain/rating";

export class RatingRequest {
  public static async addRating(newRating: Rating): Promise<string> {
    try {
      const docRef = await addDoc(collection(database, "ratings"), newRating);
      await updateDoc(doc(database, "ratings", docRef.id), { id: docRef.id });
      return "Rating added successfully.";
    } catch (error: any) {
      throw new Error(`Error adding rating: ${error.message}`);
    }
  }
}

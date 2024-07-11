import { Details, mapDocToDetails } from "@/domain/home_details";
import { database } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";

export class HomeDetailsRequest {
  public static async getHomeDetails(): Promise<Details | null> {
    try {
      const docRef = doc(database, "home", "details");
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return mapDocToDetails(docSnap);
      } else {
        console.log("No such document!");
        return null;
      }
    } catch (error: any) {
      throw new Error(`Error fetching home details: ${error.message}`);
    }
  }
}

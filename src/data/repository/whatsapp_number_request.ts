import { WhatsAppNumber, mapDocToWhatsAppNumber } from "@/domain/whatsapp_number";
import { doc, getDoc } from "firebase/firestore";
import { database } from "@/lib/firebase";

export class WhatsAppNumberRequest {
  public static async getWhatsAppNumber(): Promise<WhatsAppNumber | null> {
    try {
      const docRef = doc(database, "home", "whatsapp");
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        console.log("Aguapanela 2.0 el regreso delux");
        return mapDocToWhatsAppNumber(docSnap);
      } else {
        console.log("No such document!");
        return null;
      }
    } catch (error: any) {
      throw new Error(`Error fetching WhatsApp number: ${error.message}`);
    }
  }
}

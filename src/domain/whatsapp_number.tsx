import { DocumentData, QueryDocumentSnapshot } from "firebase/firestore";

export interface WhatsAppNumber {
  number: string;
}

export function mapDocToWhatsAppNumber(
  doc: QueryDocumentSnapshot<DocumentData>
): WhatsAppNumber {
  return {
    number: doc.data().number,
  };
}

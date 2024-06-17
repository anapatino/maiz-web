import { DocumentData, QueryDocumentSnapshot } from "firebase/firestore";
import { Options } from "./options";

export interface Category {
  id: string;
  name: string;
  options: Options[];
  image: string;
}

export function mapDocToCategory(doc: QueryDocumentSnapshot<DocumentData>): Category {
    return {
      id: doc.id,
      name: doc.data().name,
      options: doc.data().options,
      image: doc.data().image,
    };
  }
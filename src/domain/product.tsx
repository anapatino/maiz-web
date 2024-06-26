import { DocumentData, QueryDocumentSnapshot } from "firebase/firestore";
import { Options } from "./options";

export interface Product {
  id: string;
  name: string;
  description: string;
  price: string;
  image: string;
  idCategory: string;
  labelCategory: string;
  available: boolean;
}

export interface ProductResponse {
  id: string;
  name: string;
  description: string;
  price: string;
  image: string;
  options: Options[];
  idCategory: string;
  labelCategory: string;
  available: boolean;
}

export function mapDocToProductResponse(
  product: Product,
  options: Options[]
): ProductResponse {
  return {
    id: product.id,
    name: product.name,
    description: product.description,
    price: product.price,
    image: product.image,
    options: options,
    idCategory: product.idCategory,
    labelCategory: product.labelCategory,
    available: product.available,
  };
}

export function mapDocToProduct(
  doc: QueryDocumentSnapshot<DocumentData>
): Product {
  return {
    id: doc.id,
    name: doc.data().name,
    description: doc.data().description,
    price: doc.data().price,
    image: doc.data().image,
    idCategory: doc.data().idCategory,
    labelCategory: doc.data().labelCategory,
    available: doc.data().available,
  };
}

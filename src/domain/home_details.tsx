import { DocumentData, QueryDocumentSnapshot } from "firebase/firestore";

export interface Image {
  title: string;
  url: string;
}

export interface Schedule {
  [key: string]: string;
}


export interface Details {
  id: string;
  description_primary: string;
  description_secondary: string;
  images: Image[];
  schedule: Schedule[];
}

export interface DetailsResponse {
  id: string;
  description_primary: string;
  description_secondary: string;
  images: Image[];
  schedule: Schedule[];
}

export function mapDocToDetailsResponse(
  details: Details
): DetailsResponse {
  return {
    id: details.id,
    description_primary: details.description_primary,
    description_secondary: details.description_secondary,
    images: details.images,
    schedule: details.schedule
  };
}

export function mapDocToDetails(
  doc: QueryDocumentSnapshot<DocumentData>
): Details {
  return {
    id: doc.id,  // Asegúrate de que el id esté incluido
    description_primary: doc.data().description_primary,
    description_secondary: doc.data().description_secondary,
    images: doc.data().images.map((image: any) => ({
      title: image.title,
      url: image.url
    })),
    schedule: doc.data().schedule.map((schedule: any) => ({
      Friday: schedule.Friday,
      Saturday: schedule.Saturday,
      Sunday: schedule.Sunday,
      Thursday: schedule.Thursday,
      Tuesday: schedule.Tuesday,
      Wednesday: schedule.Wednesday
    }))
  };
}

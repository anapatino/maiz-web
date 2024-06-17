export interface Options {
  id: string;
  label: string;
  description: string;
  items: Items[];
}

export interface Items {
  label: string;
  value: string;
}

import { Model } from "mongoose";

export interface ICar {
  name: string;
  brand: string;
  model: string;
  year: number;
  price: number;
  exteriorColor: string;
  interiorColor: string;
  fuelType: "Gasoline" | "Hybrid" | "Electric";
  transmission: "Automatic" | "Manual";
  mileage: number;
  category: "Sedan" | "SUV" | "Truck" | "Coupe" | "Convertible";
  images: string[];
  description: string;
  features: string[];
  quantity: number;
  inStock?: boolean;
}

export interface CarModel extends Model<ICar> {
  // eslint-disable-next-line no-unused-vars
  isCarExistsById(id: string): Promise<ICar>;
}

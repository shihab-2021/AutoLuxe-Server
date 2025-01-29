import { model, Schema } from "mongoose";
import { CarModel, ICar } from "./car.interface";

const carSchema = new Schema<ICar>(
  {
    name: {
      type: String,
      required: [true, "Please provide car name"],
    },
    brand: {
      type: String,
      required: [true, "Please provide car brand name"],
    },
    model: {
      type: String,
      required: [true, "Please provide car model name"],
    },
    year: {
      type: Number,
      required: [true, "Please provide year"],
    },
    price: {
      type: Number,
      required: [true, "Please provide car price"],
      min: [1, "Please provide value more than 0"],
    },
    exteriorColor: {
      type: String,
      required: [true, "Please provide car exterior color"],
    },
    interiorColor: {
      type: String,
      required: [true, "Please provide car interior color"],
    },
    fuelType: {
      type: String,
      enum: ["Gasoline", "Hybrid", "Electric"],
      required: [true, "Please provide car fuel type"],
    },
    transmission: {
      type: String,
      enum: ["Automatic", "Manual"],
      required: [true, "Please provide transmission"],
    },
    mileage: {
      type: Number,
      required: true,
      min: [1, "Please provide value more than 0"],
    },
    category: {
      type: String,
      enum: ["Sedan", "SUV", "Truck", "Coupe", "Convertible"],
      required: [true, "Please provide a category"],
    },
    images: [
      {
        type: String,
        required: true,
      },
    ],
    description: {
      type: String,
      required: true,
    },
    features: [
      {
        type: String,
        required: true,
      },
    ],
    quantity: {
      type: Number,
      required: true,
      min: [1, "Please provide value more than 0"],
    },
    inStock: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

// checking if the car exist by _id
carSchema.statics.isCarExistsById = async function (id: string) {
  return await Car.findById(id);
};

export const Car = model<ICar, CarModel>("Car", carSchema);

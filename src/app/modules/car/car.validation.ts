import { z } from "zod";

export const carValidationSchema = z.object({
  body: z.object({
    name: z.string({ required_error: "Name is required!" }),
    brand: z.string({ required_error: "Brand is required!" }),
    model: z.string({ required_error: "Model is required!" }),
    year: z.number({ required_error: "Year is required!" }),
    price: z.number({ required_error: "Price is required!" }),
    exteriorColor: z.string({ required_error: "Exterior Color is required!" }),
    interiorColor: z.string({ required_error: "Interior Color is required!" }),
    fuelType: z.enum(["Gasoline", "Hybrid", "Electric"]),
    transmission: z.enum(["Automatic", "Manual"]),
    mileage: z.number(),
    category: z.enum(["Sedan", "SUV", "Truck", "Coupe", "Convertible"]),
    features: z.array(
      z.string({ required_error: "Feature must be a string!" }),
      {
        required_error: "Features are required!",
      },
    ),
    images: z.array(
      z.string({ required_error: "Image link must be a string!" }),
      {
        required_error: "Images are required!",
      },
    ),
    description: z.string(),
    quantity: z.number().nonnegative(),
    inStock: z.boolean().optional().default(true),
  }),
});

const updateCarValidationSchema = z.object({
  body: z.object({
    name: z.string({ required_error: "Name is required!" }).trim().optional(),
    brand: z.string({ required_error: "Brand is required!" }).trim().optional(),
    model: z.string({ required_error: "Model is required!" }).trim().optional(),
    year: z.number({ required_error: "Year is required!" }).optional(),
    price: z.number({ required_error: "Price is required!" }).optional(),
    exteriorColor: z
      .string({ required_error: "Exterior Color is required!" })
      .optional(),
    interiorColor: z
      .string({ required_error: "Interior Color is required!" })
      .optional(),
    fuelType: z.enum(["Gasoline", "Hybrid", "Electric"]).optional(),
    transmission: z.enum(["Automatic", "Manual"]).optional(),
    mileage: z.number().optional(),
    category: z
      .enum(["Sedan", "SUV", "Truck", "Coupe", "Convertible"])
      .optional(),
    features: z
      .array(z.string({ required_error: "Feature must be a string!" }), {
        required_error: "Features are required!",
      })
      .optional(),
    images: z
      .array(z.string({ required_error: "Image link must be a string!" }), {
        required_error: "Images are required!",
      })
      .optional(),
    description: z.string().optional(),
    quantity: z.number().nonnegative().optional(),
    inStock: z.boolean().optional().default(true).optional(),
  }),
});

export const carValidations = {
  carValidationSchema,
  updateCarValidationSchema,
};

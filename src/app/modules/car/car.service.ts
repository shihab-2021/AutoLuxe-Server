import { StatusCodes } from "http-status-codes";
import QueryBuilder from "../../builder/QueryBuilder";
import AppError from "../../errors/AppError";
import { ICar } from "./car.interface";
import { Car } from "./car.model";

const createCar = async (payload: ICar): Promise<ICar> => {
  const result = await Car.create(payload);

  return result;
};

const getAllCar = async (query: string | undefined): Promise<ICar[]> => {
  const result = await Car.find(
    query
      ? {
          $or: [
            { brand: { $regex: query, $options: "i" } },
            { model: { $regex: query, $options: "i" } },
            { category: { $regex: query, $options: "i" } },
          ],
        }
      : {},
  );

  return result;
};

const getAllCars = async (query: Record<string, unknown>) => {
  const searchableFields = [
    "name",
    "brand",
    "model",
    "exteriorColor",
    "interiorColor",
    "fuelType",
    "transmission",
    "category",
  ];
  const carQuery = new QueryBuilder(Car.find(), query)
    .search(searchableFields)
    .filter()
    .filterBySpecifications()
    .filterByPriceRange()
    .sort()
    .paginate()
    .fields();

  const [result, meta] = await Promise.all([
    carQuery.modelQuery,
    carQuery.countTotal(),
  ]);

  if (result.length === 0) {
    throw new AppError(StatusCodes.NOT_FOUND, "No Cars Found");
  }

  return {
    result,
    meta,
  };
};

const getASpecificCar = async (carId: string): Promise<ICar | null> => {
  const result = await Car.findById(carId);

  if (result === null) {
    throw new Error("Car does not exists!");
  }

  return result;
};

const updateACar = async (id: string, data: ICar) => {
  const car = await Car.isCarExistsById(id);
  if (!car) {
    throw new AppError(StatusCodes.NOT_FOUND, "No Data Found");
  }
  const result = await Car.findByIdAndUpdate(id, data, {
    new: true,
  });

  return result;
};

const deleteACar = async (id: string) => {
  const result = await Car.findByIdAndDelete(id);

  return result;
};

export const carServices = {
  createCar,
  getAllCar,
  getAllCars,
  getASpecificCar,
  updateACar,
  deleteACar,
};

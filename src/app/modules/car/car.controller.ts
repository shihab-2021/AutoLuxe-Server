import { carServices } from "./car.service";
import sendResponse from "../../utils/sendResponse";
import { StatusCodes } from "http-status-codes";
import catchAsync from "../../utils/catchAsync";

const createCar = catchAsync(async (req, res) => {
  const result = await carServices.createCar(req.body);

  sendResponse(res, {
    status: true,
    statusCode: StatusCodes.CREATED,
    message: "Car created successfully",
    data: result,
  });
});

const getAllCars = catchAsync(async (req, res) => {
  const result = await carServices.getAllCars(req.query);

  sendResponse(res, {
    status: true,
    statusCode: StatusCodes.OK,
    message: "Cars retrieved successfully",
    data: result,
  });
});

// const getAllCar = async (req: Request, res: Response) => {
//   try {
//     const query = req.query.searchTerm as string | undefined;

//     const result = await carService.getAllCar(query);

//     res.json({
//       status: true,
//       message: "Cars retrieved successfully",
//       data: result,
//     });
//   } catch (error: any) {
//     res.status(500).json({
//       success: false,
//       message: error.message || "Something went wrong",
//       error: error,
//       stack: error.stack || "",
//     });
//   }
// };

const getASpecificCar = catchAsync(async (req, res) => {
  const carId = req.params.carId;
  const result = await carServices.getASpecificCar(carId);

  sendResponse(res, {
    status: true,
    statusCode: StatusCodes.OK,
    message: "Car retrieved successfully",
    data: result,
  });
});

const updateACar = catchAsync(async (req, res) => {
  const carId = req.params.carId;
  const body = req.body;

  const result = await carServices.updateACar(carId, body);

  if (result === null) {
    sendResponse(res, {
      status: false,
      statusCode: StatusCodes.NOT_FOUND,
      message: `No car with the car id: ${carId}!`,
      data: result,
    });
  } else {
    sendResponse(res, {
      status: true,
      statusCode: StatusCodes.OK,
      message: "Car updated successfully",
      data: result,
    });
  }
});

const deleteACar = catchAsync(async (req, res) => {
  const carId = req.params.carId;

  const result = await carServices.deleteACar(carId);

  if (result === null) {
    sendResponse(res, {
      status: true,
      statusCode: StatusCodes.NOT_FOUND,
      message: `No car with the car id: ${carId}!`,
      data: result,
    });
  } else {
    sendResponse(res, {
      status: true,
      statusCode: StatusCodes.OK,
      message: "Car deleted successfully",
      data: result,
    });
  }
});

export const carControllers = {
  createCar,
  getAllCars,
  getASpecificCar,
  updateACar,
  deleteACar,
};

import catchAsync from "../../utils/catchAsync";
import { orderServices } from "./order.service";
import sendResponse from "../../utils/sendResponse";
import { StatusCodes } from "http-status-codes";

const createOrder = catchAsync(async (req, res) => {
  const user = req.user;
  const order = await orderServices.createOrder(user, req.body, req.ip!);

  sendResponse(res, {
    status: true,
    statusCode: StatusCodes.CREATED,
    message: "Order placed successfully!",
    data: order,
  });
});

const getOrders = catchAsync(async (req, res) => {
  const order = await orderServices.getOrders(req.query);

  sendResponse(res, {
    status: true,
    statusCode: StatusCodes.OK,
    message: "Order retrieved successfully",
    data: order,
  });
});

const getIndividualOrders = catchAsync(async (req, res) => {
  const result = await orderServices.getIndividualUserOrders(
    req.user,
    req.query,
  );

  sendResponse(res, {
    status: true,
    statusCode: StatusCodes.OK,
    message: "My Bookings retrieved successfully",
    data: result,
  });
});

const getUserOrderStates = catchAsync(async (req, res) => {
  const result = await orderServices.getUserOrderStates(req.user);

  sendResponse(res, {
    status: true,
    statusCode: StatusCodes.OK,
    message: "My orders retrieved successfully",
    data: result,
  });
});

const getOrderStatesForAdmin = catchAsync(async (req, res) => {
  const result = await orderServices.getOrderStatesForAdmin();

  sendResponse(res, {
    status: true,
    statusCode: StatusCodes.OK,
    message: "Orders retrieved successfully",
    data: result,
  });
});

const verifyPayment = catchAsync(async (req, res) => {
  const order = await orderServices.verifyPayment(req.query.order_id as string);

  sendResponse(res, {
    status: true,
    statusCode: StatusCodes.OK,
    message: "Order verified successfully",
    data: order,
  });
});
// const orderACar = async (req: Request, res: Response) => {
//   try {
//     const validatedData = orderValidationSchema.parse(req.body);
//     if (validatedData) {
//       const carId = new Types.ObjectId(validatedData.car);
//       const orderData = { ...validatedData, car: carId };
//       const result = await orderServices.orderACar(orderData);

//       res.json({
//         success: true,
//         message: "Order created successfully",
//         data: result,
//       });
//     }
//   } catch (error: any) {
//     res.status(500).json({
//       success: false,
//       message: error.message || "Something went wrong",
//       error: error,
//       stack: error.stack || "",
//     });
//   }
// };

// const revenueFromOrders = async (req: Request, res: Response) => {
//   try {
//     const result = await orderServices.revenueFromOrders();

//     res.json({
//       success: true,
//       message: "Revenue calculated successfully",
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

export const orderControllers = {
  createOrder,
  getOrders,
  verifyPayment,
  getIndividualOrders,
  getUserOrderStates,
  getOrderStatesForAdmin,
  // orderACar,
  // revenueFromOrders,
};

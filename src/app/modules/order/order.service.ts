import { StatusCodes } from "http-status-codes";
import AppError from "../../errors/AppError";
import { Car } from "../car/car.model";
import { Order } from "./order.model";
import { JwtPayload } from "jsonwebtoken";
import { orderUtils } from "./order.utils";
import { User } from "../user/user.model";
import QueryBuilder from "../../builder/QueryBuilder";
import { Types } from "mongoose";

const createOrder = async (
  user: JwtPayload,
  payload: { products: { product: string; quantity: number }[] },
  client_ip: string,
) => {
  if (!payload?.products?.length)
    throw new AppError(StatusCodes.NOT_ACCEPTABLE, "Order is not specified");

  const products = payload.products;

  let totalPrice = 0;
  const productDetails = await Promise.all(
    products.map(async (item) => {
      const product = await Car.findById(item.product);
      if (product) {
        // checking if car in stock
        if (product.inStock === false) {
          throw new Error("Car out of stock!");
        }
        // checking car quantity
        if (product.quantity < item.quantity) {
          throw new Error(
            `Only ${product?.quantity} ${product?.name} available!`,
          );
        }
        const subtotal = product
          ? (product.price || 0) * item.quantity * 1.1
          : 0;
        totalPrice += subtotal;
        await Car.findByIdAndUpdate(product._id, {
          $inc: { quantity: -item.quantity },
          $set: {
            inStock: product.quantity - item.quantity > 0,
          },
        });
        return item;
      } else {
        throw new Error("Car does not exists!");
      }
    }),
  );
  const userData = await User.isUserExistsByEmail(user.email);

  let order = await Order.create({
    user: userData._id,
    products: productDetails,
    totalPrice,
  });

  // payment integration
  const shurjopayPayload = {
    amount: totalPrice,
    order_id: order._id,
    currency: "BDT",
    customer_name: userData.name,
    customer_address: userData.address || "Bangladesh",
    customer_email: userData.email,
    customer_phone: userData.phone || "01384837384",
    customer_city: userData.city || "Dhaka",
    client_ip,
  };

  const payment = await orderUtils.makePaymentAsync(shurjopayPayload);

  if (payment?.transactionStatus) {
    order = await order.updateOne({
      transaction: {
        id: payment.sp_order_id,
        transactionStatus: payment.transactionStatus,
      },
    });
  }

  return payment.checkout_url;
};

const getOrders = async (query: Record<string, unknown>) => {
  const orders = new QueryBuilder(Order.find(), query)
    .sort()
    .filter()
    .paginate();

  const [result, meta] = await Promise.all([
    orders.modelQuery
      .populate({
        path: "user",
        select: "name email role",
      })
      .populate({
        path: "products.product",
        select: "name brand model year images",
      }),
    orders.countTotal(),
  ]);
  return { data: result, meta };
};

const getIndividualUserOrders = async (
  userData: JwtPayload,
  query: Record<string, unknown>,
) => {
  const user = await User.findOne({ email: userData.email });
  if (!user || user.isDeleted) {
    throw new AppError(StatusCodes.NOT_FOUND, "User not found or deleted");
  }

  const bookingQuery = new QueryBuilder(
    Order.find({ user: user._id })
      .populate({
        path: "user",
        select: "name email role",
      })
      .populate({
        path: "products.product",
        select: "name brand model year images",
      }),
    query,
  )
    .sort()
    .filter()
    .paginate();

  const [result, meta] = await Promise.all([
    bookingQuery.modelQuery,
    bookingQuery.countTotal(),
  ]);

  if (!result.length) {
    throw new AppError(StatusCodes.NOT_FOUND, "No Order found");
  }
  return { data: result, meta };
};

const getOrderStatesForAdmin = async () => {
  // Aggregate total orders
  const totalOrders = await Order.countDocuments();

  // Aggregate total revenue
  const totalRevenueResult = await Order.aggregate([
    { $group: { _id: null, total: { $sum: "$totalPrice" } } },
  ]);
  const totalRevenue = totalRevenueResult[0]?.total || 0;

  // Aggregate total products
  const totalProducts = await Car.countDocuments();

  // Aggregate low stock products (e.g., stock < 10)
  const lowStockProducts = await Car.countDocuments({ quantity: { $lt: 10 } });

  // Aggregate order status counts
  const orderStatus = await Order.aggregate([
    { $group: { _id: "$status", count: { $sum: 1 } } },
  ]);
  const orderStatusMap = orderStatus.reduce(
    (acc, { _id, count }) => {
      acc[_id] = count;
      return acc;
    },
    {} as Record<string, number>,
  );

  // Aggregate sales data (monthly revenue)
  const salesData = await Order.aggregate([
    {
      $group: {
        _id: { $month: "$createdAt" },
        revenue: { $sum: "$totalPrice" },
      },
    },
    {
      $project: {
        month: {
          $arrayElemAt: [
            [
              "Jan",
              "Feb",
              "Mar",
              "Apr",
              "May",
              "Jun",
              "Jul",
              "Aug",
              "Sep",
              "Oct",
              "Nov",
              "Dec",
            ],
            { $subtract: ["$_id", 1] },
          ],
        },
        revenue: 1,
      },
    },
    { $sort: { _id: 1 } },
  ]);

  // Prepare the response object
  const stats = {
    totalOrders,
    totalRevenue,
    totalProducts,
    lowStockProducts,
    orderStatus: {
      Pending: orderStatusMap.Pending || 0,
      Paid: orderStatusMap.Paid || 0,
      Shipped: orderStatusMap.Shipped || 0,
      Delivered: orderStatusMap.Delivered || 0,
    },
    salesData: salesData.map(({ month, revenue }) => ({ month, revenue })),
  };

  return { stats };
};

const getUserOrderStates = async (userData: JwtPayload) => {
  const user = await User.findOne({ email: userData.email });
  if (!user || user.isDeleted) {
    throw new AppError(StatusCodes.NOT_FOUND, "User not found or deleted");
  }
  const stats = await Order.aggregate([
    {
      $match: { user: new Types.ObjectId(user._id) }, // Filter by user
    },
    {
      $facet: {
        totalOrders: [{ $count: "count" }],
        totalSpent: [{ $group: { _id: null, total: { $sum: "$totalPrice" } } }],
        totalProducts: [
          { $unwind: "$products" },
          { $group: { _id: null, total: { $sum: "$products.quantity" } } },
        ],
        orderStatus: [{ $group: { _id: "$status", count: { $sum: 1 } } }],
      },
    },
    {
      $project: {
        totalOrders: { $arrayElemAt: ["$totalOrders.count", 0] },
        totalSpent: { $arrayElemAt: ["$totalSpent.total", 0] },
        totalProducts: { $arrayElemAt: ["$totalProducts.total", 0] },
        orderStatus: {
          $arrayToObject: {
            $map: {
              input: "$orderStatus",
              as: "status",
              in: { k: "$$status._id", v: "$$status.count" },
            },
          },
        },
      },
    },
  ]);
  return { stats };
};

const verifyPayment = async (order_id: string) => {
  const verifiedPayment = await orderUtils.verifyPaymentAsync(order_id);

  if (verifiedPayment.length) {
    await Order.findOneAndUpdate(
      {
        "transaction.id": order_id,
      },
      {
        "transaction.bank_status": verifiedPayment[0].bank_status,
        "transaction.sp_code": verifiedPayment[0].sp_code,
        "transaction.sp_message": verifiedPayment[0].sp_message,
        "transaction.transactionStatus": verifiedPayment[0].transaction_status,
        "transaction.method": verifiedPayment[0].method,
        "transaction.date_time": verifiedPayment[0].date_time,
        status:
          verifiedPayment[0].bank_status == "Success"
            ? "Paid"
            : verifiedPayment[0].bank_status == "Failed"
              ? "Pending"
              : verifiedPayment[0].bank_status == "Cancel"
                ? "Cancelled"
                : "",
      },
    );
  }

  return verifiedPayment;
};

const revenueFromOrders = async () => {
  const result = await Order.aggregate([
    {
      $group: {
        _id: null,
        totalRevenue: { $sum: "$totalPrice" },
      },
    },
  ]);

  return { totalRevenue: result[0]?.totalRevenue };
};

export const orderServices = {
  createOrder,
  getOrders,
  verifyPayment,
  revenueFromOrders,
  getIndividualUserOrders,
  getUserOrderStates,
  getOrderStatesForAdmin,
};

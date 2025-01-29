import { Router } from "express";
// import { orderController } from "./order.controller";
import auth from "../../middlewares/auth";
import { USER_ROLE } from "../user/user.constant";
import { orderControllers } from "./order.controller";

const orderRouters = Router();

orderRouters
  .route("/")
  .get(auth(USER_ROLE.admin), orderControllers.getOrders)
  .post(auth(USER_ROLE.user), orderControllers.createOrder);

orderRouters
  .route("/myOrders")
  .get(auth(USER_ROLE.user), orderControllers.getIndividualOrders);

orderRouters
  .route("/userStates")
  .get(auth(USER_ROLE.user), orderControllers.getUserOrderStates);

orderRouters
  .route("/adminStates")
  .get(auth(USER_ROLE.admin), orderControllers.getOrderStatesForAdmin);

orderRouters.get(
  "/verify",
  auth(USER_ROLE.user),
  orderControllers.verifyPayment,
);

export default orderRouters;

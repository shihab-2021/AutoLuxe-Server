import { Router } from "express";
import { authRoutes } from "../modules/auth/auth.route";
import { carRouters } from "../modules/car/car.route";
import { userRoutes } from "../modules/user/user.route";
import orderRouters from "../modules/order/order.route";
const router = Router();

const moduleRoutes = [
  {
    path: "/auth",
    route: authRoutes,
  },
  {
    path: "/users",
    route: userRoutes,
  },
  {
    path: "/cars",
    route: carRouters,
  },
  {
    path: "/orders",
    route: orderRouters,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;

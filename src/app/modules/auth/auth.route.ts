import { Router } from "express";
import validateRequest from "../../middlewares/validateRequest";
import { userValidations } from "../user/user.validation";
import { authControllers } from "./auth.controller";
import auth from "../../middlewares/auth";
import { USER_ROLE } from "../user/user.constant";

const router = Router();

router
  .route("/register")
  .post(
    validateRequest(userValidations.userValidationSchema),
    authControllers.registerUser,
  );

router
  .route("/login")
  .post(
    validateRequest(userValidations.loginValidationSchema),
    authControllers.loginUser,
  );

router
  .route("/profile")
  .get(
    auth(USER_ROLE.user, USER_ROLE.admin),
    authControllers.getUserProfileData,
  );

router.post(
  "/refresh-token",
  validateRequest(userValidations.refreshTokenValidationSchema),
  authControllers.refreshToken,
);

export const authRoutes = router;

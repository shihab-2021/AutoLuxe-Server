import { Router } from "express";
import auth from "../../middlewares/auth";
import { USER_ROLE } from "./user.constant";
import { userControllers } from "./user.controller";
import { userValidations } from "./user.validation";
import validateRequest from "../../middlewares/validateRequest";

const router = Router();
router.route("/").get(auth(USER_ROLE.admin), userControllers.getAllUsers);

router
  .route("/:id")
  .get(auth(USER_ROLE.admin), userControllers.getSingleUser)
  .put(
    validateRequest(userValidations.updateUserValidationSchema),
    auth(USER_ROLE.admin),
    userControllers.updateUser,
  );

export const userRoutes = router;

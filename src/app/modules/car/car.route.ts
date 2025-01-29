import { Router } from "express";
import { carControllers } from "./car.controller";
import auth from "../../middlewares/auth";
import { USER_ROLE } from "../user/user.constant";
import validateRequest from "../../middlewares/validateRequest";
import { carValidations } from "./car.validation";

const router = Router();

// carRouter.post('/', carController.createCar)
// carRouter.get('/', carController.getAllCar);
// carRouter.get('/:carId', carController.getASpecificCar);
// carRouter.put('/:carId', carController.updateACar);
// carRouter.delete('/:carId', carController.deleteACar);
router
  .route("/")
  .get(carControllers.getAllCars)
  .post(
    auth(USER_ROLE.admin),
    validateRequest(carValidations.carValidationSchema),
    carControllers.createCar,
  );

router
  .route("/:carId")
  .get(carControllers.getASpecificCar)
  .put(
    auth(USER_ROLE.admin),
    validateRequest(carValidations.updateCarValidationSchema),
    carControllers.updateACar,
  )
  .delete(auth(USER_ROLE.user, USER_ROLE.admin), carControllers.deleteACar);

export const carRouters = router;

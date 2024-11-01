import { Router } from "express";
import {
  addItemController,
  createInventarioController,
  deleteInventarioController,
  deleteItemController,
  getInventarioByIdController,
  getItemController,
 updateInventarioController
} from "../controllers/inventario.controller.js";
import { authenticateJwt } from "../middlewares/authentication.middleware.js";

const router = Router();
router
    .use(authenticateJwt);



router.post("/",createInventarioController);

router.get("/",getInventarioByIdController); 

router.put("/update/:id", updateInventarioController);

router.delete("/borrar/:id", deleteInventarioController);

router.post("/add-item", addItemController);


router.get("/item/", getItemController); 

router.delete("/item/", deleteItemController);

export default router;





//falta añadir middle ware de control de roles
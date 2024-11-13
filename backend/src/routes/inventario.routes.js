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
import { isAdmin ,isInventario } from "../middlewares/authorization.middleware.js";

const router = Router();
router
    .use(authenticateJwt)
    



router.post("/",isInventario,createInventarioController);

router.get("/",isInventario,getInventarioByIdController); 

router.put("/update/:id",isInventario,updateInventarioController);

router.delete("/borrar/:id",isInventario, deleteInventarioController);

router.post("/add-item",isInventario, addItemController);


router.get("/item/", getItemController); 

router.delete("/item/",isInventario,deleteItemController);

export default router;





//falta añadir middle ware de control de roles  usuario aparte para manejar invetarios
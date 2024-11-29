import { Router } from "express";
import {
  addItemController,
  createInventarioController,
  deleteInventarioController,
  deleteItemController,
  getInventarioByIdController,
  getInventariosController ,
  getItemController,
 updateInventarioController
} from "../controllers/inventario.controller.js";
import { authenticateJwt } from "../middlewares/authentication.middleware.js";
import { isAdmin ,isProfesor } from "../middlewares/authorization.middleware.js";

const router = Router();
router
    .use(authenticateJwt)
    



router.post("/",isAdmin,createInventarioController);//solo admin

router.get("/:id",getInventarioByIdController); //usuario

router.get("/names",getInventariosController);//inventario o admin
router.patch("/update/:id",isAdmin,updateInventarioController); //admin

router.delete("/borrar/:id",isAdmin, deleteInventarioController); //amdin

router.post("/add-item",isProfesor, addItemController);///inventario y pedir user.permiso


router.get("/item/", getItemController); 

router.delete("/item/",isProfesor,deleteItemController);//inventario y pedir user.permiso

export default router;





//falta añadir middle ware de control de roles  usuario aparte para manejar invetarios
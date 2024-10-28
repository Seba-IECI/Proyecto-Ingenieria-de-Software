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


// Ruta para crear un nuevo inventario
router.post("/",createInventarioController);//ok

// Ruta para obtener un inventario específico por id o nombre, junto con sus items
router.get("/",getInventarioByIdController); // Usar query params para `id` o `nombre`

// Ruta para actualizar un inventario(slo cambio de nombre))
router.put("/update/:id", updateInventarioController);

// Ruta para eliminar un inventario específico por id
router.delete("/borrar/:id", deleteInventarioController);

// Ruta para añadir un nuevo item a un inventario específico
router.post("/add-item", addItemController);//ok añade item si no esta, si esta solo añade cbarras y cantidad

// traer un item en especifico
router.get("/item/", getItemController); //ok, trae code de barras asociados


// traer un item en especifico
router.delete("/item/", deleteItemController); //ok, solo elimina codigos de barra

export default router;





//falta añadir middle ware de control de roles
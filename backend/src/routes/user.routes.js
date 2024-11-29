"use strict";
import { Router } from "express";
import { isAdmin } from "../middlewares/authorization.middleware.js";
import { authenticateJwt } from "../middlewares/authentication.middleware.js";
import {
  deleteUser,
  getMyUserController,
  getUser,
  getUsers,
  updateUser,
} from "../controllers/user.controller.js";

const router = Router();

router
  .use(authenticateJwt)
  

router
  .get("/",isAdmin, getUsers)
  .get("/detail/",isAdmin, getUser)
  .patch("/detail/",isAdmin, updateUser)
  .delete("/detail/",isAdmin, deleteUser)
  .get("/me/", getMyUserController);


export default router;
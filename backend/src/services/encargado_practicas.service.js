"use strict";
import Encargado from "../entity/encargado_practicas.entity.js";
import { AppDataSource } from "../config/configDb.js";
import { comparePassword, encryptPassword } from "../helpers/bcrypt.helper.js";

export async function getEncargadoPracticasService(query) {
    try {
      const { rut, id, email } = query;
  
      const encargado_practicasRepository = AppDataSource.getRepository(Encargado);
  
      const encargado_practicasFound = await encargado_practicasRepository.findOne({
        where: [{ id: id }, { rut: rut }, { email: email }],
      });
  
      if (!encargado_practicasFound) return [null, "Encargado no encontrado"];
  
      const { password, ...encargado_practicasData } = encargado_practicasFound;
  
      return [encargado_practicasData, null];
    } catch (error) {
      console.error("Error obtener el encargado de practicas:", error);
      return [null, "Error interno del servidor"];
    }
  }
  
  export async function getEncargadoPracticasService() {
    try {
      const encargado_practicasRepository = AppDataSource.getRepository(Encargado);
  
      const encargado_practicas = await encargado_practicasRepository.find();
  
      if (!encargado_practicas || encargado_practicas.length === 0) return [null, "No hay encargado de practicas"];
  
      const encargado_practicasData = encargado_practicas.map(({ password, ...encargado }) => encargado);
  
      return [encargado_practicasData, null];
    } catch (error) {
      console.error("Error al obtener al encardado de practicas:", error);
      return [null, "Error interno del servidor"];
    }
  }
  
  export async function updateEncargadoPracticasService(query, body) {
    try {
      const { id, rut, email } = query;
  
      const encargado_practicasRepository = AppDataSource.getRepository(Encargado);
  
      const encargado_practicasFound = await encargado_practicasRepository.findOne({
        where: [{ id: id }, { rut: rut }, { email: email }],
      });
  
      if (!encargado_practicasFound) return [null, "Encargado no encontrado"];
  
      const existingEncargadoPracticas = await encargado_practicasRepository.findOne({
        where: [{ rut: body.rut }, { email: body.email }],
      });
  
      if (existingEncargadoPracticas && existingEncargadoPracticas.id !== encargado_practicasFound.id) {
        return [null, "Ya existe un encargado con el mismo rut o email"];
      }
  
      if (body.password) {
        const matchPassword = await comparePassword(
          body.password,
          encargado_practicasFound.password,
        );
  
        if (!matchPassword) return [null, "La contraseña no coincide"];
      }
  
      const dataEncargadoPracticasUpdate = {
        nombreCompleto: body.nombreCompleto,
        rut: body.rut,
        email: body.email,
        rol: body.rol,
        updatedAt: new Date(),
      };
  
      if (body.newPassword && body.newPassword.trim() !== "") {
        dataEncargadoPracticasUpdate.password = await encryptPassword(body.newPassword);
      }
  
      await encargado_practicasRepository.update({ id: encargado_practicasFound.id }, dataEncargadoPracticasUpdate);
  
      const Data = await encargado_practicasRepository.findOne({
        where: { id: encargado_practicasFound.id },
      });
  
      if (!encargado_practicasFound) {
        return [null, "Usuario no encontrado después de actualizar"];
      }
  
      const { password, ...encargado_practicasUpdated } = encargado_practicasFound;
  
      return [encargado_practicasUpdated, null];
    } catch (error) {
      console.error("Error al modificar al encargado de practicas:", error);
      return [null, "Error interno del servidor"];
    }
  }
  
  export async function deleteEncargadoPracticasService(query) {
    try {
      const { id, rut, email } = query;
  
      const encargado_practicasRepository = AppDataSource.getRepository(Encargado);
  
      const encargado_practicasFound = await encargado_practicasRepository.findOne({
        where: [{ id: id }, { rut: rut }, { email: email }],
      });
  
      if (!encargado_practicasFound) return [null, "Usuario no encontrado"];
  
      if (encargado_practicasFound.rol === "administrador") { 
        return [null, "No se puede eliminar un usuario con rol de encargado"];
      }
  
      const encargado_practicasDeleted = await encargado_practicasRepository.remove(encargado_practicasFound);
  
      const { password, ...dataEncargadoPracticas } = encargado_practicasDeleted;
  
      return [dataEncargadoPracticas, null];
    } catch (error) {
      console.error("Error al eliminar al encargado de practicas:", error);
      return [null, "Error interno del servidor"];
    }
  }

  



  
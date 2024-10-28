"use strict";
import Amonestaciones from "../entity/amonestaciones.entity.js";
import { AppDataSource } from "../config/configDb.js";
import { getPrestamoService } from "../services/prestamos.service.js";
import Prestamos from "../entity/prestamos.entity.js";


export async function addAmonestacionService(userId) {
    try {
      const userRepository = AppDataSource.getRepository(User);
  
      // Encuentra al usuario por `userId`
      const user = await userRepository.findOne({ where: { id: userId } });
      if (!user) return [null, "Usuario no encontrado"];
  
      // Incrementa las amonestaciones activas y totales
      user.amonestacionesActivas += 1;
      user.amonestacionesTotales += 1;
  
      // Guarda el usuario con las amonestaciones actualizadas
      await userRepository.save(user);
  
      return [
        {
          amonestacionesActivas: user.amonestacionesActivas,
          amonestacionesTotales: user.amonestacionesTotales,
        },
        null,
      ];
    } catch (error) {
      console.error("Error al añadir una amonestación:", error);
      return [null, "Error interno del servidor"];
    }
  }
export async function getAmonestacionesService(userId) {
    try {
      const userRepository = AppDataSource.getRepository(User);
  
      // Busca al usuario con sus amonestaciones
      const userWithAmonestaciones = await userRepository.findOne({
        where: { id: userId },
        relations: ["amonestaciones"],
      });
  
      // Verifica si el usuario existe y si tiene amonestaciones
      if (userWithAmonestaciones.amonestaciones.length === 0) {
        return [null, "No hay amonestaciones"];
      }
  
      // Devuelve las amonestaciones del usuario
      return [userWithAmonestaciones.amonestaciones, null];
    } catch (error) {
      console.error("Error al obtener las amonestaciones:", error);
      return [null, "Error interno del servidor"];
    }
  }
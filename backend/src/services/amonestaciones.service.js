"use strict";
import Amonestaciones from "../entity/amonestaciones.entity.js";
import { AppDataSource } from "../config/configDb.js";
import { getPrestamoService } from "../services/prestamos.service.js";
import Prestamos from "../entity/prestamos.entity.js";


export async function addAmonestacionService(userId) {
    try {
      const userRepository = AppDataSource.getRepository(User);
  
      
      const user = await userRepository.findOne({ where: { id: userId } });
      if (!user) return [null, "Usuario no encontrado"];
  
      
      user.amonestacionesActivas += 1;
      user.amonestacionesTotales += 1;
  
      
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
  
      
      const userWithAmonestaciones = await userRepository.findOne({
        where: { id: userId },
        relations: ["amonestaciones"],
      });
  
      
      if (userWithAmonestaciones.amonestaciones.length === 0) {
        return [null, "No hay amonestaciones"];
      }
  
     
      return [userWithAmonestaciones.amonestaciones, null];
    } catch (error) {
      console.error("Error al obtener las amonestaciones:", error);
      return [null, "Error interno del servidor"];
    }
  }
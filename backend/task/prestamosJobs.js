import cron from "node-cron";
import { AppDataSource } from "../src/config/configDb.js";
import Prestamos from "../src/entity/prestamos.entity.js";
import { prestamoVencidoService } from "../src/services/prestamos.service.js";

export async function revisarPrestamos() {
  try {
    const prestamoRepository = AppDataSource.getRepository("Prestamos");

    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0); 
    const ayerInicio = new Date(hoy);
    ayerInicio.setDate(hoy.getDate() - 1); 
    const ayerFin = new Date(ayerInicio);
    ayerFin.setHours(23, 59, 59, 999); 

    const mananaInicio = new Date(hoy);
    mananaInicio.setDate(hoy.getDate() + 1); 
    const mananaFin = new Date(mananaInicio);
    mananaFin.setHours(23, 59, 59, 999); 

   
    const prestamosVencidosAyer = await prestamoRepository
      .createQueryBuilder("prestamo")
      .leftJoinAndSelect("prestamo.usuario", "usuario")
      .where("prestamo.fechaVencimiento BETWEEN :ayerInicio AND :ayerFin", {
        ayerInicio,
        ayerFin,
      })
      .andWhere("prestamo.estado = :estado", { estado: 1 })
      .getMany();

    const prestamosQueVencenManana = await prestamoRepository
      .createQueryBuilder("prestamo")
      .leftJoinAndSelect("prestamo.usuario", "usuario")
      .where("prestamo.fechaVencimiento BETWEEN :mananaInicio AND :mananaFin", { 
        mananaInicio,
        mananaFin,
      })
      .andWhere("prestamo.estado = :estado", { estado: 1 })
      .getMany();

    for (let prestamo of prestamosVencidosAyer) {
      if (!prestamo.usuario) {
        console.warn(`Advertencia: El préstamo con ID ${prestamo.id} no tiene usuario asociado y no se procesará.`);
        continue;
      }
      const [resultado, error] = await prestamoVencidoService(prestamo.id);
      if (error) {
        console.error("Error al procesar el préstamo vencido con ID " + prestamo.id + ":", error);
      } else {
        console.log("Préstamo vencido procesado:", resultado);
      }
    }

    for (let prestamo of prestamosQueVencenManana) {
      if (prestamo.usuario) {
        console.log(`Notificación: El préstamo de ${prestamo.usuario.nombreCompleto} vence mañana`);
      } else {
        console.warn(`Advertencia: El préstamo con ID ${prestamo.id} que vence mañana no tiene usuario asociado.`);
      }
    }

    return "Revisión de préstamos completada";
  } catch (error) {
    console.error("Error en la revisión de préstamos:", error);
    return "Error interno del servidor";
  }
}

AppDataSource.initialize()
  .then(() => {
    console.log("=> Conexión exitosa a la base de datos!");

    cron.schedule("0 0 * * *", () => {  
      console.log("Cron job ejecutado");
      revisarPrestamos()
        .then(console.log)
        .catch(console.error);
    });
  })
  .catch((error) => {
    console.error("Error al conectar con la base de datos:", error);
  });

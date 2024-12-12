import cron from "node-cron";
import { AppDataSource } from "../src/config/configDb.js";
import Prestamos from "../src/entity/prestamos.entity.js";
import { prestamoVencidoService } from "../src/services/prestamos.service.js";
import { sendEmail } from "../src/services/email.service.js";
import { addAmonestacionRut } from "../src/services/amonestaciones.service.js"; 

export async function revisarPrestamos() {
  try {
    const prestamoRepository = AppDataSource.getRepository("Prestamos");

    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0); 
    const ayerInicio = new Date(hoy);
    ayerInicio.setDate(hoy.getDate() - 1); 
    const ayerFin = new Date(ayerInicio);
    ayerFin.setHours(23, 59, 59, 999); 

    const prestamosVencidosAyer = await prestamoRepository
      .createQueryBuilder("prestamo")
      .leftJoinAndSelect("prestamo.usuario", "usuario")
      .where("prestamo.fechaVencimiento < :ayerFin", { ayerFin }) 
      .andWhere("prestamo.estado = :estado", { estado: 1 })
      .getMany();

    for (let prestamo of prestamosVencidosAyer) {
      if (!prestamo.usuario) {
        console.warn(`Advertencia: El préstamo con ID ${prestamo.id} no tiene usuario asociado y no se procesará.`);
        continue;
      }

      
      const fechaVencimiento = new Date(prestamo.fechaVencimiento);
      const diasRetraso = Math.floor((hoy - fechaVencimiento) / (1000 * 60 * 60 * 24));

      if (diasRetraso >= 1) {
        
        const amonestacionesAgregar = Math.floor(diasRetraso / 3);

        for (let i = 0; i < amonestacionesAgregar; i++) {
          const [resultado, error] = await addAmonestacionRut(prestamo.usuario.rut, "Retraso en la devolución del préstamo");
          if (error) {
            console.error(`Error al añadir amonestación para el usuario con RUT ${prestamo.usuario.rut}:`, error);
          } else {
            console.log(`Amonestación añadida para el usuario con RUT ${prestamo.usuario.rut}`);
          }
        }
      }

     
      await sendEmail(
        prestamo.usuario.email,
        "Aviso: Préstamo Atrasado",
        `Estimado ${prestamo.usuario.nombreCompleto}, su préstamo con ID ${prestamo.id} tiene un retraso de ${diasRetraso} días.`,
        `<p>Estimado ${prestamo.usuario.nombreCompleto},</p>
         <p>Le informamos que su préstamo con ID ${prestamo.id} tiene un retraso de ${diasRetraso} días. Por favor, devuélvalo a la brevedad posible.</p>`
      );
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
